import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Archive, Printer, Download } from "lucide-react";
import depotService from "../../../api/services/depotService";
import seasonsService from "../../../api/services/seasonsService";
import { exportToCSV } from "../../../utils/helpers";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import DepotPdf from "../../../components/pdfs/syntheses/DepotPdf";
import { schoolYearFormat } from "../../../lib/utilities";

const fetchAllPaginated = async (serviceGetAll, params = {}) => {
    const first = await serviceGetAll({ ...params, page: 1 });
    const firstData = Array.isArray(first) ? first : first?.data || [];
    const meta = first?.meta;
    if (!meta?.last_page) return firstData;

    const lastPage = meta.last_page;
    const pages = [];
    for (let page = 2; page <= lastPage; page += 1) {
        pages.push(serviceGetAll({ ...params, page }));
    }
    const rest = await Promise.all(pages);
    const restData = rest.flatMap((r) => Array.isArray(r) ? r : r?.data || []);
    return [...firstData, ...restData];
};

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const DepotPage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ lignes: 0, reps: 0, quantite: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState("");
    const [pdfOpen, setPdfOpen] = useState(false);
    const printRef = useRef(null);

    useEffect(() => {
        seasonsService.getAll().then(setSeasons).catch(() => {});
    }, []);

    useEffect(() => {
        if (seasons.length > 0 && !selectedSeasonId) {
            const active = seasons.find(s => s.is_active);
            setSelectedSeasonId(active?.id || seasons[0]?.id || "");
        }
    }, [seasons]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (selectedSeasonId && selectedSeasonId !== "all") {
                params.season_id = selectedSeasonId;
            }
            const depots = await fetchAllPaginated(depotService.getAll, params);
            const computed = depots.map((d) => ({
                id: d.id,
                rep: d.representant?.nom || d.rep_id || "—",
                livre: d.livre?.titre || d.livre_id || "—",
                qteDepot: toNumber(d.quantite_balance),
                status: d.status || "—",
                date: d.updated_at || d.created_at || "",
            }));

            const reps = new Set(computed.map((r) => r.rep).filter(Boolean));
            setRows(computed);
            setKpis({
                lignes: computed.length,
                reps: reps.size,
                quantite: computed.reduce((sum, r) => sum + toNumber(r.qteDepot), 0),
            });
        } catch (error) {
            logger("Error fetching depots synthèse:", error);
            toast.error("Erreur lors du chargement de la synthèse dépôt");
        } finally {
            setIsLoading(false);
        }
    }, [selectedSeasonId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            { header: "Représentant", accessor: "rep" },
            { header: "Ouvrage", accessor: "livre" },
            { header: "Qté en dépôt", accessor: "qteDepot" },
            { header: "Statut", accessor: "status" },
            { header: "Dernière opération", accessor: "date", type: "date" },
        ],
        []
    );

    const seasonLabel = selectedSeasonId && selectedSeasonId !== "all"
        ? schoolYearFormat(seasons.find(s => s.id === selectedSeasonId)?.name)
        : "Toutes les saisons";

    const handleExportCSV = () => {
        const cols = [
            { header: "Représentant", accessor: "rep" },
            { header: "Ouvrage", accessor: "livre" },
            { header: "Qté en dépôt", accessor: "qteDepot" },
            { header: "Statut", accessor: "status" },
            { header: "Dernière opération", accessor: "date" },
        ];
        exportToCSV(rows, cols, `Depot_${seasonLabel.replace(/\s+|\//g, '_')}.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Archive className="text-amber-600" />
                        <h1 className="text-2xl font-bold text-slate-800">Synthèse du Dépôt</h1>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Filtre Saison:</span>
                        <select
                            value={selectedSeasonId}
                            onChange={(e) => setSelectedSeasonId(e.target.value)}
                            className="bg-slate-100 border-none text-sm font-bold rounded-lg px-3 py-1 focus:ring-2 focus:ring-slate-900"
                        >
                            <option value="all">Toutes les saisons</option>
                            {seasons.map(s => (
                                <option key={s.id} value={s.id}>{s.name.slice(0, 2)} / {s.name.slice(2)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleExportCSV} className="bg-emerald-700 text-white flex items-center gap-2 hover:bg-emerald-800">
                        <Download size={16} /> CSV
                    </Button>
                    <Button onClick={() => setPdfOpen(true)} className="bg-slate-900 text-white flex items-center gap-2 hover:bg-black">
                        <Printer size={16} /> Imprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Lignes</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.lignes}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Représentants</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.reps}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Quantité en dépôt</p>
                    <p className="text-2xl font-black text-amber-700">{kpis.quantite.toLocaleString()}</p>
                </div>
            </div>

            <div ref={printRef}>
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

            <PdfDialogViewer
                open={pdfOpen}
                onOpenChange={setPdfOpen}
                title="Synthèse du Dépôt"
                document={
                    <DepotPdf
                        rows={rows}
                        kpis={kpis}
                        seasonLabel={seasonLabel}
                    />
                }
            />
        </div>
    );
};

export default DepotPage;
