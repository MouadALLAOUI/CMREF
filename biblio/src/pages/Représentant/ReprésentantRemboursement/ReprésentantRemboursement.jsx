import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import repRemboursementService from "../../../api/services/repRemboursementService";
import representantService from "../../../api/services/representantService";
import banqueService from "../../../api/services/banqueService";
import imprimeurService from "../../../api/services/imprimeurService";
import ChequeUpload from "../../../components/ui/ChequeUpload";

function ReprésentantRemboursement() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [banques, setBanques] = useState([]);
    const [imprimeurs, setImprimeurs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRep, setSelectedRep] = useState("all");

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        date_payment: "",
        banque_id: "",
        banque_nom: "",
        cheque_number: "",
        cheque_image_path: "",
        a_lordre_de_id: "",
        imp: "",
        type_versement: "Versement",
        montant: "",
        date_prevue: "",
        statut_recu: false,
        statut_rejete: false,
        statut_accepte: false,
        statut_retourne: false,
        date_retour: "",
        motif_retour: "",
        remarks: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps, bq, imprs] = await Promise.all([
                repRemboursementService.getAll(),
                representantService.getAll(),
                banqueService.getAll(),
                imprimeurService.getAll(),
            ]);
            setRows(res);
            setRepresentants(reps);
            setBanques(bq);
            setImprimeurs(imprs);
        } catch (error) {
            logger("Error fetching rep remboursements:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            rep_id: "",
            date_payment: "",
            banque_id: "",
            banque_nom: "",
            cheque_number: "",
            cheque_image_path: "",
            a_lordre_de_id: "",
            imp: "",
            type_versement: "Versement",
            montant: "",
            date_prevue: "",
            statut_recu: false,
            statut_rejete: false,
            statut_accepte: false,
            statut_retourne: false,
            date_retour: "",
            motif_retour: "",
            remarks: "",
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

    const repOptions = useMemo(() => [
        { label: "Tous les représentants", value: "all" },
        ...representants.map((r) => ({ label: r.nom, value: r.id })),
    ], [representants]);

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce remboursement ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await repRemboursementService.delete(row.id);
                    toast.success("Remboursement supprimé");
                    fetchData();
                } catch (error) {
                    logger("Error deleting rep remboursement:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Donné le", accessor: "date_payment", type: "date" },
        { header: "Banque", accessor: "banque.nom || banque_nom" },
        { header: "Chèque N°", accessor: "cheque_number" },
        { header: "Titulaire", accessor: "compte" },
        { header: "Type de versement", accessor: "type_versement" },
        { header: "A l'ordre de", accessor: "a_ordre_de.raison_sociale || imp" },
        { header: "Montant (DH)", accessor: "montant", type: "money" },
        { header: "Date (prévue) de versement", accessor: "date_prevue", type: "date" },
        { header: "Date de versement", accessor: "date_versement", type: "date" },
        { header: "Reçu", accessor: "statut_recu", type: "bool" },
        { header: "Rejeté", accessor: "statut_rejete", type: "bool" },
        { header: "Accepté", accessor: "statut_accepte", type: "bool" },
        { header: "Retourné", accessor: "statut_retourne", type: "bool" },
    ];

    const aLordreDeOptions = useMemo(() => [
        { label: "MSM-media", value: "__msm_media__" },
        ...imprimeurs.map((i) => ({ label: i.raison_sociale, value: i.id })),
    ], [imprimeurs]);

    const schema = useMemo(() => {
        const rules = {
            rep_id: "required|uuid|exists:representants,id",
            date_payment: "required|date",
            banque_id: "nullable|uuid|exists:banques,id",
            a_lordre_de_id: "nullable|string",
            cheque_number: "nullable|string|max:50",
            cheque_image_path: "nullable|string",
            type_versement: "required|in:En main propre,Virement,Versement",
            compte: "nullable|string|max:100",
            montant: "required|numeric|min:0",
            date_prevue: "nullable|date",
            date_versement: "required|date",
            statut_recu: "sometimes|boolean",
            statut_rejete: "sometimes|boolean",
            statut_accepte: "sometimes|boolean",
            statut_retourne: "sometimes|boolean",
            date_retour: "nullable|date",
            motif_retour: "nullable|string|max:500",
            remarks: "nullable|string",
        };

        const label = {
            rep_id: "Représentant",
            date_payment: "Date",
            banque_id: "Banque",
            a_lordre_de_id: "À l'ordre de",
            cheque_number: "N° chèque",
            cheque_image_path: "Chemin image chèque",
            type_versement: "Type de versement",
            compte: "Titulaire",
            montant: "Montant (DH)",
            date_prevue: "Date prévue",
            date_versement: "Date de versement",
            statut_recu: "Reçu",
            statut_rejete: "Rejeté",
            statut_accepte: "Accepté",
            statut_retourne: "Retourné",
            date_retour: "Date de retour",
            motif_retour: "Motif de retour",
            remarks: "Remarques",
        }

        return buildSchemaFromControllerRules({
            rules,
            formData,
            setFormData,
            labels: label,
            placeholders: label,
            selectItems: {
                rep_id: representants.map((r) => ({ label: r.nom, value: r.id })),
                banque_id: banques.map((b) => ({ label: b.nom, value: b.id })),
                type_versement: [
                    { label: "En main propre", value: "En main propre" },
                    { label: "Virement", value: "Virement" },
                    { label: "Versement", value: "Versement" },
                ],
                a_lordre_de_id: aLordreDeOptions,
                statut_recu: [
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                ],
                statut_rejete: [
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                ],
                statut_accepte: [
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                ],
                statut_retourne: [
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                ],
            },
            overrides: {
                remarks: { inputType: "textarea" },
                motif_retour: { inputType: "textarea" },
                a_lordre_de_id: {
                    onChange: (val) => {
                        if (val === "__msm_media__") {
                            setFormData(prev => ({ ...prev, a_lordre_de_id: null, imp: "MSM-media" }));
                        } else {
                            const imprimeur = imprimeurs.find(i => i.id === val);
                            setFormData(prev => ({ ...prev, a_lordre_de_id: val, imp: imprimeur?.raison_sociale || "" }));
                        }
                    },
                },
            },
            gridSpan: {
                remarks: "space-y-2 col-span-2",
            },
            exclude: ["imp", "statut_retourne"],
        });
    }, [formData, representants, banques, aLordreDeOptions, imprimeurs]);

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await repRemboursementService.create(formData);
                toast.success("Remboursement ajouté");
            } else if (dialogMode === "update" && rowId) {
                await repRemboursementService.update(rowId, formData);
                toast.success("Remboursement mis à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving rep remboursement:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                date_payment: row.date_payment || "",
                banque_id: row.banque_id || row.banque?.id || "",
                banque_nom: row.banque_nom || row.banque?.nom || "",
                cheque_number: row.cheque_number || "",
                cheque_image_path: row.cheque_image_path || "",
                a_lordre_de_id: row.a_lordre_de_id || "",
                imp: row.imp || "",
                type_versement: row.type_versement || "Versement",
                montant: row.montant ?? "",
                date_prevue: row.date_prevue || "",
                statut_recu: !!row.statut_recu,
                statut_rejete: !!row.statut_rejete,
                statut_accepte: !!row.statut_accepte,
                statut_retourne: !!row.statut_retourne,
                date_retour: row.date_retour || "",
                motif_retour: row.motif_retour || "",
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                date_payment: row.date_payment || "",
                banque_id: row.banque_id || row.banque?.id || "",
                banque_nom: row.banque_nom || row.banque?.nom || "",
                cheque_number: row.cheque_number || "",
                cheque_image_path: row.cheque_image_path || "",
                a_lordre_de_id: row.a_lordre_de_id || "",
                imp: row.imp || "",
                type_versement: row.type_versement || "Versement",
                montant: row.montant ?? "",
                date_prevue: row.date_prevue || "",
                statut_recu: !!row.statut_recu,
                statut_rejete: !!row.statut_rejete,
                statut_accepte: !!row.statut_accepte,
                statut_retourne: !!row.statut_retourne,
                date_retour: row.date_retour || "",
                motif_retour: row.motif_retour || "",
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Remboursements (Représentant)</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Ajouter un Chèque
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: { add: "Nouveau remboursement", update: "Modifier", view: "Détails" },
                        subtitle: { add: "Enregistrer un remboursement.", update: "Mettre à jour le remboursement.", view: "Consultation." },
                        submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
                    }}
                >
                    <ChequeUpload
                        value={formData.cheque_image_path}
                        onChange={(path) => setFormData(prev => ({ ...prev, cheque_image_path: path }))}
                        isView={dialogMode === "view"}
                    />
                </UniversalDialog>
            </div>

            <div className="flex items-center gap-4 mb-2">
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={filteredRows}
                    columns={columns}
                    pageSize={5}
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
}

export default ReprésentantRemboursement;
