// ===== CONFIGURACIÓN DEL BACKEND =====
const API_BASE_URL = 'http://localhost:3000/api';

// ===== VARIABLES GLOBALES =====
let userRifas = [];
let selectedNumbers = [];
let winnerNumber = null;
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// ===== FUNCIONES DE AUTENTICACIÓN CON BACKEND =====

/**
 * Verificar si el usuario está logueado
 * @returns {boolean} true si está logueado, false si no
 */
function isUserLoggedIn() {
    return authToken && currentUser;
}

/**
 * Verificar token y obtener usuario actual del backend
 */
async function checkSessionStatus() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        updateAuthUI(false);
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.data;
            authToken = token;
            updateAuthUI(true);
            await loadUserRifas(); // Cargar rifas del usuario
            return true;
        } else {
            // Token inválido
            localStorage.removeItem('authToken');
            authToken = null;
            currentUser = null;
            updateAuthUI(false);
            return false;
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
        // Si no puede conectar al backend, mantener UI de no logueado
        updateAuthUI(false);
        return false;
    }
}

/**
 * Mostrar modal de login
 */
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

/**
 * Mostrar modal de registro
 */
function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'flex';
}

/**
 * Cerrar modales de autenticación
 */
function closeAuthModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('registerModal').style.display = 'none';
    clearAuthFields();
}

/**
 * Limpiar campos de autenticación
 */
function clearAuthFields() {
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerConfirmPassword').value = '';
}

/**
 * Cambiar de login a registro
 */
function switchToRegister() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('registerModal').style.display = 'flex';
}

/**
 * Cambiar de registro a login
 */
function switchToLogin() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'flex';
}

/**
 * Realizar login con backend
 */
async function performLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!username || !password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        showNotification('Iniciando sesión...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login exitoso
            authToken = data.token;
            currentUser = data.user;
            
            // Guardar token en localStorage
            localStorage.setItem('authToken', authToken);
            
            updateAuthUI(true);
            closeAuthModal();
            
            // Cargar rifas del usuario
            await loadUserRifas();
            
            showNotification(`¡Bienvenido de nuevo, ${currentUser.username}!`);
        } else {
            showNotification(data.message || 'Error en el login', 'error');
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        showNotification('Error conectando al servidor. ¿Está ejecutándose el backend?', 'error');
    }
}

/**
 * Realizar registro con backend
 */
async function performRegister() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    
    // Validaciones del frontend
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 4) {
        showNotification('La contraseña debe tener al menos 4 caracteres', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }
    
    try {
        showNotification('Creando cuenta...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Registro exitoso - hacer login automático
            authToken = data.token;
            currentUser = data.user;
            
            // Guardar token en localStorage
            localStorage.setItem('authToken', authToken);
            
            updateAuthUI(true);
            closeAuthModal();
            
            showNotification(`¡Cuenta creada exitosamente! Bienvenido, ${username}!`);
        } else {
            showNotification(data.message || 'Error en el registro', 'error');
        }
        
    } catch (error) {
        console.error('Error en registro:', error);
        showNotification('Error conectando al servidor. ¿Está ejecutándose el backend?', 'error');
    }
}

/**
 * Actualizar interfaz de autenticación
 * @param {boolean} isLoggedIn - Si el usuario está logueado
 */
function updateAuthUI(isLoggedIn) {
    const userSection = document.getElementById('userSection');
    const loginSection = document.getElementById('loginSection');
    const userName = document.getElementById('userName');
    const perfilNavItem = document.getElementById('perfilNavItem');
    
    if (isLoggedIn && currentUser) {
        // Mostrar sección de usuario logueado
        if (userSection) userSection.style.display = 'flex';
        if (loginSection) loginSection.style.display = 'none';
        if (userName) userName.textContent = currentUser.username;
        if (perfilNavItem) perfilNavItem.style.display = 'block';
    } else {
        // Mostrar sección de login
        if (userSection) userSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'flex';
        if (perfilNavItem) perfilNavItem.style.display = 'none';
    }
}

