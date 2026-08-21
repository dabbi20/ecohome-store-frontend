import { useEffect, useState } from "react";

import {
    getMyProfile,
    getMyStats
} from "../services/user.service.js";


export default function ProfilePage() {

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ========================================
    // CARGAR PERFIL Y ESTADÍSTICAS
    // ========================================

    useEffect(() => {

        async function loadProfile() {

            try {

                const profileData = await getMyProfile();

                const statsData = await getMyStats();

                setProfile(profileData);

                setStats(statsData);

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
    // LOADING
    // ========================================

    if (loading) {

        return <p>Cargando perfil...</p>;
    }


    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return <p>{error}</p>;
    }


    // ========================================
    // PERFIL
    // ========================================

    return (

        <div>

            <h1>Mi perfil</h1>

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
                <strong>Fecha de registro:</strong>{" "}
                {profile?.created_at
                    ? new Date(
                        profile.created_at
                    ).toLocaleString()
                    : "No disponible"}
            </p>


            <hr />


            <h2>Estadísticas</h2>

            <p>
                <strong>
                    Productos creados:
                </strong>{" "}

                {stats?.products_created ?? 0}
            </p>

        </div>
    );
}