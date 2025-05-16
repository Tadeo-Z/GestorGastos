import { ExpenseService } from "../services/expense.service.js";

export class DeudasView extends HTMLElement {
    #expenseService = new ExpenseService();

    connectedCallback() {
        this.render();
        this.loadDeudas();
    }

    render() {
        this.innerHTML = `
            <section class="deudas-container">
                <header>
                    <h1>Tus Deudas</h1>
                    <button >Agregar deuda</button>
                </header>
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
            const deudas = await this.#expenseService.obtenerGastos();
            this.renderDeudas(deudas);
            this.updateProgress(deudas);
        } catch (error) {
            console.error('Error al cargar las deudas: ', error);
        }
    }

    renderDeudas(deudas) {
        const formatoMoneda = (valor) => {
            return new Intl.NumberFormat('es-419', {
                style: 'decimal',
                maximumFractionDigits: 2
            }).format(valor);
        };

        const container = this.querySelector('#deudasList');
        container.innerHTML = deudas.map(deuda => `
                <div class="deuda-card">
                    <div class="deuda-info">
                    <h3>${deuda.name}</h3>
                    <p>Monto: $${formatoMoneda(deuda.amount)}</p>
                    <p>Fecha límite: ${new Date(deuda.quoteDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p>Estado: ${deuda.paid == 1 ? "Pagado" : "Pendiente"}</p>
                    </div>
                    ${!deuda.paid == 1 ? `<button class="pagar-btn" data-id="${deuda.id}">Pagar - $${formatoMoneda(deuda.amount)}</button>` : ""}
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
            const res = await this.#expenseService.pagarGasto(id);

            if (res != null) {
                alert("Deuda pagada correctamente.");
                this.loadDeudas(); // Recargar
                location.reload();
            } else {
                alert("Error al pagar la deuda.");
            }
        } catch (err) {
            console.error("Pago fallido: ", err);
        }
    }

    updateProgress(deudas) {
        const total = deudas.reduce((acc, deuda) => acc + Number(deuda.amount), 0);
        const pagado = deudas.filter(deuda => deuda.paid).reduce((acc, deuda) => acc + Number(deuda.amount), 0);
        
        const porcentaje = total === 0 ? 0 : (pagado / total) * 100;
    
        const barra = this.querySelector("#progresoPagado");
        barra.style.width = `${porcentaje}%`;
    
        const formatoMoneda = (valor) => {
            return new Intl.NumberFormat('es-419', {
                style: 'decimal',
                maximumFractionDigits: 2
            }).format(valor);
        };
    
        const texto = this.querySelector("#textoProgreso");
        texto.textContent = `Total: $${formatoMoneda(pagado)} pagado de $${formatoMoneda(total)} (${porcentaje.toFixed(1)}%)`;
    }
}

customElements.define('deudas-view', DeudasView);