// =====================================================================
// 🔧 SCRIPT PARA SOLUCIONAR FUNCIÓN VIEWRIFA DUPLICADA - FASE 15i
// =====================================================================

// PROBLEMA IDENTIFICADO:
// - Hay DOS funciones viewRifa() en el archivo
// - Una vieja (línea ~2245) sin isCompleted definido 
// - Una nueva (al final) con isCompleted bien definido
// - JavaScript ejecuta la vieja y falla

// EJECUTA ESTE CÓDIGO EN LA CONSOLA PARA SOLUCIONARLO:

async function arreglarViewRifa() {
    console.log('🔧 INICIANDO CORRECCIÓN DE FUNCIÓN VIEWRIFA...');
    
    // Buscar todas las funciones viewRifa definidas
    const scripts = document.getElementsByTagName('script');
    console.log(`📄 Scripts encontrados: ${scripts.length}`);
    
    // Verificar si viewRifa está definida
    if (typeof viewRifa === 'function') {
        console.log('✅ Función viewRifa encontrada');
        
        // Redefinir completamente la función con la versión corregida
        window.viewRifa = async function(rifaId) {
            console.log(`🔍 [DEBUG] Iniciando viewRifa CORREGIDA con ID: ${rifaId}`);
            
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
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                if (!data.rifa) {
                    throw new Error('Datos de simulación no encontrados');
                }
                
                const rifa = data.rifa;
                const isCompleted = rifa.status === 'completed'; // ✅ AQUÍ ESTÁ isCompleted
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
                            🏆 ¡SIMULACIÓN COMPLETADA! Ganador: Número ${winnerNumber} (${rifa.winner ? rifa.winner.participant_name : 'N/A'})
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
                                <p style="color: #856404; margin: 0; font-weight: bold; font-size: 1.1rem;">${rifa.winner ? rifa.winner.participant_name : 'N/A'}</p>
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
                
                console.log('✅ [DEBUG] Vista cargada exitosamente');
                
            } catch (error) {
                console.error('❌ [ERROR] Error en viewRifa:', error);
                
                document.getElementById('mainContainer').innerHTML = `
                    <div style="background: white; border-radius: 15px; padding: 30px; text-align: center; margin: 20px 0;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">❌</div>
                        <h3 style="color: #333; margin-bottom: 15px;">Error Cargando Simulación</h3>
                        <p style="color: #666; margin-bottom: 20px;">${error.message}</p>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button class="btn btn-primary" onclick="viewRifa(${rifaId})">🔄 Reintentar</button>
                            <button class="btn btn-secondary" onclick="navigateTo('perfil')">← Volver</button>
                        </div>
                    </div>
                `;
                
                showNotification(error.message, 'error');
            }
        };
        
        console.log('✅ Función viewRifa REDEFINIDA correctamente');
        console.log('🎯 Ahora puedes probar el botón "Ver" - debería funcionar!');
        
        return true;
    } else {
        console.log('❌ Función viewRifa no encontrada');
        return false;
    }
}

// EJECUTAR LA CORRECCIÓN
arreglarViewRifa();

// =====================================================================
// 🎯 INSTRUCCIONES:
// =====================================================================
/*
1. Copia este código completo
2. Abre F12 → pestaña "Console"  
3. Pega el código y presiona Enter
4. Deberías ver: "✅ Función viewRifa REDEFINIDA correctamente"
5. ¡Prueba el botón "Ver" - ahora debería funcionar!

ESTO REDEFINIRÁ LA FUNCIÓN viewRifa() EN MEMORIA Y SOLUCIONARÁ EL PROBLEMA
SIN NECESIDAD DE EDITAR EL ARCHIVO HTML.
*/
