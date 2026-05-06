import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const SectionContainer = ({
  title,
  icon: Icon,
  headerColor = "bg-[#10b981]",
  topActions,
  footerActions,
  children,
  className,
  defaultOpen = true, // Permet de choisir si la section est ouverte au chargement
  collapsible = true   // Permet de désactiver l'accordéon si nécessaire
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("space-y-0 overflow-hidden rounded-2xl shadow-sm border border-slate-100 bg-white", className)}>
      {/* Header de la Section - Clickable si collapsible */}
      <div
        className={cn(
          headerColor,
          "px-6 py-3 flex items-center justify-between transition-all",
          collapsible && "cursor-pointer hover:opacity-95"
        )}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {/* L'icône avec le petit style "dot" */}
          <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
            {Icon ? (
              <Icon className="w-3.5 h-3.5 text-white" />
            ) : (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <h2 className="text-white font-bold uppercase tracking-wider text-sm select-none">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Actions optionnelles (ex: bouton ajouter) - StopPropagation pour ne pas fermer l'accordéon au clic */}
          {topActions && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {topActions}
            </div>
          )}

          {/* Icône de l'accordéon */}
          {collapsible && (
            <ChevronDown
              className={cn(
                "w-5 h-5 text-white transition-transform duration-200",
                !isOpen && "-rotate-90" // Pivote sur le côté quand c'est fermé
              )}
            />
          )}
        </div>
      </div>

      {/* Corps de la Section - Animation simple de présence */}
      {isOpen && (
        <div className="p-6 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}

          {/* Pied de section optionnel */}
          {footerActions && (
            <div className="flex justify-end pt-4 border-t border-slate-50">
              {footerActions}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionContainer;