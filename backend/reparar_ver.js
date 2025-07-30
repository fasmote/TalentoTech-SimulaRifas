const { runQuery, getQuery, allQuery, initDatabase } = require('./database/database');

async function repararProblemaVer() {
    console.log('🔧 REPARANDO PROBLEMA "VER SIMULACIONES"...\n');
    
    try {
        // 1. Verificar conexión a base de datos
        console.log('⏳ Paso 1: Verificando base de datos...');
        
        try {
            await getQuery('SELECT COUNT(*) as count FROM rifas');
            console.log('✅ Base de datos conectada correctamente');
        } catch (error) {
            console.log('❌ Error de base de datos, reinicializando...');
            await initDatabase();
            console.log('✅ Base de datos reinicializada');
        }
        
        // 2. Verificar tablas necesarias
        console.log('\n⏳ Paso 2: Verificando estructura de tablas...');
        
        const tables = await allQuery(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
        `);
        
        const requiredTables = ['users', 'rifas', 'rifa_numbers'];
        const existingTables = tables.map(t => t.name);
        
        let missingTables = false;
        requiredTables.forEach(table => {
            if (existingTables.includes(table)) {
                console.log(`✅ Tabla '${table}' existe`);
            } else {
                console.log(`❌ Tabla '${table}' FALTA`);
                missingTables = true;
            }
        });
        
        if (missingTables) {
            console.log('🔄 Recreando estructura de base de datos...');
            await initDatabase();
            console.log('✅ Estructura de base de datos recreada');
        }
        
        // 3. Verificar usuario de prueba
        console.log('\n⏳ Paso 3: Verificando usuarios de prueba...');
        
        const testUser = await getQuery('SELECT * FROM users WHERE username = ?', ['demo']);
        if (!testUser) {
            console.log('🔄 Creando usuario de prueba...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('demo123', 10);
            
            await runQuery(`
                INSERT INTO users (username, email, password) 
                VALUES (?, ?, ?)
            `, ['demo', 'demo@test.com', hashedPassword]);
            console.log('✅ Usuario de prueba creado (demo/demo123)');
        } else {
            console.log('✅ Usuario de prueba existe');
        }
        
        // 4. Verificar simulaciones del usuario
        console.log('\n⏳ Paso 4: Verificando simulaciones...');
        
        const demoUser = await getQuery('SELECT * FROM users WHERE username = ?', ['demo']);
        const userRifas = await allQuery('SELECT * FROM rifas WHERE user_id = ?', [demoUser.id]);
        
        if (userRifas.length === 0) {
            console.log('🔄 Creando simulación de prueba...');
            
            // Generar código de acceso
            const generateAccessCode = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let result = '';
                for (let i = 0; i < 6; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            };
            
            const accessCode = generateAccessCode();
            
            const rifaResult = await runQuery(`
                INSERT INTO rifas (user_id, title, description, access_code, is_public) 
                VALUES (?, ?, ?, ?, FALSE)
            `, [
                demoUser.id,
                'Mi Primera Simulación de Prueba',
                'Esta es una simulación de prueba para verificar que todo funciona correctamente. Puedes editarla y probar todas las funciones.',
                accessCode
            ]);
            
            // Agregar algunos números de ejemplo
            const sampleNumbers = [5, 12, 23, 47, 89];
            for (const number of sampleNumbers) {
                await runQuery(`
                    INSERT INTO rifa_numbers (rifa_id, number, participant_name) 
                    VALUES (?, ?, ?)
                `, [rifaResult.id, number, `Participante ${number}`]);
            }
            
            console.log(`✅ Simulación de prueba creada (Código: ${accessCode})`);
        } else {
            console.log(`✅ ${userRifas.length} simulación(es) encontrada(s)`);
        }
        
        // 5. Verificar simulaciones públicas
        console.log('\n⏳ Paso 5: Verificando simulaciones públicas...');
        
        const publicRifas = await allQuery('SELECT * FROM rifas WHERE is_public = TRUE');
        if (publicRifas.length === 0) {
            console.log('🔄 Creando simulaciones públicas de demo...');
            
            const demoRifas = [
                {
                    title: 'iPhone 15 Pro',
                    description: 'Sorteo simulado de iPhone 15 Pro Max de 256GB. Esta es una simulación educativa sin valor monetario.',
                    numbers: [1, 7, 13, 25, 42, 67, 88, 99]
                },
                {
                    title: 'Cartera de Mujer',
                    description: 'Cartera de cuero afgano de alta calidad. Simulación para demostrar el funcionamiento del sistema.',
                    numbers: [3, 18, 34, 51, 76, 82, 95]
                },
                {
                    title: 'Viaje a Europa',
                    description: 'Paquete turístico simulado a Europa por 15 días. Incluye vuelos y hospedaje ficticios.',
                    numbers: [9, 16, 28, 39, 54, 72, 86, 91]
                }
            ];
            
            for (const rifa of demoRifas) {
                const rifaResult = await runQuery(`
                    INSERT INTO rifas (title, description, is_public) 
                    VALUES (?, ?, TRUE)
                `, [rifa.title, rifa.description]);
                
                // Agregar números simulados
                for (const number of rifa.numbers) {
                    await runQuery(`
                        INSERT INTO rifa_numbers (rifa_id, number, participant_name) 
                        VALUES (?, ?, ?)
                    `, [rifaResult.id, number, `Usuario${number}`]);
                }
            }
            
            console.log('✅ Simulaciones públicas de demo creadas');
        } else {
            console.log(`✅ ${publicRifas.length} simulación(es) pública(s) encontrada(s)`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 ¡REPARACIÓN COMPLETADA EXITOSAMENTE!');
        console.log('='.repeat(50));
        console.log('✅ Base de datos verificada y reparada');
        console.log('✅ Usuario de prueba disponible: demo/demo123');
        console.log('✅ Simulaciones de ejemplo creadas');
        console.log('\n🚀 PRÓXIMOS PASOS:');
        console.log('1. Ejecuta: npm run dev (para iniciar el servidor)');
        console.log('2. Ve a: http://localhost:3000');
        console.log('3. Inicia sesión con: demo/demo123');
        console.log('4. Los botones "Ver" y "Editar" deberían funcionar');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Error durante la reparación:', error);
        process.exit(1);
    }
}

repararProblemaVer();
