import { useState, useMemo, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { BookOpen, Plus, Save, Trash2, Edit, Eye } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import cahierTemplateService from "../../../api/services/cahierTemplateService";

const ModelesCahierTextePage = () => {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        nom: "",
        description: "",
        contenu: "",
        variables: "",
        est_actif: true,
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await cahierTemplateService.getAll();
            setTemplates(res);
        } catch (error) {
            logger("Error fetching cahier templates:", error);
            toast.error("Erreur lors du chargement des modèles");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            nom: "",
            description: "",
            contenu: "",
            variables: "",
            est_actif: true,
        });
        setRowId("");
        setDialogMode("add");
    };

    useEffect(() => {
        if (!isDialogOpen) resetForm();
    }, [isDialogOpen]);

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce modèle ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await cahierTemplateService.delete(row.id);
                    toast.success("Modèle supprimé");
                    fetchData();
                } catch (error) {
                    logger("Error deleting template:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Modèle non supprimé"),
        },
    };

    const columns = [
        { header: "Nom", accessor: "nom" },
        { header: "Description", accessor: "description" },
        { header: "Statut", accessor: "est_actif", type: "bool" },
        { header: "Variables", accessor: "variables" },
    ];

    const schema = useMemo(() => {
        const rules = {
            nom: "required|string|max:255",
            description: "nullable|string",
            contenu: "required|string",
            variables: "nullable|string",
            est_actif: "sometimes|boolean",
        };

        return buildSchemaFromControllerRules({
            rules,
            formData,
            setFormData,
            labels: {
                nom: "Nom du modèle",
                description: "Description",
                contenu: "Contenu du modèle",
                variables: "Variables (séparées par virgules)",
                est_actif: "Actif",
            },
            placeholders: {
                nom: "Ex: Modèle Devoir Quotidien",
                description: "Description courte du modèle",
                contenu: "Utilisez des variables entre accolades {chapitre}, {page}, etc.",
                variables: "chapitre, page, exercice, date",
            },
            selectItems: {
                est_actif: [
                    { label: "Oui", value: true },
                    { label: "Non", value: false },
                ],
            },
            overrides: {
                contenu: { inputType: "textarea", rows: 6 },
                variables: { inputType: "textarea", rows: 2 },
                description: { inputType: "textarea", rows: 2 },
            },
            gridSpan: {
                contenu: "space-y-2 col-span-2",
                variables: "space-y-2 col-span-2",
            },
        });
    }, [formData]);

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await cahierTemplateService.create(formData);
                toast.success("Modèle créé avec succès");
            } else if (dialogMode === "update" && rowId) {
                await cahierTemplateService.update(rowId, formData);
                toast.success("Modèle mis à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving template:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                nom: row.nom || "",
                description: row.description || "",
                contenu: row.contenu || "",
                variables: row.variables || "",
                est_actif: !!row.est_actif,
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                nom: row.nom || "",
                description: row.description || "",
                contenu: row.contenu || "",
                variables: row.variables || "",
                est_actif: !!row.est_actif,
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-6 px-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Modèles Cahier de Texte</h1>
                        <p className="text-slate-500 text-sm">Créez et gérez des modèles de saisie pour vos cahiers de texte</p>
                    </div>
                </div>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} /> Nouveau Modèle
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: { add: "Nouveau modèle", update: "Modifier le modèle", view: "Détails" },
                        subtitle: { add: "Créer un nouveau modèle de cahier de texte", update: "Mettre à jour le modèle", view: "Consultation" },
                        submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
                    }}
                />
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
                <div className="font-bold flex items-center gap-2">
                    <BookOpen size={16} />
                    Conseil d'utilisation
                </div>
                <p className="mt-2 text-blue-700">
                    Les variables comme <code className="bg-white px-2 py-0.5 rounded text-xs">{"{chapitre}"}</code>, <code className="bg-white px-2 py-0.5 rounded text-xs">{"{page}"}</code> seront 
                    automatiquement remplacées lors de la saisie réelle dans le cahier de texte.
                </p>
            </div>

            {/* Templates Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={templates}
                    columns={columns}
                    pageSize={10}
                    actions={["view", "edit", "delete"]}
                    onAction={handleAction}
                    variant="slate"
                    isLoading={isLoading}
                    actionsDetaille={actionsDetaille}
                    enableSearch
                    enableSorting
                />
            </div>
        </div>
    );
};

export default ModelesCahierTextePage;
