export class DeudasView extends HTMLElement {
    connectedCallback() {
        this.render();
        this.loadDeudas();
    }

    render() {
        this.innerHTML = `
            <section class="deudas-container">
                <header><h1>Tus Deudas</h1></header>
                <div id="deudasList" class="deuda-list"></div>
                <footer class="barra-progreso">
                <div class="barra">
                    <div id="progresoPagado" class="progreso-pagado"></div>
                </div>
                <p id="textoProgreso"></p>
                </footer>
            </section>
    `;
    }

    async loadDeudas() {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/deudas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const deudas = await response.json();
            this.renderDeudas(deudas);
            this.updateProgress(deudas);
        } catch (error) {
            console.error('Error al cargar las deudas: ', error);
        }
    }

    renderDeudas(deudas) {
        const container = this.querySelector('#deudasList');
        container.innerHTML = deudas.map(deuda => `
                <div class="deuda-card">
                    <div class="deuda-info">
                    <h3>${deuda.nombre}</h3>
                    <p>Monto: $${deuda.monto}</p>
                    <p>Fecha límite: ${deuda.fechaLimite}</p>
                    <p>Estado: ${deuda.pagado ? "Pagado" : "Pendiente"}</p>
                    </div>
                    ${!deuda.pagado ? `<button class="pagar-btn" data-id="${deuda.id}">Pagar - $${deuda.monto}</button>` : ""}
                </div>
        `).join("");

        container.querySelectorAll(".pagar-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                await this.pagarDeuda(id);
            });
        });
    }

    async pagarDeuda(id) {
        try {
            const token = localStorage.getItem('authToken');

            const res = await fetch(`http://localhost:3000/api/deudas/${id}/pagar`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
        });

            if (res.ok) {
                alert("Deuda pagada correctamente.");
                this.loadDeudas(); // Recargar
            } else {
                alert("Error al pagar la deuda.");
            }
        } catch (err) {
            console.error("Pago fallido: ", err);
        }
    }

    updateProgress(deudas) {
        const total = deudas.reduce((acc, deuda) => acc + deuda.monto, 0);
        const pagado = deudas.filter(deuda => deuda.pagado).reduce((acc, deuda) => acc + deuda.monto, 0);
        const porcentaje = total === 0 ? 0 : (pagado / total) * 100;
        
        const barra = this.querySelector("#progresoPagado");
        barra.computedStyleMap.width = `${porcentaje}%`;

        const texto = this.querySelector("#textoProgreso");
        texto.textContent = `Total: $${pagado} pagado de $${total} (${porcentaje.toFixed(1)}%)`;
    }
}

customElements.define('deudas-view', DeudasView);