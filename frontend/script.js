// Importa todos los componentes necesarios
import './src/components/login-form.js';
import './src/components/home-screen.js';
import './src/components/deudas-view.js';
import './src/components/grupos-view.js';
import './src/components/grupo-chat-view.js';
import './src/components/contactos-view.js';
import { AuthService } from './src/services/auth.service.js';

// Configuración inicial al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const authService = new AuthService();
    const mainContainer = document.getElementById('mainContainer');
    
    // Verifica el estado de autenticación
    if (authService.estaAutenticado()) {
        mainContainer.innerHTML = `
            <home-screen></home-screen>
            <deudas-view></deudas-view>
        `;
    } else {
        mainContainer.innerHTML = '<login-form></login-form>';
    }

    // Escucha eventos de login/logout globales
    document.addEventListener('login-success', loadAuthenticatedView);
    document.addEventListener('logout', loadLoginView);
});

function loadAuthenticatedView() {
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.innerHTML = `
        <home-screen></home-screen>
        <deudas-view></deudas-view>
    `;
}

function loadLoginView() {
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.innerHTML = '<login-form></login-form>';
}