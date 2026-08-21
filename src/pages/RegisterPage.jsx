import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/auth.service.js";

export default function RegisterPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await registerUser(
                username,
                email,
                password
            );

            navigate("/login");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Error al registrar usuario"
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <div>

            <h1>EcoHome Store</h1>

            <h2>Crear cuenta</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="username">
                        Nombre de usuario
                    </label>

                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        required
                    />
                </div>

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
                        ? "Registrando..."
                        : "Crear cuenta"}
                </button>

            </form>

            <p>
                ¿Ya tienes una cuenta?{" "}

                <Link to="/login">
                    Iniciar sesión
                </Link>
            </p>

        </div>
    );
}