import { useState } from "react";
import { CreditCard } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";
import carteVisiteService from "../../../api/services/carteVisiteService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

const CARD_MODELS = Array.from({ length: 12 }, (_, i) => ({
    id: `carte_visite_${i + 1}`,
    label: `Modèle ${i + 1}`,
    src: `https://placehold.co/300x180?text=CV+${i + 1}`
}));

function RepCartesCommanderPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState("");

    const [formData, setFormData] = useState({
        nom_sur_carte: "",
        fonction: "",
        tel: "",
        email: "",
        adresse: "",
        autre_info: "",
        remarques: "",
        chevalet_ligne_1: "",
        chevalet_ligne_2: "",
        chevalet_ligne_3: "",
        comment_chevalet: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedModel) {
            toast.error("Veuillez sélectionner un modèle de carte");
            return;
        }
        setIsLoading(true);
        try {
            await carteVisiteService.create({
                ...formData,
                model: selectedModel,
                annee: activeSeason?.label
            });
            toast.success("Commande de carte envoyée avec succès");
            setFormData({
                nom_sur_carte: "", fonction: "", tel: "", email: "",
                adresse: "", autre_info: "", remarques: "",
                chevalet_ligne_1: "", chevalet_ligne_2: "", chevalet_ligne_3: "",
                comment_chevalet: ""
            });
            setSelectedModel("");
        } catch (error) {
            toast.error("Erreur lors de l'envoi de la commande");
            logger("Failed to create carte visite command", "error")();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <CreditCard size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Commander une carte</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Commander des cartes de visite et/ou un chevalet
                    </p>
                </div>
            </div>

            <SectionContainer
                title="Choisir le modèle"
                icon={CreditCard}
                headerColor="bg-blue-600"
                collapsible={true}
                defaultOpen={true}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CARD_MODELS.map(model => (
                        <div
                            key={model.id}
                            onClick={() => setSelectedModel(model.id)}
                            className={`cursor-pointer rounded-xl border-2 p-2 transition-all ${
                                selectedModel === model.id
                                    ? "border-emerald-500 bg-emerald-50 shadow-md"
                                    : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                        >
                            <img
                                src={model.src}
                                alt={model.label}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            <p className="text-xs text-center mt-2 font-bold text-slate-700">{model.label}</p>
                        </div>
                    ))}
                </div>
            </SectionContainer>

            <SectionContainer
                title="Informations sur la carte"
                icon={CreditCard}
                headerColor="bg-emerald-600"
                collapsible={true}
                defaultOpen={true}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Nom & Prénom *</label>
                            <input
                                type="text"
                                required
                                value={formData.nom_sur_carte}
                                onChange={e => setFormData({ ...formData, nom_sur_carte: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Nom complet"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Fonction</label>
                            <input
                                type="text"
                                value={formData.fonction}
                                onChange={e => setFormData({ ...formData, fonction: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Fonction"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Téléphone</label>
                            <input
                                type="text"
                                value={formData.tel}
                                onChange={e => setFormData({ ...formData, tel: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Téléphone"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Email"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700">Adresse</label>
                            <input
                                type="text"
                                value={formData.adresse}
                                onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Adresse"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700">Autre info</label>
                            <textarea
                                value={formData.autre_info}
                                onChange={e => setFormData({ ...formData, autre_info: e.target.value })}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 min-h-[60px] resize-none"
                                placeholder="Informations supplémentaires"
                            />
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-t border-slate-100 pt-4">
                        Chevalet (optionnel)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Ligne 1</label>
                            <input
                                type="text"
                                value={formData.chevalet_ligne_1}
                                onChange={e => setFormData({ ...formData, chevalet_ligne_1: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Ligne 2</label>
                            <input
                                type="text"
                                value={formData.chevalet_ligne_2}
                                onChange={e => setFormData({ ...formData, chevalet_ligne_2: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Ligne 3</label>
                            <input
                                type="text"
                                value={formData.chevalet_ligne_3}
                                onChange={e => setFormData({ ...formData, chevalet_ligne_3: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Remarques</label>
                        <textarea
                            value={formData.remarques}
                            onChange={e => setFormData({ ...formData, remarques: e.target.value })}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 min-h-[80px] resize-none"
                            placeholder="Remarques"
                        />
                    </div>

                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Envoi en cours..." : "Envoyer la commande"}
                        </button>
                    </div>
                </form>
            </SectionContainer>
        </div>
    );
}

export default RepCartesCommanderPage;
