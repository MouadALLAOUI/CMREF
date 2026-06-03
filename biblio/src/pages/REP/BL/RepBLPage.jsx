import { useState, useEffect, useMemo } from "react";
import { FileText, CheckCircle2, XCircle, Eye } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import bLivraisonService from "../../../api/services/bLivraisonService";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepBLPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [bls, setBls] = useState([]);
    const [selectedBL, setSelectedBL] = useState(null);
    const [blItems, setBlItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingItems, setIsLoadingItems] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await bLivraisonService.getAll({ annee: activeSeason?.name });
            setBls(res?.data?.data || res?.data || []);
        } catch (error) {
            logger("Failed to load BLs", "error")();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeSeason?.name) fetchData();
    }, [activeSeason?.name]);

    const handleViewDetails = async (bl) => {
        setSelectedBL(bl);
        setIsLoadingItems(true);
        try {
            const res = await bLivraisonItemService.getAll({ b_livraison_id: bl.id });
            setBlItems(res?.data?.data || res?.data || []);
        } catch (error) {
            logger("Failed to load BL items", "error")();
        } finally {
            setIsLoadingItems(false);
        }
    };

    const handleToggleRecu = async (bl) => {
        try {
            await bLivraisonService.update(bl.id, { statut_recu: !bl.statut_recu });
            toast.success(bl.statut_recu ? "BL marqué comme non reçu" : "BL marqué comme reçu");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
            logger("Failed to update BL statut_recu", "error")();
        }
    };

    const columns = [
        { header: "BL", accessor: "bl_number", cell: ({ row }) => (
            <span className="font-mono font-bold text-sm">{row.original.bl_number || `BL-${row.original.id?.slice(0,8)}`}</span>
        )},
        { header: "Date", accessor: "date_emission", cell: ({ getValue }) => {
            const d = getValue();
            return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
        }},
        { header: "Mode d'envoi", accessor: "mode_envoi", cell: ({ getValue }) => getValue() || "---" },
        { header: "Type", accessor: "type", cell: ({ getValue }) => {
            const v = getValue();
            const colors = {
                "Livre": "bg-blue-100 text-blue-800",
                "Specimen": "bg-purple-100 text-purple-800",
                "Retour": "bg-orange-100 text-orange-800",
                "Pedagogie": "bg-emerald-100 text-emerald-800"
            };
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[v] || "bg-slate-100 text-slate-800"}`}>
                    {v || "—"}
                </span>
            );
        }},
        { header: "Détails", accessor: "details", cell: ({ row }) => (
            <button
                onClick={() => handleViewDetails(row.original)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Voir les détails"
            >
                <Eye size={16} className="text-slate-600" />
            </button>
        )},
        { header: "Reçu", accessor: "statut_recu", cell: ({ row }) => {
            const isRecu = row.original.statut_recu;
            return (
                <button
                    onClick={() => handleToggleRecu(row.original)}
                    className={`p-1.5 rounded-lg transition-colors ${
                        isRecu
                            ? "bg-emerald-100 hover:bg-emerald-200"
                            : "bg-red-100 hover:bg-red-200"
                    }`}
                    title={isRecu ? "Marqué reçu" : "Non reçu - cliquer pour confirmer"}
                >
                    {isRecu
                        ? <CheckCircle2 size={18} className="text-emerald-600" />
                        : <XCircle size={18} className="text-red-500" />
                    }
                </button>
            );
        }}
    ];

    const itemColumns = [
        { header: "Livre", accessor: "livre", cell: ({ row }) => row.original.livre?.titre || "—" },
        { header: "Code", accessor: "code", cell: ({ row }) => row.original.livre?.code || "—" },
        { header: "Quantité", accessor: "quantite" },
        { header: "Prix Unitaire", accessor: "prix", cell: ({ row }) => `${(row.original.livre?.prix_vente || 0).toFixed(2)} DH` }
    ];

    const unreceivedCount = useMemo(() =>
        bls.filter(bl => !bl.statut_recu).length,
        [bls]
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <FileText size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mes Bons de Livraison</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Liste de vos BL pour la saison {activeSeason?.name || "—"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase">Total BL</p>
                    <p className="text-2xl font-black text-slate-900">{bls.length}</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm">
                    <p className="text-xs text-emerald-600 font-bold uppercase">Reçus</p>
                    <p className="text-2xl font-black text-emerald-700">{bls.length - unreceivedCount}</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
                    <p className="text-xs text-red-500 font-bold uppercase">Non Reçus</p>
                    <p className="text-2xl font-black text-red-600">{unreceivedCount}</p>
                </div>
            </div>

            <SectionContainer
                title="Liste des BL"
                icon={FileText}
                headerColor="bg-blue-600"
                collapsible={true}
                defaultOpen={true}
            >
                <MyTable
                    data={bls}
                    columns={columns}
                    pageSize={15}
                    variant="slate"
                    isLoading={isLoading}
                    enableSearch={true}
                    enableSorting={true}
                />
            </SectionContainer>

            {selectedBL && (
                <SectionContainer
                    title={`Détails du BL : ${selectedBL.bl_number || "—"}`}
                    icon={Eye}
                    headerColor="bg-slate-700"
                    collapsible={true}
                    defaultOpen={true}
                >
                    <MyTable
                        data={blItems}
                        columns={itemColumns}
                        pageSize={10}
                        variant="slate"
                        isLoading={isLoadingItems}
                        enableSearch={false}
                    />
                </SectionContainer>
            )}
        </div>
    );
}

export default RepBLPage;
