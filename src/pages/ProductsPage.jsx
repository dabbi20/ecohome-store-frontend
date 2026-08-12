import { useEffect, useState } from "react";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../services/product.service.js";

import { useAuth } from "../context/useAuth.js";

export default function ProductsPage() {

    const { user } = useAuth();

    const [products, setProducts] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ========================================
    // CARGAR PRODUCTOS
    // ========================================

    useEffect(() => {

        async function loadProducts() {

            try {

                const data = await getProducts();

                setProducts(data);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Error cargando productos"
                );

            } finally {

                setLoading(false);

            }
        }

        loadProducts();

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
                            ? data.product
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

                setProducts((currentProducts) => [
                    ...currentProducts,
                    data.product
                ]);

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

            <p>
                Usuario: {user?.username}
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
                LISTA DE PRODUCTOS
            ======================================== */}

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

        </div>
    );
}