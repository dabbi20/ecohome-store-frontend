import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PrivateLayout from "./layouts/PrivateLayout.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";


function RegisterPage() {
    return <h1>Registro - EcoHome Store</h1>;
}


function App() {

    return (
        <Routes>

            {/* ========================================
                RUTAS PÚBLICAS
            ======================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/register"
                element={<RegisterPage />}
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

        </Routes>
    );
}


export default App;