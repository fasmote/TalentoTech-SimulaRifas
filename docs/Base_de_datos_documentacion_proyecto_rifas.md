# Documentación Técnica
## Sistema de Rifas con Autenticación de Usuarios

**Proyecto:** Simulador de Rifas con Backend  
**Institución:** Talento Tech - Curso Node.js  
**Tecnología:** Node.js + Express + SQLite  
**Fecha:** Julio 2025  
**Versión:** 1.0  
**Estudiante:** [Nombre del Estudiante]

---

## 1. Objetivo del Proyecto

Desarrollar una aplicación web completa usando Node.js como parte del programa **Talento Tech - Curso Node.js**, agregando funcionalidad de autenticación y persistencia de datos al simulador de rifas existente, permitiendo que los usuarios puedan:

- **Usuarios no logueados**: Usar la simulación como actualmente (modo demo)
- **Usuarios logueados**: Crear, guardar y gestionar sus propias simulaciones de rifas
- **Aprendizaje práctico**: Implementar conceptos de backend, bases de datos y APIs REST

---

## 2. Contexto Educativo - Talento Tech

### 2.1 Competencias del Curso Node.js

Este proyecto permite practicar y demostrar:

| Competencia | Aplicación en el Proyecto |
|-------------|---------------------------|
| **JavaScript Backend** | Lógica de servidor con Node.js |
| **Express Framework** | Creación de APIs REST y rutas |
| **Base de Datos** | Modelado y manejo de SQLite |
| **Autenticación** | JWT y encriptación de contraseñas |
| **Frontend Integration** | Conexión entre cliente y servidor |
| **CRUD Operations** | Create, Read, Update, Delete de rifas |

### 2.2 Objetivos de Aprendizaje

- ✅ Configurar un proyecto Node.js desde cero
- ✅ Implementar servidor Express con middlewares
- ✅ Diseñar y crear base de datos SQLite
- ✅ Desarrollar sistema de autenticación JWT
- ✅ Crear APIs RESTful para gestión de datos
- ✅ Integrar frontend con backend
- ✅ Aplicar mejores prácticas de seguridad
- ✅ Documentar y estructurar código profesionalmente

---

## 3. Arquitectura Técnica

### 3.1 Stack Tecnológico Seleccionado

| Componente | Tecnología | Justificación Educativa |
|------------|------------|-------------------------|
| **Frontend** | HTML/CSS/JavaScript Vanilla | Mantener enfoque en backend Node.js |
| **Backend** | Node.js + Express | Tecnología principal del curso |
| **Base de Datos** | SQLite | Ideal para aprendizaje y desarrollo |
| **Autenticación** | JWT + bcryptjs | Estándar de la industria |
| **Documentación** | Markdown | Práctica profesional |

### 3.2 Estructura del Proyecto Talento Tech

```
rifas-talento-tech-nodejs/
├── frontend/
│   └── index.html (aplicación frontend)
├── backend/
│   ├── app.js (servidor principal)
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   └── Rifa.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── rifas.js
│   ├── middleware/
│   │   └── auth.js
│   ├── database/
│   │   ├── init.sql
│   │   └── rifas.db
│   └── package.json
├── docs/
│   └── README.md
├── .env.example
└── .gitignore
```

---

## 4. Modelo de Datos - Ejercicio Práctico

### 4.1 Diseño de Base de Datos para Estudiantes

**Concepto:** Diseñar un sistema que permita gestionar usuarios, rifas y participaciones, aplicando conceptos de modelado relacional.

### 4.2 Diagrama Entidad Relación (DER)

```
USUARIO (1) ----< crea >---- (N) RIFA (1) ----< contiene >---- (N) NUMERO_RIFA
    |                                                                    |
    └─────────────< participa_en >────────────────────────────────────────┘
```

### 4.3 Tablas del Proyecto de Aprendizaje

