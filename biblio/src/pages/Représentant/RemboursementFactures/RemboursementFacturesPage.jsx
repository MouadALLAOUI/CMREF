import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import rembFactureService from "../../../api/services/rembFactureService";
import factService from "../../../api/services/factService";
import representantService from "../../../api/services/representantService";
import banqueService from "../../../api/services/banqueService";
import { formatMoney, calculateFinancialSummary } from "../../../utils/helpers";
import { TrendingDown, Wallet, CreditCard, FileText } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";

function RemboursementFacturesPage() {
    const [rows, setRows] = useState([]);
    const [factures, setFactures] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [banques, setBanques] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        fact_id: "",
        date_payment: "",
        banque_id: "",
        banque_nom: "",
        cheque_number: "",
        type_versement: "Versement",
        montant: "",
        date_prevue: "",
        statut_recu: false,
        statut_rejete: false,
        statut_accepte: false,
        remarks: "",
    });

    // Financial summary state
    const [financialSummary, setFinancialSummary] = useState({
        totalCredit: 0,
        totalAvance: 0,
        totalReste: 0,
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, facts, reps, bq] = await Promise.all([
                rembFactureService.getAll(),
                factService.getAll(),
                representantService.getAll(),
                banqueService.getAll(),
            ]);
            setRows(res);
            setFactures(facts);
            setRepresentants(reps);
            setBanques(bq);

            // Calculate financial summary
            const summary = calculateFinancialSummary(res);
            setFinancialSummary(summary);
        } catch (error) {
            logger("Error fetching remb factures:", error);
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
            fact_id: "",
            date_payment: "",
            banque_id: "",
            banque_nom: "",
            cheque_number: "",
            type_versement: "Versement",
            montant: "",
            date_prevue: "",
            statut_recu: false,
            statut_rejete: false,
            statut_accepte: false,
            remarks: "",
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
            description: "Êtes-vous sûr de vouloir supprimer ce remboursement de facture ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await rembFactureService.delete(row.id);
                    toast.success("Remboursement supprimé");
                    fetchData();
                } catch (error) {
                    logger("Error deleting remb facture:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Facture N°", accessor: "facture.fact_number" },
        { header: "Date paiement", accessor: "date_payment", type: "date" },
        { header: "Banque", accessor: "banque.nom || banque_nom" },
        { header: "Chèque N°", accessor: "cheque_number" },
        { header: "Type de versement", accessor: "type_versement" },
        { header: "Montant (DH)", accessor: "montant", type: "money" },
        { header: "Date prévue", accessor: "date_prevue", type: "date" },
        { header: "Reçu", accessor: "statut_recu", type: "bool" },
        { header: "Rejeté", accessor: "statut_rejete", type: "bool" },
        { header: "Accepté", accessor: "statut_accepte", type: "bool" },
    ];

    const schema = useMemo(() => {
        const rules = {
            rep_id: "required|uuid|exists:representants,id",
            fact_id: "required|uuid|exists:factures,id",
            date_payment: "required|date",
            banque_id: "nullable|uuid|exists:banques,id",
            cheque_number: "nullable|string|max:50",
            type_versement: "required|in:En main propre,Virement,Versement",
            montant: "required|numeric|min:0",
            date_prevue: "nullable|date",
            statut_recu: "sometimes|boolean",
            statut_rejete: "sometimes|boolean",
            statut_accepte: "sometimes|boolean",
            remarks: "nullable|string",
        };

        const label = {
            rep_id: "Représentant",
            fact_id: "Facture",
            date_payment: "Date paiement",
            banque_id: "Banque",
            cheque_number: "N° chèque",
            type_versement: "Type de versement",
            montant: "Montant (DH)",
            date_prevue: "Date prévue",
            statut_recu: "Reçu",
            statut_rejete: "Rejeté",
            statut_accepte: "Accepté",
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
                fact_id: factures.map((f) => ({ label: `${f.fact_number} - ${f.total_ttc} DH`, value: f.id })),
                banque_id: banques.map((b) => ({ label: b.nom, value: b.id })),
                type_versement: [
                    { label: "En main propre", value: "En main propre" },
                    { label: "Virement", value: "Virement" },
                    { label: "Versement", value: "Versement" },
                ],
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
            },
            overrides: {
                remarks: { inputType: "textarea" },
            },
            gridSpan: {
                remarks: "space-y-2 col-span-2",
            },
        });
    }, [formData, representants, factures, banques]);

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await rembFactureService.create(formData);
                toast.success("Remboursement de facture ajouté");
            } else if (dialogMode === "update" && rowId) {
                await rembFactureService.update(rowId, formData);
                toast.success("Remboursement de facture mis à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving remb facture:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                fact_id: row.fact_id || row.facture?.id || "",
                date_payment: row.date_payment || "",
                banque_id: row.banque_id || row.banque?.id || "",
                banque_nom: row.banque_nom || row.banque?.nom || "",
                cheque_number: row.cheque_number || "",
                type_versement: row.type_versement || "Versement",
                montant: row.montant ?? "",
                date_prevue: row.date_prevue || "",
                statut_recu: !!row.statut_recu,
                statut_rejete: !!row.statut_rejete,
                statut_accepte: !!row.statut_accepte,
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                fact_id: row.fact_id || row.facture?.id || "",
                date_payment: row.date_payment || "",
                banque_id: row.banque_id || row.banque?.id || "",
                banque_nom: row.banque_nom || row.banque?.nom || "",
                cheque_number: row.cheque_number || "",
                type_versement: row.type_versement || "Versement",
                montant: row.montant ?? "",
                date_prevue: row.date_prevue || "",
                statut_recu: !!row.statut_recu,
                statut_rejete: !!row.statut_rejete,
                statut_accepte: !!row.statut_accepte,
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
        }
    };

    // Group by representative for synthesis view
    const groupedByRep = useMemo(() => {
        return rows.reduce((acc, row) => {
            const repId = row.rep_id || row.representant?.id;
            if (!repId) return acc;
            if (!acc[repId]) {
                acc[repId] = {
                    rep: row.representant?.nom || repId,
                    total: 0,
                    count: 0,
                    items: [],
                };
            }
            acc[repId].total += Number(row.montant) || 0;
            acc[repId].count += 1;
            acc[repId].items.push(row);
            return acc;
        }, {});
    }, [rows]);

    return (
        <div className="space-y-6">
            {/* Financial Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Crédit Total Factures</p>
                        <p className="text-2xl font-black text-emerald-900">{formatMoney(financialSummary.totalCredit)}</p>
                    </div>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Avance Totale Factures</p>
                        <p className="text-2xl font-black text-blue-900">{formatMoney(financialSummary.totalAvance)}</p>
                    </div>
                </div>
                <div className="p-6 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-amber-600 font-bold uppercase tracking-widest">Reste à Payer Factures</p>
                        <p className="text-2xl font-black text-amber-900">{formatMoney(financialSummary.totalReste)}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Remboursements Factures</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Nouveau remboursement facture
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: { add: "Nouveau remboursement facture", update: "Modifier", view: "Détails" },
                        subtitle: { add: "Enregistrer un remboursement de facture.", update: "Mettre à jour le remboursement.", view: "Consultation." },
                        submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
                    }}
                />
            </div>

            {/* Synthesis by Representative */}
            <SectionContainer
                title="Synthèse par Représentant"
                icon={FileText}
                headerColor="bg-[#1ebba3]"
                collapsible={true}
                defaultOpen={true}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(groupedByRep).map(([repId, data]) => (
                        <div key={repId} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            <h3 className="font-bold text-slate-800 mb-2">{data.rep}</h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-slate-600">Nombre de remboursements: <span className="font-bold">{data.count}</span></p>
                                <p className="text-slate-600">Total remboursé: <span className="font-bold text-emerald-600">{formatMoney(data.total)}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionContainer>

            {/* Detailed Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={rows}
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
}

export default RemboursementFacturesPage;
