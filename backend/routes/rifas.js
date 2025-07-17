// Rutas para gestión de rifas
// Trabajo Práctico Final - IFTS11
// Chat #3 - API REST completa de rifas

const express = require('express');
const router = express.Router();
const database = require('../database/database');
const auth = require('../middleware/auth').authenticateToken;
const logger = require('../utils/logger');

// 📋 GET /api/rifas - Listar rifas públicas (no requiere autenticación)
router.get('/', async (req, res) => {
    try {
        logger.api('Obteniendo lista de rifas públicas', 'RIFAS');
        const db = database.getDb();
        
        const rifas = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    r.id,
                    r.title,
                    r.description,
                    r.price_per_number,
                    r.max_numbers,
                    r.status,
                    r.winner_number,
                    r.created_at,
                    u.username as creator,
                    COUNT(rn.id) as numbers_selected
                FROM rifas r
                LEFT JOIN users u ON r.user_id = u.id
                LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
                WHERE r.status = 'active'
                GROUP BY r.id
                ORDER BY r.created_at DESC
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        logger.success(`${rifas.length} rifas públicas obtenidas`, 'RIFAS');
        res.json({
            success: true,
            data: rifas
        });
        
    } catch (error) {
        logger.error('Error obteniendo rifas públicas', 'RIFAS', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo rifas'
        });
    }
});

