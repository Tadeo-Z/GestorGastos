import { AuthService } from "./auth.service.js";

export class ContactosService {
    #urlService = "http://localhost:3000/api/contacts";
    #authService = new AuthService();

    async obtenerContactos() {
        const token = this.#authService.obtenerToken();

        const res = await fetch(this.#urlService, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al obtener contactos");

        return await res.json();
    }

    async agregarContacto(contactName) {
        const token = this.#authService.obtenerToken();

        const res = await fetch(`http://localhost:3000/api/contacts`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ contactName: contactName }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al agregar contacto");
        }

        return await res.json();
    }

    async eliminarContacto(contactoName) {
        const token = this.#authService.obtenerToken();

        const res = await fetch(`${this.#urlService}/${contactoName}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al eliminar contacto");

        return await res.json();
    }
}