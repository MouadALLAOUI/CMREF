import { Outlet, useLocation, Link } from "react-router-dom";
import { HeaderComponent } from "../components/template/header/header";
import useAppStore from "../store/useAppStore";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

const HeaderPages = ({ role }) => {
    const location = useLocation();
    const { selectedSeasons, loading } = useAppStore();

    // Split the pathname and filter out empty strings
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50">
            <HeaderComponent />
            <div className="relative flex-1 m-5 mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-8 max-w-[97%] min-w-[95%]">
                {!loading && selectedSeasons?.length === 0 && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center justify-between shadow-sm animate-pulse">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <p className="font-bold text-sm">Aucune saison active n'est configurée</p>
                                <p className="text-xs text-amber-700">Veuillez configurer et activer une saison de travail dans les réglages pour activer toutes les fonctionnalités et l'isolation des données.</p>
                            </div>
                        </div>
                        {role === "admin" && (
                            <Link to="/dash/reglages/saison_travail" className="text-xs font-bold underline hover:text-amber-950">
                                Configurer maintenant
                            </Link>
                        )}
                    </div>
                )}

                <div className="breadcrumb mb-8 p-3 w-full rounded-lg bg-slate-100/50 border border-slate-200/50">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {/* Static Home Link */}
                            {pathnames.map((value, index) => {
                                const last = index === pathnames.length - 1;
                                const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                                // Capitalize the label for better UI
                                const label = value.charAt(0).toUpperCase() + value.slice(1);

                                return (
                                    <div key={to} className="flex items-center">
                                        <BreadcrumbItem>
                                            {last ? (
                                                <BreadcrumbPage>{label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link to={to}>{label}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </div>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default HeaderPages;
