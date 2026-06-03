import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { FileText, Save, Info } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import settingsService from "../../../api/services/settingsService";

const PiedDeFacturePage = () => {
    const [formData, setFormData] = useState({ 
        bank_name: "", 
        rib: "", 
        contact_info: "",
        legal_mentions: "",
        payment_conditions: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await settingsService.getAll();
                const settings = res || {};
                setFormData({
                    bank_name: settings["pied_de_facture.bank_name"]?.value || "",
                    rib: settings["pied_de_facture.rib"]?.value || "",
                    contact_info: settings["pied_de_facture.contact_info"]?.value || "",
                    legal_mentions: settings["pied_de_facture.legal_mentions"]?.value || "",
                    payment_conditions: settings["pied_de_facture.payment_conditions"]?.value || ""
                });
            } catch (error) {
                logger("Error loading settings:", "error")();
                toast.error("Erreur lors de la récupération des paramètres");
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await settingsService.update({
                settings: [
                    { key: "pied_de_facture.bank_name", value: formData.bank_name },
                    { key: "pied_de_facture.rib", value: formData.rib },
                    { key: "pied_de_facture.contact_info", value: formData.contact_info },
                    { key: "pied_de_facture.legal_mentions", value: formData.legal_mentions },
                    { key: "pied_de_facture.payment_conditions", value: formData.payment_conditions }
                ]
            });
            toast.success("Configuration enregistrée avec succès");
        } catch (error) {
            logger("Error saving settings:", "error")();
            toast.error("Erreur lors de l'enregistrement de la configuration");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                <p className="text-slate-500 font-medium italic">Chargement de la configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <FileText size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Configuration Pied de Facture</h1>
                    <p className="text-slate-500 text-sm">Paramétrez les informations qui s'affichent en bas de vos documents (Factures, BLs).</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormInputRow 
                        label="Nom de la Banque" 
                        placeholder="Ex: Attijariwafa bank" 
                        value={formData.bank_name} 
                        onChange={(v) => setFormData({ ...formData, bank_name: v })} 
                    />
                    <FormInputRow 
                        label="RIB Bancaire" 
                        placeholder="24 chiffres" 
                        value={formData.rib} 
                        onChange={(v) => setFormData({ ...formData, rib: v })} 
                    />
                </div>
                
                <FormInputRow 
                    label="Informations de Contact" 
                    placeholder="Tél, Email, Site Web..." 
                    value={formData.contact_info} 
                    onChange={(v) => setFormData({ ...formData, contact_info: v })} 
                />

                <FormInputRow 
                    label="Texte de Mentions Légales" 
                    inputType="textarea" 
                    placeholder="Saisissez les mentions légales..." 
                    value={formData.legal_mentions} 
                    onChange={(v) => setFormData({ ...formData, legal_mentions: v })} 
                />

                <FormInputRow 
                    label="Conditions de Paiement" 
                    inputType="textarea" 
                    placeholder="Saisissez les conditions de paiement..." 
                    value={formData.payment_conditions} 
                    onChange={(v) => setFormData({ ...formData, payment_conditions: v })} 
                />

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-slate-900 text-white flex items-center gap-2 px-8 h-12 font-bold hover:bg-slate-800 transition-colors"
                    >
                        <Save size={18} /> {isSaving ? "Enregistrement..." : "Enregistrer la configuration"}
                    </Button>
                </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-800 text-sm">
                <Info size={20} className="shrink-0" />
                <p>Ces informations seront appliquées à toutes les nouvelles factures générées à partir de maintenant.</p>
            </div>
        </div>
    );
};

export default PiedDeFacturePage;
