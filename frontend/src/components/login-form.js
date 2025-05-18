import { AuthService } from "../services/auth.service.js";
import { CountService } from "../services/count.service.js";

export class LoginForm extends HTMLElement {
  #authService = new AuthService();
  #countService = new CountService();
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
          <button class="tab ${
            this.#isLoginView ? "active" : ""
          }" id="loginTab">Iniciar Sesión</button>
          <button class="tab ${
            !this.#isLoginView ? "active" : ""
          }" id="registerTab">Registrarse</button>
        </div>

        <form id="loginForm" class="auth-form ${
          this.#isLoginView ? "active" : ""
        }">
          <h2>Iniciar Sesión</h2>
          <label for="name">Usuario</label>
          <input type="name" id="name" name="name" required />

          <label for="password">Contraseña</label>
          <input type="password" id="password" name="password" required />

          <button type="submit" id="loginBtn">
          <span class="btn-text">Ingresar</span>
          <span class="spinner hidden">Cargando...</span>
          </button>
          <p class="extra">¿Olvidaste tu contraseña?</p>
        </form>

        <form id="registerForm" class="auth-form ${
          !this.#isLoginView ? "active" : ""
        }">
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

          <button type="submit" id="registerBtn">
          <span class="btn-text">Crear cuenta</span>
          <span class="spinner hidden">Cargando...</span>
          </button>
        </form>
        <div class="messages"></div>
      </section>`;
  }

  // Nuevo metodo para mostrar mensajes
  showMessage(text, isError = false) {
    const messagesDiv = this.querySelector(".messages");
    messagesDiv.innerHTML = `<div class="message ${
      isError ? "error" : "success"
    }">${text}</div>`;
    setTimeout(() => (messagesDiv.innerHTML = ""), 5000);
  }

  attachEvents() {
    this.querySelector("#loginTab").addEventListener("click", () => {
      this.#isLoginView = true;
      this.render();
      this.attachEvents();
    });

    this.querySelector("#registerTab").addEventListener("click", () => {
      this.#isLoginView = false;
      this.render();
      this.attachEvents();
    });

    const loginForm = this.querySelector("#loginForm");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = this.querySelector("#loginBtn");
      this.toggleLoading(btn, true);

      try {
        const name = loginForm.name.value.trim();
        const password = loginForm.password.value;

        if (password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        await this.#authService.iniciarSesion(name, password);
        this.handleLoginSuccess();
      } catch (error) {
        this.showMessage(error.message, true);
      } finally {
        this.toggleLoading(btn, false);
      }
    });

    const registerForm = this.querySelector("#registerForm");
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = this.querySelector("#registerBtn");
      this.toggleLoading(btn, true);

      try {
        const name = registerForm.registerName.value.trim();
        const paternalSurname =
          registerForm.registerPaternalSurname.value.trim();
        const maternalSurname =
          registerForm.registerMaternalSurname.value.trim();
        const password = registerForm.registerPassword.value;
        const confirmPassword = registerForm.registerConfirmPassword.value;

        // Validaciones adicionales
        if (password < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }

        await this.#authService.registrarUsuario({
          name,
          paternalSurname,
          maternalSurname,
          password,
        });

        const count = await this.#countService.agregarCuenta(0, new Date(), null);
        localStorage.setItem('countId', count.id);

        this.showMessage("Registro exitoso. Por favor inicia sesión.");
        this.#isLoginView = true;
        this.render();
        this.attachEvents();
      } catch (error) {
        this.showMessage(error.message, true);
      } finally {
        this.toggleLoading(btn, false);
      }
    });
  }

  handleLoginSuccess() {
    this.dispatchEvent(
      new CustomEvent("login-success", {
        bubbles: true,
        composed: true,
      })
    );
  }

  toggleLoading(button, isLoading) {
    const spinner = button.querySelector(".spinner");
    const text = button.querySelector(".btn-text");

    if (isLoading) {
      spinner.classList.remove("hidden");
      text.classList.add("hidden");
      button.disabled = true;
    } else {
      spinner.classList.add("hidden");
      text.classList.remove("hidden");
      button.disabled = false;
    }
  }
}

customElements.define("login-form", LoginForm);
