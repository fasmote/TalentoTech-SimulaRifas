/* SIMULADOR DE RIFAS - JAVASCRIPT PRINCIPAL
   Proyecto TalentoTech - SimulaRifas
   Archivo: script.js
   ====================================== */

// ========== VARIABLES GLOBALES ==========
let currentUser = null;
let selectedNumbers = [];
let winnerNumber = null;
let currentRifa = null;
let isAuthMode = 'login';
let accessedByCode = false;

// API Base URL
const API_BASE = '/api';

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    navigateTo('demo');
});

// ========== FUNCIONES DE UTILIDAD ==========

/**
 * Toggle de contraseña mejorado
 */
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '🙈';
    } else {
        input.type = 'password';
        button.innerHTML = '👁️';
    }
}

/**
 * Eliminar número específico de un usuario
 */
function removeUserNumber(number, userName, rifaId) {
    if (confirm(`¿Eliminar el número ${number} de ${userName}?`)) {
        removeNumberFromRifa(rifaId, number, userName);
    }
}

/**
 * Eliminar todos los números de un usuario
 */
function removeAllUserNumbers(userName, rifaId) {
    if (confirm(`¿Eliminar TODOS los números de ${userName}? Esta acción no se puede deshacer.`)) {
        removeAllNumbersFromUser(rifaId, userName);
    }
}

/**
 * API para eliminar número específico
 */
async function removeNumberFromRifa(rifaId, number, userName) {
    try {
        const response = await fetch(`${API_BASE}/rifas/${rifaId}/numbers/${number}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ participant_name: userName })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(`Número ${number} eliminado de ${userName}`);
            viewRifa(rifaId);
        } else {
            showNotification(data.error || 'Error eliminando número', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

/**
 * API para eliminar todos los números de un usuario
 */
async function removeAllNumbersFromUser(rifaId, userName) {
    try {
        const response = await fetch(`${API_BASE}/rifas/${rifaId}/users/${encodeURIComponent(userName)}/numbers`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(`Todos los números de ${userName} han sido eliminados`);
            viewRifa(rifaId);
        } else {
            showNotification(data.error || 'Error eliminando números', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

// ========== SISTEMA DE NOTIFICACIONES ==========

/**
 * Mostrar notificación temporal
 */
function showNotification(message, type = 'success') {
    // Remover notificación existente si la hay
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// ========== AUTENTICACIÓN ==========

/**
 * Verificar estado de autenticación al cargar
 */
async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                updateNavForLoggedUser();
            } else {
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            localStorage.removeItem('authToken');
        }
    }
}

/**
 * Actualizar navegación para usuario logueado
 */
function updateNavForLoggedUser() {
    const userInfo = document.getElementById('userInfo');
    const authBtn = document.getElementById('authBtn');
    const perfilLink = document.getElementById('perfilLink');
    
    if (currentUser) {
        userInfo.textContent = `Hola, ${currentUser.username}`;
        userInfo.style.display = 'block';
        authBtn.textContent = 'Cerrar Sesión';
        authBtn.onclick = logout;
        
        if (perfilLink) {
            perfilLink.style.display = 'block';
        }
    } else {
        userInfo.style.display = 'none';
        authBtn.textContent = 'Iniciar Sesión';
        authBtn.onclick = showAuthModal;
        
        if (perfilLink) {
            perfilLink.style.display = 'none';
        }
    }
}

/**
 * Mostrar modal de autenticación
 */
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    switchAuthMode('login');
}

/**
 * Cerrar modal de autenticación
 */
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('authForm').reset();
}

/**
 * Cambiar entre modo login y registro
 */
function switchAuthMode(mode = null) {
    const title = document.getElementById('authTitle');
    const emailField = document.getElementById('authEmail');
    const submitBtn = document.getElementById('authSubmit');
    const switchLink = document.getElementById('authSwitch');
    
    if (mode) {
        isAuthMode = mode;
    } else {
        isAuthMode = isAuthMode === 'login' ? 'register' : 'login';
    }
    
    if (isAuthMode === 'register') {
        title.textContent = 'Registrarse';
        emailField.style.display = 'block';
        emailField.required = true;
        submitBtn.textContent = 'Registrarse';
        switchLink.textContent = '¿Ya tienes cuenta? Inicia sesión';
    } else {
        title.textContent = 'Iniciar Sesión';
        emailField.style.display = 'none';
        emailField.required = false;
        submitBtn.textContent = 'Ingresar';
        switchLink.textContent = '¿No tienes cuenta? Regístrate';
    }
}

/**
 * Procesar formulario de autenticación
 */
document.getElementById('authForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('authUsername').value;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    
    try {
        const endpoint = isAuthMode === 'register' ? 'register' : 'login';
        const body = isAuthMode === 'register' 
            ? { username, email, password }
            : { username, password };
        
        const response = await fetch(`${API_BASE}/auth/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            updateNavForLoggedUser();
            closeAuthModal();
            showNotification(data.message);
            navigateTo('perfil');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        showNotification('Error de conexión', 'error');
    }
});

