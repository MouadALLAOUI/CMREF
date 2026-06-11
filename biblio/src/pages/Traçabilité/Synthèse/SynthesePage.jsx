import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { BarChart3, Printer } from "lucide-react";
import clientService from "../../../api/services/clientService";
import bVentesClientService from "../../../api/services/bVentesClientService";
import clientRemboursementService from "../../../api/services/clientRemboursementService";
import representantService from "../../../api/services/representantService";
import livreService from "../../../api/services/livreService";
import useAppStore from "../../../store/useAppStore";
import { calculateRecouvrement } from "../../../utils/helpers";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import SyntheseTracabilitePdf from "../../../components/pdfs/syntheses/SyntheseTracabilitePdf";
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

const SyntheseTracabilitePage = () => {
    const { activeSeason } = useAppStore();
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [selectedRep, setSelectedRep] = useState("all");
    const [kpis, setKpis] = useState({
        ventes: 0,
        remboursements: 0,
        solde: 0,
        clientsActifs: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [pdfOpen, setPdfOpen] = useState(false);
    const printRef = useRef(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const seasonParams = activeSeason?.label ? { annee: activeSeason.label } : {};
            const [clients, ventes, remboursements, livres, reps] = await Promise.all([
                fetchAllPaginated(clientService.getAll),
                fetchAllPaginated(bVentesClientService.getAll, seasonParams),
                fetchAllPaginated(clientRemboursementService.getAll, seasonParams),
                fetchAllPaginated(livreService.getAll),
                representantService.getAll(),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));

            const blNumbersByClient = new Map();
            const ventesByClient = new Map();
            const repByClient = new Map();
            for (const v of ventes) {
                const clientId = v.client_id || v.client?.id;
                if (!clientId) continue;

                if (v.rep_id || v.representant?.id) {
                    repByClient.set(clientId, v.rep_id || v.representant?.id);
                }

                const bNumber = v.b_vente_number;
                if (bNumber) {
                    const set = blNumbersByClient.get(clientId) || new Set();
                    set.add(String(bNumber));
                    blNumbersByClient.set(clientId, set);
                }

                const livre = livreById.get(v.livre_id || v.livre?.id);
                const unit = toNumber(livre?.prix_vente ?? livre?.prix_public ?? 0);
                const qty = toNumber(v.quantite);
                const remisePct = toNumber(v.remise);
                const total = unit * qty * (1 - remisePct / 100);
                ventesByClient.set(clientId, (ventesByClient.get(clientId) || 0) + total);
            }

            const rembByClient = new Map();
            for (const r of remboursements) {
                const clientId = r.client_id || r.client?.id;
                if (!clientId) continue;
                rembByClient.set(clientId, (rembByClient.get(clientId) || 0) + toNumber(r.montant));
            }

            const computed = clients.map((c) => {
                const clientId = c.id;
                const totalVentes = ventesByClient.get(clientId) || 0;
                const totalRemb = rembByClient.get(clientId) || 0;
                const nbBL = blNumbersByClient.get(clientId)?.size || 0;
                const repId = repByClient.get(clientId) || c.representant_id || "";
                return {
                    id: clientId,
                    client: c.raison_sociale || c.nom || c.id,
                    rep_id: repId,
                    nbBL,
                    totalVentes,
                    totalRemb,
                    solde: totalVentes - totalRemb,
                    recouvrement: calculateRecouvrement(totalRemb, totalVentes),
                };
            }).filter((row) => row.nbBL > 0 || row.totalRemb > 0 || row.totalVentes > 0);

            setRows(computed);
            setRepresentants(reps);

            const ventesTotal = computed.reduce((sum, r) => sum + toNumber(r.totalVentes), 0);
            const rembTotal = computed.reduce((sum, r) => sum + toNumber(r.totalRemb), 0);
            const soldeTotal = computed.reduce((sum, r) => sum + toNumber(r.solde), 0);

            setKpis({
                ventes: ventesTotal,
                remboursements: rembTotal,
                solde: soldeTotal,
                clientsActifs: computed.length,
            });
        } catch (error) {
            logger("Error computing synthese traçabilité:", error);
            toast.error("Erreur lors du chargement de la synthèse");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeSeason?.label]);

    const filteredRows = useMemo(() => {
        if (selectedRep === "all") return rows;
        return rows.filter(r => r.rep_id === selectedRep);
    }, [rows, selectedRep]);

    const totals = useMemo(() => {
        const ventes = filteredRows.reduce((sum, r) => sum + toNumber(r.totalVentes), 0);
        const remb = filteredRows.reduce((sum, r) => sum + toNumber(r.totalRemb), 0);
        const solde = filteredRows.reduce((sum, r) => sum + toNumber(r.solde), 0);
        const recouvrement = calculateRecouvrement(remb, ventes);
        return { ventes, remb, solde, recouvrement };
    }, [filteredRows]);

    const repOptions = useMemo(() => [
        { label: "Tous les représentants", value: "all" },
        ...representants.map((r) => ({ label: r.nom, value: r.id })),
    ], [representants]);

    const columns = useMemo(
        () => [
            { header: "Client", accessor: "client" },
            { header: "Crédit (DH)", accessor: "totalVentes", type: "money" },
            { header: "Avance (DH)", accessor: "totalRemb", type: "money" },
            { header: "Reste (DH)", accessor: "solde", type: "money" },
            {
                header: "Recouvrement",
                accessor: "recouvrement",
                type: "percentage",
            },
        ],
        []
    );

    const seasonLabel = activeSeason?.label
        ? `Saison : ${schoolYearFormat(activeSeason.label)}`
        : "";

    const repLabel = selectedRep === "all"
        ? "Tous"
        : representants.find(r => r.id === selectedRep)?.nom || "";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="text-slate-900" />
                        <h1 className="text-2xl font-bold text-slate-800">Synthèse Traçabilité</h1>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Représentant:</span>
                        <select
                            value={selectedRep}
                            onChange={(e) => setSelectedRep(e.target.value)}
                            className="bg-slate-100 border-none text-sm font-bold rounded-lg px-3 py-1 focus:ring-2 focus:ring-slate-900"
                        >
                            {repOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setPdfOpen(true)} className="bg-slate-900 text-white flex items-center gap-2 hover:bg-black">
                        <Printer size={16} /> Imprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Clients actifs</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.clientsActifs}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total ventes</p>
                    <p className="text-2xl font-black text-emerald-700">{kpis.ventes.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total remboursé</p>
                    <p className="text-2xl font-black text-blue-700">{kpis.remboursements.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Solde</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.solde.toLocaleString()} DH</p>
                </div>
            </div>

            <div ref={printRef}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <MyTable
                        data={filteredRows}
                        columns={columns}
                        pageSize={10}
                        variant="slate"
                        isLoading={isLoading}
                        enableSearch
                        enableSorting
                    />
                    {/* TOTAL footer row */}
                    <div className="grid grid-cols-5 bg-slate-50 border-t-2 border-slate-200 text-sm font-bold">
                        <div className="px-4 py-3 text-slate-700 uppercase">Total</div>
                        <div className="px-4 py-3 text-center text-emerald-700">{totals.ventes.toLocaleString()} DH</div>
                        <div className="px-4 py-3 text-center text-blue-700">{totals.remb.toLocaleString()} DH</div>
                        <div className="px-4 py-3 text-center text-slate-900">{totals.solde.toLocaleString()} DH</div>
                        <div className="px-4 py-3 text-center text-slate-900">{totals.recouvrement.toFixed(1)}%</div>
                    </div>
                </div>
            </div>

            <PdfDialogViewer
                open={pdfOpen}
                onOpenChange={setPdfOpen}
                title="Synthèse Traçabilité"
                document={
                    <SyntheseTracabilitePdf
                        rows={filteredRows}
                        kpis={kpis}
                        repLabel={repLabel}
                        seasonLabel={seasonLabel}
                    />
                }
            />
        </div>
    );
};

export default SyntheseTracabilitePage;
