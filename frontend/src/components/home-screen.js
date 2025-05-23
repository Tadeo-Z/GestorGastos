import { AuthService } from "../services/auth.service.js";

export class HomeScreen extends HTMLElement {
    connectedCallback() {
        this.render();
        this.loadData(); // Lógica para cargar datos de la API
        //this.setupReportButtons(); // Añadimos la configuración de botones para los reportes
        this.addDeudasModalListeners();
        this.querySelector("#logoutBtn").addEventListener("click", () => {
            const authService = new AuthService();
            authService.cerrarSesion();
            this.dispatchEvent(new CustomEvent("logout", { bubbles: true}));
        })
    }

    render() {
        this.innerHTML = `
            <header>
                <h1>Inicio</h1>
                <button id="logoutBtn">Cerrar sesión</button>
            </header>
            <section class="section-grid">
                <div class="section">
                    <h2 id="abrirDeudasModal" style="cursor:pointer;">Tus Deudas</h2>
                    <div id="deudasCarousel" class="carousel-container">
                        <button class="carousel-btn left" id="prevDeudas">&lt;</button>
                        <div id="deudasList" class="carousel-content"></div>
                        <button class="carousel-btn right" id="nextDeudas">&gt;</button>
                    </div>
                </div>

                <div class="section">
                  <h2>Tus Grupos</h2>
                  <div id="deudasCarousel" class="carousel-container">
                        <button class="carousel-btn left" id="prevGrupos">&lt;</button>
                        <div id="gruposList" class="carousel-content"></div>
                        <button class="carousel-btn right" id="nextGrupos">&gt;</button>
                  </div>
                </div>

                <div class="section">
                  <h2>Tus Contactos</h2>
                  <div id="deudasCarousel" class="carousel-container">
                        <button class="carousel-btn left" id="prevContactos">&lt;</button>
                        <div id="contactosList" class="carousel-content"></div>
                        <button class="carousel-btn right" id="nextContactos">&gt;</button>
                  </div>
                </div>
                <!--
                <div class="section">
                  <h2>Reportes</h2>
                  <div id="reportesList" class="item-list"></div>
                </div>
                -->
              </section>
            </section>
            <div id="chartContainer" style="margin-top: 2rem;"></div>
            <section>
                <dialog id="deudasModal">
                    <h2>Lista de Deudas</h2>
                    <ul id="listaDeudas"></ul>
                    <div id="detalleDeuda"></div>
                    <button id="cerrarDeudasModal">Cerrar</button>
                </dialog>
            </section>
            <div id="chartContainer" style="margin-top: 2rem;"></div>
            <section>
                <dialog id="deudasModal">
                    <h2>Lista de Deudas</h2>
                    <ul id="listaDeudas"></ul>
                    <div id="detalleDeuda"></div>
                    <button id="cerrarDeudasModal">Cerrar</button>
                </dialog>
            </section>
            <div id="chartContainer" style="margin-top: 2rem;"></div>
            `;
    }

