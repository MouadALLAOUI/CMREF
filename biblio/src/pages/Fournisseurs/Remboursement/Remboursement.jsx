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

const FournisseurRemboursement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imprimeur_id: "",
    date_payment: "",
    banque_id: "",
    banque_nom: "",
    cheque_image_path: "",
    cheque_number: "",
    montant: "",
  });
  const [remboursement, setRemboursement] = useState([]);
  const [imprimeurs, setImprimeurs] = useState([]);
  const [banque, setBanque] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // logger(remboursement)
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
          logger("Error deleting Remboursement:", error);
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
        rembImpService.getAll(),
        imprimeurService.getAll(),
        banqueService.getAll()
      ]);
      setRemboursement(impRemb);
      setImprimeurs(imp);
      setBanque(bank);
      // logger({ remb: impRemb, imp: imp, bank: bank })
    } catch (error) {
      console.error("Error fetching Rembourcement:", error);
      toast.error("Erreur lors du chargement des Rembourcement");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleReset = () => {
    setFormData({
      imprimeur_id: "",
      date_payment: "",
      banque_id: "",
      banque_nom: "",
      cheque_image_path: "",
      cheque_number: "",
      montant: "",
    });
  };

  const handleAction = (type, row) => {
    if (type === "edit" || type === "view") {
      setDialogMode(type === "edit" ? "update" : "view");
      setCurrentRembId(row.id);
      setFormData({
        imprimeur_id: row.imprimeur_id,
        date_payment: row.date_payment,
        banque_id: row.banque_id || "",
        banque_nom: row.banque_nom || "",
        cheque_number: row.cheque_number,
        montant: row.montant,
      });
      setDialogOpen(true);
    }
  };

  const handleUpdateStatusRecuRemb = async (row) => {
    try {
      const newStatus = !row.statut_recu;
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

  const schema = useMemo(() => [
    {
      name: "imprimeur_id",
      label: "Fournisseur",
      placeholder: "Choisir fournisseur",
      inputType: "select",
      items: imprimeurs.map(i => ({ label: i.raison_sociale, value: i.id })),
      value: formData.imprimeur_id,
      onChange: (v) => setFormData(prev => ({ ...prev, imprimeur_id: v })),
      required: true,
      className: "col-span-2"
    },
    {
      name: "date_payment",
      label: "Date",
      type: "date",
      inputType: "date",
      value: formData.date_payment,
      onChange: (v) => setFormData(prev => ({ ...prev, date_payment: v })),
      required: true
    },
    {
      name: "banque_id",
      label: "Banque",
      placeholder: "Choisir banque",
      inputType: "select",
      items: banque.map(b => ({ label: b.nom, value: b.id })),
      value: formData.banque_id,
      onChange: (v) => {
        const selected = banque.find(b => b.id === v);
        setFormData(prev => ({ ...prev, banque_id: v, banque_nom: selected?.nom || "" }));
      }
    },
    {
      name: "cheque_number",
      label: "N° de Chèque",
      placeholder: "Entrer n° chèque",
      value: formData.cheque_number,
      onChange: (v) => setFormData(prev => ({ ...prev, cheque_number: v })),
    },
    {
      name: "montant",
      label: "Montant (DH)",
      type: "number",
      placeholder: "0.00",
      value: formData.montant,
      onChange: (v) => setFormData(prev => ({ ...prev, montant: v })),
      required: true
    }
  ], [formData, imprimeurs, banque]);

  const rembStatus = useMemo(() => {
    return remboursement.reduce((acc, remb) => {
      if (remb.statut_recu) acc.recu++;
      if (remb.statut_rejete) acc.rejete++;
      return acc;
    }, { recu: 0, rejete: 0 });
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
              <span>Reçu : <span className="text-slate-300 font-bold">{rembStatus.recu}</span></span>
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
