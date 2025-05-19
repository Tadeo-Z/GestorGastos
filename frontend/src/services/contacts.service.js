import { AuthService } from "./auth.service";

export class ContactosService {
    #urlService = "http://localhost:3000/api/contactos";
    #authService = new AuthService();

    async obtenerContactos() {
        const token = this.#authService.obtenerToken();

        const res = await fetch(this.#urlService, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al obtener contactos");

        return await res.json();
    }

    async agregarContacto(contactoId) {
        const token = this.#authService.obtenerToken();

        const res = await fetch(this.#urlService, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contactoId }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al agregar contacto");
        }

        return await res.json();
    }

    async eliminarContacto(contactoId) {
        const token = this.#authService.obtenerToken();

        const res = await fetch(`${this.#urlService}/${contactoId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al eliminar contacto");

        return await res.json();
    }
}