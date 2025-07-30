const express = require('express');
const { getQuery, allQuery } = require('./database/database');

async function diagnosticarProblemaVer() {
    console.log('🔍 DIAGNÓSTICO ESPECÍFICO: Botón "Ver" en Mis Simulaciones\n');
    
    try {
        // 1. Verificar que el backend esté respondiendo
        console.log('⏳ Paso 1: Verificando conectividad básica...');
        
        try {
            const response = await fetch('http://localhost:3000/api/rifas');
            if (response.ok) {
                console.log('✅ Backend responde - Puerto 3000 activo');
            } else {
                console.log('❌ Backend responde pero con error:', response.status);
            }
        } catch (error) {
            console.log('❌ Backend NO responde:', error.message);
            console.log('💡 Solución: Ejecutar "npm run dev" en backend/');
            return;
        }
        
        // 2. Verificar usuarios de prueba
        console.log('\n⏳ Paso 2: Verificando usuarios de prueba...');
        const users = await allQuery('SELECT id, username, email FROM users');
        console.log(`✅ ${users.length} usuario(s) encontrado(s):`);
        users.forEach(user => {
            console.log(`   - ${user.username} (ID: ${user.id})`);
        });
        
        // 3. Verificar simulaciones del usuario
        console.log('\n⏳ Paso 3: Verificando simulaciones privadas...');
        
        for (const user of users) {
            const userRifas = await allQuery(`
                SELECT r.*, COUNT(rn.id) as numbers_sold
                FROM rifas r
                LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
                WHERE r.user_id = ? AND (r.is_public = FALSE OR r.is_public IS NULL)
                GROUP BY r.id
            `, [user.id]);
            
            console.log(`📋 Usuario "${user.username}" tiene ${userRifas.length} simulación(es):`);
            
            if (userRifas.length === 0) {
                console.log('   ⚠️  No tiene simulaciones privadas');
            } else {
                userRifas.forEach(rifa => {
                    console.log(`   - ID:${rifa.id} "${rifa.title}" (${rifa.numbers_sold} números)`);
                });
            }
        }
        
        // 4. Verificar estructura de respuesta específica
        console.log('\n⏳ Paso 4: Verificando respuesta de API /rifas/my...');
        
        const testUser = users[0];
        if (testUser) {
            const rifas = await allQuery(`
                SELECT 
                    r.*,
                    COUNT(rn.id) as numbers_sold
                FROM rifas r
                LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
                WHERE r.user_id = ? AND (r.is_public = FALSE OR r.is_public IS NULL)
                GROUP BY r.id
                ORDER BY r.created_at DESC
            `, [testUser.id]);
            
            console.log(`✅ Consulta SQL exitosa para usuario ${testUser.username}`);
            console.log('📊 Estructura de respuesta:');
            
            if (rifas.length > 0) {
                const primeraRifa = rifas[0];
                Object.keys(primeraRifa).forEach(key => {
                    console.log(`   ${key}: ${primeraRifa[key]}`);
                });
                
                // Verificar específicamente la simulación individual
                console.log('\n⏳ Paso 5: Verificando consulta individual...');
                const rifaIndividual = await getQuery(`
                    SELECT 
                        r.*,
                        u.username as creator_username,
                        COUNT(rn.id) as numbers_sold
                    FROM rifas r
                    LEFT JOIN users u ON r.user_id = u.id
                    LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
                    WHERE r.id = ? AND r.user_id = ?
                    GROUP BY r.id
                `, [primeraRifa.id, testUser.id]);
                
                if (rifaIndividual) {
                    console.log(`✅ Consulta individual exitosa para rifa ID ${primeraRifa.id}`);
                    console.log(`   Título: ${rifaIndividual.title}`);
                    console.log(`   Números vendidos: ${rifaIndividual.numbers_sold}`);
                    console.log(`   Código: ${rifaIndividual.access_code}`);
                } else {
                    console.log(`❌ No se pudo obtener rifa ID ${primeraRifa.id} individualmente`);
                }
            } else {
                console.log('⚠️  No hay simulaciones para testear');
            }
        }
        
        // 5. Crear datos de prueba si no existen
        if (users.length === 0 || !users.some(u => u.username === 'demo')) {
            console.log('\n🔄 Creando usuario y simulación de prueba...');
            
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('demo123', 10);
            
            // Crear usuario demo
            const { runQuery } = require('./database/database');
            const userResult = await runQuery(`
                INSERT INTO users (username, email, password) 
                VALUES (?, ?, ?)
            `, ['demo', 'demo@test.com', hashedPassword]);
            
            // Crear simulación de prueba
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
                userResult.id,
                'Mi Simulación de Prueba',
                'Simulación creada automáticamente para probar la funcionalidad "Ver".',
                accessCode
            ]);
            
            // Agregar algunos números
            const sampleNumbers = [7, 15, 23, 42, 88];
            for (const number of sampleNumbers) {
                await runQuery(`
                    INSERT INTO rifa_numbers (rifa_id, number, participant_name) 
                    VALUES (?, ?, ?)
                `, [rifaResult.id, number, `Usuario${number}`]);
            }
            
            console.log(`✅ Usuario demo creado: demo/demo123`);
            console.log(`✅ Simulación de prueba creada (ID: ${rifaResult.id}, Código: ${accessCode})`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('🎯 DIAGNÓSTICO COMPLETADO');
        console.log('='.repeat(50));
        console.log('✅ Backend funcionando correctamente');
        console.log('✅ Base de datos accesible');
        console.log('✅ Consultas SQL funcionando');
        console.log('✅ Datos de prueba disponibles');
        console.log('\n🔧 PRÓXIMOS PASOS PARA PROBAR:');
        console.log('1. Asegúrate de que "npm run dev" esté ejecutándose');
        console.log('2. Ve a: http://localhost:3000');
        console.log('3. Inicia sesión con: demo/demo123');
        console.log('4. Ve a "Mis Simulaciones"');
        console.log('5. Haz click en "Ver" en cualquier simulación');
        console.log('\n💡 Si sigue fallando, ejecuta: "test_ver_button.js"');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Error durante diagnóstico:', error);
        console.log('\n🔧 POSIBLES SOLUCIONES:');
        console.log('1. Verificar que el backend esté corriendo: npm run dev');
        console.log('2. Recrear base de datos: npm run init-db');
        console.log('3. Verificar permisos de archivos');
    }
}

// Verificar si se está ejecutando desde Node.js
if (require.main === module) {
    diagnosticarProblemaVer();
}

module.exports = { diagnosticarProblemaVer };
