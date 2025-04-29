export class LoginForm extends HTMLElement {
  connectecCallback() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.innerHTML = `
        <section class="login-container">
        <form id="loginForm">
          <h2>Iniciar Sesión</h2>
          <label for="email">Correo electrónico</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Contraseña</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Ingresar</button>
          <p class="extra">¿Olvidaste tu contraseña?</p>
        </form>
      </section>
        `;
  }

  attachEvents() {
    const form = this.querySelector('#loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.email.value;
        const password = form.password.value;

        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error('Credenciales incorrectas');

            const data = await res.json();
            alert("Sesion iniciada correctamente");

            // Guardar el token en el localStorage
            localStorage.setItem('authToken', data.token);

            this.dispatchEvent(new CustomEvent("login-success", {
                bubbles: true,
                composed: true,
                detail: data
            }));
        } catch (err) {
            alert(err.message);
        }
    });
  }
}

customElements.define('login-form', LoginForm);