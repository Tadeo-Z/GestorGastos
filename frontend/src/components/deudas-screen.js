class DeudasScreen extends HTMLElement {
    connectedCallback() {
        this.render();
        this.loadDeudas();
    }

    render() {
        this.innerHTML = `
            <section class="home-container">
                <header>
                    <h1>Todas tus Deudas</h1>
                </header>
                <section class="section-grid">
                    <div class="section">
                        <div class="carousel-container">
                            <ul id="deudasLista" class="carousel-content"></ul>
                        </div>
                    </div>
                     
                <button id="volverBtn">Volver</button>
            </section>
        `;
        this.querySelector("#volverBtn").addEventListener("click", () => window.history.back());
    }

    async loadDeudas() {
        const token = localStorage.getItem('authToken');
        const res = await fetch('http://localhost:3000/api/expenses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const deudas = await res.json();
        this.deudas = deudas;
        this.mostrarListaDeudas();
    }

    mostrarListaDeudas() {
        const lista = this.querySelector("#deudasLista");
        lista.innerHTML = this.deudas.map(deuda => `
            <li class="carousel-item" data-id="${deuda.id}">
                <div class="deuda-card" id="deuda-card-${deuda.id}">
                    <strong>${deuda.titulo || deuda.name}</strong><br>
                    Monto: $${deuda.monto || deuda.amount}<br>
                    Vence: ${deuda.vencimiento || deuda.quoteDate}
                    <div class="deuda-detalle-extra" style="display:none;"></div>
                </div>
            </li>
        `).join("");
        lista.querySelectorAll(".deuda-card").forEach(card => {
            card.addEventListener("click", (e) => {
                const id = card.parentElement.dataset.id;
                this.expandirDeuda(id);
            });
        });
        // Si quieres que la primera esté expandida por defecto:
        // if (this.deudas.length) this.expandirDeuda(this.deudas[0].id);
    }

    expandirDeuda(id) {
        // Cierra todos los detalles
        this.querySelectorAll('.deuda-card').forEach(card => {
            card.classList.remove('activa');
            card.querySelector('.deuda-detalle-extra').style.display = 'none';
        });

        // Busca la deuda y el card correspondiente
        const deuda = this.deudas.find(d => d.id == id);
        const card = this.querySelector(`#deuda-card-${id}`);
        if (!deuda || !card) return;

        card.classList.add('activa');
        const detalle = card.querySelector('.deuda-detalle-extra');
        const integrantes = deuda.integrantes || [];
        const pagados = integrantes.filter(i => i.pagado);
        const faltan = integrantes.filter(i => !i.pagado);
        detalle.innerHTML = `
            <hr>
            <p><strong>Faltan:</strong> ${this.calculateDaysRemaining(deuda.vencimiento || deuda.quoteDate)} días</p>
            ${deuda.grupo ? `<p><strong>Grupo:</strong> ${deuda.grupo}</p>` : ""}
            <p><strong>Pagaron:</strong> ${pagados.map(i => i.nombre).join(", ") || "Nadie"}</p>
            <p><strong>Faltan:</strong> ${faltan.map(i => `${i.nombre} ($${i.faltaPagar})`).join(", ") || "Nadie"}</p>
        `;
        detalle.style.display = 'block';
    }

    mostrarDetalleDeuda(id) {
        const deuda = this.deudas.find(d => d.id == id);
        const detalle = this.querySelector("#detalleDeuda");
        if (!deuda) {
            detalle.innerHTML = "<p>No se encontró la deuda.</p>";
            return;
        }
        const integrantes = deuda.integrantes || [];
        const pagados = integrantes.filter(i => i.pagado);
        const faltan = integrantes.filter(i => !i.pagado);
        detalle.innerHTML = `
            <h2>${deuda.titulo || deuda.name}</h2>
            <p><strong>Monto:</strong> $${deuda.monto || deuda.amount}</p>
            <p><strong>Vence:</strong> ${deuda.vencimiento || deuda.quoteDate}</p>
            <p><strong>Faltan:</strong> ${this.calculateDaysRemaining(deuda.vencimiento || deuda.quoteDate)} días</p>
            ${deuda.grupo ? `<p><strong>Grupo:</strong> ${deuda.grupo}</p>` : ""}
            <p><strong>Pagaron:</strong> ${pagados.map(i => i.nombre).join(", ") || "Nadie"}</p>
            <p><strong>Faltan:</strong> ${faltan.map(i => `${i.nombre} ($${i.faltaPagar})`).join(", ") || "Nadie"}</p>
        `;
    }

    calculateDaysRemaining(quoteDate) {
        const today = new Date();
        const dueDate = new Date(quoteDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
}

customElements.define('deudas-screen', DeudasScreen);