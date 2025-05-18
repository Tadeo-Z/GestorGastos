import { AuthService } from "./auth.service.js";

export class GroupService {
    #urlService = 'http://localhost:3000/api/groups/';
    #authService = new AuthService();

    async obtenerGrupos() {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService, {
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

    async obtenerGrupo(groupId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + groupId, {
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

    async agregarGrupo(description) {
        const token = this.#authService.obtenerToken();

        const nuevoGrupo = {
            description,
            creationDate: new Date()
        };

        let response = await fetch(this.#urlService, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoGrupo)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async editarGrupo(name, description) {
        const token = this.#authService.obtenerToken();

        const nuevoGrupo = {
            name,
            description
        };

        let response = await fetch(this.#urlService, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoGrupo)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async eliminarGrupo(groupId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + groupId, {
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