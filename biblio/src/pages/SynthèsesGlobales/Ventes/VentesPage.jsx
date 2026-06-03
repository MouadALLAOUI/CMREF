import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { TrendingUp, Printer, Download } from "lucide-react";
import bVentesClientService from "../../../api/services/bVentesClientService";
import livreService from "../../../api/services/livreService";
import seasonsService from "../../../api/services/seasonsService";
import { exportToCSV } from "../../../utils/helpers";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import VentesPdf from "../../../components/pdfs/syntheses/VentesPdf";
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

const CATEGORY_ORDER = ["Primaire", "Collège", "Lycée", "Préscolaire", "Robotos"];

const VentesPage = () => {
    const [categorySections, setCategorySections] = useState([]);
    const [globalRows, setGlobalRows] = useState([]);
    const [kpis, setKpis] = useState({ qte: 0, total: 0, articles: 0 });
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
            const [ventes, livres] = await Promise.all([
                fetchAllPaginated(bVentesClientService.getAll, params),
                fetchAllPaginated(livreService.getAll),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));

            const grouped = new Map();
            for (const v of ventes) {
                const livreId = v.livre_id || v.livre?.id;
                if (!livreId) continue;
                const livre = livreById.get(livreId);
                const unit = toNumber(livre?.prix_vente ?? livre?.prix_public ?? 0);
                const qty = toNumber(v.quantite);
                const remisePct = toNumber(v.remise);
                const total = unit * qty * (1 - remisePct / 100);

                const prev = grouped.get(livreId) || {
                    id: livreId,
                    article: livre?.titre || livre?.nom || livreId,
                    code: livre?.code || "",
                    categorie: livre?.categorie?.libelle || "Autres",
                    qte: 0,
                    prixUnit: unit,
                    total: 0,
                };
                prev.qte += qty;
                prev.total += total;
                grouped.set(livreId, prev);
            }

            const computed = Array.from(grouped.values()).sort((a, b) => b.total - a.total);
            const qteTotal = computed.reduce((sum, r) => sum + toNumber(r.qte), 0);
            const totalVentes = computed.reduce((sum, r) => sum + toNumber(r.total), 0);

            setGlobalRows(computed);
            setKpis({ qte: qteTotal, total: totalVentes, articles: computed.length });

            const catMap = new Map();
            for (const row of computed) {
                const cat = row.categorie || "Autres";
                if (!catMap.has(cat)) catMap.set(cat, []);
                catMap.get(cat).push(row);
            }

            const sections = CATEGORY_ORDER
                .filter(cat => catMap.has(cat))
                .map(cat => ({
                    category: cat,
                    books: catMap.get(cat),
                    totalQte: catMap.get(cat).reduce((s, r) => s + toNumber(r.qte), 0),
                    totalMontant: catMap.get(cat).reduce((s, r) => s + toNumber(r.total), 0),
                }));

            const extraCats = Array.from(catMap.keys())
                .filter(cat => !CATEGORY_ORDER.includes(cat))
                .map(cat => ({
                    category: cat,
                    books: catMap.get(cat),
                    totalQte: catMap.get(cat).reduce((s, r) => s + toNumber(r.qte), 0),
                    totalMontant: catMap.get(cat).reduce((s, r) => s + toNumber(r.total), 0),
                }));

            setCategorySections([...sections, ...extraCats]);
        } catch (error) {
            logger("Error computing ventes synthèse:", error);
            toast.error("Erreur lors du chargement des ventes");
        } finally {
            setIsLoading(false);
        }
    }, [selectedSeasonId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const seasonLabel = selectedSeasonId && selectedSeasonId !== "all"
        ? schoolYearFormat(seasons.find(s => s.id === selectedSeasonId)?.name)
        : "Toutes les saisons";

    const handleExportCSV = () => {
        const exportData = [];
        categorySections.forEach(section => {
            section.books.forEach(book => {
                exportData.push({
                    Catégorie: section.category,
                    Article: book.titre,
                    Code: book.code,
                    Vendu: book.vente,
                    "Total (DH)": book.total,
                });
            });
        });
        const cols = [
            { header: "Catégorie", accessor: "Catégorie" },
            { header: "Article", accessor: "Article" },
            { header: "Code", accessor: "Code" },
            { header: "Vendu", accessor: "Vendu" },
            { header: "Total (DH)", accessor: "Total (DH)" },
        ];
        exportToCSV(exportData, cols, `Ventes_${seasonLabel.replace(/\s+|\//g, '_')}.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-emerald-600" />
                        <h1 className="text-2xl font-bold text-slate-800">Synthèse des Ventes</h1>
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
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Articles</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.articles}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Quantité vendue</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.qte.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total ventes</p>
                    <p className="text-2xl font-black text-emerald-700">{kpis.total.toLocaleString()} DH</p>
                </div>
            </div>

            <div ref={printRef}>
                {categorySections.map((section) => (
                    <div key={section.category} className="mb-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                                <h2 className="text-sm font-bold text-slate-700 uppercase">
                                    ETAT GLOBALE DES VENTES — Catégorie : {section.category}
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="px-4 py-2 text-left font-bold text-slate-600">Article</th>
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">Code</th>
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">Quantité</th>
                                            <th className="px-4 py-2 text-right font-bold text-slate-600">Prix unitaire</th>
                                            <th className="px-4 py-2 text-right font-bold text-slate-600">Total (DH)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.books.map((book) => (
                                            <tr key={book.id} className="border-t border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-2 text-slate-700">{book.article}</td>
                                                <td className="px-4 py-2 text-center text-slate-500">{book.code}</td>
                                                <td className="px-4 py-2 text-center font-bold">{book.qte}</td>
                                                <td className="px-4 py-2 text-right">{book.prixUnit.toLocaleString()} DH</td>
                                                <td className="px-4 py-2 text-right font-bold text-emerald-700">{book.total.toLocaleString()} DH</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold">
                                            <td className="px-4 py-2 text-slate-700 uppercase" colSpan={2}>Total {section.category}</td>
                                            <td className="px-4 py-2 text-center">{section.totalQte}</td>
                                            <td className="px-4 py-2 text-right"></td>
                                            <td className="px-4 py-2 text-right text-emerald-700">{section.totalMontant.toLocaleString()} DH</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}

                {categorySections.length === 0 && !isLoading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                            <h2 className="text-sm font-bold text-slate-700 uppercase">Détail par article</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="px-4 py-2 text-left font-bold text-slate-600">Article</th>
                                        <th className="px-4 py-2 text-center font-bold text-slate-600">Quantité vendue</th>
                                        <th className="px-4 py-2 text-right font-bold text-slate-600">Prix unitaire (DH)</th>
                                        <th className="px-4 py-2 text-right font-bold text-slate-600">Total ventes (DH)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {globalRows.map((row) => (
                                        <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                                            <td className="px-4 py-2 text-slate-700">{row.article}</td>
                                            <td className="px-4 py-2 text-center font-bold">{row.qte}</td>
                                            <td className="px-4 py-2 text-right">{row.prixUnit.toLocaleString()} DH</td>
                                            <td className="px-4 py-2 text-right font-bold text-emerald-700">{row.total.toLocaleString()} DH</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <PdfDialogViewer
                open={pdfOpen}
                onOpenChange={setPdfOpen}
                title="Synthèse des Ventes"
                document={
                    <VentesPdf
                        categorySections={categorySections}
                        kpis={kpis}
                        seasonLabel={seasonLabel}
                    />
                }
            />
        </div>
    );
};

export default VentesPage;
