import { useState } from "react";
import { BookOpen } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";
import cahierCommunicationService from "../../../api/services/cahierCommunicationService";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepCahierCommanderPage() {
    const activeSeason = useAppStore(state => state.activeSeason);
    const user = useAppStore(state => state.user);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        ecole: "",
        nom_ecole_ar: "",
        adresse_ecole: "",
        ville_ecole: "",
        code_postale: "",
        tel_ecole: "",
        email_ecole: "",
        niveau_cahier: "Primaire",
        type_cahier: "Journalier",
        prix_cahier: "",
        qte_cahier: "",
        indication: "",
        remarques: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await cahierCommunicationService.create({
                ...formData,
                annee: activeSeason?.name
            });
            toast.success("Commande de cahier envoyée avec succès");
            setFormData({
                ecole: "", nom_ecole_ar: "", adresse_ecole: "", ville_ecole: "",
                code_postale: "", tel_ecole: "", email_ecole: "",
                niveau_cahier: "Primaire", type_cahier: "Journalier",
                prix_cahier: "", qte_cahier: "", indication: "", remarques: ""
            });
        } catch (error) {
            toast.error("Erreur lors de l'envoi de la commande");
            logger("Failed to create cahier command", "error")();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <BookOpen size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Commander un cahier</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Passer une commande de cahier de texte
                    </p>
                </div>
            </div>

            <SectionContainer
                title="Informations de l'école"
                icon={BookOpen}
                headerColor="bg-blue-600"
                collapsible={true}
                defaultOpen={true}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Nom de l'école (FR) *</label>
                            <input
                                type="text"
                                required
                                value={formData.ecole}
                                onChange={e => setFormData({ ...formData, ecole: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Nom de l'école"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Nom de l'école (AR)</label>
                            <input
                                type="text"
                                value={formData.nom_ecole_ar}
                                onChange={e => setFormData({ ...formData, nom_ecole_ar: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="اسم المدرسة"
                                dir="rtl"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Adresse *</label>
                            <input
                                type="text"
                                required
                                value={formData.adresse_ecole}
                                onChange={e => setFormData({ ...formData, adresse_ecole: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Adresse"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Ville *</label>
                            <input
                                type="text"
                                required
                                value={formData.ville_ecole}
                                onChange={e => setFormData({ ...formData, ville_ecole: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Ville"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Code Postal</label>
                            <input
                                type="text"
                                value={formData.code_postale}
                                onChange={e => setFormData({ ...formData, code_postale: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Code postal"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Téléphone</label>
                            <input
                                type="text"
                                value={formData.tel_ecole}
                                onChange={e => setFormData({ ...formData, tel_ecole: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Téléphone"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Email</label>
                            <input
                                type="email"
                                value={formData.email_ecole}
                                onChange={e => setFormData({ ...formData, email_ecole: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Email"
                            />
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-t border-slate-100 pt-4">
                        Type de cahier
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Niveau *</label>
                            <div className="flex gap-4">
                                {["Primaire", "Secondaire"].map(niv => (
                                    <label key={niv} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="niveau_cahier"
                                            value={niv}
                                            checked={formData.niveau_cahier === niv}
                                            onChange={e => setFormData({ ...formData, niveau_cahier: e.target.value })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-700">{niv}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Type *</label>
                            <div className="flex gap-4">
                                {["Journalier", "Hebdomadaire"].map(typ => (
                                    <label key={typ} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type_cahier"
                                            value={typ}
                                            checked={formData.type_cahier === typ}
                                            onChange={e => setFormData({ ...formData, type_cahier: e.target.value })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-700">{typ}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Prix (DH)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.prix_cahier}
                                onChange={e => setFormData({ ...formData, prix_cahier: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Prix"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">Quantité</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.qte_cahier}
                                onChange={e => setFormData({ ...formData, qte_cahier: e.target.value })}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Quantité"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Indication</label>
                        <textarea
                            value={formData.indication}
                            onChange={e => setFormData({ ...formData, indication: e.target.value })}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 min-h-[80px] resize-none"
                            placeholder="Indication supplémentaire"
                        />
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

export default RepCahierCommanderPage;
