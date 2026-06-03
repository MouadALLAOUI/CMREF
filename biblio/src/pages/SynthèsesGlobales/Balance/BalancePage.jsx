import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { Scale, Printer, Download } from "lucide-react";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import bVentesClientService from "../../../api/services/bVentesClientService";
import repRemboursementService from "../../../api/services/repRemboursementService";
import clientRemboursementService from "../../../api/services/clientRemboursementService";
import depotService from "../../../api/services/depotService";
import livreService from "../../../api/services/livreService";
import seasonsService from "../../../api/services/seasonsService";
import { calculateRecouvrement, exportToCSV } from "../../../utils/helpers";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import BalancePdf from "../../../components/pdfs/syntheses/BalancePdf";
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

const BalancePage = () => {
    const [categorySections, setCategorySections] = useState([]);
    const [summaryRows, setSummaryRows] = useState([]);
    const [kpis, setKpis] = useState({ ventes: 0, achats: 0, net: 0, recouvrement: 0 });
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

            const [livraisonsImp, ventes, rembRep, rembClient, depots, livres] = await Promise.all([
                fetchAllPaginated(bLivraisonImpService.getAll, params),
                fetchAllPaginated(bVentesClientService.getAll, params),
                fetchAllPaginated(repRemboursementService.getAll, params),
                fetchAllPaginated(clientRemboursementService.getAll, params),
                fetchAllPaginated(depotService.getAll, params),
                fetchAllPaginated(livreService.getAll),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));

            const achats = livraisonsImp.reduce((sum, it) => {
                const livre = livreById.get(it.livre_id || it.livre?.id);
                const unit = toNumber(livre?.prix_achat ?? 0);
                return sum + unit * toNumber(it.quantite);
            }, 0);

            const ventesTotal = ventes.reduce((sum, v) => {
                const livre = livreById.get(v.livre_id || v.livre?.id);
                const unit = toNumber(livre?.prix_vente ?? livre?.prix_public ?? 0);
                const qty = toNumber(v.quantite);
                const remisePct = toNumber(v.remise);
                return sum + unit * qty * (1 - remisePct / 100);
            }, 0);

            const rembRepTotal = rembRep.reduce((sum, r) => sum + toNumber(r.montant), 0);
            const rembClientTotal = rembClient.reduce((sum, r) => sum + toNumber(r.montant), 0);
            const net = ventesTotal - achats - rembRepTotal;

            const recouvrement = calculateRecouvrement(rembClientTotal, ventesTotal);

            setSummaryRows([
                { id: "achats", compte: "Achats fournisseurs (BL imprimeurs)", debit: achats, credit: 0, solde: achats },
                { id: "ventes", compte: "Ventes clients (BVentes)", debit: 0, credit: ventesTotal, solde: -ventesTotal },
                { id: "remb_rep", compte: "Remboursements représentants", debit: rembRepTotal, credit: 0, solde: rembRepTotal },
                { id: "remb_client", compte: "Remboursements clients (encaissés)", debit: 0, credit: rembClientTotal, solde: -rembClientTotal },
                { id: "net", compte: "Résultat net (approx.)", debit: net < 0 ? -net : 0, credit: net > 0 ? net : 0, solde: -net },
            ]);
            setKpis({ ventes: ventesTotal, achats, net, recouvrement });

            const catMap = new Map();
            for (const l of livres) {
                const cat = l.categorie?.libelle || "Autres";
                if (!catMap.has(cat)) catMap.set(cat, []);
                catMap.get(cat).push(l);
            }

            const sections = CATEGORY_ORDER
                .filter(cat => catMap.has(cat))
                .map(cat => {
                    const books = catMap.get(cat);
                    const livraisonByBook = new Map();
                    for (const it of livraisonsImp) {
                        const livreId = it.livre_id || it.livre?.id;
                        if (!livreId) continue;
                        const livre = livreById.get(livreId);
                        if (livre?.categorie?.libelle !== cat) continue;
                        const prev = livraisonByBook.get(livreId) || 0;
                        livraisonByBook.set(livreId, prev + toNumber(it.quantite));
                    }
                    const venteByBook = new Map();
                    for (const v of ventes) {
                        const livreId = v.livre_id || v.livre?.id;
                        if (!livreId) continue;
                        const livre = livreById.get(livreId);
                        if (livre?.categorie?.libelle !== cat) continue;
                        const prev = venteByBook.get(livreId) || 0;
                        venteByBook.set(livreId, prev + toNumber(v.quantite));
                    }
                    const depotByBook = new Map();
                    for (const d of depots) {
                        const livreId = d.livre_id || d.livre?.id;
                        if (!livreId) continue;
                        const livre = livreById.get(livreId);
                        if (livre?.categorie?.libelle !== cat) continue;
                        const prev = depotByBook.get(livreId) || 0;
                        depotByBook.set(livreId, prev + toNumber(d.quantite_balance));
                    }

                    return {
                        category: cat,
                        books: books.map(b => ({
                            id: b.id,
                            code: b.code,
                            titre: b.titre,
                            stock: toNumber(b.quantite_stock) || 0,
                            livraison: livraisonByBook.get(b.id) || 0,
                            vente: venteByBook.get(b.id) || 0,
                            depot: depotByBook.get(b.id) || 0,
                        })),
                    };
                });

            const extraCats = Array.from(catMap.keys())
                .filter(cat => !CATEGORY_ORDER.includes(cat))
                .map(cat => ({
                    category: cat,
                    books: catMap.get(cat).map(b => ({
                        id: b.id,
                        code: b.code,
                        titre: b.titre,
                        stock: 0,
                        livraison: 0,
                        vente: 0,
                        depot: 0,
                    })),
                }));

            setCategorySections([...sections, ...extraCats]);
        } catch (error) {
            logger("Error computing balance:", error);
            toast.error("Erreur lors du chargement de la balance");
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
                    "En stock": book.stock,
                    "Livré (Fourn.)": book.livraison,
                    Vendu: book.vente,
                    "En dépôt": book.depot,
                });
            });
        });
        const cols = [
            { header: "Catégorie", accessor: "Catégorie" },
            { header: "Ouvrage", accessor: "Ouvrage" },
            { header: "Code", accessor: "Code" },
            { header: "En stock", accessor: "En stock" },
            { header: "Livré (Fourn.)", accessor: "Livré (Fourn.)" },
            { header: "Vendu", accessor: "Vendu" },
            { header: "En dépôt", accessor: "En dépôt" },
        ];
        exportToCSV(exportData, cols, `Balance_${seasonLabel.replace(/\s+|\//g, '_')}.csv`);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Scale size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Balance Générale</h1>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total ventes</p>
                    <p className="text-2xl font-black text-emerald-600">{kpis.ventes.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total achats</p>
                    <p className="text-2xl font-black text-blue-600">{kpis.achats.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Résultat net</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.net.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Recouvrement</p>
                    <p className="text-2xl font-black text-amber-700">{kpis.recouvrement.toFixed(1)}%</p>
                </div>
            </div>

            <div ref={printRef}>
                {categorySections.map((section) => (
                    <div key={section.category} className="mb-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                                <h2 className="text-sm font-bold text-slate-700 uppercase">
                                    Balance — Catégorie : {section.category}
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="px-4 py-2 text-left font-bold text-slate-600">Ouvrage</th>
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">Code</th>
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">En stock</th>
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">Livré (Fourn.)</th>
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">Vendu</th>
                                            <th className="px-4 py-2 text-center font-bold text-slate-600">En dépôt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.books.map((book) => (
                                            <tr key={book.id} className="border-t border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-2 text-slate-700">{book.titre}</td>
                                                <td className="px-4 py-2 text-center text-slate-500">{book.code}</td>
                                                <td className="px-4 py-2 text-center">{book.stock}</td>
                                                <td className="px-4 py-2 text-center text-blue-700">{book.livraison}</td>
                                                <td className="px-4 py-2 text-center text-emerald-700">{book.vente}</td>
                                                <td className="px-4 py-2 text-center text-amber-700">{book.depot}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold">
                                            <td className="px-4 py-2 text-slate-700 uppercase" colSpan={2}>Total {section.category}</td>
                                            <td className="px-4 py-2 text-center">{section.books.reduce((s, b) => s + b.stock, 0)}</td>
                                            <td className="px-4 py-2 text-center text-blue-700">{section.books.reduce((s, b) => s + b.livraison, 0)}</td>
                                            <td className="px-4 py-2 text-center text-emerald-700">{section.books.reduce((s, b) => s + b.vente, 0)}</td>
                                            <td className="px-4 py-2 text-center text-amber-700">{section.books.reduce((s, b) => s + b.depot, 0)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <h2 className="text-sm font-bold text-slate-700 uppercase">Synthèse Financière</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="px-4 py-2 text-left font-bold text-slate-600">Indicateur</th>
                                    <th className="px-4 py-2 text-right font-bold text-slate-600">Débit (DH)</th>
                                    <th className="px-4 py-2 text-right font-bold text-slate-600">Crédit (DH)</th>
                                    <th className="px-4 py-2 text-right font-bold text-slate-600">Net (DH)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryRows.map((row) => (
                                    <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2 text-slate-700">{row.compte}</td>
                                        <td className="px-4 py-2 text-right">{row.debit > 0 ? `${row.debit.toLocaleString()} DH` : "—"}</td>
                                        <td className="px-4 py-2 text-right">{row.credit > 0 ? `${row.credit.toLocaleString()} DH` : "—"}</td>
                                        <td className="px-4 py-2 text-right font-bold">{row.solde.toLocaleString()} DH</td>
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
                title="Balance Générale"
                document={
                    <BalancePdf
                        categorySections={categorySections}
                        summaryRows={summaryRows}
                        kpis={kpis}
                        seasonLabel={seasonLabel}
                    />
                }
            />
        </div>
    );
};

export default BalancePage;
