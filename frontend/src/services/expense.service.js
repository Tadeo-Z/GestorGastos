import { AuthService } from "./auth.service.js";

export class ExpenseService {
    #urlService = 'http://localhost:3000/api/expenses/';
    #urlPayService = '/pay'
    #authService = new AuthService();

    async obtenerGastos() {
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

    async obtenerGasto(expenseId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + expenseId, {
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

    async agregarGasto(amount, quoteDate, paid, userId, countId) {
        const token = this.#authService.obtenerToken();

        const nuevoGasto = {
            amount,
            quoteDate,
            paid,
            userId,
            countId
        };

        let response = await fetch(this.#urlService, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoGasto)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async editarGasto(amount, quoteDate, paid, userId, countId) {
        const token = this.#authService.obtenerToken();

        const nuevoGasto = {
            amount,
            quoteDate,
            paid,
            userId,
            countId
        };

        let response = await fetch(this.#urlService, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(nuevoGasto)
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }

    async eliminarGasto(expenseId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + expenseId, {
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

    async pagarGasto(expenseId) {
        const token = this.#authService.obtenerToken();

        let response = await fetch(this.#urlService + expenseId + this.#urlPayService, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let json = await response.json();
        return json;
    }
}