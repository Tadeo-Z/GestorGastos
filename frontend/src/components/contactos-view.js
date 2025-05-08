export class ContactosView extends HTMLElement {
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
            <form id="formBuscarContacto">
              <input type="text" id="buscarInput" placeholder="Buscar usuario..." />
              <button type="submit">Buscar</button>
            </form>
          </header>
  
          <div id="resultadoBusqueda"></div>
          <h2>Mis Contactos</h2>
          <div id="listaContactos" class="contacto-list"></div>
        </section>
      `;
    }
  
    addListeners() {
      this.querySelector("#formBuscarContacto").addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = this.querySelector("#buscarInput").value.trim();
        if (query) {
          await this.buscarUsuario(query);
        }
      });
    }
  
    async loadContactos() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const contactos = await res.json();
        this.renderContactos(contactos);
      } catch (err) {
        console.error("Error al cargar contactos:", err);
      }
    }
  
    renderContactos(contactos) {
      const container = this.querySelector("#listaContactos");
      container.innerHTML = contactos.map(c => `
        <div class="contacto-card">
          <span>${c.nombre}</span>
          <button class="eliminar-btn" data-id="${c.id}">Eliminar</button>
        </div>
      `).join("");
  
      container.querySelectorAll(".eliminar-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          await this.eliminarContacto(id);
        });
      });
    }
  
    async buscarUsuario(nombre) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/usuarios/buscar?nombre=${encodeURIComponent(nombre)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (!res.ok) throw new Error("Error al buscar usuario.");
  
        const usuarios = await res.json();
        this.mostrarResultadoBusqueda(usuarios);
      } catch (err) {
        console.error(err);
        alert("No se pudo buscar el usuario.");
      }
    }
  
    mostrarResultadoBusqueda(usuarios) {
      const container = this.querySelector("#resultadoBusqueda");
      if (usuarios.length === 0) {
        container.innerHTML = "<p>No se encontraron usuarios.</p>";
        return;
      }
  
      container.innerHTML = usuarios.map(u => `
        <div class="contacto-card">
          <span>${u.nombre}</span>
          <button class="agregar-btn" data-id="${u.id}">Agregar</button>
        </div>
      `).join("");
  
      container.querySelectorAll(".agregar-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          await this.agregarContacto(id);
        });
      });
    }
  
    async agregarContacto(id) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/contactos", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ contactoId: id })
        });
  
        if (res.ok) {
          alert("Contacto agregado.");
          this.loadContactos();
        } else {
          alert("No se pudo agregar el contacto.");
        }
      } catch (err) {
        console.error("Error al agregar contacto:", err);
      }
    }
  
    async eliminarContacto(id) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/contactos/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (res.ok) {
          alert("Contacto eliminado.");
          this.loadContactos();
        } else {
          alert("No se pudo eliminar el contacto.");
        }
      } catch (err) {
        console.error("Error al eliminar contacto:", err);
      }
    }
  }
  
  customElements.define("contactos-view", ContactosView);