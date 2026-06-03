import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "../pages/loginPage/login";
import HeaderPages from "../layouts/HeaderPages";
import UnauthorizedPage from "../pages/UnauthorizedPage";

import { ProtectedRoute } from "./protectedRoute";
import useAppStore from "../store/useAppStore";

// ADMIN PAGES

import HomePage from "../pages/home/HomePage";

import CategoriesPage from "../pages/livres/categories/CategoriesPage";
import LivresPage from "../pages/livres/livre/LivresPage";

import FournisseursDisponibles from "../pages/Fournisseurs/fourniseur_disp/FornisseurDispoPage";
import FournisseurSaisirBl from "../pages/Fournisseurs/BL/SaisirBlPage";
import FournisseurRemboursement from "../pages/Fournisseurs/Remboursement/Remboursement.jsx";
import FournisseurSyntheseBL from "../pages/Fournisseurs/SyntheseBL/SyntheseBLPage";
import FournisseurSyntheseRemboursement from "../pages/Fournisseurs/SyntheseRemboursement/SyntheseRemboursementPage";

import ReprésentantDisponibles from "../pages/Représentant/ReprésentantDisponibles/ReprésentantDisponibles";
import ReprésentantSaisirBl from "../pages/Représentant/ReprésentantSaisirBl/ReprésentantSaisirBl";
import ReprésentantRemboursement from "../pages/Représentant/ReprésentantRemboursement/ReprésentantRemboursement";
import ReprésentantDemandeFacturation from "../pages/Représentant/DemandeFacturation/DemandeFacturationPage";
import ReprésentantFactures from "../pages/Représentant/Factures/FacturesPage";
import ReprésentantRembourserFacture from "../pages/Représentant/RembourserFacture/RembourserFacturePage";
import ReprésentantDeclarationDepot from "../pages/Représentant/DeclarationDepot/DeclarationDepotPage";
import ReprésentantCahierTexte from "../pages/Représentant/CahierTexte/CahierTextePage";
import ReprésentantCartesVisite from "../pages/Représentant/CartesVisite/CartesVisitePage";
import ReprésentantSyntheseBL from "../pages/Représentant/SyntheseBL/SyntheseBLPage";
import ReprésentantSyntheseRemboursement from "../pages/Représentant/SyntheseRemboursement/SyntheseRemboursementPage";

import ClientsPage from "../pages/Traçabilité/Clients/ClientsPage";
import BLClientsPage from "../pages/Traçabilité/BLClients/BLClientsPage";
import RemboursementClientPage from "../pages/Traçabilité/RemboursementClient/RemboursementClientPage";
import SyntheseTracabilitePage from "../pages/Traçabilité/Synthèse/SynthesePage";
import ActivitePage from "../pages/Traçabilité/Activite/ActivitePage";

import RobotsPage from "../pages/Robots/RobotsPage";
import RePRobotsPage from "../pages/REP/robots/RePRobotsPage";

import LivraisonFournisseursPage from "../pages/SynthèsesGlobales/LivraisonFournisseurs/LivraisonFournisseursPage";
import LivraisonREPPage from "../pages/SynthèsesGlobales/LivraisonREP/LivraisonREPPage";
import VentesPage from "../pages/SynthèsesGlobales/Ventes/VentesPage";
import DepotPage from "../pages/SynthèsesGlobales/Dépôt/DepotPage";
import RemboursementFournisseursPage from "../pages/SynthèsesGlobales/RemboursementFournisseurs/RemboursementFournisseursPage";
import RemboursementREPPage from "../pages/SynthèsesGlobales/RemboursementREP/RemboursementREPPage";
import BalancePage from "../pages/SynthèsesGlobales/Balance/BalancePage";

import SimpleEmailPage from "../pages/Emailing/SimpleEmail/SimpleEmailPage";
import InvitationPage from "../pages/Emailing/Invitation/InvitationPage";
import SaisonTravailPage from "../pages/Réglages/SaisonTravail/SaisonTravailPage";
import PiedDeFacturePage from "../pages/Réglages/PiedDeFacture/PiedDeFacturePage";
import ModelesCahierTextePage from "../pages/Réglages/ModelesCahierTexte/ModelesCahierTextePage";

