// ===== CONFIGURACIÓN DE API =====
const API_BASE_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');

// ===== VARIABLES GLOBALES =====
let userRifas = [];
let publicRifas = [];
let selectedNumbers = [];
let winnerNumber = null;
let currentUser = null;

// ===== FUNCIONES DE API =====

/**
 * Realizar petición a la API con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise<object>} Respuesta de la API
 */
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Agregar token si está disponible
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Error ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Error en API:', error);
        throw error;
    }
}

// ===== FUNCIONES DE RIFAS API =====

/**
 * Cargar rifas públicas desde el backend
 */
async function loadPublicRifas() {
    try {
        const response = await apiRequest('/rifas');
        publicRifas = response.data || [];
        console.log('Rifas públicas cargadas:', publicRifas.length);
    } catch (error) {
        console.error('Error cargando rifas públicas:', error);
        showNotification('Error cargando rifas públicas', 'error');
    }
}

/**
 * Cargar rifas del usuario desde el backend
 */
async function loadUserRifas() {
    if (!isUserLoggedIn()) return;
    
    try {
        const response = await apiRequest('/rifas/my');
        userRifas = response.data || [];
        console.log('Rifas del usuario cargadas:', userRifas.length);
    } catch (error) {
        console.error('Error cargando rifas del usuario:', error);
        showNotification('Error cargando tus rifas', 'error');
    }
}

/**
 * Crear nueva rifa en el backend
 */
