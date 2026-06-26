import { useState, useEffect, useMemo } from "react";
import { DollarSign, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import SectionContainer from "../../../components/ui/SectionContainer";
import repRemboursementService from "../../../api/services/repRemboursementService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepRembBLPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [remboursements, setRemboursements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await repRemboursementService.getAll({ annee: activeSeason?.label });
            setRemboursements(res?.data?.data || res?.data || []);
        } catch (error) {
            logger("Failed to load remboursements", "error")();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeSeason?.label) fetchData();
    }, [activeSeason?.label]);

    const handleToggleRecu = async (remb) => {
        try {
            await repRemboursementService.update(remb.id, { statut_recu: !remb.statut_recu });
            toast.success(remb.statut_recu ? "Marqué comme non reçu" : "Marqué comme reçu");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
            logger("Failed to update remboursement statut_recu", "error")();
        }
    };

    const handleToggleAccepte = async (remb) => {
        try {
            await repRemboursementService.update(remb.id, { statut_accepte: !remb.statut_accepte });
            toast.success(remb.statut_accepte ? "Marqué comme non accepté" : "Marqué comme accepté");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
            logger("Failed to update remboursement statut_accepte", "error")();
        }
    };

    const handleToggleRejete = async (remb) => {
        try {
            await repRemboursementService.update(remb.id, { statut_rejete: !remb.statut_rejete });
            toast.success(remb.statut_rejete ? "Marqué comme non rejeté" : "Marqué comme rejeté");
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
            logger("Failed to update remboursement statut_rejete", "error")();
        }
    };

    const columns = [
        { header: "Donné le", accessor: "date_payment", cell: ({ getValue }) => {
            const d = getValue();
            return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
        }},
        { header: "Banque", accessor: "banque", cell: ({ row }) => row.original.banque?.nom || "—" },
        { header: "Chèque N°", accessor: "cheque_number" },
        { header: "Type de virement", accessor: "type_versement" },
        { header: "A l'ordre de", accessor: "compte" },
        { header: "Montant (DH)", accessor: "montant", cell: ({ getValue }) => (
            <span className="font-bold">{(getValue() || 0).toLocaleString()} DH</span>
        )},
        { header: "Date prévue", accessor: "date_prevue", cell: ({ getValue }) => {
            const d = getValue();
            return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
        }},
        { header: "Reçu", accessor: "statut_recu", cell: ({ row }) => (
            <button
                onClick={() => handleToggleRecu(row.original)}
                className={`p-1.5 rounded-lg transition-colors ${
                    row.original.statut_recu
                        ? "bg-emerald-100 hover:bg-emerald-200"
                        : "bg-red-100 hover:bg-red-200"
                }`}
            >
                {row.original.statut_recu
                    ? <CheckCircle2 size={18} className="text-emerald-600" />
                    : <XCircle size={18} className="text-red-500" />
                }
            </button>
        )},
        { header: "Accepté", accessor: "statut_accepte", cell: ({ row }) => (
            <button
                onClick={() => handleToggleAccepte(row.original)}
                className={`p-1.5 rounded-lg transition-colors ${
                    row.original.statut_accepte
                        ? "bg-emerald-100 hover:bg-emerald-200"
                        : "bg-slate-100 hover:bg-slate-200"
                }`}
            >
                {row.original.statut_accepte
                    ? <CheckCircle2 size={18} className="text-emerald-600" />
                    : <AlertCircle size={18} className="text-slate-400" />
                }
            </button>
        )},
        { header: "Rejeté", accessor: "statut_rejete", cell: ({ row }) => (
            <button
                onClick={() => handleToggleRejete(row.original)}
                className={`p-1.5 rounded-lg transition-colors ${
                    row.original.statut_rejete
                        ? "bg-red-100 hover:bg-red-200"
                        : "bg-slate-100 hover:bg-slate-200"
                }`}
            >
                {row.original.statut_rejete
                    ? <XCircle size={18} className="text-red-600" />
                    : <AlertCircle size={18} className="text-slate-400" />
                }
            </button>
        )},
        { header: "Retourné", accessor: "statut_retourne", cell: ({ row }) => (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                row.original.statut_retourne
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-100 text-slate-400"
            }`}>
                {row.original.statut_retourne ? "Retourné" : "—"}
            </span>
        )},
    ];

    const totalMontant = useMemo(() =>
        remboursements.reduce((sum, r) => sum + (r.montant || 0), 0),
        [remboursements]
    );

    const nonRecusCount = useMemo(() =>
        remboursements.filter(r => !r.statut_recu).length,
        [remboursements]
    );

    const nonAcceptesCount = useMemo(() =>
        remboursements.filter(r => !r.statut_accepte && !r.statut_rejete).length,
        [remboursements]
    );

    const rejeteCount = useMemo(() =>
        remboursements.filter(r => r.statut_rejete).length,
        [remboursements]
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <DollarSign size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mes Remboursements</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Suivi de vos chèques et versements
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Résumé Financier</h3>
                <div className="flex flex-wrap gap-6 text-sm">
                    <span>
                        Crédit :{" "}
                        <span className="font-black text-blue-600">{totalMontant.toLocaleString()} DH</span>
                    </span>
                    <span>
                        Avance :{" "}
                        <span className="font-black text-emerald-600">
                            {remboursements.filter(r => r.statut_accepte).reduce((s, r) => s + (r.montant || 0), 0).toLocaleString()} DH
                        </span>
                    </span>
                    <span>
                        Reste :{" "}
                        <span className="font-black text-red-600">
                            {(totalMontant - remboursements.filter(r => r.statut_accepte).reduce((s, r) => s + (r.montant || 0), 0)).toLocaleString()} DH
                        </span>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {nonRecusCount}
                        </div>
                        <p className="text-xs text-red-600 font-bold uppercase">Non Reçus</p>
                    </div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {nonAcceptesCount}
                        </div>
                        <p className="text-xs text-amber-600 font-bold uppercase">En Attente</p>
                    </div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {rejeteCount}
                        </div>
                        <p className="text-xs text-red-700 font-bold uppercase">Rejetés</p>
                    </div>
                </div>
            </div>

            <SectionContainer
                title="Remboursements"
                icon={DollarSign}
                headerColor="bg-blue-600"
                collapsible={true}
                defaultOpen={true}
            >
                <MyTable
                    data={remboursements}
                    columns={columns}
                    pageSize={15}
                    variant="slate"
                    isLoading={isLoading}
                    enableSearch={true}
                    enableSorting={true}
                />
            </SectionContainer>
        </div>
    );
}

export default RepRembBLPage;
