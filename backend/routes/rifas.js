const express = require('express');
const { runQuery, getQuery, allQuery } = require('../database/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Función para generar código de acceso
const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Obtener todas las rifas públicas (solo simulaciones de ejemplo)
router.get('/', async (req, res) => {
    try {
        const rifas = await allQuery(`
            SELECT 
                r.*,
                'Sistema' as creator_username,
                COUNT(rn.id) as numbers_sold
            FROM rifas r
            LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
            WHERE r.is_public = TRUE AND r.status = 'active'
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `);

        res.json({ rifas });
    } catch (error) {
        console.error('Error obteniendo rifas públicas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener rifas del usuario logueado
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const rifas = await allQuery(`
            SELECT 
                r.*,
                COUNT(rn.id) as numbers_sold
            FROM rifas r
            LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
            WHERE r.user_id = ? AND (r.is_public = FALSE OR r.is_public IS NULL)
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `, [req.user.id]);

        res.json({ rifas });
    } catch (error) {
        console.error('Error obteniendo rifas del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener una rifa específica del usuario logueado
router.get('/my/:id', authenticateToken, async (req, res) => {
    try {
        const rifa = await getQuery(`
            SELECT 
                r.*,
                u.username as creator_username,
                COUNT(rn.id) as numbers_sold
            FROM rifas r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
            WHERE r.id = ? AND r.user_id = ?
            GROUP BY r.id
        `, [req.params.id, req.user.id]);

        if (!rifa) {
            return res.status(404).json({ error: 'Simulación no encontrada o no tienes permisos' });
        }

        // Obtener números seleccionados
        const soldNumbers = await allQuery(
            'SELECT number FROM rifa_numbers WHERE rifa_id = ?',
            [req.params.id]
        );

        res.json({ 
            rifa: {
                ...rifa,
                sold_numbers: soldNumbers.map(n => n.number)
            }
        });
    } catch (error) {
        console.error('Error obteniendo rifa del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener una rifa específica por ID (solo públicas o del propietario)
router.get('/:id', async (req, res) => {
    try {
        const rifa = await getQuery(`
            SELECT 
                r.*,
                CASE 
                    WHEN r.user_id IS NULL THEN 'Sistema'
                    ELSE u.username 
                END as creator_username,
                COUNT(rn.id) as numbers_sold
            FROM rifas r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
            WHERE r.id = ? AND r.is_public = TRUE
            GROUP BY r.id
        `, [req.params.id]);

        if (!rifa) {
            return res.status(404).json({ error: 'Simulación no encontrada o no es pública' });
        }

        // Obtener números seleccionados
        const soldNumbers = await allQuery(
            'SELECT number FROM rifa_numbers WHERE rifa_id = ?',
            [req.params.id]
        );

        res.json({ 
            rifa: {
                ...rifa,
                sold_numbers: soldNumbers.map(n => n.number)
            }
        });
    } catch (error) {
        console.error('Error obteniendo rifa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Acceder a una simulación por código
router.get('/access/:code', async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        
        const rifa = await getQuery(`
            SELECT 
                r.*,
                u.username as creator_username,
                COUNT(rn.id) as numbers_sold
            FROM rifas r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
            WHERE UPPER(r.access_code) = ? AND r.status = 'active'
            GROUP BY r.id
        `, [code]);

        if (!rifa) {
            return res.status(404).json({ error: 'Código de simulación no válido o expirado' });
        }

        // Obtener números seleccionados
        const soldNumbers = await allQuery(
            'SELECT number FROM rifa_numbers WHERE rifa_id = ?',
            [rifa.id]
        );

        res.json({ 
            rifa: {
                ...rifa,
                sold_numbers: soldNumbers.map(n => n.number)
            }
        });
    } catch (error) {
        console.error('Error accediendo por código:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear nueva simulación (solo usuarios logueados)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'El título es requerido' });
        }

        // Generar código de acceso único
        let accessCode;
        let codeExists = true;
        
        while (codeExists) {
            accessCode = generateAccessCode();
            const existing = await getQuery(
                'SELECT id FROM rifas WHERE access_code = ?',
                [accessCode]
            );
            codeExists = !!existing;
        }

        const result = await runQuery(`
            INSERT INTO rifas (user_id, title, description, access_code, is_public) 
            VALUES (?, ?, ?, ?, FALSE)
        `, [req.user.id, title, description, accessCode]);

        const newRifa = await getQuery(
            'SELECT * FROM rifas WHERE id = ?',
            [result.id]
        );

        res.status(201).json({ 
            message: 'Simulación creada exitosamente',
            rifa: newRifa,
            access_code: accessCode
        });
    } catch (error) {
        console.error('Error creando simulación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Editar simulación
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, description } = req.body;
        const rifaId = req.params.id;

        // Verificar que la simulación pertenece al usuario
        const rifa = await getQuery(
            'SELECT * FROM rifas WHERE id = ? AND user_id = ?',
            [rifaId, req.user.id]
        );

        if (!rifa) {
            return res.status(404).json({ error: 'Simulación no encontrada o no tienes permisos' });
        }

        await runQuery(`
            UPDATE rifas 
            SET title = ?, description = ?
            WHERE id = ?
        `, [title, description, rifaId]);

        const updatedRifa = await getQuery(
            'SELECT * FROM rifas WHERE id = ?',
            [rifaId]
        );

        res.json({ 
            message: 'Simulación actualizada exitosamente',
            rifa: updatedRifa 
        });
    } catch (error) {
        console.error('Error actualizando simulación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar simulación
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const rifaId = req.params.id;

        // Verificar que la simulación pertenece al usuario
        const rifa = await getQuery(
            'SELECT * FROM rifas WHERE id = ? AND user_id = ?',
            [rifaId, req.user.id]
        );

        if (!rifa) {
            return res.status(404).json({ error: 'Simulación no encontrada o no tienes permisos' });
        }

        // Eliminar números asociados primero
        await runQuery('DELETE FROM rifa_numbers WHERE rifa_id = ?', [rifaId]);
        
        // Eliminar simulación
        await runQuery('DELETE FROM rifas WHERE id = ?', [rifaId]);

        res.json({ message: 'Simulación eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando simulación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Seleccionar números en una simulación (públicas o por código)
router.post('/:id/numbers', async (req, res) => {
    try {
        const { numbers, participant_name } = req.body;
        const rifaId = req.params.id;

        if (!numbers || !Array.isArray(numbers)) {
            return res.status(400).json({ error: 'Números inválidos' });
        }

        // Verificar que la simulación existe y está activa
        const rifa = await getQuery(
            'SELECT * FROM rifas WHERE id = ? AND status = ?',
            [rifaId, 'active']
        );

        if (!rifa) {
            return res.status(404).json({ error: 'Simulación no encontrada o no está activa' });
        }

        // Verificar números disponibles
        const soldNumbers = await allQuery(
            'SELECT number FROM rifa_numbers WHERE rifa_id = ?',
            [rifaId]
        );
        
        const soldNumbersArray = soldNumbers.map(n => n.number);
        const invalidNumbers = numbers.filter(n => soldNumbersArray.includes(n));

        if (invalidNumbers.length > 0) {
            return res.status(400).json({ 
                error: `Los números ${invalidNumbers.join(', ')} ya están ocupados` 
            });
        }

        // Insertar números seleccionados
        for (const number of numbers) {
            await runQuery(`
                INSERT INTO rifa_numbers (rifa_id, number, participant_name) 
                VALUES (?, ?, ?)
            `, [rifaId, number, participant_name]);
        }

        res.json({ 
            message: 'Números seleccionados exitosamente',
            numbers 
        });
    } catch (error) {
        console.error('Error seleccionando números:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Acceder por código para participar
router.post('/access/:code/numbers', async (req, res) => {
    try {
        const { numbers, participant_name } = req.body;
        const code = req.params.code.toUpperCase();

        if (!numbers || !Array.isArray(numbers)) {
            return res.status(400).json({ error: 'Números inválidos' });
        }

        // Buscar simulación por código
        const rifa = await getQuery(
            'SELECT * FROM rifas WHERE UPPER(access_code) = ? AND status = ?',
            [code, 'active']
        );

        if (!rifa) {
            return res.status(404).json({ error: 'Código de simulación no válido o expirado' });
        }

        // Verificar números disponibles
        const soldNumbers = await allQuery(
            'SELECT number FROM rifa_numbers WHERE rifa_id = ?',
            [rifa.id]
        );
        
        const soldNumbersArray = soldNumbers.map(n => n.number);
        const invalidNumbers = numbers.filter(n => soldNumbersArray.includes(n));

        if (invalidNumbers.length > 0) {
            return res.status(400).json({ 
                error: `Los números ${invalidNumbers.join(', ')} ya están ocupados` 
            });
        }

        // Insertar números seleccionados
        for (const number of numbers) {
            await runQuery(`
                INSERT INTO rifa_numbers (rifa_id, number, participant_name) 
                VALUES (?, ?, ?)
            `, [rifa.id, number, participant_name]);
        }

        res.json({ 
            message: 'Participación confirmada exitosamente',
            numbers,
            simulation_title: rifa.title
        });
    } catch (error) {
        console.error('Error participando por código:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener números de una simulación
router.get('/:id/numbers', async (req, res) => {
    try {
        const numbers = await allQuery(`
            SELECT number, participant_name, selected_at 
            FROM rifa_numbers 
            WHERE rifa_id = ? 
            ORDER BY number
        `, [req.params.id]);

        res.json({ numbers });
    } catch (error) {
        console.error('Error obteniendo números:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Realizar sorteo (solo propietario)
router.post('/:id/draw', authenticateToken, async (req, res) => {
    try {
        const rifaId = req.params.id;

        // Verificar que la simulación pertenece al usuario
        const rifa = await getQuery(
            'SELECT * FROM rifas WHERE id = ? AND user_id = ? AND status = ?',
            [rifaId, req.user.id, 'active']
        );

        if (!rifa) {
            return res.status(404).json({ error: 'Simulación no encontrada o no tienes permisos' });
        }

        // Obtener números participantes
        const participants = await allQuery(
            'SELECT number, participant_name FROM rifa_numbers WHERE rifa_id = ?',
            [rifaId]
        );

        if (participants.length === 0) {
            return res.status(400).json({ error: 'No hay participantes en esta simulación' });
        }

        // Seleccionar ganador aleatorio
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[winnerIndex];

        // Actualizar simulación con ganador
        await runQuery(
            'UPDATE rifas SET winner_number = ?, status = ? WHERE id = ?',
            [winner.number, 'completed', rifaId]
        );

        res.json({ 
            message: 'Sorteo realizado exitosamente',
            winner: {
                number: winner.number,
                participant_name: winner.participant_name
            }
        });
    } catch (error) {
        console.error('Error en sorteo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Regenerar código de acceso
router.post('/:id/regenerate-code', authenticateToken, async (req, res) => {
    try {
        const rifaId = req.params.id;

        // Verificar que la simulación pertenece al usuario
        const rifa = await getQuery(
            'SELECT * FROM rifas WHERE id = ? AND user_id = ?',
            [rifaId, req.user.id]
        );

        if (!rifa) {
            return res.status(404).json({ error: 'Simulación no encontrada o no tienes permisos' });
        }

        // Generar nuevo código de acceso único
        let accessCode;
        let codeExists = true;
        
        while (codeExists) {
            accessCode = generateAccessCode();
            const existing = await getQuery(
                'SELECT id FROM rifas WHERE access_code = ? AND id != ?',
                [accessCode, rifaId]
            );
            codeExists = !!existing;
        }

        await runQuery(
            'UPDATE rifas SET access_code = ? WHERE id = ?',
            [accessCode, rifaId]
        );

        res.json({ 
            message: 'Código regenerado exitosamente',
            access_code: accessCode
        });
    } catch (error) {
        console.error('Error regenerando código:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
