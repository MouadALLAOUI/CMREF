import { useState, useEffect, useMemo } from "react";
import { FileText, Plus } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";
import bLivraisonService from "../../../api/services/bLivraisonService";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import clientService from "../../../api/services/clientService";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepSaisirBLClientPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [clients, setClients] = useState([]);
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedClient, setSelectedClient] = useState("");
    const [selectedLivres, setSelectedLivres] = useState({});

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [clientsRes, livRes, catsRes] = await Promise.all([
                clientService.getAll({ annee: activeSeason?.label }),
                livreService.getAll(),
                categoryService.getAll()
            ]);
            setClients(clientsRes?.data?.data || clientsRes?.data || []);
            setLivres(livRes?.data?.data || livRes?.data || []);
            setCategories(catsRes?.data?.data || catsRes?.data || []);
        } catch (error) {
            logger("Failed to load BL client data", "error")();
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

    const handleToggleLivre = (livreId) => {
        setSelectedLivres(prev => {
            const newSel = { ...prev };
            if (newSel[livreId]) {
                delete newSel[livreId];
            } else {
                newSel[livreId] = { qte: "" };
            }
            return newSel;
        });
    };

    const handleQtyChange = (livreId, qte) => {
        setSelectedLivres(prev => ({
            ...prev,
            [livreId]: { ...prev[livreId], qte }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient) {
            toast.error("Veuillez sélectionner un client");
            return;
        }
        const articles = Object.entries(selectedLivres)
            .filter(([, v]) => v.qte && parseInt(v.qte) > 0)
            .map(([livreId, v]) => ({ livre_id: livreId, quantite: parseInt(v.qte) }));

        if (articles.length === 0) {
            toast.error("Veuillez sélectionner au moins un livre avec une quantité");
            return;
        }

        try {
            const blRes = await bLivraisonService.create({
                client_id: selectedClient,
                type: "Livre",
                annee: activeSeason?.label
            });
            const blId = blRes?.data?.data?.id || blRes?.data?.id;

            for (const article of articles) {
                await bLivraisonItemService.create({
                    b_livraison_id: blId,
                    livre_id: article.livre_id,
                    quantite: article.quantite
                });
            }

            toast.success("BL client créé avec succès");
            setSelectedClient("");
            setSelectedLivres({});
        } catch (error) {
            toast.error("Erreur lors de la création du BL");
            logger("Failed to create client BL", "error")();
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <FileText size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saisir un BL Client</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Créer un bon de livraison pour un client
                    </p>
                </div>
            </div>

            <SectionContainer
                title="Nouveau BL Client"
                icon={Plus}
                headerColor="bg-emerald-600"
                collapsible={true}
                defaultOpen={true}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Client *</label>
                        <select
                            required
                            value={selectedClient}
                            onChange={e => setSelectedClient(e.target.value)}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                        >
                            <option value="">Sélectionner un client</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.raison_sociale} ({c.ville})</option>
                            ))}
                        </select>
                    </div>

                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-t border-slate-100 pt-4">
                        Sélectionner les livres
                    </h3>

                    {livresByCategory.map(catGroup => (
                        <div key={catGroup.categoryName} className="space-y-2">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase">
                                {catGroup.categoryName}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {catGroup.livres.map(livre => {
                                    const isSelected = !!selectedLivres[livre.id];
                                    return (
                                        <div
                                            key={livre.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                isSelected ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200 hover:bg-slate-50"
                                            }`}
                                            onClick={() => handleToggleLivre(livre.id)}
                                        >
                                            <input type="checkbox" checked={isSelected} onChange={() => handleToggleLivre(livre.id)} className="w-4 h-4" />
                                            <span className="flex-1 text-sm font-medium text-slate-700">{livre.titre}</span>
                                            {isSelected && (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Qté"
                                                    value={selectedLivres[livre.id]?.qte || ""}
                                                    onChange={e => handleQtyChange(livre.id, e.target.value)}
                                                    onClick={e => e.stopPropagation()}
                                                    className="w-20 h-8 rounded-lg border border-slate-200 px-2 text-sm text-center outline-none focus:ring-1 focus:ring-slate-900"
                                                />
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
                            Créer le BL
                        </button>
                    </div>
                </form>
            </SectionContainer>
        </div>
    );
}

export default RepSaisirBLClientPage;
