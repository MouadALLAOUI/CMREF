import useAppStore from "../../../store/useAppStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { CreditCard, Printer, Download } from "lucide-react";
import rembImpService from "../../../api/services/rembImpService";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import livreService from "../../../api/services/livreService";
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
    if (ops.some((o) => !!o.statut_recu)) return "Reçu";
    return "En cours";
};

const pickMainMode = (ops = []) => {
    let cheque = 0;
    let virement = 0;
    let autre = 0;
    for (const o of ops) {
        if (o.cheque_number) cheque += 1;
        else if (o.banque_id || o.banque_nom) virement += 1;
        else autre += 1;
    }
    if (cheque >= virement && cheque >= autre) return "Chèque";
    if (virement >= cheque && virement >= autre) return "Virement";
    return "—";
};

const RemboursementFournisseursPage = () => {
    const { activeSeason } = useAppStore();
    const selectedSeasonId = activeSeason?.label || "";
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ total: 0, fournisseurs: 0, operations: 0, credit: 0, avance: 0, reste: 0, recouvrement: 0 });
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
            const [ops, livraisonsImp, livres] = await Promise.all([
                fetchAllPaginated(rembImpService.getAll, params),
                fetchAllPaginated(bLivraisonImpService.getAll, params),
                fetchAllPaginated(livreService.getAll),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));

            const credit = livraisonsImp.reduce((sum, it) => {
                const livre = livreById.get(it.livre_id || it.livre?.id);
                const unit = toNumber(livre?.prix_achat ?? 0);
                return sum + unit * toNumber(it.quantite);
            }, 0);

            const avance = ops.reduce((sum, o) => sum + toNumber(o.montant), 0);
            const reste = credit - avance;
            const recouvrement = calculateRecouvrement(avance, credit);

            const grouped = new Map();

            for (const o of ops) {
                const impId = o.imprimeur_id || o.imprimeur?.id;
                if (!impId) continue;
                const prev = grouped.get(impId) || { impId, fournisseur: o.imprimeur?.nom || o.imprimeur?.raison_sociale || impId, ops: [] };
                prev.ops.push(o);
                grouped.set(impId, prev);
            }

            const computed = Array.from(grouped.values()).map((g) => {
                const total = g.ops.reduce((sum, o) => sum + toNumber(o.montant), 0);
                return {
                    id: g.impId,
                    fournisseur: g.fournisseur,
                    totalRemb: total,
                    mode: pickMainMode(g.ops),
                    status: pickStatus(g.ops),
                    operations: g.ops.length,
                };
            }).sort((a, b) => b.totalRemb - a.totalRemb);

            setRows(computed);
            setKpis({
                total: avance,
                fournisseurs: computed.length,
                operations: ops.length,
                credit,
                avance,
                reste,
                recouvrement,
            });
        } catch (error) {
            logger("Error computing remboursements fournisseurs:", error);
            toast.error("Erreur lors du chargement des remboursements fournisseurs");
        } finally {
            setIsLoading(false);
        }
    }, [selectedSeasonId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            { header: "Fournisseur", accessor: "fournisseur" },
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
            { header: "Fournisseur", accessor: "fournisseur" },
            { header: "Crédit (DH)", accessor: "credit" },
            { header: "Avance (DH)", accessor: "avance" },
            { header: "Reste (DH)", accessor: "reste" },
            { header: "Recouvrement", accessor: "recouvrement" },
            { header: "Opérations", accessor: "operations" },
            { header: "Mode principal", accessor: "mode" },
            { header: "Statut", accessor: "status" },
        ];
        exportToCSV(rows, cols, `RembFournisseurs_${seasonLabel.replace(/\s+|\//g, '_')}.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-emerald-600" />
                        <h1 className="text-2xl font-bold text-slate-800">Remboursements Fournisseurs (Global)</h1>
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
                title="Remboursements Fournisseurs"
                document={
                    <RembGlobalePdf
                        title="Remboursements Fournisseurs (Global)"
                        rows={rows}
                        kpis={kpis}
                        labelField="fournisseur"
                        seasonLabel={seasonLabel}
                    />
                }
            />
        </div>
    );
};

export default RemboursementFournisseursPage;
