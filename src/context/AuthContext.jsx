import { useState } from "react";
import { loginUser } from "../services/auth.service.js";
import AuthContext from "./authContext.js";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    async function login(email, password) {
        const data = await loginUser(email, password);

        setToken(data.token);
        setUser(data.user);

        localStorage.setItem("token", data.token);
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        return data;
    }

    function logout() {
        setToken(null);
        setUser(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}