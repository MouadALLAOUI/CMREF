import { useState, useEffect } from "react";
import { ClipboardList, Trash2 } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import cahierCommunicationService from "../../../api/services/cahierCommunicationService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepCahierSuiviPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await cahierCommunicationService.getAll({ annee: activeSeason?.label });
            setRows(res?.data?.data || res?.data || []);
        } catch (error) {
            logger("Failed to load cahier commands", "error")();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeSeason?.label) fetchData();
    }, [activeSeason?.label]);

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;
        try {
            await cahierCommunicationService.delete(id);
            toast.success("Commande supprimée");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
            logger("Failed to delete cahier command", "error")();
        }
    };

    const columns = [
        { header: "N°", accessor: "id", cell: (_, __, i) => i + 1 },
        { header: "École", accessor: "ecole" },
        { header: "Type", accessor: "type" },
        { header: "Qté", accessor: "qte" },
        { header: "Indication", accessor: "indication", cell: ({ getValue }) => (
            <span className="text-xs text-slate-500">{getValue() || "—"}</span>
        )},
        { header: "Modèle", accessor: "model_recto", cell: ({ getValue }) => {
            const v = getValue();
            return v ? (
                <a href={v} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">
                    Voir
                </a>
            ) : <span className="text-slate-300 text-xs">—</span>;
        }},
        { header: "Remarques", accessor: "remarques", cell: ({ getValue }) => (
            <span className="text-xs text-slate-500">{getValue() || "—"}</span>
        )},
        { header: "Bon de Commande", accessor: "bon_de_commande", cell: ({ getValue }) => (
            <span className="text-xs text-slate-500">{getValue() || "—"}</span>
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
                    <ClipboardList size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Suivi des commandes</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Suivi de vos commandes de cahier de texte
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
        </div>
    );
}

export default RepCahierSuiviPage;
