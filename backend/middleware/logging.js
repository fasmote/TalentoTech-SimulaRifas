/**
 * 🌐 Middleware de Logging HTTP
 * Chat #2 - Trabajo Práctico Final IFTS11
 * 
 * Middleware que automaticamente loguea:
 * - Requests HTTP entrantes
 * - Responses con tiempo de respuesta
 * - Errores HTTP
 */

const logger = require('../utils/logger');

/**
 * Middleware principal de logging HTTP
 */
const httpLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Log del request entrante (solo en desarrollo o para rutas importantes)
    if (process.env.NODE_ENV === 'development' || req.path.startsWith('/api/')) {
        logger.debug(`Incoming request: ${req.method} ${req.path}`, 'HTTP');
    }
    
    // Capturar el método original de res.end
    const originalEnd = res.end;
    
    // Sobrescribir res.end para capturar cuando termine la respuesta
    res.end = function(chunk, encoding) {
        const responseTime = Date.now() - startTime;
        
        // Log del access
        logger.access(req, res, responseTime);
        
        // Restaurar el método original y ejecutarlo
        res.end = originalEnd;
        res.end(chunk, encoding);
    };
    
    next();
};

/**
 * Middleware para loguear errores HTTP específicos
 */
const errorLogger = (err, req, res, next) => {
    const context = `${req.method} ${req.path}`;
    
    // Log del error
    logger.error(
        `HTTP Error: ${err.message || 'Error desconocido'}`,
        context,
        err
    );
    
    // Continuar con el siguiente middleware de error
    next(err);
};

/**
 * Middleware para loguear requests de autenticación
 */
const authLogger = (req, res, next) => {
    const action = req.path.split('/').pop(); // login, register, etc.
    const username = req.body.username || req.body.email || 'unknown';
    
    logger.auth(`Intento de ${action} para usuario: ${username}`, 'AUTH');
    
    // Capturar respuesta para loguear resultado
    const originalJson = res.json;
    res.json = function(body) {
        if (body.success) {
            logger.auth(`${action} exitoso para: ${username}`, 'AUTH');
        } else {
            logger.auth(`${action} fallido para: ${username} - ${body.message}`, 'AUTH');
        }
        
        return originalJson.call(this, body);
    };
    
    next();
};

/**
 * Middleware para loguear operaciones de API
 */
const apiLogger = (operation) => {
    return (req, res, next) => {
        const userId = req.user ? req.user.id : 'anónimo';
        const context = `USER:${userId}`;
        
        logger.api(`Operación: ${operation}`, context);
        
        // Capturar respuesta para loguear resultado
        const originalJson = res.json;
        res.json = function(body) {
            if (body.success) {
                logger.api(`${operation} exitosa`, context);
            } else {
                logger.api(`${operation} fallida: ${body.message}`, context);
            }
            
            return originalJson.call(this, body);
        };
        
        next();
    };
};

/**
 * Función helper para loguear inicio de operaciones importantes
 */
const logOperation = (operation, details = '', context = 'APP') => {
    logger.info(`🔄 Iniciando: ${operation} ${details}`, context);
};

/**
 * Función helper para loguear fin exitoso de operaciones
 */
const logSuccess = (operation, details = '', context = 'APP') => {
    logger.success(`✅ Completado: ${operation} ${details}`, context);
};

/**
 * Función helper para loguear errores de operaciones
 */
const logError = (operation, error, context = 'APP') => {
    logger.error(`❌ Error en: ${operation} - ${error.message}`, context, error);
};

module.exports = {
    httpLogger,
    errorLogger,
    authLogger,
    apiLogger,
    logOperation,
    logSuccess,
    logError
};