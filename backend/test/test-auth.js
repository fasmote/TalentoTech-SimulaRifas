// Script de prueba para endpoints de autenticación
const http = require('http');

const BASE_URL = 'http://localhost:3000';

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

async function testAuth() {
    console.log('🧪 Iniciando pruebas de autenticación...\n');

    try {
        // 1. Probar servidor
        console.log('1️⃣ Probando servidor...');
        const serverTest = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/test',
            method: 'GET'
        });
        console.log(`   Status: ${serverTest.statusCode}`);
        console.log(`   Response: ${serverTest.body.message}\n`);

        // 2. Registro de usuario
        console.log('2️⃣ Probando registro de usuario...');
        const registerData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        const registerResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(registerData).length
            }
        }, registerData);

        console.log(`   Status: ${registerResponse.statusCode}`);
        console.log(`   Message: ${registerResponse.body.message}`);
        
        if (registerResponse.body.token) {
            console.log(`   ✅ Token recibido: ${registerResponse.body.token.substring(0, 20)}...`);
        }
        console.log('');

        // 3. Login
        console.log('3️⃣ Probando login...');
        const loginData = {
            username: 'testuser',
            password: 'password123'
        };

        const loginResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(loginData).length
            }
        }, loginData);

        console.log(`   Status: ${loginResponse.statusCode}`);
        console.log(`   Message: ${loginResponse.body.message}`);
        
        let authToken = null;
        if (loginResponse.body.token) {
            authToken = loginResponse.body.token;
            console.log(`   ✅ Token de login: ${authToken.substring(0, 20)}...`);
        }
        console.log('');

        // 4. Obtener información del usuario
        if (authToken) {
            console.log('4️⃣ Probando obtener información del usuario...');
            const meResponse = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: '/api/auth/me',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            console.log(`   Status: ${meResponse.statusCode}`);
            if (meResponse.body.user) {
                console.log(`   Usuario: ${meResponse.body.user.username}`);
                console.log(`   Email: ${meResponse.body.user.email}`);
            }
            console.log('');
        }

        // 5. Probar acceso sin token
        console.log('5️⃣ Probando acceso sin token (debe fallar)...');
        const noTokenResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/me',
            method: 'GET'
        });

        console.log(`   Status: ${noTokenResponse.statusCode} ✅`);
        console.log(`   Message: ${noTokenResponse.body.message}`);

        console.log('\n🎉 Pruebas completadas!');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
        console.log('\n💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
    }
}

// Ejecutar pruebas
testAuth();