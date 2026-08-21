import { useEffect, useState } from "react";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../services/product.service.js";

import {
    getMyStats,
    getMyProducts
} from "../services/user.service.js";

import { useAuth } from "../context/useAuth.js";


export default function ProductsPage() {

    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [myProducts, setMyProducts] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [userStats, setUserStats] = useState(null);


    // ========================================
    // CARGAR PRODUCTOS Y DATOS DEL USUARIO
    // ========================================

    useEffect(() => {

        async function loadData() {

            try {

                const productsData = await getProducts();

                const statsData = await getMyStats();

                const myProductsData = await getMyProducts();

                setProducts(productsData);

                setUserStats(statsData);

                setMyProducts(myProductsData);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Error cargando información"
                );

            } finally {

                setLoading(false);

            }
        }

        loadData();

    }, []);


    // ========================================
    // PREPARAR EDICIÓN
    // ========================================

    function handleEdit(product) {

        setEditingId(product.id);

        setName(product.name);

        setPrice(product.price);

        setError("");

        setSuccess("");
    }


    // ========================================
    // CREAR O ACTUALIZAR PRODUCTO
    // ========================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");

        try {

            if (editingId) {

                // ========================================
                // ACTUALIZAR
                // ========================================

                const data = await updateProduct(
                    editingId,
                    {
                        name,
                        price
                    }
                );

                setProducts((currentProducts) =>
                    currentProducts.map((product) =>
                        product.id === editingId
                            ? {
                                ...product,
                                ...data.product
                            }
                            : product
                    )
                );

                setMyProducts((currentProducts) =>
                    currentProducts.map((product) =>
                        product.id === editingId
                            ? {
                                ...product,
                                ...data.product
                            }
                            : product
                    )
                );

                setSuccess(
                    "Producto actualizado correctamente"
                );

                setEditingId(null);

            } else {

                // ========================================
                // CREAR
                // ========================================

                const data = await createProduct({
                    name,
                    price
                });

                const newProduct = {
                    ...data.product,
                    created_by_username: user?.username
                };

                setProducts((currentProducts) => [
                    ...currentProducts,
                    newProduct
                ]);

                setMyProducts((currentProducts) => [
                    ...currentProducts,
                    newProduct
                ]);

                // ========================================
                // ACTUALIZAR CONTADOR
                // ========================================

                setUserStats((currentStats) => {

                    if (!currentStats) {
                        return currentStats;
                    }

                    return {
                        ...currentStats,
                        products_created:
                            currentStats.products_created + 1
                    };
                });

                setSuccess(
                    "Producto creado correctamente"
                );
            }

            setName("");
            setPrice("");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Error procesando producto"
            );
        }
    }


    // ========================================
    // ELIMINAR PRODUCTO
    // ========================================

    async function handleDelete(id) {

        const confirmed = window.confirm(
            "¿Seguro que deseas eliminar este producto?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {

            await deleteProduct(id);

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product.id !== id
                )
            );

            const belongsToCurrentUser =
                myProducts.some(
                    (product) => product.id === id
                );

            setMyProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product.id !== id
                )
            );

            // ========================================
            // DISMINUIR CONTADOR
            // ========================================

            if (belongsToCurrentUser) {

                setUserStats((currentStats) => {

                    if (!currentStats) {
                        return currentStats;
                    }

                    return {
                        ...currentStats,
                        products_created: Math.max(
                            0,
                            currentStats.products_created - 1
                        )
                    };
                });
            }

            if (editingId === id) {

                setEditingId(null);

                setName("");

                setPrice("");
            }

            setSuccess(
                "Producto eliminado correctamente"
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Error eliminando producto"
            );
        }
    }


    // ========================================
    // CANCELAR EDICIÓN
    // ========================================

    function handleCancelEdit() {

        setEditingId(null);

        setName("");

        setPrice("");

        setError("");

        setSuccess("");
    }


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return <p>Cargando productos...</p>;
    }


    return (

        <div>

            <h1>EcoHome Store</h1>

            <h2>Productos</h2>


            {/* ========================================
                USUARIO AUTENTICADO + CONTADOR
            ======================================== */}

            <p>
                Usuario: {user?.username}

                {userStats && (
                    <> ({userStats.products_created})</>
                )}
            </p>

            <p>
                Rol: {user?.role}
            </p>


            {/* ========================================
                FORMULARIO SOLO PARA ADMIN
            ======================================== */}

            {user?.role === "admin" && (

                <form onSubmit={handleSubmit}>

                    <div>

                        <label htmlFor="name">
                            Nombre
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />

                    </div>


                    <div>

                        <label htmlFor="price">
                            Precio
                        </label>

                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(event) =>
                                setPrice(event.target.value)
                            }
                            required
                        />

                    </div>


                    <button type="submit">

                        {editingId
                            ? "Actualizar producto"
                            : "Crear producto"}

                    </button>


                    {editingId && (

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                        >
                            Cancelar
                        </button>

                    )}

                </form>
            )}


            {/* ========================================
                MENSAJES
            ======================================== */}

            {error && (
                <p>
                    {error}
                </p>
            )}

            {success && (
                <p>
                    {success}
                </p>
            )}


            <hr />


            {/* ========================================
                TODOS LOS PRODUCTOS
            ======================================== */}

            <h2>Todos los productos</h2>

            {products.length === 0 ? (

                <p>
                    No hay productos disponibles.
                </p>

            ) : (

                <ul>

                    {products.map((product) => (

                        <li key={product.id}>

                            <strong>
                                {product.name}
                            </strong>

                            {" - $"}

                            {product.price}

                            {" - "}

                            <span>
                                Creado por: {
                                    product.created_by_username
                                }
                            </span>


                            {/* ========================
                                BOTONES SOLO PARA ADMIN
                            ======================== */}

                            {user?.role === "admin" && (

                                <>

                                    {" "}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(product)
                                        }
                                    >
                                        Editar
                                    </button>

                                    {" "}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(product.id)
                                        }
                                    >
                                        Eliminar
                                    </button>

                                </>
                            )}

                        </li>
                    ))}

                </ul>
            )}


            <hr />


            {/* ========================================
                PRODUCTOS DEL USUARIO AUTENTICADO
            ======================================== */}

            <h2>Mis productos</h2>

            <p>
                Productos creados: {
                    userStats?.products_created ?? 0
                }
            </p>

            {myProducts.length === 0 ? (

                <p>
                    No has creado productos.
                </p>

            ) : (

                <ul>

                    {myProducts.map((product) => (

                        <li key={product.id}>

                            <strong>
                                {product.name}
                            </strong>

                            {" - $"}

                            {product.price}

                        </li>
                    ))}

                </ul>
            )}

        </div>
    );
}