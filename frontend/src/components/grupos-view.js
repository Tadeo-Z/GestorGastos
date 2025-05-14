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
            dialog.close();
        });

        this.querySelector("#formCrearGrupo").addEventListener("submit", async (e) => {
            e.preventDefault();
            const nombre = this.querySelector("#nombreGrupo").value.trim();
            if (nombre) {
                await this.crearGrupo(nombre);
                dialog.close();
            }
        });
    }

    // Método para cargar los grupos del usuario
    async loadGrupos() {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Token:', token); // Verificar que el token se obtiene correctamente

            const [grupos, userGroups] = await Promise.all([
                fetch('http://localhost:3000/api/groups', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json()),
                fetch('http://localhost:3000/api/usergroups', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json())
            ]);

            console.log('Grupos:', grupos); // Verificar que se reciben correctamente los grupos
            console.log('UserGroups:', userGroups); // Verificar que se reciben correctamente los userGroups

            // Extraer el userId del JWT
            const userId = JSON.parse(atob(token.split('.')[1])).userId;
            console.log('User ID:', userId); // Verificar que el userId es correcto

            // Filtrar los userGroups para obtener los groupIds del usuario
            const userGroupIds = userGroups
                .filter(ug => ug.userId === userId)
                .map(ug => ug.groupId);
            console.log('userGroupIds:', userGroupIds); // Verificar los IDs de los grupos del usuario

            // Filtrar los grupos a los que el usuario está asociado
            const gruposDelUsuario = grupos.filter(grupo => userGroupIds.includes(grupo.id));
            console.log('gruposDelUsuario:', gruposDelUsuario); // Verificar los grupos filtrados

            // Renderizar los grupos del usuario
            this.renderGrupos(gruposDelUsuario);
        } catch (err) {
            console.error("Error al cargar grupos: ", err);
        }
    }

    // Método para renderizar los grupos
    renderGrupos(grupos) {
        console.log('Grupos a mostrar:', grupos); // Verificar que los grupos se están pasando correctamente
        const container = this.querySelector("#gruposList");

        // Si no hay grupos, muestra un mensaje
        if (!grupos || grupos.length === 0) {
            container.innerHTML = `<p>No tienes grupos asociados.</p>`;
            return;
        }

        // Renderizar los grupos
        container.innerHTML = grupos.map(grupo => `
            <div class="grupo-card">
                <div>
                    <h3>${grupo.description}</h3>
                </div>
            </div>
        `).join(""); // Añadir los grupos filtrados al contenedor
    }

    // Método para agregar nuevos grupos
    async crearGrupo(nombre) {
        try {
            const token = localStorage.getItem('authToken');
            const userId = JSON.parse(atob(token.split('.')[1])).userId; // Extraer userId del token

            const res = await fetch('http://localhost:3000/api/groups', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: nombre, userId })
            });

            if (res.ok) {
                const nuevoGrupo = await res.json();
                this.loadGrupos(); // Recargar grupos después de agregar uno nuevo
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
