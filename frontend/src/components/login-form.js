import { AuthService } from "../services/auth.service.js";

export class LoginForm extends HTMLElement {
  #authService = new AuthService();

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.innerHTML = `
        <section class="login-container">
        <form id="loginForm">
          <h2>Iniciar Sesión</h2>
          <label for="name">Usuario</label>
          <input type="name" id="name" name="name" required />

          <label for="password">Contraseña</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Ingresar</button>
          <p class="extra">¿Olvidaste tu contraseña?</p>
        </form>
      </section>`;
  }

  attachEvents() {
    const form = this.querySelector('#loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.name.value;
        const password = form.password.value;

        this.#authService.iniciarSesion(name, password);
    });
  }
}

customElements.define('login-form', LoginForm);