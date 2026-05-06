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
        <div className="HomePage px-5">
            <AccordionComponent AccordionItems={accordionItems} id="home" allowMultiple={true} />
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
    <div className="px-5 py-[15px]">
        {/* 1. The Setting Dropdown is ALWAYS visible */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 border-b pb-2">
            <label className="font-semibold">Mode d'affichage :</label>
            <select
                className="border rounded p-1 outline-none"
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
                        className="mt-4 self-start"
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