/**
 * Cerrar sesión
 */
async function logout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
    } catch (error) {
        console.error('Error en logout:', error);
    }
    
    localStorage.removeItem('authToken');
    currentUser = null;
    updateNavForLoggedUser();
    showNotification('Sesión cerrada');
    navigateTo('demo');
}

// ========== NAVEGACIÓN ==========

/**
 * Toggle del menú móvil
 */
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

/**
 * Navegación entre páginas
 */
function navigateTo(page) {
    switch(page) {
        case 'rifas':
            showRifasPage();
            updateActiveNav('rifas');
            break;
        case 'codigo':
            showCodigoPage();
            updateActiveNav('codigo');
            break;
        case 'perfil':
            if (!currentUser) {
                showAuthModal();
                return;
            }
            showPerfilPage();
            updateActiveNav('perfil');
            break;
        case 'demo':
            showDemoPage();
            updateActiveNav('demo');
            break;
    }
    
    document.getElementById('navLinks').classList.remove('active');
}

/**
 * Actualizar navegación activa
 */
function updateActiveNav(activePage) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    const pageIndex = activePage === 'demo' ? 0 : 
                     activePage === 'rifas' ? 1 : 
                     activePage === 'codigo' ? 2 : 3;
    const links = document.querySelectorAll('.nav-links a');
    if (links[pageIndex]) {
        links[pageIndex].classList.add('active');
    }
}

// ========== PÁGINAS ==========

/**
 * Mostrar página demo/inicio
 */
function showDemoPage() {
    document.getElementById('mainContainer').innerHTML = `
        <header>
            <h1>🎲 Simulador de Rifas</h1>
            <p class="subtitle">Simula sorteos para eventos, fiestas y actividades grupales</p>
        </header>

        <div class="legal-notice">
            <strong>Aviso Legal:</strong> Esta es una aplicación de simulación educativa. No involucra dinero real ni constituye un juego de apuestas. Cumple con la normativa argentina sobre juegos.
        </div>

        <div class="main-content">
            <div class="numbers-section">
                <div class="controls">
                    <button class="btn btn-secondary" onclick="selectRandomNumber()">
                        🎯 Elegir al Azar
                    </button>
                    <button class="btn btn-primary" onclick="clearSelection()">
                        🗑️ Limpiar Todo
                    </button>
                    <button class="btn btn-success" onclick="drawWinner()">
                        🏆 Simular Sorteo
                    </button>
                </div>
                
                <div class="numbers-grid" id="numbersGrid">
                    <!-- Los números se generan con JavaScript -->
                </div>
            </div>

            <div class="cart-section">
                <div class="cart-header">
                    <span class="cart-icon">🎯</span>
                    <h3 class="cart-title">Números Seleccionados</h3>
                    <div class="cart-count" id="cartCount">0</div>
                </div>
                
                <div class="cart-items" id="cartItems">
                    <div class="empty-cart">
                        No has seleccionado números aún
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-bottom: 15px;" onclick="drawWinner()">
                    🎊 ¡Simular Sorteo!
                </button>
                
                <div style="margin-bottom: 15px;">
                    <p style="font-size: 0.9rem; color: #666; text-align: center;">
                        💡 ¿Quieres crear tus propias simulaciones privadas?
                    </p>
                    <button class="btn btn-secondary" style="width: 100%;" onclick="showAuthModal()">
                        👤 Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    `;
    
    selectedNumbers = [];
    winnerNumber = null;
    currentRifa = null;
    accessedByCode = false;
    generateNumbersGrid();
    updateCart();
}

