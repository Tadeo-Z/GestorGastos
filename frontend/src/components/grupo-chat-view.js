export class GrupoChatView extends HTMLElement {
    constructor() {
      super();
      this.grupoId = null;
    }
  
    connectedCallback() {
      this.grupoId = this.getAttribute("grupo-id");
      this.render();
      this.loadMensajes();
      this.addListeners();
    }
  
    render() {
      this.innerHTML = `
        <section class="chat-container">
          <header class="chat-header">
            <button id="btnBack">← Volver</button>
            <h2 id="nombreGrupo">Chat del Grupo</h2>
          </header>
  
          <div id="mensajes" class="chat-mensajes"></div>
  
          <form id="formMensaje" class="chat-input">
            <input type="text" id="mensajeInput" placeholder="Escribe un mensaje..." required />
            <button type="submit">Enviar</button>
          </form>
        </section>
      `;
    }
  
    addListeners() {
      this.querySelector("#btnBack").addEventListener("click", () => {
        window.location.hash = "#grupos"; // Navegación simple
      });
  
      this.querySelector("#formMensaje").addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = this.querySelector("#mensajeInput");
        const mensaje = input.value.trim();
        if (mensaje) {
          await this.enviarMensaje(mensaje);
          input.value = "";
          this.loadMensajes();
        }
      });
    }
  
    async loadMensajes() {
      try {
        const token = localStorage.getItem("token");
  
        const res = await fetch(`/api/grupos/${this.grupoId}/mensajes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const { grupo, mensajes } = await res.json();
        this.querySelector("#nombreGrupo").textContent = grupo.nombre;
  
        const container = this.querySelector("#mensajes");
        container.innerHTML = mensajes.map(m => `
          <div class="mensaje">
            <strong>${m.usuario}</strong>
            <p>${m.contenido}</p>
            <span>${new Date(m.fecha).toLocaleTimeString()}</span>
          </div>
        `).join("");
  
        container.scrollTop = container.scrollHeight;
      } catch (err) {
        console.error("Error al cargar mensajes:", err);
      }
    }
  
    async enviarMensaje(contenido) {
      try {
        const token = localStorage.getItem("token");
  
        const res = await fetch(`/api/grupos/${this.grupoId}/mensajes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ contenido })
        });
  
        if (!res.ok) {
          alert("No se pudo enviar el mensaje.");
        }
      } catch (err) {
        console.error("Error al enviar mensaje:", err);
      }
    }
  }
  
  customElements.define("grupo-chat-view", GrupoChatView);