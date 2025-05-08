export class HomeScreen extends HTMLElement {
    connectedCallback() {
        this.render();
        this.loadData(); // Logica para cargar datos de la API
    }

    render() {
        this.innerHTML = `
            <section class="home-container">
              <header>
                <h1>Inicio</h1>
              </header>

              <section class="section-grid">
                <div class="section">
                  <h2>Tus Deudas</h2>
                  <div id="deudasList" class="item-list"></div>
                </div>

                <div class="section">
                  <h2>Tus Grupos</h2>
                  <div id="gruposList" class="item-list"></div>
                </div>

                <div class="section">
                  <h2>Tus Contactos</h2>
                  <div id="contactosList" class="item-list"></div>
                </div>

                <!--
                <div class="section">
                  <h2>Reportes</h2>
                  <div id="reportesList" class="item-list"></div>
                </div>*/ -->
              </section>
            </section>
        `;
    }

    async loadData() {
        try {
            const token = localStorage.getItem('authToken');

            const [deudas, grupos, contactos] = await Promise.all([
                fetch('http://localhost:3000/api/expenses', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json()),
                fetch('http://localhost:3000/api/groups', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json()),
                fetch('http://localhost:3000/api/userGroups', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json())/*,
                fetch('http://localhost:3000/api/reportes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json())*/
            ]);

            this.populateList("deudasList", deudas, "deuda");
            this.populateList("gruposList", grupos, "grupo");
            this.populateList("contactosList", contactos, "contacto");
            /*this.populateList("reportesList", reportes, "reporte");*/
        } catch (err) {
            console.error("Error cargando datos: ", err);
        }
    }

    populateList(id, items, tipo) {
        const container = this.querySelector(`#${id}`);
        container.innerHTML = items.map(item => `
            <div class="card ${tipo}">
                <!-- <img src="/assets/${tipo}.png" alt="${tipo}" /> -->
                <p>${item.name}</p>
            </div>
        `).join("");
    }
}

customElements.define('home-screen', HomeScreen);