// ===== VARIABLES GLOBALES =====
// Array global para almacenar rifas creadas por el usuario
let userRifas = [];
// Array para números seleccionados en la simulación actual
let selectedNumbers = [];
// Variable para almacenar el número ganador
let winnerNumber = null;

// ===== FUNCIONES DE NAVEGACIÓN =====

/**
 * Alternar visibilidad del menú móvil
 */
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

/**
 * Navegar entre diferentes páginas de la aplicación
 * @param {string} page - Nombre de la página a mostrar
 */
function navigateTo(page) {
    // Simular navegación SPA (Single Page Application)
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
    
    // Cerrar menú móvil después de navegar
    document.getElementById('navLinks').classList.remove('active');
}

/**
 * Actualizar el estado activo en la navegación
 * @param {string} activePage - Página actualmente activa
 */
function updateActiveNav(activePage) {
    // Remover clase active de todos los enlaces
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Activar el enlace correspondiente
    const pageIndex = activePage === 'demo' ? 0 : activePage === 'rifas' ? 1 : 2;
    document.querySelectorAll('.nav-links a')[pageIndex].classList.add('active');
}

// ===== FUNCIONES DE PÁGINAS =====

/**
 * Mostrar página de simulaciones públicas
 */
function showRifasPage() {
    document.querySelector('.container').innerHTML = `
        <div class="page-header">
            <h1>🎊 Simulaciones Públicas</h1>
            <p class="subtitle">Ejemplos desarrollados en Talento Tech curso NODE.JS</p>
        </div>
        
        <!-- Información sobre el propósito educativo -->
        <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0; color: #666; font-style: italic;">
                🎯 <strong>Proyecto Educativo Talento Tech curso NODE.JS</strong> - Simulaciones para aprender desarrollo backend
            </p>
        </div>
        
        <!-- Grid de rifas de ejemplo -->
        <div class="rifas-grid">
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
                <button class="btn btn-primary" onclick="showRifaDetail('ps5')">Ver Simulación</button>
            </div>
            
            <div class="rifa-card">
                <div class="rifa-image">📱</div>
                <h3>iPhone 15 Pro</h3>
                <p class="rifa-description">Ejemplo de aplicación Node.js con base de datos</p>
                <div class="rifa-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 30%"></div>
                    </div>
                    <span class="progress-text">30/100 números seleccionados</span>
                </div>
                <div class="rifa-price" style="color: #2196f3;">Demo Backend</div>
                <button class="btn btn-primary" onclick="showRifaDetail('iphone')">Ver Simulación</button>
            </div>
            
            <div class="rifa-card">
                <div class="rifa-image">🛏️</div>
                <h3>Set de Toallas y Sábanas</h3>
                <p class="rifa-description">Práctica de CRUD con Express y SQLite</p>
                <div class="rifa-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 45%"></div>
                    </div>
                    <span class="progress-text">45/100 números seleccionados</span>
                </div>
                <div class="rifa-price" style="color: #2196f3;">Ejercicio práctico</div>
                <button class="btn btn-primary" onclick="showRifaDetail('textiles')">Ver Simulación</button>
            </div>
            
            ${generateUserRifasHTML()}
        </div>
        
        <div class="back-to-demo">
            <button class="btn btn-secondary" onclick="navigateTo('demo')">← Volver al Inicio</button>
        </div>
    `;
    
    console.log('Página de Simulaciones Públicas cargada. Simulaciones de usuario:', userRifas.length);
}