async function createRifaBackend(rifaData) {
    try {
        const response = await apiRequest('/rifas', {
            method: 'POST',
            body: JSON.stringify(rifaData)
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Editar rifa en el backend
 */
async function editRifaBackend(rifaId, rifaData) {
    try {
        await apiRequest(`/rifas/${rifaId}`, {
            method: 'PUT',
            body: JSON.stringify(rifaData)
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Eliminar rifa en el backend
 */
async function deleteRifaBackend(rifaId) {
    try {
        await apiRequest(`/rifas/${rifaId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Obtener detalles de una rifa específica
 */
async function getRifaDetails(rifaId) {
    try {
        const response = await apiRequest(`/rifas/${rifaId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Seleccionar números en una rifa
 */
async function selectRifaNumbers(rifaId, numbers, participantName = null) {
    try {
        const response = await apiRequest(`/rifas/${rifaId}/numbers`, {
            method: 'POST',
            body: JSON.stringify({
                numbers: numbers,
                participant_name: participantName
            })
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Realizar sorteo de una rifa
 */
async function drawRifaWinner(rifaId) {
    try {
        const response = await apiRequest(`/rifas/${rifaId}/draw`, {
            method: 'POST'
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ===== FUNCIONES DE AUTENTICACIÓN =====

/**
 * Verificar si el usuario está logueado
 */
function isUserLoggedIn() {
    return !!authToken && !!currentUser;
}

/**
 * Mostrar modal de login/registro
 */
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h2>🔐 Autenticación</h2>
                <button class="close-btn" onclick="closeLoginModal()">✕</button>
            </div>
            
            <div class="auth-tabs">
                <button class="auth-tab active" onclick="showLoginTab()">Iniciar Sesión</button>
                <button class="auth-tab" onclick="showRegisterTab()">Registrarse</button>
            </div>
            
            <!-- Formulario de Login -->
            <div id="loginForm" class="auth-form">
                <div class="form-group">
                    <label>Usuario o Email:</label>
                    <input type="text" id="loginUsername" placeholder="Ingresa tu usuario o email">
                </div>
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" id="loginPassword" placeholder="Ingresa tu contraseña">
                </div>
                <button class="btn btn-primary" onclick="handleLogin()" style="width: 100%;">
                    👤 Iniciar Sesión
                </button>
            </div>
            
            <!-- Formulario de Registro -->
            <div id="registerForm" class="auth-form" style="display: none;">
                <div class="form-group">
                    <label>Nombre de usuario:</label>
                    <input type="text" id="registerUsername" placeholder="Elige un nombre de usuario">
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="registerEmail" placeholder="tu@email.com">
                </div>
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" id="registerPassword" placeholder="Mínimo 6 caracteres">
                </div>
                <button class="btn btn-success" onclick="handleRegister()" style="width: 100%;">
                    ✨ Crear Cuenta
                </button>
            </div>
        </div>
    `;
    
    // Agregar estilos para el modal
    const styles = `
        <style>
        .auth-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .auth-modal-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        }
        
        .auth-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .auth-tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .auth-tab {
            flex: 1;
            padding: 10px;
            border: none;
            background: none;
            cursor: pointer;
            border-bottom: 2px solid transparent;
        }
        
        .auth-tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px) scale(0.8); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(modal);
}

function closeLoginModal() {
    const modal = document.querySelector('.auth-modal');
    if (modal) {
        modal.remove();
    }
}

function showLoginTab() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
}

function showRegisterTab() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

/**
 * Manejar login del usuario
 */
async function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        showNotification('Iniciando sesión...', 'info');
        
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        authToken = response.token;
        currentUser = response.user;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateAuthUI();
        closeLoginModal();
        
        showNotification(`¡Bienvenido ${currentUser.username}!`, 'success');
        
        await loadUserData();
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Manejar registro del usuario
 */
async function handleRegister() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !email || !password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    try {
        showNotification('Creando cuenta...', 'info');
        
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        authToken = response.token;
        currentUser = response.user;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateAuthUI();
        closeLoginModal();
        
        showNotification(`¡Cuenta creada exitosamente! Bienvenido ${currentUser.username}!`, 'success');
        
        await loadUserData();
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function login() {
    showLoginModal();
}

/**
 * Cerrar sesión del usuario
 */
async function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        try {
            if (authToken) {
                await apiRequest('/auth/logout', { method: 'POST' });
            }
        } catch (error) {
            console.log('Error al hacer logout en el servidor:', error);
        }
        
        authToken = null;
        currentUser = null;
        userRifas = [];
        selectedNumbers = [];
        winnerNumber = null;
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        updateAuthUI();
        navigateTo('demo');
        
        showNotification('Sesión cerrada exitosamente');
    }
}

/**
 * Actualizar interfaz de autenticación
 */
function updateAuthUI() {
    const userSection = document.getElementById('userSection');
    const loginSection = document.getElementById('loginSection');
    const perfilNavItem = document.getElementById('perfilNavItem');
    const userName = document.getElementById('userName');
    
    if (isUserLoggedIn()) {
        if (userSection) userSection.style.display = 'flex';
        if (loginSection) loginSection.style.display = 'none';
        if (perfilNavItem) perfilNavItem.style.display = 'block';
        if (userName) userName.textContent = currentUser.username;
    } else {
        if (userSection) userSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'flex';
        if (perfilNavItem) perfilNavItem.style.display = 'none';
    }
}

/**
 * Cargar datos del usuario desde el servidor
 */
async function loadUserData() {
    if (!isUserLoggedIn()) return;
    
    try {
        await loadUserRifas();
        console.log('Datos del usuario cargados');
    } catch (error) {
        console.error('Error cargando datos del usuario:', error);
    }
}

/**
 * Verificar sesión al cargar la página
 */
function checkAuthStatus() {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
        try {
            authToken = storedToken;
            currentUser = JSON.parse(storedUser);
            updateAuthUI();
            loadUserData();
        } catch (error) {
            console.error('Error restaurando sesión:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
    }
}

// ===== FUNCIONES DE NAVEGACIÓN =====

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function navigateTo(page) {
    if (page === 'perfil' && !isUserLoggedIn()) {
        showNotification('Debes iniciar sesión para acceder a tu perfil', 'error');
        showLoginModal();
        return;
    }
    
    switch(page) {
        case 'rifas':
            showRifasPage();
            updateActiveNav('rifas');
            break;
        case 'perfil':
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

function updateActiveNav(activePage) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    let pageIndex;
    switch(activePage) {
        case 'demo': pageIndex = 0; break;
        case 'rifas': pageIndex = 1; break;
        case 'perfil': pageIndex = 2; break;
        default: pageIndex = 0;
    }
    
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks[pageIndex]) {
        navLinks[pageIndex].classList.add('active');
    }
}

// ===== FUNCIONES DE PÁGINAS =====

/**
 * Mostrar página de simulaciones públicas
 */
async function showRifasPage() {
    // Cargar rifas públicas
    await loadPublicRifas();
    
    document.querySelector('.container').innerHTML = `
        <div class="page-header">
            <h1>🎊 Simulaciones Públicas</h1>
            <p class="subtitle">Ejemplos desarrollados en Talento Tech curso NODE.JS</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0; color: #666; font-style: italic;">
                🎯 <strong>Proyecto Educativo</strong> - Simulaciones para aprender desarrollo backend
            </p>
        </div>
        
        <div class="rifas-grid">
            ${generatePublicRifasHTML()}
            ${generateUserRifasHTML()}
        </div>
        
        <div class="back-to-demo">
            <button class="btn btn-secondary" onclick="navigateTo('demo')">← Volver al Inicio</button>
        </div>
    `;
}

/**
 * Generar HTML para rifas públicas
 */
function generatePublicRifasHTML() {
    if (publicRifas.length === 0) {
        return `
            <div class="rifa-card">
                <div class="rifa-image">🎮</div>
                <h3>PlayStation 5</h3>
                <p class="rifa-description">Ejemplo de simulación para evento gaming</p>
                <div class="rifa-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 65%"></div>
                    </div>
                    <span class="progress-text">65/100 números seleccionados</span>
                </div>
                <div class="rifa-price" style="color: #2196f3;">Simulación educativa</div>
                <button class="btn btn-primary" onclick="showRifaDetail('demo', 'ps5')">Ver Simulación</button>
            </div>
        `;
    }
    
    return publicRifas.map(rifa => `
        <div class="rifa-card">
            <div class="rifa-image">🎁</div>
            <h3>${rifa.title}</h3>
            <p class="rifa-description">${rifa.description || 'Sin descripción'}</p>
            <div class="rifa-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(rifa.numbers_selected / (rifa.max_numbers || 100)) * 100}%"></div>
                </div>
                <span class="progress-text">${rifa.numbers_selected}/${rifa.max_numbers || 100} números seleccionados</span>
            </div>
            <div class="rifa-price" style="color: #2196f3;">
                ${rifa.price_per_number ? `$${rifa.price_per_number} por número` : 'Gratuita'}
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #666;">
                Creada por: ${rifa.creator}
            </div>
            <button class="btn btn-primary" onclick="showRifaDetail('public', ${rifa.id})">Ver Simulación</button>
        </div>
    `).join('');
}

/**
 * Generar HTML para rifas del usuario
 */
function generateUserRifasHTML() {
    if (!isUserLoggedIn() || userRifas.length === 0) return '';
    
    return userRifas.map(rifa => `
        <div class="rifa-card">
            <div class="rifa-image">🎯</div>
            <h3>${rifa.title}</h3>
            <p class="rifa-description">${rifa.description || 'Sin descripción'}</p>
            <div class="rifa-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(rifa.numbers_selected / (rifa.max_numbers || 100)) * 100}%"></div>
                </div>
                <span class="progress-text">${rifa.numbers_selected}/${rifa.max_numbers || 100} números seleccionados</span>
            </div>
            <div class="rifa-price" style="color: #2196f3;">
                ${rifa.price_per_number ? `$${rifa.price_per_number} por número` : 'Gratuita'}
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #4caf50;">
                <strong>Mi rifa</strong> - Estado: ${rifa.status === 'completed' ? 'Completada' : 'Activa'}
            </div>
            <button class="btn btn-primary" onclick="showRifaDetail('user', ${rifa.id})">Ver Simulación</button>
        </div>
    `).join('');
}

/**
 * Mostrar detalles de una rifa específica
 */
async function showRifaDetail(type, rifaId) {
    try {
        let rifaData;
        
        if (type === 'demo') {
            // Datos de demostración
            rifaData = {
                id: rifaId,
                title: rifaId === 'ps5' ? 'PlayStation 5' : 'Rifa de Ejemplo',
                description: 'Simulación educativa de Talento Tech',
                selected_numbers: [],
                numbers_selected: 0,
                max_numbers: 100,
                price_per_number: null,
                status: 'active'
            };
        } else {
            showNotification('Cargando detalles de la rifa...', 'info');
            rifaData = await getRifaDetails(rifaId);
        }
        
        document.querySelector('.container').innerHTML = `
            <div class="page-header">
                <h1>🎯 ${rifaData.title}</h1>
                <p class="subtitle">${rifaData.description || 'Simulación de rifa'}</p>
            </div>
            
            <div class="rifa-detail-content">
                <div class="numbers-section">
                    <div class="controls">
                        <button class="btn btn-secondary" onclick="selectRandomNumberRifa()">
                            🎯 Elegir al Azar
                        </button>
                        <button class="btn btn-primary" onclick="clearRifaSelection()">
                            🗑️ Limpiar Todo
                        </button>
                        ${type === 'user' && rifaData.status === 'active' ? 
                            `<button class="btn btn-success" onclick="performRifaDraw(${rifaId})">
                                🏆 Realizar Sorteo
                            </button>` : ''
                        }
                    </div>
                    
                    <div class="numbers-grid" id="rifaNumbersGrid">
                        <!-- Los números se generan con JavaScript -->
                    </div>
                    
                    ${type !== 'demo' ? 
                        `<div style="margin-top: 20px;">
                            <input type="text" id="participantName" placeholder="Tu nombre (opcional)" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; margin-bottom: 10px;">
                            <button class="btn btn-success" onclick="confirmRifaNumbers(${rifaId})" style="width: 100%;">
                                🎫 Confirmar Números Seleccionados
                            </button>
                        </div>` : ''
                    }
                </div>
                
                <div class="cart-section">
                    <div class="cart-header">
                        <span class="cart-icon">🎯</span>
                        <h3 class="cart-title">Información de la Rifa</h3>
                    </div>
                    
                    <div style="padding: 15px; font-size: 0.9rem;">
                        <p><strong>Título:</strong> ${rifaData.title}</p>
                        <p><strong>Números totales:</strong> ${rifaData.max_numbers || 100}</p>
                        <p><strong>Números ocupados:</strong> ${rifaData.numbers_selected || 0}</p>
                        <p><strong>Disponibles:</strong> ${(rifaData.max_numbers || 100) - (rifaData.numbers_selected || 0)}</p>
                        ${rifaData.price_per_number ? 
                            `<p><strong>Precio:</strong> $${rifaData.price_per_number} por número</p>` : 
                            '<p><strong>Precio:</strong> Gratuita</p>'
                        }
                        <p><strong>Estado:</strong> ${rifaData.status === 'completed' ? 'Completada' : 'Activa'}</p>
                        ${rifaData.winner_number !== undefined && rifaData.winner_number !== null ? 
                            `<p><strong>🏆 Ganador:</strong> Número ${rifaData.winner_number.toString().padStart(2, '0')}</p>` : ''
                        }
                    </div>
                    
                    <div class="cart-items" id="selectedRifaNumbers">
                        <div class="empty-cart">No has seleccionado números aún</div>
                    </div>
                </div>
            </div>
            
            <div class="back-buttons">
                <button class="btn btn-secondary" onclick="navigateTo('rifas')">← Volver a Rifas</button>
                <button class="btn btn-secondary" onclick="navigateTo('demo')">Ir al Inicio</button>
            </div>
        `;
        
        // Generar grilla con números ocupados
        generateRifaDetailGrid(rifaData.selected_numbers || []);
        
    } catch (error) {
        console.error('Error cargando detalles de rifa:', error);
        showNotification('Error cargando los detalles de la rifa', 'error');
        navigateTo('rifas');
    }
}

/**
 * Generar grilla de números para detalles de rifa
 */
function generateRifaDetailGrid(occupiedNumbers) {
    const grid = document.getElementById('rifaNumbersGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    selectedNumbers = []; // Reiniciar selección
    
    const occupiedSet = new Set(occupiedNumbers.map(n => n.number || n));
    
    for (let i = 0; i <= 99; i++) {
        const cell = document.createElement('div');
        cell.className = 'number-cell';
        cell.textContent = i.toString().padStart(2, '0');
        cell.id = `rifa-number-${i}`;
        
        if (occupiedSet.has(i)) {
            cell.classList.add('sold');
            cell.style.background = '#ff6b6b';
            cell.style.color = 'white';
            cell.style.cursor = 'not-allowed';
            cell.title = 'Número ya seleccionado';
        } else {
            cell.onclick = () => toggleRifaNumber(i);
        }
        
        grid.appendChild(cell);
    }
}

/**
 * Alternar selección de número en rifa
 */
function toggleRifaNumber(number) {
    const cell = document.getElementById(`rifa-number-${number}`);
    if (cell.classList.contains('sold')) return;
    
    const index = selectedNumbers.indexOf(number);
    
    if (index > -1) {
        selectedNumbers.splice(index, 1);
        cell.classList.remove('selected');
    } else {
        selectedNumbers.push(number);
        cell.classList.add('selected');
    }
    
    updateRifaCart();
}

/**
 * Actualizar carrito de números de rifa
 */
function updateRifaCart() {
    const cartItems = document.getElementById('selectedRifaNumbers');
    if (!cartItems) return;
    
    if (selectedNumbers.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">No has seleccionado números aún</div>';
        return;
    }
    
    const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
    cartItems.innerHTML = `
        <div style="padding: 10px;">
            <strong>Números seleccionados (${selectedNumbers.length}):</strong>
            <div style="margin-top: 10px;">
                ${sortedNumbers.map(number => `
                    <span style="display: inline-block; background: #4caf50; color: white; 
                                 padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 0.8rem;">
                        ${number.toString().padStart(2, '0')}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Seleccionar número aleatorio en rifa
 */
function selectRandomNumberRifa() {
    const occupiedNumbers = [];
    document.querySelectorAll('.number-cell.sold').forEach(cell => {
        const number = parseInt(cell.textContent);
        occupiedNumbers.push(number);
    });
    
    const availableNumbers = [];
    for (let i = 0; i <= 99; i++) {
        if (!occupiedNumbers.includes(i) && !selectedNumbers.includes(i)) {
            availableNumbers.push(i);
        }
    }
    
    if (availableNumbers.length === 0) {
        showNotification('No hay números disponibles', 'error');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomNumber = availableNumbers[randomIndex];
    
    selectedNumbers.push(randomNumber);
    document.getElementById(`rifa-number-${randomNumber}`).classList.add('selected');
    updateRifaCart();
}

/**
 * Limpiar selección de números en rifa
 */
function clearRifaSelection() {
    selectedNumbers.forEach(number => {
        const cell = document.getElementById(`rifa-number-${number}`);
        if (cell) cell.classList.remove('selected');
    });
    selectedNumbers = [];
    updateRifaCart();
}

/**
 * Confirmar números seleccionados en rifa
 */
async function confirmRifaNumbers(rifaId) {
    if (selectedNumbers.length === 0) {
        showNotification('Primero selecciona algunos números', 'error');
        return;
    }
    
    const participantName = document.getElementById('participantName')?.value.trim() || null;
    
    try {
        showNotification('Confirmando números...', 'info');
        
        await selectRifaNumbers(rifaId, selectedNumbers, participantName);
        
        showNotification(`¡${selectedNumbers.length} números confirmados exitosamente!`, 'success');
        
        // Recargar detalles de la rifa
        setTimeout(() => {
            showRifaDetail('public', rifaId);
        }, 1500);
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Realizar sorteo de rifa
 */
async function performRifaDraw(rifaId) {
    if (!confirm('¿Estás seguro de que quieres realizar el sorteo? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        showNotification('Realizando sorteo...', 'info');
        
        const result = await drawRifaWinner(rifaId);
        
        showNotification(`¡Sorteo completado! Ganador: Número ${result.winner_number.toString().padStart(2, '0')}`, 'success');
        
        // Recargar detalles de la rifa
        setTimeout(() => {
            showRifaDetail('user', rifaId);
        }, 2000);
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Mostrar página de perfil del usuario
 */
async function showPerfilPage() {
    const userInfo = currentUser ? `
        <div class="profile-section">
            <h3>👤 Información del Usuario</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #4caf50;">
                <p><strong>Usuario:</strong> ${currentUser.username}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Miembro desde:</strong> ${new Date(currentUser.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
        </div>
    ` : '';

    document.querySelector('.container').innerHTML = `
        <div class="page-header">
            <h1>👤 Mi Perfil</h1>
            <p class="subtitle">Panel de estudiante - Talento Tech curso NODE.JS</p>
        </div>
        
        <div class="profile-content">
            ${userInfo}
            
            <div class="profile-section">
                <h3>📊 Mis Estadísticas de Aprendizaje</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">5</div>
                        <div class="stat-label">Simulaciones Probadas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${userRifas.length}</div>
                        <div class="stat-label">Proyectos Creados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">1</div>
                        <div class="stat-label">Módulos Completados</div>
                    </div>
                </div>
            </div>
            
            <div class="profile-section">
                <h3>➕ Crear Nueva Simulación</h3>
                <p style="color: #666; margin-bottom: 15px; font-style: italic;">
                    🎯 Crea simulaciones para proyectos educativos
                </p>
                <div class="create-rifa-form">
                    <input type="text" placeholder="Título del proyecto" class="form-input" id="rifaTitle">
                    <textarea placeholder="Descripción del ejercicio" class="form-textarea" id="rifaDescription"></textarea>
                    <input type="number" placeholder="Precio por número (opcional)" class="form-input" id="rifaPrice" min="0" step="0.01">
                    <button type="button" class="btn btn-success" onclick="createNewRifa()">Crear Simulación</button>
                </div>
            </div>
            
            <div class="profile-section" id="userRifasSection">
                <h3>🎯 Mis Simulaciones Creadas</h3>
                <div id="userRifasList">
                    ${userRifas.length === 0 ? '<p style="color: #666; text-align: center; padding: 20px;">No has creado ninguna simulación aún</p>' : ''}
                </div>
            </div>
        </div>
        
        <div class="back-to-demo">
            <button class="btn btn-secondary" onclick="navigateTo('demo')">← Volver al Inicio</button>
        </div>
    `;
    
    setTimeout(() => {
        updateUserRifasList();
    }, 100);
}

/**
 * Mostrar página demo
 */
function showDemoPage() {
    document.querySelector('.container').innerHTML = `
        <header>
            <h1>🎲 Simulador de Rifas</h1>
            <p class="subtitle">Proyecto desarrollado en Talento Tech curso NODE.JS</p>
        </header>

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
                    <span class="cart-icon">🛒</span>
                    <h3 class="cart-title">Mis Números</h3>
                    <div class="cart-count" id="cartCount">0</div>
                </div>
                
                <div class="cart-items" id="cartItems">
                    <div class="empty-cart">
                        No has seleccionado números aún
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%;" onclick="drawWinner()">
                    🎊 ¡Simular Sorteo!
                </button>
            </div>
        </div>
    `;
    
    selectedNumbers = [];
    winnerNumber = null;
    generateNumbersGrid();
    updateCart();
}

// ===== FUNCIONES DEL SIMULADOR BÁSICO =====

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

function toggleNumber(number) {
    const cell = document.getElementById(`number-${number}`);
    const index = selectedNumbers.indexOf(number);
    
    if (index > -1) {
        selectedNumbers.splice(index, 1);
        cell.classList.remove('selected');
    } else {
        selectedNumbers.push(number);
        cell.classList.add('selected');
    }
    
    updateCart();
}

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

function selectRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 100);
    
    if (!selectedNumbers.includes(randomNumber)) {
        selectedNumbers.push(randomNumber);
        document.getElementById(`number-${randomNumber}`).classList.add('selected');
        updateCart();
    }
}

function clearSelection() {
    selectedNumbers.forEach(number => {
        const cell = document.getElementById(`number-${number}`);
        if (cell) {
            cell.classList.remove('selected', 'winner');
        }
    });
    selectedNumbers = [];
    winnerNumber = null;
    updateCart();
    
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        winnerModal.style.display = 'none';
    }
}

function drawWinner() {
    if (selectedNumbers.length === 0) {
        showNotification('¡Primero debes seleccionar al menos un número!', 'error');
        return;
    }

    if (winnerNumber !== null) {
        const cell = document.getElementById(`number-${winnerNumber}`);
        if (cell) cell.classList.remove('winner');
    }

    const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
    winnerNumber = selectedNumbers[randomIndex];
    
    const winnerCell = document.getElementById(`number-${winnerNumber}`);
    if (winnerCell) winnerCell.classList.add('winner');
    
    showWinnerModal();
}

function showWinnerModal() {
    const modal = document.getElementById('winnerModal');
    const winnerDisplay = document.getElementById('winnerNumber');
    const winnerText = document.getElementById('winnerText');
    
    if (modal && winnerDisplay && winnerText) {
        winnerDisplay.textContent = winnerNumber.toString().padStart(2, '0');
        winnerText.textContent = winnerNumber.toString().padStart(2, '0');
        modal.style.display = 'flex';
    }
}

function closeWinnerModal() {
    const modal = document.getElementById('winnerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function resetGame() {
    clearSelection();
    closeWinnerModal();
}

// ===== FUNCIONES DE GESTIÓN DE RIFAS =====

/**
 * Crear nueva rifa
 */
async function createNewRifa() {
    if (!isUserLoggedIn()) {
        showNotification('Debes iniciar sesión para crear simulaciones', 'error');
        showLoginModal();
        return;
    }

    const titleElement = document.getElementById('rifaTitle');
    const descriptionElement = document.getElementById('rifaDescription');
    const priceElement = document.getElementById('rifaPrice');
    
    if (!titleElement || !descriptionElement || !priceElement) {
        showNotification('Error: No se encontraron los campos del formulario', 'error');
        return;
    }
    
    const title = titleElement.value.trim();
    const description = descriptionElement.value.trim();
    const price = parseFloat(priceElement.value) || null;
    
    if (!title) {
        showNotification('El título es obligatorio', 'error');
        return;
    }
    
    if (price !== null && price < 0) {
        showNotification('El precio no puede ser negativo', 'error');
        return;
    }
    
    try {
        showNotification('Creando simulación...', 'info');
        
        const newRifa = await createRifaBackend({
            title: title,
            description: description || null,
            price_per_number: price
        });
        
        titleElement.value = '';
        descriptionElement.value = '';
        priceElement.value = '';
        
        // Recargar rifas del usuario
        await loadUserRifas();
        updateUserRifasList();
        
        const statNumber = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (statNumber) {
            statNumber.textContent = userRifas.length;
        }
        
        showNotification(`¡Simulación "${title}" creada exitosamente!`, 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Actualizar lista de rifas del usuario
 */
function updateUserRifasList() {
    const userRifasList = document.getElementById('userRifasList');
    
    if (!userRifasList) return;
    
    if (userRifas.length === 0) {
        userRifasList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No has creado ninguna simulación aún</p>';
        return;
    }
    
    userRifasList.innerHTML = userRifas.map(rifa => `
        <div class="user-rifa-card">
            <div class="user-rifa-header">
                <h4>${rifa.title}</h4>
                <span class="rifa-date">Creada: ${new Date(rifa.created_at).toLocaleDateString()}</span>
            </div>
            <p class="user-rifa-description">${rifa.description || 'Sin descripción'}</p>
            <div class="user-rifa-stats">
                <span class="stat-item">💰 ${rifa.price_per_number ? `$${rifa.price_per_number} por número` : 'Gratuita'}</span>
                <span class="stat-item">📊 ${rifa.numbers_selected || 0}/100 números</span>
                <span class="stat-item">🎯 Estado: ${rifa.status === 'completed' ? 'Completada' : 'Activa'}</span>
            </div>
            <div class="user-rifa-actions">
                <button class="btn btn-secondary btn-small" onclick="editRifa(${rifa.id})">✏️ Editar</button>
                <button class="btn btn-primary btn-small" onclick="deleteRifa(${rifa.id})">🗑️ Eliminar</button>
                <button class="btn btn-success btn-small" onclick="showRifaDetail('user', ${rifa.id})">👁️ Ver</button>
            </div>
        </div>
    `).join('');
}

/**
 * Editar rifa
 */
async function editRifa(rifaId) {
    const rifa = userRifas.find(r => r.id === rifaId);
    if (!rifa) return;
    
    const newTitle = prompt('Nuevo título:', rifa.title);
    if (newTitle === null) return;
    
    const newDescription = prompt('Nueva descripción:', rifa.description || '');
    if (newDescription === null) return;
    
    const newPrice = prompt('Nuevo precio (dejar vacío para gratuita):', rifa.price_per_number || '');
    if (newPrice === null) return;
    
    if (!newTitle.trim()) {
        showNotification('El título es obligatorio', 'error');
        return;
    }
    
    const priceValue = parseFloat(newPrice) || null;
    if (priceValue !== null && priceValue < 0) {
        showNotification('El precio no puede ser negativo', 'error');
        return;
    }
    
    try {
        showNotification('Actualizando simulación...', 'info');
        
        await editRifaBackend(rifaId, {
            title: newTitle.trim(),
            description: newDescription.trim() || null,
            price_per_number: priceValue
        });
        
        // Recargar rifas del usuario
        await loadUserRifas();
        updateUserRifasList();
        
        showNotification('Simulación actualizada exitosamente!', 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Eliminar rifa
 */
async function deleteRifa(rifaId) {
    const rifa = userRifas.find(r => r.id === rifaId);
    if (!rifa) return;
    
    if (!confirm(`¿Estás seguro de que quieres eliminar la simulación "${rifa.title}"?`)) {
        return;
    }
    
    try {
        showNotification('Eliminando simulación...', 'info');
        
        await deleteRifaBackend(rifaId);
        
        // Recargar rifas del usuario
        await loadUserRifas();
        updateUserRifasList();
        
        const statNumber = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (statNumber) {
            statNumber.textContent = userRifas.length;
        }
        
        showNotification('Simulación eliminada exitosamente!', 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Mostrar notificaciones
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : type === 'info' ? 'info' : ''}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : type === 'info' ? '#54a0ff' : '#4caf50'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', function() {
    generateNumbersGrid();
    updateCart();
    checkAuthStatus();
    
    // Cargar datos iniciales
    loadPublicRifas();
    
    console.log('Simulador de Rifas inicializado - Talento Tech curso NODE.JS');
    console.log('Backend API:', API_BASE_URL);
});