// 👤 GET /api/rifas/my - Mis rifas (requiere autenticación)
router.get('/my', auth, async (req, res) => {
    try {
        logger.api(`Usuario ${req.user.username} obteniendo sus rifas`, 'RIFAS');
        const db = database.getDb();
        
        const rifas = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    r.*,
                    COUNT(rn.id) as numbers_selected
                FROM rifas r
                LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
                WHERE r.user_id = ?
                GROUP BY r.id
                ORDER BY r.created_at DESC
            `, [req.user.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        logger.success(`Usuario ${req.user.username} tiene ${rifas.length} rifas`, 'RIFAS');
        res.json({
            success: true,
            data: rifas
        });
        
    } catch (error) {
        logger.error(`Error obteniendo rifas del usuario ${req.user.username}`, 'RIFAS', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo tus rifas'
        });
    }
});

// ➕ POST /api/rifas - Crear nueva rifa (requiere autenticación)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, price_per_number } = req.body;
        
        // Validaciones
        if (!title || title.trim().length === 0) {
            logger.warn(`Usuario ${req.user.username} intentó crear rifa sin título`, 'RIFAS');
            return res.status(400).json({
                success: false,
                message: 'El título es obligatorio'
            });
        }
        
        if (price_per_number && price_per_number < 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio no puede ser negativo'
            });
        }
        
        logger.api(`Usuario ${req.user.username} creando nueva rifa: "${title}"`, 'RIFAS');
        const db = database.getDb();
        
        const rifaId = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO rifas (user_id, title, description, price_per_number)
                VALUES (?, ?, ?, ?)
            `, [req.user.id, title.trim(), description || null, price_per_number || null], 
            function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
        
        // Obtener la rifa creada
        const nuevaRifa = await new Promise((resolve, reject) => {
            db.get(`
                SELECT r.*, u.username as creator
                FROM rifas r
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.id = ?
            `, [rifaId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        logger.success(`Rifa "${title}" creada exitosamente con ID ${rifaId}`, 'RIFAS');
        res.status(201).json({
            success: true,
            message: 'Rifa creada exitosamente',
            data: nuevaRifa
        });
        
    } catch (error) {
        logger.error(`Error creando rifa para usuario ${req.user.username}`, 'RIFAS', error);
        res.status(500).json({
            success: false,
            message: 'Error creando la rifa'
        });
    }
});

// 🔍 GET /api/rifas/:id - Obtener detalles de una rifa específica
router.get('/:id', async (req, res) => {
    try {
        const rifaId = parseInt(req.params.id);
        
        if (isNaN(rifaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de rifa inválido'
            });
        }
        
        logger.api(`Obteniendo detalles de rifa ${rifaId}`, 'RIFAS');
        const db = database.getDb();
        
        // Obtener información de la rifa
        const rifa = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    r.*,
                    u.username as creator,
                    COUNT(rn.id) as numbers_selected
                FROM rifas r
                LEFT JOIN users u ON r.user_id = u.id
                LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
                WHERE r.id = ?
                GROUP BY r.id
            `, [rifaId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!rifa) {
            logger.warn(`Rifa ${rifaId} no encontrada`, 'RIFAS');
            return res.status(404).json({
                success: false,
                message: 'Rifa no encontrada'
            });
        }
        
        // Obtener números seleccionados
        const numbers = await new Promise((resolve, reject) => {
            db.all(`
                SELECT number, participant_name, selected_at
                FROM rifa_numbers
                WHERE rifa_id = ?
                ORDER BY number ASC
            `, [rifaId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        logger.success(`Detalles de rifa ${rifaId} obtenidos`, 'RIFAS');
        res.json({
            success: true,
            data: {
                ...rifa,
                selected_numbers: numbers
            }
        });
        
    } catch (error) {
        logger.error(`Error obteniendo detalles de rifa ${req.params.id}`, 'RIFAS', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo detalles de la rifa'
        });
    }
});

// ✏️ PUT /api/rifas/:id - Editar rifa (solo el propietario)
router.put('/:id', auth, async (req, res) => {
    try {
        const rifaId = parseInt(req.params.id);
        const { title, description, price_per_number } = req.body;
        
        if (isNaN(rifaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de rifa inválido'
            });
        }
        
        logger.api(`Usuario ${req.user.username} editando rifa ${rifaId}`, 'RIFAS');
        const db = database.getDb();
        
        // Verificar que la rifa existe y es del usuario
        const rifa = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM rifas WHERE id = ? AND user_id = ?', 
                [rifaId, req.user.id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!rifa) {
            logger.warn(`Usuario ${req.user.username} intentó editar rifa ${rifaId} sin permisos`, 'RIFAS');
            return res.status(404).json({
                success: false,
                message: 'Rifa no encontrada o sin permisos'
            });
        }
        
        // Validaciones
        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El título es obligatorio'
            });
        }
        
        // Actualizar rifa
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE rifas 
                SET title = ?, description = ?, price_per_number = ?
                WHERE id = ? AND user_id = ?
            `, [title.trim(), description || null, price_per_number || null, rifaId, req.user.id], 
            (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        logger.success(`Rifa ${rifaId} actualizada por ${req.user.username}`, 'RIFAS');
        res.json({
            success: true,
            message: 'Rifa actualizada exitosamente'
        });
        
    } catch (error) {
        logger.error(`Error editando rifa ${req.params.id}`, 'RIFAS', error);
        res.status(500).json({
            success: false,
            message: 'Error editando la rifa'
        });
    }
});

// 🗑️ DELETE /api/rifas/:id - Eliminar rifa (solo el propietario)
router.delete('/:id', auth, async (req, res) => {
    try {
        const rifaId = parseInt(req.params.id);
        
        if (isNaN(rifaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de rifa inválido'
            });
        }
        
        logger.api(`Usuario ${req.user.username} eliminando rifa ${rifaId}`, 'RIFAS');
        const db = database.getDb();
        
        // Verificar que la rifa existe y es del usuario
        const rifa = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM rifas WHERE id = ? AND user_id = ?', 
                [rifaId, req.user.id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!rifa) {
            logger.warn(`Usuario ${req.user.username} intentó eliminar rifa ${rifaId} sin permisos`, 'RIFAS');
            return res.status(404).json({
                success: false,
                message: 'Rifa no encontrada o sin permisos'
            });
        }
        
        // Eliminar números primero (foreign key)
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM rifa_numbers WHERE rifa_id = ?', [rifaId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        // Eliminar rifa
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM rifas WHERE id = ? AND user_id = ?', 
                [rifaId, req.user.id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        logger.success(`Rifa ${rifaId} eliminada por ${req.user.username}`, 'RIFAS');
        res.json({
            success: true,
            message: 'Rifa eliminada exitosamente'
        });
        
    } catch (error) {
        logger.error(`Error eliminando rifa ${req.params.id}`, 'RIFAS', error);
        res.status(500).json({
            success: false,
            message: 'Error eliminando la rifa'
        });
    }
});

// 🎯 POST /api/rifas/:id/numbers - Seleccionar números en una rifa
router.post('/:id/numbers', async (req, res) => {
    try {
        const rifaId = parseInt(req.params.id);
        const { numbers, participant_name } = req.body;
        
        if (isNaN(rifaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de rifa inválido'
            });
        }
        
        if (!Array.isArray(numbers) || numbers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un número'
            });
        }
        
        // Validar que todos los números están en rango válido
        const invalidNumbers = numbers.filter(n => !Number.isInteger(n) || n < 0 || n > 99);
        if (invalidNumbers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Los números deben estar entre 0 y 99'
            });
        }
        
        logger.api(`Seleccionando ${numbers.length} números en rifa ${rifaId}`, 'RIFAS');
        const db = database.getDb();
        
        // Verificar que la rifa existe y está activa
        const rifa = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM rifas WHERE id = ? AND status = ?', 
                [rifaId, 'active'], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!rifa) {
            return res.status(404).json({
                success: false,
                message: 'Rifa no encontrada o no está activa'
            });
        }
        
        // Verificar números ya seleccionados
        const existingNumbers = await new Promise((resolve, reject) => {
            db.all('SELECT number FROM rifa_numbers WHERE rifa_id = ? AND number IN (' + 
                numbers.map(() => '?').join(',') + ')', 
                [rifaId, ...numbers], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.number));
            });
        });
        
        if (existingNumbers.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Los números ${existingNumbers.join(', ')} ya están seleccionados`
            });
        }
        
        // Insertar números seleccionados
        const insertPromises = numbers.map(number => {
            return new Promise((resolve, reject) => {
                db.run(`
                    INSERT INTO rifa_numbers (rifa_id, number, participant_name)
                    VALUES (?, ?, ?)
                `, [rifaId, number, participant_name || null], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
        
        await Promise.all(insertPromises);
        
        logger.success(`${numbers.length} números seleccionados en rifa ${rifaId}`, 'RIFAS');
        res.status(201).json({
            success: true,
            message: `${numbers.length} números seleccionados exitosamente`,
            data: {
                selected_numbers: numbers
            }
        });
        
    } catch (error) {
        logger.error(`Error seleccionando números en rifa ${req.params.id}`, 'RIFAS', error);
        res.status(500).json({
            success: false,
            message: 'Error seleccionando números'
        });
    }
});

// 🎲 POST /api/rifas/:id/draw - Realizar sorteo (solo el propietario)
router.post('/:id/draw', auth, async (req, res) => {
    try {
        const rifaId = parseInt(req.params.id);
        
        if (isNaN(rifaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de rifa inválido'
            });
        }
        
        logger.api(`Usuario ${req.user.username} realizando sorteo en rifa ${rifaId}`, 'RIFAS');
        const db = database.getDb();
        
        // Verificar que la rifa existe, es del usuario y está activa
        const rifa = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM rifas WHERE id = ? AND user_id = ? AND status = ?', 
                [rifaId, req.user.id, 'active'], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!rifa) {
            return res.status(404).json({
                success: false,
                message: 'Rifa no encontrada, sin permisos o ya completada'
            });
        }
        
        // Obtener números participantes
        const participantes = await new Promise((resolve, reject) => {
            db.all('SELECT number, participant_name FROM rifa_numbers WHERE rifa_id = ?', 
                [rifaId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        if (participantes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay números seleccionados para el sorteo'
            });
        }
        
        // Realizar sorteo aleatorio
        const ganadorIndex = Math.floor(Math.random() * participantes.length);
        const ganador = participantes[ganadorIndex];
        
        // Actualizar rifa con el ganador
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE rifas 
                SET winner_number = ?, status = 'completed'
                WHERE id = ?
            `, [ganador.number, rifaId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        logger.success(`Sorteo completado en rifa ${rifaId}. Ganador: ${ganador.number}`, 'RIFAS');
        res.json({
            success: true,
            message: 'Sorteo realizado exitosamente',
            data: {
                winner_number: ganador.number,
                participant_name: ganador.participant_name,
                total_participants: participantes.length
            }
        });
        
    } catch (error) {
        logger.error(`Error realizando sorteo en rifa ${req.params.id}`, 'RIFAS', error);
        res.status(500).json({
            success: false,
            message: 'Error realizando el sorteo'
        });
    }
});

module.exports = router;