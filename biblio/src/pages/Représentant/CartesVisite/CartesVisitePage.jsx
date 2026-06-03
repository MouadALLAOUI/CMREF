import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import carteVisiteService from "../../../api/services/carteVisiteService";
import representantService from "../../../api/services/representantService";
import useAppStore from "../../../store/useAppStore";
import SectionContainer from "../../../components/ui/SectionContainer";
import { CreditCard, ClipboardList, Eye, X } from "lucide-react";

function CartesVisitePage() {
    const { activeSeason } = useAppStore();
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRep, setSelectedRep] = useState("all");

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [detailPopup, setDetailPopup] = useState(null);

    const [formData, setFormData] = useState({
        rep_id: "",
        date_commande: "",
        nom_sur_carte: "",
        fonction: "",
        tel: "",
        email: "",
        adresse: "",
        autre_info: "",
        model: "",
        chevalet_ligne_1: "",
        chevalet_ligne_2: "",
        chevalet_ligne_3: "",
        remarques: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const seasonParams = activeSeason?.name ? { annee: activeSeason.name } : {};
            const [res, reps] = await Promise.all([
                carteVisiteService.getAll(seasonParams),
                representantService.getAll(),
            ]);
            setRows(res);
            setRepresentants(reps);
        } catch (error) {
            logger("Error fetching carte visites:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeSeason?.name]);

    const resetForm = () => {
        setFormData({
            rep_id: "",
            date_commande: "",
            nom_sur_carte: "",
            fonction: "",
            tel: "",
            email: "",
            adresse: "",
            autre_info: "",
            model: "",
            chevalet_ligne_1: "",
            chevalet_ligne_2: "",
            chevalet_ligne_3: "",
            remarques: "",
        });
        setRowId("");
        setDialogMode("add");
    };

    useEffect(() => {
        if (!isDialogOpen) resetForm();
    }, [isDialogOpen]);

    const filteredRows = useMemo(() => {
        if (selectedRep === "all") return rows;
        return rows.filter(r => r.rep_id === selectedRep);
    }, [rows, selectedRep]);

    const typeSummary = useMemo(() => {
        const summary = {
            "Carte de visite": { commande: 0, production: 0, livraison: 0, reception: 0 },
            "Chevalet": { commande: 0, production: 0, livraison: 0, reception: 0 },
        };
        filteredRows.forEach(row => {
            const type = (row.type_support || row.model || "").toLowerCase().includes("chevalet") ? "Chevalet" : "Carte de visite";
            summary[type].commande += 1;
            if (row.prod_carte || row.prod_chevalet) summary[type].production += 1;
            if (row.livraison_carte || row.livraison_chevalet) summary[type].livraison += 1;
            if (row.recu_carte || row.recu_chevalet) summary[type].reception += 1;
        });
        return summary;
    }, [filteredRows]);

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer cette demande ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await carteVisiteService.delete(row.id);
                    toast.success("Demande supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting carte visite:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "N°", accessor: "id", render: (_, __, i) => i + 1 },
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Nom & Prénom", accessor: "nom_sur_carte" },
        {
            header: "Détails",
            accessor: "id",
            render: (_, row) => (
                <button
                    onClick={() => setDetailPopup(row)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                </button>
            ),
        },
        {
            header: "Conception",
            accessor: "conception_carte",
            render: (value) =>
                value ? (
                    <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">
                        Voir
                    </a>
                ) : (
                    <span className="text-slate-300 text-xs">—</span>
                ),
        },
        { header: "Remarques", accessor: "remarques" },
        {
            header: "Production",
          accessor: "prod_carte",
            type: "bool",
            onClick: (row) => handleToggleStatus(row, row.type_support?.toLowerCase().includes("chevalet") ? "prod_chevalet" : "prod_carte"),
        },
        {
            header: "Livraison",
            accessor: "livraison_carte",
            type: "bool",
            onClick: (row) => handleToggleStatus(row, row.type_support?.toLowerCase().includes("chevalet") ? "livraison_chevalet" : "livraison_carte"),
        },
        { header: "Bon de Commande", accessor: "bon_de_commande" },
        {
            header: "Réception",
            accessor: "recu_carte",
            type: "bool",
            onClick: (row) => handleToggleStatus(row, row.type_support?.toLowerCase().includes("chevalet") ? "recu_chevalet" : "recu_carte"),
        },
    ];

    const handleToggleStatus = async (row, field) => {
        try {
            await carteVisiteService.update(row.id, { [field]: !row[field] });
            toast.success("Statut mis à jour");
            fetchData();
        } catch (error) {
            logger("Error updating carte visite status:", error);
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const schema = useMemo(
        () => [
            {
                name: "rep_id",
                label: "Représentant",
                placeholder: "Choisir un représentant",
                inputType: "select",
                required: true,
                items: representants.map((r) => ({ label: r.nom, value: r.id })),
                value: formData.rep_id,
                onChange: (v) => setFormData((prev) => ({ ...prev, rep_id: v })),
            },
            {
                name: "date_commande",
                label: "Date de commande",
                type: "date",
                required: true,
                value: formData.date_commande,
                onChange: (v) => setFormData((prev) => ({ ...prev, date_commande: v })),
            },
            {
                name: "nom_sur_carte",
                label: "Nom & Prénom",
                placeholder: "Nom complet",
                required: true,
                value: formData.nom_sur_carte,
                onChange: (v) => setFormData((prev) => ({ ...prev, nom_sur_carte: v })),
            },
            {
                name: "fonction",
                label: "Fonction",
                placeholder: "Poste / fonction",
                value: formData.fonction,
                onChange: (v) => setFormData((prev) => ({ ...prev, fonction: v })),
            },
            {
                name: "tel",
                label: "Téléphone",
                placeholder: "Téléphone",
                value: formData.tel,
                onChange: (v) => setFormData((prev) => ({ ...prev, tel: v })),
            },
            {
                name: "email",
                label: "Email",
                placeholder: "Email",
                type: "email",
                value: formData.email,
                onChange: (v) => setFormData((prev) => ({ ...prev, email: v })),
            },
            {
                name: "adresse",
                label: "Adresse",
                placeholder: "Adresse",
                value: formData.adresse,
                onChange: (v) => setFormData((prev) => ({ ...prev, adresse: v })),
                className: "col-span-2",
            },
            {
                name: "autre_info",
                label: "Autre info",
                placeholder: "Informations supplémentaires",
                value: formData.autre_info,
                onChange: (v) => setFormData((prev) => ({ ...prev, autre_info: v })),
                className: "col-span-2",
            },
            {
                type: "section",
                label: "Modèle & Chevalet",
            },
            {
                name: "model",
                label: "Modèle",
                placeholder: "Lien ou référence du modèle",
                value: formData.model,
                onChange: (v) => setFormData((prev) => ({ ...prev, model: v })),
            },
            {
                name: "chevalet_ligne_1",
                label: "Chevalet Ligne 1",
                placeholder: "Ligne 1",
                value: formData.chevalet_ligne_1,
                onChange: (v) => setFormData((prev) => ({ ...prev, chevalet_ligne_1: v })),
            },
            {
                name: "chevalet_ligne_2",
                label: "Chevalet Ligne 2",
                placeholder: "Ligne 2",
                value: formData.chevalet_ligne_2,
                onChange: (v) => setFormData((prev) => ({ ...prev, chevalet_ligne_2: v })),
            },
            {
                name: "chevalet_ligne_3",
                label: "Chevalet Ligne 3",
                placeholder: "Ligne 3",
                value: formData.chevalet_ligne_3,
                onChange: (v) => setFormData((prev) => ({ ...prev, chevalet_ligne_3: v })),
            },
            {
                name: "remarques",
                label: "Remarques",
                inputType: "textarea",
                value: formData.remarques,
                onChange: (v) => setFormData((prev) => ({ ...prev, remarques: v })),
                className: "space-y-2 col-span-2",
            },
        ],
        [formData, representants]
    );

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await carteVisiteService.create(formData);
                toast.success("Demande ajoutée");
            } else if (dialogMode === "update" && rowId) {
                await carteVisiteService.update(rowId, formData);
                toast.success("Demande mise à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving carte visite:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                date_commande: row.date_commande || "",
                nom_sur_carte: row.nom_sur_carte || "",
                fonction: row.fonction || "",
                tel: row.tel || "",
                email: row.email || "",
                adresse: row.adresse || "",
                autre_info: row.autre_info || "",
                model: row.model || "",
                chevalet_ligne_1: row.chevalet_ligne_1 || "",
                chevalet_ligne_2: row.chevalet_ligne_2 || "",
                chevalet_ligne_3: row.chevalet_ligne_3 || "",
                remarques: row.remarques || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                date_commande: row.date_commande || "",
                nom_sur_carte: row.nom_sur_carte || "",
                fonction: row.fonction || "",
                tel: row.tel || "",
                email: row.email || "",
                adresse: row.adresse || "",
                autre_info: row.autre_info || "",
                model: row.model || "",
                chevalet_ligne_1: row.chevalet_ligne_1 || "",
                chevalet_ligne_2: row.chevalet_ligne_2 || "",
                chevalet_ligne_3: row.chevalet_ligne_3 || "",
                remarques: row.remarques || "",
            });
            setIsDialogOpen(true);
        }
    };

    const repOptions = useMemo(() => [
        { label: "Afficher tous", value: "all" },
        ...representants.map((r) => ({ label: r.nom, value: r.id })),
    ], [representants]);

    return (
        <div className="space-y-6">
            {/* Detail Popup */}
            {detailPopup && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Détails de la demande</h3>
                            <button onClick={() => setDetailPopup(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                            <div><span className="font-semibold text-slate-600">Nom & Prénom:</span> <span className="text-slate-900">{detailPopup.nom_sur_carte}</span></div>
                            <div><span className="font-semibold text-slate-600">Fonction:</span> <span className="text-slate-900">{detailPopup.fonction || "—"}</span></div>
                            <div><span className="font-semibold text-slate-600">Tél:</span> <span className="text-slate-900">{detailPopup.tel || "—"}</span></div>
                            <div><span className="font-semibold text-slate-600">Email:</span> <span className="text-slate-900">{detailPopup.email || "—"}</span></div>
                            <div className="col-span-2"><span className="font-semibold text-slate-600">Adresse:</span> <span className="text-slate-900">{detailPopup.adresse || "—"}</span></div>
                            <div className="col-span-2"><span className="font-semibold text-slate-600">Autre:</span> <span className="text-slate-900">{detailPopup.autre_info || "—"}</span></div>
                            <div className="col-span-2"><span className="font-semibold text-slate-600">Commentaire:</span> <span className="text-slate-900">{detailPopup.comment_cv || "—"}</span></div>

                            <div className="col-span-2 mt-4">
                                <div className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider text-center py-2 rounded-t-lg">Chevalet</div>
                                <div className="border border-t-0 border-slate-200 rounded-b-lg p-4">
                                    {detailPopup.chevalet_ligne_1 || detailPopup.chevalet_ligne_2 || detailPopup.chevalet_ligne_3 ? (
                                        <div className="space-y-1 text-sm">
                                            {detailPopup.chevalet_ligne_1 && <div><span className="font-semibold text-blue-600">Ligne 1:</span> {detailPopup.chevalet_ligne_1}</div>}
                                            {detailPopup.chevalet_ligne_2 && <div><span className="font-semibold text-blue-600">Ligne 2:</span> {detailPopup.chevalet_ligne_2}</div>}
                                            {detailPopup.chevalet_ligne_3 && <div><span className="font-semibold text-blue-600">Ligne 3:</span> {detailPopup.chevalet_ligne_3}</div>}
                                        </div>
                                    ) : (
                                        <p className="text-center text-slate-400 text-sm">Pas de chevalet</p>
                                    )}
                                </div>
                            </div>

                            {detailPopup.model && (
                                <div className="col-span-2">
                                    <div className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider text-center py-2 rounded-t-lg">Modèle</div>
                                    <div className="border border-t-0 border-slate-200 rounded-b-lg p-4 text-center">
                                        <a href={detailPopup.model} target="_blank" rel="noreferrer" className="text-blue-600 underline">Voir le modèle</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Cartes de visite &amp; Chevalet</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Nouvelle demande
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: {
                            add: "Nouvelle demande",
                            update: "Modifier la demande",
                            view: "Détails",
                        },
                        subtitle: {
                            add: "Créer une demande de carte de visite ou chevalet.",
                            update: "Mettre à jour la demande sélectionnée.",
                            view: "Consultation de la demande.",
                        },
                        submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
                    }}
                />
            </div>

            {/* Section 1: Summary by type */}
            <SectionContainer
                title="Liste des commandes"
                icon={CreditCard}
                headerColor="bg-[#0ea5e9]"
            >
                <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm font-semibold text-slate-700">Filtrer par représentant:</label>
                    <select
                        value={selectedRep}
                        onChange={(e) => setSelectedRep(e.target.value)}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {repOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Commande</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Production</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Livraison</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Réception</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(typeSummary).map(([type, stats]) => (
                                <tr key={type} className="border-b border-slate-50">
                                    <td className="px-6 py-4 text-center font-bold text-slate-700">{type}</td>
                                    <td className="px-6 py-4 text-center text-lg font-black text-slate-900">{stats.commande}</td>
                                    <td className="px-6 py-4 text-center text-lg font-black text-blue-600">{stats.production}</td>
                                    <td className="px-6 py-4 text-center text-lg font-black text-amber-600">{stats.livraison}</td>
                                    <td className="px-6 py-4 text-center text-lg font-black text-emerald-600">{stats.reception}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionContainer>

            {/* Section 2: Detail list */}
            <SectionContainer
                title="Liste des demandes"
                icon={ClipboardList}
                headerColor="bg-[#10b981]"
            >
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <MyTable
                        data={filteredRows}
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
            </SectionContainer>
        </div>
    );
}

export default CartesVisitePage;
