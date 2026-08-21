import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function Navbar() {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();

    function handleLogout() {

        logout();

        navigate("/login");
    }

    return (
        <nav>

            <h2>EcoHome Store</h2>

            <div>
                <Link to="/products">
                    Productos
                </Link>

                {" | "}

                <Link to="/profile">
                    Mi perfil
                </Link>

                {" | "}

                <Link to="/chat">
                    Chat
                </Link>
            </div>

            {user && (
                <div>
                    <span>
                        Usuario: {user.username}
                    </span>

                    {" "}

                    <button onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            )}

        </nav>
    );
}