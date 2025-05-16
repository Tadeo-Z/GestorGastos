import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";

export class LoginForm extends HTMLElement {
  #authService = new AuthService();
  #userService = new UserService();
  #isLoginView = true;

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    if (this.#authService.estaAutenticado()) {
      this.handleLoginSuccess();
    }
  }

  render() {
    this.innerHTML = `
      <section class="login-container">
        <div class="auth-tabs">
          <button class="tab ${this.#isLoginView ? 'active' : ''}" id="loginTab">Iniciar Sesión</button>
          <button class="tab ${!this.#isLoginView ? 'active' : ''}" id="registerTab">Registrarse</button>
        </div>

        <form id="loginForm" class="auth-form ${this.#isLoginView ? 'active' : ''}">
          <h2>Iniciar Sesión</h2>
          <label for="name">Usuario</label>
          <input type="name" id="name" name="name" required />

          <label for="password">Contraseña</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Ingresar</button>
          <p class="extra">¿Olvidaste tu contraseña?</p>
        </form>

        <form id="registerForm" class="auth-form ${!this.#isLoginView ? 'active' : ''}">
          <h2>Registrarse</h2>
          <label for="registerName">Nombre</label>
          <input type="text" id="registerName" name="name" required />

          <label for="registerPaternalSurname">Apellido Paterno</label>
          <input type="text" id="registerPaternalSurname" name="name" required />

          <label for="registerMaternalSurname">Apellido Materno</label>
          <input type="text" id="registerMaternalSurname" name="name" required />

          <label for="registerPassword">Contraseña</label>
          <input type="password" id="registerPassword" name="password" required />

          <label for="registerConfirmPassword">Confirmar Contraseña</label>
          <input type="password" id="registerConfirmPassword" name="confirmPassword" required />

          <button type="submit">Crear cuenta</button>
        </form>
      </section>`;
  }

  attachEvents() {
    this.querySelector('#loginTab').addEventListener('click', () => {
      this.#isLoginView = true;
      this.render();
      this.attachEvents();
    });

    this.querySelector('#registerTab').addEventListener('click', () => {
      this.#isLoginView = false;
      this.render();
      this.attachEvents();
    });

    const form = this.querySelector('#loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.name.value;
        const password = form.password.value;

        try {
          await this.#authService.iniciarSesion(name, password);
          this.handleLoginSuccess();
        } catch (error) {
          alert(error.message);
        }
    });

    const registerForm = this.querySelector('#registerForm');
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = registerForm.registerName.value;
      const paternalSurname = registerForm.registerPaternalSurname.value;
      const maternalSurname = registerForm.registerMaternalSurname.value;
      const password = registerForm.registerPassword.value;
      const confirmPassword = registerForm.registerConfirmPassword.value;

      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        await this.#userService.agregarUsuario(name, paternalSurname, maternalSurname, new Date(), password);
        alert('Registro exitoso. Por favor inicia sesión.');
        this.#isLoginView = true;
        this.render();
        this.attachEvents();
      } catch (error) {
        alert(`${error.message}, pw: ${password}`);
      }
    });

  }

  handleLoginSuccess() {
    this.style.display = 'none';
    
    const appContent = document.getElementById('appContent');
    if (appContent) {
      appContent.style.display = 'block';
    }

    this.dispatchEvent(new CustomEvent('login-success', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('login-form', LoginForm);