/**
 * Cerrar sesión del usuario
 */
async function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        try {
            // Notificar al backend (opcional)
            if (authToken) {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.log('Error notificando logout al backend:', error);
        }
        
        // Limpiar datos locales
        currentUser = null;
        authToken = null;
        localStorage.removeItem('authToken');
        userRifas = [];
        selectedNumbers = [];
        winnerNumber = null;
        
        // Actualizar interfaz
        updateAuthUI(false);
        
        // Volver a la página de inicio
        navigateTo('demo');
        
        showNotification('Sesión cerrada exitosamente');
    }
}

// ===== FUNCIONES DE RIFAS CON BACKEND =====

/**
 * Cargar rifas del usuario desde el backend
 */
async function loadUserRifas() {
    if (!authToken) {
        userRifas = [];
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/rifas/my`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            userRifas = data.data.map(rifa => ({
                id: rifa.id,
                title: rifa.title,
                description: rifa.description || '',
                price: rifa.price_per_number || 0,
                sold: [], // Los números se cargan por separado si es necesario
                created: new Date(rifa.created_at).toLocaleDateString('es-ES'),
                status: rifa.status,
                winner_number: rifa.winner_number
            }));
            
            console.log(`${userRifas.length} rifas cargadas desde el backend`);
        } else {
            console.error('Error cargando rifas del usuario');
            userRifas = [];
        }
    } catch (error) {
        console.error('Error cargando rifas:', error);
        userRifas = [];
    }
}

/**
 * Crear nueva rifa en el backend
 */
async function createNewRifa() {
    if (!authToken) {
        showNotification('Debes iniciar sesión para crear una rifa', 'error');
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
    const price = parseFloat(priceElement.value) || 0;
    
    if (!title || !description) {
        showNotification('Por favor completa título y descripción', 'error');
        return;
    }
    
    try {
        showNotification('Creando rifa...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/rifas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                price_per_number: price > 0 ? price : null
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Rifa creada exitosamente
            const nuevaRifa = {
                id: data.data.id,
                title: data.data.title,
                description: data.data.description || '',
                price: data.data.price_per_number || 0,
                sold: [],
                created: new Date(data.data.created_at).toLocaleDateString('es-ES'),
                status: data.data.status
            };
            
            userRifas.push(nuevaRifa);
            
            // Limpiar formulario
            titleElement.value = '';
            descriptionElement.value = '';
            priceElement.value = '';
            
            // Actualizar interfaz
            updateUserRifasList();
            
            // Actualizar estadísticas
            const statNumber = document.querySelector('.stat-card:nth-child(2) .stat-number');
            if (statNumber) {
                statNumber.textContent = userRifas.length;
            }
            
            showNotification(`¡Rifa "${title}" creada exitosamente!`);
        } else {
            showNotification(data.message || 'Error creando la rifa', 'error');
        }
        
    } catch (error) {
        console.error('Error creando rifa:', error);
        showNotification('Error conectando al servidor', 'error');
    }
}

/**
 * Eliminar rifa del backend
 */
async function deleteRifa(rifaId) {
    if (!authToken) {
        showNotification('Debes iniciar sesión', 'error');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta rifa?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/rifas/${rifaId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Eliminar de la lista local
                userRifas = userRifas.filter(r => r.id !== rifaId);
                updateUserRifasList();
                
                // Actualizar estadísticas
                const statNumber = document.querySelector('.stat-card:nth-child(2) .stat-number');
                if (statNumber) {
                    statNumber.textContent = userRifas.length;
                }
                
                showNotification('Rifa eliminada exitosamente!');
            } else {
                showNotification(data.message || 'Error eliminando la rifa', 'error');
            }
            
        } catch (error) {
            console.error('Error eliminando rifa:', error);
            showNotification('Error conectando al servidor', 'error');
        }
    }
}

/**
 * Editar rifa en el backend
 */
async function editRifa(rifaId) {
    if (!authToken) {
        showNotification('Debes iniciar sesión', 'error');
        return;
    }
    
    const rifa = userRifas.find(r => r.id === rifaId);
    if (!rifa) return;
    
    const newTitle = prompt('Nuevo título:', rifa.title);
    if (newTitle === null) return;
    
    const newDescription = prompt('Nueva descripción:', rifa.description);
    if (newDescription === null) return;
    
    const newPrice = prompt('Nuevo precio por número (0 para gratis):', rifa.price);
    if (newPrice === null) return;
    
    if (newTitle && newDescription) {
        try {
            const response = await fetch(`${API_BASE_URL}/rifas/${rifaId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    price_per_number: parseFloat(newPrice) || null
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Actualizar en la lista local
                rifa.title = newTitle;
                rifa.description = newDescription;
                rifa.price = parseFloat(newPrice) || 0;
                updateUserRifasList();
                showNotification('Rifa actualizada exitosamente!');
            } else {
                showNotification(data.message || 'Error actualizando la rifa', 'error');
            }
            
        } catch (error) {
            console.error('Error editando rifa:', error);
            showNotification('Error conectando al servidor', 'error');
        }
    }
}

