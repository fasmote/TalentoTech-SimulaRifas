// ===== CONFIGURACIÓN DEL BACKEND =====
const API_BASE_URL = 'http://localhost:3000/api';

// ===== VARIABLES GLOBALES =====
let userRifas = [];
let selectedNumbers = [];
let winnerNumber = null;
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let participationSelected = [];
let currentView = 'demo';

// ===== SIMULACIONES PÚBLICAS (HARDCODEADAS) =====
const publicRifas = [
    {
        id: 'public_1',
        title: '🎮 PlayStation 5',
        description: 'Simulación de ejemplo para evento gaming',
        accessCode: 'GAMING2025',
        status: 'active',
        numbers: {
            5: { participant: 'Gamer123', selected_at: '2025-07-22 14:30' },
            12: { participant: 'PlayerOne', selected_at: '2025-07-22 15:45' },
            23: { participant: 'ProGamer', selected_at: '2025-07-23 09:15' },
            34: { participant: 'GameMaster', selected_at: '2025-07-23 11:20' },
            45: { participant: 'ElitePlayer', selected_at: '2025-07-23 16:30' },
            56: { participant: 'NinjaGamer', selected_at: '2025-07-23 18:10' },
            67: { participant: 'ProPlayer88', selected_at: '2025-07-24 08:25' },
            78: { participant: 'GameKing', selected_at: '2025-07-24 10:50' },
            89: { participant: 'EliteGamer', selected_at: '2025-07-24 14:15' },
            90: { participant: 'ChampionX', selected_at: '2025-07-24 16:40' },
            91: { participant: 'MasterPlayer', selected_at: '2025-07-24 18:20' },
            92: { participant: 'GameHero', selected_at: '2025-07-24 19:30' },
            93: { participant: 'ProGaming', selected_at: '2025-07-24 20:45' },
            94: { participant: 'EliteWarrior', selected_at: '2025-07-24 21:15' },
            95: { participant: 'GamerLegend', selected_at: '2025-07-24 21:55' }
        }
    },
    {
        id: 'public_2',
        title: '📱 iPhone 15 Pro',
        description: 'Simulación de ejemplo para evento corporativo',
        accessCode: 'CORP2025',
        status: 'active',
        numbers: {
            8: { participant: 'CorpUser1', selected_at: '2025-07-23 10:00' },
            17: { participant: 'Employee2', selected_at: '2025-07-23 14:15' },
            29: { participant: 'TeamLead', selected_at: '2025-07-24 09:30' },
            35: { participant: 'Manager1', selected_at: '2025-07-24 11:45' },
            42: { participant: 'Director2', selected_at: '2025-07-24 13:20' },
            58: { participant: 'Executive3', selected_at: '2025-07-24 15:10' },
            73: { participant: 'Supervisor4', selected_at: '2025-07-24 17:25' },
            86: { participant: 'Coordinator5', selected_at: '2025-07-24 19:40' }
        }
    },
    {
        id: 'public_3',
        title: '🎁 Pack de Productos',
        description: 'Simulación de ejemplo para evento familiar',
        accessCode: 'FAMILY2025',
        status: 'active',
        numbers: {
            3: { participant: 'Familia1', selected_at: '2025-07-22 18:00' },
            11: { participant: 'Papa2', selected_at: '2025-07-22 19:15' },
            19: { participant: 'Mama3', selected_at: '2025-07-23 08:45' },
            27: { participant: 'Hijo4', selected_at: '2025-07-23 12:30' },
            35: { participant: 'Tia5', selected_at: '2025-07-23 17:20' },
            42: { participant: 'Primo6', selected_at: '2025-07-24 10:15' },
            50: { participant: 'Abuela7', selected_at: '2025-07-24 11:30' },
            61: { participant: 'Tio8', selected_at: '2025-07-24 13:45' },
            72: { participant: 'Prima9', selected_at: '2025-07-24 15:20' },
            83: { participant: 'Hermana10', selected_at: '2025-07-24 16:50' },
            15: { participant: 'Cuñado11', selected_at: '2025-07-24 18:10' },
            26: { participant: 'Sobrina12', selected_at: '2025-07-24 19:25' },
            37: { participant: 'Nieto13', selected_at: '2025-07-24 20:40' },
            48: { participant: 'Suegra14', selected_at: '2025-07-24 21:55' },
            59: { participant: 'Vecina15', selected_at: '2025-07-24 22:10' },
            6: { participant: 'Amigo16', selected_at: '2025-07-24 22:30' },
            77: { participant: 'Compadre17', selected_at: '2025-07-24 22:45' },
            88: { participant: 'Madrina18', selected_at: '2025-07-24 23:00' },
            99: { participant: 'Padrino19', selected_at: '2025-07-24 23:15' },
            14: { participant: 'Amiga20', selected_at: '2025-07-24 23:30' },
            25: { participant: 'Vecino21', selected_at: '2025-07-24 23:45' },
            36: { participant: 'Comadre22', selected_at: '2025-07-25 00:00' }
        }
    }
];

