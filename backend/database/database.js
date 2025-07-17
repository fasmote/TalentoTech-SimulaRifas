// Conexión a la base de datos SQLite
// Trabajo Práctico Final - IFTS11

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db = null;

// Función para inicializar la base de datos
async function init() {
    return new Promise((resolve, reject) => {
        // Ruta donde se va a guardar la base de datos
        const dbPath = path.join(__dirname, 'rifas.db');

        // Crear conexión a la base de datos
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error conectando a la base de datos:', err.message);
                reject(err);
            } else {
                console.log('✅ Conectado a la base de datos SQLite');
                
                // Crear las tablas después de conectar
                crearTablas()
                    .then(() => {
                        console.log('📋 Tablas de base de datos creadas/verificadas');
                        resolve();
                    })
                    .catch(reject);
            }
        });
    });
}

// Función para crear las tablas si no existen
function crearTablas() {
    return new Promise((resolve, reject) => {
        let tablasCreadas = 0;
        const totalTablas = 3;

        const finalizarCreacion = () => {
            tablasCreadas++;
            if (tablasCreadas === totalTablas) {
                resolve();
            }
        };

        // Tabla de usuarios
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creando tabla users:', err);
                reject(err);
            } else {
                finalizarCreacion();
            }
        });

        // Tabla de rifas
        db.run(`
            CREATE TABLE IF NOT EXISTS rifas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                price_per_number REAL,
                max_numbers INTEGER DEFAULT 100,
                status TEXT DEFAULT 'active',
                winner_number INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creando tabla rifas:', err);
                reject(err);
            } else {
                finalizarCreacion();
            }
        });

        // Tabla de números seleccionados en cada rifa
        db.run(`
            CREATE TABLE IF NOT EXISTS rifa_numbers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rifa_id INTEGER NOT NULL,
                number INTEGER NOT NULL,
                participant_name TEXT,
                selected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (rifa_id) REFERENCES rifas(id),
                UNIQUE(rifa_id, number)
            )
        `, (err) => {
            if (err) {
                console.error('Error creando tabla rifa_numbers:', err);
                reject(err);
            } else {
                finalizarCreacion();
            }
        });
    });
}

// Función para obtener la conexión de la base de datos
function getDb() {
    if (!db) {
        throw new Error('Base de datos no inicializada. Llama a init() primero.');
    }
    return db;
}

// Función para probar la conexión
function probarConexion() {
    if (!db) {
        console.error('❌ Base de datos no inicializada');
        return;
    }
    
    db.get("SELECT datetime('now') as fecha", (err, row) => {
        if (err) {
            console.error('❌ Error en la prueba:', err.message);
        } else {
            console.log('🕒 Prueba exitosa. Fecha actual:', row.fecha);
        }
    });
}

// Función para cerrar la conexión
function close() {
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error cerrando la base de datos:', err);
            } else {
                console.log('🔐 Base de datos cerrada');
            }
        });
    }
}

module.exports = {
    init,
    getDb,
    probarConexion,
    close
};