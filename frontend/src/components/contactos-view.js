import { UserService } from "../services/user.service.js";
import { ContactosService } from "../services/contacts.service.js";

export class ContactosView extends HTMLElement {
  #userService = new UserService();
  #contactosService = new ContactosService();

  connectedCallback() {
    this.render();
    this.loadContactos();
    this.addListeners();
  }

  render() {
    this.innerHTML = `
        <section class="contactos-container">
          <header id="contactos-header">
            <h1>Contactos</h1>
            <button id="crearGrupoBtn">+ Agregar Contacto</button>
          </header>
  
          <dialog id="dialogAgregarContacto">
            <span class="close-modal" title="Cerrar">&times;</span>
            <form id="formBuscarContacto">
              <h2>Buscar Usuario</h2>
              <input type="text" id="buscarInput" placeholder="Buscar usuario..." required />
              <button type="submit">Buscar</button>
            </form>
            <div id="resultadoBusqueda" class="resultado-busqueda"></div>
            <button id="cancelarCrear" type="button">Cancelar</button>
          </dialog>

          <h2>Mis Contactos</h2>
          <div id="listaContactos" class="contacto-list"></div>
        </section>
      `;
  }

  addListeners() {
    const dialog = this.querySelector("#dialogAgregarContacto");

    this.querySelector("#crearGrupoBtn").addEventListener("click", () => {
      dialog.showModal();
      this.querySelector("#resultadoBusqueda").innerHTML = "";
      this.querySelector("#buscarInput").value = "";
      this.querySelector("#buscarInput").focus();
    });

    this.querySelector(".close-modal").addEventListener("click", () => {
      dialog.close();
    });

    this.querySelector("#cancelarCrear").addEventListener("click", () => {
      dialog.close();
    });

    this.querySelector("#formBuscarContacto").addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();
        const nombre = this.querySelector("#buscarInput").value.trim();
        if (nombre) {
          await this.buscarUsuario(nombre);
        }
      }
    );
  }

  async loadContactos() {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Token enviado: ", token);
      const res = await fetch("http://localhost:3000/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar contactos");
      const contactos = await res.json();
      this.renderContactos(contactos);
    } catch (err) {
      console.error("Error al cargar contactos: ", err);
      alert("No se pudieron cargar los contactos. Intenta recargar la pagina");
    }
  }

  renderContactos(contactos) {
    const container = this.querySelector("#listaContactos");
    if (contactos.length === 0) {
      container.innerHTML = "<p>No tienes contactos aun.</p>";
      return;
    }

    container.innerHTML = contactos
      .map(
        (c) => `
        <div class="contacto-card">
          <span>${c.name}</span>
          <button class="eliminar-btn" data-nombre="${c.name}">Eliminar</button>
        </div>
      `
      )
      .join("");

    container.querySelectorAll(".eliminar-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const name = btn.dataset.nombre;
        if (confirm("¿Seguro que quieres eliminar este contacto?")) {
          await this.eliminarContacto(name);
        }
      });
    });
  }

  async buscarUsuario(nombre) {
    const container = this.querySelector("#resultadoBusqueda");
    container.innerHTML = "<p>Cargando resultados...</p>";
    try {
      const usuarios = await this.#userService.obtenerUsuarioPorNombre(nombre);

      if (usuarios === null) {
        container.innerHTML = "<p>No se encontraron usuarios.</p>";
        return;
      }

      this.mostrarResultadoBusqueda(usuarios);
    } catch (err) {
      console.error(err);
      alert("Error al buscar usuarios. Intenta mas tarde.");
    }
  }

  mostrarResultadoBusqueda = function(usuarios) {
    const container = this.querySelector("#resultadoBusqueda");

    container.innerHTML = `
      <div class="contacto-card">
        <span>${usuarios.name}</span>
        <button class="agregar-btn" data-name="${usuarios.name}">Agregar</button>
      </div>
    `;

    container.querySelectorAll(".agregar-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const name = btn.dataset.name;

        btn.disabled = true;
        btn.textContent = "Agregando...";

        try {
          await this.agregarContacto(name);
          btn.textContent = "Agregado";
          btn.disabled = true;
        } catch {
          btn.textContent = "Agregar";
          btn.disabled = false;
        }
      });
    });
  };

  async agregarContacto(contactName) {
    try {
      const res = await this.#contactosService.agregarContacto(contactName);

      if (res) {
        alert("Contacto agregado.");
        this.loadContactos();
      } else if (res.status === 400) {
        alert("Este contacto ya esta en tu lista.");
      } else {
        throw new Error("No se pudo agregar el contacto.");
      }
    } catch (err) {
      console.error("Error al agregar contacto:", err);
      alert("Error al agregar el contacto. Intenta mas tarde.");
      throw err;
    }
  }

  async eliminarContacto(name) {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:3000/api/contacts/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Contacto eliminado.");
        this.loadContactos();
      } else {
        alert("No se pudo eliminar el contacto.");
      }
    } catch (err) {
      console.error("Error al eliminar contacto:", err);
      alert("Error al eliminar el contacto. Intenta mas tarde");
    }
  }
}

customElements.define("contactos-view", ContactosView);
