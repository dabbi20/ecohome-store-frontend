# EcoHome Store Frontend

Frontend desarrollado con **React y Vite** para la plataforma **EcoHome
Store**.

La aplicación se conecta con una API REST desarrollada en **Node.js y
Express**, permitiendo autenticación mediante JWT, gestión de productos
según roles de usuario, administración del perfil y comunicación en
tiempo real mediante Socket.IO.

El frontend forma parte de una solución full stack compuesta por:

-   React
-   Node.js
-   Express
-   PostgreSQL
-   JWT
-   Socket.IO

------------------------------------------------------------------------

## Funcionalidades principales

La aplicación implementa:

-   Inicio de sesión y registro de usuarios.
-   Autenticación mediante JWT.
-   Persistencia de sesión mediante `localStorage`.
-   Rutas públicas y protegidas.
-   Control visual basado en roles.
-   Consulta de productos.
-   Creación, actualización y eliminación de productos para
    administradores.
-   Chat interno autenticado.
-   Comunicación en tiempo real mediante Socket.IO.
-   Historial de los últimos 10 mensajes.
-   Persistencia de mensajes mediante PostgreSQL.
-   Comunicación simultánea entre varios usuarios.
-   Perfil del usuario autenticado.
-   Consulta de estadísticas del usuario.
-   Consulta de productos creados por el usuario.
-   Edición de nombre de usuario y correo electrónico.
-   Sincronización del perfil actualizado con `AuthContext` y
    `localStorage`.
-   Cambio de contraseña desde el frontend.
-   Confirmación de nueva contraseña.
-   Manejo de estados de carga, éxito y error.

------------------------------------------------------------------------

## Tecnologías utilizadas

-   React
-   Vite
-   JavaScript
-   Axios
-   React Router DOM
-   Socket.IO Client
-   HTML5
-   CSS3
-   LocalStorage

------------------------------------------------------------------------

## Arquitectura del frontend

El proyecto separa las responsabilidades entre API, componentes,
contexto de autenticación, layouts, páginas, servicios y comunicación en
tiempo real.

``` text
store-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── api.js
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── context/
│   │   ├── authContext.js
│   │   ├── AuthContext.jsx
│   │   ├── AuthProvider.jsx
│   │   └── useAuth.js
│   ├── layouts/
│   │   └── PrivateLayout.jsx
│   ├── pages/
│   │   ├── ChatPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   └── user.service.js
│   ├── socket/
│   │   └── socket.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

------------------------------------------------------------------------

## Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado:

-   Node.js
-   npm
-   Backend de EcoHome Store ejecutándose
-   PostgreSQL configurado para el backend

------------------------------------------------------------------------

## Instalación

### 1. Clonar el repositorio

``` bash
git clone https://github.com/dabbi20/ecohome-store-frontend.git
cd ecohome-store-frontend
```

### 2. Instalar dependencias

``` bash
npm install
```

Principales dependencias:

``` text
axios
react-router-dom
socket.io-client
```

------------------------------------------------------------------------

## Ejecutar el frontend

``` bash
npm run dev
```

Vite iniciará normalmente la aplicación en:

``` text
http://localhost:5173
```

El backend debe estar ejecutándose en:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## Comunicación con la API

Las solicitudes HTTP se realizan mediante Axios desde:

``` text
src/api/api.js
```

El interceptor agrega automáticamente el JWT a las solicitudes
protegidas:

``` javascript
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
```

------------------------------------------------------------------------

## Autenticación

El flujo general es:

``` text
Login / Registro
      ↓
API REST
      ↓
Backend valida credenciales
      ↓
JWT + usuario
      ↓
localStorage
      ↓
AuthContext
      ↓
