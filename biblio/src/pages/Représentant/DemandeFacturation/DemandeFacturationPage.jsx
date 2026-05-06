import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import demandeFService from "../../../api/services/demandeFService";
import { FileText } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";

function DemandeFacturationPage() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Grouping Logic: Split data by "type" (e.g., MSM-MEDIAS, WATANIYA)
    const groupedData = useMemo(() => {
        return rows.reduce((acc, row) => {
            const key = row.type || "AUTRE";
            if (!acc[key]) acc[key] = [];
            acc[key].push(row);
            return acc;
        }, {});
    }, [rows]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await demandeFService.getAll();
            logger({ res })
            setRows(res);
        } catch (error) {
            logger("Error fetching demande facturation:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleTransform = async (row) => {
        if (row.livree) {
            toast.error("Cette demande est déjà facturée.");
            return;
        }
        try {
            setIsLoading(true);

            await demandeFService.validateAndTransform(row.id);
            toast.success("Demande transformée en facture avec succès !");
            fetchData();
        } catch (error) {
            logger("Error transforming demande:", error);
            const message = error.response?.data?.message || "Erreur lors de la transformation";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer cette demande ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await demandeFService.delete(row);
                    toast.success("Demande supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting demande:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Date", accessor: "date_demande", type: "date" },
        { header: "Client", accessor: "client.raison_sociale" },
        { header: "ICE", accessor: "client.ice" },
        { header: "Contenu", accessor: "contenu" },
        {
            header: "Facture N°",
            accessor: "fact.fact_number || ''",
            className: "font-mono text-xs text-slate-500"
        },
        {
            header: "Montant HT",
            accessor: "fact.total_ht",
            type: "currency",
        },
        { header: "Remise", accessor: "fact.tva_rate", type: "rate" },
        {
            header: "Net TTC",
            accessor: "fact.total_ttc",
            type: "currency",
        },
        {
            header: "Valider",
            accessor: "statut",
            type: "bool",
            onClick: (row) => handleTransform(row),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Demandes de facturation</h1>
            </div>

            <div className="rounded-2xl overflow-hidden">
                {Object.keys(groupedData).length > 0 ? (
                    <div className="space-y-6">
                        {Object.entries(groupedData).map(([type, data]) => (
                            <SectionContainer
                                key={type}
                                title={`Facture ${type}`}
                                icon={FileText}
                                headerColor="bg-[#1ebba3]"
                                collapsible={true}
                                defaultOpen={true}
                            >
                                <MyTable
                                    data={data}
                                    columns={columns}
                                    pageSize={5}
                                    actions={["delete"]}
                                    variant="slate"
                                    isLoading={isLoading}
                                    actionsDetaille={actionsDetaille}
                                    enableSearch
                                    enableSorting
                                />
                            </SectionContainer>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">Aucune demande trouvée</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DemandeFacturationPage;
