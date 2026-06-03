import { useState } from "react";
import { User, Lock, Save } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";
import useAppStore from "../../../store/useAppStore";
import logger from "../../../lib/logger";
import toast from "react-hot-toast";

function RepProfilPage() {
    const user = useAppStore(state => state.user);
    const profile = useAppStore(state => state.profile);

    const [loginData, setLoginData] = useState({
        login: user?.email || user?.login || "",
        new_password: "",
        confirm_password: "",
        current_password: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (loginData.new_password && loginData.new_password !== loginData.confirm_password) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        if (loginData.new_password && !loginData.current_password) {
            toast.error("Veuillez entrer votre mot de passe actuel");
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: Wire to backend endpoint when available
            toast.success("Profil mis à jour avec succès");
            setLoginData(prev => ({ ...prev, new_password: "", confirm_password: "", current_password: "" }));
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
            logger("Failed to update profile", "error")();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-md">
                    <User size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mon Profil</h1>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Gérer vos informations de connexion
                    </p>
                </div>
            </div>

            <SectionContainer
                title="Informations de connexion"
                icon={Lock}
                headerColor="bg-blue-600"
                collapsible={true}
                defaultOpen={true}
            >
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Login</label>
                        <input
                            type="text"
                            value={loginData.login}
                            disabled
                            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none text-slate-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={loginData.new_password}
                            onChange={e => setLoginData({ ...loginData, new_password: e.target.value })}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="Laisser vide pour ne pas changer"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            value={loginData.confirm_password}
                            onChange={e => setLoginData({ ...loginData, confirm_password: e.target.value })}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="Confirmer le mot de passe"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <label className="text-sm font-bold text-slate-700">Mot de passe actuel *</label>
                        <input
                            type="password"
                            required={!!loginData.new_password}
                            value={loginData.current_password}
                            onChange={e => setLoginData({ ...loginData, current_password: e.target.value })}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="Entrez votre mot de passe actuel pour confirmer"
                        />
                    </div>
                    <div className="flex justify-start pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </SectionContainer>

            {profile && (
                <SectionContainer
                    title="Informations personnelles"
                    icon={User}
                    headerColor="bg-slate-600"
                    collapsible={true}
                    defaultOpen={true}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-bold text-slate-700">Nom complet :</span>{" "}
                            {profile.nom || user?.name || "—"}
                        </div>
                        <div>
                            <span className="font-bold text-slate-700">Email :</span>{" "}
                            {user?.email || "—"}
                        </div>
                        <div>
                            <span className="font-bold text-slate-700">Zone :</span>{" "}
                            {profile.zone || "—"}
                        </div>
                        <div>
                            <span className="font-bold text-slate-700">Téléphone :</span>{" "}
                            {profile.telephone || "—"}
                        </div>
                    </div>
                </SectionContainer>
            )}
        </div>
    );
}

export default RepProfilPage;