// ===== FUNCIONES DE NAVEGACIÓN (sin cambios) =====

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

function showRifasPage() {
    document.querySelector('.container').innerHTML = `
        <div class="page-header">
            <h1>🎊 Simulaciones Públicas</h1>
            <p class="subtitle">Ejemplos desarrollados en Talento Tech curso NODE.JS</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0; color: #666; font-style: italic;">
                🎯 <strong>Proyecto Educativo Talento Tech curso NODE.JS</strong> - Simulaciones con backend real
            </p>
        </div>
        
        <div class="rifas-grid">
            <div class="rifa-card">
                <div class="rifa-image">🎮</div>
                <h3>PlayStation 5</h3>
                <p class="rifa-description">Ejemplo de simulación con backend</p>
                <div class="rifa-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 65%"></div>
                    </div>
                    <span class="progress-text">65/100 números seleccionados</span>
                </div>
                <div class="rifa-price" style="color: #2196f3;">Con persistencia de datos</div>
                <button class="btn btn-primary" onclick="showRifaDetail('ps5')">Ver Simulación</button>
            </div>
            
            ${generateUserRifasHTML()}
        </div>
        
        <div class="back-to-demo">
            <button class="btn btn-secondary" onclick="navigateTo('demo')">← Volver al Inicio</button>
        </div>
    `;
}

function generateUserRifasHTML() {
    return userRifas.map(rifa => `
        <div class="rifa-card">
            <div class="rifa-image">🎁</div>
            <h3>${rifa.title}</h3>
            <p class="rifa-description">${rifa.description}</p>
            <div class="rifa-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(rifa.sold.length / 100) * 100}%"></div>
                </div>
                <span class="progress-text">${rifa.sold.length}/100 números seleccionados</span>
            </div>
            <div class="rifa-price" style="color: #2196f3;">ID: ${rifa.id} - ${rifa.status}</div>
            <button class="btn btn-primary" onclick="showRifaDetail('user_${rifa.id}')">Ver Simulación</button>
        </div>
    `).join('');
}

