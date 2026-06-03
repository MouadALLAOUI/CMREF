import { useState, useEffect, useMemo } from "react";
import { LayoutDashboard, BookOpen, Truck, Package, TrendingUp } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import categoryService from "../../../api/services/categoryService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";

function RepHomePage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [itemsRes, catsRes] = await Promise.all([
                    bLivraisonItemService.getAll({ annee: activeSeason?.name }),
                    categoryService.getAll()
                ]);
                setDeliveryItems(itemsRes?.data?.data || itemsRes?.data || []);
                setCategories(catsRes?.data?.data || catsRes?.data || []);
            } catch (error) {
                logger("Failed to load REP home data", "error")();
            } finally {
                setIsLoading(false);
            }
        };
        if (activeSeason?.name) fetchData();
    }, [activeSeason?.name]);

    const groupedByCategory = useMemo(() => {
        if (!deliveryItems.length || !categories.length) return [];

        const grouped = {};
        categories.forEach(cat => {
            grouped[cat.id] = {
                categoryName: cat.libelle,
                books: []
            };
        });

        deliveryItems.forEach(item => {
            const catId = item.livre?.categorie_id;
            if (grouped[catId]) {
                const existing = grouped[catId].books.find(b => b.livre_id === item.livre_id);
                if (existing) {
                    existing.quantite += item.quantite || 0;
                } else {
                    grouped[catId].books.push({
                        livre_id: item.livre_id,
                        livre: item.livre?.titre || "—",
                        code: item.livre?.code || "—",
                        quantite: item.quantite || 0,
                        prix: item.livre?.prix_vente || 0
                    });
                }
            }
        });

        return Object.values(grouped).filter(g => g.books.length > 0);
    }, [deliveryItems, categories]);

    const totalDelivered = useMemo(() =>
        deliveryItems.reduce((sum, item) => sum + (item.quantite || 0), 0),
        [deliveryItems]
    );

    const totalCA = useMemo(() =>
        deliveryItems.reduce((sum, item) => sum + ((item.quantite || 0) * (item.livre?.prix_vente || 0)), 0),
        [deliveryItems]
    );

    const columns = [
        { header: "Livre", accessor: "livre" },
        { header: "Code", accessor: "code" },
        { header: "Quantité", accessor: "quantite" },
        { header: "Prix Unitaire", accessor: "prix", cell: ({ getValue }) => `${(getValue() || 0).toFixed(2)} DH` }
    ];

    const welcomeName = user?.name || user?.prenom || "Représentant";

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <LayoutDashboard size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Bienvenue {welcomeName}
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Voici un résumé de vos livraisons pour la saison {activeSeason?.name || "—"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Truck size={80} />
                    </div>
                    <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mb-2">Total Livré</p>
                    <p className="text-3xl font-black">{isLoading ? "—" : totalDelivered.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">unités</p>
                </div>
                <div className="p-6 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
                        <TrendingUp size={80} />
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Chiffre d'Affaires</p>
                    <p className="text-xl font-bold">{isLoading ? "—" : `${totalCA.toLocaleString()} DH`}</p>
                </div>
                <div className="p-6 bg-emerald-900 text-white rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Package size={80} />
                    </div>
                    <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">Catégories</p>
                    <p className="text-xl font-bold">{groupedByCategory.length}</p>
                </div>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                        <p className="text-slate-500 font-medium italic">Chargement des données...</p>
                    </div>
                ) : (
                    groupedByCategory.map((group, index) => (
                        <SectionContainer
                            key={group.categoryName || index}
                            title={`Livraison - Vente - Stock --|-- Categorie : ${group.categoryName}`}
                            icon={BookOpen}
                            headerColor="bg-blue-600"
                            collapsible={true}
                            defaultOpen={true}
                        >
                            <MyTable
                                data={group.books}
                                columns={columns}
                                pageSize={10}
                                variant="slate"
                                isLoading={isLoading}
                                enableSearch={false}
                                enableSorting={false}
                            />
                        </SectionContainer>
                    ))
                )}

                {!isLoading && groupedByCategory.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500 italic">
                        Aucune donnée de livraison disponible pour cette saison.
                    </div>
                )}
            </div>
        </div>
    );
}

export default RepHomePage;
