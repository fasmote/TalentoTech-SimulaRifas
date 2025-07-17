// ========================================
// SERVIDOR EXPRESS SUPER SIMPLE - PASO 1
// ========================================

// 1. Importamos las librerías que necesitamos
const express = require('express');
const path = require('path');
const cors = require('cors');

// 2. Creamos nuestra aplicación Express
const app = express();

// 3. Configuramos el puerto (donde va a "escuchar" nuestro servidor)
const PORT = process.env.PORT || 3000;

// 4. Middleware básico (piénsalo como "filtros" que procesan las peticiones)
app.use(cors()); // Permite que el frontend se conecte al backend
app.use(express.json()); // Permite leer datos JSON que envíe el frontend
app.use(express.static(path.join(__dirname, '../frontend'))); // Sirve archivos estáticos

// 5. Nuestra primera ruta - cuando alguien vaya a http://localhost:3000/
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

// 6. Ruta para servir tu aplicación actual
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/rifa_app_62.html'));
});

// 7. Ruta de prueba para la API
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API funcionando correctamente!', 
        timestamp: new Date().toISOString(),
        status: 'success'
    });
});

// 8. Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`
    🚀 ¡SERVIDOR INICIADO EXITOSAMENTE!
    
    📍 URL: http://localhost:${PORT}
    📱 Tu app: http://localhost:${PORT}/app
    🔧 API test: http://localhost:${PORT}/api/test
    
    💡 Para detener el servidor: Ctrl + C
    💡 Para reiniciar: npm run dev
    `);
});

// 9. Manejo de errores básico
process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
    process.exit(1);
});
