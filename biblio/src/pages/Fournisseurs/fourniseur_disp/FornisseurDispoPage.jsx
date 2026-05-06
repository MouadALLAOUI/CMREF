import { useState, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import imprimeurService from "../../../api/services/imprimeurService";
import toast from "react-hot-toast";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";

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
            description: "Êtes-vous sûr de vouloir supprimer ce fornisseur?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await imprimeurService.delete(row.id);
                    toast.success("Catégorie supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting category:", error);
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
            logger(("Error fetching fournisseurs:", error), "error");
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

    const schema = useMemo(() => [
        {
            type: "section",
            label: "Informations Générales"
        },
        {
            name: "raison_sociale",
            label: "Raison Sociale",
            placeholder: "Ex: SARL Librairie Centrale",
            value: form.raison_sociale,
            onChange: (v) => setForm(prev => ({ ...prev, raison_sociale: v })),
            required: true,
            gridSpan: 2 // Assuming your UniversalDialog handles col-span-2
        },
        {
            name: "adresse",
            label: "Adresse Complète",
            placeholder: "Adresse du siège...",
            value: form.adresse,
            onChange: (v) => setForm(prev => ({ ...prev, adresse: v })),
            gridSpan: 2
        },
        {
            type: "section",
            label: "Informations Directeur"
        },
        {
            name: "directeur_nom",
            label: "Nom Directeur",
            placeholder: "Nom et Prénom",
            value: form.directeur_nom,
            onChange: (v) => setForm(prev => ({ ...prev, directeur_nom: v })),
        },
        {
            name: "directeur_email",
            label: "Email",
            type: "email",
            placeholder: "directeur@email.com",
            value: form.directeur_email,
            onChange: (v) => setForm(prev => ({ ...prev, directeur_email: v })),
        },
        {
            name: "directeur_tel",
            label: "Téléphone",
            placeholder: "06XXXXXXXX",
            value: form.directeur_tel,
            onChange: (v) => setForm(prev => ({ ...prev, directeur_tel: v })),
        },
        {
            type: "section",
            label: "Informations Adjoint"
        },
        {
            name: "adjoint_nom",
            label: "Nom Adjoint",
            placeholder: "Nom et Prénom",
            value: form.adjoint_nom,
            onChange: (v) => setForm(prev => ({ ...prev, adjoint_nom: v })),
        },
        {
            name: "adjoint_email",
            label: "Email",
            type: "email",
            placeholder: "adjoint@email.com",
            value: form.adjoint_email,
            onChange: (v) => setForm(prev => ({ ...prev, adjoint_email: v })),
        },
        {
            name: "adjoint_tel",
            label: "Téléphone",
            placeholder: "06XXXXXXXX",
            value: form.adjoint_tel,
            onChange: (v) => setForm(prev => ({ ...prev, adjoint_tel: v })),
        },
    ], [form]);

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