import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import livreService from "../../../api/services/livreService";
import { currencyFormat } from "../../../lib/utilities";
import SyntheseBlPdf from "../../../components/pdfs/fornisseurs/SyntheseBlPdf";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import SingleBlPdf from "../../../components/pdfs/fornisseurs/SingleBlPdf";

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const SyntheseBLPage = () => {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedAnnee, setSelectedAnnee] = useState("2627");

    const [selectedForPrint, setSelectedForPrint] = useState(null);
    const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [blResponse, livresResponse] = await Promise.all([
                bLivraisonImpService.getAll(),
                livreService.getAll(),
            ]);
            const allBLs = blResponse;
            const allLivres = livresResponse;
            const livreById = new Map(allLivres.map((l) => [l.id, l]));
            // logger({ allBLs, allLivres });

            /** allBLs :
             *
            {
                "id": "019d78ac-0f70-7100-a41b-0719bee04e95",
                "imprimeur_id": "019d78ab-cd7d-70d2-9eae-505843545699",
                "date_reception": "2019-04-18",
                "b_livraison_number": "BLI-4659",
                "remarks": "Perspiciatis molestiae velit fuga molestiae.",
                "annee": "2828",
                "created_at": "2026-04-10T18:33:55.000000Z",
                "updated_at": "2026-04-10T18:33:55.000000Z",
                "imprimeur": {
                    "id": "019d78ab-cd7d-70d2-9eae-505843545699",
                    "raison_sociale": "Remy SARL",
                    "adresse": "rue de Mallet\n71446 Lefevre-les-Bains",
                    "directeur_nom": "Alphonse Dos Santos",
                    "directeur_tel": "+33 1 29 99 64 50",
                    "directeur_email": "valentine.antoine@bailly.com",
                    "adjoint_nom": "Adrien de Ruiz",
                    "adjoint_tel": "+33 2 77 38 07 97",
                    "adjoint_email": "imbert.bernadette@example.com",
                    "created_at": "2026-04-10T18:33:38.000000Z",
                    "updated_at": "2026-04-10T18:33:38.000000Z"
                },
                "items": [
                    {
                        "id": "019d78ac-125a-70b3-9b3c-d6b80f33d7ff",
                        "deliverable_type": "App\\Models\\BLivraisonImp",
                        "deliverable_id": "019d78ac-0f70-7100-a41b-0719bee04e95",
                        "livre_id": "019d78ab-c8e9-7178-818c-17c8dbb76f1a",
                        "quantite": 99,
                        "created_at": "2026-04-10T18:33:56.000000Z",
                        "updated_at": "2026-04-10T18:33:56.000000Z",
                        "livre": {
                            "id": "019d78ab-c8e9-7178-818c-17c8dbb76f1a",
                            "titre": "Informatique et Robotique au primaire N 3",
                            "code": "R3",
                            "categorie_id": "019d78ab-c62a-73f1-b2a9-68ca5b567cfa",
                            "prix_achat": "10.00",
                            "prix_vente": "15.00",
                            "prix_public": "20.00",
                            "nb_pages": 48,
                            "color_code": "#00DDFF",
                            "description": null,
                            "annee_publication": null,
                            "created_at": "2026-04-10T18:33:37.000000Z",
                            "updated_at": "2026-04-10T18:33:37.000000Z"
                        }
                    }
                ]
            }
             */

            /** allLivres:
             *{
            "id": "019d78ab-c853-70fb-a039-e6ce741cec40",
            "titre": "Informatique et Robotique au primaire N 1",
            "code": "R1",
            "categorie_id": "019d78ab-c62a-73f1-b2a9-68ca5b567cfa",
            "prix_achat": "10.00",
            "prix_vente": "15.00",
            "prix_public": "20.00",
            "nb_pages": 40,
            "color_code": "#00DDFF",
            "description": null,
            "annee_publication": null,
            "created_at": "2026-04-10T18:33:37.000000Z",
            "updated_at": "2026-04-10T18:33:37.000000Z",
            "category": {
                "id": "019d78ab-c62a-73f1-b2a9-68ca5b567cfa",
                "libelle": "Primaire",
                "description": "Enseignement primaire",
                "created_at": "2026-04-10T18:33:36.000000Z",
                "updated_at": "2026-04-10T18:33:36.000000Z"
            }
        },
            */


            const processedRows = allBLs.map((bl) => {
                // Calculate totals for this specific BL
                const stats = (bl.items || []).reduce((acc, item) => {
                    const livre = livreById.get(item.livre_id);
                    const unitPrice = toNumber(livre?.prix_achat ?? 0);
                    const qty = toNumber(item.quantite);

                    acc.qty += qty;
                    acc.total += unitPrice * qty;
                    return acc;
                }, { qty: 0, total: 0 });

                return {
                    id: bl.id,
                    fournisseur: bl.imprimeur?.raison_sociale || bl.imprimeur?.nom || "—",
                    bl_number: bl.b_livraison_number || "—",
                    date_reception: bl.date_reception || "",
                    lignes: (bl.items || []).length,
                    annee: bl.annee, // 👈 CRITICAL: Keep the year here
                    quantite: stats.qty,
                    total_ht: stats.total,
                    rawItems: bl.items
                };
            });

            setRows(processedRows.sort((a, b) =>
                String(b.date_reception).localeCompare(String(a.date_reception))
            ));
        } catch (error) {
            logger("Error fetching fournisseurs synthese BL:", error);
            toast.error("Erreur lors du chargement de la synthèse");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = (type, row) => {
        if (type === "imp") {
            setSelectedForPrint(row);
            setIsPrintDialogOpen(true);
        }
    };
    // logger({ selectedForPrint, isPrintDialogOpen })
    const filteredRows = useMemo(() => {
        if (!selectedAnnee || selectedAnnee === "all") return rows;
        return rows.filter(row => row.annee === selectedAnnee);
    }, [rows, selectedAnnee]);
    const totalMontant = useMemo(() =>
        filteredRows.reduce((sum, item) => sum + toNumber(item.total_ht), 0),
        [filteredRows]);

    const totalBL = filteredRows.length;

    const columns = useMemo(
        () => [
            { header: "Fournisseur", accessor: "fournisseur" },
            { header: "BL N°", accessor: "bl_number" },
            { header: "Date réception", accessor: "date_reception", type: "date" },
            { header: "Lignes", accessor: "lignes" },
            { header: "Quantité", accessor: "quantite" },
            { header: "Total (HT) (DH)", accessor: "total_ht", type: "curr" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Année Scolaire:</span>
                <select
                    value={selectedAnnee}
                    onChange={(e) => setSelectedAnnee(e.target.value)}
                    className="bg-slate-100 border-none text-sm font-bold rounded-lg px-3 py-1 focus:ring-2 focus:ring-slate-900"
                >
                    <option value="all">Toutes les années</option>
                    <option value="2526">2025 / 2026</option>
                    <option value="2627">2026 / 2027</option>
                    <option value="2728">2027 / 2028</option>
                </select>
            </div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fournisseurs - Synthèse BL</h1>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 rounded-xl h-11 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                        <Download size={18} /> Exporter
                    </Button>
                    <PdfDialogViewer
                        title="Aperçu Synthèse BL"
                        document={
                            <SyntheseBlPdf
                                data={filteredRows}
                                annee={selectedAnnee}
                                totalMontant={totalMontant}
                            />
                        }
                        trigger={
                            <Button className="bg-slate-900 hover:bg-black text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-lg">
                                <Printer size={18} /> Imprimer Synthèse
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Download size={80} />
                    </div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Total Achats (HT)</p>
                    <p className="text-4xl font-black tracking-tight">{currencyFormat(totalMontant)}</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 text-slate-900 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
                        <FileText size={80} />
                    </div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Bons de Livraison</p>
                    <p className="text-4xl font-black tracking-tight">{totalBL}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Hidden PDF Viewer triggered by handleAction */}
                {selectedForPrint && (
                    <PdfDialogViewer
                        key={selectedForPrint.id}
                        open={isPrintDialogOpen}
                        onOpenChange={setIsPrintDialogOpen}
                        title={`Impression BL ${selectedForPrint.bl_number}`}
                        document={<SingleBlPdf blData={selectedForPrint} />}
                    />
                )}
                <MyTable
                    data={filteredRows}
                    columns={columns}
                    pageSize={10}
                    variant="slate"
                    actions={["imp"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    enableSearch
                    enableSorting
                />
            </div>
        </div>
    );
};

export default SyntheseBLPage;
