import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { useState, useEffect, useMemo } from "react";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";

function LivresPage() {
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
        annee_publication: "2627"
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
                    console.error("Error deleting livre:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
    }

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");


    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [livresRes, categoriesRes] = await Promise.all([
                livreService.getAll(),
                categoryService.getAll()
            ]);
            const rawLivres = livresRes;
            // logger({ rawLivres })
            setLivres(rawLivres);
            setCategories(categoriesRes);
        } catch (error) {
            console.error("Error fetching data:", error);
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
            annee_publication: "2627"
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
                annee_publication: "2627"
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
                annee_publication: "2627"
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

    const livreSchema = useMemo(
        () => [
            {
                name: "titre",
                label: "Titre du livre",
                placeholder: "Entrer le titre complet",
                value: form.titre,
                onChange: (v) => setForm((prev) => ({ ...prev, titre: v })),
                required: true
            },
            {
                name: "code",
                label: "Code / Référence",
                placeholder: "Ex: R-102",
                value: form.code,
                onChange: (v) => setForm((prev) => ({ ...prev, code: v })),
                required: true
            },
            {
                name: "categorie_id",
                label: "Catégorie",
                placeholder: "Sélectionner une catégorie",
                type: "select",
                inputType: "select",
                items: categories.map(c => ({ label: c.libelle, value: c.id })),
                value: form.categorie_id,
                onChange: (v) => setForm((prev) => ({ ...prev, categorie_id: v })),
            },
            {
                name: "prix_achat",
                label: "Prix d'Achat (DH)",
                type: "number",
                placeholder: "0.00",
                value: form.prix_achat,
                onChange: (v) => setForm((prev) => ({ ...prev, prix_achat: v })),
            },
            {
                name: "prix_vente",
                label: "Prix de Vente (DH)",
                type: "number",
                placeholder: "0.00",
                value: form.prix_vente,
                onChange: (v) => setForm((prev) => ({ ...prev, prix_vente: v })),
            },
            {
                name: "prix_public",
                label: "Prix Public (DH)",
                type: "number",
                placeholder: "0.00",
                value: form.prix_public,
                onChange: (v) => setForm((prev) => ({ ...prev, prix_public: v })),
            },
            {
                name: "nb_pages",
                label: "Nombre de pages",
                type: "number",
                placeholder: "0",
                value: form.nb_pages,
                onChange: (v) => setForm((prev) => ({ ...prev, nb_pages: v })),
            },
            {
                name: "annee_publication",
                label: "Année",
                placeholder: "2026/2027",
                disabled: true,
                value: "2627"
            },
            {
                name: "color_code",
                label: "Couleur",
                type: "color",
                value: form.color_code,
                onChange: (v) => setForm((prev) => ({ ...prev, color_code: v })),
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                // fullWidth: true,
                value: form.description,
                onChange: (v) => setForm((prev) => ({ ...prev, description: v })),
            },
        ],

        [form, categories]
    );

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