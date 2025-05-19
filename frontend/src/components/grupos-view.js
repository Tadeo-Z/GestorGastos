import { GroupService } from "../services/group.service.js";
import { UserGroupService } from "../services/userGroup.service.js";

export class GruposView extends HTMLElement {
    #groupService = new GroupService();
    #userGroupService = new UserGroupService();

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
            dialog.close();
        });

        this.querySelector("#formCrearGrupo").addEventListener("submit", async (e) => {
            e.preventDefault();
            const description = this.querySelector("#nombreGrupo").value.trim();
            if (description) {
                await this.crearGrupo(description);
                dialog.close();
            }
        });
    }

    async loadGrupos() {
        try {
            const AllGrupos = await this.#groupService.obtenerGrupos();
            const userGrupos = await this.#userGroupService.obtenerGruposPorUsuario(localStorage.getItem('userId'));
            
            const gruposDelUsuario = AllGrupos.filter(grupo => 
                userGrupos.some(userGrupo => userGrupo.id === grupo.id)
            );
            
            const gruposConMiembros = await Promise.all(
                gruposDelUsuario.map(async (grupo) => {
                    const miembros = await this.#userGroupService.obtenerGruposUsuarioGrupo(grupo.id);
                    return {
                        ...grupo,
                        totalMiembros: miembros?.length || 0
                    };
                })
            );

            this.renderGrupos(gruposConMiembros);
        } catch (err) {
            console.error("Error al cargar grupos: ", err);
        }
    }

    renderGrupos(grupos) {
        const container = this.querySelector("#gruposList");
        container.innerHTML = grupos.map(grupo => `
                <div class="grupo-card">
                    <div>
                    <h3>${grupo.description}</h3>
                    <p>Miembros: ${grupo.totalMiembros}</p>
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

    async crearGrupo(description) {
        try {
            const group = await this.#groupService.agregarGrupo(description);
            const userGroup = await this.#userGroupService.agregarUsuarioGrupo(new Date(), 'Administrador', localStorage.getItem("userId"), group.id);

            if (group && userGroup) {
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