// ========== SIMULADOR (MODO DEMO) ==========

/**
 * Generar grid de números 00-99
 */
function generateNumbersGrid() {
    const grid = document.getElementById('numbersGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (let i = 0; i <= 99; i++) {
        const cell = document.createElement('div');
        cell.className = 'number-cell';
        cell.textContent = i.toString().padStart(2, '0');
        cell.onclick = () => toggleNumber(i);
        cell.id = `number-${i}`;
        
        grid.appendChild(cell);
    }
}

/**
 * Toggle selección de número
 */
function toggleNumber(number) {
    const cell = document.getElementById(`number-${number}`);
    if (!cell || cell.classList.contains('sold')) return;
    
    const index = selectedNumbers.indexOf(number);
    
    if (index > -1) {
        selectedNumbers.splice(index, 1);
        cell.classList.remove('selected');
        const deleteBtn = cell.querySelector('.delete-number');
        if (deleteBtn) {
            deleteBtn.remove();
        }
    } else {
        selectedNumbers.push(number);
        cell.classList.add('selected');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-number';
        deleteBtn.innerHTML = '✕';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            toggleNumber(number);
        };
        cell.appendChild(deleteBtn);
    }
    
    updateCart();
}

/**
 * Actualizar carrito de números
 */
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    
    if (!cartItems || !cartCount) return;
    
    cartCount.textContent = selectedNumbers.length;
    
    if (selectedNumbers.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">No has seleccionado números aún</div>';
        return;
    }
    
    const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
    cartItems.innerHTML = sortedNumbers.map(number => `
        <div class="cart-item">
            <span class="cart-item-number">${number.toString().padStart(2, '0')}</span>
            <button class="remove-btn" onclick="toggleNumber(${number})">✕</button>
        </div>
    `).join('');
}

/**
 * Seleccionar número al azar
 */
function selectRandomNumber() {
    const available = [];
    for (let i = 0; i <= 99; i++) {
        if (!selectedNumbers.includes(i)) {
            const cell = document.getElementById(`number-${i}`);
            if (cell && !cell.classList.contains('sold')) {
                available.push(i);
            }
        }
    }
    
    if (available.length > 0) {
        const randomIndex = Math.floor(Math.random() * available.length);
        const randomNumber = available[randomIndex];
        toggleNumber(randomNumber);
    }
}

/**
 * Limpiar selección
 */
function clearSelection() {
    selectedNumbers.forEach(number => {
        const cell = document.getElementById(`number-${number}`);
        if (cell) {
            cell.classList.remove('selected', 'winner');
            const deleteBtn = cell.querySelector('.delete-number');
            if (deleteBtn) {
                deleteBtn.remove();
            }
        }
    });
    selectedNumbers = [];
    winnerNumber = null;
    updateCart();
    closeWinnerModal();
}

/**
 * Realizar sorteo
 */
function drawWinner() {
    if (selectedNumbers.length === 0) {
        showNotification('¡Primero debes seleccionar al menos un número!', 'error');
        return;
    }

    // Limpiar ganador anterior
    if (winnerNumber !== null) {
        const oldWinnerCell = document.getElementById(`number-${winnerNumber}`);
        if (oldWinnerCell) {
            oldWinnerCell.classList.remove('winner');
        }
    }

    // Seleccionar ganador al azar
    const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
    winnerNumber = selectedNumbers[randomIndex];
    
    // Mostrar animación
    const winnerCell = document.getElementById(`number-${winnerNumber}`);
    if (winnerCell) {
        winnerCell.classList.add('winner');
    }
    
    showWinnerModal();
}

