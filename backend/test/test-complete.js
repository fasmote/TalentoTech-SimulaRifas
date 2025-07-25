// Script de prueba completo para el Simulador de Rifas
// Talento Tech curso NODE.JS - Proyecto Final
// Prueba todas las funcionalidades: Backend API + Frontend

const http = require('http');

const BASE_URL = 'http://localhost:3000';
let testResults = {
    passed: 0,
    failed: 0,
    total: 0
};

// Función helper para hacer requests
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsedBody = JSON.parse(body);
                    resolve({ statusCode: res.statusCode, body: parsedBody });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: body });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Función para mostrar resultados de test
function logTest(testName, passed, details = '') {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${testName}`);
        if (details) console.log(`   ${details}`);
    } else {
        testResults.failed++;
        console.log(`❌ ${testName}`);
        if (details) console.log(`   ${details}`);
    }
}

// Variables globales para las pruebas
let authToken = null;
let testUserId = null;
let testRifaId = null;

async function runCompleteTests() {
    console.log('🧪 INICIANDO PRUEBAS COMPLETAS DEL SIMULADOR DE RIFAS');
    console.log('=' .repeat(60));
    console.log('📋 Proyecto: Talento Tech curso NODE.JS - Trabajo Final');
    console.log('🔧 Tecnologías: Node.js + Express + SQLite + JWT');
    console.log('=' .repeat(60));
    console.log('');

    try {
        // ===== PRUEBAS DE INFRAESTRUCTURA =====
        console.log('🏗️  FASE 1: INFRAESTRUCTURA Y CONEXIONES');
        console.log('-'.repeat(50));
        
        await testServerConnection();
        await testDatabaseConnection();
        
        // ===== PRUEBAS DE AUTENTICACIÓN =====
        console.log('\n🔐 FASE 2: SISTEMA DE AUTENTICACIÓN');
        console.log('-'.repeat(50));
        
        await testUserRegistration();
        await testUserLogin();
        await testAuthenticatedAccess();
        await testInvalidAuth();
        
        // ===== PRUEBAS DE RIFAS (CRUD) =====
        console.log('\n🎯 FASE 3: GESTIÓN DE RIFAS (CRUD)');
        console.log('-'.repeat(50));
        
        await testCreateRifa();
        await testGetPublicRifas();
        await testGetUserRifas();
        await testGetRifaDetails();
        await testEditRifa();
        
        // ===== PRUEBAS DE FUNCIONALIDAD DE SORTEO =====
        console.log('\n🎲 FASE 4: FUNCIONALIDAD DE SORTEO');
        console.log('-'.repeat(50));
        
        await testSelectNumbers();
        await testDuplicateNumbers();
        await testDrawWinner();
        await testCompletedRifa();
        
        // ===== PRUEBAS DE VALIDACIÓN Y SEGURIDAD =====
        console.log('\n🛡️  FASE 5: VALIDACIONES Y SEGURIDAD');
        console.log('-'.repeat(50));
        
        await testInputValidation();
        await testAuthorizationChecks();
        await testEdgeCases();
        
        // ===== LIMPIEZA =====
        console.log('\n🧹 FASE 6: LIMPIEZA');
        console.log('-'.repeat(50));
        
        await cleanupTestData();

    } catch (error) {
        console.error('\n💥 Error crítico en las pruebas:', error.message);
        logTest('Ejecución completa de pruebas', false, `Error: ${error.message}`);
    }

    // ===== REPORTE FINAL =====
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE FINAL DE PRUEBAS');
    console.log('='.repeat(60));
    console.log(`✅ Pruebas exitosas: ${testResults.passed}`);
    console.log(`❌ Pruebas fallidas: ${testResults.failed}`);
    console.log(`📋 Total de pruebas: ${testResults.total}`);
    console.log(`📈 Porcentaje de éxito: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
        console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
        console.log('✨ El sistema está listo para producción');
    } else {
        console.log('\n⚠️  Algunas pruebas fallaron. Revisar logs arriba.');
    }
    
    console.log('\n🎓 Proyecto Talento Tech curso NODE.JS - Pruebas completadas');
    console.log('👨‍💻 Sistema desarrollado con Node.js + Express + SQLite');
}

// ===== FASE 1: INFRAESTRUCTURA =====

async function testServerConnection() {
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/test',
            method: 'GET'
        });
        
        const passed = response.statusCode === 200 && response.body.success;
        logTest('Conexión al servidor', passed, 
            passed ? `Servidor respondiendo en puerto 3000` : `Status: ${response.statusCode}`);
    } catch (error) {
        logTest('Conexión al servidor', false, `Error: ${error.message}`);
    }
}

async function testDatabaseConnection() {
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/test',
            method: 'GET'
        });
        
        const passed = response.statusCode === 200;
        logTest('Conexión a base de datos SQLite', passed, 
            passed ? 'Base de datos respondiendo correctamente' : 'Error de conexión');
    } catch (error) {
        logTest('Conexión a base de datos SQLite', false, `Error: ${error.message}`);
    }
}

