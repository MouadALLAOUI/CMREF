import { useState } from "react";
import { Button } from "../../components/ui/button";
import { AccordionComponent } from "../../components/ui/accordion";
import FormInputRow from "../../components/ui/FormInputRaw";
import StockReportPDF from "../../components/pdfs/StockReportPDF";
import { BlobProvider } from "@react-pdf/renderer"; // <-- Using BlobProvider to prevent useRef crash!
import { Loader2, Printer } from "lucide-react";
import PdfDialogViewer from "../../components/template/pdfs/PdfDialogViewer";
import { useStockReport } from "../../hooks/useStockReport";
import logger from "../../lib/logger";

function HomePage() {
    const [selectedDestination, setSelectedDestination] = useState("");
    const [showViewer, setShowViewer] = useState(false);
    const [pdfDisplayMode, setPdfDisplayMode] = useState("dialog");
    const {
        destinations,
        groupedReportData,
        totalGlobalStock,
        isLoading
    } = useStockReport(selectedDestination);

    // logger({
    //     destinations,
    //     groupedReportData,
    //     totalGlobalStock,
    //     isLoading
    // })

    // Find the name of the selected destination to pass to the PDF
    const currentDestinationObj = destinations.find(d => d.id === selectedDestination);
    const destinationName = currentDestinationObj ? currentDestinationObj.destination : "MSM-Medias";

    const myDocument = <StockReportPDF destinationName={destinationName} groupedData={groupedReportData} />;

    const accordionItems = [
        {
            title: "Choisir une déstination",
            content: (
                <div className="px-5 py-[15px]">
                    <FormInputRow
                        label="déstination"
                        name="déstination"
                        placeholder="MSM-Medias"
                        id="msmMedias"
                        inputType="select"
                        items={destinations.map((item) => ({
                            label: item.destination,
                            value: item.id
                        }))}
                        layout="column"
                        allowEmpty={true}
                        emptyLabel="MSM-Medias"
                        value={selectedDestination}
                        onChange={(value) => {
                            setSelectedDestination(value);
                            setShowViewer(false); // Hide viewer if they change destination
                        }}
                    />
                </div>
            ),
        },
        {
            title: "Achat - Vente - Stock / Niveau --|-- Categorie : Primaire",
            content: <AVSPdfs
                pdfDisplayMode={pdfDisplayMode}
                setPdfDisplayMode={setPdfDisplayMode}
                showViewer={showViewer}
                setShowViewer={setShowViewer}
                totalGlobalStock={totalGlobalStock}
                myDocument={myDocument}
                destinationName={destinationName}
                isLoading={isLoading}
            />,
        },
    ];

    return (
        <div className="HomePage space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Tableau de bord</h1>
                        <p className="text-sm text-slate-500">Suivi des stocks et impression des états.</p>
                    </div>
                </div>
                <AccordionComponent AccordionItems={accordionItems} id="home" allowMultiple={true} />
            </div>
        </div>
    );
}

const AVSPdfs = ({
    pdfDisplayMode,
    setPdfDisplayMode,
    showViewer,
    setShowViewer,
    totalGlobalStock,
    myDocument,
    destinationName,
    isLoading
}) => (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-5 py-4">
        {/* 1. The Setting Dropdown is ALWAYS visible */}
        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-sm text-slate-600">
            <label className="font-semibold uppercase tracking-wide">Mode d'affichage :</label>
            <select
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-1 focus:ring-slate-900"
                value={pdfDisplayMode}
                onChange={(e) => {
                    setPdfDisplayMode(e.target.value);
                    setShowViewer(false); // Reset the UI if they swap modes
                }}
            >
                <option value="dialog">Fenêtre (Dialog)</option>
                <option value="flat">Intégré (Flat)</option>
            </select>
        </div>

        {/* 2. Render based on the selected mode */}
        {pdfDisplayMode === "dialog" ? (
            /* --- DIALOG MODE --- */
            /* Radix handles the button click natively, no need for showViewer state here */
            <PdfDialogViewer
                document={myDocument}
                title={`Aperçu des Stocks : ${destinationName}`}
                trigger={
                    <Button variant="outline" className="mb-2" disabled={isLoading}>
                        {isLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Printer size={16} className="mr-2" />}
                        Stock: {isLoading ? "Calcul..." : totalGlobalStock}
                    </Button>
                }
            />
        ) : (
            /* --- FLAT MODE --- */
            /* We manually toggle the UI using showViewer state */
            !showViewer ? (
                <MyTriggerButton
                    totalGlobalStock={totalGlobalStock}
                    setShowViewer={setShowViewer}
                    isLoading={isLoading}
                />
            ) : (
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

                    {/* Fermer Button correctly resets state to default value */}
                    <Button
                        variant="destructive"
                        className="mt-4 self-start rounded-xl"
                        onClick={() => setShowViewer(false)}
                    >
                        Fermer l'aperçu PDF
                    </Button>
                </div>
            )
        )}
    </div>
)

const MyTriggerButton = ({ totalGlobalStock, setShowViewer, isLoading }) => (
    <Button
        variant="outline"
        className="mb-2"
        disabled={isLoading}
        onClick={() => setShowViewer(true)}
    >
        {isLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Printer size={16} className="mr-2" />}
        Stock: {isLoading ? "Calcul..." : totalGlobalStock}
    </Button>
);

export default HomePage;
