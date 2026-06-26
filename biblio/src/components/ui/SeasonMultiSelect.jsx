import { Check } from "lucide-react";
import { schoolYearFormat } from "../../lib/utilities";

const SeasonMultiSelect = ({ seasons = [], selected = [], onToggle, onSelectAll, onClear }) => {
    return (
        <div className="p-2 min-w-[220px]">
            {seasons.length === 0 ? (
                <p className="text-xs text-slate-400 px-2 py-3 text-center">Aucune saison active</p>
            ) : (
                <>
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 mb-1">
                        <button
                            onClick={onSelectAll}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Tout sélectionner
                        </button>
                        <button
                            onClick={onClear}
                            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Effacer
                        </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {seasons.map((season) => {
                            const isSelected = selected.some((s) => s.id === season.id);
                            return (
                                <label
                                    key={season.id}
                                    className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded-md hover:bg-slate-50 transition-colors group"
                                >
                                    <div
                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                            isSelected
                                                ? "bg-blue-600 border-blue-600"
                                                : "border-slate-300 group-hover:border-slate-400"
                                        }`}
                                    >
                                        {isSelected && <Check size={12} className="text-white stroke-[3]" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onToggle(season)}
                                        className="sr-only"
                                    />
                                    <span className="text-xs font-semibold text-slate-700">
                                        {season.label?.length === 4
                                            ? schoolYearFormat(season.label)
                                            : season.label || season.name || "—"}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default SeasonMultiSelect;
