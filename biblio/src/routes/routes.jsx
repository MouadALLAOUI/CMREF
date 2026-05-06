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

import RobotsPage from "../pages/Robots/RobotsPage";

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
import { useEffect, useRef } from "react";

export const AppRoutes = () => {
    const { user, isAdminMode } = useAppStore();

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* REPRESENTANT ROUTES */}
            <Route
                path="/REP/dash"
                element={
                    <HeaderPages role="rep" />
                }
            >

                <Route path="home" element={<RepHomePage />} />

                <Route path="bl" element={<Outlet />}>
                    <Route path="BL" element={<div>/REP/dash/bl/BL</div>} />
                    <Route path="Remb" element={<div>/REP/dash/bl/Remb</div>} />
                    <Route path="SBl" element={<div>/REP/dash/bl/SBl</div>} />
                    <Route index element={<Navigate to="bl" replace />} />
                </Route>

                <Route path="factures" element={<Outlet />}>
                    <Route path="msm" element={<div>/REP/dash/factures/msm</div>} />
                    <Route path="wataniya" element={<div>/REP/dash/factures/wataniya</div>} />
                    <Route index element={<Navigate to="factures" replace />} />
                </Route>

                <Route path="Clients" element={<Outlet />}>
                    <Route path="ajouter_client" element={<div>/REP/dash/Clients/ajouter_client</div>} />
                    <Route path="Saisir_un_BL" element={<div>/REP/dash/Clients/Saisir_un_BL</div>} />
                    <Route path="Remboursement" element={<div>/REP/dash/Clients/Remboursement</div>} />
                    <Route path="Synthese_BL" element={<div>/REP/dash/Clients/Synthese_BL</div>} />
                    <Route path="Synthese_Remboursement" element={<div>/REP/dash/Clients/Synthese_Remboursement</div>} />
                    <Route path="syntheses_globales" element={<Outlet />}>
                        <Route path="Livraison_clients" element={<div>/REP/dash/Clients/syntheses_globales/Livraison_clients</div>} />
                        <Route path="Remboursement_clients" element={<div>/REP/dash/Clients/syntheses_globales/Remboursement_clients</div>} />
                        <Route index element={<Navigate to="syntheses_globales" replace />} />
                    </Route>
                    <Route index element={<Navigate to="Clients" replace />} />
                </Route>

                <Route path="depot" element={<div>/REP/dash/depot</div>} />

                <Route path="cahier_texte" element={<Outlet />}>
                    <Route path="commander" element={<div>/REP/dash/cahier_texte/commander</div>} />
                    <Route path="suivi" element={<div>/REP/dash/cahier_texte/suivi</div>} />
                    <Route index element={<Navigate to="cahier_texte" replace />} />
                </Route>

                <Route path="cartes_visits" element={<Outlet />}>
                    <Route path="commander" element={<div>/REP/dash/cartes_visits/commander</div>} />
                    <Route path="suivi" element={<div>/REP/dash/cartes_visits/suivi</div>} />
                    <Route index element={<Navigate to="cartes_visits" replace />} />
                </Route>

                <Route path="robots" element={<div>/REP/dash/robots</div>} />

                <Route path="profil" element={<div>/REP/dash/profil</div>} />

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
                    <Route path="Fournisseurs_disponibles" element={<FournisseursDisponibles />} />
                    <Route path="Saisir_un_BL" element={<FournisseurSaisirBl />} />
                    <Route path="Remboursement" element={<FournisseurRemboursement />} />
                    <Route path="Synthese_BL" element={<FournisseurSyntheseBL />} />
                    <Route path="Synthese_Remboursement" element={<FournisseurSyntheseRemboursement />} />
                    <Route index element={<Navigate to="Fournisseurs_disponibles" replace />} />
                </Route>

                <Route path="representant" element={<Outlet />}>
                    <Route path="Representants_disponibles" element={<ReprésentantDisponibles />} />
                    <Route path="Saisir_un_BL" element={<ReprésentantSaisirBl />} />
                    <Route path="Remboursement" element={<ReprésentantRemboursement />} />
                    <Route path="Demande_facturation" element={<ReprésentantDemandeFacturation />} />
                    <Route path="Factures" element={<ReprésentantFactures />} />
                    <Route path="Remboursement_Factures" element={<ReprésentantRembourserFacture />} />
                    <Route path="Declaration_Depot" element={<ReprésentantDeclarationDepot />} />
                    <Route path="Cahier_texte" element={<ReprésentantCahierTexte />} />
                    <Route path="Cartes_Visite" element={<ReprésentantCartesVisite />} />
                    <Route path="Synthese_BL" element={<ReprésentantSyntheseBL />} />
                    <Route path="Synthese_Remboursement" element={<ReprésentantSyntheseRemboursement />} />
                    <Route index element={<Navigate to="Representants_disponibles" replace />} />
                </Route>
                <Route path="robots" element={<RobotsPage />} />

                <Route path="tracabilite" element={<Outlet />}>
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="BL_Clients" element={<BLClientsPage />} />
                    <Route path="Remboursement_Client" element={<RemboursementClientPage />} />
                    <Route path="Synthese" element={<SyntheseTracabilitePage />} />
                    <Route index element={<Navigate to="clients" replace />} />
                </Route>

                <Route path="syntheses_globales" element={<Outlet />}>
                    <Route path="Livraison_Fournisseurs" element={<LivraisonFournisseursPage />} />
                    <Route path="Livraison_REP" element={<LivraisonREPPage />} />
                    <Route path="Ventes" element={<VentesPage />} />
                    <Route path="Depot" element={<DepotPage />} />
                    <Route path="Remboursement_Fournisseurs" element={<RemboursementFournisseursPage />} />
                    <Route path="Remboursement_REP" element={<RemboursementREPPage />} />
                    <Route path="Balance" element={<BalancePage />} />
                    <Route index element={<Navigate to="Balance" replace />} />
                </Route>

                <Route path="emailing" element={<Outlet />}>
                    <Route path="Simple_Email" element={<SimpleEmailPage />} />
                    <Route path="Invitation" element={<InvitationPage />} />
                    <Route index element={<Navigate to="Simple_Email" replace />} />
                </Route>

                <Route path="reglages" element={<Outlet />}>
                    <Route path="Season_travail" element={<SaisonTravailPage />} />
                    <Route path="Pied_de_facture" element={<PiedDeFacturePage />} />
                    <Route path="Modeles_Cahier_texte" element={<ModelesCahierTextePage />} />
                    <Route index element={<Navigate to="Season_travail" replace />} />
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
