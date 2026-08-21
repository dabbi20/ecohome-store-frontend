import api from "../api/api.js";

export async function getMyStats() {
    const response = await api.get("/users/me/stats");
    return response.data;
}

export async function getMyProducts() {
    const response = await api.get("/users/me/products");
    return response.data;
}