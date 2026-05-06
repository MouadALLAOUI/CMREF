import { useState, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import imprimeurService from "../../../api/services/imprimeurService";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import toast from "react-hot-toast";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { numberRound } from "../../../lib/utilities";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import { useNavigate } from "react-router-dom";
import { FileDown } from "lucide-react";

function FournisseurSaisirBl() {
    const navigate = useNavigate();
    const [blData, setBlData] = useState([]);
    const [imprimeurs, setImprimeurs] = useState([]);
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedBlItems, setSelectedBlItems] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemQte, setItemQte] = useState(0);

    const [formData, setFormData] = useState({
        imprimeur_id: "",
        date_reception: "",
        b_livraison_number: "",
        quantite: "",
        livre_id: "",
        remarks: "",
        annee: "2627",
        details: [], // This will store items with qte > 0
    });

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce fornisseur?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await bLivraisonImpService.deleteGroup(row.id);
                    toast.success("b_livraison supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting b_livraison:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
    };

    const actionsSubDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce fornisseur?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await bLivraisonItemService.delete(row.id);
                    toast.success("Livre supprimé du BL");
                    fetchData();
                    setSelectedBlItems(prev => ({
                        ...prev,
                        items: prev.items.filter(i => i.id !== row.id)
                    }));
                } catch (error) {
                    logger("Error deleting b_livraison:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
        edit: {
            title: "modifier",
            description: <FormInputRow
                type="number"
                min="1"
                value={itemQte}
                step="1"
                onChange={(val) => setItemQte(numberRound(val))} />,
            actionText: "modifier",
            cancelText: "Annuler",
            type: "edit",
            onOk: async (row) => {
                if (itemQte > 0) {
                    try {
                        // Target the item update specifically
                        await bLivraisonItemService.update(row.id, { quantite: itemQte });
                        toast.success("Quantité mise à jour");

                        // Local state update
                        setSelectedBlItems(prev => ({
                            ...prev,
                            items: prev.items.map(i => i.id === row.id ? { ...i, quantite: itemQte } : i)
                        }));
                        fetchData();
                        setItemQte(0);
                    } catch (error) {
                        toast.error("Erreur lors de la mise à jour");
                    }
                }
            },
            onCancel: () => {
                toast.error("element pas modifier")
                setItemQte(0)
            },
        },
    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Backend now returns headers with nested items
            const response = await bLivraisonImpService.getAll();
            setBlData(response);

            const [impRes, livreRes, catRes] = await Promise.all([
                imprimeurService.getAll(),
                livreService.getAll(),
                categoryService.getAll()
            ]);

            setImprimeurs(impRes);
            setLivres(livreRes);
            setCategories(catRes);
        } catch (error) {
            toast.error("Erreur lors du chargement");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const updateDetail = (livreId, label, qte) => {
        setFormData(prev => {
            const filtered = prev.details.filter(item => item.livre_id !== livreId);
            if (parseInt(qte) > 0) {
                return { ...prev, details: [...filtered, { livre_id: livreId, label, qte }] };
            }
            return { ...prev, details: filtered };
        });
    };

    const handleAction = async (type, row) => {
        if (type === "view") {
            setSelectedBlItems({
                number: row.b_livraison_number,
                imprimeur: row.imprimeur?.raison_sociale,
                date: row.date_reception,
                items: row.items
            });
            setTimeout(() => {
                document.getElementById('bl-details-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleItemAction = async (type, itemRow) => {
        if (type === "edit") {
            setItemQte(Number(itemRow.quantite))
        }
    };

    const handleSubmit = async () => {
        if (formData.details.length === 0) {
            return toast.error("Veuillez ajouter au moins un livre");
        }
        try {
            await bLivraisonImpService.create({ ...formData, type: 'imp' });
            toast.success("BL enregistré avec succès");
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement du BL");
        }
    };

    const resetForm = () => {
        setFormData({
            imprimeur_id: "",
            date_reception: "",
            b_livraison_number: "",
            quantite: "",
            livre_id: "",
            remarks: "",
            annee: "2627",
            details: [],
        });
    }

    const booksByLevel = {};
    categories.forEach(cat => {
        booksByLevel[cat.libelle] = [];
        livres.forEach(liv => {
            if (liv.category && liv.category.libelle === cat.libelle) {
                booksByLevel[cat.libelle].push({
                    label: liv.titre,
                    value: liv.id
                });
            }
        });
    });

    const columns = [
        { header: "Fournisseur", accessor: "imprimeur.raison_sociale" },
        { header: "Date", accessor: "date_reception", type: "date" },
        { header: "N° BL", accessor: "b_livraison_number" },
        { header: "Total Livres", accessor: "items.length" },
    ];

    const schema = useMemo(() => [
        {
            name: "imprimeur_id",
            label: "Fournisseur",
            placeholder: "Choisir fournisseur",
            inputType: "select",
            items: imprimeurs.map(i => ({ label: i.raison_sociale, value: i.id })),
            value: formData.imprimeur_id,
            onChange: (v) => setFormData({ ...formData, imprimeur_id: v })
        },
        {
            name: "date_reception",
            label: "Date",
            inputType: "date",
            type: "date",
            value: formData.date_reception,
            onChange: (v) => setFormData({ ...formData, date_reception: v })
        },
        {
            name: "b_livraison_number",
            label: "N° BL",
            placeholder: "Ex: BL-2024-001",
            value: formData.b_livraison_number,
            onChange: (v) => setFormData({ ...formData, b_livraison_number: v })
        },
        { type: "section", label: "Sélection des Ouvrages" },
        {
            type: "book_accordion",
            data: booksByLevel,      // <--- RAW DATA
            details: formData.details, // <--- FOR VALUES
            onUpdateDetail: updateDetail // <--- YOUR LOGIC
        },
        { type: "section", label: "Récapitulatif" },
        {
            type: "summary",
            data: formData.details // <--- AUTOMATIC YELLOW TABLE
        }
    ], [formData, imprimeurs, booksByLevel]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des BL (Fournisseur &rarr; MSM-MEDIAS)</h1>
                <UniversalDialog
                    schema={schema}
                    config={{ title: "Saisie de Bon de Livraison" }}
                    trigger={
                        <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
                            + Saisir un nouveau BL
                        </Button>
                    }
                    onSubmit={handleSubmit}
                    grid={3}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Button onClick={() => navigate("/dash/fournisseurs/Synthese_BL", { replace: true })} className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer mb-2 group w-fit transition-colors">
                    <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-slate-100 transition-all duration-200 shadow-sm border border-slate-100">
                        <FileDown size={28} className="text-slate-700" />
                    </div>
                    <span className="font-bold text-xl underline underline-offset-4 decoration-1">Voir la Synthèse</span>
                </Button>
                <MyTable
                    data={blData}
                    variant="slate"
                    pageSize={10}
                    actions={["view", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={columns}
                    actionsDetaille={actionsDetaille}
                    enableSearch enableSorting
                />

                {selectedBlItems && (
                    <div id="bl-details-section" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 uppercase">
                                    Détails du BL: {selectedBlItems.number}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {selectedBlItems.imprimeur} — {selectedBlItems.date}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedBlItems(null)}
                                className="text-slate-400 hover:text-slate-900"
                            >
                                Fermer les détails
                            </Button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <MyTable
                                data={selectedBlItems.items}
                                variant="blue"
                                pageSize={20}
                                actions={["edit", "delete"]}
                                isLoading={isLoading}
                                onAction={(type, itemRow) => handleItemAction(type, itemRow)}
                                columns={[
                                    { header: "Désignation du Livre", accessor: "livre.titre" },
                                    { header: "Prix Achat unité", accessor: "livre.prix_achat", type: "curr" },
                                    { header: "Quantité Livrée", accessor: "quantite" },
                                    { header: "Prix Total", accessor: "livre.prix_achat * quantite", type: "curr" },
                                ]}
                                actionsDetaille={actionsSubDetaille}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FournisseurSaisirBl;
