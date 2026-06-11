import { useState, useEffect, useMemo } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import depotService from "../../../api/services/depotService";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepDepotPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [depots, setDepots] = useState([]);
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        livre_id: "",
        quantite: ""
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [depotsRes, livRes, catsRes] = await Promise.all([
                depotService.getAll({ annee: activeSeason?.label }),
                livreService.getAll(),
                categoryService.getAll()
            ]);
            setDepots(depotsRes?.data?.data || depotsRes?.data || []);
            setLivres(livRes?.data?.data || livRes?.data || []);
            setCategories(catsRes?.data?.data || catsRes?.data || []);
        } catch (error) {
            logger("Failed to load depot data", "error")();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeSeason?.label) fetchData();
    }, [activeSeason?.label]);

    const livresByCategory = useMemo(() => {
        const grouped = {};
        categories.forEach(cat => {
            grouped[cat.id] = {
                categoryName: cat.libelle,
                livres: livres.filter(l => l.categorie_id === cat.id)
            };
        });
        return Object.values(grouped).filter(g => g.livres.length > 0);
    }, [livres, categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.livre_id || !formData.quantite) {
            toast.error("Veuillez sélectionner un livre et une quantité");
            return;
        }
        try {
            await depotService.create({
                livre_id: formData.livre_id,
                quantite: parseInt(formData.quantite),
                annee: activeSeason?.label
            });
            toast.success("Dépôt déclaré avec succès");
            setFormData({ livre_id: "", quantite: "" });
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la déclaration");
            logger("Failed to create depot", "error")();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce dépôt ?")) return;
        try {
            await depotService.delete(id);
            toast.success("Dépôt supprimé");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
            logger("Failed to delete depot", "error")();
        }
    };

    const columns = [
        { header: "Livre", accessor: "livre", cell: ({ row }) => row.original.livre?.titre || "—" },
        { header: "Code", accessor: "code", cell: ({ row }) => row.original.livre?.code || "—" },
        { header: "Catégorie", accessor: "categorie", cell: ({ row }) => row.original.livre?.categorie?.libelle || "—" },
        { header: "Quantité", accessor: "quantite" },
        { header: "Supprimer", accessor: "actions", cell: ({ row }) => (
            <button
                onClick={() => handleDelete(row.original.id)}
                className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                title="Supprimer"
            >
                <Trash2 size={16} className="text-red-600" />
            </button>
        )}
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <Package size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dépôt</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Déclaration de vos livres en dépôt
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionContainer
                    title="Liste des livres en Dépôt"
                    icon={Package}
                    headerColor="bg-blue-600"
                    collapsible={true}
                    defaultOpen={true}
                >
                    <MyTable
                        data={depots}
                        columns={columns}
                        pageSize={15}
                        variant="slate"
                        isLoading={isLoading}
                        enableSearch={true}
                        enableSorting={true}
                    />
                </SectionContainer>

                <SectionContainer
                    title="Déclarer un dépôt"
                    icon={Plus}
                    headerColor="bg-emerald-600"
                    collapsible={true}
                    defaultOpen={true}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Livre *</label>
                            <select
                                required
                                value={formData.livre_id}
                                onChange={e => setFormData({ ...formData, livre_id: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            >
                                <option value="">Sélectionner un livre</option>
                                {livresByCategory.map(catGroup => (
                                    <optgroup key={catGroup.categoryName} label={catGroup.categoryName}>
                                        {catGroup.livres.map(livre => (
                                            <option key={livre.id} value={livre.id}>
                                                {livre.titre} ({livre.code})
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Quantité *</label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={formData.quantite}
                                onChange={e => setFormData({ ...formData, quantite: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Quantité"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all"
                        >
                            Déclarer
                        </button>
                    </form>
                </SectionContainer>
            </div>
        </div>
    );
}

export default RepDepotPage;
