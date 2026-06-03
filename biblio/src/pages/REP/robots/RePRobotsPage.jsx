import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import robotService from "../../../api/services/robotService";
import { Bot } from "lucide-react";

const REP_ROBOT_STATUSES = ["Placé", "En Démonstration", "Retourné", "Vendu"];

function RePRobotsPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dialogMode, setDialogMode] = useState("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowId, setRowId] = useState("");

  const [formData, setFormData] = useState({
    date_operation: "",
    ville: "",
    etablissement: "",
    contact_nom: "",
    contact_tel: "",
    reference_robot: "",
    quantite_vue: 0,
    quantite_recue: 0,
    statut: "Placé",
    remarques: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await robotService.getAll();
      setRows(res);
    } catch (error) {
      logger("Error fetching robots:", error);
      toast.error("Erreur lors du chargement des robots");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setFormData({
      date_operation: "",
      ville: "",
      etablissement: "",
      contact_nom: "",
      contact_tel: "",
      reference_robot: "",
      quantite_vue: 0,
      quantite_recue: 0,
      statut: "Placé",
      remarques: "",
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
      description: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      actionText: "Supprimer",
      cancelText: "Annuler",
      type: "delete",
      onOk: async (row) => {
        try {
          await robotService.delete(row.id);
          toast.success("Robot supprimé");
          fetchData();
        } catch (error) {
          logger("Error deleting robot:", error);
          toast.error("Erreur lors de la suppression");
        }
      },
      onCancel: () => toast.error("Élément non supprimé"),
    },
  };

  const columns = useMemo(
    () => [
      { header: "Date", accessor: "date_operation", type: "date" },
      { header: "Ville", accessor: "ville" },
      { header: "Établissement", accessor: "etablissement" },
      { header: "Contact", accessor: "contact_nom" },
      { header: "Tél.", accessor: "contact_tel" },
      { header: "Réf.", accessor: "reference_robot" },
      { header: "Vu", accessor: "quantite_vue" },
      { header: "Reçu", accessor: "quantite_recue" },
      { header: "Statut", accessor: "statut" },
    ],
    []
  );

  const schema = useMemo(() => {
    const rules = {
      date_operation: "required|date",
      ville: "required|string|max:100",
      etablissement: "required|string",
      contact_nom: "required|string|max:150",
      contact_tel: "required|string|max:50",
      reference_robot: "required|string|max:100",
      quantite_vue: "sometimes|integer|min:0",
      quantite_recue: "sometimes|integer|min:0",
      statut: "sometimes|in:Placé,En Démonstration,Retourné,Vendu",
      remarques: "nullable|string",
    };

    return buildSchemaFromControllerRules({
      rules,
      formData,
      setFormData,
      exclude: ["images"],
      labels: {
        date_operation: "Date",
        contact_nom: "Contact",
        contact_tel: "Téléphone",
        reference_robot: "Référence robot",
        quantite_vue: "Quantité vue",
        quantite_recue: "Quantité reçue",
        remarques: "Remarques",
      },
      selectItems: {
        statut: REP_ROBOT_STATUSES.map((s) => ({ label: s, value: s })),
      },
      overrides: {
        remarques: { inputType: "textarea" },
      },
      gridSpan: {
        remarques: "space-y-2 col-span-2",
      },
    });
  }, [formData]);

  const onSubmit = async () => {
    try {
      if (dialogMode === "add") {
        await robotService.create(formData);
        toast.success("Robot ajouté");
      } else if (dialogMode === "update" && rowId) {
        await robotService.update(rowId, formData);
        toast.success("Robot mis à jour");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      logger("Error saving robot:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleAction = (type, row) => {
    if (type === "edit") {
      setDialogMode("update");
      setRowId(row.id);
      setFormData({
        date_operation: row.date_operation || "",
        ville: row.ville || "",
        etablissement: row.etablissement || "",
        contact_nom: row.contact_nom || "",
        contact_tel: row.contact_tel || "",
        reference_robot: row.reference_robot || "",
        quantite_vue: row.quantite_vue ?? 0,
        quantite_recue: row.quantite_recue ?? 0,
        statut: row.statut || "Placé",
        remarques: row.remarques || "",
      });
      setIsDialogOpen(true);
      return;
    }
    if (type === "view") {
      setDialogMode("view");
      setFormData({
        date_operation: row.date_operation || "",
        ville: row.ville || "",
        etablissement: row.etablissement || "",
        contact_nom: row.contact_nom || "",
        contact_tel: row.contact_tel || "",
        reference_robot: row.reference_robot || "",
        quantite_vue: row.quantite_vue ?? 0,
        quantite_recue: row.quantite_recue ?? 0,
        statut: row.statut || "Placé",
        remarques: row.remarques || "",
      });
      setIsDialogOpen(true);
    }
  };

  const stats = useMemo(() => {
    const total = rows.length;
    const places = rows.filter(r => r.statut === "Placé").length;
    const demos = rows.filter(r => r.statut === "En Démonstration").length;
    const vendus = rows.filter(r => r.statut === "Vendu").length;
    return { total, places, demos, vendus };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="text-slate-900" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Mes Robots</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">Gestion de vos opérations robotique.</p>
        </div>
        <UniversalDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          mode={dialogMode}
          trigger={
            <Button
              onClick={() => setDialogMode("add")}
              className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
            >
              + Nouveau robot
            </Button>
          }
          schema={schema}
          onSubmit={onSubmit}
          config={{
            title: { add: "Nouveau robot", update: "Modifier", view: "Détails" },
            subtitle: { add: "Enregistrer une nouvelle opération robot.", update: "Mettre à jour l'opération.", view: "Consultation." },
            submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total</p>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Placés</p>
          <p className="text-2xl font-black text-emerald-700">{stats.places}</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase mb-1">En démo</p>
          <p className="text-2xl font-black text-amber-700">{stats.demos}</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Vendus</p>
          <p className="text-2xl font-black text-blue-700">{stats.vendus}</p>
        </div>
      </div>

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

export default RePRobotsPage;
