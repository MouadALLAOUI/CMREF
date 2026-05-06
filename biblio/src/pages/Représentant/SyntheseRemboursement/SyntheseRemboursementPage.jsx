import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download, TrendingDown, Users, Wallet, CreditCard } from "lucide-react";
import repRemboursementService from "../../../api/services/repRemboursementService";
import representantService from "../../../api/services/representantService";
import { formatMoney, calculateFinancialSummary } from "../../../utils/helpers";

const fetchAllPaginated = async (serviceGetAll, params = {}) => {
    const first = await serviceGetAll({ ...params, page: 1 });
    const firstData = first;
    const meta = first?.meta;
    if (!meta?.last_page) return firstData;

    const lastPage = meta.last_page;
    const pages = [];
    for (let page = 2; page <= lastPage; page += 1) {
        pages.push(serviceGetAll({ ...params, page }));
    }
    const rest = await Promise.all(pages);
    return [...firstData, ...rest.flatMap((r) => r)];
};

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const SyntheseRemboursementPage = () => {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [kpis, setKpis] = useState({ total: 0, operations: 0, totalCredit: 0, totalAvance: 0, totalReste: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [ops, reps] = await Promise.all([
                fetchAllPaginated(repRemboursementService.getAll),
                representantService.getAll(),
            ]);
            setRepresentants(reps);
            
            const grouped = new Map();

            for (const o of ops) {
                const repId = o.rep_id || o.representant?.id;
                if (!repId) continue;
                const prev = grouped.get(repId) || {
                    id: repId,
                    rep: o.representant?.nom || repId,
                    nbRemb: 0,
                    totalRemb: 0,
                    lastUpdate: "",
                };
                prev.nbRemb += 1;
                prev.totalRemb += toNumber(o.montant);
                if (o.date_payment && (!prev.lastUpdate || String(o.date_payment) > String(prev.lastUpdate))) {
                    prev.lastUpdate = o.date_payment;
                }
                grouped.set(repId, prev);
            }

            const computed = Array.from(grouped.values()).sort((a, b) => b.totalRemb - a.totalRemb);
            setRows(computed);
            
            // Calculate financial summary
            const financialSummary = calculateFinancialSummary(ops);
            
            setKpis({
                total: computed.reduce((sum, r) => sum + toNumber(r.totalRemb), 0),
                operations: ops.length,
                totalCredit: financialSummary.totalCredit,
                totalAvance: financialSummary.totalAvance,
                totalReste: financialSummary.totalReste,
            });
        } catch (error) {
            logger("Error computing synthese remboursements:", error);
            toast.error("Erreur lors du chargement de la synthèse des remboursements");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            { header: "Représentant", accessor: "rep" },
            { header: "Nb remboursements", accessor: "nbRemb" },
            { header: "Total remboursé (DH)", accessor: "totalRemb", type: "money" },
            { header: "Dernier paiement", accessor: "lastUpdate", type: "date" },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Synthèse des Remboursements</h1>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={16} /> Exporter
                    </Button>
                    <Button className="bg-emerald-600 text-white flex items-center gap-2">
                        <Printer size={16} /> Imprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Total Remboursé REP</p>
                        <p className="text-2xl font-black text-emerald-900">{formatMoney(kpis.total)}</p>
                    </div>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Crédit Total</p>
                        <p className="text-2xl font-black text-blue-900">{formatMoney(kpis.totalCredit)}</p>
                    </div>
                </div>
                <div className="p-6 bg-purple-50 border border-purple-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-purple-600 font-bold uppercase tracking-widest">Avance Totale</p>
                        <p className="text-2xl font-black text-purple-900">{formatMoney(kpis.totalAvance)}</p>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Nb Total Opérations</p>
                        <p className="text-2xl font-black text-slate-900">{kpis.operations}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={rows}
                    columns={columns}
                    pageSize={10}
                    variant="slate"
                    isLoading={isLoading}
                    enableSearch
                    enableSorting
                />
            </div>
        </div>
    );
};

export default SyntheseRemboursementPage;
