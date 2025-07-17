// Conexión a la base de datos SQLite
// Trabajo Práctico Final - IFTS11
// Chat #2 - Con sistema de logging integrado

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

let db = null;

// Función para inicializar la base de datos
async function init() {
    return new Promise((resolve, reject) => {
        // Ruta donde se va a guardar la base de datos
        const dbPath = path.join(__dirname, 'rifas.db');
        logger.database(`Intentando conectar a base de datos: ${dbPath}`);

        // Crear conexión a la base de datos
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                logger.error('Error conectando a la base de datos', 'DB', err);
                reject(err);
            } else {
                logger.database('Conectado a la base de datos SQLite exitosamente');
                
                // Habilitar foreign keys
                db.run('PRAGMA foreign_keys = ON', (err) => {
                    if (err) {
                        logger.warn('No se pudieron habilitar foreign keys', 'DB');
                    } else {
                        logger.database('Foreign keys habilitadas');
                    }
                });
                
                // Crear las tablas después de conectar
                crearTablas()
                    .then(() => {
                        logger.success('Tablas de base de datos creadas/verificadas exitosamente', 'DB');
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
        
        logger.database('Iniciando creación/verificación de tablas');

        const finalizarCreacion = (nombreTabla) => {
            tablasCreadas++;
            logger.database(`Tabla '${nombreTabla}' verificada/creada (${tablasCreadas}/${totalTablas})`);
            
            if (tablasCreadas === totalTablas) {
                logger.database('Todas las tablas han sido procesadas');
                resolve();
            }
        };

        // Tabla de usuarios
        logger.debug('Creando tabla users', 'DB');
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
                logger.error('Error creando tabla users', 'DB', err);
                reject(err);
            } else {
                finalizarCreacion('users');
            }
        });

        // Tabla de rifas
        logger.debug('Creando tabla rifas', 'DB');
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
                logger.error('Error creando tabla rifas', 'DB', err);
                reject(err);
            } else {
                finalizarCreacion('rifas');
            }
        });

        // Tabla de números seleccionados en cada rifa
        logger.debug('Creando tabla rifa_numbers', 'DB');
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
                logger.error('Error creando tabla rifa_numbers', 'DB', err);
                reject(err);
            } else {
                finalizarCreacion('rifa_numbers');
            }
        });
    });
}

// Función para obtener la conexión de la base de datos
function getDb() {
    if (!db) {
        const error = new Error('Base de datos no inicializada. Llama a init() primero.');
        logger.error('Intento de acceso a DB no inicializada', 'DB', error);
        throw error;
    }
    return db;
}

// Función para probar la conexión
function probarConexion() {
    if (!db) {
        logger.error('Base de datos no inicializada para prueba', 'DB');
        return;
    }
    
    logger.database('Ejecutando prueba de conexión');
    db.get("SELECT datetime('now') as fecha", (err, row) => {
        if (err) {
            logger.error('Error en la prueba de conexión', 'DB', err);
        } else {
            logger.success(`Prueba de conexión exitosa. Fecha actual: ${row.fecha}`, 'DB');
        }
    });
}

// Función para obtener estadísticas de la base de datos
async function getStats() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Base de datos no inicializada'));
            return;
        }
        
        logger.debug('Obteniendo estadísticas de base de datos', 'DB');
        
        const stats = {};
        let consultas = 0;
        const totalConsultas = 3;
        
        const finalizarStats = () => {
            consultas++;
            if (consultas === totalConsultas) {
                logger.database('Estadísticas de DB obtenidas exitosamente');
                resolve(stats);
            }
        };
        
        // Contar usuarios
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (err) {
                logger.warn('Error contando usuarios', 'DB');
                stats.users = 0;
            } else {
                stats.users = row.count;
            }
            finalizarStats();
        });
        
        // Contar rifas
        db.get('SELECT COUNT(*) as count FROM rifas', (err, row) => {
            if (err) {
                logger.warn('Error contando rifas', 'DB');
                stats.rifas = 0;
            } else {
                stats.rifas = row.count;
            }
            finalizarStats();
        });
        
        // Contar números seleccionados
        db.get('SELECT COUNT(*) as count FROM rifa_numbers', (err, row) => {
            if (err) {
                logger.warn('Error contando números', 'DB');
                stats.numbers = 0;
            } else {
                stats.numbers = row.count;
            }
            finalizarStats();
        });
    });
}

// Función para crear un usuario de prueba (solo en desarrollo)
async function createTestUser() {
    if (process.env.NODE_ENV !== 'development') {
        logger.warn('Creación de usuario de prueba solo disponible en desarrollo', 'DB');
        return;
    }
    
    return new Promise((resolve, reject) => {
        logger.database('Creando usuario de prueba...');
        
        // Verificar si ya existe
        db.get('SELECT id FROM users WHERE username = ?', ['admin_test'], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            if (row) {
                logger.database('Usuario de prueba ya existe');
                resolve(row);
                return;
            }
            
            // Crear usuario de prueba
            const bcrypt = require('bcryptjs');
            const passwordHash = bcrypt.hashSync('123456', 10);
            
            db.run(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                ['admin_test', 'admin@test.com', passwordHash],
                function(err) {
                    if (err) {
                        logger.error('Error creando usuario de prueba', 'DB', err);
                        reject(err);
                    } else {
                        logger.success('Usuario de prueba creado - admin_test/123456', 'DB');
                        resolve({ id: this.lastID });
                    }
                }
            );
        });
    });
}

// Función para cerrar la conexión
function close() {
    if (db) {
        logger.database('Cerrando conexión a base de datos');
        db.close((err) => {
            if (err) {
                logger.error('Error cerrando la base de datos', 'DB', err);
            } else {
                logger.database('Base de datos cerrada correctamente');
            }
        });
    }
}

module.exports = {
    init,
    getDb,
    probarConexion,
    getStats,
    createTestUser,
    close
};