// REPRESENTANT PAGES
import RepHomePage from "../pages/REP/home/home";
import RepBLPage from "../pages/REP/BL/RepBLPage";
import RepRembBLPage from "../pages/REP/BL/RepRembBLPage";
import RepSyntheseBLPage from "../pages/REP/BL/RepSyntheseBLPage";
import RepFactureMSMPage from "../pages/REP/factures/RepFactureMSMPage";
import RepFactureWataniyaPage from "../pages/REP/factures/RepFactureWataniyaPage";
import RepClientsPage from "../pages/REP/clients/RepClientsPage";
import RepSaisirBLClientPage from "../pages/REP/clients/RepSaisirBLClientPage";
import RepRembClientPage from "../pages/REP/clients/RepRembClientPage";
import RepSyntheseBLClientPage from "../pages/REP/clients/RepSyntheseBLClientPage";
import RepSyntheseRembClientPage from "../pages/REP/clients/RepSyntheseRembClientPage";
import RepDepotPage from "../pages/REP/depot/RepDepotPage";
import RepCahierCommanderPage from "../pages/REP/cahier_texte/RepCahierCommanderPage";
import RepCahierSuiviPage from "../pages/REP/cahier_texte/RepCahierSuiviPage";
import RepCartesCommanderPage from "../pages/REP/cartes_visite/RepCartesCommanderPage";
import RepCartesSuiviPage from "../pages/REP/cartes_visite/RepCartesSuiviPage";
import RepProfilPage from "../pages/REP/profil/RepProfilPage";
import { useEffect, useRef } from "react";
import seasonsService from "../api/services/seasonsService";