// ===== FUNCIONES DE AUTENTICACIÓN CON BACKEND =====

/**
 * Verificar si el usuario está logueado
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
            await loadUserRifas();
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
        updateAuthUI(false);
        return false;
    }
}

/**
 * Actualizar UI según estado de autenticación
 */
function updateAuthUI(isLoggedIn) {
    const userSection = document.getElementById('userSection');
    const loginSection = document.getElementById('loginSection');
    
    if (isLoggedIn) {
        userSection.style.display = 'flex';
        loginSection.style.display = 'none';
        document.body.classList.add('is-logged-in');
    } else {
        userSection.style.display = 'none';
        loginSection.style.display = 'flex';
        document.body.classList.remove('is-logged-in');
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
    const fields = ['loginUsername', 'loginPassword', 'registerUsername', 'registerEmail', 'registerPassword', 'registerConfirmPassword'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) element.value = '';
    });
}

/**
 * Cambiar de login a registro
 */
function switchToRegister() {
    closeAuthModal();
    showRegisterModal();
}

/**
 * Cambiar de registro a login
 */
function switchToLogin() {
    closeAuthModal();
    showLoginModal();
}

/**
 * Realizar login
 */
async function performLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.data.token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            
            updateAuthUI(true);
            closeAuthModal();
            await loadUserRifas();
            navigateTo('rifas'); // Ir a "Mis Rifas" después del login
            showNotification(`¡Bienvenido ${currentUser.username}!`);
        } else {
            showNotification(data.message || 'Error en el login', 'error');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showNotification('Error de conexión. Verifica que el backend esté funcionando.', 'error');
    }
}

/**
 * Realizar registro
 */
async function performRegister() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();

    if (!username || !email || !password || !confirmPassword) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.data.token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            
            updateAuthUI(true);
            closeAuthModal();
            await loadUserRifas();
            navigateTo('rifas'); // Ir a "Mis Rifas" después del registro
            showNotification(`¡Cuenta creada! Bienvenido ${currentUser.username}`);
        } else {
            showNotification(data.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showNotification('Error de conexión. Verifica que el backend esté funcionando.', 'error');
    }
}

/**
 * Cerrar sesión
 */
async function logout() {
    if (!confirm('¿Seguro que quieres cerrar sesión?')) return;

    try {
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
        console.error('Error en logout:', error);
    }

    // Limpiar datos locales
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    userRifas = [];
    
    updateAuthUI(false);
    navigateTo('demo');
    clearSelection();
    showNotification('Sesión cerrada correctamente');
}

// ===== NAVEGACIÓN =====

/**
 * Navegación entre secciones
 */
function navigateTo(section) {
    currentView = section;
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (isUserLoggedIn()) {
        const links = document.querySelectorAll('.nav-link');
        if (section === 'rifas' && links[0]) {
            links[0].classList.add('active');
            showMyRifas();
        } else if (section === 'demo' && links[1]) {
            links[1].classList.add('active');
            showLoggedInDemo();
        }
    }
}

/**
 * Mostrar vista de rifas del usuario
 */
