import { useState, useEffect } from "react";
import { ClipboardList, Trash2, Eye } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import carteVisiteService from "../../../api/services/carteVisiteService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepCartesSuiviPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await carteVisiteService.getAll({ annee: activeSeason?.name });
            setRows(res?.data?.data || res?.data || []);
        } catch (error) {
            logger("Failed to load carte visite commands", "error")();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeSeason?.name) fetchData();
    }, [activeSeason?.name]);

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;
        try {
            await carteVisiteService.delete(id);
            toast.success("Commande supprimée");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
            logger("Failed to delete carte visite command", "error")();
        }
    };

    const columns = [
        { header: "N°", accessor: "id", cell: (_, __, i) => i + 1 },
        { header: "Nom & Prénom", accessor: "nom_sur_carte" },
        { header: "Détails", accessor: "details", cell: ({ row }) => (
            <button
                onClick={() => setSelectedRow(row.original)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Voir les détails"
            >
                <Eye size={16} className="text-slate-600" />
            </button>
        )},
        { header: "Remarques", accessor: "remarques", cell: ({ getValue }) => (
            <span className="text-xs text-slate-500">{getValue() || "—"}</span>
        )},
        { header: "Conception CV", accessor: "conception_carte", cell: ({ getValue }) => {
            const v = getValue();
            return v ? (
                <a href={v} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">
                    Voir
                </a>
            ) : <span className="text-slate-300 text-xs">—</span>;
        }},
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
                    <ClipboardList size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Suivi des commandes</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Suivi de vos commandes de cartes de visite et chevalets
                    </p>
                </div>
            </div>

            <SectionContainer
                title="Liste des commandes"
                icon={ClipboardList}
                headerColor="bg-blue-600"
                collapsible={true}
                defaultOpen={true}
            >
                <MyTable
                    data={rows}
                    columns={columns}
                    pageSize={15}
                    variant="slate"
                    isLoading={isLoading}
                    enableSearch={true}
                    enableSorting={true}
                />
            </SectionContainer>

            {selectedRow && (
                <SectionContainer
                    title={`Détails de la commande : ${selectedRow.nom_sur_carte || "—"}`}
                    icon={Eye}
                    headerColor="bg-slate-700"
                    collapsible={true}
                    defaultOpen={true}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-bold text-slate-700">Nom :</span> {selectedRow.nom_sur_carte || "—"}
                        </div>
                        <div>
                            <span className="font-bold text-slate-700">Fonction :</span> {selectedRow.fonction || "—"}
                        </div>
                        <div>
                            <span className="font-bold text-slate-700">Téléphone :</span> {selectedRow.tel || "—"}
                        </div>
                        <div>
                            <span className="font-bold text-slate-700">Email :</span> {selectedRow.email || "—"}
                        </div>
                        <div className="md:col-span-2">
                            <span className="font-bold text-slate-700">Adresse :</span> {selectedRow.adresse || "—"}
                        </div>
                        {selectedRow.model && (
                            <div className="md:col-span-2">
                                <span className="font-bold text-slate-700">Modèle :</span>{" "}
                                <img src={selectedRow.model} alt="Modèle" className="inline-block h-16 ml-2 rounded" />
                            </div>
                        )}
                        {selectedRow.chevalet_ligne_1 && (
                            <div className="md:col-span-2">
                                <span className="font-bold text-slate-700">Chevalet :</span>
                                <p className="ml-4 text-slate-600">
                                    {selectedRow.chevalet_ligne_1}<br/>
                                    {selectedRow.chevalet_ligne_2}<br/>
                                    {selectedRow.chevalet_ligne_3}
                                </p>
                            </div>
                        )}
                    </div>
                </SectionContainer>
            )}
        </div>
    );
}

export default RepCartesSuiviPage;