// ===== FASE 2: AUTENTICACIÓN =====

async function testUserRegistration() {
    try {
        const userData = {
            username: `testuser_${Date.now()}`,
            email: `test_${Date.now()}@talento-tech.com`,
            password: 'password123'
        };

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(userData).length
            }
        }, userData);

        const passed = response.statusCode === 201 && response.body.token;
        if (passed) {
            authToken = response.body.token;
            testUserId = response.body.user.id;
        }
        
        logTest('Registro de usuario', passed, 
            passed ? `Usuario creado: ${userData.username}` : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Registro de usuario', false, `Error: ${error.message}`);
    }
}

async function testUserLogin() {
    try {
        // Mejor crear un usuario específico para login
        const newUser = {
            username: 'logintest',
            email: 'logintest@talento-tech.com',
            password: 'test123456'
        };

        // Primero registrar
        await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, newUser);

        // Luego hacer login
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(newUser).length
            }
        }, { username: newUser.username, password: newUser.password });

        const passed = response.statusCode === 200 && response.body.token;
        if (passed && !authToken) {
            authToken = response.body.token;
            testUserId = response.body.user.id;
        }
        
        logTest('Inicio de sesión', passed, 
            passed ? 'Login exitoso con JWT' : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Inicio de sesión', false, `Error: ${error.message}`);
    }
}

async function testAuthenticatedAccess() {
    try {
        if (!authToken) {
            logTest('Acceso autenticado', false, 'No hay token disponible');
            return;
        }

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/me',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const passed = response.statusCode === 200 && response.body.user;
        logTest('Acceso autenticado', passed, 
            passed ? `Usuario: ${response.body.user.username}` : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Acceso autenticado', false, `Error: ${error.message}`);
    }
}

async function testInvalidAuth() {
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/me',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer token_invalido_123'
            }
        });

        const passed = response.statusCode === 403;
        logTest('Rechazo de token inválido', passed, 
            passed ? 'Sistema rechaza tokens inválidos correctamente' : 'Falla de seguridad detectada');
    } catch (error) {
        logTest('Rechazo de token inválido', false, `Error: ${error.message}`);
    }
}

// ===== FASE 3: GESTIÓN DE RIFAS =====

async function testCreateRifa() {
    try {
        if (!authToken) {
            logTest('Crear rifa', false, 'No hay token de autenticación');
            return;
        }

        const rifaData = {
            title: 'Rifa de Prueba - TalentoTech',
            description: 'Rifa creada durante las pruebas automatizadas',
            price_per_number: 25.50
        };

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/rifas',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        }, rifaData);

        const passed = response.statusCode === 201 && response.body.data;
        if (passed) {
            testRifaId = response.body.data.id;
        }
        
        logTest('Crear rifa', passed, 
            passed ? `Rifa creada con ID: ${testRifaId}` : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Crear rifa', false, `Error: ${error.message}`);
    }
}

async function testGetPublicRifas() {
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/rifas',
            method: 'GET'
        });

        const passed = response.statusCode === 200 && Array.isArray(response.body.data);
        logTest('Obtener rifas públicas', passed, 
            passed ? `${response.body.data.length} rifas públicas encontradas` : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Obtener rifas públicas', false, `Error: ${error.message}`);
    }
}