function showMyRifas() {
    if (!isUserLoggedIn()) return;
    
    document.getElementById('loggedInContent').innerHTML = `
        <div class="page-header">
            <h1>🎯 Mis Rifas Simuladas</h1>
            <p class="subtitle">Gestiona tus simulaciones personales</p>
        </div>

        <!-- Crear nueva simulación -->
        <div class="form-card">
            <h3 class="section-title">➕ Crear Nueva Simulación</h3>
            <p style="color: #666; margin-bottom: 15px; font-style: italic;">
                🎯 Crea simulaciones para eventos, fiestas, actividades grupales o sorteos internos
            </p>
            <div class="form-grid">
                <input type="text" placeholder="Título de la simulación" class="form-input" id="rifaTitle">
                <textarea placeholder="Descripción del evento" class="form-input" id="rifaDescription" rows="3"></textarea>
                <input type="text" placeholder="Código de acceso (opcional)" class="form-input" id="rifaAccessCode">
                <button type="button" class="btn btn-primary" onclick="createNewRifa()">Crear Simulación</button>
            </div>
        </div>

        <!-- Lista de simulaciones creadas -->
        <div class="profile-section">
            <h3 class="section-title">🎯 Mis Simulaciones (${userRifas.length})</h3>
            <div id="userRifasList">
                ${generateUserRifasHTML()}
            </div>
        </div>
    `;
}

/**
 * Mostrar demo para usuario logueado
 */
function showLoggedInDemo() {
    document.getElementById('loggedInContent').innerHTML = `
        <div class="page-header">
            <h1>🎲 Demo Avanzado</h1>
            <p class="subtitle">Prueba todas las funcionalidades</p>
        </div>
        
        <div class="main-content">
            <div class="numbers-section">
                <h3 class="section-title">🎯 Grilla de Prueba</h3>
                <div class="controls">
                    <button class="btn btn-secondary" onclick="selectRandomNumber()">🎯 Elegir al Azar</button>
                    <button class="btn btn-primary" onclick="clearSelection()">🗑️ Limpiar Todo</button>
                    <button class="btn btn-success" onclick="drawWinner()">🏆 Sortear Ganador</button>
                </div>
                
                <div class="numbers-grid" id="numbersGridLoggedIn">
                    <!-- Se genera con JavaScript -->
                </div>
            </div>

            <div class="cart-section">
                <div class="cart-header">
                    <span class="cart-icon">🎯</span>
                    <h3 class="cart-title">Demo Avanzado</h3>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #333; margin-bottom: 10px; font-size: 1rem;">Prueba códigos públicos:</h4>
                    <button class="btn btn-info btn-small" style="width: 100%; margin-bottom: 8px;" onclick="accessByCode('GAMING2025')">
                        🎮 GAMING2025
                    </button>
                    <button class="btn btn-info btn-small" style="width: 100%; margin-bottom: 8px;" onclick="accessByCode('CORP2025')">
                        📱 CORP2025
                    </button>
                    <button class="btn btn-info btn-small" style="width: 100%; margin-bottom: 15px;" onclick="accessByCode('FAMILY2025')">
                        🎁 FAMILY2025
                    </button>
                </div>
                
                <div class="cart-items" id="selectedNumbersLoggedIn">
                    <div class="empty-cart">
                        Prueba los códigos de arriba o la grilla
                    </div>
                </div>
            </div>
        </div>
    `;
    
    generateNumbersGrid('numbersGridLoggedIn');
}

// ===== GESTIÓN DE RIFAS DEL USUARIO =====

/**
 * Cargar rifas del usuario desde el backend
 */
