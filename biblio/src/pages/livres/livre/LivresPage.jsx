/* eslint-disable no-console */
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { useState, useEffect, useMemo } from "react";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import useAppStore from "../../../store/useAppStore";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";

const LIVRE_RULES = {
    titre: 'required|string|max:255',
    code: 'required|string|max:50',
    categorie_id: 'required|uuid|exists:categories,id',
    prix_achat: 'required|numeric|min:0',
    prix_vente: 'required|numeric|min:0',
    prix_public: 'required|numeric|min:0',
    nb_pages: 'required|integer|min:0',
    color_code: 'sometimes|string|max:7',
    description: 'nullable|string',
    annee_publication: 'nullable|string|max:4',
};

const LIVRE_LABELS = {
    titre: "Titre du livre",
    code: "Code / Référence",
    categorie_id: "Catégorie",
    prix_achat: "Prix d'Achat (DH)",
    prix_vente: "Prix de Vente (DH)",
    prix_public: "Prix Public (DH)",
    nb_pages: "Nombre de pages",
    color_code: "Couleur",
    description: "Description",
    annee_publication: "Année",
};

const LIVRE_PLACEHOLDERS = {
    titre: "Entrer le titre complet",
    code: "Ex: R-102",
    categorie_id: "Sélectionner une catégorie",
    prix_achat: "0.00",
    prix_vente: "0.00",
    prix_public: "0.00",
    nb_pages: "0",
};

function LivresPage() {
    const { activeSeason } = useAppStore();
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [form, setForm] = useState({
        titre: "",
        code: "",
        categorie_id: "",
        prix_achat: "",
        prix_vente: "",
        prix_public: "",
        nb_pages: "",
        color_code: "#FFFFFF",
        description: "",
        annee_publication: activeSeason?.label || ""
    });
    const [livreID, setLivreID] = useState("");
    const actionsDetaille = {
        delete: {
            title: "",
            description: "Êtes-vous sûr de vouloir supprimer cette catégorie ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await livreService.delete(row.id);
                    toast.success("Livre supprimé");
                    fetchData();
                } catch (error) {
                    logger({ msg: "Error deleting livre", error }, "error")();
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
    }

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    // Sync activeSeason.label with form.annee_publication when in 'add' mode or when activeSeason changes
    useEffect(() => {
        if (dialogMode === "add" && activeSeason?.label) {
            setForm(prev => ({ ...prev, annee_publication: activeSeason.label }));
        }
    }, [activeSeason, dialogMode]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [livresRes, categoriesRes] = await Promise.all([
                livreService.getAll(),
                categoryService.getAll()
            ]);
            setLivres(livresRes);
            setCategories(categoriesRes);
            console.log({ livresRes, categoriesRes })
        } catch (error) {
            logger({ msg: "Error fetching data", error }, "error")();
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleFormSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await livreService.create(form);
                toast.success("Livre ajouté !");
            } else if (dialogMode === "update" && livreID) {
                await livreService.update(livreID, form);
                toast.success("Livre mis à jour !");
            }
            setDialogOpen(false);
            fetchData();
            resetForm();
        } catch (error) {
            toast.error("Une erreur est survenue");
        }
    };

    const resetForm = () => {
        setForm({
            titre: "",
            code: "",
            categorie_id: "",
            prix_achat: "",
            prix_vente: "",
            prix_public: "",
            nb_pages: "",
            color_code: "#FFFFFF",
            description: "",
            annee_publication: activeSeason?.label || ""
        });
    };

    const handleAction = async (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setForm({
                titre: row.titre || "",
                code: row.code || "",
                categorie_id: row.categorie_id || "",
                prix_achat: row.prix_achat || 0,
                prix_vente: row.prix_vente || 0,
                prix_public: row.prix_public || 0,
                nb_pages: row.nb_pages || 0,
                color_code: row.color_code || "#FFFFFF",
                description: row.description || "",
                annee_publication: row.annee_publication || activeSeason?.label || ""
            });
            setLivreID(row.id);
            setDialogOpen(true);
        }
        if (type === "view") {
            setDialogMode("view");
            setForm({
                titre: row.titre || "",
                code: row.code || "",
                categorie_id: row.categorie_id || "",
                prix_achat: row.prix_achat || 0,
                prix_vente: row.prix_vente || 0,
                prix_public: row.prix_public || 0,
                nb_pages: row.nb_pages || 0,
                color_code: row.color_code || "#FFFFFF",
                description: row.description || "",
                annee_publication: row.annee_publication || activeSeason?.label || ""
            });
            setDialogOpen(true);
        }
    };

    const columns = [
        { header: "Titre", accessor: "titre" },
        { header: "Code", accessor: "code" },
        { header: "Catégorie", accessor: "category.libelle" },
        { header: "Achat (DH)", accessor: "prix_achat", type: "curr" },
        { header: "Vente (DH)", accessor: "prix_vente", type: "curr" },
        { header: "P. publique (DH)", accessor: "prix_public", type: "curr" },
        { header: "Nombre de pages", accessor: "nb_pages" },
    ]

    const baseLivreSchema = useMemo(() => buildSchemaFromControllerRules({
        rules: LIVRE_RULES,
        formData: form,
        setFormData: setForm,
        labels: LIVRE_LABELS,
        placeholders: LIVRE_PLACEHOLDERS,
        selectItems: {
            categorie_id: categories.map(c => ({ label: c.libelle, value: c.id })),
        },
        exclude: ["id", "created_at", "updated_at"],
    }), [form, categories]);

    const livreSchema = useMemo(() => baseLivreSchema.map(field => {
        if (field.name === "color_code") return { ...field, type: "color" };
        if (field.name === "description") return { ...field, inputType: "textarea" };
        if (field.name === "annee_publication") return {
            ...field,
            placeholder: activeSeason?.label
                ? `${activeSeason.label.slice(0, 2)}/${activeSeason.label.slice(2)}`
                : "----",
            disabled: true,
            value: form.annee_publication || activeSeason?.label || "",
        };
        return field;
    }), [baseLivreSchema, activeSeason, form.annee_publication]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des livres</h1>
                <UniversalDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    mode={dialogMode}
                    title={dialogMode === "add" ? "Nouveau Livre" : "Modifier Livre"}
                    schema={livreSchema}
                    onSubmit={handleFormSubmit}
                    config={{
                        title: { add: "Nouveau Livre", update: "Modifier Livre", view: "Détails" },
                        subtitle: { add: "Créer un Livre.", update: "Mettre à jour.", view: "Voir." },
                        submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
                    }}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 text-white rounded-xl"
                        >
                            + Nouveau Livre
                        </Button>
                    }
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={livres}
                    variant="slate"
                    pageSize={10}
                    actions={["edit", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={columns}
                    actionsDetaille={actionsDetaille}
                    enableSearch enableSorting
                />
            </div>
        </div>
    )
}

export default LivresPage;