// Conexión a la base de datos SQLite
// Trabajo Práctico Final - IFTS11

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta donde se va a guardar la base de datos
const dbPath = path.join(__dirname, 'rifas.db');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
    }
});

// Función para crear las tablas si no existen
function inicializarBaseDatos() {
    // Tabla de usuarios
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

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
    `);

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
    `);

    console.log('📋 Tablas de base de datos creadas/verificadas');
}

// Función para probar la conexión
function probarConexion() {
    db.get("SELECT datetime('now') as fecha", (err, row) => {
        if (err) {
            console.error('❌ Error en la prueba:', err.message);
        } else {
            console.log('🕒 Prueba exitosa. Fecha actual:', row.fecha);
        }
    });
}

module.exports = {
    db,
    inicializarBaseDatos,
    probarConexion
};
