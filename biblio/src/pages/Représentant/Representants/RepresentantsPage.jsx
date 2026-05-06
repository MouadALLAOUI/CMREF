import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import representantService from "../../../api/services/representantService";
import { User, UserCheck, UserX, Wifi, WifiOff } from "lucide-react";
import { isOnline } from "../../../utils/helpers";

function RepresentantsPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dialogMode, setDialogMode] = useState("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowId, setRowId] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    code_postal: "",
    password: "",
    est_actif: true,
    remarques: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await representantService.getAll();
      setRows(res);
    } catch (error) {
      logger("Error fetching representants:", error);
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
      nom: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
      code_postal: "",
      password: "",
      est_actif: true,
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
      description: "Êtes-vous sûr de vouloir supprimer ce représentant ?",
      actionText: "Supprimer",
      cancelText: "Annuler",
      type: "delete",
      onOk: async (row) => {
        try {
          await representantService.delete(row.id);
          toast.success("Représentant supprimé");
          fetchData();
        } catch (error) {
          logger("Error deleting representant:", error);
          toast.error("Erreur lors de la suppression");
        }
      },
      onCancel: () => toast.error("Élément non supprimé"),
    },
  };

  const columns = [
    { header: "Nom", accessor: "nom", color: "#0ea5e9" },
    { header: "Email", accessor: "email" },
    { header: "Téléphone", accessor: "telephone" },
    { header: "Ville", accessor: "ville" },
    { 
      header: "Statut", 
      accessor: "est_actif", 
      type: "bool",
      onClick: (row) => handleToggleActif(row)
    },
    {
      header: "En ligne",
      accessor: "last_online_at",
      type: "status-online",
      statusAccessor: "last_online_at",
      verifyOnline: true,
      render: (value) => {
        const online = isOnline(value);
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className={`text-xs font-medium ${online ? 'text-emerald-600' : 'text-slate-400'}`}>
              {online ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
        );
      },
    },
    {
      header: "Dernière connexion",
      accessor: "last_online_at",
      type: "date",
      subType: "datetime",
    },
  ];

  const schema = useMemo(
    () => [
      {
        name: "nom",
        label: "Nom complet",
        placeholder: "Nom du représentant",
        required: true,
        value: formData.nom,
        onChange: (v) => setFormData((prev) => ({ ...prev, nom: v })),
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "email@exemple.com",
        required: true,
        value: formData.email,
        onChange: (v) => setFormData((prev) => ({ ...prev, email: v })),
      },
      {
        name: "telephone",
        label: "Téléphone",
        placeholder: "+212 6 XX XX XX XX",
        value: formData.telephone,
        onChange: (v) => setFormData((prev) => ({ ...prev, telephone: v })),
      },
      {
        name: "adresse",
        label: "Adresse",
        placeholder: "Adresse complète",
        inputType: "textarea",
        value: formData.adresse,
        onChange: (v) => setFormData((prev) => ({ ...prev, adresse: v })),
        className: "col-span-2",
      },
      {
        name: "ville",
        label: "Ville",
        placeholder: "Ville",
        value: formData.ville,
        onChange: (v) => setFormData((prev) => ({ ...prev, ville: v })),
      },
      {
        name: "code_postal",
        label: "Code postal",
        placeholder: "Code postal",
        value: formData.code_postal,
        onChange: (v) => setFormData((prev) => ({ ...prev, code_postal: v })),
      },
      {
        name: "password",
        label: "Mot de passe",
        type: "password",
        placeholder: "Laisser vide pour ne pas changer",
        value: formData.password,
        onChange: (v) => setFormData((prev) => ({ ...prev, password: v })),
        helperText: dialogMode === "update" ? "Laisser vide pour conserver le mot de passe actuel" : undefined,
      },
      {
        name: "est_actif",
        label: "Compte actif",
        inputType: "select",
        items: [
          { label: "Oui", value: true },
          { label: "Non", value: false },
        ],
        value: formData.est_actif,
        onChange: (v) => setFormData((prev) => ({ ...prev, est_actif: v })),
      },
      {
        name: "remarques",
        label: "Remarques",
        inputType: "textarea",
        value: formData.remarques,
        onChange: (v) => setFormData((prev) => ({ ...prev, remarques: v })),
        className: "col-span-2",
      },
    ],
    [formData, dialogMode]
  );

  const onSubmit = async () => {
    try {
      // Don't send empty password on update
      const payload = { ...formData };
      if (dialogMode === "update" && !payload.password) {
        delete payload.password;
      }

      if (dialogMode === "add") {
        await representantService.create(payload);
        toast.success("Représentant ajouté avec succès");
      } else if (dialogMode === "update" && rowId) {
        await representantService.update(rowId, payload);
        toast.success("Représentant mis à jour avec succès");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      logger("Error saving representant:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleAction = (type, row) => {
    if (type === "edit") {
      setDialogMode("update");
      setRowId(row.id);
      setFormData({
        nom: row.nom || "",
        email: row.email || "",
        telephone: row.telephone || "",
        adresse: row.adresse || "",
        ville: row.ville || "",
        code_postal: row.code_postal || "",
        password: "",
        est_actif: row.est_actif ?? true,
        remarques: row.remarques || "",
      });
      setIsDialogOpen(true);
      return;
    }
    if (type === "view") {
      setDialogMode("view");
      setFormData({
        nom: row.nom || "",
        email: row.email || "",
        telephone: row.telephone || "",
        adresse: row.adresse || "",
        ville: row.ville || "",
        code_postal: row.code_postal || "",
        password: "",
        est_actif: row.est_actif ?? true,
        remarques: row.remarques || "",
      });
      setIsDialogOpen(true);
    }
  };

  const handleToggleActif = async (row) => {
    try {
      await representantService.updateStatus(row.id, { est_actif: !row.est_actif });
      toast.success(`Représentant ${!row.est_actif ? 'activé' : 'désactivé'}`);
      fetchData();
    } catch (error) {
      logger("Error toggling representant status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Représentants</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez les comptes représentants et leurs accès</p>
        </div>
        <UniversalDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          mode={dialogMode}
          trigger={
            <Button
              onClick={() => setDialogMode("add")}
              className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
            >
              <User className="w-4 h-4 mr-2" />
              + Nouveau représentant
            </Button>
          }
          schema={schema}
          onSubmit={onSubmit}
          config={{
            title: {
              add: "Nouveau représentant",
              update: "Modifier le représentant",
              view: "Détails",
            },
            subtitle: {
              add: "Créer un nouveau compte représentant.",
              update: "Mettre à jour les informations du représentant.",
              view: "Consultation des informations.",
            },
            submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
          }}
        />
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
          enableCategoricalFilter
          defaultFilterColumn={{ header: "Ville", accessor: "ville" }}
        />
      </div>
    </div>
  );
}

export default RepresentantsPage;
