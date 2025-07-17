// Script para probar que la base de datos funciona
// Este archivo lo ejecuto para verificar que todo esté bien

const { db, inicializarBaseDatos, probarConexion } = require('./database');

console.log('🚀 Iniciando prueba de base de datos...');

// Primero crear las tablas
inicializarBaseDatos();

// Esperar un poco y probar la conexión
setTimeout(() => {
    probarConexion();
    
    // Probar insertar un usuario de prueba
    const testUser = {
        username: 'usuario_prueba',
        email: 'prueba@test.com',
        password_hash: 'hash_temporal'
    };
    
    db.run(
        'INSERT OR IGNORE INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [testUser.username, testUser.email, testUser.password_hash],
        function(err) {
            if (err) {
                console.error('❌ Error insertando usuario de prueba:', err.message);
            } else {
                console.log('✅ Usuario de prueba insertado. ID:', this.lastID);
                
                // Verificar que se guardó
                db.get('SELECT * FROM users WHERE username = ?', [testUser.username], (err, row) => {
                    if (err) {
                        console.error('❌ Error consultando usuario:', err.message);
                    } else if (row) {
                        console.log('📋 Usuario encontrado:', {
                            id: row.id,
                            username: row.username,
                            email: row.email,
                            created_at: row.created_at
                        });
                    }
                    
                    // Cerrar conexión
                    db.close((err) => {
                        if (err) {
                            console.error('❌ Error cerrando base de datos:', err.message);
                        } else {
                            console.log('🔒 Base de datos cerrada correctamente');
                        }
                    });
                });
            }
        }
    );
}, 1000);
