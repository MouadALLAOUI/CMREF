import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import representantService from "../../../api/services/representantService";
import destinationService from "../../../api/services/destinationService";
import toast from "react-hot-toast";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { echo } from "../../../api/helpers/echo";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";

const REPRESENTANT_RULES = {
    nom: 'required|string|max:255',
    cin: 'required|string|max:20',
    destination_id: 'nullable|uuid|exists:destinations,id',
    tel: 'nullable|string|max:20',
    email: 'nullable|string|email|max:255',
    adresse: 'nullable|string',
    code_postale: 'nullable|string|max:10',
    ville: 'nullable|string|max:100',
    lieu_de_travail: 'nullable|string|max:255',
    login: 'required|string|max:100',
    password: 'required|string|min:8',
};

const REPRESENTANT_LABELS = {
    nom: "Nom et prénom",
    cin: "N° de CIN",
    destination_id: "Zone",
    tel: "Tél",
    email: "E-mail",
    adresse: "Adresse",
    code_postale: "Code postale",
    ville: "Ville",
    lieu_de_travail: "Lieu de travail",
    login: "Login",
    password: "Mot de passe",
};

const REPRESENTANT_PLACEHOLDERS = {
    nom: "Ex: Mohamed",
    cin: "XX00000",
    destination_id: "Choisir une zone",
    tel: "Téléphone",
    email: "Ex: rep@gmail.com",
    adresse: "Adresse",
    code_postale: "Code postale",
    ville: "Ville",
    lieu_de_travail: "Lieu de travail",
    login: "Login",
    password: "Mot de passe",
};

const REPRESENTANT_GRID = {
    lieu_de_travail: "col-span-2",
};

function ReprésentantDisponibles() {
    const [representants, setRepresentants] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [repId, setRepId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // 1. Centralized State Object
    const [formData, setFormData] = useState({
        nom: "",
        cin: "",
        destination_id: "",
        tel: "",
        email: "",
        adresse: "",
        code_postale: "",
        ville: "",
        lieu_de_travail: "",
        login: "",
        password: ""
    });

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce représentants?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await representantService.delete(row.id);
                    toast.success("représentants supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting représentants:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("représentants pas supprimé"),
        },
    };
    const columns = [
        { header: "Représentants", accessor: "nom" },
        {
            header: "Statut & Visite",
            accessor: "login.last_visit",
            type: "date",
            /* keep this comment even you remake the files (no touch for ai)
            // subType: "date",
            // showTime: true,
            // statusAccessor: "login.is_online",
            // verifyOnline: false
            */
        },
        { header: "Compte active", accessor: "login.is_active", type: "bool", onClick: (row) => handleActiveCompte(row) },
    ]

    const handleActiveCompte = async (row) => {
        try {
            setIsLoading(true);
            await representantService.active_compte({
                username: row.login.username,
                is_active: !row.login.is_active
            });

            toast.success(row.login.is_active ? "Compte désactivé" : "Compte activé");
            fetchData();
        } catch (error) {
            logger("Error activating compte:", error);
            toast.error("Erreur lors de l'activation du compte");
        } finally {
            setIsLoading(false);
        }
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const baseSchema = useMemo(() => buildSchemaFromControllerRules({
        rules: REPRESENTANT_RULES,
        formData,
        setFormData,
        labels: REPRESENTANT_LABELS,
        placeholders: REPRESENTANT_PLACEHOLDERS,
        gridSpan: REPRESENTANT_GRID,
        selectItems: {
            destination_id: destinations.map((d) => ({ label: d.destination, value: d.id })),
        },
        exclude: ["bl_count", "remb_count"],
    }), [formData, destinations]);

    const dialog_schema = useMemo(() => {
        const schema = baseSchema.map(field => {
            if (field.name === "adresse") return { ...field, inputType: "textarea" };
            if (field.name === "lieu_de_travail") return { ...field, inputType: "textarea" };
            if (field.name === "password") return {
                ...field,
                inputType: "password",
                type: "password",
                required: dialogMode === "add",
            };
            if (field.name === "cin") return {
                ...field,
                pattern: "^[A-Za-z]{1,2}[0-9]+$",
                value: (formData.cin || "").toUpperCase(),
                onChange: (val) => setFormData(prev => ({ ...prev, cin: val.toUpperCase() })),
            };
            return field;
        });

        const result = [];
        for (const field of schema) {
            if (field.name === "destination_id") {
                result.push({ type: "section", label: "Détaile" });
            }
            if (field.name === "login") {
                result.push({ type: "section", label: "Login" });
            }
            result.push(field);
        }
        return result;
    }, [baseSchema, dialogMode, formData.cin]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [representantsRes, destinationsRes] = await Promise.all([
                representantService.getAll(),
                destinationService.getAll()
            ]);
            setRepresentants(representantsRes);
            setDestinations(destinationsRes);
        } catch (error) {
            logger("Error fetching data:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const channel = echo.channel('representants-channel')
            .listen('.representant.updated', (e) => {
                setRepresentants((prevList) =>
                    prevList.map((rep) =>
                        rep.id === e.representant.id ? { ...rep, ...e.representant } : rep
                    )
                );
            });

        return () => channel.stopListening('.representant.updated');
    }, []);

    const handleAction = async (type, row) => {
        const rowData = { ...row };
        if (rowData.login && typeof rowData.login === 'object') {
            rowData.login = rowData.login.username;
        }
        if (type === "edit") {
            setDialogMode("update");
            setFormData(rowData);
            setRepId(row.id);
            setIsDialogOpen(true);
        } else if (type === "view") {
            setDialogMode("view");
            setFormData(rowData);
            setIsDialogOpen(true);
        }
    }

    const handleAddSubmit = async () => {
        try {
            const data = formData;
            await representantService.create(data);
            toast.success("Représentant ajouté avec succès");
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du représentant");
        }
    };

    const handleUpdateSubmit = async () => {
        try {
            const data = formData;
            await representantService.update(repId, data);
            toast.success(`${formData.nom} mise à jour avec succès`);
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du fournisseur");
        }
    };

    const resetForm = () => {
        setFormData({
            nom: "",
            cin: "",
            destination_id: "",
            tel: "",
            email: "",
            adresse: "",
            code_postale: "",
            ville: "",
            lieu_de_travail: "",
            login: "",
            password: ""
        });
    };

    useEffect(() => {
        if (!isDialogOpen) {
            resetForm();
            setDialogMode("add");
            setRepId("")
        }
    }, [isDialogOpen]);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-slate-800">Liste des Representants</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode} // 'add', 'update', or 'view'
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Ajouter un Représentants
                        </Button>
                    }
                    schema={dialog_schema}
                    fields={formData}
                    fieldsFunc={setFormData}
                    onSubmit={dialogMode === 'add' ? handleAddSubmit : handleUpdateSubmit}
                    config={{
                        title: {
                            add: "Nouveau Représentant",
                            update: "Modifier les informations",
                            view: "Détails du Représentant"
                        },
                        subtitle: {
                            add: "Créer un nouveau compte pour un représentant.",
                            update: "Mettre à jour les données de " + formData.nom,
                            view: "Consultation du profil."
                        },
                        submitLabel: dialogMode === 'add' ? "Créer le compte" : "Enregistrer les modifications"
                    }}
                />
            </div>

            <MyTable
                data={representants}
                variant="blue"
                pageSize={5}
                actions={["view", "edit", "delete"]}
                onAction={handleAction}
                isLoading={isLoading}
                columns={columns}
                actionsDetaille={actionsDetaille}
                enableSearch enableSorting
            />
        </div>
    );
}

export default ReprésentantDisponibles;