**Tabla: users (Gestión de estudiantes/usuarios)**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Tabla: rifas (Simulaciones creadas)**
```sql
CREATE TABLE rifas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price_per_number DECIMAL(10,2),
    max_numbers INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active',
    winner_number INTEGER,
    drawn_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Tabla: rifa_numbers (Números seleccionados/vendidos)**
```sql
CREATE TABLE rifa_numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rifa_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    participant_name VARCHAR(100),
    participant_email VARCHAR(100),
    selected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rifa_id) REFERENCES rifas(id) ON DELETE CASCADE,
    UNIQUE(rifa_id, number)
);
```

### 4.4 Script de Inicialización

```sql
-- Script de inicialización para proyecto Talento Tech
-- Archivo: database/init.sql

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de rifas/simulaciones
CREATE TABLE IF NOT EXISTS rifas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price_per_number DECIMAL(10,2),
    max_numbers INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active',
    winner_number INTEGER,
    drawn_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear tabla de números de rifas
CREATE TABLE IF NOT EXISTS rifa_numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rifa_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    participant_name VARCHAR(100),
    participant_email VARCHAR(100),
    selected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rifa_id) REFERENCES rifas(id) ON DELETE CASCADE,
    UNIQUE(rifa_id, number)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_rifas_user_id ON rifas(user_id);
CREATE INDEX IF NOT EXISTS idx_rifas_status ON rifas(status);
CREATE INDEX IF NOT EXISTS idx_rifa_numbers_rifa_id ON rifa_numbers(rifa_id);

-- Datos de ejemplo para práctica
INSERT OR IGNORE INTO users (username, email, password_hash, full_name) VALUES
('estudiante_tt', 'estudiante@talentotech.com', '$2b$10$ejemplo_hash', 'Estudiante Talento Tech'),
('demo_user', 'demo@talentotech.com', '$2b$10$ejemplo_hash_demo', 'Usuario Demo');

-- Insertar rifas de ejemplo
INSERT OR IGNORE INTO rifas (user_id, title, description, price_per_number, status) VALUES
(1, 'PlayStation 5 - Proyecto Final', 'Rifa de práctica para el curso Node.js', 25.00, 'active'),
(1, 'iPhone 15 Pro - Ejercicio Backend', 'Simulación con base de datos SQLite', 50.00, 'active'),
(2, 'Set de Productos - Demo', 'Ejemplo de CRUD completo', 15.00, 'completed');
```

---

## 5. API Endpoints - Ejercicios del Curso

### 5.1 Módulo de Autenticación

| Método | Endpoint | Descripción | Ejercicio |
|--------|----------|-------------|-----------|
| POST | `/api/auth/register` | Registro de usuario | Validación y encriptación |
| POST | `/api/auth/login` | Inicio de sesión | JWT y autenticación |
| POST | `/api/auth/logout` | Cerrar sesión | Manejo de tokens |
| GET | `/api/auth/me` | Perfil del usuario | Middleware de auth |

### 5.2 Módulo de Rifas (CRUD Completo)

| Método | Endpoint | Descripción | Concepto Node.js |
|--------|----------|-------------|------------------|
| GET | `/api/rifas` | Listar rifas públicas | Query params y paginación |
| GET | `/api/rifas/my` | Rifas del usuario logueado | Autorización |
| POST | `/api/rifas` | Crear nueva rifa | Validación de datos |
| PUT | `/api/rifas/:id` | Actualizar rifa | Parámetros de ruta |
| DELETE | `/api/rifas/:id` | Eliminar rifa | Soft delete |
| GET | `/api/rifas/:id` | Detalle de rifa | Joins con SQLite |

### 5.3 Módulo de Participación

| Método | Endpoint | Descripción | Funcionalidad |
|--------|----------|-------------|---------------|
| POST | `/api/rifas/:id/numbers` | Seleccionar números | Transacciones |
| GET | `/api/rifas/:id/numbers` | Ver números seleccionados | Consultas JOIN |
| POST | `/api/rifas/:id/draw` | Realizar sorteo | Lógica de negocio |
| GET | `/api/rifas/:id/stats` | Estadísticas de rifa | Aggregations |

---

## 6. Configuración del Entorno de Desarrollo

### 6.1 Inicialización del Proyecto

```bash
# Crear directorio del proyecto Talento Tech
mkdir rifas-talento-tech-nodejs
cd rifas-talento-tech-nodejs

