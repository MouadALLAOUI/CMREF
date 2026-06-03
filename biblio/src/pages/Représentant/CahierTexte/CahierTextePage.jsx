import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import cahierCommunicationService from "../../../api/services/cahierCommunicationService";
import representantService from "../../../api/services/representantService";
import useAppStore from "../../../store/useAppStore";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import SectionContainer from "../../../components/ui/SectionContainer";
import { BookOpen, ClipboardList } from "lucide-react";

function CahierTextePage() {
  const { activeSeason } = useAppStore();
  const [rows, setRows] = useState([]);
  const [representants, setRepresentants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRep, setSelectedRep] = useState("all");

  const [dialogMode, setDialogMode] = useState("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowId, setRowId] = useState("");

  const [formData, setFormData] = useState({
    rep_id: "",
    ecole: "",
    type: "",
    qte: "",
    date_commande: "",
    nom_fichier: "",
    indication: "",
    remarques: "",
    bon_de_commande: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const seasonParams = activeSeason?.name ? { annee: activeSeason.name } : {};
      const [res, reps] = await Promise.all([
        cahierCommunicationService.getAll(seasonParams),
        representantService.getAll(),
      ]);
      setRows(res);
      setRepresentants(reps);
    } catch (error) {
      logger(error, "error")();
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
      ecole: "",
      type: "",
      qte: "",
      date_commande: "",
      nom_fichier: "",
      indication: "",
      remarques: "",
      bon_de_commande: "",
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
    const summary = { "P-S": 0, "P-J": 0, "C-S": 0, "C-J": 0 };
    filteredRows.forEach(row => {
      const t = (row.type || "").toUpperCase();
      if (t.includes("PRIMAIRE") && t.includes("SPIRALE")) summary["P-S"] += row.qte || 0;
      else if (t.includes("PRIMAIRE") && (t.includes("JOURNAL") || t.includes("BROCHE"))) summary["P-J"] += row.qte || 0;
      else if (t.includes("COLLEGE") && t.includes("SPIRALE")) summary["C-S"] += row.qte || 0;
      else if (t.includes("COLLEGE") && (t.includes("JOURNAL") || t.includes("BROCHE"))) summary["C-J"] += row.qte || 0;
      else if (t.includes("SPIRALE")) summary["P-S"] += row.qte || 0;
      else if (t.includes("BROCHE") || t.includes("JOURNAL")) summary["P-J"] += row.qte || 0;
    });
    return summary;
  }, [filteredRows]);

  const actionsDetaille = {
    delete: {
      title: "Supprimer",
      description: "Êtes-vous sûr de vouloir supprimer cette entrée ?",
      actionText: "Supprimer",
      cancelText: "Annuler",
      type: "delete",
      onOk: async (row) => {
        try {
          await cahierCommunicationService.delete(row.id);
          toast.success("Entrée supprimée");
          fetchData();
        } catch (error) {
          logger(error, "error")();
          toast.error("Erreur lors de la suppression");
        }
      },
      onCancel: () => toast.error("Élément non supprimé"),
    },
  };

  const columns = [
    { header: "N°", accessor: "id", render: (_, __, i) => i + 1 },
    { header: "Représentant", accessor: "representant.nom || representant_nom" },
    { header: "Ecole", accessor: "ecole" },
    { header: "Type", accessor: "type" },
    { header: "Qté", accessor: "qte" },
    {
      header: "Télécharger",
      accessor: "nom_fichier",
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">
            Télécharger
          </a>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        ),
    },
    { header: "Indication", accessor: "indication" },
    {
      header: "Modèle",
      accessor: "model_recto",
      render: (value, row) =>
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
      header: "Imprimer",
      accessor: "is_printed",
      type: "bool",
      onClick: (row) => handleToggleStatus(row, "is_printed"),
    },
    {
      header: "Livrée",
      accessor: "is_delivered",
      type: "bool",
      onClick: (row) => handleToggleStatus(row, "is_delivered"),
    },
    { header: "Bon de Commande", accessor: "bon_de_commande" },
  ];

  const handleToggleStatus = async (row, field) => {
    try {
      await cahierCommunicationService.update(row.id, { [field]: !row[field] });
      toast.success("Statut mis à jour");
      fetchData();
    } catch (error) {
      logger("Error updating cahier status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const schema = useMemo(() => {
    const rules = {
      rep_id: "required|uuid|exists:representants,id",
      ecole: "required|string|max:255",
      type: "required|string",
      qte: "required|integer|min:1",
      date_commande: "required|date",
      nom_fichier: "nullable|string",
      indication: "nullable|string",
      remarques: "nullable|string",
      bon_de_commande: "nullable|string",
    };

    return buildSchemaFromControllerRules({
      rules,
      formData,
      setFormData,
      labels: {
        rep_id: "Représentant",
        ecole: "Ecole",
        type: "Type",
        qte: "Quantité",
        date_commande: "Date de commande",
        nom_fichier: "Fichier",
        indication: "Indication",
        remarques: "Remarques",
        bon_de_commande: "Bon de commande",
      },
      placeholders: {
        ecole: "Nom de l'école",
        type: "Ex: Spirale, Broche",
      },
      overrides: {
        indication: { inputType: "textarea" },
        remarques: { inputType: "textarea" },
      },
      selectItems: {
        rep_id: representants.map((r) => ({ label: r.nom, value: r.id })),
      },
      gridSpan: {
        indication: "space-y-2 col-span-2",
        remarques: "space-y-2 col-span-2",
      },
    });
  }, [formData, representants, setFormData]);

  const onSubmit = async () => {
    try {
      if (dialogMode === "add") {
        await cahierCommunicationService.create(formData);
        toast.success("Entrée ajoutée avec succès");
      } else if (dialogMode === "update" && rowId) {
        await cahierCommunicationService.update(rowId, formData);
        toast.success("Entrée mise à jour avec succès");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      logger(error, "error")();
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleAction = (type, row) => {
    if (type === "edit") {
      setDialogMode("update");
      setRowId(row.id);
      setFormData({
        rep_id: row.rep_id || row.representant?.id || "",
        ecole: row.ecole || "",
        type: row.type || "",
        qte: row.qte ?? "",
        date_commande: row.date_commande || "",
        nom_fichier: row.nom_fichier || "",
        indication: row.indication || "",
        remarques: row.remarques || "",
        bon_de_commande: row.bon_de_commande || "",
      });
      setIsDialogOpen(true);
      return;
    }
    if (type === "view") {
      setDialogMode("view");
      setFormData({
        rep_id: row.rep_id || row.representant?.id || "",
        ecole: row.ecole || "",
        type: row.type || "",
        qte: row.qte ?? "",
        date_commande: row.date_commande || "",
        nom_fichier: row.nom_fichier || "",
        indication: row.indication || "",
        remarques: row.remarques || "",
        bon_de_commande: row.bon_de_commande || "",
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Cahier de texte</h1>
        <UniversalDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          mode={dialogMode}
          trigger={
            <Button
              onClick={() => setDialogMode("add")}
              className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
            >
              + Ajouter
            </Button>
          }
          schema={schema}
          onSubmit={onSubmit}
          config={{
            title: {
              add: "Nouvelle demande",
              update: "Modifier la demande",
              view: "Détails de la demande",
            },
            subtitle: {
              add: "Créer une demande de cahier de texte.",
              update: "Mettre à jour la demande sélectionnée.",
              view: "Consultation de la demande.",
            },
            submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
          }}
        />
      </div>

      {/* Section 1: Summary by type */}
      <SectionContainer
        title="Total des Qtés pour chaque type"
        icon={BookOpen}
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
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">P - S</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">P - J</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">C - S</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">C - J</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50">
                <td className="px-6 py-4 text-center text-lg font-black text-slate-900">{typeSummary["P-S"]}</td>
                <td className="px-6 py-4 text-center text-lg font-black text-slate-900">{typeSummary["P-J"]}</td>
                <td className="px-6 py-4 text-center text-lg font-black text-slate-900">{typeSummary["C-S"]}</td>
                <td className="px-6 py-4 text-center text-lg font-black text-slate-900">{typeSummary["C-J"]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionContainer>

      {/* Section 2: Detail list */}
      <SectionContainer
        title="Liste des demandes du cahier de texte"
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

export default CahierTextePage;
