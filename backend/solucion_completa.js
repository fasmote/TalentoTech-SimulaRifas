const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

console.log('🚀 EJECUTANDO SOLUCION COMPLETA - FASE 15d');
console.log('==========================================');

const dbPath = path.join(__dirname, 'rifas.db');

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
        inicializarTodo();
    }
});

async function inicializarTodo() {
    try {
        console.log('');
        console.log('🗄️ 1. CREANDO TABLAS...');
        
        // Crear todas las tablas
        await ejecutarQuery(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await ejecutarQuery(`
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
        
        await ejecutarQuery(`
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
        
        console.log('✅ Tablas creadas exitosamente');
        
        console.log('');
        console.log('🔑 2. CREANDO INDICES...');
        
        await ejecutarQuery(`CREATE INDEX IF NOT EXISTS idx_rifas_user_id ON rifas(user_id)`);
        await ejecutarQuery(`CREATE INDEX IF NOT EXISTS idx_rifa_numbers_rifa_id ON rifa_numbers(rifa_id)`);
        await ejecutarQuery(`CREATE INDEX IF NOT EXISTS idx_rifas_status ON rifas(status)`);
        await ejecutarQuery(`CREATE INDEX IF NOT EXISTS idx_rifas_is_public ON rifas(is_public)`);
        await ejecutarQuery(`CREATE INDEX IF NOT EXISTS idx_rifas_access_code ON rifas(access_code)`);
        
        console.log('✅ Índices creados exitosamente');
        
        console.log('');
        console.log('👤 3. CREANDO USUARIO ADMIN...');
        
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        try {
            await ejecutarQuery(`
                INSERT OR REPLACE INTO users (id, username, email, password_hash) 
                VALUES (1, 'admin', 'admin@talentotech.com', ?)
            `, [hashedPassword]);
            console.log('✅ Usuario admin creado (username: admin, password: 123456)');
        } catch (err) {
            console.log('⚠️ Usuario admin ya existe');
        }
        
        console.log('');
        console.log('🎊 4. CREANDO RIFAS PUBLICAS DEMO...');
        
        // Limpiar rifas públicas existentes
        await ejecutarQuery('DELETE FROM rifa_numbers WHERE rifa_id IN (SELECT id FROM rifas WHERE is_public = TRUE)');
        await ejecutarQuery('DELETE FROM rifas WHERE is_public = TRUE');
        
        // Función para generar código de acceso
        const generateAccessCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        
        // Rifas demo
        const rifasDemo = [
            {
                title: 'iPhone 15 Pro',
                description: 'Sorteo corporativo educativo. El más moderno smartphone de Apple con cámara profesional, pantalla Super Retina XDR y chip A17 Pro. Esta es una simulación educativa sin valor monetario.',
                participantes: ['Ana Martínez', 'Carlos Silva', 'María Rodriguez', 'Juan Pérez', 'Sofia López', 'Diego García', 'Laura Fernández', 'Miguel Torres', 'Valentina Cruz', 'Sebastián Ruiz', 'Camila Vargas', 'Andrés Morales']
            },
            {
                title: 'Cartera de Mujer Premium',
                description: 'Elegante cartera de cuero afgano auténtico, hecha a mano por artesanos especializados. Incluye múltiples compartimentos y acabados de lujo. Simulación educativa para fines de demostración.',
                participantes: ['Isabella Santos', 'Gabriela Herrera', 'Natalia Jiménez', 'Adriana Castro', 'Lucía Mendoza', 'Daniela Ortiz', 'Alejandra Vega', 'Carolina Reyes', 'Antonella Flores', 'Valentina Rojas']
            },
            {
                title: 'Viaje a Europa',
                description: 'Promoción especial educativa: Viaje todo incluido para 2 personas por 15 días visitando París, Roma, Madrid y Barcelona. Incluye vuelos, hoteles 4 estrellas y tours guiados. Esta es una simulación para fines educativos.',
                participantes: ['Roberto Delgado', 'Fernanda Aguilar', 'Ricardo Salinas', 'Mónica Paredes', 'Eduardo Ramírez', 'Paola Cortés', 'Alberto Guerrero', 'Sandra Molina', 'Javier Espinoza', 'Rocío Cabrera', 'Mauricio Luna', 'Beatriz Navarro', 'Gabriel Soto', 'Elena Ramos', 'Fernando Medina', 'Cristina Peña']
            }
        ];
        
        for (let i = 0; i < rifasDemo.length; i++) {
            const rifa = rifasDemo[i];
            const accessCode = generateAccessCode();
            
            // Crear rifa
            const rifaResult = await ejecutarQuery(`
                INSERT INTO rifas (user_id, title, description, access_code, is_public, status, max_numbers) 
                VALUES (NULL, ?, ?, ?, TRUE, 'active', 100)
            `, [rifa.title, rifa.description, accessCode]);
            
            const rifaId = rifaResult.lastID;
            console.log(`📱 Rifa "${rifa.title}" creada (ID: ${rifaId}, Código: ${accessCode})`);
            
            // Agregar participantes
            const participantes = rifa.participantes;
            const numerosAsignados = new Set();
            
            for (let j = 0; j < participantes.length; j++) {
                const participante = participantes[j];
                const cantidadNumeros = Math.floor(Math.random() * 3) + 1;
                
                for (let k = 0; k < cantidadNumeros; k++) {
                    let numero;
                    let intentos = 0;
                    
                    do {
                        numero = Math.floor(Math.random() * 100);
                        intentos++;
                    } while (numerosAsignados.has(numero) && intentos < 50);
                    
                    if (!numerosAsignados.has(numero)) {
                        numerosAsignados.add(numero);
                        
                        const horasAtras = Math.floor(Math.random() * 72) + 1;
                        await ejecutarQuery(`
                            INSERT INTO rifa_numbers (rifa_id, number, participant_name, selected_at) 
                            VALUES (?, ?, ?, datetime('now', '-' || ? || ' hours'))
                        `, [rifaId, numero, participante, horasAtras]);
                    }
                }
            }
            
            console.log(`👥 ${numerosAsignados.size} números asignados a ${participantes.length} participantes`);
        }
        
        console.log('');
        console.log('🎉 ¡SOLUCION COMPLETADA EXITOSAMENTE!');
        console.log('=====================================');
        console.log('');
        console.log('✅ Base de datos inicializada');
        console.log('✅ Usuario admin creado');
        console.log('✅ 3 rifas públicas demo creadas:');
        console.log('   📱 iPhone 15 Pro (12 participantes)');
        console.log('   👜 Cartera Premium (10 participantes)');
        console.log('   ✈️ Viaje Europa (16 participantes)');
        console.log('');
        console.log('🌐 SIGUIENTE PASO:');
        console.log('   1. Ejecuta: npm run dev');
        console.log('   2. Ve a: http://localhost:3000');
        console.log('   3. Haz clic en "Simulaciones Públicas"');
        console.log('   4. ¡Deberías ver las 3 rifas demo!');
        console.log('');
        
        db.close((err) => {
            if (err) {
                console.error('❌ Error cerrando la base de datos:', err.message);
            } else {
                console.log('✅ Base de datos cerrada correctamente');
            }
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Error en la inicialización:', error.message);
        process.exit(1);
    }
}

function ejecutarQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('INSERT')) {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        } else {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        }
    });
}