/**
 * Generar HTML para rifas creadas por el usuario
 * @returns {string} HTML de las rifas del usuario
 */
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
            <div class="rifa-price" style="color: #2196f3;">Código: ${rifa.accessCode}</div>
            <button class="btn btn-primary" onclick="showRifaDetail('user_${rifa.id}')">Ver Simulación</button>
        </div>
    `).join('');
}

/**
 * Mostrar página de perfil del usuario
 */
function showPerfilPage() {
    document.querySelector('.container').innerHTML = `
        <div class="page-header">
            <h1>👤 Mi Perfil</h1>
            <p class="subtitle">Panel de estudiante - Talento Tech curso NODE.JS</p>
        </div>
        
        <div class="profile-content">
            <!-- Estadísticas del estudiante -->
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
            
            <!-- Historial de simulaciones -->
            <div class="profile-section">
                <h3>🎫 Mis Simulaciones de Práctica</h3>
                <div class="user-numbers">
                    <div class="number-entry">
                        <span class="rifa-name">PlayStation 5</span>
                        <span class="user-number">Número 23</span>
                        <span class="status active">Practicado</span>
                    </div>
                    <div class="number-entry">
                        <span class="rifa-name">iPhone 15 Pro</span>
                        <span class="user-number">Número 67</span>
                        <span class="status active">Practicado</span>
                    </div>
                    <div class="number-entry">
                        <span class="rifa-name">Ejercicio Anterior</span>
                        <span class="user-number">Número 45</span>
                        <span class="status winner">¡Ganador!</span>
                    </div>
                </div>
            </div>
            
            <!-- Formulario para crear nueva simulación -->
            <div class="profile-section">
                <h3>➕ Crear Nueva Simulación de Práctica</h3>
                <p style="color: #666; margin-bottom: 15px; font-style: italic;">
                    🎯 Practica creando tus propias simulaciones con Talento Tech curso NODE.JS
                </p>
                <div class="create-rifa-form">
                    <input type="text" placeholder="Título del proyecto (ej: Mi Primera Rifa TT NODE.JS)" class="form-input" id="rifaTitle">
                    <textarea placeholder="Descripción de la simulación o premio" class="form-textarea" id="rifaDescription"></textarea>
                    <input type="text" placeholder="Código de acceso (ej: FIESTA2025, EVENTO123)" class="form-input" id="rifaAccessCode">
                    <small style="color: #666; font-style: italic;">El código permite que otros usuarios se unan a tu simulación</small>
                    <button type="button" class="btn btn-success" onclick="createNewRifa()">Crear Simulación</button>
                </div>
            </div>
            
            <!-- Lista de simulaciones creadas -->
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
    
    // Actualizar la lista de rifas después de cargar la página
    setTimeout(() => {
        updateUserRifasList();
    }, 100);
}

/**
 * Mostrar página principal de demostración
 */
function showDemoPage() {
    // Restaurar contenido original de la demo
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
    
    // Reinicializar la funcionalidad de la demo
    selectedNumbers = [];
    winnerNumber = null;
    generateNumbersGrid();
    updateCart();
}

/**
 * Mostrar detalle de una rifa específica
 * @param {string} rifaId - ID de la rifa a mostrar
 */
function showRifaDetail(rifaId) {
    // Datos predefinidos para las rifas de ejemplo
    const rifaData = {
        'ps5': { name: 'PlayStation 5', accessCode: 'GAMING2025', sold: [12, 23, 45, 67, 89] },
        'iphone': { name: 'iPhone 15 Pro', accessCode: 'BACKEND2025', sold: [5, 18, 34, 56, 78] },
        'textiles': { name: 'Set de Toallas y Sábanas', accessCode: 'PRACTICA2025', sold: [3, 15, 27, 41, 58, 73, 86] }
    };
    
    let rifa;
    
    // Verificar si es una rifa creada por el usuario
    if (rifaId.startsWith('user_')) {
        const userRifaId = parseInt(rifaId.replace('user_', ''));
        const userRifa = userRifas.find(r => r.id === userRifaId);
        if (userRifa) {
            rifa = {
                name: userRifa.title,
                accessCode: userRifa.accessCode,
                sold: userRifa.sold
            };
        }
    } else {
        rifa = rifaData[rifaId];
    }
    
    if (!rifa) {
        showNotification('Simulación no encontrada', 'error');
        return;
    }
    
    // Generar HTML para la página de detalle
    document.querySelector('.container').innerHTML = `
        <div class="page-header">
            <h1>🎯 ${rifa.name}</h1>
            <p class="subtitle">Código de acceso: ${rifa.accessCode}</p>
        </div>
        
        <div class="rifa-detail-content">
            <div class="numbers-section">
                <h3>Selecciona números para practicar</h3>
                <div class="numbers-grid" id="rifaNumbersGrid">
                    <!-- Los números se generan con JavaScript -->
                </div>
            </div>
            
            <div class="rifa-info">
                <h3>Información de la Simulación</h3>
                <p><strong>Proyecto:</strong> ${rifa.name}</p>
                <p><strong>Código:</strong> ${rifa.accessCode}</p>
                <p><strong>Números simulados:</strong> ${rifa.sold.length}/100</p>
                <p><strong>Curso:</strong> Talento Tech curso NODE.JS</p>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                    Practicar con Números Seleccionados
                </button>
            </div>
        </div>
        
        <div class="back-buttons">
            <button class="btn btn-secondary" onclick="navigateTo('rifas')">← Volver a Simulaciones</button>
            <button class="btn btn-secondary" onclick="navigateTo('demo')">Ir al Inicio</button>
        </div>
    `;
    
    // Generar grilla de números con algunos ya "vendidos" para la demo
    generateRifaGrid(rifa.sold);
}

// ===== FUNCIONES DE GENERACIÓN DE GRILLAS =====

/**
 * Generar grilla de números para rifas con números ya vendidos
 * @param {Array} soldNumbers - Array de números ya vendidos
 */