# Inicializar proyecto Node.js
npm init -y

# Instalar dependencias principales
npm install express sqlite3 bcryptjs jsonwebtoken cors dotenv helmet

# Instalar dependencias de desarrollo
npm install -D nodemon jest supertest

# Crear estructura de directorios
mkdir backend frontend docs
mkdir backend/{routes,middleware,models,config,database}
```

### 6.2 Package.json para Estudiantes

```json
{
  "name": "rifas-talento-tech-nodejs",
  "version": "1.0.0",
  "description": "Proyecto final del curso Node.js - Talento Tech",
  "main": "backend/app.js",
  "scripts": {
    "start": "node backend/app.js",
    "dev": "nodemon backend/app.js",
    "init-db": "node backend/database/init.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "keywords": ["nodejs", "express", "sqlite", "talento-tech", "rifas"],
  "author": "Estudiante Talento Tech",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3"
  }
}
```

### 6.3 Configuración de Variables de Entorno

Ver archivo `.env.example` para configuración completa.

---

## 7. Estructura del Servidor Express

### 7.1 Archivo Principal (backend/app.js)

```javascript
// Proyecto Talento Tech - Curso Node.js
// Simulador de Rifas con Backend
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const rifasRoutes = require('./routes/rifas');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet());
app.use(cors());

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/rifas', rifasRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Talento Tech ejecutándose en puerto ${PORT}`);
    console.log(`📁 Frontend disponible en: http://localhost:${PORT}`);
    console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
});

module.exports = app;
```

---

## 8. Ejercicios Prácticos del Curso

### 8.1 Nivel Básico - Configuración

1. **Configurar proyecto Node.js**
   - Inicializar npm
   - Instalar dependencias
   - Configurar scripts

2. **Crear servidor Express básico**
   - Ruta "Hello World"
   - Middleware de logging
   - Manejo de errores

### 8.2 Nivel Intermedio - Base de Datos

1. **Configurar SQLite**
   - Conexión a base de datos
   - Crear tablas
   - Insertar datos de prueba

2. **Implementar modelos**
   - Modelo User
   - Modelo Rifa
   - Relaciones entre tablas

### 8.3 Nivel Avanzado - Autenticación

1. **Sistema de registro**
   - Validación de datos
   - Encriptación de contraseñas
   - Manejo de errores

2. **Sistema de login**
   - Verificación de credenciales
   - Generación de JWT
   - Middleware de autenticación

### 8.4 Proyecto Final - CRUD Completo

1. **API de Rifas**
   - Crear, leer, actualizar, eliminar
   - Filtros y búsquedas
   - Validaciones de negocio

2. **Integración Frontend**
   - Consumir APIs
   - Manejo de estados
   - Experiencia de usuario

---

## 9. Criterios de Evaluación - Talento Tech

### 9.1 Funcionalidades Core (60%)

- ✅ Servidor Express funcionando
- ✅ Base de datos SQLite configurada
- ✅ Sistema de autenticación JWT
- ✅ CRUD completo de rifas
- ✅ Integración frontend-backend

### 9.2 Calidad del Código (25%)

- ✅ Estructura de proyecto organizada
- ✅ Comentarios y documentación
- ✅ Manejo de errores
- ✅ Validaciones de entrada
- ✅ Seguridad básica implementada

### 9.3 Creatividad y Mejoras (15%)

- ✅ Funcionalidades adicionales
- ✅ Interfaz de usuario mejorada
- ✅ Optimizaciones de rendimiento
- ✅ Testing implementado
- ✅ Deploy o documentación extra

---

## 10. Mejores Prácticas Aprendidas

### 10.1 Seguridad en Node.js

```javascript
// Ejemplos implementados en el proyecto
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

