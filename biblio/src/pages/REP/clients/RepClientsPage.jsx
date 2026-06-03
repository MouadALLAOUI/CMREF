import { useState, useEffect } from "react";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import clientService from "../../../api/services/clientService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

const VILLES = [
    "Agadir", "Assilah", "Azilal", "Benimellal", "Benslimane", "Berkane", "Berrechid",
    "Bouarfa", "Casablanca", "Chefchaouen", "El Kalaa des Sraghna", "Eljadida",
    "Errachidia", "Essaouira", "Fes", "Fkih ben saleh", "Guelmim", "Hoceima",
    "Ifrane", "Kenitra", "Khemisset", "Khenifra", "Khouribga", "Ksar el kbir",
    "Laayoune", "Larache", "Marrakech", "Meknes", "Missour", "Mohammedia",
    "Nador", "Ouarzazate", "Oued zem", "Ouezzane", "Oujda", "Rabat", "Salé",
    "Sefrou", "Settat", "Sidi bennour", "Sidi kacem", "Sidi slimane",
    "Souk el arbaa du gharb", "Tanger", "Tantan", "Taounate", "Taroudant",
    "Tata", "Taza", "Temara", "Tetouan", "Tiflet", "Tiznit"
];

function RepClientsPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingClient, setEditingClient] = useState(null);

    const [formData, setFormData] = useState({
        raison_sociale: "",
        ville: "",
        adresse: "",
        gerant: "",
        telephone: ""
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await clientService.getAll({ annee: activeSeason?.name });
            setClients(res?.data?.data || res?.data || []);
        } catch (error) {
            logger("Failed to load clients", "error")();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeSeason?.name) fetchData();
    }, [activeSeason?.name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClient) {
                await clientService.update(editingClient.id, formData);
                toast.success("Client modifié avec succès");
            } else {
                await clientService.create({ ...formData, annee: activeSeason?.name });
                toast.success("Client ajouté avec succès");
            }
            setFormData({ raison_sociale: "", ville: "", adresse: "", gerant: "", telephone: "" });
            setEditingClient(null);
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'opération");
            logger("Failed to save client", "error")();
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            raison_sociale: client.raison_sociale || "",
            ville: client.ville || "",
            adresse: client.adresse || "",
            gerant: client.gerant || "",
            telephone: client.telephone || ""
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) return;
        try {
            await clientService.delete(id);
            toast.success("Client supprimé");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
            logger("Failed to delete client", "error")();
        }
    };

    const handleCancel = () => {
        setEditingClient(null);
        setFormData({ raison_sociale: "", ville: "", adresse: "", gerant: "", telephone: "" });
    };

    const columns = [
        { header: "Raison Social", accessor: "raison_sociale", cell: ({ row }) => (
            <span className="font-bold text-emerald-700">
                {row.original.raison_sociale}
                {row.original.ville && <span className="font-normal text-slate-500 text-xs ml-2">({row.original.ville})</span>}
            </span>
        )},
        { header: "Modifier", accessor: "edit", cell: ({ row }) => (
            <button
                onClick={() => handleEdit(row.original)}
                className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                title="Modifier"
            >
                <Pencil size={16} className="text-blue-600" />
            </button>
        )},
        { header: "Supprimer", accessor: "delete", cell: ({ row }) => (
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
                    <Users size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mes Clients</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Gestion de vos clients
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionContainer
                    title="Liste des clients"
                    icon={Users}
                    headerColor="bg-blue-600"
                    collapsible={true}
                    defaultOpen={true}
                >
                    <MyTable
                        data={clients}
                        columns={columns}
                        pageSize={15}
                        variant="slate"
                        isLoading={isLoading}
                        enableSearch={true}
                        enableSorting={true}
                    />
                </SectionContainer>

                <SectionContainer
                    title={editingClient ? "Modifier un client" : "Ajouter un client"}
                    icon={editingClient ? Pencil : Plus}
                    headerColor="bg-emerald-600"
                    collapsible={true}
                    defaultOpen={true}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Raison Social *</label>
                            <input
                                type="text"
                                required
                                value={formData.raison_sociale}
                                onChange={e => setFormData({ ...formData, raison_sociale: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Nom de la société"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Ville *</label>
                            <select
                                required
                                value={formData.ville}
                                onChange={e => setFormData({ ...formData, ville: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            >
                                <option value="">Choisir une ville</option>
                                {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Adresse *</label>
                            <input
                                type="text"
                                required
                                value={formData.adresse}
                                onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Adresse de la société"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Gérant</label>
                            <input
                                type="text"
                                value={formData.gerant}
                                onChange={e => setFormData({ ...formData, gerant: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Nom du gérant"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Téléphone / Fax</label>
                            <input
                                type="text"
                                value={formData.telephone}
                                onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Téléphone"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all"
                            >
                                {editingClient ? "Modifier" : "Valider"}
                            </button>
                            {editingClient && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all"
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </SectionContainer>
            </div>
        </div>
    );
}

export default RepClientsPage;
