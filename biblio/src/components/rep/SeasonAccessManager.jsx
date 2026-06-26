import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import seasonsService from "../../api/services/seasonsService";
import representantSeasonService from "../../api/services/representantSeasonService";
import toast from "react-hot-toast";
import logger from "../../lib/logger";

const STATUS_OPTIONS = [
    { value: "unlock", label: "Déverrouillé", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { value: "lock", label: "Verrouillé", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { value: "disabled", label: "Désactivé", color: "bg-red-100 text-red-700 border-red-200" },
];

const SeasonAccessManager = ({ representant, onClose }) => {
    const [seasons, setSeasons] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [activeSeasons, repSeasons] = await Promise.all([
                    seasonsService.isActive(),
                    representantSeasonService.getForRep(representant.id),
                ]);
                const seasonsList = Array.isArray(activeSeasons) ? activeSeasons : [];
                const repSeasonsList = Array.isArray(repSeasons) ? repSeasons : [];
                setSeasons(seasonsList);

                const map = {};
                for (const s of repSeasonsList) {
                    map[s.season_id] = s.status;
                }
                for (const s of seasonsList) {
                    if (!map[s.id]) map[s.id] = "unlock";
                }
                setStatusMap(map);
            } catch (error) {
                logger("Error fetching season data:", error);
                toast.error("Erreur lors du chargement des saisons");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [representant.id]);

    const handleStatusChange = (seasonId, newStatus) => {
        setStatusMap((prev) => ({ ...prev, [seasonId]: newStatus }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = Object.entries(statusMap).map(([seasonId, status]) => ({
                season_id: seasonId,
                status,
            }));
            await representantSeasonService.sync(representant.id, { seasons: payload });
            toast.success("Accès saisons mis à jour");
            onClose();
        } catch (error) {
            logger("Error saving season access:", error);
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 min-w-[450px]">
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 min-w-[450px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Gérer les accès saisons</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {representant.nom} — Définir le statut pour chaque saison
                    </p>
                </div>
                <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 transition-colors">
                    <X size={18} className="text-slate-400" />
                </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {seasons.map((season) => {
    const currentStatus = statusMap[season.id] || "unlock";
    const statusOption = STATUS_OPTIONS.find((o) => o.value === currentStatus);
                    return (
                        <div
                            key={season.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-slate-700">
                                    {season.name}
                                </span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusOption?.color}`}>
                                    {statusOption?.label}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {STATUS_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleStatusChange(season.id, opt.value)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${
                                            currentStatus === opt.value
                                                ? opt.color + " shadow-sm"
                                                : "border-slate-200 text-slate-400 hover:bg-slate-50"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={onClose} className="rounded-xl h-10">
                    Annuler
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-slate-900 text-white rounded-xl h-10 font-bold hover:bg-black"
                >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </div>
        </div>
    );
};

export default SeasonAccessManager;