async function loadUserRifas() {
    if (!authToken) return;

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
            userRifas = data.data || [];
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
 * Crear nueva rifa
 */
async function createNewRifa() {
    const title = document.getElementById('rifaTitle').value.trim();
    const description = document.getElementById('rifaDescription').value.trim();
    const accessCode = document.getElementById('rifaAccessCode').value.trim();

    if (!title || !description) {
        showNotification('Por favor completa título y descripción', 'error');
        return;
    }

    try {
        const rifaData = {
            title,
            description,
            access_code: accessCode || undefined
        };

        const response = await fetch(`${API_BASE_URL}/rifas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rifaData)
        });

        const data = await response.json();

        if (response.ok) {
            await loadUserRifas(); // Recargar rifas
            
            // Limpiar formulario
            document.getElementById('rifaTitle').value = '';
            document.getElementById('rifaDescription').value = '';
            document.getElementById('rifaAccessCode').value = '';
            
            // Actualizar lista
            document.getElementById('userRifasList').innerHTML = generateUserRifasHTML();
            document.querySelector('.profile-section h3').textContent = `🎯 Mis Simulaciones (${userRifas.length})`;
            
            showNotification(`¡Simulación "${title}" creada! Código: ${data.data.access_code}`);
        } else {
            showNotification(data.message || 'Error creando la rifa', 'error');
        }
    } catch (error) {
        console.error('Error creando rifa:', error);
        showNotification('Error de conexión', 'error');
    }
}

/**
 * Generar HTML de rifas del usuario
 */
function generateUserRifasHTML() {
    if (userRifas.length === 0) {
        return '<p style="color: #666; text-align: center; padding: 20px;">No has creado ninguna simulación aún. ¡Empieza creando tu primera simulación!</p>';
    }

    return userRifas.map(rifa => `
        <div class="user-rifa-card">
            <div class="user-rifa-header">
                <h4>${rifa.title}</h4>
                <span class="rifa-date">Creada: ${new Date(rifa.created_at).toLocaleDateString('es-ES')}</span>
            </div>
            <p class="user-rifa-description">${rifa.description}</p>
            <div class="user-rifa-stats">
                <span class="stat-item">🔑 Código: <strong>${rifa.access_code}</strong></span>
                <span class="stat-item">👥 Participantes: ${rifa.participants_count || 0}/100</span>
                <span class="stat-item">📊 Estado: ${rifa.status === 'active' ? 'Activo' : 'Finalizado'}</span>
            </div>
            <div class="user-rifa-actions">
                <button class="btn btn-info btn-small" onclick="manageRifa(${rifa.id})">
                    🎯 Gestionar
                </button>
                <button class="btn btn-secondary btn-small" onclick="editRifa(${rifa.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteRifa(${rifa.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Gestionar rifa específica
 */
function manageRifa(rifaId) {
    showNotification('Funcionalidad de gestión en desarrollo', 'info');
}

/**
 * Editar rifa
 */
function editRifa(rifaId) {
    showNotification('Funcionalidad de edición en desarrollo', 'info');
}

/**
 * Eliminar rifa
 */
async function deleteRifa(rifaId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta simulación?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/rifas/${rifaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            await loadUserRifas();
            document.getElementById('userRifasList').innerHTML = generateUserRifasHTML();
            document.querySelector('.profile-section h3').textContent = `🎯 Mis Simulaciones (${userRifas.length})`;
            showNotification('Simulación eliminada correctamente');
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error eliminando la rifa', 'error');
        }
    } catch (error) {
        console.error('Error eliminando rifa:', error);
        showNotification('Error de conexión', 'error');
    }
}

// ===== FUNCIONALIDAD DE ACCESO POR CÓDIGO =====

/**
 * Acceder a una rifa por código
 */
function accessByCode(code = null) {
    const inputCode = code || document.getElementById('accessCodeInput').value.trim().toUpperCase();
    
    if (!inputCode) {
        showNotification('Ingresa un código de acceso', 'error');
        return;
    }

    // Buscar en simulaciones públicas
    const rifa = publicRifas.find(r => r.accessCode === inputCode);
    
    if (!rifa) {
        showNotification('Código de acceso no válido', 'error');
        return;
    }

    showRifaParticipation(rifa);
    
    // Limpiar campo
    if (!code) { // Solo limpiar si no viene de botón directo
        document.getElementById('accessCodeInput').value = '';
    }
}

/**
 * Mostrar modal de participación en rifa
 */
function showRifaParticipation(rifa) {
    const participantCount = Object.keys(rifa.numbers).length;
    
    document.getElementById('rifaTitle').textContent = rifa.title;
    document.getElementById('rifaInfo').innerHTML = `
        <p style="color: #666; margin-bottom: 15px;">${rifa.description}</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <span class="stat-item">🔑 Código: <strong>${rifa.accessCode}</strong></span>
                <span class="stat-item">👥 Participantes: <strong>${participantCount}/100</strong></span>
                <span class="stat-item">📊 Estado: <strong>Activo</strong></span>
            </div>
        </div>
    `;
    
    document.getElementById('participationGrid').innerHTML = generateParticipationGrid(rifa.numbers);
    document.getElementById('participantName').value = '';
    participationSelected = [];
    
    document.getElementById('codeAccessModal').style.display = 'flex';
}

/**
 * Generar grilla de participación
 */
function generateParticipationGrid(takenNumbers) {
    let html = '<div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; margin-bottom: 20px;">';
    
    for (let i = 0; i <= 99; i++) {
        const numberStr = i.toString().padStart(2, '0');
        const isTaken = takenNumbers[i];
        const participantName = isTaken ? isTaken.participant : '';
        
        html += `
            <div style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; 
                 background: ${isTaken ? '#ff6b6b' : '#f8f9fa'}; 
                 color: ${isTaken ? 'white' : '#333'}; 
                 border: 2px solid ${isTaken ? '#ff6b6b' : '#e9ecef'};
                 border-radius: 6px; font-size: 0.9rem; font-weight: bold; 
                 cursor: ${isTaken ? 'not-allowed' : 'pointer'};
                 transition: all 0.3s ease;"
                 onclick="${isTaken ? '' : 'toggleParticipationNumber(' + i + ')'}"
                 id="part-number-${i}"
                 title="${isTaken ? `Ocupado por: ${participantName}` : 'Clic para seleccionar'}">${numberStr}</div>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * Alternar selección de número en participación
 */
function toggleParticipationNumber(number) {
    const cell = document.getElementById(`part-number-${number}`);
    if (!cell || cell.style.background === 'rgb(255, 107, 107)') return;
    
    if (participationSelected.includes(number)) {
        participationSelected = participationSelected.filter(n => n !== number);
        cell.style.background = '#f8f9fa';
        cell.style.borderColor = '#e9ecef';
        cell.style.color = '#333';
    } else {
        participationSelected.push(number);
        cell.style.background = 'linear-gradient(45deg, #4caf50, #8bc34a)';
        cell.style.borderColor = '#4caf50';
        cell.style.color = 'white';
    }
}

/**
 * Confirmar participación
 */
function confirmParticipation() {
    const participantName = document.getElementById('participantName').value.trim();
    
    if (!participantName) {
        showNotification('Ingresa tu nombre', 'error');
        return;
    }

    if (participationSelected.length === 0) {
        showNotification('Selecciona al menos un número', 'error');
        return;
    }

    // Simular guardado (en una app real, esto sería una llamada al backend)
    showNotification(`¡Números seleccionados correctamente! (${participationSelected.join(', ')}) por ${participantName}`);
    
    participationSelected = [];
    closeCodeModal();
}

/**
 * Cerrar modal de código
 */
function closeCodeModal() {
    document.getElementById('codeAccessModal').style.display = 'none';
    participationSelected = [];
}

// ===== FUNCIONALIDAD DE LA GRILLA DE NÚMEROS =====

/**
 * Generar grilla de números
 */
function generateNumbersGrid(containerId = 'numbersGrid') {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (let i = 0; i <= 99; i++) {
        const cell = document.createElement('div');
        cell.className = 'number-cell';
        cell.textContent = i.toString().padStart(2, '0');
        cell.onclick = () => toggleNumber(i, containerId);
        cell.id = `number-${i}-${containerId}`;
        grid.appendChild(cell);
    }
}

/**
 * Alternar selección de número
 */
function toggleNumber(number, containerId = 'numbersGrid') {
    const cell = document.getElementById(`number-${number}-${containerId}`);
    const index = selectedNumbers.indexOf(number);
    
    if (index > -1) {
        selectedNumbers.splice(index, 1);
        cell.classList.remove('selected');
    } else {
        selectedNumbers.push(number);
        cell.classList.add('selected');
    }
    
    updateSelectedDisplay(containerId);
}

/**
 * Actualizar visualización de números seleccionados
 */
function updateSelectedDisplay(containerId = 'numbersGrid') {
    const cartItemsId = containerId === 'numbersGrid' ? 'cartItems' : 'selectedNumbersLoggedIn';
    const cartCountId = containerId === 'numbersGrid' ? 'cartCount' : null;
    
    const container = document.getElementById(cartItemsId);
    const counter = document.getElementById(cartCountId);
    
    if (counter) {
        counter.textContent = selectedNumbers.length;
    }
    
    if (!container) return;
    
    if (selectedNumbers.length === 0) {
        container.innerHTML = '<div class="empty-cart">Selecciona números en la grilla</div>';
        return;
    }
    
    const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
    container.innerHTML = sortedNumbers.map(number => `
        <div class="cart-item">
            <span class="cart-item-number">${number.toString().padStart(2, '0')}</span>
            <button class="remove-btn" onclick="toggleNumber(${number}, '${containerId}')">✕</button>
        </div>
    `).join('');
}

/**
 * Seleccionar número al azar
 */
function selectRandomNumber() {
    const availableNumbers = [];
    for (let i = 0; i <= 99; i++) {
        if (!selectedNumbers.includes(i)) {
            availableNumbers.push(i);
        }
    }
    
    if (availableNumbers.length === 0) {
        showNotification('Ya tienes todos los números seleccionados', 'info');
        return;
    }
    
    const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    const containerId = currentView === 'demo' ? 'numbersGrid' : 'numbersGridLoggedIn';
    
    selectedNumbers.push(randomNumber);
    const cell = document.getElementById(`number-${randomNumber}-${containerId}`);
    if (cell) {
        cell.classList.add('selected');
    }
    updateSelectedDisplay(containerId);
}

/**
 * Limpiar selección
 */
function clearSelection() {
    const containerId = currentView === 'demo' ? 'numbersGrid' : 'numbersGridLoggedIn';
    
    selectedNumbers.forEach(number => {
        const cell = document.getElementById(`number-${number}-${containerId}`);
        if (cell) {
            cell.classList.remove('selected', 'winner');
        }
    });
    selectedNumbers = [];
    winnerNumber = null;
    updateSelectedDisplay(containerId);
    
    closeWinnerModal();
}

/**
 * Sortear ganador
 */
function drawWinner() {
    if (selectedNumbers.length === 0) {
        showNotification('¡Primero debes seleccionar al menos un número!', 'error');
        return;
    }

    const containerId = currentView === 'demo' ? 'numbersGrid' : 'numbersGridLoggedIn';
    
    // Limpiar ganador anterior
    if (winnerNumber !== null) {
        const cell = document.getElementById(`number-${winnerNumber}-${containerId}`);
        if (cell) {
            cell.classList.remove('winner');
        }
    }

    // Seleccionar ganador al azar
    const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
    winnerNumber = selectedNumbers[randomIndex];
    
    // Mostrar animación
    const winnerCell = document.getElementById(`number-${winnerNumber}-${containerId}`);
    if (winnerCell) {
        winnerCell.classList.add('winner');
    }
    
    // Mostrar modal de resultado
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

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : type === 'info' ? 'info' : ''}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

/**
 * Alternar menú móvil
 */
function toggleMobileMenu() {
    // Funcionalidad para menú móvil (si es necesaria)
    console.log('Toggle mobile menu');
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar sesión al cargar
    await checkSessionStatus();
    
    // Generar grilla inicial
    generateNumbersGrid();
    updateSelectedDisplay();
    
    // Configurar eventos del teclado para el campo de código
    const codeInput = document.getElementById('accessCodeInput');
    if (codeInput) {
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                accessByCode();
            }
        });
    }
    
    console.log('🎲 SimulaRifa TT inicializada correctamente');
});