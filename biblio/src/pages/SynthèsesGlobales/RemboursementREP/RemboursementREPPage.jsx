import useAppStore from "../../../store/useAppStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { CreditCard, Printer, Download } from "lucide-react";
import repRemboursementService from "../../../api/services/repRemboursementService";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import { calculateRecouvrement, exportToCSV } from "../../../utils/helpers";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import RembGlobalePdf from "../../../components/pdfs/syntheses/RembGlobalePdf";
import { schoolYearFormat } from "../../../lib/utilities";

const fetchAllPaginated = async (serviceGetAll, params = {}) => {
    const first = await serviceGetAll({ ...params, page: 1 });
    const firstData = Array.isArray(first) ? first : first?.data || [];
    const meta = first?.meta;
    if (!meta?.last_page) return firstData;

    const lastPage = meta.last_page;
    const pages = [];
    for (let page = 2; page <= lastPage; page += 1) {
        pages.push(serviceGetAll({ ...params, page }));
    }
    const rest = await Promise.all(pages);
    const restData = rest.flatMap((r) => Array.isArray(r) ? r : r?.data || []);
    return [...firstData, ...restData];
};

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const pickStatus = (ops = []) => {
    if (ops.some((o) => !!o.statut_rejete)) return "Rejeté";
    if (ops.some((o) => !!o.statut_accepte)) return "Accepté";
    if (ops.some((o) => !!o.statut_recu)) return "Reçu";
    return "En cours";
};

const pickMainMode = (ops = []) => {
    const counts = new Map();
    for (const o of ops) {
        const k = o.type_versement || "—";
        counts.set(k, (counts.get(k) || 0) + 1);
    }
    let best = "—";
    let bestCount = 0;
    for (const [k, c] of counts) {
        if (c > bestCount) {
            best = k;
            bestCount = c;
        }
    }
    return bestCount > 0 ? best : "—";
};

const RemboursementREPPage = () => {
    const { activeSeason } = useAppStore();
    const selectedSeasonId = activeSeason?.label || "";
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ total: 0, reps: 0, operations: 0, credit: 0, avance: 0, reste: 0, recouvrement: 0 });
    const [isLoading, setIsLoading] = useState(true);
            const [pdfOpen, setPdfOpen] = useState(false);
    const printRef = useRef(null);

    
    
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (selectedSeasonId && selectedSeasonId !== "all") {
                params.annee = selectedSeasonId;
            }
            const [ops, blItems] = await Promise.all([
                fetchAllPaginated(repRemboursementService.getAll, params),
                fetchAllPaginated(bLivraisonItemService.getAll, params),
            ]);

            const credit = blItems.reduce((sum, it) => {
                const unit = toNumber(it.livre?.prix_vente ?? it.livre?.prix_public ?? 0);
                return sum + unit * toNumber(it.quantite);
            }, 0);

            const avance = ops.reduce((sum, o) => sum + toNumber(o.montant), 0);
            const reste = credit - avance;
            const recouvrement = calculateRecouvrement(avance, credit);

            const grouped = new Map();

            for (const o of ops) {
                const repId = o.rep_id || o.representant?.id;
                if (!repId) continue;
                const prev = grouped.get(repId) || { repId, rep: o.representant?.nom || repId, ops: [] };
                prev.ops.push(o);
                grouped.set(repId, prev);
            }

            const computed = Array.from(grouped.values()).map((g) => {
                const total = g.ops.reduce((sum, o) => sum + toNumber(o.montant), 0);
                return {
                    id: g.repId,
                    rep: g.rep,
                    totalRemb: total,
                    mode: pickMainMode(g.ops),
                    status: pickStatus(g.ops),
                    operations: g.ops.length,
                };
            }).sort((a, b) => b.totalRemb - a.totalRemb);

            setRows(computed);
            setKpis({
                total: avance,
                reps: computed.length,
                operations: ops.length,
                credit,
                avance,
                reste,
                recouvrement,
            });
        } catch (error) {
            logger("Error computing remboursements REP:", error);
            toast.error("Erreur lors du chargement des remboursements REP");
        } finally {
            setIsLoading(false);
        }
    }, [selectedSeasonId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            { header: "Représentant", accessor: "rep" },
            { header: "Crédit (DH)", accessor: "credit", type: "money" },
            { header: "Avance (DH)", accessor: "avance", type: "money" },
            { header: "Reste (DH)", accessor: "reste", type: "money" },
            { header: "Recouvrement", accessor: "recouvrement", type: "percentage" },
            { header: "Opérations", accessor: "operations" },
            { header: "Mode principal", accessor: "mode" },
            { header: "Statut", accessor: "status" },
        ],
        []
    );

    const seasonLabel = activeSeason?.label ? schoolYearFormat(activeSeason.label) : "Toutes les saisons";

    const handleExportCSV = () => {
        const cols = [
            { header: "Représentant", accessor: "rep" },
            { header: "Crédit (DH)", accessor: "credit" },
            { header: "Avance (DH)", accessor: "avance" },
            { header: "Reste (DH)", accessor: "reste" },
            { header: "Recouvrement", accessor: "recouvrement" },
            { header: "Opérations", accessor: "operations" },
            { header: "Mode principal", accessor: "mode" },
            { header: "Statut", accessor: "status" },
        ];
        exportToCSV(rows, cols, `RembREP_${seasonLabel.replace(/\s+|\//g, '_')}.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-emerald-600" />
                        <h1 className="text-2xl font-bold text-slate-800">Remboursements REP (Global)</h1>
                    </div>
                    
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleExportCSV} className="bg-emerald-700 text-white flex items-center gap-2 hover:bg-emerald-800">
                        <Download size={16} /> CSV
                    </Button>
                    <Button onClick={() => setPdfOpen(true)} className="bg-slate-900 text-white flex items-center gap-2 hover:bg-black">
                        <Printer size={16} /> Imprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Crédit (DH)</p>
                    <p className="text-2xl font-black text-blue-700">{kpis.credit.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Avance (DH)</p>
                    <p className="text-2xl font-black text-emerald-700">{kpis.avance.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Reste (DH)</p>
                    <p className="text-2xl font-black text-red-700">{kpis.reste.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Recouvrement</p>
                    <p className="text-2xl font-black text-amber-700">{kpis.recouvrement.toFixed(1)}%</p>
                </div>
            </div>

            <div ref={printRef}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <MyTable
                        data={rows}
                        columns={columns}
                        pageSize={10}
                        variant="slate"
                        isLoading={isLoading}
                        enableSearch
                        enableSorting
                    />
                    {rows.length > 0 && (
                        <div className="grid grid-cols-4 bg-slate-50 border-t-2 border-slate-200 text-sm font-bold">
                            <div className="px-4 py-3 text-slate-700 uppercase">TOTAL</div>
                            <div className="px-4 py-3 text-center text-blue-700">{kpis.credit.toLocaleString()} DH</div>
                            <div className="px-4 py-3 text-center text-emerald-700">{kpis.avance.toLocaleString()} DH</div>
                            <div className="px-4 py-3 text-center text-red-700">{kpis.reste.toLocaleString()} DH</div>
                        </div>
                    )}
                </div>
            </div>

            <PdfDialogViewer
                open={pdfOpen}
                onOpenChange={setPdfOpen}
                title="Remboursements Représentants"
                document={
                    <RembGlobalePdf
                        title="Remboursements Représentants (Global)"
                        rows={rows}
                        kpis={kpis}
                        labelField="rep"
                        seasonLabel={seasonLabel}
                    />
                }
            />
        </div>
    );
};

export default RemboursementREPPage;
