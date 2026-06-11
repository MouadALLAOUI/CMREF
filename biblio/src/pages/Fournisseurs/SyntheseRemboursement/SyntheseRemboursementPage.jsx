import useAppStore from "../../../store/useAppStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Landmark, FileText } from "lucide-react";
import rembImpService from "../../../api/services/rembImpService";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import { currencyFormat } from "../../../lib/utilities";
import SyntheseRembPdf from "../../../components/pdfs/fornisseurs/SyntheseRembPdf";

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
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

const SyntheseRemboursementPage = () => {
    const { activeSeason } = useAppStore();
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await rembImpService.getAll();
            const ops = response;
            const grouped = new Map();

            for (const o of ops) {
                const impId = o.imprimeur_id || o.imprimeur?.id;
                if (!impId) continue;

                if (!grouped.has(impId)) {
                    grouped.set(impId, {
                        id: impId,
                        fournisseur: o.imprimeur?.raison_sociale || o.imprimeur?.nom || "—",
                        totalRemb: 0,
                        lastDate: "",
                        rawOps: []
                    });
                }
                const prev = grouped.get(impId);
                prev.totalRemb += toNumber(o.montant);
                prev.rawOps.push(o);
                if (o.date_payment && (!prev.lastDate || String(o.date_payment) > String(prev.lastDate))) {
                    prev.lastDate = o.date_payment;
                }
            }
            const computed = Array.from(grouped.values()).map((g) => ({
                ...g,
                mode: pickMainMode(g.rawOps),
                annee: activeSeason?.label,
            })).sort((a, b) => b.totalRemb - a.totalRemb);

            setRows(computed);
        } catch (error) {
            logger("Error computing fournisseurs synthese remboursements:", error)();
            toast.error("Erreur lors du chargement de la synthèse");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const stats = useMemo(() => {
        return rows.reduce((acc, r) => {
            acc.total += r.totalRemb;
            acc.count += r.rawOps?.length || 0;
            return acc;
        }, { total: 0, count: 0, suppliers: rows.length });
    }, [rows]);

    const columns = useMemo(
        () => [
            { header: "Fournisseur", accessor: "fournisseur" },
            { header: "Montant remboursé (DH)", accessor: "totalRemb", type: "curr" },
            { header: "Mode", accessor: "mode" },
            { header: "Dernier paiement", accessor: "lastDate", type: "date" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Synthèse Remboursements</h1>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fournisseurs - Synthèse Remboursements</h1>
                <div className="flex gap-3">
                    {/* <Button variant="outline" className="flex items-center gap-2 rounded-xl h-11 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                        <Download size={18} />
                    </Button> */}
                    <PdfDialogViewer
                        title="Synthèse des Remboursements"
                        document={<SyntheseRembPdf data={rows} annee={activeSeason?.label} total={stats.total} />}
                        trigger={
                            <Button className="bg-slate-900 text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-lg">
                                <Printer size={18} /> Imprimer
                            </Button>
                        }
                    />

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-900 text-white rounded-2xl shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Landmark size={80} />
                    </div>
                    <p className="text-xs text-emerald-300 font-black uppercase tracking-[0.2em] mb-2">Total Remboursé HT</p>
                    <p className="text-4xl font-black tracking-tight">{currencyFormat(stats.total)}</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 text-slate-900 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
                        <FileText size={80} />
                    </div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Nombre de Fournisseurs</p>
                    <p className="text-4xl font-black tracking-tight">{stats.suppliers}</p>
                </div>
            </div>

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
            </div>
        </div>
    );
};

export default SyntheseRemboursementPage;
