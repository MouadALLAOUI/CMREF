import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { CalendarDays, Save } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import settingsService from "../../../api/services/settingsService";

const SaisonTravailPage = () => {
    const [saison, setSaison] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const seasonOptions = [
        "2024/2025",
        "2025/2026",
        "2026/2027",
        "2027/2028",
        "2028/2029",
    ];

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const data = await settingsService.getAll();
            if (data && data.active_season) {
                setSaison(data.active_season);
            }
        } catch (error) {
            logger("Error fetching settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        if (!saison) {
            toast.error("Veuillez sélectionner une saison");
            return;
        }

        setIsSaving(true);
        try {
            await settingsService.update({ active_season: saison });
            toast.success(`Saison ${saison} activée avec succès`);
        } catch (error) {
            logger("Error saving settings:", error);
            toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement des paramètres");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 pt-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-full mb-2">
                        <CalendarDays size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Chargement...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-10">
            <div className="text-center space-y-2">
                <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-full mb-2">
                    <CalendarDays size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Saison de Travail</h1>
                <p className="text-slate-500 text-sm">Définissez la saison active pour l'ensemble du système.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
                    <div className="font-bold flex items-center gap-2">
                        <CalendarDays size={16} />
                        Saison Actuelle
                    </div>
                    <div className="mt-1 text-xs text-blue-600">
                        {saison ? `Saison ${saison}` : "Aucune saison définie"}
                    </div>
                </div>
                
                <FormInputRow 
                    label="Saison Active" 
                    inputType="select" 
                    items={seasonOptions.map(s => ({ label: s, value: s }))} 
                    value={saison} 
                    onChange={setSaison}
                    layout="col"
                    required
                />
                
                <Button 
                    onClick={handleSave}
                    disabled={isSaving || !saison}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 h-12 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} /> 
                    {isSaving ? "Enregistrement..." : "Appliquer les changements"}
                </Button>
            </div>
        </div>
    );
};

export default SaisonTravailPage;
