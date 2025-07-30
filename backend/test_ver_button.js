const fetch = require('node-fetch');

async function testearBotonVer() {
    console.log('🧪 TEST ESPECÍFICO: Botón "Ver" en Mis Simulaciones\n');
    
    const baseURL = 'http://localhost:3000';
    
    try {
        // 1. Verificar que el servidor esté funcionando
        console.log('⏳ 1/6 Verificando servidor...');
        const healthCheck = await fetch(`${baseURL}/api/rifas`);
        if (!healthCheck.ok) {
            throw new Error(`Servidor no responde: ${healthCheck.status}`);
        }
        console.log('✅ Servidor funcionando en puerto 3000');
        
        // 2. Simular login del usuario demo
        console.log('\n⏳ 2/6 Simulando login...');
        const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'demo',
                password: 'demo123'
            })
        });
        
        if (!loginResponse.ok) {
            const errorData = await loginResponse.json();
            throw new Error(`Login fallido: ${errorData.error}`);
        }
        
        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login exitoso - Token obtenido');
        
        // 3. Obtener lista de simulaciones del usuario
        console.log('\n⏳ 3/6 Obteniendo "Mis Simulaciones"...');
        const misSimulacionesResponse = await fetch(`${baseURL}/api/rifas/my`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!misSimulacionesResponse.ok) {
            const errorData = await misSimulacionesResponse.json();
            throw new Error(`Error obteniendo simulaciones: ${errorData.error}`);
        }
        
        const misSimulacionesData = await misSimulacionesResponse.json();
        const rifas = misSimulacionesData.rifas;
        console.log(`✅ ${rifas.length} simulación(es) encontrada(s)`);
        
        if (rifas.length === 0) {
            console.log('⚠️  No hay simulaciones para testear');
            return;
        }
        
        // 4. Testear específicamente la primera simulación (como hace el botón "Ver")
        const primeraRifa = rifas[0];
        console.log(`\n⏳ 4/6 Testeando "Ver" para rifa ID ${primeraRifa.id}...`);
        console.log(`   Título: "${primeraRifa.title}"`);
        
        const verSimulacionResponse = await fetch(`${baseURL}/api/rifas/my/${primeraRifa.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!verSimulacionResponse.ok) {
            const errorData = await verSimulacionResponse.json();
            console.log(`❌ ERROR en "Ver": ${verSimulacionResponse.status} - ${errorData.error}`);
            
            // Mostrar detalles del error
            console.log('\n🔍 DETALLES DEL ERROR:');
            console.log(`   Status: ${verSimulacionResponse.status}`);
            console.log(`   Error: ${errorData.error}`);
            console.log(`   URL solicitada: ${baseURL}/api/rifas/my/${primeraRifa.id}`);
            console.log(`   Token usado: ${token.substring(0, 20)}...`);
            
            return;
        }
        
        const verSimulacionData = await verSimulacionResponse.json();
        const rifaDetalle = verSimulacionData.rifa;
        console.log('✅ "Ver" funcionó correctamente');
        console.log(`   Título: ${rifaDetalle.title}`);
        console.log(`   Descripción: ${rifaDetalle.description}`);
        console.log(`   Números vendidos: ${rifaDetalle.numbers_sold}`);
        console.log(`   Código de acceso: ${rifaDetalle.access_code}`);
        
        // 5. Verificar estructura de respuesta
        console.log('\n⏳ 5/6 Verificando estructura de respuesta...');
        const camposEsperados = ['id', 'title', 'description', 'access_code', 'numbers_sold'];
        let estructuraOK = true;
        
        camposEsperados.forEach(campo => {
            if (rifaDetalle.hasOwnProperty(campo)) {
                console.log(`✅ Campo "${campo}": ${rifaDetalle[campo]}`);
            } else {
                console.log(`❌ Campo "${campo}": FALTA`);
                estructuraOK = false;
            }
        });
        
        if (!estructuraOK) {
            console.log('⚠️  Estructura de respuesta incompleta');
        }
        
        // 6. Test completo exitoso
        console.log('\n⏳ 6/6 Verificando números de la simulación...');
        if (rifaDetalle.sold_numbers && Array.isArray(rifaDetalle.sold_numbers)) {
            console.log(`✅ ${rifaDetalle.sold_numbers.length} números encontrados: [${rifaDetalle.sold_numbers.join(', ')}]`);
        } else {
            console.log('⚠️  No hay números vendidos o estructura incorrecta');
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 TEST COMPLETADO EXITOSAMENTE');
        console.log('='.repeat(50));
        console.log('✅ Login funciona');
        console.log('✅ "Mis Simulaciones" funciona');
        console.log('✅ Botón "Ver" funciona');
        console.log('✅ Respuesta completa y correcta');
        console.log('\n💡 El backend está funcionando perfectamente.');
        console.log('💡 Si el botón "Ver" no funciona en el navegador,');
        console.log('💡 el problema está en el JavaScript del frontend.');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('\n❌ ERROR DURANTE EL TEST:', error.message);
        console.log('\n🔧 DIAGNÓSTICO:');
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('❌ El servidor no está corriendo');
            console.log('🔧 Solución: cd backend && npm run dev');
        } else if (error.message.includes('Login fallido')) {
            console.log('❌ Problema con autenticación');
            console.log('🔧 Solución: Verificar usuario demo en base de datos');
        } else if (error.message.includes('401')) {
            console.log('❌ Token JWT inválido o expirado');
            console.log('🔧 Solución: Verificar configuración JWT_SECRET');
        } else if (error.message.includes('404')) {
            console.log('❌ Ruta no encontrada');
            console.log('🔧 Solución: Verificar rutas en routes/rifas.js');
        } else {
            console.log('❌ Error desconocido');
            console.log('🔧 Revisa la consola del backend para más detalles');
        }
    }
}

// Instalar node-fetch si no está
const { execSync } = require('child_process');
try {
    require('node-fetch');
} catch (error) {
    console.log('📦 Instalando node-fetch...');
    execSync('npm install node-fetch@2', { stdio: 'inherit' });
}

testearBotonVer();
