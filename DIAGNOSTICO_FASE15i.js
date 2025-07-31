// =====================================================================
// 🔧 DIAGNÓSTICO ESPECÍFICO FASE 15i - Problema con rutas autenticadas
// =====================================================================

// PROBLEMA IDENTIFICADO:
// ✅ Backend funciona
// ✅ Rutas públicas funcionan (acceso por código)
// ✅ Crear usuarios funciona
// ❌ "Mis Simulaciones" (rutas autenticadas) fallan

console.log('🔍 INICIANDO DIAGNÓSTICO FASE 15i...');

// 1. VERIFICAR VARIABLES GLOBALES
console.log('📊 Variables globales:');
console.log('- currentUser:', currentUser);
console.log('- API_BASE:', API_BASE);

// 2. VERIFICAR TOKEN
const token = localStorage.getItem('authToken');
console.log('🔑 Token de autenticación:');
console.log('- Existe:', !!token);
console.log('- Tamaño:', token ? token.length : 0);
console.log('- Primeros 20 chars:', token ? token.substring(0, 20) + '...' : 'No hay token');

// 3. VERIFICAR ESTRUCTURA DEL TOKEN
if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('📋 Payload del token:', payload);
        
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            console.log('⚠️ TOKEN EXPIRADO!');
        } else {
            console.log('✅ Token vigente');
        }
    } catch (e) {
        console.log('❌ Error decodificando token:', e);
    }
}

// 4. PROBAR LLAMADA MANUAL
async function probarLlamadaManual() {
    console.log('🧪 Probando llamada manual...');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log('❌ No hay token para probar');
        return;
    }
    
    try {
        console.log('📡 Llamando a /api/rifas/my...');
        
        const response = await fetch('/api/rifas/my', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📊 Respuesta recibida:');
        console.log('- Status:', response.status);
        console.log('- OK:', response.ok);
        console.log('- Headers:', response.headers);
        
        const text = await response.text();
        console.log('📄 Respuesta completa:', text);
        
        if (response.ok) {
            const data = JSON.parse(text);
            console.log('✅ DATOS OBTENIDOS:', data);
        } else {
            console.log('❌ ERROR EN RESPUESTA:', text);
        }
        
    } catch (error) {
        console.log('❌ ERROR DE RED:', error);
    }
}

// 5. PROBAR CON RIFA ESPECÍFICA
async function probarRifaEspecifica(rifaId) {
    console.log(`🧪 Probando rifa específica: ${rifaId}...`);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log('❌ No hay token para probar');
        return;
    }
    
    try {
        console.log(`📡 Llamando a /api/rifas/my/${rifaId}...`);
        
        const response = await fetch(`/api/rifas/my/${rifaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📊 Respuesta recibida:');
        console.log('- Status:', response.status);
        console.log('- OK:', response.ok);
        
        const text = await response.text();
        console.log('📄 Respuesta completa:', text);
        
        if (response.ok) {
            const data = JSON.parse(text);
            console.log('✅ RIFA OBTENIDA:', data);
        } else {
            console.log('❌ ERROR EN RESPUESTA:', text);
        }
        
    } catch (error) {
        console.log('❌ ERROR DE RED:', error);
    }
}

// EJECUTAR DIAGNÓSTICO
console.log('🚀 Ejecutando pruebas...');
probarLlamadaManual();

// Para probar rifa específica, ejecuta: probarRifaEspecifica(1)
console.log('💡 Para probar rifa específica, ejecuta: probarRifaEspecifica(1)');

// =====================================================================
// 🔧 INSTRUCCIONES DE USO:
// =====================================================================
/*
1. Copia este código completo
2. Abre F12 en tu navegador 
3. Ve a la pestaña "Console"
4. Pega el código y presiona Enter
5. Revisa los resultados para identificar el problema exacto

POSIBLES ERRORES ESPERADOS:
- Status 401: Token no enviado o mal formateado
- Status 403: Token expirado o inválido  
- Status 404: Ruta no encontrada
- Status 500: Error interno del servidor
- Error de red: Backend no corriendo o CORS

SOLUCIONES SEGÚN ERROR:
- 401/403: Problema con token → Re-login
- 404: Problema con URL → Verificar API_BASE
- 500: Problema backend → Revisar logs del servidor
- Red: Backend parado → npm run dev
*/