export const AppRoutes = () => {
    const { user, isAdminMode, activeSeason, loadActiveSeason } = useAppStore();

    /**
     * URL CASING CONVENTION:
     *  - Admin portal:          /dash/...          (all lowercase)
     *  - Representative portal: /REP/dash/...      (uppercase REP root, nested paths lowercase)
     */
    useEffect(() => {
        if (!user || activeSeason) return;
        loadActiveSeason();
    }, [user, activeSeason, loadActiveSeason]);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* REPRESENTANT ROUTES */}
            <Route
                path="/REP/dash"
                element={
                    <ProtectedRoute role="rep">
                        <HeaderPages role="rep" />
                    </ProtectedRoute>
                }
            >
                <Route path="home" element={<RepHomePage />} />

                <Route path="bl" element={<Outlet />}>
                    <Route path="bl" element={<RepBLPage />} />
                    <Route path="remb" element={<RepRembBLPage />} />
                    <Route path="sbl" element={<RepSyntheseBLPage />} />
                    <Route index element={<Navigate to="bl" replace />} />
                </Route>

                <Route path="factures" element={<Outlet />}>
                    <Route path="msm" element={<RepFactureMSMPage />} />
                    <Route path="wataniya" element={<RepFactureWataniyaPage />} />
                    <Route index element={<Navigate to="msm" replace />} />
                </Route>

                <Route path="clients" element={<Outlet />}>
                    <Route path="ajouter_client" element={<RepClientsPage />} />
                    <Route path="saisir_un_bl" element={<RepSaisirBLClientPage />} />
                    <Route path="remboursement" element={<RepRembClientPage />} />
                    <Route path="synthese_bl" element={<RepSyntheseBLClientPage />} />
                    <Route path="synthese_remboursement" element={<RepSyntheseRembClientPage />} />
                    <Route path="syntheses_globales" element={<Outlet />}>
                        <Route path="livraison_clients" element={<RepSyntheseBLClientPage />} />
                        <Route path="remboursement_clients" element={<RepSyntheseRembClientPage />} />
                        <Route index element={<Navigate to="livraison_clients" replace />} />
                    </Route>
                    <Route index element={<Navigate to="ajouter_client" replace />} />
                </Route>

                <Route path="depot" element={<RepDepotPage />} />

                <Route path="cahier_texte" element={<Outlet />}>
                    <Route path="commander" element={<RepCahierCommanderPage />} />
                    <Route path="suivi" element={<RepCahierSuiviPage />} />
                    <Route index element={<Navigate to="commander" replace />} />
                </Route>

                <Route path="cartes_visite" element={<Outlet />}>
                    <Route path="commander" element={<RepCartesCommanderPage />} />
                    <Route path="suivi" element={<RepCartesSuiviPage />} />
                    <Route index element={<Navigate to="commander" replace />} />
                </Route>

                <Route path="robots" element={<RePRobotsPage />} />
                <Route path="profil" element={<RepProfilPage />} />
                <Route index element={<Navigate to="home" replace />} />
            </Route>

            {/* ADMIN ROUTES */}
            <Route
                path="/dash"
                element={
                    <ProtectedRoute role="admin">
                        <HeaderPages role="admin" />
                    </ProtectedRoute>
                }
            >
                <Route path="home" element={<HomePage />} />

                <Route path="livres" element={<Outlet />}>
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="livres" element={<LivresPage />} />
                    <Route index element={<Navigate to="categories" replace />} />
                </Route>

                <Route path="fournisseurs" element={<Outlet />}>
                    <Route path="fournisseurs_disponibles" element={<FournisseursDisponibles />} />
                    <Route path="saisir_un_bl" element={<FournisseurSaisirBl />} />
                    <Route path="remboursement" element={<FournisseurRemboursement />} />
                    <Route path="synthese_bl" element={<FournisseurSyntheseBL />} />
                    <Route path="synthese_remboursement" element={<FournisseurSyntheseRemboursement />} />
                    <Route index element={<Navigate to="fournisseurs_disponibles" replace />} />
                </Route>

                <Route path="representant" element={<Outlet />}>
                    <Route path="representants_disponibles" element={<ReprésentantDisponibles />} />
                    <Route path="saisir_un_bl" element={<ReprésentantSaisirBl />} />
                    <Route path="remboursement" element={<ReprésentantRemboursement />} />
                    <Route path="demande_facturation" element={<ReprésentantDemandeFacturation />} />
                    <Route path="factures" element={<ReprésentantFactures />} />
                    <Route path="remboursement_factures" element={<ReprésentantRembourserFacture />} />
                    <Route path="declaration_depot" element={<ReprésentantDeclarationDepot />} />
                    <Route path="cahier_texte" element={<ReprésentantCahierTexte />} />
                    <Route path="cartes_visite" element={<ReprésentantCartesVisite />} />
                    <Route path="synthese_bl" element={<ReprésentantSyntheseBL />} />
                    <Route path="synthese_remboursement" element={<ReprésentantSyntheseRemboursement />} />
                    <Route index element={<Navigate to="representants_disponibles" replace />} />
                </Route>

                <Route path="robots" element={<RobotsPage />} />

                <Route path="tracabilite" element={<Outlet />}>
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="bl_clients" element={<BLClientsPage />} />
                    <Route path="remboursement_client" element={<RemboursementClientPage />} />
                    <Route path="activite" element={<ActivitePage />} />
                    <Route path="synthese" element={<SyntheseTracabilitePage />} />
                    <Route index element={<Navigate to="clients" replace />} />
                </Route>

                <Route path="syntheses_globales" element={<Outlet />}>
                    <Route path="livraison_fournisseurs" element={<LivraisonFournisseursPage />} />
                    <Route path="livraison_rep" element={<LivraisonREPPage />} />
                    <Route path="ventes" element={<VentesPage />} />
                    <Route path="depot" element={<DepotPage />} />
                    <Route path="remboursement_fournisseurs" element={<RemboursementFournisseursPage />} />
                    <Route path="remboursement_rep" element={<RemboursementREPPage />} />
                    <Route path="balance" element={<BalancePage />} />
                    <Route index element={<Navigate to="balance" replace />} />
                </Route>

                <Route path="emailing" element={<Outlet />}>
                    <Route path="simple_email" element={<SimpleEmailPage />} />
                    <Route path="invitation" element={<InvitationPage />} />
                    <Route index element={<Navigate to="simple_email" replace />} />
                </Route>

                <Route path="reglages" element={<Outlet />}>
                    <Route path="saison_travail" element={<SaisonTravailPage />} />
                    <Route path="Season_travail" element={<Navigate to="saison_travail" replace />} />
                    <Route path="pied_de_facture" element={<PiedDeFacturePage />} />
                    <Route path="modeles_cahier_texte" element={<ModelesCahierTextePage />} />
                    <Route index element={<Navigate to="saison_travail" replace />} />
                </Route>

                <Route index element={<Navigate to="home" replace />} />
            </Route>

            <Route
                path="/login"
                element={
                    user ? (
                        isAdminMode ?
                            <Navigate to="/dash/home" replace />
                            :
                            <Navigate to="/REP/dash/home" replace />
                    ) : (
                        <LoginPage />
                    )
                }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

const Logout = () => {
    const logout = useAppStore((state) => state.logout);
    const navigate = useNavigate();
    const hasCalledLogout = useRef(false);

    useEffect(() => {
        if (hasCalledLogout.current) return;
        hasCalledLogout.current = true;

        const performLogout = async () => {
            await logout();
            navigate("/login", { replace: true });
        };

        performLogout();
    }, [logout, navigate]);

    return null; // or a spinner
};
