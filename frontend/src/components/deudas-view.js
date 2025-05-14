import { ExpenseService } from "../services/expense.service.js"; 

export class DeudasView extends HTMLElement {
    connectedCallback() {
        this.render();
        this.loadDeudas();
    }

    render() {
        this.innerHTML = `
            <section class="deudas-container">
                <header><h1>Tus Deudas</h1></header>
                <div class="carousel-container">
                    <button class="carousel-arrow left-arrow">&#10094;</button>
                    <div id="deudasList" class="deuda-carousel"></div>
                    <button class="carousel-arrow right-arrow">&#10095;</button>
                </div>
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
            const response = await fetch('http://localhost:3000/api/expenses', {
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
        const formatoMoneda = (valor) => {
            return new Intl.NumberFormat('es-419', {
                style: 'decimal',
                maximumFractionDigits: 2
            }).format(valor);
        };

        const container = this.querySelector('#deudasList');
        container.innerHTML = deudas.map(deuda => {
            const daysRemaining = this.getDaysRemaining(deuda.quoteDate);

            return `
                <div class="deuda-card">
                    <div class="deuda-info">
                        <h3>${deuda.name}</h3>
                        <p>Monto: $${formatoMoneda(deuda.amount)}</p>
                        <p>Fecha límite: ${new Date(deuda.quoteDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <p>Días restantes: ${daysRemaining} días</p>
                        <p>Estado: ${deuda.paid == 1 ? "Pagado" : "Pendiente"}</p>
                    </div>
                    ${!deuda.paid == 1 ? `<button class="pagar-btn" data-id="${deuda.id}">Pagar - $${formatoMoneda(deuda.amount)}</button>` : ""}
                </div>
            `;
        }).join("");

        // Add event listeners to buttons
        container.querySelectorAll(".pagar-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                await this.pagarDeuda(id);
            });
        });

        this.initCarousel();
    }

    getDaysRemaining(quoteDate) {
        const currentDate = new Date();
        const dueDate = new Date(quoteDate);
        const timeDiff = dueDate - currentDate;
        return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    }

    initCarousel() {
        const leftArrow = this.querySelector('.left-arrow');
        const rightArrow = this.querySelector('.right-arrow');
        const carousel = this.querySelector('#deudasList');

        leftArrow.addEventListener('click', () => {
            carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => {
            carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
        });
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
