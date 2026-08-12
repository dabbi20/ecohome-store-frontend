import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function LoginPage() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email, password);

            navigate("/chat");

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Error al iniciar sesión"
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>EcoHome Store</h1>

            <h2>Iniciar sesión</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="email">
                        Correo electrónico
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && (
                    <p>{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Ingresando..."
                        : "Ingresar"}
                </button>

            </form>
        </div>
    );
}