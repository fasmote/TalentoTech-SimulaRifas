const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔍 DIAGNOSTICO COMPLETO - FASE 15d');
console.log('==================================');

const dbPath = path.join(__dirname, 'rifas.db');
console.log('📍 Base de datos:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Conectado a la base de datos');
        diagnosticarTodo();
    }
});

async function diagnosticarTodo() {
    try {
        console.log('\n1️⃣ VERIFICANDO TABLAS...');
        
        const tablas = await consultarQuery(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
        `);
        
        console.log(`   ✅ Tablas encontradas: ${tablas.length}`);
        tablas.forEach(tabla => {
            console.log(`      - ${tabla.name}`);
        });
        
        console.log('\n2️⃣ VERIFICANDO RIFAS PUBLICAS...');
        
        const rifasPublicas = await consultarQuery(`
            SELECT id, title, description, is_public, status,
                   (SELECT COUNT(*) FROM rifa_numbers WHERE rifa_id = rifas.id) as participantes
            FROM rifas 
            WHERE is_public = TRUE
        `);
        
        console.log(`   📊 Rifas públicas encontradas: ${rifasPublicas.length}`);
        
        if (rifasPublicas.length === 0) {
            console.log('   ❌ NO HAY RIFAS PUBLICAS - ESTE ES EL PROBLEMA');
            console.log('   🔧 Creando rifas públicas ahora...');
            await crearRifasPublicas();
        } else {
            rifasPublicas.forEach((rifa, index) => {
                const emoji = rifa.title.includes('iPhone') ? '📱' : 
                             rifa.title.includes('Cartera') ? '👜' : '✈️';
                console.log(`   ${emoji} ${rifa.title} - ${rifa.participantes} participantes`);
            });
        }
        
        console.log('\n3️⃣ VERIFICANDO USUARIOS...');
        
        const usuarios = await consultarQuery(`
            SELECT username, email FROM users
        `);
        
        console.log(`   👤 Usuarios encontrados: ${usuarios.length}`);
        if (usuarios.length > 0) {
            usuarios.forEach(user => {
                console.log(`      - ${user.username} (${user.email})`);
            });
        }
        
        console.log('\n4️⃣ VERIFICANDO NUMEROS ASIGNADOS...');
        
        const totalNumeros = await consultarQuery(`
            SELECT COUNT(*) as total FROM rifa_numbers
        `);
        
        console.log(`   🎯 Total números asignados: ${totalNumeros[0].total}`);
        
        console.log('\n5️⃣ SIMULANDO LLAMADA API...');
        
        // Simular la consulta que hace el frontend
        const apiSimulation = await consultarQuery(`
            SELECT 
                r.*,
                'Sistema' as creator_username,
                COUNT(rn.id) as numbers_sold
            FROM rifas r
            LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
            WHERE r.is_public = TRUE AND r.status = 'active'
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `);
        
        console.log(`   🌐 Resultado API simulado: ${apiSimulation.length} rifas`);
        
        if (apiSimulation.length === 0) {
            console.log('   ❌ LA API NO RETORNA RIFAS - ESTE ES EL PROBLEMA');
        } else {
            console.log('   ✅ La API debería funcionar correctamente');
        }
        
        console.log('\n6️⃣ RESUMEN DEL DIAGNOSTICO...');
        console.log('=====================================');
        
        if (rifasPublicas.length >= 3 && totalNumeros[0].total > 0) {
            console.log('✅ TODO ESTÁ BIEN EN LA BASE DE DATOS');
            console.log('');
            console.log('🔍 EL PROBLEMA PUEDE SER:');
            console.log('   1. El backend no está corriendo');
            console.log('   2. Estás en el puerto incorrecto');
            console.log('   3. Caché del navegador');
            console.log('   4. Problema con las rutas API');
            console.log('');
            console.log('✅ SOLUCIONES:');
            console.log('   1. Asegúrate de ejecutar: npm run dev');
            console.log('   2. Ve a: http://localhost:3000 (NO #)');
            console.log('   3. Presiona Ctrl+F5 para limpiar caché');
            console.log('   4. Abre DevTools (F12) y ve a Network tab');
        } else {
            console.log('❌ PROBLEMA EN LA BASE DE DATOS');
            console.log('');
            console.log('🔧 EJECUTANDO REPARACION AUTOMATICA...');
            await repararBaseDatos();
        }
        
    } catch (error) {
        console.error('❌ Error en diagnóstico:', error.message);
    } finally {
        db.close();
        process.exit(0);
    }
}

async function crearRifasPublicas() {
    try {
        // Limpiar rifas públicas existentes
        await ejecutarQuery('DELETE FROM rifa_numbers WHERE rifa_id IN (SELECT id FROM rifas WHERE is_public = TRUE)');
        await ejecutarQuery('DELETE FROM rifas WHERE is_public = TRUE');
        
        // Crear rifas demo
        const rifasDemo = [
            {
                title: 'iPhone 15 Pro',
                description: 'Sorteo corporativo educativo. El más moderno smartphone de Apple con cámara profesional, pantalla Super Retina XDR y chip A17 Pro. Esta es una simulación educativa sin valor monetario.',
                participantes: ['Ana Martínez', 'Carlos Silva', 'María Rodriguez', 'Juan Pérez', 'Sofia López', 'Diego García']
            },
            {
                title: 'Cartera de Mujer Premium',
                description: 'Elegante cartera de cuero afgano auténtico, hecha a mano por artesanos especializados. Incluye múltiples compartimentos y acabados de lujo. Simulación educativa para fines de demostración.',
                participantes: ['Isabella Santos', 'Gabriela Herrera', 'Natalia Jiménez', 'Adriana Castro', 'Lucía Mendoza']
            },
            {
                title: 'Viaje a Europa',
                description: 'Promoción especial educativa: Viaje todo incluido para 2 personas por 15 días visitando París, Roma, Madrid y Barcelona. Incluye vuelos, hoteles 4 estrellas y tours guiados. Esta es una simulación para fines educativos.',
                participantes: ['Roberto Delgado', 'Fernanda Aguilar', 'Ricardo Salinas', 'Mónica Paredes', 'Eduardo Ramírez', 'Paola Cortés']
            }
        ];
        
        for (let i = 0; i < rifasDemo.length; i++) {
            const rifa = rifasDemo[i];
            const accessCode = generateAccessCode();
            
            const rifaResult = await ejecutarQuery(`
                INSERT INTO rifas (user_id, title, description, access_code, is_public, status, max_numbers) 
                VALUES (NULL, ?, ?, ?, TRUE, 'active', 100)
            `, [rifa.title, rifa.description, accessCode]);
            
            const rifaId = rifaResult.lastID;
            
            // Agregar participantes
            for (let j = 0; j < rifa.participantes.length; j++) {
                const participante = rifa.participantes[j];
                const numero = Math.floor(Math.random() * 100);
                
                try {
                    await ejecutarQuery(`
                        INSERT INTO rifa_numbers (rifa_id, number, participant_name) 
                        VALUES (?, ?, ?)
                    `, [rifaId, numero, participante]);
                } catch (err) {
                    // Ignorar duplicados
                }
            }
        }
        
        console.log('   ✅ Rifas públicas creadas correctamente');
        
    } catch (error) {
        console.error('   ❌ Error creando rifas:', error.message);
    }
}

async function repararBaseDatos() {
    await crearRifasPublicas();
    console.log('✅ REPARACION COMPLETADA');
}

function generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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

function ejecutarQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}
