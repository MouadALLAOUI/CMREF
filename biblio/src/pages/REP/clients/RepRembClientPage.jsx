import { useState, useEffect } from "react";
import { DollarSign, Trash2 } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import clientRemboursementService from "../../../api/services/clientRemboursementService";
import clientService from "../../../api/services/clientService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepRembClientPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [remboursements, setRemboursements] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        client_id: "",
        date_payment: "",
        banque: "",
        cheque_number: "",
        type_versement: "",
        montant: "",
        date_prevue: ""
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [rembRes, clientsRes] = await Promise.all([
                clientRemboursementService.getAll({ annee: activeSeason?.name }),
                clientService.getAll({ annee: activeSeason?.name })
            ]);
            setRemboursements(rembRes?.data?.data || rembRes?.data || []);
            setClients(clientsRes?.data?.data || clientsRes?.data || []);
        } catch (error) {
            logger("Failed to load client remboursement data", "error")();
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
            await clientRemboursementService.create({
                ...formData,
                montant: parseFloat(formData.montant),
                annee: activeSeason?.name
            });
            toast.success("Remboursement enregistré");
            setFormData({ client_id: "", date_payment: "", banque: "", cheque_number: "", type_versement: "", montant: "", date_prevue: "" });
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
            logger("Failed to create client remboursement", "error")();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce remboursement ?")) return;
        try {
            await clientRemboursementService.delete(id);
            toast.success("Remboursement supprimé");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
            logger("Failed to delete client remboursement", "error")();
        }
    };

    const columns = [
        { header: "Client", accessor: "client", cell: ({ row }) => row.original.client?.raison_sociale || "—" },
        { header: "Date", accessor: "date_payment", cell: ({ getValue }) => {
            const d = getValue();
            return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
        }},
        { header: "Banque", accessor: "banque" },
        { header: "Chèque N°", accessor: "cheque_number" },
        { header: "Montant (DH)", accessor: "montant", cell: ({ getValue }) => (
            <span className="font-bold">{(getValue() || 0).toLocaleString()} DH</span>
        )},
        { header: "Supprimer", accessor: "actions", cell: ({ row }) => (
            <button
                onClick={() => handleDelete(row.original.id)}
                className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            >
                <Trash2 size={16} className="text-red-600" />
            </button>
        )}
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <DollarSign size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Remboursement Client</h1>
                    <p className="text-slate-500 text-xs mt-0.5">Enregistrer les remboursements clients</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionContainer title="Remboursements" icon={DollarSign} headerColor="bg-blue-600" collapsible={true} defaultOpen={true}>
                    <MyTable data={remboursements} columns={columns} pageSize={15} variant="slate" isLoading={isLoading} enableSearch={true} enableSorting={true} />
                </SectionContainer>

                <SectionContainer title="Ajouter un remboursement" icon={DollarSign} headerColor="bg-emerald-600" collapsible={true} defaultOpen={true}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Client *</label>
                            <select required value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900">
                                <option value="">Sélectionner un client</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.raison_sociale}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Date *</label>
                            <input type="date" required value={formData.date_payment} onChange={e => setFormData({ ...formData, date_payment: e.target.value })} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Banque *</label>
                            <input type="text" required value={formData.banque} onChange={e => setFormData({ ...formData, banque: e.target.value })} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900" placeholder="Nom de la banque" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Chèque N° *</label>
                            <input type="text" required value={formData.cheque_number} onChange={e => setFormData({ ...formData, cheque_number: e.target.value })} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900" placeholder="Numéro de chèque" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Type de virement</label>
                            <select value={formData.type_versement} onChange={e => setFormData({ ...formData, type_versement: e.target.value })} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900">
                                <option value="">Sélectionner</option>
                                <option value="En main propre">En main propre</option>
                                <option value="Déplacé">Déplacé</option>
                                <option value="Virement">Virement</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Montant (DH) *</label>
                            <input type="number" step="0.01" required value={formData.montant} onChange={e => setFormData({ ...formData, montant: e.target.value })} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900" placeholder="Montant" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Date prévue</label>
                            <input type="date" value={formData.date_prevue} onChange={e => setFormData({ ...formData, date_prevue: e.target.value })} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>
                        <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all">
                            Enregistrer
                        </button>
                    </form>
                </SectionContainer>
            </div>
        </div>
    );
}

export default RepRembClientPage;
