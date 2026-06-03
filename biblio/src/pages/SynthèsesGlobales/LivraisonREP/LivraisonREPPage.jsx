import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { Users, Printer, Download } from "lucide-react";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import livreService from "../../../api/services/livreService";
import seasonsService from "../../../api/services/seasonsService";
import { exportToCSV } from "../../../utils/helpers";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import LivraisonPdf from "../../../components/pdfs/syntheses/LivraisonPdf";
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

const LivraisonREPPage = () => {
    const [categorySections, setCategorySections] = useState([]);
    const [summaryRows, setSummaryRows] = useState([]);
    const [kpis, setKpis] = useState({ reps: 0, quantite: 0, montant: 0 });
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
        try {
            const params = {};
            if (selectedSeasonId && selectedSeasonId !== "all") {
                params.season_id = selectedSeasonId;
            }
            const [items, livres] = await Promise.all([
                fetchAllPaginated(bLivraisonItemService.getAll, params),
                fetchAllPaginated(livreService.getAll),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));
            const repGrouped = new Map();
            const catBookMap = new Map();

            for (const it of items) {
                const livraison = it.livraison;
                const repId = livraison?.rep_id || livraison?.representant?.id;
                if (!repId) continue;

                const repNom = livraison?.representant?.nom || repId;
                const qty = toNumber(it.quantite);
                const livre = livreById.get(it.livre_id || it.livre?.id);
                const unit = toNumber(livre?.prix_vente ?? livre?.prix_public ?? 0);
                const total = qty * unit;

                const prev = repGrouped.get(repId) || {
                    id: repId,
                    rep: repNom,
                    nbLivres: 0,
                    montant: 0,
                    lastDate: "",
                    blNumbers: new Set(),
                };
                prev.nbLivres += qty;
                prev.montant += total;
                if (livraison?.date_emission && (!prev.lastDate || String(livraison.date_emission) > String(prev.lastDate))) {
                    prev.lastDate = livraison.date_emission;
                }
                if (livraison?.bl_number) prev.blNumbers.add(String(livraison.bl_number));
                repGrouped.set(repId, prev);

                const cat = livre?.categorie?.libelle || "Autres";
                const bookKey = `${cat}::${it.livre_id || it.livre?.id}`;
                if (!catBookMap.has(bookKey)) {
                    catBookMap.set(bookKey, { cat, livreId: it.livre_id || it.livre?.id, repQty: new Map() });
                }
                const cb = catBookMap.get(bookKey);
                cb.repQty.set(repId, (cb.repQty.get(repId) || 0) + qty);
            }

            const computed = Array.from(repGrouped.values()).map((g) => ({
                id: g.id,
                rep: g.rep,
                nbBL: g.blNumbers.size,
                nbLivres: g.nbLivres,
                montant: g.montant,
                date: g.lastDate,
            })).sort((a, b) => b.montant - a.montant);

            setSummaryRows(computed);
            setKpis({
                reps: computed.length,
                quantite: computed.reduce((sum, r) => sum + toNumber(r.nbLivres), 0),
                montant: computed.reduce((sum, r) => sum + toNumber(r.montant), 0),
            });

            const catMap = new Map();
            for (const [, cb] of catBookMap) {
                if (!catMap.has(cb.cat)) catMap.set(cb.cat, []);
                const livre = livreById.get(cb.livreId);
                catMap.get(cb.cat).push({
                    id: cb.livreId,
                    code: livre?.code || "",
                    titre: livre?.titre || "",
                    repQty: Object.fromEntries(cb.repQty),
                    total: Array.from(cb.repQty.values()).reduce((s, v) => s + v, 0),
                });
            }

            const sections = CATEGORY_ORDER
                .filter(cat => catMap.has(cat))
                .map(cat => ({
                    category: cat,
                    books: catMap.get(cat),
                }));

            const extraCats = Array.from(catMap.keys())
                .filter(cat => !CATEGORY_ORDER.includes(cat))
                .map(cat => ({ category: cat, books: catMap.get(cat) }));

            setCategorySections([...sections, ...extraCats]);
        } catch (error) {
            logger("Error computing livraisons REP:", error);
            toast.error("Erreur lors du chargement des livraisons REP");
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
                    Ouvrage: book.titre,
                    Code: book.code,
                    Quantité: book.quantite,
                    "Montant (DH)": book.montant,
                });
            });
        });
        const cols = [
            { header: "Catégorie", accessor: "Catégorie" },
            { header: "Ouvrage", accessor: "Ouvrage" },
            { header: "Code", accessor: "Code" },
            { header: "Quantité", accessor: "Quantité" },
            { header: "Montant (DH)", accessor: "Montant (DH)" },
        ];
        exportToCSV(exportData, cols, `LivraisonREP_${seasonLabel.replace(/\s+|\//g, '_')}.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Users className="text-blue-600" />
                        <h1 className="text-2xl font-bold text-slate-800">Livraisons aux Représentants</h1>
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
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Représentants</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.reps}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Quantité livrée</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.quantite.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Montant estimé</p>
                    <p className="text-2xl font-black text-blue-700">{kpis.montant.toLocaleString()} DH</p>
                </div>
            </div>

            <div ref={printRef}>
                {categorySections.map((section) => (
                    <div key={section.category} className="mb-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                                <h2 className="text-sm font-bold text-slate-700 uppercase">
                                    MSM-MEDIAS → REPRÉSENTANTS — Catégorie : {section.category}
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="px-4 py-2 text-left font-bold text-slate-600">Ouvrage</th>
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">Code</th>
                                            {summaryRows.map(r => (
                                                <th key={r.id} className="px-4 py-2 text-center font-bold text-slate-600">{r.rep}</th>
                                            ))}
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.books.map((book) => (
                                            <tr key={book.id} className="border-t border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-2 text-slate-700">{book.titre}</td>
                                                <td className="px-4 py-2 text-center text-slate-500">{book.code}</td>
                                                {summaryRows.map(r => (
                                                    <td key={r.id} className="px-4 py-2 text-center">{book.repQty[r.id] || 0}</td>
                                                ))}
                                                <td className="px-4 py-2 text-center font-bold text-blue-700">{book.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <h2 className="text-sm font-bold text-slate-700 uppercase">Détail par représentant</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="px-4 py-2 text-left font-bold text-slate-600">Représentant</th>
                                    <th className="px-4 py-2 text-center font-bold text-slate-600">Nb BL</th>
                                    <th className="px-4 py-2 text-center font-bold text-slate-600">Quantité</th>
                                    <th className="px-4 py-2 text-right font-bold text-slate-600">Montant estimé (DH)</th>
                                    <th className="px-4 py-2 text-center font-bold text-slate-600">Dernière émission</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryRows.map((row) => (
                                    <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2 text-slate-700">{row.rep}</td>
                                        <td className="px-4 py-2 text-center">{row.nbBL}</td>
                                        <td className="px-4 py-2 text-center font-bold">{row.nbLivres}</td>
                                        <td className="px-4 py-2 text-right text-blue-700">{row.montant.toLocaleString()} DH</td>
                                        <td className="px-4 py-2 text-center text-slate-500">{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <PdfDialogViewer
                open={pdfOpen}
                onOpenChange={setPdfOpen}
                title="Livraisons aux Représentants"
                document={
                    <LivraisonPdf
                        title="Livraisons MSM-MEDIAS → Représentants"
                        categorySections={categorySections}
                        summaryRows={summaryRows}
                        kpis={kpis}
                        labelField="rep"
                        seasonLabel={seasonLabel}
                    />
                }
            />
        </div>
    );
};

export default LivraisonREPPage;
