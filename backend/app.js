// ========================================
// SERVIDOR EXPRESS CON BASE DE DATOS - PASO 2
// ========================================

// 1. Importamos las librerías que necesitamos
const express = require('express');
const path = require('path');
const cors = require('cors');

// 2. Importar la base de datos
const { db, inicializarBaseDatos, probarConexion } = require('./database/database');

// 3. Creamos nuestra aplicación Express
const app = express();

// 4. Configuramos el puerto (donde va a "escuchar" nuestro servidor)
const PORT = process.env.PORT || 3000;

// 5. Middleware básico (piénsalo como "filtros" que procesan las peticiones)
app.use(cors()); // Permite que el frontend se conecte al backend
app.use(express.json()); // Permite leer datos JSON que envíe el frontend
app.use(express.static(path.join(__dirname, '../frontend'))); // Sirve archivos estáticos

// 6. Nuestra primera ruta - cuando alguien vaya a http://localhost:3000/
app.get('/', (req, res) => {
    res.send(`
        <h1>🎲 ¡Servidor de Rifas Funcionando!</h1>
        <p>¡Felicidades! Tu servidor Express está corriendo perfectamente.</p>
        <p><strong>Próximos pasos:</strong></p>
        <ul>
            <li>✅ Servidor Express funcionando</li>
            <li>⏳ Conectar base de datos SQLite</li>
            <li>⏳ Sistema de autenticación</li>
            <li>⏳ API de rifas</li>
        </ul>
        <br>
        <a href="/app">👉 Ver tu aplicación de rifas actual</a>
    `);
});

// 7. Ruta para servir tu aplicación actual
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/rifa_app_62.html'));
});

// 8. Ruta de prueba para la API
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API funcionando correctamente!', 
        timestamp: new Date().toISOString(),
        status: 'success'
    });
});

// 9. Nueva ruta para probar la base de datos
app.get('/api/db-test', (req, res) => {
    db.get("SELECT datetime('now') as fecha, COUNT(*) as total_users FROM users", (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        } else {
            res.json({ 
                message: 'Base de datos funcionando!', 
                fecha: row.fecha,
                usuarios_registrados: row.total_users,
                status: 'success'
            });
        }
    });
});

// 10. Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`
    🚀 ¡SERVIDOR CON BASE DE DATOS INICIADO!
    
    📍 URL: http://localhost:${PORT}
    📱 Tu app: http://localhost:${PORT}/app
    🔧 API test: http://localhost:${PORT}/api/test
    🗺️ DB test: http://localhost:${PORT}/api/db-test
    
    💡 Para detener el servidor: Ctrl + C
    💡 Para reiniciar: npm run dev
    `);
});

// 11. Inicializar base de datos cuando arranca el servidor
inicializarBaseDatos();
setTimeout(() => {
    probarConexion();
}, 1000);

// 12. Manejo de errores básico
process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
    process.exit(1);
});
