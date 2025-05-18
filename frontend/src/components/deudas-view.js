import { ExpenseService } from "../services/expense.service.js";

export class DeudasView extends HTMLElement {
    #expenseService = new ExpenseService();
    #isFormVisible = false;

    connectedCallback() {
        this.render();
        this.loadDeudas();
        this.attachEvents();
    }

    render() {
        this.innerHTML = `
            <section class="deudas-container">
                <header>
                    <h1>Tus Deudas</h1>
                    <button id="add-expense" class="pagar-btn">Agregar deuda</button>
                </header>
                <div id="deudasList" class="deuda-list"></div>
                <footer class="barra-progreso">
                    <div class="barra">
                        <div id="progresoPagado" class="progreso-pagado"></div>
                    </div>
                    <p id="textoProgreso"></p>
                </footer>

                <div id="deudaModal" class="modal ${this.#isFormVisible ? 'visible' : ''}">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h2>Agregar Nueva Deuda</h2>
                        <form id="deudaForm">
                            <div class="form-group">
                                <label for="deudaNombre">Nombre de la deuda</label>
                                <input type="text" id="deudaNombre" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="deudaMonto">Monto ($)</label>
                                <input type="number" id="deudaMonto" min="0" step="0.01" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="deudaFecha">Fecha límite</label>
                                <input type="date" id="deudaFecha" required>
                            </div>
                            
                            <button type="submit" class="submit-btn">Guardar Deuda</button>
                        </form>
                    </div>
                </div>
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

    attachEvents() {
        this.querySelector('#add-expense').addEventListener('click', () => {
            this.#isFormVisible = true;
            this.render();
            this.loadDeudas();
            this.attachEvents();
        });

        this.querySelector('.close-modal')?.addEventListener('click', () => {
            this.#isFormVisible = false;
            this.render();
            this.loadDeudas();
            this.attachEvents();
        });

        this.querySelector('#deudaForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.agregarDeuda();
        });
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

    async agregarDeuda() {
        try {
            const name = this.querySelector('#deudaNombre').value;
            const amount = parseFloat(this.querySelector('#deudaMonto').value);
            const quoteDate = this.querySelector('#deudaFecha').value;

            const result = await this.#expenseService.agregarGasto(name, amount, quoteDate, 0, localStorage.getItem("userId"));

            if(result) {
                alert('Deuda agregada correctamente');
                this.#isFormVisible = false;
                this.render();
                this.loadDeudas();
                this.attachEvents();
            } else {
                throw new Error('Error al guardar la deuda');
            }
        } catch (error) {
            console.error(`Error al guardar la deuda: ${error.message}`);
            alert('Error al guardar la deuda');
        }
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