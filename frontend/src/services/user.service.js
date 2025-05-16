import { AuthService } from "./auth.service.js";
// import bcrypt from 'bcryptjs'; Comentariado pues de momento da error en el front

export class UserService {
    #urlService = 'http://localhost:3000/api/users';
    #authService = new AuthService();
    #registerUrl = 'https://localhost:3000/api/auth/register';

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

    async agregarUsuario(name, paternalSurname, maternalSurname, password) {
        // const hashedPassword = await bcrypt.hash(password, 10); No se puede usar de momento, pues rompe el front

        const nuevoUsuario = {
            name,
            paternalSurname,
            maternalSurname,
            entryDate: new Date().toISOString(),
            password
        };

        let response = await fetch(this.#registerUrl, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al registrar al usuario");
        }

        return await response.json();
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