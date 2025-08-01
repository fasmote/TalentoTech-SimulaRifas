/* SIMULADOR DE RIFAS - FUNCIONES DE RIFAS AVANZADAS
   Proyecto TalentoTech - SimulaRifas
   Archivo: script-rifas.js
   ============================================== */

// ========== PÁGINA MIS SIMULACIONES ==========

/**
 * Mostrar página de perfil/mis simulaciones
 */
async function showPerfilPage() {
    if (!currentUser) {
        showAuthModal();
        return;
    }

    document.getElementById('mainContainer').innerHTML = `
        <div class="page-header">
            <h1>👥 Mis Simulaciones</h1>
            <p class="subtitle">Gestiona tu cuenta y tus simulaciones privadas</p>
        </div>
        
        <div class="loading">
            <p>🔄 Cargando tus simulaciones...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/rifas/my`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const userRifas = data.rifas || [];
            
            let rifasHtml = '';
            if (userRifas.length > 0) {
                rifasHtml = userRifas.map(rifa => {
                    const progressPercent = Math.round((rifa.numbers_sold / 100) * 100);
                    const isCompleted = rifa.status === 'completed';
                    const winnerInfo = rifa.winner ? `Ganador: Número ${rifa.winner.number} (${rifa.winner.participant_name})` : '';
                    
                    return `
                        <div class="rifa-card">
                            <div class="rifa-image">${isCompleted ? '🏆' : '🎯'}</div>
                            <h3>${rifa.title}</h3>
                            <p class="rifa-description">${rifa.description}</p>
                            
                            ${isCompleted ? `
                            <div class="winner-badge">
                                🏆 ¡SIMULACIÓN COMPLETADA!
                            </div>
                            <p style="font-size: 0.9rem; color: #ffd700; font-weight: bold; margin: 5px 0; text-align: center;">
                                ${winnerInfo}
                            </p>
                            ` : ''}
                            
                            <div class="rifa-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                                <p class="progress-text">${rifa.numbers_sold}/100 números ${isCompleted ? '(Completada)' : ''}</p>
                            </div>
                            
                            <div style="margin-top: 15px;">
                                <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">
                                    🔑 Código: <strong>${rifa.access_code || 'Generando...'}</strong>
                                    <button class="copy-code-btn" onclick="copyCode('${rifa.access_code}')" title="Copiar código" style="margin-left: 5px; padding: 3px 6px; font-size: 0.7rem;">
                                        📋
                                    </button>
                                </p>
                            </div>
                            
                            <div style="display: flex; gap: 8px; margin-top: 15px;">
                                <button class="btn btn-primary" onclick="viewRifa(${rifa.id})" style="flex: 1; font-size: 0.9rem;">
                                    👁️ Ver
                                </button>
                                ${!isCompleted ? `
                                <button class="btn btn-secondary" onclick="editRifa(${rifa.id})" style="flex: 1; font-size: 0.9rem;">
                                    ✏️ Editar
                                </button>
                                ` : `
                                <button class="btn" onclick="viewRifa(${rifa.id})" style="background: #4caf50; color: white; flex: 1; font-size: 0.9rem;">
                                    📊 Resultado
                                </button>
                                `}
                                <button class="btn" onclick="deleteRifa(${rifa.id})" style="background: #ff6b6b; color: white; flex: 0.5; font-size: 0.9rem;">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                rifasHtml = `
                    <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 15px; grid-column: 1 / -1;">
                        <div style="font-size: 4rem; margin-bottom: 20px;">🎯</div>
                        <h3 style="color: #333; margin-bottom: 15px;">Aún no tienes simulaciones</h3>
                        <p style="color: #666; margin-bottom: 30px;">Crea tu primera simulación para empezar a gestionar sorteos.</p>
                        
                        <div style="background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <h4 style="color: #1565c0; margin: 0 0 10px 0;">🎯 ¡Empieza ahora!</h4>
                            <p style="color: #1565c0; font-size: 0.9rem; margin: 0;">
                                Haz click en "Crear Nueva Simulación" para empezar
                            </p>
                        </div>
                        
                        <button class="btn btn-primary" onclick="navigateTo('demo')">
                            🎲 Probar Simulador Demo
                        </button>
                    </div>
                `;
            }
            
            document.getElementById('mainContainer').innerHTML = `
                <div class="page-header">
                    <h1>👥 Mis Simulaciones</h1>
                    <p class="subtitle">Gestiona tu cuenta y tus simulaciones privadas</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-success" onclick="showCreateRifaModal()">
                        ➕ Crear Nueva Simulación
                    </button>
                </div>
                
                <div class="rifas-grid">
                    ${rifasHtml}
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-secondary" onclick="logout()">
                        🚪 Cerrar Sesión
                    </button>
                </div>
            `;
        } else {
            throw new Error('Error cargando simulaciones');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mainContainer').innerHTML = `
            <div class="page-header">
                <h1>👥 Mis Simulaciones</h1>
                <p class="subtitle">Gestiona tu cuenta y tus simulaciones privadas</p>
            </div>
            
            <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 15px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
                <h3 style="color: #333; margin-bottom: 15px;">Error de Conexión</h3>
                <p style="color: #666; margin-bottom: 30px;">No se pudieron cargar tus simulaciones. Verifica que el backend esté ejecutándose.</p>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="showPerfilPage()">
                        🔄 Reintentar
                    </button>
                    <button class="btn btn-secondary" onclick="navigateTo('demo')">
                        🎲 Probar Demo
                    </button>
                </div>
            </div>
        `;
    }
}

// ========== GESTIÓN DE RIFAS ==========

/**
 * Ver detalles de una rifa específica
 */
async function viewRifa(rifaId) {
    console.log(`🔍 [DEBUG] Iniciando viewRifa con ID: ${rifaId}`);
    
    // Validar ID
    if (!rifaId || rifaId === 'undefined' || rifaId === 'null') {
        console.error('❌ [ERROR] ID de rifa inválido:', rifaId);
        showNotification('Error: ID de simulación inválido', 'error');
        return;
    }
    
    // Validar autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('❌ [ERROR] No hay token de autenticación');
        showNotification('Debes iniciar sesión para ver esta simulación', 'error');
        showAuthModal();
        return;
    }
    
    // Mostrar loading
    document.getElementById('mainContainer').innerHTML = `
        <div class="loading">
            <p>🔄 Cargando detalles de la simulación...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/rifas/my/${rifaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Error cargando simulación';
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `Error ${response.status}: ${errorText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        if (!data.rifa) {
            throw new Error('Datos de simulación no encontrados en respuesta');
        }
        
        const rifa = data.rifa;
        const isCompleted = rifa.status === 'completed';
        const winnerNumber = rifa.winner ? rifa.winner.number : null;
        
        // Generar grid de números
        let numbersGridHtml = '';
        for (let i = 0; i <= 99; i++) {
            const isSelected = rifa.sold_numbers && rifa.sold_numbers.includes(i);
            const isWinner = winnerNumber === i;
            let cellClass = 'number-cell';
            
            if (isWinner) {
                cellClass = 'number-cell winner';
            } else if (isSelected) {
                cellClass = 'number-cell sold';
            }
            
            numbersGridHtml += `<div class="${cellClass}">${i.toString().padStart(2, '0')}</div>`;
        }
        
        const progressPercent = Math.round((rifa.numbers_sold / 100) * 100);
        
        document.getElementById('mainContainer').innerHTML = `
            <div class="page-header">
                <h1>🎯 ${rifa.title}</h1>
                <p class="subtitle">${rifa.description}</p>
                ${isCompleted ? `<p style="background: #4caf50; color: white; padding: 10px; border-radius: 8px; text-align: center; margin-top: 10px;">
                    🏆 ¡SIMULACIÓN COMPLETADA! Ganador: Número ${winnerNumber} (${rifa.winner.participant_name})
                </p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
                <button class="btn btn-secondary" onclick="navigateTo('perfil')">
                    ← Volver a Mis Simulaciones
                </button>
                <button class="btn btn-primary" onclick="editRifa(${rifaId})" style="margin-left: 10px;">
                    ✏️ Editar
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px;" class="rifa-details-grid">
                <div class="numbers-section">
                    <h3 style="margin-bottom: 15px;">🎯 Números de la Simulación</h3>
                    <div class="numbers-grid">
                        ${numbersGridHtml}
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <h4 style="color: #333; margin-bottom: 10px;">📊 Estadísticas</h4>
                        <p style="margin: 5px 0;">• Números ocupados: ${rifa.numbers_sold}/100</p>
                        <p style="margin: 5px 0;">• Progreso: ${progressPercent}%</p>
                        <p style="margin: 5px 0;">• Código de acceso: ${rifa.access_code || 'No disponible'}</p>
                    </div>
                </div>
                
                <div class="cart-section">
                    <div class="cart-header">
                        <span class="cart-icon">🎯</span>
                        <h3 class="cart-title">${isCompleted ? 'Resultado Final' : 'Información'}</h3>
                    </div>
                    
                    ${isCompleted ? `
                    <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; text-align: center; border: 2px solid #ffd700;">
                        <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 1.1rem;">🏆 ¡GANADOR!</h4>
                        <div style="font-size: 2.5rem; font-weight: bold; color: #ffd700; margin: 10px 0;">${winnerNumber}</div>
                        <p style="color: #856404; margin: 0; font-weight: bold; font-size: 1.1rem;">${rifa.winner.participant_name}</p>
                    </div>` : ''}
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #333; margin-bottom: 10px;">📝 Descripción</h4>
                        <p style="color: #666; line-height: 1.5;">${rifa.description}</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #333; margin-bottom: 10px;">📈 Progreso</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <p class="progress-text">${rifa.numbers_sold}/100 números</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #333; margin-bottom: 10px;">🔑 Código de Acceso</h4>
                        <div class="access-code-display" style="display: flex; align-items: center; justify-content: space-between;">
                            <span id="displayCode">${rifa.access_code || 'GENERANDO...'}</span>
                            <button class="copy-code-btn" onclick="copyCode('${rifa.access_code}')" title="Copiar código">
                                📋
                            </button>
                        </div>
                        <p style="font-size: 0.8rem; color: #666; text-align: center;">Comparte este código para que otros participen</p>
                    </div>
                    
                    ${!isCompleted ? `
                    <button class="btn btn-success" style="width: 100%; margin-bottom: 10px;" onclick="drawRifaWinner(${rifaId})">
                        🏆 Realizar Sorteo
                    </button>` : `
                    <div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 8px; margin-bottom: 10px;">
                        <p style="color: #2e7d32; font-weight: bold; margin: 0;">✓ Sorteo Completado</p>
                    </div>`}
                    
                    <button class="btn btn-primary" style="width: 100%;" onclick="editRifa(${rifaId})">
                        ✏️ Editar Simulación
                    </button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('❌ [ERROR] Error en viewRifa:', error);
        
        document.getElementById('mainContainer').innerHTML = `
            <div class="page-header">
                <h1>⚠️ Error Cargando Simulación</h1>
                <p class="subtitle">No se pudo cargar la simulación ID: ${rifaId}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <button class="btn btn-secondary" onclick="navigateTo('perfil')">
                    ← Volver a Mis Simulaciones
                </button>
            </div>
            
            <div style="background: white; border-radius: 15px; padding: 30px; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 20px;">❌</div>
                <h3 style="color: #333; margin-bottom: 15px;">Error de Conexión</h3>
                <p style="color: #666; margin-bottom: 20px;">
                    ${error.message}
                </p>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="viewRifa(${rifaId})">
                        🔄 Reintentar
                    </button>
                    <button class="btn btn-secondary" onclick="navigateTo('perfil')">
                        ← Volver
                    </button>
                </div>
            </div>
        `;
        
        showNotification(error.message, 'error');
    }
}

/**
 * Editar una rifa
 */
async function editRifa(rifaId) {
    try {
        const response = await fetch(`${API_BASE}/rifas/my/${rifaId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const rifa = data.rifa;
            
            document.getElementById('editRifaTitle').value = rifa.title;
            document.getElementById('editRifaDescription').value = rifa.description;
            document.getElementById('editRifaModal').style.display = 'flex';
            document.getElementById('editRifaForm').dataset.rifaId = rifaId;
        } else {
            showNotification('Error cargando datos de la simulación', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

/**
 * Eliminar una rifa
 */
async function deleteRifa(rifaId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta simulación? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/rifas/${rifaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            showNotification('Simulación eliminada exitosamente');
            showPerfilPage();
        } else {
            const data = await response.json();
            showNotification(data.error || 'Error eliminando simulación', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

/**
 * Realizar sorteo de una rifa
 */
async function drawRifaWinner(rifaId) {
    try {
        const response = await fetch(`${API_BASE}/rifas/${rifaId}/draw`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification(`¡Ganador: Número ${data.winner.number}! Participante: ${data.winner.participant_name}`);
            viewRifa(rifaId);
        } else {
            const data = await response.json();
            showNotification(data.error || 'Error realizando sorteo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

// ========== RIFAS PÚBLICAS ==========

/**
 * Ver una rifa pública
 */
async function viewPublicRifa(rifaId) {
    document.getElementById('mainContainer').innerHTML = `
        <div class="loading">
            <p>🔄 Cargando detalles de la simulación...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/rifas/${rifaId}`);
        const data = await response.json();
        
        if (response.ok && data.rifa) {
            const rifa = data.rifa;
            const isCompleted = rifa.status === 'completed';
            const winnerNumber = rifa.winner ? rifa.winner.number : null;
            const emoji = rifa.title.includes('iPhone') ? '📱' : 
                         rifa.title.includes('Cartera') ? '👜' : '✈️';
            const progressPercent = rifa.max_numbers ? Math.round((rifa.numbers_sold / rifa.max_numbers) * 100) : 0;
            
            // Generar grid de números
            let numbersGridHtml = '';
            for (let i = 0; i <= 99; i++) {
                const isSelected = rifa.sold_numbers && rifa.sold_numbers.includes(i);
                const isWinner = winnerNumber === i;
                let cellClass = 'number-cell';
                
                if (isWinner) {
                    cellClass = 'number-cell winner';
                } else if (isSelected) {
                    cellClass = 'number-cell sold';
                }
                
                numbersGridHtml += `<div class="${cellClass}">${i.toString().padStart(2, '0')}</div>`;
            }
            
            document.getElementById('mainContainer').innerHTML = `
                <div class="page-header">
                    <h1>${emoji} ${rifa.title}</h1>
                    <p class="subtitle">Simulación pública de demostración</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="navigateTo('rifas')">
                        ← Volver a Simulaciones Públicas
                    </button>
                </div>
                
                <div class="legal-notice">
                    <strong>Vista de Solo Lectura:</strong> Esta es una simulación pública de demostración. Los números mostrados en rojo ya están ocupados por otros participantes.
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px; margin-bottom: 30px;" class="rifa-details-grid">
                    <div class="numbers-section">
                        <h3 style="margin-bottom: 15px; color: #333;">🎯 Números de la Simulación</h3>
                        <p style="color: #666; margin-bottom: 20px;">Los números en rojo ya están seleccionados</p>
                        
                        <div class="numbers-grid">
                            ${numbersGridHtml}
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <h4 style="color: #333; margin-bottom: 10px;">📊 Estadísticas</h4>
                            <p style="margin: 5px 0; color: #666;">• Números ocupados: ${rifa.numbers_sold}/100</p>
                            <p style="margin: 5px 0; color: #666;">• Progreso: ${progressPercent}%</p>
                            <p style="margin: 5px 0; color: #666;">• Estado: ${rifa.status === 'active' ? 'Activa' : 'Finalizada'}</p>
                        </div>
                    </div>
                    
                    <div class="cart-section">
                        <div class="cart-header">
                            <span class="cart-icon">${emoji}</span>
                            <h3 class="cart-title">Información</h3>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #333; margin-bottom: 10px;">📝 Descripción</h4>
                            <p style="color: #666; line-height: 1.5; font-size: 0.9rem;">${rifa.description}</p>
                        </div>
                        
                        <div class="rifa-progress" style="margin-bottom: 20px;">
                            <h4 style="color: #333; margin-bottom: 10px;">📈 Progreso</h4>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <p class="progress-text">${rifa.numbers_sold}/100 números seleccionados</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px;">
                            <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">
                                💡 ¿Te gusta esta simulación?
                            </p>
                            <button class="btn btn-success" style="width: 100%; margin-bottom: 10px;" onclick="showAuthModal()">
                                🚀 Crear Mi Propia Simulación
                            </button>
                            <button class="btn btn-secondary" style="width: 100%;" onclick="navigateTo('demo')">
                                🎮 Probar Simulador
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style="background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; padding: 20px; text-align: center;">
                    <h4 style="color: #1565c0; margin: 0 0 10px 0;">🎓 Simulación Educativa</h4>
                    <p style="color: #1565c0; font-size: 0.9rem; margin: 0;">
                        Esta es una simulación de demostración sin valor monetario. Los participantes y números son ficticios con fines educativos.
                    </p>
                </div>
            `;
        } else {
            showNotFoundRifaPage();
        }
    } catch (error) {
        console.error('Error cargando detalles de rifa:', error);
        showErrorLoadingRifaPage();
    }
}

/**
 * Mostrar página de rifa no encontrada
 */
function showNotFoundRifaPage() {
    document.getElementById('mainContainer').innerHTML = `
        <div class="page-header">
            <h1>❌ Simulación No Encontrada</h1>
            <p class="subtitle">La simulación solicitada no existe o no está disponible</p>
        </div>
        
        <div style="text-align: center; padding: 40px; background: white; border-radius: 15px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">🔍</div>
            <h3 style="color: #333; margin-bottom: 15px;">Simulación no encontrada</h3>
            <p style="color: #666; margin-bottom: 25px;">La simulación que buscas no existe o no está disponible públicamente.</p>
            
            <button class="btn btn-primary" onclick="navigateTo('rifas')">
                ← Volver a Simulaciones Públicas
            </button>
        </div>
    `;
}

/**
 * Mostrar página de error cargando rifa
 */
function showErrorLoadingRifaPage() {
    document.getElementById('mainContainer').innerHTML = `
        <div class="page-header">
            <h1>⚠️ Error de Conexión</h1>
            <p class="subtitle">No se pudo cargar la simulación</p>
        </div>
        
        <div style="text-align: center; padding: 40px; background: white; border-radius: 15px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">🌐</div>
            <h3 style="color: #333; margin-bottom: 15px;">Error de conexión</h3>
            <p style="color: #666; margin-bottom: 25px;">No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.</p>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="navigateTo('rifas')">
                    ← Volver
                </button>
                <button class="btn btn-primary" onclick="location.reload()">
                    🔄 Reintentar
                </button>
            </div>
        </div>
    `;
}

// ========== ACCESO POR CÓDIGO ==========

/**
 * Ver rifa por código de acceso
 */
async function viewRifaByCode(rifa, accessCode) {
    const isCompleted = rifa.status === 'completed';
    const winnerNumber = rifa.winner ? rifa.winner.number : null;
    
    document.getElementById('mainContainer').innerHTML = `
        <div class="page-header">
            <h1>🎯 ${rifa.title}</h1>
            <p class="subtitle">Simulación privada - Acceso por código: ${accessCode}</p>
            ${isCompleted ? `<p style="background: #4caf50; color: white; padding: 10px; border-radius: 8px; text-align: center; margin-top: 10px;">
                🏆 ¡SIMULACIÓN COMPLETADA! Ganador: Número ${winnerNumber} (${rifa.winner.participant_name})
            </p>` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
            <button class="btn btn-secondary" onclick="navigateTo('codigo')">
                ← Volver al Acceso por Código
            </button>
        </div>
        
        <div class="legal-notice">
            <strong>Participación por Código:</strong> Puedes seleccionar números y participar en esta simulación privada.
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px;" class="rifa-details-grid">
            <div class="numbers-section">
                <div class="controls">
                    <button class="btn btn-secondary" onclick="selectRandomNumberForCode()">
                        🎯 Elegir al Azar
                    </button>
                    <button class="btn btn-primary" onclick="clearCodeSelection()">
                        🗑️ Limpiar Todo
                    </button>
                    ${!isCompleted ? `
                    <button class="btn btn-participate" onclick="participateInRifa(${rifa.id}, selectedNumbers)">
                        🎊 Participar
                    </button>
                    ` : ''}
                </div>
                
                <div class="numbers-grid" id="numbersGrid">
                    <!-- Los números se generan con JavaScript -->
                </div>
            </div>
            
            <div class="cart-section">
                <div class="cart-header">
                    <span class="cart-icon">🎯</span>
                    <h3 class="cart-title">${isCompleted ? 'Resultado Final' : 'Números Seleccionados'}</h3>
                    <div class="cart-count" id="cartCount">0</div>
                </div>
                
                ${isCompleted ? `
                <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; text-align: center; border: 2px solid #ffd700;">
                    <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 1.1rem;">🏆 ¡GANADOR!</h4>
                    <div style="font-size: 2.5rem; font-weight: bold; color: #ffd700; margin: 10px 0;">${winnerNumber}</div>
                    <p style="color: #856404; margin: 0; font-weight: bold; font-size: 1.1rem;">${rifa.winner.participant_name}</p>
                </div>
                ` : ''}
                
                <div class="cart-items" id="cartItems">
                    <div class="empty-cart">
                        No has seleccionado números aún
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #333; margin-bottom: 10px;">📝 Descripción</h4>
                    <p style="color: #666; line-height: 1.5;">${rifa.description}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #333; margin-bottom: 10px;">📊 Progreso</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.round((rifa.numbers_sold / 100) * 100)}%"></div>
                    </div>
                    <p class="progress-text">${rifa.numbers_sold}/100 números</p>
                </div>
                
                ${!isCompleted && currentUser ? `
                <div style="background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center;">
                    <h4 style="color: #1565c0; margin: 0 0 10px 0;">✅ Usuario Logueado</h4>
                    <p style="color: #1565c0; font-size: 0.9rem; margin: 0;">
                        Participarás como: <strong>${currentUser.username}</strong>
                    </p>
                </div>
                ` : ''}
                
                ${!isCompleted ? `
                <button class="btn btn-participate" style="width: 100%; margin-bottom: 10px;" onclick="participateInRifa(${rifa.id}, selectedNumbers)">
                    🎊 ¡Participar en Simulación!
                </button>
                ` : `
                <div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 8px; margin-bottom: 10px;">
                    <p style="color: #2e7d32; font-weight: bold; margin: 0;">✓ Simulación Completada</p>
                </div>
                `}
                
                <button class="btn btn-secondary" style="width: 100%;" onclick="navigateTo('demo')">
                    🎮 Ir al Simulador Demo
                </button>
            </div>
        </div>
    `;
    
    // Generar grid interactivo
    generateRifaGrid(rifa);
    
    // Resetear selección
    selectedNumbers = [];
    updateCart();
}

// ========== FUNCIONES AUXILIARES PARA RIFAS ==========

/**
 * Generar grid de números para una rifa específica
 */
function generateRifaGrid(rifa) {
    const grid = document.getElementById('numbersGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const isCompleted = rifa.status === 'completed';
    const winnerNumber = rifa.winner ? rifa.winner.number : null;
    
    for (let i = 0; i <= 99; i++) {
        const cell = document.createElement('div');
        const isSelected = rifa.sold_numbers && rifa.sold_numbers.includes(i);
        const isWinner = winnerNumber === i;
        
        cell.textContent = i.toString().padStart(2, '0');
        cell.id = `number-${i}`;
        
        if (isWinner) {
            cell.className = 'number-cell winner';
        } else if (isSelected) {
            cell.className = 'number-cell sold';
        } else {
            cell.className = 'number-cell';
            if (!isCompleted) {
                cell.onclick = () => toggleNumberForCode(i);
            }
        }
        
        grid.appendChild(cell);
    }
}

/**
 * Toggle número para acceso por código
 */
function toggleNumberForCode(number) {
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
            toggleNumberForCode(number);
        };
        cell.appendChild(deleteBtn);
    }
    
    updateCart();
}

/**
 * Seleccionar número random para código
 */
function selectRandomNumberForCode() {
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
        toggleNumberForCode(randomNumber);
    }
}

/**
 * Limpiar selección para código
 */
function clearCodeSelection() {
    selectedNumbers.forEach(number => {
        const cell = document.getElementById(`number-${number}`);
        if (cell) {
            cell.classList.remove('selected');
            const deleteBtn = cell.querySelector('.delete-number');
            if (deleteBtn) {
                deleteBtn.remove();
            }
        }
    });
    selectedNumbers = [];
    updateCart();
}

/**
 * Participar en una rifa
 */
async function participateInRifa(rifaId, selectedNumbers) {
    if (selectedNumbers.length === 0) {
        showNotification('¡Primero debes seleccionar al menos un número!', 'error');
        return;
    }
    
    let participantName = 'Participante Anónimo';
    
    if (currentUser && currentUser.username) {
        participantName = currentUser.username;
        console.log(`🔄 [FASE 15K] Usando nombre del usuario logueado: ${participantName}`);
    } else {
        participantName = prompt('¿Cuál es tu nombre?');
        if (!participantName || participantName.trim() === '') {
            showNotification('El nombre es requerido para participar', 'error');
            return;
        }
    }

    try {
        const response = await fetch(`${API_BASE}/rifas/${rifaId}/participate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser ? `Bearer ${localStorage.getItem('authToken')}` : ''
            },
            body: JSON.stringify({
                numbers: selectedNumbers,
                participant_name: participantName
            })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification(`¡Participación exitosa! Números registrados para ${participantName}`);
            // Actualizar solo los números participados
            updateNumbersAfterParticipation(selectedNumbers);
        } else {
            showNotification(data.error || 'Error al participar', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

/**
 * Actualizar números después de participación
 */
function updateNumbersAfterParticipation(participatedNumbers) {
    participatedNumbers.forEach(number => {
        const cell = document.getElementById(`number-${number}`);
        if (cell) {
            cell.classList.remove('selected');
            cell.classList.add('sold');
            cell.onclick = null;
            const deleteBtn = cell.querySelector('.delete-number');
            if (deleteBtn) {
                deleteBtn.remove();
            }
        }
    });
    
    // Limpiar selección local
    selectedNumbers = [];
    updateCart();
}

console.log('🎯 Script de rifas avanzadas cargado - SimulaRifas v15u');