Rutas privadas
```

El contexto de autenticación mantiene:

-   `token`
-   `user`
-   `login()`
-   `logout()`
-   `updateUser()`
-   `isAuthenticated`

Los componentes acceden al contexto mediante:

``` javascript
useAuth()
```

------------------------------------------------------------------------

## Rutas

### Rutas públicas

``` text
/login
/register
```

### Rutas privadas

``` text
/products
/chat
/profile
```

`ProtectedRoute.jsx` impide acceder a las rutas privadas cuando no
existe una sesión válida.

------------------------------------------------------------------------

## Roles

La aplicación utiliza dos roles:

``` text
admin
cliente
```

### Administrador

Puede:

-   Consultar productos.
-   Crear productos.
-   Editar productos.
-   Eliminar productos.
-   Acceder al chat.
-   Consultar y editar su perfil.
-   Cambiar su contraseña.

### Cliente

Puede:

-   Consultar productos.
-   Acceder al chat.
-   Consultar y editar su perfil.
-   Cambiar su contraseña.

No puede crear, editar ni eliminar productos.

> La validación visual del frontend no reemplaza la seguridad del
> backend. El servidor también valida los permisos y puede responder con
> `403 Forbidden`.

------------------------------------------------------------------------

## Productos

### Listar productos

``` http
GET /products
```

### Crear producto

Disponible para administradores.

``` http
POST /products
```

### Actualizar producto

Disponible para administradores.

``` http
PATCH /products/:id
```

### Eliminar producto

Disponible para administradores.

``` http
DELETE /products/:id
```

El CRUD administrativo se encuentra implementado completamente:

``` text
CREATE  ✅
READ    ✅
UPDATE  ✅
DELETE  ✅
```

------------------------------------------------------------------------

## Perfil del usuario

La página protegida:

``` text
/profile
```

está implementada en:

``` text
src/pages/ProfilePage.jsx
```

Los servicios relacionados se encuentran en:

``` text
src/services/user.service.js
```

### Obtener perfil

``` http
GET /users/me
```

Muestra información como:

-   ID
-   Nombre de usuario
-   Email
-   Rol
-   Fecha de registro

### Estadísticas

``` http
GET /users/me/stats
```

Actualmente permite mostrar la cantidad de productos creados por el
usuario.

### Productos creados por el usuario

``` http
GET /users/me/products
```

### Editar perfil

``` http
PATCH /users/me
```

Permite modificar:

``` text
username
email
```

Después de actualizar correctamente el perfil, React actualiza el estado
de la página y también ejecuta:

``` javascript
updateUser(data.user);
```

De esta forma `AuthContext` y `localStorage` conservan la información
actualizada.

------------------------------------------------------------------------

## Cambio de contraseña

El usuario puede cambiar su contraseña desde su perfil mediante:

``` http
PATCH /users/me/password
```

El formulario solicita:

-   Contraseña actual.
-   Nueva contraseña.
-   Confirmación de nueva contraseña.

Antes de enviar la solicitud, el frontend comprueba que la nueva
contraseña y su confirmación coincidan.

La comunicación se realiza mediante:

``` javascript
changeMyPassword(currentPassword, newPassword);
```

El backend verifica la contraseña actual y almacena el hash de la nueva
contraseña.

------------------------------------------------------------------------

## Chat interno

La aplicación incluye un chat autenticado en tiempo real mediante
**Socket.IO Client**.

Archivo principal:

``` text
src/socket/socket.js
```

La conexión envía el JWT durante el handshake:

``` javascript
io("http://localhost:3000", {
    auth: {
        token
    }
});
```

El backend verifica el token antes de aceptar la conexión.

### Historial

Al entrar al chat, el backend recupera de PostgreSQL los últimos 10
mensajes y los envía mediante:

``` text
message-history
```

### Envío

``` javascript
socket.emit("new-message", {
    text: cleanText
});
```

El backend identifica al usuario, guarda el mensaje y lo distribuye a
los clientes conectados.

### Recepción

``` javascript
socket.on("new-message", ...);
```

Los mensajes aparecen en tiempo real sin recargar la página.

------------------------------------------------------------------------

## Persistencia del chat

Los mensajes se almacenan en PostgreSQL.

``` text
Servidor apagado
      ↓
Servidor reiniciado
      ↓
Usuario vuelve al chat
      ↓
Historial continúa disponible
```

------------------------------------------------------------------------

## Pruebas realizadas

Se verificaron:

-   Login correcto.
-   Registro de usuario.
-   Credenciales incorrectas.
-   Persistencia del token.
-   Rutas protegidas.
-   Redirección de usuarios no autenticados.
-   Consulta de productos.
-   CRUD administrativo de productos.
-   Restricciones según roles.
-   Conexión y autenticación Socket.IO.
-   Historial de mensajes.
-   Envío y recepción de mensajes en tiempo real.
-   Persistencia del chat.
-   Comunicación entre múltiples usuarios.
-   Carga del perfil autenticado.
-   Consulta de estadísticas.
-   Actualización de nombre de usuario.
-   Actualización de email.
-   Manejo de email duplicado.
-   Sincronización con `AuthContext`.
-   Persistencia del perfil actualizado en `localStorage`.
-   Cambio de contraseña.
-   Confirmación de nueva contraseña.
-   Manejo de contraseña actual incorrecta.

------------------------------------------------------------------------

## Estado actual del proyecto

``` text
✅ Registro
✅ Login
✅ JWT
✅ LocalStorage
✅ Context API
✅ React Router
✅ Rutas protegidas
✅ Roles admin / cliente
✅ Axios
✅ Interceptor JWT
✅ Consulta de productos
✅ CRUD administrativo
✅ Socket.IO Client
✅ Chat en tiempo real
✅ Historial de mensajes
✅ Persistencia del chat
✅ Comunicación entre múltiples usuarios
✅ Perfil de usuario
✅ Estadísticas del usuario
✅ Productos creados por usuario
✅ Edición de username y email
✅ Sincronización AuthContext + LocalStorage
✅ Cambio de contraseña
```

------------------------------------------------------------------------

## Integración con la aplicación móvil

El backend de EcoHome Store está preparado para ser consumido tanto por
el frontend React como por la aplicación Flutter.

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

Esto permite reutilizar desde Flutter la lógica de autenticación,
usuarios, productos, perfil y demás servicios proporcionados por la API.

------------------------------------------------------------------------

## Repositorios

### Frontend

https://github.com/dabbi20/ecohome-store-frontend

### Backend

https://github.com/dabbi20/ecohome-store-api

------------------------------------------------------------------------

## Autor

**David Manuel Carrasco Conde**

Proyecto académico desarrollado para EcoHome Store.

Tecnologías principales:

``` text
React
Node.js
Express
PostgreSQL
JWT
Socket.IO
```
