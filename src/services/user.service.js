import api from "../api/api.js";


// ========================================
// PERFIL DEL USUARIO
// ========================================

export async function getMyProfile() {

    const response = await api.get(
        "/users/me"
    );

    return response.data;

}


// ========================================
// ESTADÍSTICAS DEL USUARIO
// ========================================

export async function getMyStats() {

    const response = await api.get(
        "/users/me/stats"
    );

    return response.data;

}


// ========================================
// PRODUCTOS DEL USUARIO
// ========================================

export async function getMyProducts() {

    const response = await api.get(
        "/users/me/products"
    );

    return response.data;

}


// ========================================
// ACTUALIZAR PERFIL
// ========================================

export async function updateMyProfile(data) {

    const response = await api.patch(
        "/users/me",
        data
    );

    return response.data;

}

// ========================================
// CAMBIAR CONTRASEÑA
// ========================================

export async function changeMyPassword(
    currentPassword,
    newPassword
) {
    const response = await api.patch(
        "/users/me/password",
        {
            currentPassword,
            newPassword
        }
    );

    return response.data;
}