function showPerfilPage() {
    document.querySelector('.container').innerHTML = `
        <div class="page-header">
            <h1>👤 Mi Perfil</h1>
            <p class="subtitle">Panel de estudiante - Talento Tech curso NODE.JS</p>
        </div>
        
        <div class="profile-content">
            <div class="profile-section">
                <h3>📊 Mis Estadísticas</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">5</div>
                        <div class="stat-label">Simulaciones Probadas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${userRifas.length}</div>
                        <div class="stat-label">Rifas Creadas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">1</div>
                        <div class="stat-label">Backend Conectado ✅</div>
                    </div>
                </div>
            </div>
            
            <div class="profile-section">
                <h3>➕ Crear Nueva Rifa</h3>
                <p style="color: #666; margin-bottom: 15px; font-style: italic;">
                    🎯 Crea rifas reales que se guardan en la base de datos
                </p>
                <div class="create-rifa-form">
                    <input type="text" placeholder="Título de la rifa" class="form-input" id="rifaTitle">
                    <textarea placeholder="Descripción del premio" class="form-textarea" id="rifaDescription"></textarea>
                    <input type="number" placeholder="Precio por número (opcional)" class="form-input" id="rifaPrice" min="0" step="0.01">
                    <button type="button" class="btn btn-success" onclick="createNewRifa()">Crear Rifa</button>
                </div>
            </div>
            
            <div class="profile-section" id="userRifasSection">
                <h3>🎯 Mis Rifas Creadas</h3>
                <div id="userRifasList">
                    ${userRifas.length === 0 ? '<p style="color: #666; text-align: center; padding: 20px;">No has creado ninguna rifa aún</p>' : ''}
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

function updateUserRifasList() {
    const userRifasList = document.getElementById('userRifasList');
    
    if (!userRifasList) {
        return;
    }
    
    if (userRifas.length === 0) {
        userRifasList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No has creado ninguna rifa aún</p>';
        return;
    }
    
    userRifasList.innerHTML = userRifas.map(rifa => `
        <div class="user-rifa-card">
            <div class="user-rifa-header">
                <h4>${rifa.title}</h4>
                <span class="rifa-date">Creada: ${rifa.created}</span>
            </div>
            <p class="user-rifa-description">${rifa.description}</p>
            <div class="user-rifa-stats">
                <span class="stat-item">💰 ${rifa.price > 0 ? `$${rifa.price}` : 'Gratis'} por número</span>
                <span class="stat-item">📊 ID: ${rifa.id}</span>
                <span class="stat-item">🎯 Estado: ${rifa.status}</span>
            </div>
            <div class="user-rifa-actions">
                <button class="btn btn-secondary btn-small" onclick="editRifa(${rifa.id})">✏️ Editar</button>
                <button class="btn btn-primary btn-small" onclick="deleteRifa(${rifa.id})">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

// ===== FUNCIONES DE JUEGO (sin cambios) =====

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
                    <span class="cart-icon">🎯</span>
                    <h3 class="cart-title">Números Seleccionados</h3>
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
        const prevWinnerCell = document.getElementById(`number-${winnerNumber}`);
        if (prevWinnerCell) {
            prevWinnerCell.classList.remove('winner');
        }
    }

    const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
    winnerNumber = selectedNumbers[randomIndex];
    
    const winnerCell = document.getElementById(`number-${winnerNumber}`);
    if (winnerCell) {
        winnerCell.classList.add('winner');
    }
    
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        const winnerDisplay = document.getElementById('winnerNumber');
        const winnerText = document.getElementById('winnerText');
        
        winnerDisplay.textContent = winnerNumber.toString().padStart(2, '0');
        winnerText.textContent = winnerNumber.toString().padStart(2, '0');
        winnerModal.style.display = 'flex';
    }
}

function closeWinnerModal() {
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        winnerModal.style.display = 'none';
    }
}

function resetGame() {
    clearSelection();
    closeWinnerModal();
}

// ===== FUNCIONES DE UTILIDAD =====

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : type === 'info' ? 'info' : ''}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', async function() {
    // Generar grilla inicial
    generateNumbersGrid();
    updateCart();
    
    // Verificar estado de sesión con el backend
    await checkSessionStatus();
    
    console.log('Simulador de Rifas inicializado - Conectado al backend');
    console.log('Backend URL:', API_BASE_URL);
    
    // Configurar event listeners para modales
    setupModalEventListeners();
});

function setupModalEventListeners() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('auth-modal')) {
            closeAuthModal();
        }
        if (event.target.classList.contains('winner-modal')) {
            closeWinnerModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAuthModal();
            closeWinnerModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (document.getElementById('loginModal').style.display === 'flex') {
                event.preventDefault();
                performLogin();
            } else if (document.getElementById('registerModal').style.display === 'flex') {
                event.preventDefault();
                performRegister();
            }
        }
    });
}

// Función para mostrar login desde la navegación
function login() {
    showLoginModal();
}