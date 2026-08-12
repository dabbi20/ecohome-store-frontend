import { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/useAuth.js";
import { createSocket } from "../socket/socket.js";

export default function ChatPage() {

    const { token, user, logout } = useAuth();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const socketRef = useRef(null);

    useEffect(() => {

        const socket = createSocket(token);

        socketRef.current = socket;

        // ========================================
        // CONEXIÓN
        // ========================================

        socket.on("connect", () => {

            console.log(
                "Socket conectado:",
                socket.id
            );

        });

        // ========================================
        // ERROR DE CONEXIÓN
        // ========================================

        socket.on("connect_error", (error) => {

            console.error(
                "Error de conexión Socket.IO:",
                error.message
            );

            setError(error.message);

        });

        // ========================================
        // HISTORIAL
        // ========================================

        socket.on("message-history", (history) => {

            console.log(
                "Historial recibido:",
                history
            );

            setMessages(history);

        });

        // ========================================
        // NUEVO MENSAJE
        // ========================================

        socket.on("new-message", (message) => {

            setMessages((currentMessages) => [
                ...currentMessages,
                message
            ]);

        });

        // ========================================
        // ERROR DE MENSAJE
        // ========================================

        socket.on("message-error", (error) => {

            setError(error.message);

        });

        // ========================================
        // LIMPIEZA
        // ========================================

        return () => {

            socket.disconnect();

        };

    }, [token]);

    function handleSubmit(event) {

        event.preventDefault();

        const cleanText = text.trim();

        if (!cleanText) {
            return;
        }

        socketRef.current.emit(
            "new-message",
            {
                text: cleanText
            }
        );

        setText("");
    }

    return (
        <div>

            <h1>EcoHome Store</h1>

            <h2>Chat interno</h2>

            <p>
                Usuario: {user?.username}
            </p>

            <button onClick={logout}>
                Cerrar sesión
            </button>

            {error && (
                <p>
                    {error}
                </p>
            )}

            <hr />

            <ul>

                {messages.map((message) => (

                    <li key={message.id}>

                        <strong>
                            {message.username}:
                        </strong>

                        {" "}

                        {message.text}

                    </li>

                ))}

            </ul>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    value={text}
                    placeholder="Escribe un mensaje"
                    onChange={(event) =>
                        setText(event.target.value)
                    }
                />

                <button type="submit">
                    Enviar
                </button>

            </form>

        </div>
    );
}