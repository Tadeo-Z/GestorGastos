export class AuthService {
    #urlService = 'http://localhost:3000/api/auth/login/';

    async iniciarSesion(name, password) {
        try {
            const response = await fetch(this.#urlService, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password})
            });

            if(!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Error al iniciar sesión");
            }

            alert("Inicio de sesión exitoso");
            const data = await response.json();

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

            return data;
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            throw error;
        }
    }

    obtenerToken() {
        return localStorage.getItem('authToken');
    }

    cerrarSesion() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
    }

    estaAutenticado() {
        return !!this.obtenerToken();
    }
}