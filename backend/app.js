require('dotenv').config(); // Cargar variables de entorno al inicio

const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./database/database');

// Importar rutas
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de API
app.use('/api/auth', authRoutes);

// Ruta principal - servir el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/rifa_app_62.html'));
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '🎯 Servidor de rifas funcionando correctamente!',
        timestamp: new Date().toISOString()
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Inicializar base de datos y servidor
async function startServer() {
    try {
        console.log('🚀 Iniciando servidor...');
        
        // Inicializar base de datos
        await database.init();
        console.log('✅ Base de datos inicializada');
        
        // Verificar que JWT_SECRET esté configurado
        if (!process.env.JWT_SECRET) {
            console.error('❌ ERROR: JWT_SECRET no está configurado en .env');
            process.exit(1);
        }
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🎯 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log('📊 Endpoints disponibles:');
            console.log('   GET  /                    - Aplicación web');
            console.log('   GET  /api/test           - Prueba de servidor');
            console.log('   POST /api/auth/register  - Registro de usuario');
            console.log('   POST /api/auth/login     - Inicio de sesión');
            console.log('   GET  /api/auth/me        - Usuario actual');
            console.log('   POST /api/auth/logout    - Cerrar sesión');
            console.log('🔐 Sistema de autenticación JWT configurado');
        });
        
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
}

startServer();