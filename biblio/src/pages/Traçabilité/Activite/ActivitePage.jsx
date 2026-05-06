import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Activity, Download, Filter, Calendar } from "lucide-react";
import activityLogService from "../../../api/services/activityLogService";
import representantService from "../../../api/services/representantService";
import { formatMoney, dateFormat } from "../../../utils/helpers";

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

const ActivityLogPage = () => {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [kpis, setKpis] = useState({ total: 0, today: 0, byType: {} });
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [selectedRep, setSelectedRep] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [logs, reps] = await Promise.all([
                fetchAllPaginated(activityLogService.getAll),
                representantService.getAll(),
            ]);
            
            setRows(logs);
            setRepresentants(reps);
            
            // Calculate KPIs
            const today = new Date().toISOString().split('T')[0];
            const byType = logs.reduce((acc, log) => {
                acc[log.log_name] = (acc[log.log_name] || 0) + 1;
                return acc;
            }, {});
            
            setKpis({
                total: logs.length,
                today: logs.filter(l => l.created_at?.startsWith(today)).length,
                byType,
            });
        } catch (error) {
            logger("Error fetching activity logs:", error);
            toast.error("Erreur lors du chargement des activités");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filtered data
    const filteredData = useMemo(() => {
        return rows.filter(row => {
            if (selectedRep && row.causer_id !== selectedRep) return false;
            if (selectedDate && !row.created_at?.startsWith(selectedDate)) return false;
            if (selectedType !== "all" && row.log_name !== selectedType) return false;
            return true;
        });
    }, [rows, selectedRep, selectedDate, selectedType]);

    const columns = useMemo(
        () => [
            { header: "Date", accessor: "created_at", type: "date" },
            { header: "Utilisateur", accessor: "causer.name" },
            { header: "Action", accessor: "description" },
            { header: "Type", accessor: "log_name" },
            { header: "Entité", accessor: "subject_type" },
            { header: "Détails", accessor: "properties.attributes", type: "json-preview" },
        ],
        []
    );

    const repOptions = useMemo(() => 
        representants.map(r => ({ label: r.nom, value: r.id })),
        [representants]
    );

    const activityTypes = useMemo(() => {
        const types = [...new Set(rows.map(r => r.log_name))].filter(Boolean);
        return [{ label: "Tous", value: "all" }, ...types.map(t => ({ label: t, value: t }))];
    }, [rows]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Journal d'Activité</h1>
                        <p className="text-slate-500 text-sm">Suivi des actions et modifications du système</p>
                    </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download size={16} /> Exporter
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Activités</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.total}</p>
                </div>
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Aujourd'hui</p>
                    <p className="text-2xl font-black text-emerald-900">{kpis.today}</p>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Types d'activité</p>
                    <p className="text-2xl font-black text-blue-900">{Object.keys(kpis.byType).length}</p>
                </div>
                <div className="p-6 bg-purple-50 border border-purple-100 rounded-xl">
                    <p className="text-xs text-purple-600 font-bold uppercase mb-1">Représentants</p>
                    <p className="text-2xl font-black text-purple-900">{representants.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">Filtres:</span>
                </div>
                
                <select
                    className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-1 focus:ring-slate-900"
                    value={selectedRep}
                    onChange={(e) => setSelectedRep(e.target.value)}
                >
                    <option value="">Tous les représentants</option>
                    {repOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <select
                    className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-1 focus:ring-slate-900"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    {activityTypes.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-500" />
                    <input
                        type="date"
                        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-1 focus:ring-slate-900"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {(selectedRep || selectedDate || selectedType !== "all") && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSelectedRep("");
                            setSelectedDate("");
                            setSelectedType("all");
                        }}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        Réinitialiser
                    </Button>
                )}
            </div>

            {/* Activity Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={filteredData}
                    columns={columns}
                    pageSize={15}
                    variant="slate"
                    isLoading={isLoading}
                    enableSearch
                    enableSorting
                />
            </div>
        </div>
    );
};

export default ActivityLogPage;
