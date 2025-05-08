export class GruposView extends HTMLElement {
    connectedCallback() {
        this.render();
        this.loadGrupos();
        this.addListeners();
    }

    render() {
        this.innerHTML = `
            <section class="grupos-container">
                <header>
                <h1>Tus Grupos</h1>
                <button id="crearGrupoBtn">+ Crear Grupo</button>
                </header>

                <div id="gruposList" class="grupo-list"></div>

                <dialog id="dialogCrearGrupo">
                <form id="formCrearGrupo">
                    <h2>Nuevo Grupo</h2>
                    <input type="text" id="nombreGrupo" placeholder="Nombre del grupo" required />
                    <button type="submit">Crear</button>
                    <button type="button" id="cancelarCrear">Cancelar</button>
                </form>
                </dialog>
            </section>
        `;
    }

    addListeners() {
        const dialog = this.querySelector("#dialogCrearGrupo");

        this.querySelector("#crearGrupoBtn").addEventListener("click", () => {
            dialog.showModal();
        });

        this.querySelector("#cancelarCrear").addEventListener("click", () => {
            dialog.closest();
        });

        this.querySelector("#formCrearGrupo").addEventListener("submit", async (e) => {
            e.preventDefault();
            const nombre = this.querySelector("#nombreGrupo").ariaValueMax.trim();
            if (nombre) {
                await this.crearGrupo(nombre);
                dialog.closest();
            }
        });
    }

    async loadGrupos() {
        try {
            const token = localStorage.getItem('authToken');

            const res = await fetch('http://localhost:3000/api/groups', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const grupos = await res.json();
            this.renderGrupos(grupos);
        } catch (err) {
            console.error("Error al cargar grupos: ", err);
        }
    }

    renderGrupos(grupos) {
        const container = this.querySelector("#gruposList");
        container.innerHTML = grupos.map(grupo => `
                <div class="grupo-card">
                    <div>
                    <h3>${grupo.nombre}</h3>
                    <p>Miembros: ${grupo.miembros?.length || 0}</p>
                    </div>
                    <div class="acciones">
                    <button data-id="${grupo.id}" class="ver-btn">Ver</button>
                    <button data-id="${grupo.id}" class="salir-btn">Salir</button>
                    </div>
                </div>
        `).join("");

        container.querySelectorAll(".ver-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const grupoId = btn.dataset.id;
                window.location.hash = `#grupo/${grupoId}`;
            });
        });

        container.querySelectorAll(".salir-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const grupoId = btn.dataset.id;
                await this.salirDeGrupo(grupoId);
            });
        });
    }

    async crearGrupo(nombre) {
        try {
            const token = localStorage.getItem('authToken');

            const res = await fetch('http://localhost:3000/api/grupos', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre })
            });

            if (res.ok) {
                alert("Grupo creado correctamente.");
                this.loadGrupos();
            } else {
                alert("Error al crear el grupo.");
            }
        } catch (err) {
            console.error("Error al crear grupo: ", err);
        }
    }

    async salirDeGrupo(grupoId) {
        try {
            const token = localStorage.getItem('authToken');

            const res = await fetch(`http://localhost:3000/api/grupos/${grupoId}/salir`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert("Has salido del grupo correctamente.");
                this.loadGrupos();
            } else {
                alert("Error al salir del grupo.");
            }
        } catch (err) {
            console.error("Error al salir del grupo: ", err);
        }
    }
}

customElements.define('grupos-view', GruposView);