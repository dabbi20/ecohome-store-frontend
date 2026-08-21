import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";


export default function PrivateLayout() {

    return (
        <div>

            {/* ========================================
                NAVEGACIÓN PRIVADA
            ======================================== */}

            <Navbar />


            {/* ========================================
                CONTENIDO DE LA PÁGINA ACTUAL
            ======================================== */}

            <main>
                <Outlet />
            </main>

        </div>
    );
}