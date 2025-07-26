const { runQuery } = require('./database');

const initDatabase = async () => {
    try {
        console.log('🔨 Inicializando base de datos - Fase 12...');

        // Crear tabla de usuarios
        await runQuery(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de rifas/simulaciones - ACTUALIZADA PARA FASE 12
        await runQuery(`
            CREATE TABLE IF NOT EXISTS rifas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                access_code VARCHAR(6),
                max_numbers INTEGER DEFAULT 100,
                status VARCHAR(20) DEFAULT 'active',
                is_public BOOLEAN DEFAULT FALSE,
                winner_number INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Crear tabla de números seleccionados/vendidos
        await runQuery(`
            CREATE TABLE IF NOT EXISTS rifa_numbers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rifa_id INTEGER NOT NULL,
                number INTEGER NOT NULL,
                is_selected BOOLEAN DEFAULT TRUE,
                participant_name VARCHAR(100),
                selected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (rifa_id) REFERENCES rifas(id),
                UNIQUE(rifa_id, number)
            )
        `);

        // Actualizar tabla existente para agregar nuevos campos
        try {
            await runQuery(`ALTER TABLE rifas ADD COLUMN access_code VARCHAR(6)`);
            console.log('✅ Campo access_code agregado');
        } catch (err) {
            console.log('📋 Campo access_code ya existe o no se pudo agregar');
        }

        try {
            await runQuery(`ALTER TABLE rifas ADD COLUMN is_public BOOLEAN DEFAULT FALSE`);
            console.log('✅ Campo is_public agregado');
        } catch (err) {
            console.log('📋 Campo is_public ya existe o no se pudo agregar');
        }

        // Crear índices para optimización
        await runQuery(`CREATE INDEX IF NOT EXISTS idx_rifas_user_id ON rifas(user_id)`);
        await runQuery(`CREATE INDEX IF NOT EXISTS idx_rifa_numbers_rifa_id ON rifa_numbers(rifa_id)`);
        await runQuery(`CREATE INDEX IF NOT EXISTS idx_rifas_status ON rifas(status)`);
        await runQuery(`CREATE INDEX IF NOT EXISTS idx_rifas_is_public ON rifas(is_public)`);
        await runQuery(`CREATE INDEX IF NOT EXISTS idx_rifas_access_code ON rifas(access_code)`);

        console.log('✅ Base de datos inicializada correctamente!');

        // Insertar datos de ejemplo
        console.log('📝 Insertando datos de ejemplo para Fase 12...');
        
        // Usuario de ejemplo (contraseña: "123456")
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        try {
            await runQuery(`
                INSERT INTO users (username, email, password_hash) 
                VALUES (?, ?, ?)
            `, ['admin', 'admin@talentotech.com', hashedPassword]);
            console.log('👤 Usuario admin creado (username: admin, password: 123456)');
        } catch (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                console.log('👤 Usuario admin ya existe');
            }
        }

        // Función para generar código de acceso
        const generateAccessCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        // Rifas públicas de ejemplo (simuladas) para usuarios no logueados
        try {
            await runQuery(`
                INSERT OR IGNORE INTO rifas (user_id, title, description, is_public, status) 
                VALUES (NULL, 'PlayStation 5', 'Simulación de ejemplo para evento gaming', TRUE, 'active')
            `);
            
            await runQuery(`
                INSERT OR IGNORE INTO rifas (user_id, title, description, is_public, status) 
                VALUES (NULL, 'iPhone 15 Pro', 'Simulación de ejemplo para evento corporativo', TRUE, 'active')
            `);

            await runQuery(`
                INSERT OR IGNORE INTO rifas (user_id, title, description, is_public, status) 
                VALUES (NULL, 'Pack de Productos', 'Simulación de ejemplo para evento familiar', TRUE, 'active')
            `);
            
            console.log('🎮 Rifas públicas de ejemplo creadas (simuladas)');
        } catch (err) {
            console.log('🎮 Error creando rifas de ejemplo:', err.message);
        }

        // Actualizar rifas existentes para que tengan códigos de acceso si no son públicas
        try {
            const rifasPrivadas = await runQuery(`
                SELECT id FROM rifas WHERE user_id IS NOT NULL AND (access_code IS NULL OR access_code = '')
            `);

            for (const rifa of rifasPrivadas) {
                const code = generateAccessCode();
                await runQuery(`
                    UPDATE rifas SET access_code = ? WHERE id = ?
                `, [code, rifa.id]);
            }
            
            console.log('🔑 Códigos de acceso generados para rifas privadas existentes');
        } catch (err) {
            console.log('🔑 Error generando códigos:', err.message);
        }

        console.log('🎉 Fase 12 - Base de datos actualizada correctamente!');
        console.log('📋 Cambios principales:');
        console.log('   - Eliminado campo price_per_number (cumplimiento legal)');
        console.log('   - Agregado campo access_code para simulaciones privadas');
        console.log('   - Agregado campo is_public para rifas de demostración');
        console.log('   - Rifas privadas solo accesibles mediante código');
        console.log('   - Rifas públicas disponibles para experimentación');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    initDatabase();
}

module.exports = initDatabase;
