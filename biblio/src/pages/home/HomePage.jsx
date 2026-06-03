import { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/button";
import FormInputRow from "../../components/ui/FormInputRaw";
import StockReportPDF from "../../components/pdfs/StockReportPDF";
import { BlobProvider } from "@react-pdf/renderer"; // <-- Using BlobProvider to prevent useRef crash!
import { Loader2, Printer, BookOpen, LayoutDashboard, Layers, FileText, Download, AlertTriangle } from "lucide-react";
import PdfDialogViewer from "../../components/template/pdfs/PdfDialogViewer";
import { useStockReport } from "../../hooks/useStockReport";
import seasonsService from "../../api/services/seasonsService";
import { exportToCSV } from "../../utils/helpers";
import useAppStore from "../../store/useAppStore";
import { MyTable } from "../../components/ui/myTable";
import SectionContainer from "../../components/ui/SectionContainer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

function HomePage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const [selectedDestination, setSelectedDestination] = useState("");
    const [showViewer, setShowViewer] = useState(false);
    const [pdfDisplayMode, setPdfDisplayMode] = useState("dialog");
    const [seasons, setSeasons] = useState([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeason?.id || "");

    useEffect(() => {
        seasonsService.getAll().then(setSeasons).catch(() => {});
    }, []);

    useEffect(() => {
        if (seasons.length > 0 && !selectedSeasonId) {
            const active = seasons.find(s => s.is_active) || activeSeason;
            setSelectedSeasonId(active?.id || seasons[0]?.id || "");
        }
    }, [seasons, selectedSeasonId, activeSeason]);

    const {
        destinations,
        groupedReportData,
        totalGlobalStock,
        isLoading
    } = useStockReport(selectedDestination, selectedSeasonId);

    // Find the name of the selected destination to pass to the PDF
    const currentDestinationObj = destinations.find(d => d.id === selectedDestination);
    const destinationName = currentDestinationObj ? currentDestinationObj.destination : "MSM-Medias (Global)";

    // Find active/selected season name to pass to PDF
    const activeSeasonObj = seasons.find(s => s.id === selectedSeasonId);
    const seasonLabel = activeSeasonObj 
        ? `${activeSeasonObj.name.slice(0, 2)}/${activeSeasonObj.name.slice(2)}` 
        : "Toutes les saisons";

    const isGlobal = !selectedDestination || selectedDestination === "";

    const myDocument = (
        <StockReportPDF 
            destinationName={destinationName} 
            seasonLabel={seasonLabel} 
            groupedData={groupedReportData} 
            isGlobal={isGlobal}
        />
    );

    const handleExportCSV = () => {
        const exportData = [];
        groupedReportData.forEach(group => {
            group.books.forEach(book => {
                if (isGlobal) {
                    exportData.push({
                        Catégorie: group.categoryName,
                        Livre: book.livre,
                        "Stock de départ": book.stockDepart || 0,
                        "Stock actuel": book.stock,
                        Livraison: book.livraison,
                        Spécimen: book.specimen,
                        "Retour (Rejet)": book.rejet
                    });
                } else {
                    exportData.push({
                        Catégorie: group.categoryName,
                        Livre: book.livre,
                        "Achat (Réception)": book.achat,
                        "Vente (Distribution)": book.vente,
                        Stock: book.stock
                    });
                }
            });
        });

        const exportCols = isGlobal ? [
            { header: "Catégorie", accessor: "Catégorie" },
            { header: "Livre", accessor: "Livre" },
            { header: "Stock de départ", accessor: "Stock de départ" },
            { header: "Stock actuel", accessor: "Stock actuel" },
            { header: "Livraison", accessor: "Livraison" },
            { header: "Spécimen", accessor: "Spécimen" },
            { header: "Retour (Rejet)", accessor: "Retour (Rejet)" }
        ] : [
            { header: "Catégorie", accessor: "Catégorie" },
            { header: "Livre", accessor: "Livre" },
            { header: "Achat (Réception)", accessor: "Achat (Réception)" },
            { header: "Vente (Distribution)", accessor: "Vente (Distribution)" },
            { header: "Stock", accessor: "Stock" }
        ];

        exportToCSV(exportData, exportCols, `Rapport_Stock_${destinationName.replace(/\s+/g, '_')}_${seasonLabel.replace(/\s+|\//g, '_')}.csv`);
    };

    const columns = useMemo(() => {
        if (isGlobal) {
            return [
                { header: "Livre", accessor: "livre" },
                { header: "Stock de départ", accessor: "stockDepart" },
                { header: "Stock actuel", accessor: "stock" },
                { header: "Livraison", accessor: "livraison" },
                { header: "Spécimen", accessor: "specimen" },
                { header: "Retour (Rejet)", accessor: "rejet" }
            ];
        } else {
            return [
                { header: "Livre", accessor: "livre" },
                { header: "Achat (Réception)", accessor: "achat" },
                { header: "Vente (Distribution)", accessor: "vente" },
                { header: "Stock", accessor: "stock" }
            ];
        }
    }, [isGlobal]);

    return (
        <div className="HomePage space-y-6 max-w-7xl mx-auto p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">TABLEAU DE BORD</h1>
                        <p className="text-slate-500 text-xs mt-0.5">Suivi des stocks, livraisons, ventes et impression des états.</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button 
                        disabled={isLoading || groupedReportData.length === 0} 
                        onClick={handleExportCSV}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-lg shadow-emerald-100 transition-all"
                    >
                        <Download size={18} />
                        Exporter CSV
                    </Button>
                    <PdfDialogViewer
                        title={`Imprimer le Rapport de Stock : ${destinationName}`}
                        document={myDocument}
                        trigger={
                            <Button disabled={isLoading} className="bg-slate-900 hover:bg-black text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-lg shadow-slate-100 transition-all">
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />} 
                                Imprimer Rapport
                            </Button>
                        }
                    />
                </div>
            </div>

            {/* Filters Selection Row */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInputRow
                        label="Destination de Livraison"
                        name="destination"
                        placeholder="MSM-Medias (Global)"
                        inputType="select"
                        items={destinations.map((item) => ({
                            label: item.destination,
                            value: item.id
                        }))}
                        allowEmpty={true}
                        emptyLabel="MSM-Medias (Global)"
                        value={selectedDestination}
                        onChange={(value) => {
                            setSelectedDestination(value);
                            setShowViewer(false);
                        }}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Saison de Travail</label>
                        <select
                            value={selectedSeasonId}
                            onChange={(e) => {
                                setSelectedSeasonId(e.target.value);
                                setShowViewer(false);
                            }}
                            className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 w-full"
                        >
                            <option value="all">Toutes les saisons</option>
                            {seasons.map(s => (
                                <option key={s.id} value={s.id}>{s.name.slice(0, 2)} / {s.name.slice(2)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stock Statistics KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Layers size={80} />
                    </div>
                    <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mb-2">Total Stock Global</p>
                    <p className="text-3xl font-black">{isLoading ? "Calcul..." : `${totalGlobalStock.toLocaleString()} unités`}</p>
                </div>
                <div className="p-6 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
                        <FileText size={80} />
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Destination Courante</p>
                    <p className="text-xl font-bold truncate">{destinationName}</p>
                </div>
                <div className="p-6 bg-emerald-900 text-white rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <BookOpen size={80} />
                    </div>
                    <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">Saison Active</p>
                    <p className="text-xl font-bold">{seasonLabel}</p>
                </div>
            </div>

            {/* Charts Section */}
            {!isLoading && groupedReportData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart - Stock by Category */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Stock par Catégorie</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={groupedReportData.map(cat => ({
                                name: cat.categoryName,
                                stock: cat.books.reduce((sum, b) => sum + b.stock, 0),
                                livraison: cat.books.reduce((sum, b) => sum + b.livraison, 0),
                                vente: cat.books.reduce((sum, b) => sum + b.vente, 0),
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="stock" fill="#1e293b" name="Stock" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="livraison" fill="#3b82f6" name="Livraison" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="vente" fill="#10b981" name="Vente" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart - Stock Distribution */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Répartition du Stock</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={groupedReportData.map(cat => ({
                                        name: cat.categoryName,
                                        value: cat.books.reduce((sum, b) => sum + Math.max(b.stock, 0), 0),
                                    })).filter(d => d.value > 0)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {groupedReportData.map((_, index) => (
                                        <Cell key={index} fill={["#1e293b", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 6]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Flat PDF Viewer Options */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm text-slate-600 mb-4">
                    <label className="font-semibold uppercase tracking-wide">Aperçu PDF Direct</label>
                    <select
                        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-1 focus:ring-slate-900"
                        value={pdfDisplayMode}
                        onChange={(e) => {
                            setPdfDisplayMode(e.target.value);
                            setShowViewer(false);
                        }}
                    >
                        <option value="dialog">Fenêtre Flottante (Dialog)</option>
                        <option value="flat">Intégré (Flat)</option>
                    </select>
                </div>

                {pdfDisplayMode === "flat" && (
                    showViewer ? (
                        <div className="w-full flex flex-col mt-2">
                            <div className="w-full h-[600px] border rounded shadow-md overflow-hidden flex flex-col bg-gray-50">
                                <BlobProvider document={myDocument}>
                                    {({ url, loading, error }) => {
                                        if (loading) return <div className="p-10 text-center animate-pulse">Génération du PDF en cours...</div>;
                                        if (error) return <div className="p-10 text-red-500">Erreur lors de la création du PDF</div>;

                                        return (
                                            <iframe
                                                src={url}
                                                title="Aperçu Stock"
                                                className="w-full h-full border-none"
                                            />
                                        );
                                    }}
                                </BlobProvider>
                            </div>
                            <Button
                                variant="destructive"
                                className="mt-4 self-start rounded-xl"
                                onClick={() => setShowViewer(false)}
                            >
                                Fermer l'aperçu PDF
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="bg-white border-slate-200 text-slate-700 font-bold"
                            disabled={isLoading}
                            onClick={() => setShowViewer(true)}
                        >
                            <Printer size={16} className="mr-2" />
                            Générer l'aperçu PDF intégré
                        </Button>
                    )
                )}
            </div>

            {/* Low Stock Alerts */}
            {!isLoading && groupedReportData.length > 0 && (
                (() => {
                    const lowStockBooks = groupedReportData.flatMap(cat =>
                        cat.books
                            .filter(b => b.stock > 0 && b.stock <= 10)
                            .map(b => ({ ...b, category: cat.categoryName }))
                    );
                    if (lowStockBooks.length === 0) return null;
                    return (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle size={20} className="text-amber-600" />
                                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide">Alertes Stock Minimum</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {lowStockBooks.slice(0, 9).map((book, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-200">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{book.livre}</p>
                                            <p className="text-xs text-slate-500">{book.category}</p>
                                        </div>
                                        <span className={`text-sm font-bold px-2 py-1 rounded ${book.stock <= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {book.stock} restant{book.stock > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {lowStockBooks.length > 9 && (
                                <p className="text-xs text-amber-700 mt-3">+ {lowStockBooks.length - 9} autre{lowStockBooks.length - 9 > 1 ? 's' : ''} article{lowStockBooks.length - 9 > 1 ? 's' : ''} en stock bas</p>
                            )}
                        </div>
                    );
                })()
            )}

            {/* Dynamic Category Sections & Tables */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                        <p className="text-slate-500 font-medium italic">Calcul des stocks par catégorie...</p>
                    </div>
                ) : (
                    groupedReportData.map((categoryGroup, index) => (
                        <SectionContainer
                            key={categoryGroup.categoryName || index}
                            title={`Stock - Livraison --|-- Categorie : ${categoryGroup.categoryName}`}
                            icon={BookOpen}
                            headerColor="bg-blue-600"
                            collapsible={true}
                            defaultOpen={true}
                        >
                            <MyTable
                                data={categoryGroup.books}
                                columns={columns}
                                pageSize={10}
                                variant="slate"
                                isLoading={isLoading}
                                enableSearch={true}
                                enableSorting={true}
                            />
                        </SectionContainer>
                    ))
                )}

                {!isLoading && groupedReportData.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500 italic">
                        Aucune donnée de stock disponible pour cette saison/destination.
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
