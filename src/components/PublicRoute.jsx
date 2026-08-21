import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth.js";


export default function PublicRoute({ children }) {

    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <Navigate
                to="/products"
                replace
            />
        );
    }

    return children;
}