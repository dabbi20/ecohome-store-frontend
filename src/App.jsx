import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

import PrivateLayout from "./layouts/PrivateLayout.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";


function App() {

    return (
        <Routes>

            {/* ========================================
                RUTA INICIAL
            ======================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/products"
                        replace
                    />
                }
            />


            {/* ========================================
                RUTAS PÚBLICAS
            ======================================== */}

            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                }
            />


            {/* ========================================
                RUTAS PRIVADAS
            ======================================== */}

            <Route
                element={
                    <ProtectedRoute>
                        <PrivateLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/products"
                    element={<ProductsPage />}
                />

                <Route
                    path="/chat"
                    element={<ChatPage />}
                />

                <Route
                    path="/profile"
                    element={<ProfilePage />}
                />

            </Route>


            {/* ========================================
                RUTA NO ENCONTRADA
            ======================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}


export default App;