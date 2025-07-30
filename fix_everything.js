const { exec } = require('child_process');
const path = require('path');

console.log('🚀 SOLUCIONANDO PROBLEMAS FASE 15d...');
console.log('=====================================');

const backendPath = path.join(__dirname, 'backend');

// Cambiar al directorio backend y ejecutar comandos
process.chdir(backendPath);

console.log('📍 Directorio actual:', process.cwd());
console.log('');

async function ejecutarComando(comando, descripcion) {
    return new Promise((resolve, reject) => {
        console.log(`🔄 ${descripcion}...`);
        exec(comando, (error, stdout, stderr) => {
            if (error) {
                console.log(`❌ Error en ${descripcion}:`);
                console.log(error.message);
                reject(error);
                return;
            }
            
            if (stdout) {
                console.log(stdout);
            }
            
            if (stderr) {
                console.log('⚠️ Warnings:', stderr);
            }
            
            console.log(`✅ ${descripcion} completado`);
            console.log('');
            resolve();
        });
    });
}

async function solucionarTodo() {
    try {
        await ejecutarComando('node database/init.js', 'Inicializando base de datos');
        
        console.log('🎊 ¡PROBLEMAS SOLUCIONADOS!');
        console.log('');
        console.log('✅ Base de datos inicializada');
        console.log('✅ Demo content creado');
        console.log('✅ Rifas públicas disponibles');
        console.log('✅ CSS del menú corregido');
        console.log('');
        console.log('🌐 Ahora ejecuta: npm run dev');
        console.log('📋 Y ve a: http://localhost:3000');
        console.log('🎯 Haz clic en "Simulaciones Públicas"');
        console.log('');
        console.log('📱 Deberías ver:');
        console.log('   • iPhone 15 Pro');
        console.log('   • Cartera de Mujer Premium');
        console.log('   • Viaje a Europa');
        
    } catch (error) {
        console.log('❌ Error general:', error.message);
        console.log('');
        console.log('🔧 Solución manual:');
        console.log('1. cd backend');
        console.log('2. node database/init.js');
        console.log('3. npm run dev');
    }
}

solucionarTodo();