    async loadData() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("Token no encontrado. Por favor, inicia sesión nuevamente.");
            }

            const [deudas, grupos, gruposUsuario, contacts] = await Promise.all([
                fetch(`http://localhost:3000/api/expenses/user/${localStorage.getItem('userId')}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json()),
            fetch(`http://localhost:3000/api/groups`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()),
            fetch(`http://localhost:3000/api/userGroups/user/${localStorage.getItem('userId')}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()),
            fetch('http://localhost:3000/api/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => {
                    if (!res.ok) {
                        throw new Error(`Error al obtener contactos: ${res.statusText}`);
                    }
                    return res.json();
                })
            ]);

            console.log('Deudas:', deudas);
            console.log('Grupos:', grupos);
            console.log('Grupos del usuaio:', gruposUsuario);
            console.log('Contactos: ', contacts);

            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id; // Cambiado de userId a id
            console.log('User ID:', userId); // Verificar que el ID del usuario sea correcto
    
            const gruposDelUsuario = await grupos.filter(grupo => 
                gruposUsuario.some(grupoUsuario => grupoUsuario.id === grupo.id)
            );

            this.deudas = deudas;

            // Rellenar las listas con datos
            this.populateList("deudasList", deudas, "deuda");
            this.populateList("gruposList", gruposDelUsuario, "grupo");
            this.populateList("contactosList", contacts, "contacto");

            this.initializeCarousel();
        } catch (err) {
            console.error("Error cargando datos: ", err);
            alert(err.message); // Muestra un mensaje de error al usuario
        }
    }

    populateList(id, items, tipo) {
        console.log(`Populando lista: ${id}, Tipo: ${tipo}, Items:`, items);
        const container = this.querySelector(`#${id}`);
        if (!Array.isArray(items)) {
            console.error(`Error: se esperaba un arreglo, pero se recibió:`, items);
            container.innerHTML = `<p>No se encontraron ${tipo}s.</p>`;
            return;
        }

        if (tipo === 'grupo') {
            container.innerHTML = items.map(grupo => `
            <div class="carousel-item">
                <div class="grupo-card">
                    <h3>${grupo.description}</h3>
                </div>
            </div>
        `).join("");
        } else if (tipo === 'deuda') {
            container.innerHTML = items.map(deuda => `
            <div class="deuda-card">
                <div class="deuda-info">
                    <h3>${deuda.name}</h3>
                    <p>Monto: $${this.formatMoney(deuda.amount)}</p>
                    <p>Fecha límite: ${new Date(deuda.quoteDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p>Días restantes: ${this.calculateDaysRemaining(deuda.quoteDate)} días</p>
                    <p>Estado: ${deuda.paid ? "Pagado" : "Pendiente"}</p>
                </div>
                ${!deuda.paid ? `<button class="pagar-btn" data-id="${deuda.id}">Pagar - $${this.formatMoney(deuda.amount)}</button>` : ""}
            </div>
        `).join("");
        } else if (tipo === 'contacto') {
            container.innerHTML = items.map(contacto => `
            <div class="carousel-item">
                <div class="contacto-card">
                    <span>${contacto.nombre}</span>
                    <button class="eliminar-btn" data-id="${contacto.id}">Eliminar</button>
                </div>
            </div>
        `).join("");
        } else {
            container.innerHTML = items.map(item => `
            <div class="carousel-item">
                <div class="card ${tipo}">
                    <p>${item.name || item.description || 'Sin nombre'}</p>
                </div>
            </div>
        `).join("");
        }

        container.querySelectorAll(".pagar-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                await this.pagarDeuda(id);
            });
        });

        container.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                await this.eliminarContacto(id);
            });
        });
    }

    formatMoney(value) {
        return new Intl.NumberFormat('es-419', {
            style: 'decimal',
            maximumFractionDigits: 2
        }).format(value);
    }

    calculateDaysRemaining(quoteDate) {
        const today = new Date();
        const dueDate = new Date(quoteDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    async pagarDeuda(id) {
        try {
            const token = localStorage.getItem('authToken');

            const [deudas, grupos, contactos] = await Promise.all([
                fetch('http://localhost:3000/api/expenses', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json()),
                fetch('http://localhost:3000/api/groups', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json()),
                fetch('http://localhost:3000/api/contacts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json())
            ]);

            this.populateList("deudasList", deudas, "deuda");
            this.populateList("gruposList", grupos, "grupo");
            this.populateList("contactosList", contactos, "contacto");
        } catch (err) {
            console.error("Error cargando datos: ", err);
        }
    }

    populateList(id, items, tipo) {
        const container = this.querySelector(`#${id}`);
        container.innerHTML = items.map(item => `
            <div class="card ${tipo}">
                <p>${item.name || item.description || 'Sin nombre'}</p>
            </div>
        `).join("");
    }
    addDeudasModalListeners() {
        const abrirBtn = this.querySelector("#abrirDeudasModal");
        const modal = this.querySelector("#deudasModal");
        const cerrarBtn = this.querySelector("#cerrarDeudasModal");
        abrirBtn.addEventListener("click", () => {
            window.location.href = "/frontend/deudas.html";
        });
        cerrarBtn.addEventListener("click", () => modal.close());
    }

    mostrarListaDeudas() {
        const lista = this.querySelector("#listaDeudas");
        // Suponiendo que this.deudas contiene las deudas del usuario
        lista.innerHTML = this.deudas.map(deuda => `
            <li style="cursor:pointer;" data-id="${deuda.id}">${deuda.titulo} - ${deuda.monto} (${deuda.vencimiento})</li>
        `).join("");
        lista.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                this.mostrarDetalleDeuda(id);
            });
        });
    }

    mostrarDetalleDeuda(id) {
        const deuda = this.deudas.find(d => d.id == id);
        const detalle = this.querySelector("#detalleDeuda");
        if (!deuda) {
            detalle.innerHTML = "<p>No se encontró la deuda.</p>";
            return;
        }
        // Dummy: Integrantes y pagos
        const integrantes = deuda.integrantes || [];
        const pagados = integrantes.filter(i => i.pagado);
        const faltan = integrantes.filter(i => !i.pagado);
        detalle.innerHTML = `
        <h3>${deuda.titulo}</h3>
        <p>Vence: ${deuda.vencimiento}</p>
        <p>Faltan: ${this.calculateDaysRemaining(deuda.vencimiento)} días</p>
        ${deuda.grupo ? `<p>Grupo: ${deuda.grupo}</p>` : ""}
        <p><strong>Pagaron:</strong> ${pagados.map(i => i.nombre).join(", ") || "Nadie"}</p>
        <p><strong>Faltan:</strong> ${faltan.map(i => `${i.nombre} ($${i.faltaPagar})`).join(", ") || "Nadie"}</p>
    `;
    }
    initializeCarousel() {
        const carousels = [
            { prevBtnId: "prevDeudas", nextBtnId: "nextDeudas", listId: "deudasList" },
            { prevBtnId: "prevGrupos", nextBtnId: "nextGrupos", listId: "gruposList" },
            { prevBtnId: "prevContactos", nextBtnId: "nextContactos", listId: "contactosList" }
        ];

        carousels.forEach(carousel => {
            const prevBtn = this.querySelector(`#${carousel.prevBtnId}`);
            const nextBtn = this.querySelector(`#${carousel.nextBtnId}`);
            const carouselContent = this.querySelector(`#${carousel.listId}`);

            if (!prevBtn || !nextBtn || !carouselContent) {
                console.error(`Carousel elements not found for: ${carousel.listId}`);
                return;
            }

            let scrollValue = 0;
            const maxScroll = carouselContent.scrollWidth - carouselContent.clientWidth;

            nextBtn.addEventListener("click", () => {
                if (scrollValue < maxScroll) {
                    scrollValue += 500;
                    carouselContent.scrollTo({ left: scrollValue, behavior: 'smooth' });
                }
            });

            prevBtn.addEventListener("click", () => {
                if (scrollValue > 0) {
                    scrollValue -= 500;
                    carouselContent.scrollTo({ left: scrollValue, behavior: 'smooth' });
                }
            });
        });
    }

    /**
    setupReportButtons() {
        const gastosDiariosBtn = this.querySelector("#gastosDiarios");
        const gastosSemanalesBtn = this.querySelector("#gastosSemanales");
        const gastosMensualesBtn = this.querySelector("#gastosMensuales");
        const ahorrosBtn = this.querySelector("#ahorros");

        gastosDiariosBtn.addEventListener("click", () => this.showGastosReport('diarios'));
        gastosSemanalesBtn.addEventListener("click", () => this.showGastosReport('semanales'));
        gastosMensualesBtn.addEventListener("click", () => this.showGastosReport('mensuales'));
        ahorrosBtn.addEventListener("click", () => this.showAhorrosReport());
    }*/

    showGastosReport(periodo) {
        console.log(`Mostrando reporte de gastos ${periodo}`);
        const canvas = document.createElement("canvas");
        const container = this.querySelector("#chartContainer");
        container.innerHTML = ""; // Limpiar anteriores
        container.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        new Chart(ctx, {
            type: 'bar', // Tipo de gráfico

            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
                datasets: [{
                    label: `Gastos ${periodo}`,
                    data: [100, 200, 150, 300], // Datos de ejemplo
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    showAhorrosReport() {
        console.log("Mostrando reporte de ahorros");
        // Aquí puedes cargar la gráfica de ahorros
    }

    addDeudasModalListeners() {
        const abrirBtn = this.querySelector("#abrirDeudasModal");
        const modal = this.querySelector("#deudasModal");
        const cerrarBtn = this.querySelector("#cerrarDeudasModal");
        abrirBtn.addEventListener("click", () => {
            window.location.href = "/frontend/deudas.html";
        });
        cerrarBtn.addEventListener("click", () => modal.close());
    }

    mostrarListaDeudas() {
        const lista = this.querySelector("#listaDeudas");
        // Suponiendo que this.deudas contiene las deudas del usuario
        lista.innerHTML = this.deudas.map(deuda => `
        <li style="cursor:pointer;" data-id="${deuda.id}">${deuda.titulo} - ${deuda.monto} (${deuda.vencimiento})</li>
    `).join("");
        lista.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                this.mostrarDetalleDeuda(id);
            });
        });
    }

    mostrarDetalleDeuda(id) {
        const deuda = this.deudas.find(d => d.id == id);
        const detalle = this.querySelector("#detalleDeuda");
        if (!deuda) {
            detalle.innerHTML = "<p>No se encontró la deuda.</p>";
            return;
        }
        // Dummy: Integrantes y pagos
        const integrantes = deuda.integrantes || [];
        const pagados = integrantes.filter(i => i.pagado);
        const faltan = integrantes.filter(i => !i.pagado);
        detalle.innerHTML = `
        <h3>${deuda.titulo}</h3>
        <p>Vence: ${deuda.vencimiento}</p>
        <p>Faltan: ${this.calculateDaysRemaining(deuda.vencimiento)} días</p>
        ${deuda.grupo ? `<p>Grupo: ${deuda.grupo}</p>` : ""}
        <p><strong>Pagaron:</strong> ${pagados.map(i => i.nombre).join(", ") || "Nadie"}</p>
        <p><strong>Faltan:</strong> ${faltan.map(i => `${i.nombre} ($${i.faltaPagar})`).join(", ") || "Nadie"}</p>
    `;
    }
}

customElements.define('home-screen', HomeScreen);