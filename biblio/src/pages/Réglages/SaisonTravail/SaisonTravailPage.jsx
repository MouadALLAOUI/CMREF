import { useEffect, useState, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import { CalendarDays, Save, Plus, Trash, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import seasonsService from "../../../api/services/seasonsService";
// import { buildSchemaFromControllerRules } from "../../../lib/schemaBuilder"; // Adjust path according to your structure
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";

const SaisonTravailPage = () => {
    // List & Core Selection Management States
    const [seasons, setSeasons] = useState([]);
    const [activeSeason, setActiveSeason] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // UniversalDialog Control States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        start_year: "",
        end_year: "",
        start_date: "",
        end_date: ""
    });

    // Simulated/Inferred Controller rules dictionary passing to the generator matrix
    const controllerValidationRules = {
        name: "required|string",
        start_year: "required|numeric",
        end_year: "required|numeric",
        start_date: "required|date",
        end_date: "required|date"
    };

    // Build Schema dynamically via the generator utility
    const dialogSchema = useMemo(() => {
        return buildSchemaFromControllerRules({
            rules: controllerValidationRules,
            formData,
            setFormData,
            labels: {
                name: "Code Unique (ex: 26/27)",
                start_year: "Année de Début",
                end_year: "Année de Fin",
                start_date: "Date de Début",
                end_date: "Date de Fin"
            },
            placeholders: {
                name: "Ex: 26/27",
                start_year: "Ex: 2026",
                end_year: "Ex: 2027"
            },
            gridSpan: {
                name: "col-span-full md:col-span-2",
                start_year: "col-span-1",
                end_year: "col-span-1",
                start_date: "col-span-1",
                end_date: "col-span-1"
            }
        });
    }, [formData]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await seasonsService.getAll();
            setSeasons(data);

            const currentActive = data.find(s => s.is_active);
            if (currentActive) {
                setActiveSeason(currentActive.name);
            }
        } catch (error) {
            logger.error({ "Error fetching seasons data:": error });
            toast.error("Erreur lors de la récupération des saisons");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Change System-wide Active Season via Left Selector Panel
    const handleSetActiveSeason = async () => {
        if (!activeSeason) {
            toast.error("Veuillez sélectionner une saison");
            return;
        }
        setIsSaving(true);
        try {
            await seasonsService.setActive({ annee: activeSeason });
            toast.success(`La saison ${activeSeason} est maintenant active.`);
            await fetchData();
        } catch (error) {
            logger.error({ "Error updating active status:": error });
            toast.error(error.response?.data?.message || "Erreur d'activation");
        } finally {
            setIsSaving(false);
        }
    };

    // Toggle row active/inactive status immediately via table boolean selection click
    const handleToggleSeasonStatus = async (row) => {
        try {
            if (!row || !row.id) {
                toast.error("Données de ligne invalides.");
                return;
            }

            // 1. Calculate the opposite state dynamically based on what was clicked
            const nextStatusValue = !row.is_active;
            // Pass the structural parameters required by the updated rules
            await seasonsService.setActive({
                season_id: row.id,
                is_active: nextStatusValue
            });

            toast.success(`La saison ${row.name} est maintenant ${nextStatusValue ? 'activée' : 'désactivée'}.`);
            await fetchData();
        } catch (error) {
            logger.error({ "Status toggle failed:": error });
            toast.error(error.response?.data?.message || "Impossible de changer le statut");
        } finally {
            setIsSaving(false);
        }
    };

    // Handle submission of the generated UniversalDialog fields
    const handleAddSeasonSubmit = async () => {
        try {
            await seasonsService.create(formData);
            toast.success("Nouvelle saison ajoutée avec succès");
            setIsDialogOpen(false);
            handleResetForm();
            fetchData();
        } catch (error) {
            logger.error({ "Creation failed:": error });
            toast.error(error.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleResetForm = () => {
        setFormData({
            name: "",
            start_year: "",
            end_year: "",
            start_date: "",
            end_date: ""
        });
    };

    const handleTableAction = async (actionType, row) => {
        if (actionType === "delete") {
            try {
                await seasonsService.delete(row.id);
                toast.success("Saison supprimée définitivement.");
                fetchData();
            } catch (error) {
                logger.error({ "Deletion failed:": error });
                toast.error(error.response?.data?.message || "Impossible de supprimer la saison");
            }
        }
    };

    // Configuration rules mapping layout components to MyTable
    const tableColumns = [
        { header: "Code Unique (Nom)", accessor: "name" },
        { header: "Date de Début", accessor: "start_date", type: "date" },
        { header: "Date de Fin", accessor: "end_date", type: "date" },
        {
            header: "Statut Actif",
            accessor: "is_active",
            type: "bool",
            // Passing onClick binding handles real-time modification events right inside the row cell
            onClick: (row) => handleToggleSeasonStatus(row)
        }
    ];

    const actionsDetaille = {
        delete: {
            type: "delete",
            icon: Trash,
            title: "Supprimer la Saison de Travail",
            description: "Êtes-vous sûr de vouloir supprimer cette saison ? Cette action est irréversible.",
            cancelText: "Annuler",
            actionText: "Supprimer",
            onOk: (row) => handleTableAction("delete", row),
            onCancel: () => false,
        }
    };

    const dialogConfig = {
        title: { add: "Créer une Nouvelle Saison" },
        subtitle: { add: "Renseignez les paramètres temporels requis par le système de gestion." },
        submitLabel: "Enregistrer"
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                <p className="text-slate-500 font-medium italic">Chargement du panneau de configuration...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Page Header Banner */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                        <CalendarDays size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">SAISONS DE TRAVAIL</h1>
                        <p className="text-slate-500 text-xs mt-0.5">Pilotez et distribuez les fenêtres académiques actives sur la plateforme.</p>
                    </div>
                </div>

                {/* Universal Dialog Action Trigger Button */}
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    schema={dialogSchema}
                    mode="add"
                    config={dialogConfig}
                    onSubmit={handleAddSeasonSubmit}
                    handleReset={handleResetForm}
                    grid={2}
                    trigger={
                        <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-100 h-11">
                            <Plus size={18} />
                            Nouvelle Saison
                        </Button>
                    }
                />
            </div>

            {/* Layout Configuration Grid Splitter */}
            <div className="flex flex-col gap-8 ">
                {/* RIGHT SIDE PANEL: Full Interactive Actions Ledger */}
                <div>
                    <SectionContainer title="Historique des Saisons Disponibles" icon={CalendarDays} headerColor="bg-blue-600" collapsible={false}>
                        <MyTable
                            data={seasons}
                            columns={tableColumns}
                            actions={["delete"]}
                            actionsDetaille={actionsDetaille}
                            onAction={handleTableAction}
                            variant="outline"
                            pageSize={5}
                            enableSearch={true}
                            enableSorting={true}
                        />
                    </SectionContainer>
                </div>
            </div>
        </div>
    );
};

export default SaisonTravailPage;