// Encriptación de contraseñas
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Verificación de contraseñas
const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Generación de JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};
```

### 10.2 Validaciones y Middleware

```javascript
// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};
```

### 10.3 Manejo de Base de Datos

```javascript
// Ejemplo de consulta con manejo de errores
const getRifasByUser = async (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT r.*, COUNT(rn.id) as total_numbers
            FROM rifas r
            LEFT JOIN rifa_numbers rn ON r.id = rn.rifa_id
            WHERE r.user_id = ?
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `;
        
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};
```

---

## 11. Recursos de Aprendizaje

### 11.1 Documentación Oficial

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [SQLite Documentation](https://sqlite.org/docs.html)
- [JWT.io](https://jwt.io/introduction)

### 11.2 Tutoriales Complementarios

- **Node.js Básico**: Variables de entorno, módulos, NPM
- **Express Intermedio**: Middlewares, rutas, templating
- **Base de Datos**: SQLite, ORMs, migraciones
- **Autenticación**: Sessions vs JWT, OAuth
- **Testing**: Jest, Supertest, TDD

### 11.3 Herramientas de Desarrollo

- **Postman**: Testing de APIs
- **VS Code**: Editor con extensiones Node.js
- **Git**: Control de versiones
- **Nodemon**: Auto-restart en desarrollo
- **SQLite Browser**: Visualización de base de datos

---

## 12. Próximos Pasos y Mejoras

### 12.1 Funcionalidades Avanzadas

1. **Upload de Imágenes**
   - Multer para archivos
   - Validación de tipos
   - Optimización de imágenes

2. **Notificaciones**
   - Emails con Nodemailer
   - Notificaciones push
   - Sistema de alertas

3. **Analytics**
   - Estadísticas de uso
   - Reportes de rifas
   - Dashboard administrativo

### 12.2 Tecnologías a Explorar

- **WebSockets**: Sorteos en tiempo real
- **Redis**: Cache y sesiones
- **MongoDB**: Base de datos NoSQL
- **GraphQL**: API alternativa
- **Docker**: Containerización
- **AWS/Heroku**: Deploy en la nube

---

## 13. Conclusión del Proyecto Talento Tech

Este proyecto de **Simulador de Rifas con Backend** representa una aplicación completa y práctica de los conceptos fundamentales del desarrollo con **Node.js** aprendidos en el curso de **Talento Tech**.

### 13.1 Logros Alcanzados

- ✅ **Servidor Express funcional** con rutas organizadas
- ✅ **Base de datos SQLite** con relaciones y validaciones
- ✅ **Sistema de autenticación JWT** seguro y escalable
- ✅ **API REST completa** siguiendo mejores prácticas
- ✅ **Integración frontend-backend** fluida
- ✅ **Documentación técnica** profesional
- ✅ **Código comentado y estructurado** para mantenibilidad

### 13.2 Competencias Desarrolladas

| Área | Competencias Adquiridas |
|------|-------------------------|
| **Backend** | Express, middlewares, rutas, manejo de errores |
| **Base de Datos** | SQLite, SQL, modelado relacional, consultas JOIN |
| **Seguridad** | Encriptación, JWT, validaciones, helmet |
| **API Design** | RESTful, status codes, documentación |
| **Frontend Integration** | Fetch API, async/await, manejo de estados |
| **Herramientas** | NPM, nodemon, variables de entorno |

### 13.3 Aplicabilidad Profesional

Este proyecto demuestra capacidades para:

- **Desarrollo Backend**: Crear servicios web escalables
- **Integración de Sistemas**: Conectar frontend con APIs
- **Gestión de Datos**: Diseñar e implementar bases de datos
- **Seguridad**: Implementar autenticación y autorización
- **Documentación**: Crear documentación técnica clara
- **Mejores Prácticas**: Seguir estándares de la industria

---

**Proyecto desarrollado como parte del programa Talento Tech - Curso Node.js**  
**Fecha de finalización:** Julio 2025  
**Estudiante:** [Nombre del Estudiante]  
**Instructor:** [Nombre del Instructor]

---

*"La mejor manera de aprender programación es construyendo proyectos reales"*  
**- Talento Tech Node.js Course**