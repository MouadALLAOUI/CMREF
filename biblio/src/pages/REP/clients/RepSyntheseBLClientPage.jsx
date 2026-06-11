import { useState, useEffect, useMemo } from "react";
import { BarChart3, Printer } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import clientService from "../../../api/services/clientService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import PdfDialogViewer from "../../../components/template/pdfs/PdfDialogViewer";
import RepSynthesePdf from "../../../components/pdfs/representants/RepSynthesePdf";

function RepSyntheseBLClientPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pdfOpen, setPdfOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [itemsRes, clientsRes] = await Promise.all([
                    bLivraisonItemService.getAll({ annee: activeSeason?.label }),
                    clientService.getAll({ annee: activeSeason?.label })
                ]);
                setDeliveryItems(itemsRes?.data?.data || itemsRes?.data || []);
                setClients(clientsRes?.data?.data || clientsRes?.data || []);
            } catch (error) {
                logger("Failed to load client BL synthesis", "error")();
            } finally {
                setIsLoading(false);
            }
        };
        if (activeSeason?.label) fetchData();
    }, [activeSeason?.label]);

    const clientSummary = useMemo(() => {
        const summary = {};
        deliveryItems.forEach(item => {
            const clientId = item.client_id || item.b_livraison?.client_id;
            if (!clientId) return;
            if (!summary[clientId]) {
                const client = clients.find(c => c.id === clientId);
                summary[clientId] = {
                    clientId,
                    clientName: client?.raison_sociale || "—",
                    totalQte: 0,
                    totalMontant: 0
                };
            }
            summary[clientId].totalQte += item.quantite || 0;
            summary[clientId].totalMontant += (item.quantite || 0) * (item.livre?.prix_vente || 0);
        });
        return Object.values(summary);
    }, [deliveryItems, clients]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Synthèse BL Clients</h1>
                        <p className="text-slate-500 text-xs mt-0.5">Récapitulatif des livraisons par client</p>
                    </div>
                </div>
                <button onClick={() => setPdfOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all no-print">
                    <Printer size={18} /> Imprimer
                </button>
            </div>

            <SectionContainer title="Synthèse par client" icon={BarChart3} headerColor="bg-blue-600" collapsible={true} defaultOpen={true}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-left font-bold text-slate-700 border border-slate-200">Client</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-700 border border-slate-200">Quantité totale</th>
                                <th className="px-4 py-3 text-right font-bold text-slate-700 border border-slate-200">Montant total (DH)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientSummary.map(row => (
                                <tr key={row.clientId} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-bold text-slate-700">{row.clientName}</td>
                                    <td className="px-4 py-3 text-center">{row.totalQte}</td>
                                    <td className="px-4 py-3 text-right font-bold">{row.totalMontant.toLocaleString()} DH</td>
                                </tr>
                            ))}
                            {clientSummary.length > 0 && (
                                <tr className="bg-slate-900 text-white font-bold">
                                    <td className="px-4 py-3">TOTAL</td>
                                    <td className="px-4 py-3 text-center">{clientSummary.reduce((s, r) => s + r.totalQte, 0)}</td>
                                    <td className="px-4 py-3 text-right">{clientSummary.reduce((s, r) => s + r.totalMontant, 0).toLocaleString()} DH</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && clientSummary.length === 0 && (
                    <div className="text-center py-8 text-slate-500 italic">Aucune donnée disponible</div>
                )}
            </SectionContainer>

            <PdfDialogViewer
                open={pdfOpen}
                onOpenChange={setPdfOpen}
                title="Synthèse BL Clients"
                document={
                    <RepSynthesePdf
                        title="Synthèse BL Clients"
                        categoryData={[{ categoryName: "Livraisons", books: clientSummary.map(c => ({ code: c.clientName, livraison: c.totalQte })) }]}
                        kpis={{ credit: clientSummary.reduce((s, r) => s + r.totalMontant, 0), avance: 0, reste: 0, recouvrement: "0.00" }}
                        repName={user?.name}
                    />
                }
            />
        </div>
    );
}

export default RepSyntheseBLClientPage;
