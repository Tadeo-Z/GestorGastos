import { AuthService } from "./auth.service.js";

export class UserGroupService {
    #urlService = 'http://localhost:3000/api/userGroups/';
    #authService = new AuthService();

    async obtenerUsuarioGrupos() {
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

    async obtenerUsuarioGrupo(userGroupId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + userGroupId, {
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

    async agregarUsuarioGrupo(entryDate, rol, userId, groupId) {
        const token = this.#authService.obtenerToken();

        const nuevoUsuarioGrupo = {
            entryDate,
            rol,
            userId,
            groupId
        };

        let response = await fetch(this.#urlService, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoUsuarioGrupo)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async editarUsuarioGrupo(entryDate, rol) {
        const token = this.#authService.obtenerToken();

        const nuevoUsuarioGrupo = {
            entryDate,
            rol
        };

        let response = await fetch(this.#urlService, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoUsuarioGrupo)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async eliminarUsuarioGrupo(userGroupId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + userGroupId, {
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