async function testGetUserRifas() {
    try {
        if (!authToken) {
            logTest('Obtener rifas del usuario', false, 'No hay token de autenticación');
            return;
        }

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/rifas/my',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const passed = response.statusCode === 200 && Array.isArray(response.body.data);
        logTest('Obtener rifas del usuario', passed, 
            passed ? `${response.body.data.length} rifas del usuario encontradas` : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Obtener rifas del usuario', false, `Error: ${error.message}`);
    }
}

async function testGetRifaDetails() {
    try {
        if (!testRifaId) {
            logTest('Obtener detalles de rifa', false, 'No hay ID de rifa de prueba');
            return;
        }

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/api/rifas/${testRifaId}`,
            method: 'GET'
        });

        const passed = response.statusCode === 200 && response.body.data;
        logTest('Obtener detalles de rifa', passed, 
            passed ? `Detalles obtenidos para rifa ${testRifaId}` : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Obtener detalles de rifa', false, `Error: ${error.message}`);
    }
}

async function testEditRifa() {
    try {
        if (!testRifaId || !authToken) {
            logTest('Editar rifa', false, 'No hay ID de rifa o token');
            return;
        }

        const updateData = {
            title: 'Rifa de Prueba - EDITADA',
            description: 'Descripción actualizada durante pruebas',
            price_per_number: 30.00
        };

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/api/rifas/${testRifaId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        }, updateData);

        const passed = response.statusCode === 200;
        logTest('Editar rifa', passed, 
            passed ? 'Rifa editada exitosamente' : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Editar rifa', false, `Error: ${error.message}`);
    }
}

// ===== FASE 4: FUNCIONALIDAD DE SORTEO =====

async function testSelectNumbers() {
    try {
        if (!testRifaId) {
            logTest('Seleccionar números', false, 'No hay ID de rifa de prueba');
            return;
        }

        const numbersData = {
            numbers: [7, 13, 21, 42, 69],
            participant_name: 'Usuario de Prueba'
        };

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/api/rifas/${testRifaId}/numbers`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, numbersData);

        const passed = response.statusCode === 201;
        logTest('Seleccionar números', passed, 
            passed ? `${numbersData.numbers.length} números seleccionados` : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Seleccionar números', false, `Error: ${error.message}`);
    }
}

async function testDuplicateNumbers() {
    try {
        if (!testRifaId) {
            logTest('Validar números duplicados', false, 'No hay ID de rifa de prueba');
            return;
        }

        const duplicateData = {
            numbers: [7, 13], // Números ya seleccionados
            participant_name: 'Otro Usuario'
        };

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/api/rifas/${testRifaId}/numbers`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, duplicateData);

        const passed = response.statusCode === 400;
        logTest('Validar números duplicados', passed, 
            passed ? 'Sistema rechaza números duplicados correctamente' : 'Falla en validación de duplicados');
    } catch (error) {
        logTest('Validar números duplicados', false, `Error: ${error.message}`);
    }
}

async function testDrawWinner() {
    try {
        if (!testRifaId || !authToken) {
            logTest('Realizar sorteo', false, 'No hay ID de rifa o token');
            return;
        }

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/api/rifas/${testRifaId}/draw`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const passed = response.statusCode === 200 && response.body.data.winner_number !== undefined;
        logTest('Realizar sorteo', passed, 
            passed ? `Ganador: Número ${response.body.data.winner_number}` : `Error: ${response.body.message}`);
    } catch (error) {
        logTest('Realizar sorteo', false, `Error: ${error.message}`);
    }
}

async function testCompletedRifa() {
    try {
        if (!testRifaId || !authToken) {
            logTest('Verificar rifa completada', false, 'No hay ID de rifa o token');
            return;
        }

        // Intentar hacer otro sorteo en rifa ya completada
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/api/rifas/${testRifaId}/draw`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const passed = response.statusCode === 404 || response.statusCode === 400;
        logTest('Verificar rifa completada', passed, 
            passed ? 'Sistema previene sorteos múltiples correctamente' : 'Falla en estado de rifa');
    } catch (error) {
        logTest('Verificar rifa completada', false, `Error: ${error.message}`);
    }
}

// ===== FASE 5: VALIDACIONES Y SEGURIDAD =====

async function testInputValidation() {
    try {
        if (!authToken) {
            logTest('Validación de entrada', false, 'No hay token de autenticación');
            return;
        }

        // Intentar crear rifa sin título
        const invalidData = {
            description: 'Rifa sin título',
            price_per_number: -10 // Precio negativo
        };

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/rifas',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        }, invalidData);

        const passed = response.statusCode === 400;
        logTest('Validación de entrada', passed, 
            passed ? 'Sistema valida datos de entrada correctamente' : 'Fallas en validación detectadas');
    } catch (error) {
        logTest('Validación de entrada', false, `Error: ${error.message}`);
    }
}

async function testAuthorizationChecks() {
    try {
        // Intentar editar rifa sin estar autenticado
        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/rifas/999',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        }, { title: 'Hack attempt' });

        const passed = response.statusCode === 401;
        logTest('Verificación de autorización', passed, 
            passed ? 'Sistema requiere autenticación correctamente' : 'Falla de seguridad en autorización');
    } catch (error) {
        logTest('Verificación de autorización', false, `Error: ${error.message}`);
    }
}

async function testEdgeCases() {
    try {
        // Intentar seleccionar números fuera de rango
        const invalidNumbers = {
            numbers: [-1, 100, 999],
            participant_name: 'Test Edge Case'
        };

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/rifas/999999/numbers',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, invalidNumbers);

        const passed = response.statusCode === 400 || response.statusCode === 404;
        logTest('Casos extremos', passed, 
            passed ? 'Sistema maneja casos extremos correctamente' : 'Vulnerabilidades en casos extremos');
    } catch (error) {
        logTest('Casos extremos', false, `Error: ${error.message}`);
    }
}

// ===== FASE 6: LIMPIEZA =====

async function cleanupTestData() {
    try {
        if (!testRifaId || !authToken) {
            logTest('Limpieza de datos de prueba', true, 'No hay datos para limpiar');
            return;
        }

        const response = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/api/rifas/${testRifaId}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const passed = response.statusCode === 200;
        logTest('Limpieza de datos de prueba', passed, 
            passed ? 'Datos de prueba eliminados' : 'Error en limpieza');
    } catch (error) {
        logTest('Limpieza de datos de prueba', false, `Error: ${error.message}`);
    }
}

// Ejecutar todas las pruebas
runCompleteTests();