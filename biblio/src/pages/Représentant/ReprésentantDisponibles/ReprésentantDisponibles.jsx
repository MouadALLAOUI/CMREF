import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import representantService from "../../../api/services/representantService";
import destinationService from "../../../api/services/destinationService";
import toast from "react-hot-toast";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import * as Dialog from "@radix-ui/react-dialog";
import { echo } from "../../../api/helpers/echo";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import { Settings2 } from "lucide-react";
import SeasonAccessManager from "../../../components/rep/SeasonAccessManager";

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
    const [seasonAccessRep, setSeasonAccessRep] = useState(null);

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
            type: "status-value",
            subType: "date",
            showTime: true,
            statusAccessor: "login.is_online",
            verifyOnline: true
        },
        {
            header: "Saisons",
            accessor: "season_statuses",
            type: "custom",
            render: (_value, row) => {
                const statuses = row.season_statuses || [];
                if (statuses.length === 0) return <span className="text-xs text-slate-400">—</span>;
                return (
                    <div className="flex flex-wrap gap-1">
                        {statuses.map((s) => {
                            const colorMap = {
                                unlock: "bg-emerald-100 text-emerald-700",
                                lock: "bg-amber-100 text-amber-700",
                                disabled: "bg-red-100 text-red-700",
                            };
                            return (
                                <span
                                    key={s.id}
                                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colorMap[s.status] || "bg-slate-100 text-slate-500"}`}
                                >
                                    {s.season_name?.length === 7 ? s.season_name.slice(0, 5) : s.season_name || "—"}
                                </span>
                            );
                        })}
                    </div>
                );
            }
        },
        {
            header: "",
            accessor: "id",
            type: "custom",
            render: (_value, row) => (
                <button
                    onClick={() => setSeasonAccessRep(row)}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Gérer les accès saisons"
                >
                    <Settings2 size={16} />
                </button>
            )
        },
    ]

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

            {/* Season Access Manager Dialog */}
            <Dialog.Root open={!!seasonAccessRep} onOpenChange={(open) => !open && setSeasonAccessRep(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto">
                        <Dialog.Title className="sr-only">Gérer les accès saisons</Dialog.Title>
                        <Dialog.Description className="sr-only">Définir le statut d'accès pour chaque saison</Dialog.Description>
                        {seasonAccessRep && (
                            <SeasonAccessManager
                                representant={seasonAccessRep}
                                onClose={() => { setSeasonAccessRep(null); fetchData(); }}
                            />
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}

export default ReprésentantDisponibles;