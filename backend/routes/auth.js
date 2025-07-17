// Rutas de Autenticación
// Chat #2 - Con sistema de logging integrado

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const { authLogger, logOperation, logSuccess, logError } = require('../middleware/logging');
const database = require('../database/database');
const logger = require('../utils/logger');

const router = express.Router();

// Aplicar middleware de logging de autenticación a todas las rutas
router.use(authLogger);

// POST /api/auth/register - Registro de nuevo usuario
router.post('/register', async (req, res) => {
    const startTime = Date.now();
    logOperation('REGISTRO DE USUARIO', '', 'AUTH');
    
    try {
        const { username, email, password } = req.body;

        // Validación básica
        if (!username || !email || !password) {
            logger.warn('Intento de registro con campos faltantes', 'AUTH');
            return res.status(400).json({
                success: false,
                message: 'Username, email y password son requeridos'
            });
        }

        // Validar longitud de password
        if (password.length < 6) {
            logger.warn(`Intento de registro con password muy corta: ${username}`, 'AUTH');
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Validar formato de email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            logger.warn(`Intento de registro con email inválido: ${email}`, 'AUTH');
            return res.status(400).json({
                success: false,
                message: 'Formato de email inválido'
            });
        }

        logger.debug(`Verificando si usuario existe: ${username} / ${email}`, 'AUTH');

        // Verificar si el usuario ya existe
        const db = await database.getDb();
        const existingUser = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                [username, email],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (existingUser) {
            logger.warn(`Intento de registro con usuario/email existente: ${username}`, 'AUTH');
            return res.status(400).json({
                success: false,
                message: 'El usuario o email ya existe'
            });
        }

        logger.debug('Encriptando contraseña', 'AUTH');

        // Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        logger.debug('Insertando nuevo usuario en base de datos', 'AUTH');

        // Crear usuario
        const result = await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                [username, email, passwordHash],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                }
            );
        });

        logger.success(`Usuario registrado exitosamente: ID ${result.id}, Username: ${username}`, 'AUTH');

        // Crear token JWT
        const token = jwt.sign(
            { 
                id: result.id, 
                username: username,
                email: email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const responseTime = Date.now() - startTime;
        logSuccess('REGISTRO DE USUARIO', `en ${responseTime}ms`, 'AUTH');

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token: token,
            user: {
                id: result.id,
                username: username,
                email: email
            }
        });

    } catch (error) {
        logError('REGISTRO DE USUARIO', error, 'AUTH');
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/auth/login - Inicio de sesión
router.post('/login', async (req, res) => {
    const startTime = Date.now();
    logOperation('LOGIN DE USUARIO', '', 'AUTH');
    
    try {
        const { username, password } = req.body;

        // Validación básica
        if (!username || !password) {
            logger.warn('Intento de login con campos faltantes', 'AUTH');
            return res.status(400).json({
                success: false,
                message: 'Username y password son requeridos'
            });
        }

        logger.debug(`Buscando usuario: ${username}`, 'AUTH');

        // Buscar usuario en la base de datos
        const db = await database.getDb();
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?',
                [username, username],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            logger.warn(`Intento de login con usuario inexistente: ${username}`, 'AUTH');
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        logger.debug(`Usuario encontrado: ${user.username}`, 'AUTH');

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            logger.warn(`Intento de login con contraseña incorrecta: ${username}`, 'AUTH');
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Crear token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const responseTime = Date.now() - startTime;
        logger.success(`Login exitoso: ${user.username} (ID: ${user.id}) en ${responseTime}ms`, 'AUTH');

        res.json({
            success: true,
            message: 'Login exitoso',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        logError('LOGIN DE USUARIO', error, 'AUTH');
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authenticateToken, async (req, res) => {
    logOperation('OBTENER PERFIL', `Usuario ID: ${req.user.id}`, 'AUTH');
    
    try {
        const db = await database.getDb();
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, email, created_at FROM users WHERE id = ?',
                [req.user.id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            logger.warn(`Usuario no encontrado en /me: ID ${req.user.id}`, 'AUTH');
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        logger.debug(`Perfil obtenido exitosamente: ${user.username}`, 'AUTH');

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        logError('OBTENER PERFIL', error, 'AUTH');
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authenticateToken, (req, res) => {
    logger.auth(`Logout exitoso: ${req.user.username} (ID: ${req.user.id})`, 'AUTH');
    
    // En JWT no mantenemos sesiones en el servidor
    // El logout se maneja en el frontend eliminando el token
    res.json({
        success: true,
        message: 'Logout exitoso'
    });
});

// GET /api/auth/stats - Estadísticas de usuarios (solo en desarrollo)
router.get('/stats', async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({
            success: false,
            message: 'Endpoint solo disponible en desarrollo'
        });
    }
    
    logOperation('OBTENER ESTADÍSTICAS AUTH', '', 'AUTH');
    
    try {
        const db = await database.getDb();
        
        // Obtener estadísticas básicas
        const stats = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN created_at >= datetime('now', '-1 day') THEN 1 END) as users_last_24h,
                    COUNT(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 END) as users_last_week
                FROM users
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
        
        // Obtener últimos usuarios registrados
        const recentUsers = await new Promise((resolve, reject) => {
            db.all(`
                SELECT username, email, created_at 
                FROM users 
                ORDER BY created_at DESC 
                LIMIT 5
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        logSuccess('OBTENER ESTADÍSTICAS AUTH', '', 'AUTH');
        
        res.json({
            success: true,
            data: {
                ...stats,
                recent_users: recentUsers
            }
        });
        
    } catch (error) {
        logError('OBTENER ESTADÍSTICAS AUTH', error, 'AUTH');
        res.status(500).json({
            success: false,
            message: 'Error obteniendo estadísticas'
        });
    }
});

module.exports = router;