import { AuthService } from "./auth.service.js";

export class UserService {
    #urlService = 'http://localhost:3000/users';
    #authService = new AuthService();

    async obtenerUsuarios() {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async obtenerUsuario(userId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + userId, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async agregarUsuario(name, paternalSurname, maternalSurname, entryDate, password) {
        const token = this.#authService.obtenerToken();

        const nuevoUsuario = {
            name,
            paternalSurname,
            maternalSurname,
            entryDate,
            password
        };

        let response = await fetch(this.#urlService, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async editarUsuario(name, paternalSurname, maternalSurname, entryDate, password) {
        const token = this.#authService.obtenerToken();

        const nuevoUsuario = {
            name,
            paternalSurname,
            maternalSurname,
            entryDate,
            password
        };

        let response = await fetch(this.#urlService, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async eliminarUsuario(userId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + userId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }
}