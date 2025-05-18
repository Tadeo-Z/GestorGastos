export class AuthService {
  #baseUrl = "http://localhost:3000/api/users";

  async iniciarSesion(name, password) {
    try {
      const response = await fetch(`${this.#baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al iniciar sesión");
      }

      const { token, usuario } = await response.json();
      alert("Inicio de sesión exitoso");

      localStorage.setItem("authToken", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("userId", usuario.id)

      return { token, usuario };
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw new Error(error.message || "Error de conexion con el servidor");
    }
  }

  async registrarUsuario(userData) {
    try {
      const response = await fetch(`${this.#baseUrl}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrar usuario");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al registrar: ", error);
      throw error;
    }
  }

  obtenerToken() {
    return localStorage.getItem("authToken");
  }

  cerrarSesion() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
    document.dispatchEvent(new CustomEvent("logout"));
  }

  estaAutenticado() {
    return !!this.obtenerToken();
  }
}
