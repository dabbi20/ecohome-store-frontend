import api from "../api/api.js";

export async function loginUser(email, password) {
    const response = await api.post("/auth/login", {
        email,
        password
    });

    return response.data;
}

export async function registerUser(username, email, password) {
    const response = await api.post("/auth/signup", {
        username,
        email,
        password
    });

    return response.data;
}