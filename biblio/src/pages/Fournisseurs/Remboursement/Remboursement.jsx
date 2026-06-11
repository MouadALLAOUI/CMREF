import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { FileText, FileDown } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import toast from "react-hot-toast";
import rembImpService from "../../../api/services/rembImpService";
import logger from "../../../lib/logger";
import imprimeurService from "../../../api/services/imprimeurService";
import banqueService from "../../../api/services/banqueService";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../../store/useAppStore";
import { currencyFormat } from "../../../lib/utilities";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";

const REMB_IMP_RULES = {
  imprimeur_id: 'required|uuid|exists:imprimeurs,id',
  date_payment: 'required|date',
  banque_id: 'nullable|uuid|exists:banques,id',
  cheque_number: 'nullable|string|max:50',
  montant: 'required|numeric|min:0',
  annee: 'nullable|string',
};

const REMB_IMP_LABELS = {
  imprimeur_id: "Fournisseur",
  date_payment: "Date",
  banque_id: "Banque",
  cheque_number: "N° de Chèque",
  montant: "Montant (DH)",
  annee: "Année",
};

const REMB_IMP_GRID = {
  imprimeur_id: "col-span-2",
};

const FournisseurRemboursement = () => {
  const { activeSeason } = useAppStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imprimeur_id: "",
    date_payment: "",
    banque_id: "",
    banque_nom: "",
    cheque_image_path: "",
    cheque_number: "",
    montant: "",
    annee: activeSeason?.label || "",
  });
  const [remboursement, setRemboursement] = useState([]);
  const [imprimeurs, setImprimeurs] = useState([]);
  const [banque, setBanque] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const actionsDetaille = {
    delete: {
      title: "Supprimer",
      description: "Êtes-vous sûr de vouloir supprimer cette Remboursement?",
      actionText: "Supprimer",
      cancelText: "Annuler",
      type: "delete",
      onOk: async (row) => {
        try {
          await rembImpService.delete(row.id);
          toast.success("Remboursement supprimée");
          fetchData();
        } catch (error) {
          logger("Error deleting Remboursement:", error)();
          toast.error("Erreur lors de la suppression");
        }
      },
      onCancel: () => toast.error("element pas supprimé"),
    },
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [currentRembId, setCurrentRembId] = useState(null);

  const columns = [
    { header: "Fournisseur", accessor: "imprimeur.raison_sociale" },
    { header: "Date", accessor: "date_payment", type: "date" },
    { header: "Banque", accessor: "banque.nom || banque_nom" },
    { header: "Chèque N°", accessor: "cheque_number" },
    { header: "Montant (DH)", accessor: "montant", type: "money" },
    { header: "Reçu", accessor: "statut_recu", type: "bool", onClick: (row) => handleUpdateStatusRecuRemb(row) },
    { header: "Rejeté", accessor: "statut_rejete", type: "bool", onClick: (row) => handleUpdateStatusRejeteRemb(row) },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [impRemb, imp, bank] = await Promise.all([
        rembImpService.getAll({ annee: activeSeason?.label }),
        imprimeurService.getAll(),
        banqueService.getAll()
      ]);
      setRemboursement(impRemb);
      setImprimeurs(imp);
      setBanque(bank);
    } catch (error) {
      logger("Error fetching Remboursement:", error)();
      toast.error("Erreur lors du chargement des Remboursement");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [activeSeason?.label]);

  const handleReset = () => {
    setFormData({
      imprimeur_id: "",
      date_payment: "",
      banque_id: "",
      banque_nom: "",
      cheque_image_path: "",
      cheque_number: "",
      montant: "",
      annee: activeSeason?.label || "",
    });
  };

  const handleAction = (type, row) => {
    if (type === "edit") {
      if (row.statut_recu || row.statut_rejete) {
        return toast.error("Impossible de modifier un remboursement déjà reçu ou rejeté.");
      }
    }
    if (type === "edit" || type === "view") {
      setDialogMode(type === "edit" ? "update" : "view");
      setCurrentRembId(row.id);
      setFormData({
        imprimeur_id: row.imprimeur_id,
        date_payment: row.date_payment?.split('T')[0] || "",
        banque_id: row.banque_id || "",
        banque_nom: row.banque_nom || "",
        cheque_number: row.cheque_number,
        montant: row.montant,
        annee: row.annee || activeSeason?.label || "",
      });
      setDialogOpen(true);
    }
  };

  const handleUpdateStatusRecuRemb = async (row) => {
    try {
      const newStatus = !row.statut_recu;
      if (newStatus && row.statut_rejete) return toast.error("ce rembourcement est rejeté.")
      if (!newStatus) return toast.error("Cannot revert statut recu from true to false.")
      await rembImpService.update(row.id, { statut_recu: newStatus, statut_rejete: !newStatus });
      toast.success(newStatus ? "Marqué comme reçu" : "Marqué comme non reçu");
      fetchData(); // Refresh the table
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
    }
  }
  const handleUpdateStatusRejeteRemb = async (row) => {
    try {
      const newStatus = !row.statut_rejete;
      if (newStatus && row.statut_recu) return toast.error("ce rembourcement est deja reçu.")
      if (!newStatus) return toast.error("Cannot revert statut Rejeté from true to false.")
      await rembImpService.update(row.id, { statut_recu: !newStatus, statut_rejete: newStatus });
      toast.success(newStatus ? "Paiement rejeté" : "Rejet annulé");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
    }
  }

  const handleFormSubmit = async () => {
    setIsLoading(true);
    try {
      if (dialogMode === "add") {
        await rembImpService.create(formData);
        toast.success("Remboursement ajouté");
      } else {
        await rembImpService.update(currentRembId, formData);
        toast.success("Remboursement mis à jour");
      }
      setDialogOpen(false);
      fetchData();
      handleReset();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const baseSchema = useMemo(() => buildSchemaFromControllerRules({
    rules: REMB_IMP_RULES,
    formData,
    setFormData,
    labels: REMB_IMP_LABELS,
    gridSpan: REMB_IMP_GRID,
    selectItems: {
      imprimeur_id: imprimeurs.map(i => ({ label: i.raison_sociale, value: i.id })),
      banque_id: banque.map(b => ({ label: b.nom, value: b.id })),
    },
    exclude: ["id", "created_at", "updated_at", "statut_recu", "statut_rejete", "remarks", "banque_nom", "cheque_image_path"],
  }), [formData, imprimeurs, banque]);

  const schema = useMemo(() => baseSchema.map(field => {
    if (field.name === "imprimeur_id") return { ...field, placeholder: "Choisir fournisseur" };
    if (field.name === "banque_id") return {
      ...field,
      placeholder: "Choisir banque",
      onChange: (v) => {
        const selected = banque.find(b => b.id === v);
        setFormData(prev => ({ ...prev, banque_id: v, banque_nom: selected?.nom || "" }));
      },
    };
    if (field.name === "cheque_number") return { ...field, placeholder: "Entrer n° chèque" };
    if (field.name === "montant") return { ...field, placeholder: "0.00" };
    return field;
  }), [baseSchema, banque]);

  const rembStatus = useMemo(() => {
    return remboursement.reduce((acc, remb) => {
      if (remb.statut_recu) {
        acc.recu++;
        acc.totalRecu += Number(remb.montant) || 0;
      }
      if (remb.statut_rejete) acc.rejete++;
      acc.total += Number(remb.montant) || 0;
      return acc;
    }, { recu: 0, rejete: 0, total: 0, totalRecu: 0 });
  }, [remboursement]);

  return (
    <div className="space-y-6">
      {/* Header section with Stats - Updated to Slate Theme */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des Remboursements (MSM-MEDIAS --&gt; Fournisseur)</h1>
        <UniversalDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) handleReset();
          }}
          mode={dialogMode}
          schema={schema}
          onSubmit={handleFormSubmit}
          handleReset={handleReset}
          config={{
            title: { add: "Nouveau Remboursement", update: "Modifier Paiement", view: "Détails" },
            subtitle: { add: "Saisir un paiement.", update: "Mettre à jour les infos.", view: "Consultation." },
            submitLabel: dialogMode === "add" ? "Enregistrer" : "Modifier",
          }}
          trigger={
            <Button className="bg-slate-900 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]">
              + Ajouter un Remboursement
            </Button>
          }
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
          <FileText className="text-white" size={20} />
          <h2 className="text-white font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex gap-4 text-sm font-normal border-l border-slate-700 pl-4 ml-2">
              <span>Crédit : <span className="text-slate-300 font-bold">{currencyFormat(rembStatus.total)}</span></span>
              <span>Avance : <span className="text-slate-300 font-bold">{currencyFormat(rembStatus.totalRecu)}</span></span>
              <span>Reste : <span className="text-slate-300 font-bold">{currencyFormat(rembStatus.total - rembStatus.totalRecu)}</span></span>
              <span className="border-l border-slate-700 pl-4">Reçu : <span className="text-slate-300 font-bold">{rembStatus.recu}</span></span>
              <span>Rejeté : <span className="text-slate-300 font-bold">{rembStatus.rejete}</span></span>
            </div>
          </h2>
        </div>

        <div className="p-6">
          {/* Synthesis Link - Updated to Slate Theme */}
          <Button onClick={() => navigate("/dash/fournisseurs/Synthese_Remboursement", { replace: true })} className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer mb-2 group w-fit transition-colors">
            <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-slate-100 transition-all duration-200 shadow-sm border border-slate-100">
              <FileDown size={28} className="text-slate-700" />
            </div>
            <span className="font-bold text-xl underline underline-offset-4 decoration-1">Voir la Synthèse</span>
          </Button>

          <div className="overflow-x-auto">
            <MyTable
              data={remboursement}
              columns={columns}
              pageSize={5}
              actions={["edit", "delete"]}
              onAction={handleAction}
              variant="slate"
              isLoading={isLoading}
              actionsDetaille={actionsDetaille}
              enableSearch enableSorting
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FournisseurRemboursement;
