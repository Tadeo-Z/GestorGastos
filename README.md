# Gestor de Gastos API REST

## 🎯 Proyecto de API RESTful

**Gestor de Gastos** es un proyecto diseñado para facilitar la gestión de usuarios, grupos, cuentas y gastos a través de una API completamente funcional. El proyecto cuenta con autenticación mediante JWT, validación robusta de entradas y manejo avanzado de errores. 🚀

---

## 🔗 Colección Postman

Hemos preparado una colección de Postman para que interactúes fácilmente con nuestra API. La colección está organizada por recursos y contiene ejemplos de todas las operaciones CRUD.

### **Acceso a la colección:**
[👉 Haz clic aquí para acceder a la colección Postman](https://app.getpostman.com/join-team?invite_code=c9546828a3f308c641acca9108aae33135705436f62bce3bde11e5521cc15538)

---

## 🛠️ Funcionalidades principales

1. **Gestión de usuarios:** Operaciones CRUD para administrar usuarios.
2. **Gestión de grupos:** Maneja grupos asociados a los usuarios.
3. **Gestión de gastos:** Registra y gestiona gastos con facilidad.
4. **Autenticación segura:** Implementada con JWT para proteger rutas sensibles.
5. **Validación avanzada:** Asegura que las solicitudes REST cumplan con los requisitos.
6. **Manejo de errores:** Middleware global para responder con códigos y mensajes adecuados.

---

## 🚀 Cómo empezar

### **Requisitos:**
Asegúrate de tener instalados los siguientes paquetes antes de comenzar:
- [Node.js](https://nodejs.org/) - Entorno de ejecución para JavaScript.
- `npm` - Administrador de paquetes (viene con Node.js).
- **Instalar dependencias esenciales:**
  - `express`:
    ```bash
    npm install express
    ```
  - **Sequelize y MySQL2:** Para la conexión a la base de datos.
    ```bash
    npm install sequelize mysql2
    ```
  - **dotenv:** Para gestionar variables de entorno.
    ```bash
    npm install dotenv
    ```
  - **jsonwebtoken:** Para la autenticación JWT.
    ```bash
    npm install jsonwebtoken
    ```
  - **express-validator:** Para validación de entradas.
    ```bash
    npm install express-validator
    ```
  - **winston:** Para el manejo de logs.
    ```bash
    npm install winston
    ```
  - **morgan:** Para registrar solicitudes HTTP.
    ```bash
    npm install morgan
    ```

### **Configuración del proyecto:**
1. Configura la conexión a la base de datos en `config/db.js`.
2. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000
   JWT_SECRET=tu_secreto_jwt
   JWT_EXPIRES_IN=1h
