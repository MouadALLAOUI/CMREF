import { useState, useEffect, useMemo } from "react";
import { FileText, Trash2 } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import factService from "../../../api/services/factService";
import demandeFService from "../../../api/services/demandeFService";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepFactureWataniyaPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [factures, setFactures] = useState([]);
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        date: "",
        ville: "",
        client: "",
        ice: "",
        adresse: "",
        tel: "",
        articles: {}
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [factsRes, livRes, catsRes] = await Promise.all([
                factService.getAll({ annee: activeSeason?.label, type: "Wataniya" }),
                livreService.getAll(),
                categoryService.getAll()
            ]);
            setFactures(factsRes?.data?.data || factsRes?.data || []);
            setLivres(livRes?.data?.data || livRes?.data || []);
            setCategories(catsRes?.data?.data || catsRes?.data || []);
        } catch (error) {
            logger("Failed to load Wataniya facture data", "error")();
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

    const handleArticleToggle = (livreId) => {
        setFormData(prev => {
            const newArticles = { ...prev.articles };
            if (newArticles[livreId]) {
                delete newArticles[livreId];
            } else {
                newArticles[livreId] = { qte: "", remise: "25" };
            }
            return { ...prev, articles: newArticles };
        });
    };

    const handleArticleQtyChange = (livreId, qte) => {
        setFormData(prev => ({
            ...prev,
            articles: {
                ...prev.articles,
                [livreId]: { ...prev.articles[livreId], qte }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedArticles = Object.entries(formData.articles)
            .filter(([, v]) => v.qte && parseInt(v.qte) > 0)
            .map(([livreId, v]) => ({
                livre_id: livreId,
                quantite: parseInt(v.qte),
                remise: parseInt(v.remise) || 0
            }));

        if (selectedArticles.length === 0) {
            toast.error("Veuillez sélectionner au moins un article avec une quantité");
            return;
        }

        try {
            await demandeFService.create({
                type: "Wataniya",
                date_demande: formData.date,
                ville: formData.ville,
                client: formData.client,
                ice: formData.ice,
                adresse: formData.adresse,
                tel: formData.tel,
                articles: selectedArticles,
                annee: activeSeason?.label
            });
            toast.success("Demande de facture Wataniya envoyée avec succès");
            setFormData({ date: "", ville: "", client: "", ice: "", adresse: "", tel: "", articles: {} });
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'envoi de la demande");
            logger("Failed to create demande facture Wataniya", "error")();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
        try {
            await factService.delete(id);
            toast.success("Facture supprimée");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
            logger("Failed to delete facture", "error")();
        }
    };

    const columns = [
        { header: "Date", accessor: "date_facture", cell: ({ getValue }) => {
            const d = getValue();
            return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
        }},
        { header: "Client", accessor: "client", cell: ({ row }) => row.original.client?.raison_sociale || "—" },
        { header: "ICE", accessor: "ice", cell: ({ row }) => row.original.client?.ice || "—" },
        { header: "Montant (DH)", accessor: "total_ht", cell: ({ getValue }) => (
            <span className="font-bold">{(getValue() || 0).toLocaleString()} DH</span>
        )},
        { header: "Remise (DH)", accessor: "remise", cell: ({ getValue }) => (
            <span className="text-red-600">{(getValue() || 0).toLocaleString()} DH</span>
        )},
        { header: "Net (DH)", accessor: "total_ttc", cell: ({ getValue }) => (
            <span className="font-black text-emerald-700">{(getValue() || 0).toLocaleString()} DH</span>
        )},
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
                    <FileText size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facture Wataniya</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Liste et demande de factures El Wataniya
                    </p>
                </div>
            </div>

            <SectionContainer
                title="Liste des factures El Wataniya"
                icon={FileText}
                headerColor="bg-blue-600"
                collapsible={true}
                defaultOpen={true}
            >
                <MyTable
                    data={factures.filter(f => f.type === "Wataniya")}
                    columns={columns}
                    pageSize={15}
                    variant="slate"
                    isLoading={isLoading}
                    enableSearch={true}
                    enableSorting={true}
                />
            </SectionContainer>

            <SectionContainer
                title="Demander une facture"
                icon={FileText}
                headerColor="bg-emerald-600"
                collapsible={true}
                defaultOpen={true}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Ville *</label>
                            <input
                                type="text"
                                required
                                value={formData.ville}
                                onChange={e => setFormData({ ...formData, ville: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Ville"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Client *</label>
                            <input
                                type="text"
                                required
                                value={formData.client}
                                onChange={e => setFormData({ ...formData, client: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Nom du client"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">ICE *</label>
                            <input
                                type="text"
                                required
                                value={formData.ice}
                                onChange={e => setFormData({ ...formData, ice: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="ICE"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Adresse *</label>
                            <input
                                type="text"
                                required
                                value={formData.adresse}
                                onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Adresse"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Tél / Fax</label>
                            <input
                                type="text"
                                value={formData.tel}
                                onChange={e => setFormData({ ...formData, tel: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Téléphone"
                            />
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-t border-slate-100 pt-4">
                        Sélectionner les articles
                    </h3>

                    {livresByCategory.map((catGroup) => (
                        <div key={catGroup.categoryName} className="space-y-2">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase">
                                {catGroup.categoryName}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {catGroup.livres.map(livre => {
                                    const isSelected = !!formData.articles[livre.id];
                                    return (
                                        <div
                                            key={livre.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                isSelected
                                                    ? "bg-emerald-50 border-emerald-300"
                                                    : "bg-white border-slate-200 hover:bg-slate-50"
                                            }`}
                                            onClick={() => handleArticleToggle(livre.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleArticleToggle(livre.id)}
                                                className="w-4 h-4"
                                            />
                                            <span className="flex-1 text-sm font-medium text-slate-700">
                                                {livre.titre}
                                            </span>
                                            {isSelected && (
                                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        placeholder="Qté"
                                                        value={formData.articles[livre.id]?.qte || ""}
                                                        onChange={e => handleArticleQtyChange(livre.id, e.target.value)}
                                                        className="w-20 h-8 rounded-lg border border-slate-200 px-2 text-sm text-center outline-none focus:ring-1 focus:ring-slate-900"
                                                    />
                                                    <select
                                                        value={formData.articles[livre.id]?.remise || "25"}
                                                        onChange={e => handleArticleQtyChange(livre.id, formData.articles[livre.id]?.qte)}
                                                        className="h-8 rounded-lg border border-slate-200 px-2 text-sm outline-none"
                                                    >
                                                        {Array.from({ length: 51 }, (_, i) => (
                                                            <option key={i} value={i}>{i}%</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all"
                        >
                            Envoyer la demande
                        </button>
                    </div>
                </form>
            </SectionContainer>
        </div>
    );
}

export default RepFactureWataniyaPage;
