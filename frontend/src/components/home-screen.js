export class HomeScreen extends HTMLElement {
   connectedCallback() {
        this.render();
        this.loadData(); // Lógica para cargar datos de la API
        this.setupReportButtons(); // Añadimos la configuración de botones para los reportes
    }

    render() {
        this.innerHTML = `
            <section class="home-container">
                <header>
                    <h1>Inicio</h1>
                </header>

                <section class="section-grid">
                    <!-- Sección de Deudas -->
                    <div class="section">
                        <h2>Tus Deudas</h2>
                        <div id="deudasCarousel" class="carousel-container">
                            <button class="carousel-btn left" id="prevDeudas">&lt;</button>
                            <div id="deudasList" class="carousel-content"></div>
                            <button class="carousel-btn right" id="nextDeudas">&gt;</button>
                        </div>
                    </div>

                    <!-- Sección de Grupos -->
                    <div class="section">
                        <h2>Tus Grupos</h2>
                        <div id="gruposCarousel" class="carousel-container">
                            <button class="carousel-btn left" id="prevGrupos">&lt;</button>
                            <div id="gruposList" class="carousel-content"></div>
                            <button class="carousel-btn right" id="nextGrupos">&gt;</button>
                        </div>
                    </div>
 
                    <!-- Sección de Contactos -->
                    <div class="section">
                        <h2>Tus Contactos</h2>
                        <div id="contactosCarousel" class="carousel-container">
                            <button class="carousel-btn left" id="prevContactos">&lt;</button>
                            <div id="contactosList" class="carousel-content"></div>
                            <button class="carousel-btn right" id="nextContactos">&gt;</button>
                        </div>
                    </div>

                    <!-- Sección de Reportes -->
                    <div class="section">
                        <h2>Reportes</h2>
                        <div id="reportesButtons" class="reportes-buttons">
                            <button class="report-btn" id="gastosDiarios">Gastos Diarios</button>
                            <button class="report-btn" id="gastosSemanales">Gastos Semanales</button>
                            <button class="report-btn" id="gastosMensuales">Gastos Mensuales</button>
                            <button class="report-btn" id="ahorros">Ahorros</button>
                        </div>
                    </div>
                </section>
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

        const [deudas, grupos, userGroups, contactos] = await Promise.all([
            fetch('http://localhost:3000/api/expenses', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()),
            fetch('http://localhost:3000/api/groups', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()),
            fetch('http://localhost:3000/api/userGroups', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()),
            fetch('http://localhost:3000/api/contactos', {
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
        console.log('UserGroups:', userGroups);
        console.log('Contactos:', contactos);

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id; // Cambiado de userId a id
        console.log('User ID:', userId); // Verificar que el ID del usuario sea correcto

        // Filtrar grupos del usuario
        const userGroupIds = userGroups
            .filter(ug => ug.userId === userId)
            .map(ug => ug.groupId);
        console.log('userGroupIds:', userGroupIds);

        const gruposDelUsuario = grupos.filter(grupo => userGroupIds.includes(grupo.id));
        console.log('gruposDelUsuario:', gruposDelUsuario);

        // Rellenar las listas con datos
        this.populateList("deudasList", deudas, "deuda");
        this.populateList("gruposList", gruposDelUsuario, "grupo");
        this.populateList("contactosList", contactos, "contacto");

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
            <div class="carousel-item">
                <div class="deuda-card">
                    <div class="deuda-info">
                        <h3>${deuda.name}</h3>
                        <p>Monto: $${this.formatMoney(deuda.amount)}</p>
                        <p>Días restantes: ${this.calculateDaysRemaining(deuda.quoteDate)}</p>
                    </div>
                    ${deuda.paid ? "" : `<button class="pagar-btn" data-id="${deuda.id}">Pagar - $${this.formatMoney(deuda.amount)}</button>`}
                </div>
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

            const res = await fetch(`http://localhost:3000/api/expenses/${id}/pay`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                alert("Deuda pagada correctamente.");
                this.loadData(); // Recargar
            } else {
                alert("Error al pagar la deuda.");
            }
        } catch (err) {
            console.error("Pago fallido: ", err);
        }
    }

    initializeCarousel() {
        const carousels = [
            { prevBtnId: "prevDeudas", nextBtnId: "nextDeudas", listId: "deudasList" },
            { prevBtnId: "prevGrupos", nextBtnId: "nextGrupos", listId: "gruposList" },
            { prevBtnId: "prevContactos", nextBtnId: "nextContactos", listId: "contactosList" },
        ];

        carousels.forEach(carousel => {
            const prevBtn = this.querySelector(`#${carousel.prevBtnId}`);
            const nextBtn = this.querySelector(`#${carousel.nextBtnId}`);
            const carouselContent = this.querySelector(`#${carousel.listId}`);

            let scrollValue = 0;
            const itemWidth = carouselContent.querySelector(".carousel-item")?.offsetWidth || 200; // Asume un tamaño razonable por defecto

            const maxScroll = carouselContent.scrollWidth - carouselContent.clientWidth;

            nextBtn.addEventListener("click", () => {
                if (scrollValue < maxScroll) {
                    scrollValue += itemWidth;
                    carouselContent.scrollTo({ left: scrollValue, behavior: 'smooth' });
                }
            });

            prevBtn.addEventListener("click", () => {
                if (scrollValue > 0) {
                    scrollValue -= itemWidth;
                    carouselContent.scrollTo({ left: scrollValue, behavior: 'smooth' });
                }
            });
        });
    }

    setupReportButtons() {
        const gastosDiariosBtn = this.querySelector("#gastosDiarios");
        const gastosSemanalesBtn = this.querySelector("#gastosSemanales");
        const gastosMensualesBtn = this.querySelector("#gastosMensuales");
        const ahorrosBtn = this.querySelector("#ahorros");

        gastosDiariosBtn.addEventListener("click", () => this.showGastosReport('diarios'));
        gastosSemanalesBtn.addEventListener("click", () => this.showGastosReport('semanales'));
        gastosMensualesBtn.addEventListener("click", () => this.showGastosReport('mensuales'));
        ahorrosBtn.addEventListener("click", () => this.showAhorrosReport());
    }

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
}

customElements.define('home-screen', HomeScreen);
