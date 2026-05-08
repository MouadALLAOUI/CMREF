import useAppStore from "../../store/useAppStore";
import LoginForm from "../../components/loginPage/LoginForm";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useState } from "react";
import logger from "../../lib/logger";

function LoginPage() {
    const { login: setAuthUser, setAdminMode } = useAppStore();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (credentials) => {
        try {
            setError("");

            // 0. Get CSRF cookie. This is a web route, so we call it directly without the /api prefix.
            await api.get('http://localhost:8000/sanctum/csrf-cookie');

            // 1. Call the backend
            const response = await api.post('/login', {
                username: credentials.login,
                password: credentials.password,
            });

            logger({ res: response.user })
            setAuthUser(response);
            setAdminMode(response.user.role === "admin");

            if (response.user.role === "admin") {
                navigate("/dash/home", { replace: true });
            } else {
                navigate("/rep/dash/home", { replace: true });
            }

        } catch (err) {
            logger({ credentials })
            console.error("Login Error:", err.response || err);
            setError(err.response?.data?.message || "Identifiants incorrects");
        }
    };

    return (
        <div className="LoginPage min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-5xl rounded-3xl border border-slate-700/40 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-sm md:p-8">
                <LoginForm onLogIn={handleSubmit} error={error} />
            </div>
        </div>
    );
}

export default LoginPage;
