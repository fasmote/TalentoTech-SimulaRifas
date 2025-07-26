const { getQuery, allQuery } = require('./database/database');

const verificarSistema = async () => {
    console.log('🔍 VERIFICANDO SISTEMA...\n');

    try {
        // 1. Verificar conexión a la base de datos
        console.log('1️⃣  Verificando conexión a la base de datos...');
        const testQuery = await getQuery('SELECT 1 as test');
        if (testQuery && testQuery.test === 1) {
            console.log('   ✅ Conexión a SQLite exitosa');
        } else {
            console.log('   ❌ Error en conexión a la base de datos');
            return;
        }

        // 2. Verificar tablas
        console.log('\n2️⃣  Verificando estructura de tablas...');
        const tables = await allQuery(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
        `);
        
        const expectedTables = ['users', 'rifas', 'rifa_numbers'];
        const foundTables = tables.map(t => t.name);
        
        expectedTables.forEach(table => {
            if (foundTables.includes(table)) {
                console.log(`   ✅ Tabla '${table}' existe`);
            } else {
                console.log(`   ❌ Tabla '${table}' NO encontrada`);
            }
        });

        // 3. Verificar usuarios
        console.log('\n3️⃣  Verificando usuarios de prueba...');
        const users = await allQuery('SELECT username, email FROM users');
        if (users.length > 0) {
            console.log(`   ✅ ${users.length} usuarios encontrados:`);
            users.forEach(user => {
                console.log(`      - ${user.username} (${user.email})`);
            });
        } else {
            console.log('   ⚠️  No se encontraron usuarios');
        }

        // 4. Verificar rifas
        console.log('\n4️⃣  Verificando rifas de ejemplo...');
        const rifas = await allQuery('SELECT title, status FROM rifas');
        if (rifas.length > 0) {
            console.log(`   ✅ ${rifas.length} rifas encontradas:`);
            rifas.forEach(rifa => {
                console.log(`      - ${rifa.title} (${rifa.status})`);
            });
        } else {
            console.log('   ⚠️  No se encontraron rifas');
        }

        // 5. Verificar números de rifas
        console.log('\n5️⃣  Verificando participaciones...');
        const numbers = await allQuery('SELECT COUNT(*) as total FROM rifa_numbers');
        const totalNumbers = numbers[0].total;
        if (totalNumbers > 0) {
            console.log(`   ✅ ${totalNumbers} números/participaciones registradas`);
        } else {
            console.log('   ⚠️  No se encontraron participaciones');
        }

        // 6. Verificar índices
        console.log('\n6️⃣  Verificando índices de base de datos...');
        const indexes = await allQuery(`
            SELECT name FROM sqlite_master 
            WHERE type='index' AND name LIKE 'idx_%'
        `);
        if (indexes.length > 0) {
            console.log(`   ✅ ${indexes.length} índices encontrados`);
            indexes.forEach(idx => {
                console.log(`      - ${idx.name}`);
            });
        } else {
            console.log('   ⚠️  No se encontraron índices personalizados');
        }

        console.log('\n🎉 VERIFICACIÓN COMPLETADA');
        console.log('\n📋 RESUMEN:');
        console.log(`   - Tablas: ${foundTables.length}/${expectedTables.length}`);
        console.log(`   - Usuarios: ${users.length}`);
        console.log(`   - Rifas: ${rifas.length}`);
        console.log(`   - Participaciones: ${totalNumbers}`);
        console.log(`   - Índices: ${indexes.length}`);

        if (users.length > 0 && rifas.length > 0) {
            console.log('\n✅ Sistema listo para usar!');
            console.log('\n🚀 Para iniciar el servidor:');
            console.log('   npm run dev');
            console.log('\n🌐 URL: http://localhost:3000');
        } else {
            console.log('\n⚠️  Sistema necesita datos de ejemplo:');
            console.log('   npm run sample-data');
        }

    } catch (error) {
        console.error('\n❌ Error durante la verificación:', error.message);
        console.log('\n🔧 Posibles soluciones:');
        console.log('   1. Inicializar la base de datos: npm run init-db');
        console.log('   2. Agregar datos de ejemplo: npm run sample-data');
        console.log('   3. Reinstalar dependencias: npm install');
    }

    process.exit(0);
};

// Ejecutar si se llama directamente
if (require.main === module) {
    verificarSistema();
}

module.exports = verificarSistema;
