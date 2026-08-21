EcoHome Store Frontend**
Frontend desarrollado con **React y Vite** para la plataforma
EcoHome Store.
La aplicación se conecta con una API REST desarrollada en Node.js y
Express, permitiendo autenticación mediante JWT, gestión de productos
según roles de usuario y comunicación en tiempo real mediante Socket.IO.
El frontend forma parte de una solución full stack compuesta por:
React
Node.js
Express
PostgreSQL
JWT
Socket.IO
---
Funcionalidades principales**
La aplicación implementa:
Inicio de sesión.
Autenticación mediante JWT.
Persistencia de sesión mediante `localStorage`.
Rutas protegidas.
Control visual basado en roles.
Consulta de productos.
Creación de productos para administradores.
Actualización de productos para administradores.
Eliminación de productos para administradores.
Chat interno autenticado.
Comunicación en tiempo real mediante Socket.IO.
Historial de los últimos 10 mensajes.
Persistencia de mensajes mediante PostgreSQL.
Comunicación simultánea entre varios usuarios.
Perfil del usuario autenticado.
Consulta de estadísticas del usuario.
Consulta de productos creados por el usuario.
Edición de nombre de usuario y correo electrónico.
Sincronización del perfil actualizado con AuthContext y
`localStorage`.
Cambio de contraseña desde el frontend.
Confirmación de nueva contraseña.
Manejo de estados de carga, éxito y error en el perfil.
---
Tecnologías utilizadas**
React
Vite
JavaScript
Axios
React Router DOM
Socket.IO Client
HTML5
CSS3
LocalStorage
---
Arquitectura del frontend**
El proyecto se encuentra organizado separando responsabilidades entre
componentes, páginas, servicios, contexto de autenticación y
comunicación con la API.
``` text

store-frontend/

├── public/

├── src/

│   ├── api/

│   │   └── api.js

│   │

│   ├── assets/

│   │

│   ├── components/

│   │   └── ProtectedRoute.jsx

│   │

│   ├── context/

│   │   ├── authContext.js

│   │   ├── AuthContext.jsx

│   │   └── useAuth.js

│   │

│   ├── pages/

│   │   ├── LoginPage.jsx

│   │   ├── ProductsPage.jsx

│   │   └── ChatPage.jsx

│   │

│   ├── services/

│   │   ├── auth.service.js

│   │   └── product.service.js

│   │

│   ├── socket/

│   │   └── socket.js

│   │

│   ├── App.css

│   ├── App.jsx

│   ├── index.css

│   └── main.jsx

│

├── .gitignore

├── eslint.config.js

├── index.html

├── package.json

├── package-lock.json

├── vite.config.js

└── README.md
```
---
Requisitos previos**
Antes de ejecutar el proyecto es necesario tener instalado:
Node.js
npm
Backend de EcoHome Store ejecutándose
PostgreSQL configurado para el backend
---
Instalación**
1. Clonar el repositorio**
``` bash

git clone https://github.com/dabbi20/ecohome-store-frontend.git
```
Entrar al proyecto:
``` bash

cd ecohome-store-frontend
```
---
2. Instalar dependencias**
``` bash

npm install
```
Las principales dependencias utilizadas son:
``` text

axios

react-router-dom

socket.io-client
```
---
Ejecutar el frontend**
Ejecutar:
``` bash

npm run dev
```
Vite iniciará normalmente la aplicación en:
``` text

http://localhost:5173
```
---
Backend requerido**
El frontend necesita que la API de EcoHome Store esté ejecutándose en:
``` text

http://localhost:3000
```
Por lo tanto, para trabajar correctamente se deben ejecutar
simultáneamente:
``` text

Frontend:

http://localhost:5173

Backend:

http://localhost:3000
```
---
Comunicación con la API**
La comunicación HTTP se realiza mediante Axios.
La configuración principal se encuentra en:
``` text

src/api/api.js
```
Ejemplo:
``` javascript

import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:3000"

});

api.interceptors.request.use(

    (config) => {

        const token =

            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =

                `Bearer ${token}`;

        }

        return config;

    },

    (error) =>

        Promise.reject(error)

);

export default api;
```
El interceptor permite enviar automáticamente el JWT en las solicitudes
protegidas.
---
Autenticación**
La aplicación utiliza JWT para identificar al usuario autenticado.
El proceso general es:
``` text

Login React

    ↓

POST /auth/login

    ↓

Backend valida credenciales

    ↓

Generación JWT

    ↓

React recibe token + usuario

    ↓

localStorage

    ↓

AuthContext
```
---
Persistencia de sesión**
Después de iniciar sesión se almacenan:
``` text

token

user
```
en:
``` text

localStorage
```
Esto permite conservar la sesión incluso después de actualizar la
página.
---
Context API**
La autenticación global se administra mediante:
``` text

src/context/AuthContext.jsx
```
El contexto mantiene:
``` text

token

user

login()

logout()

updateUser()

isAuthenticated
```
Los componentes pueden acceder a estos valores mediante:
``` javascript

useAuth()
```
---
Rutas**
La aplicación utiliza React Router DOM.
Entre las rutas disponibles se encuentran:
``` text

/login

/register

/products

/profile

/chat
```
---
Rutas protegidas**
El componente:
``` text

src/components/ProtectedRoute.jsx
```
verifica si existe una sesión autenticada.
Si el usuario intenta ingresar a una ruta protegida sin token:
``` text

/chat
```
es redirigido automáticamente a:
``` text

/login
```
---
Login**
La pantalla de login permite introducir:
Correo electrónico.
Contraseña.
Después de autenticarse correctamente:
1. React recibe el JWT.
2. Se almacena el token.
3. Se almacena la información del usuario.
4. El usuario obtiene acceso a las rutas protegidas.
---
Roles**
La aplicación utiliza dos roles:
``` text

admin

cliente
```
Administrador**
El administrador puede:
Consultar productos.
Crear productos.
Editar productos.
Eliminar productos.
Acceder al chat.
Cliente**
El cliente puede:
Consultar productos.
Acceder al chat.
No puede:
Crear productos.
Editar productos.
Eliminar productos.
---
Seguridad por roles**
El frontend oculta los controles administrativos cuando el usuario tiene
rol:
``` text

cliente
```
Por ejemplo:
``` javascript

user?.role === "admin"
```
determina si se muestran:
``` text

Crear producto

Editar

Eliminar
```
Es importante aclarar que esta validación visual no reemplaza la
seguridad del backend.
El backend también verifica los permisos y devuelve:
``` text

403 Forbidden
```
cuando un cliente intenta ejecutar directamente una operación reservada
para administradores.
---
Productos**
La aplicación consume los endpoints REST del backend para gestionar
productos.
---
Listar productos**
``` http

GET /products
```
Permite visualizar los productos almacenados en PostgreSQL.
---
Crear producto**
Disponible únicamente para administradores.
``` http

POST /products
```
Ejemplo:
``` json

{

  "name": "Bolsa reutilizable",

  "price": 8.99

}
```
---
Actualizar producto**
Disponible únicamente para administradores.
``` http

PATCH /products/:id
```
La interfaz permite seleccionar un producto mediante:
``` text

Editar
```
Los valores actuales se cargan en el formulario para permitir su
modificación.
---
Eliminar producto**
Disponible únicamente para administradores.
``` http

DELETE /products/:id
```
Antes de eliminar el producto se solicita confirmación al usuario.
---
CRUD implementado**
El frontend implementa completamente:
``` text

CREATE  ✅

READ    ✅

UPDATE  ✅

DELETE  ✅
```
Las operaciones se sincronizan con PostgreSQL mediante el backend.
---
Perfil del usuario
La aplicación incluye una página protegida:
``` text
/profile
```
implementada en:
``` text
src/pages/ProfilePage.jsx
```
La página consume los servicios definidos en:
``` text
src/services/user.service.js
```
y permite consultar y administrar información del usuario autenticado.
Obtener perfil
``` http
GET /users/me
```
Al cargar `ProfilePage`, React solicita los datos del usuario y muestra:
``` text
id
username
email
role
created_at
```
Estadísticas
``` http
GET /users/me/stats
```
Actualmente se muestra la cantidad de productos creados por el usuario:
``` text
products_created
```
Productos del usuario
El servicio también dispone de:
``` http
GET /users/me/products
```
para recuperar los productos asociados al usuario autenticado.
Editar perfil
``` http
PATCH /users/me
```
Desde la interfaz pueden modificarse:
``` text
username
email
```
Ejemplo:
``` javascript
await updateMyProfile({
    username,
    email
});
```
Después de una actualización correcta, la página actualiza su estado
local y también ejecuta:
``` javascript
updateUser(data.user);
```
Esto sincroniza la información global de autenticación y `localStorage`,
evitando que componentes como el `Navbar` sigan mostrando datos
antiguos.
Cambiar contraseña
``` http
PATCH /users/me/password
```
El formulario solicita:
``` text
Contraseña actual
Nueva contraseña
Confirmar nueva contraseña
```
El frontend valida la confirmación antes de enviar la solicitud.
El servicio utiliza:
``` javascript
changeMyPassword(
    currentPassword,
    newPassword
);
```
El backend es responsable de comprobar la contraseña actual y almacenar
de forma segura el nuevo hash.
Estados de interfaz
`ProfilePage` administra estados independientes para:
``` text
loading
saving
error
message
```
Esto permite informar al usuario mientras se cargan datos, se guardan
cambios o ocurre un error.
---
Chat interno**
La aplicación incluye un módulo de chat en tiempo real.
La conexión se realiza mediante:
``` text

Socket.IO Client
```
Archivo responsable:
``` text

src/socket/socket.js
```
---
Autenticación del Socket**
Al crear la conexión Socket.IO se envía el JWT:
``` javascript

io("http://localhost:3000", {

    auth: {

        token

    }

});
```
El backend verifica este token antes de permitir que el usuario se
conecte.
---
Historial de mensajes**
Cuando un usuario entra al chat, el backend consulta PostgreSQL y envía:
``` text

los últimos 10 mensajes
```
mediante el evento:
``` text

message-history
```
React recibe el historial y lo renderiza automáticamente.
---
Envío de mensajes**
Cuando el usuario envía un mensaje:
``` javascript

socket.emit("new-message", {

    text: cleanText

});
```
el backend:
1. Recibe el mensaje.
2. Identifica al usuario mediante el JWT.
3. Guarda el mensaje en PostgreSQL.
4. Envía el mensaje a todos los clientes conectados.
---
Recepción en tiempo real**
Los clientes escuchan:
``` javascript

socket.on("new-message", **...**)
```
De esta manera un mensaje enviado desde un navegador aparece
inmediatamente en los demás usuarios conectados sin recargar la página.
---
Persistencia del chat**
Los mensajes no dependen únicamente de la memoria de Node.js.
Cada mensaje se almacena en PostgreSQL.
Esto permite que:
``` text

Servidor apagado

      ↓

Servidor reiniciado

      ↓

Usuario entra nuevamente

      ↓

Historial continúa disponible
```
---
Prueba con múltiples usuarios**
Se realizaron pruebas utilizando dos sesiones simultáneas:
``` text

Usuario 1:

admin

Usuario 2:

cliente1
```
Se comprobó que:
Ambos usuarios reciben el mismo historial.
Un mensaje enviado por `admin` aparece inmediatamente en `cliente1`.
Un mensaje enviado por `cliente1` aparece inmediatamente en `admin`.
Los mensajes indican correctamente el usuario que los envió.
Los mensajes permanecen después de reiniciar o recargar.
Ejemplo:
``` text

admin: Hola cliente, mensaje desde admin

cliente1: Hola admin, mensaje desde cliente
```
---
Flujo completo del chat**
``` text

React

  ↓

Login

  ↓

JWT

  ↓

Socket.IO Client

  ↓

Handshake con JWT

  ↓

Socket.IO Backend

  ↓

PostgreSQL

  ↓

Guardar mensaje

  ↓

io.emit()

  ↓

Todos los clientes conectados
```
---
Pruebas realizadas**
Se verificaron:
Login correcto.
Credenciales incorrectas.
Persistencia del token.
Acceso protegido al chat.
Redirección de usuarios no autenticados.
Consulta de productos.
Creación de productos.
Actualización de productos.
Eliminación de productos.
Restricción visual según roles.
Restricción real desde el backend.
Conexión Socket.IO.
Autenticación JWT del socket.
Carga de últimos 10 mensajes.
Envío de mensajes.
Recepción de mensajes en tiempo real.
Persistencia de mensajes.
Comunicación entre dos usuarios simultáneos.
Carga del perfil autenticado.
Consulta de estadísticas del usuario.
Actualización de username.
Actualización de email.
Manejo de email duplicado.
Sincronización del usuario actualizado con AuthContext.
Persistencia de los datos actualizados en `localStorage`.
Cambio de contraseña.
Validación de confirmación de nueva contraseña.
Manejo de contraseña actual incorrecta.
---
Estado del proyecto**
Actualmente el frontend permite:
``` text

✅ Login

✅ JWT

✅ LocalStorage

✅ Context API

✅ React Router

✅ Rutas protegidas

✅ Roles admin / cliente

✅ Consulta de productos

✅ CRUD administrativo

✅ Axios

✅ Interceptor JWT

✅ Socket.IO Client

✅ Chat en tiempo real

✅ Historial de mensajes

✅ Persistencia

✅ Comunicación entre múltiples usuarios
✅ Perfil de usuario
✅ GET /users/me
✅ GET /users/me/stats
✅ GET /users/me/products
✅ PATCH /users/me
✅ Edición de username y email
✅ Sincronización AuthContext + LocalStorage
✅ Cambio de contraseña
✅ PATCH /users/me/password
✅ Confirmación de nueva contraseña
✅ Estados de carga, éxito y error
```
---
Integración con backend y aplicación móvil
El frontend React consume la misma API central de EcoHome Store que
puede reutilizarse desde la aplicación móvil Flutter.
``` text
                EcoHome Store API
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        React + Vite          Flutter
             │                   │
             └─────────┬─────────┘
                       ▼
                  PostgreSQL
```
La lógica de autenticación, autorización, productos, perfil,
estadísticas y chat permanece centralizada en el backend.
El frontend web utiliza actualmente:
``` text
Axios       → API REST
Socket.IO   → comunicación en tiempo real
AuthContext → estado global de autenticación
LocalStorage → persistencia de sesión web
```
---
Repositorios**
Frontend**
``` text

https://github.com/dabbi20/ecohome-store-frontend
```
Backend**
``` text

https://github.com/dabbi20/ecohome-store-api
```
---
Autor**
David Manuel Carrasco Conde Proyecto académico desarrollado para EcoHome
Store.
Tecnologías principales:
``` text

React

Node.js

Express

PostgreSQL

JWT

Socket.IO
```