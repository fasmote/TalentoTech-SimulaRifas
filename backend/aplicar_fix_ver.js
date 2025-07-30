const fs = require('fs');
const path = require('path');

function aplicarFixBotonVer() {
    console.log('🔧 APLICANDO FIX AUTOMÁTICO: Botón "Ver" en Mis Simulaciones\n');
    
    const frontendPath = path.join(__dirname, '..', 'frontend', 'index.html');
    
    try {
        // 1. Leer archivo actual
        console.log('⏳ 1/4 Leyendo archivo frontend/index.html...');
        
        if (!fs.existsSync(frontendPath)) {
            throw new Error('Archivo frontend/index.html no encontrado');
        }
        
        let htmlContent = fs.readFileSync(frontendPath, 'utf8');
        console.log('✅ Archivo leído correctamente');
        
        // 2. Hacer backup
        console.log('\n⏳ 2/4 Creando backup...');
        const backupPath = frontendPath + '.backup.' + Date.now();
        fs.writeFileSync(backupPath, htmlContent);
        console.log(`✅ Backup creado: ${path.basename(backupPath)}`);
        
        // 3. Buscar y reemplazar función viewRifa
        console.log('\n⏳ 3/4 Aplicando fix a función viewRifa...');
        
        // Buscar el inicio de la función viewRifa
        const funcionInicio = 'async function viewRifa(rifaId) {';
        const inicioIndex = htmlContent.indexOf(funcionInicio);
        
        if (inicioIndex === -1) {
            throw new Error('Función viewRifa no encontrada en el archivo');
        }
        
        // Buscar el final de la función (próxima función o cierre de script)
        let finIndex = inicioIndex;
        let llaves = 0;
        let dentroFuncion = false;
        
        for (let i = inicioIndex; i < htmlContent.length; i++) {
            const char = htmlContent[i];
            
            if (char === '{') {
                llaves++;
                dentroFuncion = true;
            } else if (char === '}') {
                llaves--;
                if (dentroFuncion && llaves === 0) {
                    finIndex = i + 1;
                    break;
                }
            }
        }
        
        if (finIndex === inicioIndex) {
            throw new Error('No se pudo determinar el final de la función viewRifa');
        }
        
        // Nueva función corregida
        const nuevaFuncion = `async function viewRifa(rifaId) {
            console.log(\`🔍 [DEBUG] Iniciando viewRifa con ID: \${rifaId}\`);
            
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
            
            console.log(\`✅ [DEBUG] Token encontrado: \${token.substring(0, 20)}...\`);
            
            // Mostrar loading
            document.getElementById('mainContainer').innerHTML = \`
                <div class="loading">
                    <p>🔄 Cargando detalles de la simulación...</p>
                </div>
            \`;
            
            try {
                console.log(\`📡 [DEBUG] Haciendo petición a: /api/rifas/my/\${rifaId}\`);
                
                const response = await fetch(\`\${API_BASE}/rifas/my/\${rifaId}\`, {
                    method: 'GET',
                    headers: {
                        'Authorization': \`Bearer \${token}\`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log(\`📡 [DEBUG] Respuesta recibida. Status: \${response.status}\`);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(\`❌ [ERROR] Respuesta no OK: \${response.status} - \${errorText}\`);
                    
                    let errorMessage = 'Error cargando simulación';
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.error || errorMessage;
                    } catch (e) {
                        errorMessage = \`Error \${response.status}: \${errorText}\`;
                    }
                    
                    throw new Error(errorMessage);
                }
                
                const data = await response.json();
                console.log('✅ [DEBUG] Datos recibidos:', data);
                
                if (!data.rifa) {
                    throw new Error('Datos de simulación no encontrados en respuesta');
                }
                
                const rifa = data.rifa;
                const isCompleted = rifa.status === 'completed';
                const winnerNumber = rifa.winner ? rifa.winner.number : null;
                
                console.log(\`✅ [DEBUG] Procesando rifa: "\${rifa.title}" (Status: \${rifa.status})\`);
                
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
                    
                    numbersGridHtml += \`<div class="\${cellClass}">\${i.toString().padStart(2, '0')}</div>\`;
                }
                
                const progressPercent = Math.round((rifa.numbers_sold / 100) * 100);
                
                console.log(\`✅ [DEBUG] Generando HTML para la vista...\`);
                
                document.getElementById('mainContainer').innerHTML = \`
                    <div class="page-header">
                        <h1>🎯 \${rifa.title}</h1>
                        <p class="subtitle">\${rifa.description}</p>
                        \${isCompleted ? \`<p style="background: #4caf50; color: white; padding: 10px; border-radius: 8px; text-align: center; margin-top: 10px;">
                            🏆 ¡SIMULACIÓN COMPLETADA! Ganador: Número \${winnerNumber} (\${rifa.winner.participant_name})
                        </p>\` : ''}
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <button class="btn btn-secondary" onclick="navigateTo('perfil')">
                            ← Volver a Mis Simulaciones
                        </button>
                        <button class="btn btn-primary" onclick="editRifa(\${rifaId})" style="margin-left: 10px;">
                            ✏️ Editar
                        </button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px;" class="rifa-details-grid">
                        <div class="numbers-section">
                            <h3 style="margin-bottom: 15px;">🎯 Números de la Simulación</h3>
                            <div class="numbers-grid">
                                \${numbersGridHtml}
                            </div>
                            
                            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                                <h4 style="color: #333; margin-bottom: 10px;">📊 Estadísticas</h4>
                                <p style="margin: 5px 0;">• Números ocupados: \${rifa.numbers_sold}/100</p>
                                <p style="margin: 5px 0;">• Progreso: \${progressPercent}%</p>
                                <p style="margin: 5px 0;">• Código de acceso: \${rifa.access_code || 'No disponible'}</p>
                            </div>
                        </div>
                        
                        <div class="cart-section">
                            <div class="cart-header">
                                <span class="cart-icon">🎯</span>
                                <h3 class="cart-title">\${isCompleted ? 'Resultado Final' : 'Información'}</h3>
                            </div>
                            
                            \${isCompleted ? \`
                            <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; text-align: center; border: 2px solid #ffd700;">
                                <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 1.1rem;">🏆 ¡GANADOR!</h4>
                                <div style="font-size: 2.5rem; font-weight: bold; color: #ffd700; margin: 10px 0;">\${winnerNumber}</div>
                                <p style="color: #856404; margin: 0; font-weight: bold; font-size: 1.1rem;">\${rifa.winner.participant_name}</p>
                            </div>\` : ''}
                            
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #333; margin-bottom: 10px;">📝 Descripción</h4>
                                <p style="color: #666; line-height: 1.5;">\${rifa.description}</p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #333; margin-bottom: 10px;">📈 Progreso</h4>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: \${progressPercent}%"></div>
                                </div>
                                <p class="progress-text">\${rifa.numbers_sold}/100 números</p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #333; margin-bottom: 10px;">🔑 Código de Acceso</h4>
                                <div class="access-code-display" style="display: flex; align-items: center; justify-content: space-between;">
                                    <span id="displayCode">\${rifa.access_code || 'GENERANDO...'}</span>
                                    <button class="copy-code-btn" onclick="copyCode('\${rifa.access_code}')" title="Copiar código">
                                        📋
                                    </button>
                                </div>
                                <p style="font-size: 0.8rem; color: #666; text-align: center;">Comparte este código para que otros participen</p>
                            </div>
                            
                            \${!isCompleted ? \`
                            <button class="btn btn-success" style="width: 100%; margin-bottom: 10px;" onclick="drawRifaWinner(\${rifaId})">
                                🏆 Realizar Sorteo
                            </button>\` : \`
                            <div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 8px; margin-bottom: 10px;">
                                <p style="color: #2e7d32; font-weight: bold; margin: 0;">✓ Sorteo Completado</p>
                            </div>\`}
                            
                            <button class="btn btn-primary" style="width: 100%;" onclick="editRifa(\${rifaId})">
                                ✏️ Editar Simulación
                            </button>
                        </div>
                    </div>
                \`;
                
                console.log('✅ [DEBUG] Vista cargada exitosamente');
                
            } catch (error) {
                console.error('❌ [ERROR] Error en viewRifa:', error);
                
                // Mostrar error detallado
                document.getElementById('mainContainer').innerHTML = \`
                    <div class="page-header">
                        <h1>⚠️ Error Cargando Simulación</h1>
                        <p class="subtitle">No se pudo cargar la simulación ID: \${rifaId}</p>
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
                            \${error.message}
                        </p>
                        
                        <div style="background: #ffebee; border: 1px solid #ffcdd2; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: left;">
                            <h4 style="color: #c62828; margin: 0 0 10px 0;">🔧 Información de Debug:</h4>
                            <p style="color: #c62828; font-size: 0.9rem; margin: 0;">
                                • ID de simulación: \${rifaId}<br>
                                • Token disponible: \${token ? 'Sí' : 'No'}<br>
                                • API Base: \${API_BASE}<br>
                                • Error: \${error.message}
                            </p>
                        </div>
                        
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="viewRifa(\${rifaId})">
                                🔄 Reintentar
                            </button>
                            <button class="btn btn-secondary" onclick="navigateTo('perfil')">
                                ← Volver
                            </button>
                        </div>
                    </div>
                \`;
                
                // También mostrar notificación
                showNotification(error.message, 'error');
            }
        }`;
        
        // Reemplazar función
        const nuevoContent = htmlContent.substring(0, inicioIndex) + 
                           nuevaFuncion + 
                           htmlContent.substring(finIndex);
        
        console.log('✅ Función viewRifa reemplazada');
        
        // 4. Guardar archivo modificado
        console.log('\n⏳ 4/4 Guardando archivo modificado...');
        fs.writeFileSync(frontendPath, nuevoContent);
        console.log('✅ Archivo guardado exitosamente');
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 FIX APLICADO EXITOSAMENTE');
        console.log('='.repeat(50));
        console.log('✅ Función viewRifa corregida');
        console.log('✅ Backup creado automáticamente');
        console.log('✅ Logging de debug agregado');
        console.log('✅ Manejo de errores mejorado');
        console.log('\n🔄 PRÓXIMOS PASOS:');
        console.log('1. Recarga la página en tu navegador (F5)');
        console.log('2. Abre la consola del navegador (F12)');
        console.log('3. Prueba el botón "Ver" en "Mis Simulaciones"');
        console.log('4. Revisa los mensajes de debug en la consola');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Error aplicando fix:', error.message);
        console.log('\n🔧 SOLUCIÓN MANUAL:');
        console.log('1. Abre el archivo: frontend/index.html');
        console.log('2. Busca la función "async function viewRifa(rifaId)"');
        console.log('3. Reemplázala con el código del archivo: fix_boton_ver.js');
        console.log('4. Guarda y recarga la página');
    }
}

aplicarFixBotonVer();
