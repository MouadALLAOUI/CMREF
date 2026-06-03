import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import seasonsService from "../../../api/services/seasonsService";
import { currencyFormat } from "../../../lib/utilities";
import SyntheseBlPdf from "../../../components/pdfs/fornisseurs/SyntheseBlPdf";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import SingleBlPdf from "../../../components/pdfs/fornisseurs/SingleBlPdf";

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const SyntheseBLPage = () => {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [seasons, setSeasons] = useState([]);

    const [selectedAnnee, setSelectedAnnee] = useState("");

    useEffect(() => {
        seasonsService.getAll().then(setSeasons).catch(() => {});
    }, []);

    const seasonOptions = useMemo(() => {
        return seasons.map(s => ({
            value: s.name,
            label: `${new Date(s.start_date).getFullYear()} / ${new Date(s.end_date).getFullYear()}`
        }));
    }, [seasons]);

    // Auto-select first season after loading
    useEffect(() => {
        if (seasons.length > 0 && !selectedAnnee) {
            const active = seasons.find(s => s.is_active);
            setSelectedAnnee(active?.name || seasons[0]?.name || "");
        }
    }, [seasons]);

    const [selectedForPrint, setSelectedForPrint] = useState(null);
    const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [blResponse, livresResponse, catsResponse] = await Promise.all([
                bLivraisonImpService.getAll(),
                livreService.getAll(),
                categoryService.getAll()
            ]);
            const allBLs = blResponse;
            const allLivres = livresResponse;
            const allCats = catsResponse?.data?.data || catsResponse?.data || catsResponse || [];
            const livreById = new Map(allLivres.map((l) => [l.id, l]));
            const catById = new Map(allCats.map((c) => [c.id, c]));

            const processedRows = allBLs.map((bl) => {
                // Calculate totals for this specific BL
                const stats = (bl.items || []).reduce((acc, item) => {
                    const livre = livreById.get(item.livre_id);
                    const unitPrice = toNumber(livre?.prix_achat ?? 0);
                    const qty = toNumber(item.quantite);

                    acc.qty += qty;
                    acc.total += unitPrice * qty;
                    return acc;
                }, { qty: 0, total: 0 });

                // Group items by category for this BL
                const itemsByCategory = {};
                (bl.items || []).forEach(item => {
                    const livre = livreById.get(item.livre_id);
                    const cat = catById.get(livre?.categorie_id);
                    const catLabel = cat?.libelle || "Non classifié";
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
                    annee: bl.annee,
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

    const filteredRows = useMemo(() => {
        if (!selectedAnnee || selectedAnnee === "all") return rows;
        return rows.filter(row => row.annee === selectedAnnee);
    }, [rows, selectedAnnee]);
    const totalMontant = useMemo(() =>
        filteredRows.reduce((sum, item) => sum + toNumber(item.total_ht), 0),
        [filteredRows]);

    const totalBL = filteredRows.length;

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

    const categorySummary = useMemo(() => {
        if (!filteredRows.length) return [];
        const summary = {};
        filteredRows.forEach(row => {
            Object.entries(row.itemsByCategory || {}).forEach(([cat, items]) => {
                if (!summary[cat]) summary[cat] = { qty: 0, total: 0, lignes: 0 };
                items.forEach(item => {
                    summary[cat].qty += toNumber(item.quantite);
                    summary[cat].total += toNumber(item.total);
                    summary[cat].lignes += 1;
                });
            });
        });
        return Object.entries(summary)
            .map(([cat, data]) => ({ category: cat, ...data }))
            .sort((a, b) => b.total - a.total);
    }, [filteredRows]);

    return (
        <div className="space-y-6">
            <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Année Scolaire:</span>
                <select
                    value={selectedAnnee}
                    onChange={(e) => setSelectedAnnee(e.target.value)}
                    className="bg-slate-100 border-none text-sm font-bold rounded-lg px-3 py-1 focus:ring-2 focus:ring-slate-900"
                >
                    <option value="all">Toutes les années</option>
                    {seasonOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
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
                                data={filteredRows}
                                annee={selectedAnnee}
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

            {categorySummary.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Synthèse par Catégorie</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categorySummary.map((cat) => (
                            <div key={cat.category} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{cat.category}</p>
                                <p className="text-lg font-black text-slate-900">{cat.lignes} lignes</p>
                                <p className="text-sm text-slate-600">{cat.qty} livres — <span className="font-bold">{currencyFormat(cat.total)}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Hidden PDF Viewer triggered by handleAction */}
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
                    data={filteredRows}
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