function generateRifaGrid(soldNumbers) {
    const grid = document.getElementById('rifaNumbersGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i <= 99; i++) {
        const cell = document.createElement('div');
        cell.className = 'number-cell';
        cell.textContent = i.toString().padStart(2, '0'); // Formato 00, 01, 02...
        
        if (soldNumbers.includes(i)) {
            // Número ya vendido/seleccionado
            cell.classList.add('sold');
            cell.style.background = '#ff6b6b';
            cell.style.color = 'white';
            cell.style.cursor = 'not-allowed';
            cell.title = 'Número ya seleccionado en la simulación';
        } else {
            // Número disponible
            cell.onclick = () => toggleRifaNumber(i);
        }
        
        cell.id = `rifa-number-${i}`;
        grid.appendChild(cell);
    }
}

/**
 * Alternar selección de número en rifa
 * @param {number} number - Número a alternar
 */
function toggleRifaNumber(number) {
    const cell = document.getElementById(`rifa-number-${number}`);
    if (cell && !cell.classList.contains('sold')) {
        cell.classList.toggle('selected');
    }
}

/**
 * Generar la grilla principal de números (0-99)
 */
function generateNumbersGrid() {
    const grid = document.getElementById('numbersGrid');
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

// ===== FUNCIONES DE JUEGO =====

/**
 * Alternar selección de un número
 * @param {number} number - Número a alternar (0-99)
 */
function toggleNumber(number) {
    const cell = document.getElementById(`number-${number}`);
    const index = selectedNumbers.indexOf(number);
    
    if (index > -1) {
        // Deseleccionar número
        selectedNumbers.splice(index, 1);
        cell.classList.remove('selected');
    } else {
        // Seleccionar número
        selectedNumbers.push(number);
        cell.classList.add('selected');
    }
    
    updateCart();
}

/**
 * Actualizar vista del carrito con números seleccionados
 */
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    
    // Verificar que los elementos existen (para evitar errores en otras páginas)
    if (!cartItems || !cartCount) return;
    
    // Actualizar contador
    cartCount.textContent = selectedNumbers.length;
    
    if (selectedNumbers.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">No has seleccionado números aún</div>';
        return;
    }
    
    // Ordenar números y mostrarlos
    const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
    cartItems.innerHTML = sortedNumbers.map(number => `
        <div class="cart-item">
            <span class="cart-item-number">${number.toString().padStart(2, '0')}</span>
            <button class="remove-btn" onclick="toggleNumber(${number})">✕</button>
        </div>
    `).join('');
}

/**
 * Seleccionar un número al azar
 */
function selectRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 100);
    
    if (!selectedNumbers.includes(randomNumber)) {
        selectedNumbers.push(randomNumber);
        document.getElementById(`number-${randomNumber}`).classList.add('selected');
        updateCart();
    }
}

/**
 * Limpiar toda la selección
 */
function clearSelection() {
    // Remover clases de todos los números seleccionados
    selectedNumbers.forEach(number => {
        const cell = document.getElementById(`number-${number}`);
        if (cell) {
            cell.classList.remove('selected', 'winner');
        }
    });
    
    // Limpiar arrays y variables
    selectedNumbers = [];
    winnerNumber = null;
    updateCart();
    
    // Cerrar modal si está abierto
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        winnerModal.style.display = 'none';
    }
}

/**
 * Realizar sorteo y determinar ganador
 */
function drawWinner() {
    if (selectedNumbers.length === 0) {
        showNotification('¡Primero debes seleccionar al menos un número!', 'error');
        return;
    }

    // Limpiar ganador anterior
    if (winnerNumber !== null) {
        const prevWinnerCell = document.getElementById(`number-${winnerNumber}`);
        if (prevWinnerCell) {
            prevWinnerCell.classList.remove('winner');
        }
    }

    // Seleccionar ganador al azar de los números seleccionados
    const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
    winnerNumber = selectedNumbers[randomIndex];
    
    // Mostrar animación de ganador
    const winnerCell = document.getElementById(`number-${winnerNumber}`);
    if (winnerCell) {
        winnerCell.classList.add('winner');
    }
    
    // Mostrar modal con resultado
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        const winnerDisplay = document.getElementById('winnerNumber');
        const winnerText = document.getElementById('winnerText');
        
        winnerDisplay.textContent = winnerNumber.toString().padStart(2, '0');
        winnerText.textContent = winnerNumber.toString().padStart(2, '0');
        winnerModal.style.display = 'flex';
    }
}

/**
 * Cerrar modal de ganador
 */
function closeWinnerModal() {
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        winnerModal.style.display = 'none';
    }
}

/**
 * Resetear juego completo
 */
function resetGame() {
    clearSelection();
    closeWinnerModal();
}

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Mostrar notificación temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación ('success' o 'error')
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== FUNCIONES DE GESTIÓN DE RIFAS DE USUARIO =====

/**
 * Crear nueva rifa/simulación
 */
