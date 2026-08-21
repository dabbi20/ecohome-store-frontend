import { useEffect, useState } from "react";

import {
    getMyProfile,
    getMyStats,
    updateMyProfile,
    changeMyPassword
} from "../services/user.service.js";

import { useAuth } from "../context/useAuth.js";

export default function ProfilePage() {

    // ========================================
    // AUTH CONTEXT
    // ========================================

    const { updateUser } = useAuth();


    // ========================================
    // ESTADOS DEL PERFIL
    // ========================================

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // ========================================
    // ESTADOS PARA CAMBIAR CONTRASEÑA
    // ========================================

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [
        changingPassword,
        setChangingPassword
    ] = useState(false);

    const [
        passwordError,
        setPasswordError
    ] = useState("");

    const [
        passwordMessage,
        setPasswordMessage
    ] = useState("");


    // ========================================
    // CARGAR PERFIL Y ESTADÍSTICAS
    // ========================================

    useEffect(() => {

        async function loadProfile() {

            try {

                const profileData =
                    await getMyProfile();

                const statsData =
                    await getMyStats();

                setProfile(profileData);
                setStats(statsData);

                // Cargar datos actuales
                // en el formulario

                setUsername(
                    profileData.username
                );

                setEmail(
                    profileData.email
                );

            } catch (error) {

                console.error(
                    "Error cargando perfil:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Error cargando el perfil"
                );

            } finally {

                setLoading(false);

            }
        }

        loadProfile();

    }, []);


    // ========================================
    // ACTUALIZAR PERFIL
    // ========================================

    async function handleUpdateProfile(event) {

        event.preventDefault();

        setError("");
        setMessage("");
        setSaving(true);

        try {

            const data =
                await updateMyProfile({
                    username,
                    email
                });


            // ========================================
            // ACTUALIZAR DATOS DE LA PÁGINA
            // ========================================

            setProfile(data.user);

            setUsername(
                data.user.username
            );

            setEmail(
                data.user.email
            );


            // ========================================
            // ACTUALIZAR AUTH CONTEXT + LOCALSTORAGE
            // ========================================

            updateUser(data.user);


            // ========================================
            // MENSAJE DE ÉXITO
            // ========================================

            setMessage(
                data.message ||
                "Perfil actualizado correctamente"
            );

        } catch (error) {

            console.error(
                "Error actualizando perfil:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Error actualizando el perfil"
            );

        } finally {

            setSaving(false);

        }
    }


    // ========================================
    // CAMBIAR CONTRASEÑA
    // ========================================

    async function handleChangePassword(event) {

        event.preventDefault();

        setPasswordError("");
        setPasswordMessage("");


        // ========================================
        // VALIDAR CONTRASEÑAS
        // ========================================

        if (newPassword !== confirmPassword) {

            setPasswordError(
                "Las nuevas contraseñas no coinciden"
            );

            return;
        }


        // ========================================
        // VALIDAR LONGITUD
        // ========================================

        if (newPassword.length < 8) {

            setPasswordError(
                "La nueva contraseña debe tener al menos 8 caracteres"
            );

            return;
        }


        // ========================================
        // EVITAR MISMA CONTRASEÑA
        // ========================================

        if (currentPassword === newPassword) {

            setPasswordError(
                "La nueva contraseña debe ser diferente a la actual"
            );

            return;
        }


        setChangingPassword(true);


        try {

            const data =
                await changeMyPassword(
                    currentPassword,
                    newPassword
                );


            // ========================================
            // MENSAJE DE ÉXITO
            // ========================================

            setPasswordMessage(
                data.message ||
                "Contraseña actualizada correctamente"
            );


            // ========================================
            // LIMPIAR FORMULARIO
            // ========================================

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {

            console.error(
                "Error cambiando contraseña:",
                error
            );

            setPasswordError(
                error.response?.data?.message ||
                "Error cambiando la contraseña"
            );

        } finally {

            setChangingPassword(false);

        }
    }


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <p>
                Cargando perfil...
            </p>
        );
    }


    // ========================================
    // ERROR INICIAL
    // ========================================

    if (error && !profile) {

        return (
            <p>
                {error}
            </p>
        );
    }


    // ========================================
    // PERFIL
    // ========================================

    return (

        <div>

            <h1>
                Mi perfil
            </h1>


            {/* ========================================
                INFORMACIÓN DEL USUARIO
            ======================================== */}

            <p>
                <strong>ID:</strong>{" "}
                {profile?.id}
            </p>

            <p>
                <strong>Usuario:</strong>{" "}
                {profile?.username}
            </p>

            <p>
                <strong>Email:</strong>{" "}
                {profile?.email}
            </p>

            <p>
                <strong>Rol:</strong>{" "}
                {profile?.role}
            </p>

            <p>
                <strong>
                    Fecha de registro:
                </strong>{" "}

                {profile?.created_at
                    ? new Date(
                        profile.created_at
                    ).toLocaleString()
                    : "No disponible"}
            </p>


            <hr />


            {/* ========================================
                ESTADÍSTICAS
            ======================================== */}

            <h2>
                Estadísticas
            </h2>

            <p>
                <strong>
                    Productos creados:
                </strong>{" "}

                {stats?.products_created ?? 0}
            </p>


            <hr />


            {/* ========================================
                EDITAR PERFIL
            ======================================== */}

            <h2>
                Editar perfil
            </h2>


            <form onSubmit={handleUpdateProfile}>

                <div>

                    <label htmlFor="username">
                        Nombre de usuario
                    </label>

                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) =>
                            setUsername(
                                event.target.value
                            )
                        }
                        required
                    />

                </div>


                <div>

                    <label htmlFor="email">
                        Correo electrónico
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        required
                    />

                </div>


                {error && (
                    <p>
                        {error}
                    </p>
                )}


                {message && (
                    <p>
                        {message}
                    </p>
                )}


                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Guardando..."
                        : "Guardar cambios"}
                </button>

            </form>


            <hr />


            {/* ========================================
                CAMBIAR CONTRASEÑA
            ======================================== */}

            <h2>
                Cambiar contraseña
            </h2>


            <form onSubmit={handleChangePassword}>

                {/* CONTRASEÑA ACTUAL */}

                <div>

                    <label htmlFor="currentPassword">
                        Contraseña actual
                    </label>

                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                            setCurrentPassword(
                                event.target.value
                            )
                        }
                        required
                    />

                </div>


                {/* NUEVA CONTRASEÑA */}

                <div>

                    <label htmlFor="newPassword">
                        Nueva contraseña
                    </label>

                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(
                                event.target.value
                            )
                        }
                        required
                    />

                </div>


                {/* CONFIRMAR CONTRASEÑA */}

                <div>

                    <label htmlFor="confirmPassword">
                        Confirmar nueva contraseña
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        required
                    />

                </div>


                {/* MENSAJE DE ERROR */}

                {passwordError && (

                    <p>
                        {passwordError}
                    </p>

                )}


                {/* MENSAJE DE ÉXITO */}

                {passwordMessage && (

                    <p>
                        {passwordMessage}
                    </p>

                )}


                {/* BOTÓN */}

                <button
                    type="submit"
                    disabled={changingPassword}
                >

                    {changingPassword
                        ? "Cambiando..."
                        : "Cambiar contraseña"}

                </button>

            </form>

        </div>
    );
}