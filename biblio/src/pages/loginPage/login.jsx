import useAppStore from "../../store/useAppStore";
import LoginForm from "../../components/loginPage/LoginForm";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useState } from "react";

function LoginPage() {
    const { login: setAuthUser, setAdminMode } = useAppStore();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (credentials) => {
        try {
            setError("");

            // 0. Derive the Laravel base origin from the API URL (strip trailing /api if present)
            //    so CSRF works in any environment without code changes.
            const apiBase = (process.env.REACT_APP_API_URL || "").replace(/\/api\/?$/, "");
            await api.get(`${apiBase}/sanctum/csrf-cookie`);

            // 1. Call the backend
            const response = await api.post('/login', {
                username: credentials.login,
                password: credentials.password,
                annee: credentials.annee,
            });

            setAuthUser(response);
            setAdminMode(response.user.role === "admin");

            if (response.user.role === "admin") {
                navigate("/dash/home", { replace: true });
            } else {
                navigate("/REP/dash/home", { replace: true });
            }

        } catch (err) {
            const validationErrors = err.response?.data?.errors;
            if (validationErrors) {
                // Pull the specific string array errors from login or username targets
                const firstError = validationErrors.login?.[0] || validationErrors.username?.[0] || validationErrors.annee?.[0];
                setError(firstError);
            } else {
                setError(err.response?.data?.message || "Identifiants incorrects");
            }
        }
    };

    return (
        <div className="LoginPage min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center px-4">
            <div className="w-full rounded-3xl border border-slate-700/40 bg-slate-900/70 shadow-2xl backdrop-blur-sm">
                <LoginForm onLogIn={handleSubmit} error={error} />
            </div>
        </div>
    );
}

export default LoginPage;
