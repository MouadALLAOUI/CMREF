import { useState, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import imprimeurService from "../../../api/services/imprimeurService";
import toast from "react-hot-toast";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";

const IMPRIMEUR_RULES = {
    raison_sociale: 'required|string|max:255',
    adresse: 'nullable|string',
    directeur_nom: 'nullable|string|max:255',
    directeur_tel: 'nullable|string|max:20',
    directeur_email: 'nullable|string|email|max:255',
    adjoint_nom: 'nullable|string|max:255',
    adjoint_tel: 'nullable|string|max:20',
    adjoint_email: 'nullable|string|email|max:255',
};

const IMPRIMEUR_LABELS = {
    raison_sociale: "Raison Sociale",
    adresse: "Adresse Complète",
    directeur_nom: "Nom Directeur",
    directeur_tel: "Téléphone",
    directeur_email: "Email",
    adjoint_nom: "Nom Adjoint",
    adjoint_tel: "Téléphone",
    adjoint_email: "Email",
};

const IMPRIMEUR_PLACEHOLDERS = {
    raison_sociale: "Ex: SARL Librairie Centrale",
    adresse: "Adresse du siège...",
    directeur_nom: "Nom et Prénom",
    directeur_tel: "06XXXXXXXX",
    directeur_email: "directeur@email.com",
    adjoint_nom: "Nom et Prénom",
    adjoint_tel: "06XXXXXXXX",
    adjoint_email: "adjoint@email.com",
};

const IMPRIMEUR_GRID = {
    raison_sociale: "col-span-2",
    adresse: "col-span-2",
};

function FournisseursDisponibles() {
    const [imprimeurs, setImprimeurs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [impId, setImpId] = useState("");
    const [form, setForm] = useState({
        raison_sociale: "",
        adresse: "",
        directeur_nom: "",
        directeur_tel: "",
        directeur_email: "",
        adjoint_nom: "",
        adjoint_tel: "",
        adjoint_email: "",
    })

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce fournisseur?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await imprimeurService.delete(row.id);
                    toast.success("Catégorie supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting category:", error)();
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await imprimeurService.getAll();
            setImprimeurs(response);
        } catch (error) {
            logger(("Error fetching fournisseurs:", error), "error")();
            toast.error("Erreur lors du chargement des fournisseurs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAction = async (type, row) => {
        if (type === "edit" || type === "view") {
            setDialogMode(type === "edit" ? "update" : "view");
            setImpId(row.id);
            setForm(row);
            setDialogOpen(true);
        }
    };

    const handleFormSubmit = async () => {
        try {
            const data = form;
            if (dialogMode === "add") {
                await imprimeurService.create(data);
                toast.success("Fournisseur ajouté !");
            } else {
                await imprimeurService.update(impId, data);
                toast.success("Fournisseur mis à jour !");
            }
            setDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du fournisseur");
        }
    };

    const resetForm = () => {
        setForm({
            raison_sociale: "",
            adresse: "",
            directeur_nom: "",
            directeur_tel: "",
            directeur_email: "",
            adjoint_nom: "",
            adjoint_tel: "",
            adjoint_email: "",
        })
    };

    const baseSchema = useMemo(() => buildSchemaFromControllerRules({
        rules: IMPRIMEUR_RULES,
        formData: form,
        setFormData: setForm,
        labels: IMPRIMEUR_LABELS,
        placeholders: IMPRIMEUR_PLACEHOLDERS,
        gridSpan: IMPRIMEUR_GRID,
        exclude: ["id", "created_at", "updated_at"],
    }), [form]);

    const schema = useMemo(() => {
        const sections = [
            { type: "section", label: "Informations Générales" },
            "raison_sociale", "adresse",
            { type: "section", label: "Informations Directeur" },
            "directeur_nom", "directeur_email", "directeur_tel",
            { type: "section", label: "Informations Adjoint" },
            "adjoint_nom", "adjoint_email", "adjoint_tel",
        ];
        const fieldMap = Object.fromEntries(baseSchema.map(f => [f.name, f]));
        return sections.map(s => typeof s === "string" ? fieldMap[s] : s).filter(Boolean);
    }, [baseSchema]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des Fournisseurs</h1>
                <UniversalDialog
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) resetForm();
                    }}
                    mode={dialogMode}
                    schema={schema}
                    onSubmit={() => handleFormSubmit(form)}
                    config={{
                        title: { add: "Nouveau Fournisseur", update: "Modifier Fournisseur", view: "Détails Fournisseur" },
                        subtitle: { add: "Enregistrer un partenaire.", update: "Mettre à jour les infos.", view: "Consultation." },
                        submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
                    }}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]"
                        >
                            + Ajouter un fournisseur
                        </Button>
                    }
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={imprimeurs}
                    variant="green"
                    pageSize={5}
                    actions={["view", "edit", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={[
                        { header: "Raison Social", accessor: "raison_sociale" },
                    ]}
                    actionsDetaille={actionsDetaille}
                    enableSearch enableSorting
                />
            </div>
        </div>
    )
}

export default FournisseursDisponibles;