/**
 * Mostrar modal de ganador
 */
function showWinnerModal() {
    if (winnerNumber === null) return;
    
    document.getElementById('winnerNumber').textContent = winnerNumber.toString().padStart(2, '0');
    document.getElementById('winnerText').textContent = winnerNumber.toString().padStart(2, '0');
    document.getElementById('winnerModal').style.display = 'flex';
}

/**
 * Cerrar modal de ganador
 */
function closeWinnerModal() {
    document.getElementById('winnerModal').style.display = 'none';
}

/**
 * Resetear juego
 */
function resetGame() {
    clearSelection();
    closeWinnerModal();
}

// ========== PÁGINA RIFAS PÚBLICAS ==========

/**
 * Mostrar página de rifas públicas
 */
async function showRifasPage() {
    document.getElementById('mainContainer').innerHTML = `
        <div class="page-header">
            <h1>🎊 Simulaciones Públicas</h1>
            <p class="subtitle">Explora simulaciones de ejemplo y practica</p>
        </div>
        
        <div class="legal-notice">
            <strong>Simulaciones de Demostración:</strong> Estas son simulaciones públicas creadas para fines educativos y de demostración. No involucran dinero real.
        </div>
        
        <div class="loading">
            <p>🔄 Cargando simulaciones públicas...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/rifas`);
        const data = await response.json();
        
        if (response.ok && data.rifas && data.rifas.length > 0) {
            const rifasHtml = data.rifas.map(rifa => {
                const emoji = rifa.title.includes('iPhone') ? '📱' : 
                             rifa.title.includes('Cartera') ? '👜' : '✈️';
                const progressPercent = rifa.max_numbers ? Math.round((rifa.numbers_sold / rifa.max_numbers) * 100) : 0;
                
                return `
                    <div class="rifa-card">
                        <div class="rifa-image">${emoji}</div>
                        <h3>${rifa.title}</h3>
                        <p class="rifa-description">${rifa.description}</p>
                        <div class="rifa-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <p class="progress-text">${rifa.numbers_sold}/100 números seleccionados</p>
                        </div>
                        <div style="margin-top: 15px;">
                            <button class="btn btn-primary" onclick="viewPublicRifa(${rifa.id})" style="width: 100%;">
                                👀 Ver Detalles
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            document.getElementById('mainContainer').innerHTML = `
                <div class="page-header">
                    <h1>🎊 Simulaciones Públicas</h1>
                    <p class="subtitle">Explora simulaciones de ejemplo y practica</p>
                </div>
                
                <div class="legal-notice">
                    <strong>Simulaciones de Demostración:</strong> Estas son simulaciones públicas creadas para fines educativos y de demostración. No involucran dinero real.
                </div>
                
                <div class="rifas-grid">
                    ${rifasHtml}
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 15px;">
                        💡 ¿Quieres crear tus propias simulaciones privadas?
                    </p>
                    <button class="btn btn-success" onclick="showAuthModal()">
                        👤 Iniciar Sesión para Crear
                    </button>
                </div>
            `;
        } else {
            // Mostrar página sin rifas disponibles
            showEmptyRifasPage();
        }
    } catch (error) {
        console.error('Error cargando rifas públicas:', error);
        showErrorRifasPage();
    }
}

/**
 * Mostrar página sin rifas disponibles
 */
function showEmptyRifasPage() {
    document.getElementById('mainContainer').innerHTML = `
        <div class="page-header">
            <h1>🎊 Simulaciones Públicas</h1>
            <p class="subtitle">Explora simulaciones de ejemplo y practica</p>
        </div>
        
        <div class="legal-notice">
            <strong>Simulaciones de Demostración:</strong> Estas son simulaciones públicas creadas para fines educativos y de demostración. No involucran dinero real.
        </div>
        
        <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 15px; margin: 20px 0;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🎁</div>
            <h3 style="color: #333; margin-bottom: 15px;">No hay simulaciones públicas disponibles</h3>
            <p style="color: #666; margin-bottom: 30px;">Parece que aún no se han creado las simulaciones de demostración.</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #856404; margin: 0 0 10px 0;">🔧 Para activar el contenido demo:</h4>
                <p style="color: #856404; font-size: 0.9rem; margin: 0;">
                    Ejecuta: <code>npm run demo-content</code> en la carpeta backend
                </p>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="navigateTo('demo')">
                    🎮 Probar Simulador
                </button>
                <button class="btn btn-success" onclick="showAuthModal()">
                    ➕ Crear Cuenta
                </button>
            </div>
        </div>
    `;
}

/**
 * Mostrar página de error de conexión
 */
function showErrorRifasPage() {
    document.getElementById('mainContainer').innerHTML = `
        <div class="page-header">
            <h1>🎊 Simulaciones Públicas</h1>
            <p class="subtitle">Explora simulaciones de ejemplo y practica</p>
        </div>
        
        <div class="legal-notice">
            <strong>Error de Conexión:</strong> No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose.
        </div>
        
        <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 15px; margin: 20px 0;">
            <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
            <h3 style="color: #333; margin-bottom: 15px;">Error de Conexión</h3>
            <p style="color: #666; margin-bottom: 30px;">No se pudo conectar con el servidor backend.</p>
            
            <div style="background: #ffebee; border: 1px solid #ffcdd2; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #c62828; margin: 0 0 10px 0;">🔧 Soluciones:</h4>
                <p style="color: #c62828; font-size: 0.9rem; margin: 0; text-align: left;">
                    1. Asegúrate de que el backend esté corriendo: <code>npm run dev</code><br>
                    2. Verifica que esté en: <code>http://localhost:3000</code><br>
                    3. Ejecuta contenido demo: <code>npm run demo-content</code>
                </p>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="navigateTo('demo')">
                    🎮 Probar Simulador
                </button>
                <button class="btn btn-primary" onclick="location.reload()">
                    🔄 Reintentar
                </button>
            </div>
        </div>
    `;
}

// ========== PÁGINA ACCESO POR CÓDIGO ==========

/**
 * Mostrar página de acceso por código
 */
function showCodigoPage() {
    document.getElementById('mainContainer').innerHTML = `
        <div class="page-header">
            <h1>🔑 Acceder por Código</h1>
            <p class="subtitle">Ingresa el código de una simulación privada</p>
        </div>
        
        <div style="max-width: 500px; margin: 0 auto;">
            <div style="background: white; border-radius: 15px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🔑</div>
                <h3 style="margin-bottom: 20px; color: #333;">Código de Acceso</h3>
                <p style="color: #666; margin-bottom: 30px;">
                    Ingresa el código de 6 caracteres para acceder a la simulación
                </p>
                
                <form id="accessCodePageForm">
                    <input type="text" id="accessCodePageInput" placeholder="XXXXXX" class="form-input access-code-input" 
                           maxlength="6" pattern="[A-Za-z0-9]{6}" required style="margin-bottom: 20px;">
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 15px;">
                        🔍 Acceder a Simulación
                    </button>
                </form>
                
                <div style="background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left;">
                    <h4 style="color: #1565c0; margin: 0 0 10px 0;">✨ ¿Cómo funciona?</h4>
                    <p style="color: #1565c0; font-size: 0.9rem;">
                        • Obtén el código del creador de la simulación<br>
                        • Ingrésalo aquí para participar<br>
                        • No necesitas registrarte
                    </p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-secondary" onclick="navigateTo('demo')">
                        🎮 Probar Simulador
                    </button>
                    <button class="btn btn-success" onclick="showAuthModal()">
                        ➕ Crear Cuenta
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar event listener después de crear el HTML
    setTimeout(() => {
        const form = document.getElementById('accessCodePageForm');
        if (form) {
            form.addEventListener('submit', handleAccessCodeSubmit);
        }
    }, 100);
}

/**
 * Manejar envío de código de acceso
 */
async function handleAccessCodeSubmit(e) {
    e.preventDefault();
    
    const code = document.getElementById('accessCodePageInput').value.trim().toUpperCase();
    
    if (!code || code.length !== 6) {
        showNotification('Por favor ingresa un código válido de 6 caracteres', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '🔄 Buscando...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/rifas/access/${code}`);
        const data = await response.json();
        
        if (response.ok && data.rifa) {
            showNotification('✅ ¡Simulación encontrada!');
            viewRifaByCode(data.rifa, code);
        } else {
            showNotification(data.error || `Código "${code}" no encontrado`, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión con el servidor', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ========== COPIAR CÓDIGO ==========

/**
 * Copiar código al portapapeles
 */
async function copyCode(code) {
    if (!code || code === 'GENERANDO...') {
        showNotification('No hay código disponible para copiar', 'error');
        return;
    }
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(code);
            showNotification(`Código ${code} copiado al portapapeles`);
        } else {
            // Fallback para navegadores más antiguos
            const textArea = document.createElement('textarea');
            textArea.value = code;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showNotification(`Código ${code} copiado al portapapeles`);
            } catch (err) {
                showNotification('Error al copiar código', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    } catch (err) {
        console.error('Error copiando código:', err);
        showNotification('Error al copiar código', 'error');
    }
}

// ========== MODALES DE RIFAS ==========

/**
 * Mostrar modal de crear simulación
 */
function showCreateRifaModal() {
    document.getElementById('createRifaModal').style.display = 'flex';
}

/**
 * Cerrar modal de crear simulación
 */
function closeCreateRifaModal() {
    document.getElementById('createRifaModal').style.display = 'none';
}

/**
 * Cerrar modal de editar simulación
 */
function closeEditRifaModal() {
    document.getElementById('editRifaModal').style.display = 'none';
}

// ========== EVENT LISTENERS ==========

// Event listener para crear simulación
document.getElementById('createRifaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.getElementById('rifaTitle').value;
    const description = document.getElementById('rifaDescription').value;
    
    if (!title.trim()) {
        showNotification('El título es requerido', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/rifas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ title, description })
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification('Simulación creada exitosamente');
            closeCreateRifaModal();
            document.getElementById('createRifaForm').reset();
            showPerfilPage();
        } else {
            const data = await response.json();
            showNotification(data.error || 'Error creando simulación', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
});

// Event listener para editar simulación
document.getElementById('editRifaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const rifaId = this.dataset.rifaId;
    const title = document.getElementById('editRifaTitle').value;
    const description = document.getElementById('editRifaDescription').value;
    
    if (!rifaId) {
        showNotification('Error: ID de simulación no válido', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/rifas/${rifaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ title, description })
        });
        
        if (response.ok) {
            showNotification('Simulación actualizada exitosamente');
            closeEditRifaModal();
            viewRifa(rifaId);
        } else {
            const data = await response.json();
            showNotification(data.error || 'Error actualizando simulación', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
});

// ========== FUNCIONES PENDIENTES ==========
// Estas funciones están definidas en las otras secciones que se implementarán

/**
 * Funciones pendientes que se implementarán:
 * - showPerfilPage()
 * - viewRifa(id)
 * - editRifa(id)
 * - deleteRifa(id)
 * - drawRifaWinner(id)
 * - viewPublicRifa(id)
 * - viewRifaByCode(rifa, code)
 * - participateInRifa(id, numbers)
 */

// ========== FIN DEL ARCHIVO ==========
console.log('✅ SimulaRifas JavaScript cargado correctamente - v15u');
