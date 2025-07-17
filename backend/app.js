require('dotenv').config(); // Cargar variables de entorno al inicio

const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./database/database');

// 🔧 Importar nuevo sistema de logging
const logger = require('./utils/logger');
const { httpLogger, errorLogger } = require('./middleware/logging');

// Importar rutas
const authRoutes = require('./routes/auth');
const rifasRoutes = require('./routes/rifas');

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 Middleware de logging HTTP (debe ir antes que otros middlewares)
app.use(httpLogger);

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📊 Middleware para loguear configuración inicial
app.use((req, res, next) => {
    // Solo en la primera request, mostrar configuración
    if (!app.locals.configLogged) {
        logger.info('Configuración del servidor cargada', 'CONFIG');
        logger.debug(`Puerto: ${PORT}`, 'CONFIG');
        logger.debug(`Entorno: ${process.env.NODE_ENV}`, 'CONFIG');
        logger.debug(`CORS habilitado`, 'CONFIG');
        app.locals.configLogged = true;
    }
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/rifas', rifasRoutes);

// Ruta principal - servir el HTML
app.get('/', (req, res) => {
    logger.debug('Sirviendo página principal', 'STATIC');
    res.sendFile(path.join(__dirname, '../frontend/rifa_app_62.html'));
});

// Ruta de prueba con logging mejorado
app.get('/api/test', (req, res) => {
    logger.api('Ejecutando test de servidor', 'TEST');
    
    const testData = {
        success: true, 
        message: '🎯 Servidor de rifas funcionando correctamente!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        logging: 'Activado con diferenciación por entorno'
    };
    
    logger.success('Test de servidor completado exitosamente', 'TEST');
    res.json(testData);
});

// 📈 Ruta para obtener estadísticas de logs (solo en desarrollo)
app.get('/api/logs/stats', (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({
            success: false,
            message: 'Endpoint solo disponible en desarrollo'
        });
    }
    
    try {
        const stats = logger.getStats();
        logger.debug('Consultando estadísticas de logs', 'LOGS');
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error obteniendo estadísticas de logs', 'LOGS', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo estadísticas'
        });
    }
});

// 🧹 Ruta para rotar logs (solo en producción)
app.post('/api/logs/rotate', (req, res) => {
    if (process.env.NODE_ENV === 'development') {
        return res.status(403).json({
            success: false,
            message: 'Rotación de logs no necesaria en desarrollo'
        });
    }
    
    try {
        logger.rotateLogs();
        logger.info('Rotación de logs ejecutada manualmente', 'ADMIN');
        res.json({
            success: true,
            message: 'Logs rotados exitosamente'
        });
    } catch (error) {
        logger.error('Error en rotación de logs', 'ADMIN', error);
        res.status(500).json({
            success: false,
            message: 'Error rotando logs'
        });
    }
});

// 🚨 Middleware de manejo de errores con logging
app.use(errorLogger);
app.use((err, req, res, next) => {
    // El errorLogger ya registró el error, solo enviar respuesta
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' ? 
            err.message : 'Error interno del servidor'
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 'HTTP');
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Inicializar base de datos y servidor
async function startServer() {
    try {
        logger.startup('Iniciando servidor de rifas...');
        
        // Inicializar base de datos
        logger.database('Inicializando conexión a base de datos');
        await database.init();
        logger.database('Base de datos inicializada exitosamente');
        
        // Verificar que JWT_SECRET esté configurado
        if (!process.env.JWT_SECRET) {
            logger.error('JWT_SECRET no está configurado en .env', 'CONFIG');
            process.exit(1);
        }
        logger.auth('JWT_SECRET configurado correctamente');
        
        // Rotar logs si es necesario (solo en producción)
        if (process.env.NODE_ENV === 'production') {
            logger.rotateLogs();
        }
        
        // Iniciar servidor
        app.listen(PORT, () => {
            logger.startup(`Servidor ejecutándose en http://localhost:${PORT}`);
            logger.info('📊 Endpoints disponibles:', 'STARTUP');
            logger.info('   GET  /                    - Aplicación web', 'STARTUP');
            logger.info('   GET  /api/test           - Prueba de servidor', 'STARTUP');
            logger.info('   POST /api/auth/register  - Registro de usuario', 'STARTUP');
            logger.info('   POST /api/auth/login     - Inicio de sesión', 'STARTUP');
            logger.info('   GET  /api/auth/me        - Usuario actual', 'STARTUP');
            logger.info('   POST /api/auth/logout    - Cerrar sesión', 'STARTUP');
            logger.info('   GET  /api/rifas          - Listar rifas públicas', 'STARTUP');
            logger.info('   GET  /api/rifas/my       - Mis rifas (autenticado)', 'STARTUP');
            logger.info('   POST /api/rifas          - Crear rifa (autenticado)', 'STARTUP');
            logger.info('   GET  /api/rifas/:id      - Detalles de rifa', 'STARTUP');
            logger.info('   PUT  /api/rifas/:id      - Editar rifa (propietario)', 'STARTUP');
            logger.info('   DEL  /api/rifas/:id      - Eliminar rifa (propietario)', 'STARTUP');
            logger.info('   POST /api/rifas/:id/numbers - Seleccionar números', 'STARTUP');
            logger.info('   POST /api/rifas/:id/draw - Realizar sorteo (propietario)', 'STARTUP');
            
            if (process.env.NODE_ENV === 'development') {
                logger.info('   GET  /api/logs/stats     - Estadísticas de logs (dev)', 'STARTUP');
            } else {
                logger.info('   POST /api/logs/rotate    - Rotar logs (prod)', 'STARTUP');
            }
            
            logger.success('🔐 Sistema de autenticación JWT configurado');
            logger.success(`📋 Sistema de logging activado - Modo: ${process.env.NODE_ENV}`);
            logger.startup('✨ Servidor iniciado exitosamente');
        });
        
    } catch (error) {
        logger.error('Error crítico iniciando servidor', 'STARTUP', error);
        process.exit(1);
    }
}

// Manejar cierre graceful del servidor
process.on('SIGINT', () => {
    logger.info('Recibida señal SIGINT - Cerrando servidor...', 'SHUTDOWN');
    database.close();
    logger.success('Servidor cerrado correctamente', 'SHUTDOWN');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Recibida señal SIGTERM - Cerrando servidor...', 'SHUTDOWN');
    database.close();
    logger.success('Servidor cerrado correctamente', 'SHUTDOWN');
    process.exit(0);
});

startServer();