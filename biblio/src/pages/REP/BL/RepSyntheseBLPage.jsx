import { useState, useEffect, useMemo } from "react";
import { BarChart3, Printer } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import repRemboursementService from "../../../api/services/repRemboursementService";
import categoryService from "../../../api/services/categoryService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import RepSynthesePdf from "../../../components/pdfs/representants/RepSynthesePdf";

function RepSyntheseBLPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [remboursements, setRemboursements] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pdfOpen, setPdfOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [itemsRes, rembRes, catsRes] = await Promise.all([
                    bLivraisonItemService.getAll({ annee: activeSeason?.label }),
                    repRemboursementService.getAll({ annee: activeSeason?.label }),
                    categoryService.getAll()
                ]);
                setDeliveryItems(itemsRes?.data?.data || itemsRes?.data || []);
                setRemboursements(rembRes?.data?.data || rembRes?.data || []);
                setCategories(catsRes?.data?.data || catsRes?.data || []);
            } catch (error) {
                logger("Failed to load synthese data", "error")();
            } finally {
                setIsLoading(false);
            }
        };
        if (activeSeason?.label) fetchData();
    }, [activeSeason?.label]);

    const totalCredit = useMemo(() =>
        deliveryItems.reduce((sum, item) => sum + ((item.quantite || 0) * (item.livre?.prix_vente || 0)), 0),
        [deliveryItems]
    );

    const totalAvance = useMemo(() =>
        remboursements.filter(r => r.statut_accepte).reduce((sum, r) => sum + (r.montant || 0), 0),
        [remboursements]
    );

    const totalReste = totalCredit - totalAvance;

    const recouvrement = totalCredit > 0 ? ((totalAvance / totalCredit) * 100).toFixed(2) : "0.00";

    const categoryData = useMemo(() => {
        if (!deliveryItems.length || !categories.length) return [];

        return categories.map(cat => {
            const catItems = deliveryItems.filter(item => item.livre?.categorie_id === cat.id);
            const books = {};
            catItems.forEach(item => {
                const bookKey = item.livre_id;
                if (!books[bookKey]) {
                    books[bookKey] = {
                        titre: item.livre?.titre || "—",
                        code: item.livre?.code || "—",
                        livraison: 0
                    };
                }
                books[bookKey].livraison += item.quantite || 0;
            });
            return {
                categoryName: cat.libelle,
                books: Object.values(books)
            };
        }).filter(g => g.books.length > 0);
    }, [deliveryItems, categories]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Synthèse BL</h1>
                        <p className="text-slate-500 text-xs mt-0.5">
                            Récapitulatif de vos livraisons et remboursements
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setPdfOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all no-print"
                >
                    <Printer size={18} />
                    Imprimer
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <p className="text-xs text-blue-600 font-bold uppercase">Crédit</p>
                    <p className="text-xl font-black text-blue-700">{totalCredit.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <p className="text-xs text-emerald-600 font-bold uppercase">Avance</p>
                    <p className="text-xl font-black text-emerald-700">{totalAvance.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-xs text-red-600 font-bold uppercase">Reste</p>
                    <p className="text-xl font-black text-red-700">{totalReste.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-600 font-bold uppercase">Recouvrement</p>
                    <p className="text-xl font-black text-red-600">{recouvrement} %</p>
                </div>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                        <p className="text-slate-500 font-medium italic">Calcul de la synthèse...</p>
                    </div>
                ) : (
                    categoryData.map((group, index) => (
                        <SectionContainer
                            key={group.categoryName || index}
                            title={`REP : ${user?.name || "—"} ::: Cat : ${group.categoryName}`}
                            icon={BarChart3}
                            headerColor="bg-blue-600"
                            collapsible={true}
                            defaultOpen={true}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-4 py-2 text-left font-bold text-slate-700 border border-slate-200" rowSpan={2}>Type</th>
                                            <th className="px-4 py-2 text-left font-bold text-slate-700 border border-slate-200" rowSpan={2}>Sous-type</th>
                                            {group.books.map((book, i) => (
                                                <th key={i} className="px-4 py-2 text-center font-bold text-slate-700 border border-slate-200">
                                                    {book.code}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 font-bold text-slate-700 border border-slate-200 bg-slate-50" rowSpan={1}>
                                                Livraison
                                            </td>
                                            <td className="px-4 py-2 border border-slate-200">Livre</td>
                                            {group.books.map((book, i) => (
                                                <td key={i} className="px-4 py-2 text-center border border-slate-200 font-bold">
                                                    {book.livraison}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </SectionContainer>
                    ))
                )}

                {!isLoading && categoryData.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500 italic">
                        Aucune donnée de livraison disponible pour cette saison.
                    </div>
                )}
            </div>

            <PdfDialogViewer
                open={pdfOpen}
                onOpenChange={setPdfOpen}
                title="Synthèse BL"
                document={
                    <RepSynthesePdf
                        title="Synthèse BL"
                        categoryData={categoryData}
                        kpis={{
                            credit: totalCredit,
                            avance: totalAvance,
                            reste: totalReste,
                            recouvrement,
                        }}
                        repName={user?.name}
                    />
                }
            />
        </div>
    );
}

export default RepSyntheseBLPage;
