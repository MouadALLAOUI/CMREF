import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import repRemboursementService from "../../../api/services/repRemboursementService";
import representantService from "../../../api/services/representantService";
import banqueService from "../../../api/services/banqueService";
import factService from "../../../api/services/factService";
import SectionContainer from "../../../components/ui/SectionContainer";
import { Book, Save } from "lucide-react";

function RembourserFacturePage() {
  const [rows, setRows] = useState([]);
  const [representants, setRepresentants] = useState([]);
  const [banques, setBanques] = useState([]);
  const [factures, setFactures] = useState([]);
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [res, reps, bq, facts] = await Promise.all([
        repRemboursementService.getAll(),
        representantService.getAll(),
        banqueService.getAll(),
        factService.getAll(),
      ]);
      setRows(res);
      setRepresentants(reps);
      setBanques(bq);
      setFactures(facts);
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
    { header: "Facture N°", accessor: "facture.fact_number", className: "bg-slate-50/50" },
    { header: "Montant (DH)", accessor: "facture.total_ttc", type: "money", className: "bg-slate-50/50" },
    { header: "Banque", accessor: "banque.nom || banque_nom" },
    { header: "N° de chèque", accessor: "cheque_number" },
    { header: "Règlement (DH)", accessor: "montant", type: "money" },
    { header: "Commentaire", accessor: "remarks" },
  ];

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
        name: "fact_id",
        label: "Facture",
        placeholder: "Choisir une facture",
        inputType: "select",
        items: factures
          .filter(f => !formData.rep_id || f.rep_id === formData.rep_id)
          .map((f) => ({ label: f.fact_number, value: f.id })),
        value: formData.fact_id,
        onChange: (v) => setFormData((prev) => ({ ...prev, fact_id: v })),
      },
      {
        name: "date_payment",
        label: "Date de paiement",
        type: "date",
        required: true,
        value: formData.date_payment,
        onChange: (v) => setFormData((prev) => ({ ...prev, date_payment: v })),
      },
      {
        name: "banque_id",
        label: "Banque",
        placeholder: "Choisir banque",
        inputType: "select",
        items: banques.map((b) => ({ label: b.nom, value: b.id })),
        value: formData.banque_id,
        onChange: (v) => {
          const selected = banques.find((b) => b.id === v);
          setFormData((prev) => ({
            ...prev,
            banque_id: v,
            banque_nom: selected ? selected.nom : "",
          }));
        },
      },
      {
        name: "banque_nom",
        label: "Banque (si autre)",
        placeholder: "Banque si non listée",
        value: formData.banque_nom,
        onChange: (v) => setFormData((prev) => ({ ...prev, banque_nom: v })),
      },
      {
        name: "cheque_number",
        label: "N° chèque",
        placeholder: "Numéro de chèque",
        value: formData.cheque_number,
        onChange: (v) => setFormData((prev) => ({ ...prev, cheque_number: v })),
      },
      {
        name: "type_versement",
        label: "Type de versement",
        inputType: "select",
        items: ["En main propre", "Virement", "Versement"],
        value: formData.type_versement,
        onChange: (v) => setFormData((prev) => ({ ...prev, type_versement: v })),
      },
      {
        name: "montant",
        label: "Montant (DH)",
        type: "number",
        required: true,
        value: formData.montant,
        onChange: (v) => setFormData((prev) => ({ ...prev, montant: v })),
      },
      {
        name: "remarks",
        label: "Remarques",
        inputType: "textarea",
        value: formData.remarks,
        onChange: (v) => setFormData((prev) => ({ ...prev, remarks: v })),
        className: "col-span-2",
      },
    ],
    [formData, representants, banques, factures]
  );

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

  const SaveButton = () => (
    <Button 
      onClick={() => toast.success("Modifications enregistrées")}
      className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white px-4 h-9 rounded-lg font-bold text-xs uppercase tracking-tight shadow-sm transition-all"
    >
      <Save className="w-3.5 h-3.5 mr-2" />
      ENREGISTRER LES MODIFICATIONS
    </Button>
  );

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Remboursements factures"
        icon={Book}
        headerColor="bg-[#1ebba3]"
        topActions={
          <UniversalDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            mode={dialogMode}
            trigger={
              <Button
                onClick={() => setDialogMode("add")}
                className="bg-white/20 hover:bg-white/30 text-white px-4 h-8 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
              >
                + Ajouter
              </Button>
            }
            schema={schema}
            onSubmit={onSubmit}
            config={{
              title: { add: "Nouveau remboursement", update: "Modifier", view: "Détails" },
              subtitle: { add: "Créer un remboursement.", update: "Mettre à jour.", view: "Consultation." },
              submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
            }}
          />
        }
        footerActions={<SaveButton />}
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <SaveButton />
          </div>

          <div className="relative border border-slate-100 rounded-xl overflow-hidden">
            {/* Double Header Simulation */}
            <div className="grid grid-cols-[repeat(2,minmax(0,1fr))_repeat(4,minmax(0,1fr))] bg-slate-50/80 border-b border-slate-100">
              <div className="col-span-2 px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-100">
                Facture
              </div>
              <div className="col-span-4 px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                Remboursement
              </div>
            </div>

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
              className="border-none shadow-none rounded-none"
            />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}

export default RembourserFacturePage;