function createNewRifa() {
    console.log('Creando nueva simulación...');
    
    // Obtener elementos del formulario
    const titleElement = document.getElementById('rifaTitle');
    const descriptionElement = document.getElementById('rifaDescription');
    const accessCodeElement = document.getElementById('rifaAccessCode');
    
    if (!titleElement || !descriptionElement || !accessCodeElement) {
        showNotification('Error: No se encontraron los campos del formulario', 'error');
        return;
    }
    
    // Obtener valores
    const title = titleElement.value.trim();
    const description = descriptionElement.value.trim();
    const accessCode = accessCodeElement.value.trim();
    
    // Validar campos
    if (!title || !description || !accessCode) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Verificar que el código de acceso no esté ya en uso
    if (userRifas.some(rifa => rifa.accessCode === accessCode)) {
        showNotification('Este código de acceso ya está en uso', 'error');
        return;
    }
    
    // Crear nueva simulación
    const newRifa = {
        id: Date.now(), // ID único basado en timestamp
        title: title,
        description: description,
        accessCode: accessCode,
        sold: [], // Array de números vendidos (vacío inicialmente)
        created: new Date().toLocaleDateString('es-ES')
    };
    
    // Agregar a array global
    userRifas.push(newRifa);
    
    // Limpiar formulario
    titleElement.value = '';
    descriptionElement.value = '';
    accessCodeElement.value = '';
    
    // Actualizar interfaz
    updateUserRifasList();
    
    // Actualizar estadísticas si estamos en la página correcta
    const statNumber = document.querySelector('.stat-card:nth-child(2) .stat-number');
    if (statNumber) {
        statNumber.textContent = userRifas.length;
    }
    
    showNotification(`¡Simulación "${title}" creada exitosamente! Código: ${accessCode}`);
}

/**
 * Actualizar lista de rifas del usuario en la interfaz
 */
function updateUserRifasList() {
    const userRifasList = document.getElementById('userRifasList');
    
    if (!userRifasList) {
        return; // No estamos en la página de perfil
    }
    
    if (userRifas.length === 0) {
        userRifasList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No has creado ninguna simulación aún</p>';
        return;
    }
    
    // Generar HTML para cada rifa
    userRifasList.innerHTML = userRifas.map(rifa => `
        <div class="user-rifa-card">
            <div class="user-rifa-header">
                <h4>${rifa.title}</h4>
                <span class="rifa-date">Creada: ${rifa.created}</span>
            </div>
            <p class="user-rifa-description">${rifa.description}</p>
            <div class="user-rifa-stats">
                <span class="stat-item">🔑 Código: ${rifa.accessCode}</span>
                <span class="stat-item">📊 ${rifa.sold.length}/100 números</span>
            </div>
            <div class="user-rifa-actions">
                <button class="btn btn-secondary btn-small" onclick="editRifa(${rifa.id})">✏️ Editar</button>
                <button class="btn btn-primary btn-small" onclick="deleteRifa(${rifa.id})">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

/**
 * Editar una rifa existente
 * @param {number} rifaId - ID de la rifa a editar
 */
function editRifa(rifaId) {
    const rifa = userRifas.find(r => r.id === rifaId);
    if (!rifa) return;
    
    // Mostrar prompts para editar
    const newTitle = prompt('Nuevo título:', rifa.title);
    if (newTitle === null) return; // Usuario canceló
    
    const newDescription = prompt('Nueva descripción:', rifa.description);
    if (newDescription === null) return;
    
    const newAccessCode = prompt('Nuevo código de acceso:', rifa.accessCode);
    if (newAccessCode === null) return;
    
    // Actualizar si se proporcionaron todos los valores
    if (newTitle && newDescription && newAccessCode) {
        // Verificar que el nuevo código no esté en uso por otra rifa
        if (newAccessCode !== rifa.accessCode && userRifas.some(r => r.accessCode === newAccessCode)) {
            showNotification('Este código de acceso ya está en uso', 'error');
            return;
        }
        
        rifa.title = newTitle;
        rifa.description = newDescription;
        rifa.accessCode = newAccessCode;
        updateUserRifasList();
        showNotification('Simulación actualizada exitosamente!');
    }
}

/**
 * Eliminar una rifa
 * @param {number} rifaId - ID de la rifa a eliminar
 */
function deleteRifa(rifaId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta simulación?')) {
        userRifas = userRifas.filter(r => r.id !== rifaId);
        updateUserRifasList();
        
        // Actualizar estadísticas
        const statNumber = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (statNumber) {
            statNumber.textContent = userRifas.length;
        }
        
        showNotification('Simulación eliminada exitosamente!');
    }
}

// ===== INICIALIZACIÓN =====

/**
 * Inicializar la aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Generar grilla inicial y actualizar interfaz
    generateNumbersGrid();
    updateCart();
    
    console.log('Simulador de Rifas inicializado - Talento Tech curso NODE.JS');
});