import React, { useState, useRef } from "react";
import { ArrowBigDown, ChevronRight, Menu, X } from "lucide-react";
import useAppStore from "../../../store/useAppStore";
import { cn } from "../../../lib/utils";

export const HeaderComponent = () => {
    const { isAdminMode, activeSeason, isApiLoading } = useAppStore();
    const [openMenu, setOpenMenu] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const timeoutRef = useRef(null);

    const seasonLabel = activeSeason?.label
        ? `SAISON : ${activeSeason.label.slice(0, 2)} / ${activeSeason.label.slice(2)}`
        : "SAISON : —";

    let menuItems =
        isAdminMode
            ? [
                { label: "ACCUEIL", href: "/dash", isTrigger: false },
                {
                    label: "LIVRES", isTrigger: true, subItems: [
                        { label: "CATEGORIES", href: "/dash/livres/categories" },
                        { label: "LIVRES", href: "/dash/livres/livres" },
                    ]
                },
                {
                    label: "Fournisseurs", isTrigger: true, subItems: [
                        { label: "Fournisseurs disponibles", href: "/dash/fournisseurs/fournisseurs_disponibles" },
                        { label: "Saisir un BL", href: "/dash/fournisseurs/saisir_un_bl" },
                        { label: "Remboursement", href: "/dash/fournisseurs/remboursement" },
                        { label: "Synthèse BL", href: "/dash/fournisseurs/synthese_bl" },
                        { label: "Synthèse Remboursement", href: "/dash/fournisseurs/synthese_remboursement" },
                    ]
                },
                {
                    label: "Représentant", isTrigger: true, subItems: [
                        { label: "Représentants disponibles", href: "/dash/representant/representants_disponibles" },
                        { label: "Saisir un BL", href: "/dash/representant/saisir_un_bl" },
                        { label: "Remboursement", href: "/dash/representant/remboursement" },
                        { label: "Demande de facturation", href: "/dash/representant/demande_facturation" },
                        { label: "Factures", href: "/dash/representant/factures" },
                        { label: "Remboursement Factures", href: "/dash/representant/remboursement_factures" },
                        { label: "Déclaration Dépôt", href: "/dash/representant/declaration_depot" },
                        { label: "Cahier de texte", href: "/dash/representant/cahier_texte", color: "bg-blue-500 text-white" },
                        { label: "Cartes de Visite & Chevalet", href: "/dash/representant/cartes_visite", color: "bg-orange-500 text-white" },
                        { label: "synthèse BL", href: "/dash/representant/synthese_bl" },
                        { label: "synthèse Remboursement", href: "/dash/representant/synthese_remboursement" },
                    ]
                },
                { label: "ROBOTS", href: "/dash/robots", isTrigger: false },
                {
                    label: "Traçabilité", isTrigger: true, subItems: [
                        { label: "Clients", href: "/dash/tracabilite/clients" },
                        { label: "BL Clients", href: "/dash/tracabilite/bl_clients" },
                        { label: "Remboursement Client", href: "/dash/tracabilite/remboursement_client" },
                        { label: "Synthèse", href: "/dash/tracabilite/synthese" },
                        { label: "Journal d'activité", href: "/dash/tracabilite/activite" },
                    ]
                },
                {
                    label: "Synthèses Globales", isTrigger: true, subItems: [
                        { label: "Livraison Fournisseurs --> MSM-MEDIAS", href: "/dash/syntheses_globales/livraison_fournisseurs" },
                        { label: "Livraison MSM-MEDIAS --> REP", href: "/dash/syntheses_globales/livraison_rep" },
                        { label: "Ventes", href: "/dash/syntheses_globales/ventes" },
                        { label: "Dépôt", href: "/dash/syntheses_globales/depot" },
                        { label: "Remboursement Fournisseurs", href: "/dash/syntheses_globales/remboursement_fournisseurs" },
                        { label: "Remboursement REP", href: "/dash/syntheses_globales/remboursement_rep" },
                        { label: "Balance", href: "/dash/syntheses_globales/balance" },
                    ]
                },
                {
                    label: "Emailing", isTrigger: true, subItems: [
                        { label: "Simple Email", href: "/dash/emailing/simple_email" },
                        { label: "Invitation", href: "/dash/emailing/invitation" },
                    ]
                },
                {
                    label: "Réglages", isTrigger: true, subItems: [
                        { label: "Saison de travail", href: "/dash/reglages/saison_travail" },
                        { label: "Pied de facture", href: "/dash/reglages/pied_de_facture" },
                        { label: "Modèles Cahier de texte", href: "/dash/reglages/modeles_cahier_texte" },
                    ]
                },
                { label: seasonLabel, href: "#", isTrigger: false },
                { label: "Déconnexion", href: "/logout", isTrigger: false, color: "text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white" },
            ]
            : [
                { label: "ACCUEIL", href: "/REP/dash", isTrigger: false },
                {
                    label: "BON DE LIVRAISON", isTrigger: true, subItems: [
                        { label: "BL", href: "/REP/dash/bl/bl" },
                        { label: "Remboursement", href: "/REP/dash/bl/remb" },
                        { label: "Synthèse BL", href: "/REP/dash/bl/sbl" },
                    ]
                },
                {
                    label: "FACTURES", isTrigger: true, subItems: [
                        { label: "FACTURES MSM-Medias", href: "/REP/dash/factures/msm" },
                        { label: "FACTURES WATANIYA", href: "/REP/dash/factures/wataniya" },
                    ]
                },
                {
                    label: "CLIENTS", isTrigger: true, subItems: [
                        { label: "Ajouter Client", href: "/REP/dash/clients/ajouter_client" },
                        { label: "Saisir un BL", href: "/REP/dash/clients/saisir_un_bl" },
                        { label: "Remboursement", href: "/REP/dash/clients/remboursement" },
                        { label: "synthèse BL", href: "/REP/dash/clients/synthese_bl" },
                        { label: "synthèse Remboursement", href: "/REP/dash/clients/synthese_remboursement" },
                        {
                            label: "Synthèses Globales", isTrigger: true,
                            color: "bg-emerald-300 text-emerald-600 hover:bg-emerald-100 hover:text-slate-900",
                            subItems: [
                                { label: "Livraison Clients", href: "/REP/dash/clients/syntheses_globales/livraison_clients" },
                                { label: "Remboursement Clients", href: "/REP/dash/clients/syntheses_globales/remboursement_clients" },
                            ]
                        }
                    ]
                },
                { label: "Dépôt", href: "/REP/dash/depot", isTrigger: false },
                {
                    label: "CAHIER DE TEXTE", isTrigger: true, subItems: [
                        { label: "Commander un cahier", href: "/REP/dash/cahier_texte/commander" },
                        { label: "Suivi des commandes", href: "/REP/dash/cahier_texte/suivi" },
                    ]
                },
                {
                    label: "CARTES DE VISITE & CHEVALET", isTrigger: true, subItems: [
                        { label: "Commander une carte", href: "/REP/dash/cartes_visite/commander" },
                        { label: "Suivi des commandes", href: "/REP/dash/cartes_visite/suivi" },
                    ]
                },
                { label: "ROBOTS", href: "/REP/dash/robots", isTrigger: false },
                { label: "PROFIL", href: "/REP/dash/profil", isTrigger: false },
                { label: seasonLabel, href: "#", isTrigger: false },
                { label: "Déconnexion", href: "/logout", isTrigger: false, color: "text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white" },
            ];

    const handleMouseEnter = (label) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpenMenu(label);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
    };

    return (
        <header className="w-[98%] mx-auto mt-2 bg-white rounded-lg shadow-sm border border-slate-100 sticky top-0 z-50">
            {isApiLoading && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-100 overflow-hidden rounded-t-lg">
                    <div className="h-full bg-blue-500 animate-loading-bar" />
                </div>
            )}
            <div className="px-4 h-14 flex items-center justify-between">

                {/* Mobile Toggle */}
                <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-1 w-full justify-center">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative"
                            onMouseEnter={() => item.isTrigger && handleMouseEnter(item.label)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <a
                                href={item.href || "#"}
                                className={`px-3 py-2 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1 ${item.color || "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
                                }
                            >
                                {item.label}
                                {item.isTrigger && <ArrowBigDown size={14} className="fill-current" />}
                            </a>

                            {/* Dropdown */}
                            {item.isTrigger && openMenu === item.label && (
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <div key={subIndex} className="relative group">
                                            <a
                                                href={subItem.href || "#"}
                                                className={`block px-4 py-2 text-xs font-semibold transition-colors duration-150 ${subItem.color || "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                    }`}
                                            >
                                                {subItem.label}
                                                {subItem.subItems && <ChevronRight size={12} />}
                                            </a>
                                            {/* Render Nested Level */}
                                            {subItem.subItems && (
                                                <div className="hidden group-hover:block">
                                                    <DesktopSubMenu items={subItem.subItems} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <nav className="lg:hidden border-t border-slate-100 bg-white rounded-b-lg overflow-hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <MobileMenu items={menuItems} />
                    </div>
                </nav>
            )}
        </header>
    );
};

const MobileMenu = ({ items, level = 0 }) => {
    return items.map((item, index) => (
        <div key={index} className={level > 0 ? "pl-4" : ""}>
            <a
                href={item.href || "#"}
                className={cn(
                    "block px-3 py-2 rounded-md font-bold transition-colors",
                    level === 0 ? "text-sm text-slate-600" : "text-xs text-slate-500",
                    item.color || "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    "hover:bg-slate-50 hover:text-slate-900"
                )}
            >
                {item.label}
            </a>
            {item.subItems && (
                <div className="border-l border-slate-100 ml-3">
                    <MobileMenu items={item.subItems} level={level + 1} />
                </div>
            )}
        </div>
    ));
};

const DesktopSubMenu = ({ items }) => (
    <div className="absolute top-0 left-full ml-[-2px] w-56 bg-white rounded-md shadow-lg border border-slate-100 py-1 z-50 group-hover:block hidden animate-in fade-in slide-in-from-left-2 duration-200">
        {items.map((item, idx) => (
            <div key={idx} className="relative group">
                <a
                    href={item.href || "#"}
                    className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    {item.label}
                    {item.subItems && <ChevronRight size={12} />}
                </a>
                {item.subItems && (
                    <div className="hidden group-hover:block">
                        <DesktopSubMenu items={item.subItems} />
                    </div>
                )}
            </div>
        ))}
    </div>
);