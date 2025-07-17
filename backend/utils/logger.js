/**
 * 🔧 Sistema de Logs Diferenciados
 * Chat #2 - Trabajo Práctico Final IFTS11
 * 
 * Funcionalidades:
 * - Logs diferenciados por entorno (development/production)
 * - Niveles: DEBUG, INFO, WARN, ERROR
 * - Rotación de archivos en producción
 * - Colores en consola para desarrollo
 */

const fs = require('fs');
const path = require('path');

// Configuración de colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.logDir = path.join(__dirname, '../logs');
        
        // Crear directorio de logs si no existe
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
        
        // Configurar archivos de log para producción
        this.logFiles = {
            error: path.join(this.logDir, 'error.log'),
            combined: path.join(this.logDir, 'combined.log'),
            access: path.join(this.logDir, 'access.log')
        };
        
        console.log(`📋 Logger inicializado - Modo: ${this.isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
    }
    
    /**
     * Formatear timestamp
     */
    getTimestamp() {
        return new Date().toISOString();
    }
    
    /**
     * Formatear mensaje de log
     */
    formatMessage(level, message, context = null) {
        const timestamp = this.getTimestamp();
        const contextStr = context ? ` [${context}]` : '';
        return `[${timestamp}] ${level}${contextStr}: ${message}`;
    }
    
    /**
     * Escribir a archivo (solo en producción)
     */
    writeToFile(filename, message) {
        if (!this.isDevelopment) {
            const logEntry = message + '\n';
            fs.appendFileSync(filename, logEntry);
        }
    }
    
    /**
     * Log con colores para desarrollo
     */
    logToConsole(level, message, color) {
        if (this.isDevelopment) {
            // Modo desarrollo: con colores
            console.log(`${color}${message}${colors.reset}`);
        } else {
            // Modo producción: sin colores, solo INFO y superiores
            if (level !== 'DEBUG') {
                console.log(message);
            }
        }
    }
    
    /**
     * DEBUG - Solo visible en desarrollo
     */
    debug(message, context = null) {
        const formattedMessage = this.formatMessage('DEBUG', message, context);
        
        if (this.isDevelopment) {
            this.logToConsole('DEBUG', `🔍 ${formattedMessage}`, colors.dim + colors.cyan);
        }
    }
    
    /**
     * INFO - Información general
     */
    info(message, context = null) {
        const formattedMessage = this.formatMessage('INFO', message, context);
        
        this.logToConsole('INFO', `ℹ️  ${formattedMessage}`, colors.blue);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * WARN - Advertencias
     */
    warn(message, context = null) {
        const formattedMessage = this.formatMessage('WARN', message, context);
        
        this.logToConsole('WARN', `⚠️  ${formattedMessage}`, colors.yellow);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * ERROR - Errores
     */
    error(message, context = null, errorObj = null) {
        const errorDetails = errorObj ? `\nStack: ${errorObj.stack}` : '';
        const formattedMessage = this.formatMessage('ERROR', message + errorDetails, context);
        
        this.logToConsole('ERROR', `❌ ${formattedMessage}`, colors.red);
        this.writeToFile(this.logFiles.error, formattedMessage);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * SUCCESS - Operaciones exitosas
     */
    success(message, context = null) {
        const formattedMessage = this.formatMessage('SUCCESS', message, context);
        
        this.logToConsole('SUCCESS', `✅ ${formattedMessage}`, colors.green);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * ACCESS - Logs de acceso HTTP
     */
    access(req, res, responseTime = null) {
        const method = req.method;
        const url = req.originalUrl || req.url;
        const status = res.statusCode;
        const userAgent = req.get('User-Agent') || 'Unknown';
        const ip = req.ip || req.connection.remoteAddress || 'Unknown';
        const timeStr = responseTime ? ` - ${responseTime}ms` : '';
        
        const message = `${method} ${url} ${status} - ${ip} - "${userAgent}"${timeStr}`;
        const formattedMessage = this.formatMessage('ACCESS', message);
        
        // Color según status code
        let color = colors.green; // 2xx
        if (status >= 400 && status < 500) color = colors.yellow; // 4xx
        if (status >= 500) color = colors.red; // 5xx
        
        this.logToConsole('ACCESS', `🌐 ${formattedMessage}`, color);
        this.writeToFile(this.logFiles.access, formattedMessage);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * STARTUP - Logs de inicio del servidor
     */
    startup(message) {
        const formattedMessage = this.formatMessage('STARTUP', message);
        
        this.logToConsole('STARTUP', `🚀 ${formattedMessage}`, colors.bright + colors.green);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * DATABASE - Logs específicos de base de datos
     */
    database(message, context = 'DB') {
        const formattedMessage = this.formatMessage('DATABASE', message, context);
        
        this.logToConsole('DATABASE', `🗄️  ${formattedMessage}`, colors.magenta);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * AUTH - Logs de autenticación
     */
    auth(message, context = 'AUTH') {
        const formattedMessage = this.formatMessage('AUTH', message, context);
        
        this.logToConsole('AUTH', `🔐 ${formattedMessage}`, colors.cyan);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * API - Logs de operaciones API
     */
    api(message, context = 'API') {
        const formattedMessage = this.formatMessage('API', message, context);
        
        this.logToConsole('API', `🔗 ${formattedMessage}`, colors.blue);
        this.writeToFile(this.logFiles.combined, formattedMessage);
    }
    
    /**
     * Limpiar logs antiguos (útil para producción)
     */
    rotateLogs() {
        if (this.isDevelopment) return;
        
        const maxLogSize = 10 * 1024 * 1024; // 10MB
        
        Object.values(this.logFiles).forEach(logFile => {
            if (fs.existsSync(logFile)) {
                const stats = fs.statSync(logFile);
                if (stats.size > maxLogSize) {
                    // Renombrar archivo actual y crear uno nuevo
                    const backupFile = logFile.replace('.log', `-${Date.now()}.log`);
                    fs.renameSync(logFile, backupFile);
                    this.info(`Log rotado: ${path.basename(logFile)} -> ${path.basename(backupFile)}`);
                }
            }
        });
    }
    
    /**
     * Obtener estadísticas de logs
     */
    getStats() {
        const stats = {
            environment: this.isDevelopment ? 'development' : 'production',
            logDir: this.logDir,
            files: {}
        };
        
        Object.entries(this.logFiles).forEach(([type, filepath]) => {
            if (fs.existsSync(filepath)) {
                const fileStats = fs.statSync(filepath);
                stats.files[type] = {
                    size: `${(fileStats.size / 1024).toFixed(2)} KB`,
                    created: fileStats.birthtime,
                    modified: fileStats.mtime
                };
            } else {
                stats.files[type] = 'No existe';
            }
        });
        
        return stats;
    }
}

// Crear instancia única del logger
const logger = new Logger();

module.exports = logger;