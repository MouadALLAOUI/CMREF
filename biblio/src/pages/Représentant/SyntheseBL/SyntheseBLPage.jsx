/* eslint-disable no-console */
import useAppStore from "../../../store/useAppStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download } from "lucide-react";
import bLivraisonService from "../../../api/services/bLivraisonService";

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

const SyntheseBLPage = () => {
    const { activeSeason } = useAppStore();
    const selectedSeasonId = activeSeason?.label || "";
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ totalBL: 0, montant: 0, reps: 0 });
    const [isLoading, setIsLoading] = useState(true);



    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (selectedSeasonId && selectedSeasonId !== "all") {
                params.annee = selectedSeasonId;
            }
            const blivraisons = await fetchAllPaginated(bLivraisonService.getAll, params);
            const grouped = new Map();

            for (const bl of blivraisons) {
                const repId = bl.representant?.id;
                if (!repId) continue;

                const repNom = bl.representant?.nom || repId;
                const prev = grouped.get(repId) || {
                    id: repId,
                    rep: repNom,
                    totalBL: 0,
                    totalMontant: 0,
                    lastUpdate: "",
                    blNumbers: new Set(),
                };

                if (bl.bl_number) prev.blNumbers.add(String(bl.bl_number));
                prev.totalBL = prev.blNumbers.size;
                if (bl.date_emission && (!prev.lastUpdate || String(bl.date_emission) > String(prev.lastUpdate))) {
                    prev.lastUpdate = bl.date_emission;
                }

                for (const it of bl.items || []) {
                    const qty = toNumber(it.quantite);
                    const unit = toNumber(it.livre?.prix_vente ?? it.livre?.prix_public ?? 0);
                    prev.totalMontant += qty * unit;
                }

                grouped.set(repId, prev);
            }

            const computed = Array.from(grouped.values()).sort((a, b) => b.totalMontant - a.totalMontant);
            setRows(computed);
            setKpis({
                totalBL: computed.reduce((sum, r) => sum + toNumber(r.totalBL), 0),
                montant: computed.reduce((sum, r) => sum + toNumber(r.totalMontant), 0),
                reps: computed.length,
            });
        } catch (error) {
            logger("Error computing synthese BL:", error);
            toast.error("Erreur lors du chargement de la synthèse BL");
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
            { header: "Nombre de BL", accessor: "totalBL" },
            { header: "Montant total (DH)", accessor: "totalMontant", type: "money" },
            { header: "Dernière émission", accessor: "lastUpdate", type: "date" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Synthèse des Bons de Livraison</h1>

                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={16} /> Exporter (CSV)
                    </Button>
                    <Button className="bg-slate-900 text-white flex items-center gap-2 hover:bg-black">
                        <Printer size={16} /> Imprimer Tout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Total BL (Saison)</p>
                    <p className="text-2xl font-bold text-blue-900">{kpis.totalBL}</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-emerald-900">{kpis.montant.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-sm text-slate-600 font-semibold uppercase tracking-wider">Représentants Actifs</p>
                    <p className="text-2xl font-bold text-slate-900">{kpis.reps}</p>
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

export default SyntheseBLPage;
