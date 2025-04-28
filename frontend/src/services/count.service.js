import { AuthService } from "./auth.service.js";

export class CountService {
    #urlService = 'http://localhost:3000/api/counts/';
    #authService = new AuthService();

    async obtenerCuentas() {
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

    async obtenerCuenta(countId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + countId, {
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

    async agregarCuenta(total, startDate, endDate) {
        const token = this.#authService.obtenerToken();

        const nuevaCuenta = {
            total,
            startDate,
            endDate
        };

        let response = await fetch(this.#urlService, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevaCuenta)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async editarCuenta(total, startDate, endDate) {
        const token = this.#authService.obtenerToken();

        const nuevaCuenta = {
            total,
            startDate,
            endDate
        };

        let response = await fetch(this.#urlService, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevaCuenta)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async eliminarCuenta(countId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + countId, {
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