import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";

function RegisterPage() {
    return <h1>Registro - EcoHome Store</h1>;
}





function App() {
    return (
        <Routes>

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

            <Route
                path="/products"
                element={<ProductsPage />}
            />

            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;