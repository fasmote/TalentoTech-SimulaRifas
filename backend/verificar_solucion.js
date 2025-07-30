const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔍 VERIFICANDO SOLUCION FASE 15d...');
console.log('===================================');

const dbPath = path.join(__dirname, 'rifas.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Conectado a la base de datos');
        verificarTodo();
    }
});

async function verificarTodo() {
    try {
        console.log('');
        
        // Verificar rifas públicas
        const rifasPublicas = await consultarQuery(`
            SELECT id, title, 
                   (SELECT COUNT(*) FROM rifa_numbers WHERE rifa_id = rifas.id) as participantes
            FROM rifas 
            WHERE is_public = TRUE
        `);
        
        console.log('🎊 RIFAS PUBLICAS ENCONTRADAS:');
        if (rifasPublicas.length === 0) {
            console.log('   ❌ No se encontraron rifas públicas');
        } else {
            rifasPublicas.forEach(rifa => {
                const emoji = rifa.title.includes('iPhone') ? '📱' : 
                             rifa.title.includes('Cartera') ? '👜' : '✈️';
                console.log(`   ${emoji} ${rifa.title} - ${rifa.participantes} participantes`);
            });
        }
        
        console.log('');
        
        // Verificar total de números ocupados
        const totalNumeros = await consultarQuery(`
            SELECT COUNT(*) as total FROM rifa_numbers
        `);
        
        console.log('📊 ESTADISTICAS:');
        console.log(`   • Total rifas públicas: ${rifasPublicas.length}`);
        console.log(`   • Total números ocupados: ${totalNumeros[0].total}`);
        
        // Verificar usuarios
        const usuarios = await consultarQuery(`
            SELECT COUNT(*) as total FROM users
        `);
        
        console.log(`   • Total usuarios: ${usuarios[0].total}`);
        
        console.log('');
        
        if (rifasPublicas.length >= 3 && totalNumeros[0].total > 0) {
            console.log('🎉 ¡VERIFICACION EXITOSA!');
            console.log('========================');
            console.log('');
            console.log('✅ Todo está funcionando correctamente');
            console.log('🌐 Ve a: http://localhost:3000');
            console.log('📋 Haz clic en "Simulaciones Públicas"');
            console.log('👀 Deberías ver las 3 rifas demo');
        } else {
            console.log('⚠️ PROBLEMAS DETECTADOS:');
            console.log('========================');
            if (rifasPublicas.length < 3) {
                console.log('❌ Faltan rifas públicas');
            }
            if (totalNumeros[0].total === 0) {
                console.log('❌ No hay participantes');
            }
            console.log('');
            console.log('🔧 Ejecuta: node solucion_completa.js');
        }
        
    } catch (error) {
        console.error('❌ Error verificando:', error.message);
    } finally {
        db.close();
        process.exit(0);
    }
}

function consultarQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
