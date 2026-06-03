import { useState } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { UserPlus, Send, Loader2, Mail, Shield, Clock } from "lucide-react";
import invitationService from "../../../api/services/invitationService";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InvitationPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        role: "représentant",
        message: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
            toast.error("Veuillez entrer une adresse email valide.");
            return;
        }
        if (!formData.role) {
            toast.error("Veuillez sélectionner un rôle.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await invitationService.create(formData);
            toast.success(response.message || "Invitation envoyée avec succès !");
            setFormData({ email: "", role: "représentant", message: "" });
        } catch (error) {
            logger("Error sending invitation:", error)("error");
            toast.error("Erreur lors de l'envoi de l'invitation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <UserPlus size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Envoyer une Invitation</h1>
                    <p className="text-slate-500 text-sm">Invitez un nouveau représentant ou fournisseur sur la plateforme.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputRow
                                label="Adresse Email"
                                placeholder="email@exemple.com"
                                value={formData.email}
                                onChange={(v) => setFormData({ ...formData, email: v })}
                                disabled={isLoading}
                                required
                            />
                            <FormInputRow
                                label="Rôle"
                                inputType="select"
                                items={["représentant", "fournisseur", "admin"]}
                                value={formData.role}
                                onChange={(v) => setFormData({ ...formData, role: v })}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <FormInputRow
                            label="Message d'accompagnement"
                            inputType="textarea"
                            placeholder="Votre message ici..."
                            value={formData.message}
                            onChange={(v) => setFormData({ ...formData, message: v })}
                            disabled={isLoading}
                        />

                        <div className="pt-4 border-t border-slate-50">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 py-6 text-lg font-bold hover:bg-black transition-colors disabled:bg-slate-300"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} /> Envoyer l'invitation
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Mail size={16} className="text-slate-600" />
                            <h3 className="text-sm font-bold text-slate-700 uppercase">Comment ça marche</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="bg-emerald-100 text-emerald-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                <p>Un email d'invitation est envoyé à l'adresse saisie.</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-emerald-100 text-emerald-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                <p>Le destinataire clique sur le lien pour créer son compte.</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-emerald-100 text-emerald-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                <p>Le compte est automatiquement associé au rôle sélectionné.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield size={16} className="text-slate-600" />
                            <h3 className="text-sm font-bold text-slate-700 uppercase">Rôles disponibles</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span><strong>Représentant</strong> — Accès au portail représentant</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                <span><strong>Fournisseur</strong> — Accès au portail fournisseur</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                <span><strong>Admin</strong> — Accès complet à l'administration</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
                        <Clock size={16} className="flex-shrink-0 mt-0.5" />
                        <p>Le lien d'invitation expire après <strong>7 jours</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationPage;
