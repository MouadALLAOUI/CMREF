import useAppStore from "../../../store/useAppStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import { currencyFormat } from "../../../lib/utilities";
import SyntheseBlPdf from "../../../components/pdfs/fornisseurs/SyntheseBlPdf";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import SingleBlPdf from "../../../components/pdfs/fornisseurs/SingleBlPdf";

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const SyntheseBLPage = () => {
    const { activeSeason } = useAppStore();
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedForPrint, setSelectedForPrint] = useState(null);
    const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const blResponse = await bLivraisonImpService.getAll();

            const processedRows = blResponse.map((bl) => {
                const stats = (bl.items || []).reduce((acc, item) => {
                    const livre = item.livre;
                    const unitPrice = toNumber(livre?.prix_achat ?? 0);
                    const qty = toNumber(item.quantite);

                    acc.qty += qty;
                    acc.total += unitPrice * qty;
                    return acc;
                }, { qty: 0, total: 0 });

                const itemsByCategory = {};
                (bl.items || []).forEach(item => {
                    const livre = item.livre;
                    const catLabel = livre?.category?.libelle || "Non classifié";
                    if (!itemsByCategory[catLabel]) itemsByCategory[catLabel] = [];
                    itemsByCategory[catLabel].push({
                        ...item,
                        livre,
                        total: toNumber(livre?.prix_achat ?? 0) * toNumber(item.quantite)
                    });
                });

                return {
                    id: bl.id,
                    fournisseur: bl.imprimeur?.raison_sociale || bl.imprimeur?.nom || "—",
                    bl_number: bl.b_livraison_number || "—",
                    date_reception: bl.date_reception || "",
                    lignes: (bl.items || []).length,
                    quantite: stats.qty,
                    total_ht: stats.total,
                    rawItems: bl.items,
                    itemsByCategory
                };
            });
            setRows(processedRows.sort((a, b) =>
                String(b.date_reception).localeCompare(String(a.date_reception))
            ));
        } catch (error) {
            logger("Error fetching fournisseurs synthese BL:", error)();
            toast.error("Erreur lors du chargement de la synthèse");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = (type, row) => {
        if (type === "imp") {
            setSelectedForPrint(row);
            setIsPrintDialogOpen(true);
        }
    };

    const totalMontant = useMemo(() =>
        rows.reduce((sum, item) => sum + toNumber(item.total_ht), 0),
        [rows]);

    const totalBL = rows.length;

    const columns = useMemo(
        () => [
            { header: "Fournisseur", accessor: "fournisseur" },
            { header: "BL N°", accessor: "bl_number" },
            { header: "Date réception", accessor: "date_reception", type: "date" },
            { header: "Lignes", accessor: "lignes" },
            { header: "Quantité", accessor: "quantite" },
            { header: "Total (HT) (DH)", accessor: "total_ht", type: "curr" },
        ],
        []
    );

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fournisseurs - Synthèse BL</h1>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 rounded-xl h-11 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                        <Download size={18} /> Exporter
                    </Button>
                    <PdfDialogViewer
                        title="Aperçu Synthèse BL"
                        document={
                            <SyntheseBlPdf
                                data={rows}
                                annee={activeSeason?.label}
                                totalMontant={totalMontant}
                            />
                        }
                        trigger={
                            <Button className="bg-slate-900 hover:bg-black text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-lg">
                                <Printer size={18} /> Imprimer Synthèse
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Download size={80} />
                    </div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Total Achats (HT)</p>
                    <p className="text-4xl font-black tracking-tight">{currencyFormat(totalMontant)}</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 text-slate-900 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
                        <FileText size={80} />
                    </div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Bons de Livraison</p>
                    <p className="text-4xl font-black tracking-tight">{totalBL}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {selectedForPrint && (
                    <PdfDialogViewer
                        key={selectedForPrint.id}
                        open={isPrintDialogOpen}
                        onOpenChange={setIsPrintDialogOpen}
                        title={`Impression BL ${selectedForPrint.bl_number}`}
                        document={<SingleBlPdf blData={selectedForPrint} />}
                    />
                )}
                <MyTable
                    data={rows}
                    columns={columns}
                    pageSize={10}
                    variant="slate"
                    actions={["imp"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    enableSearch
                    enableSorting
                />
            </div>
        </div>
    );
};

export default SyntheseBLPage;
