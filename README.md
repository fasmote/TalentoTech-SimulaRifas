# 🎲 Simulador de Rifas con Backend

**Proyecto Final - Talento Tech curso NODE.JS 2025**

Un simulador interactivo de rifas con autenticación de usuarios y base de datos, desarrollado con Node.js, Express y SQLite.

## 🌟 Características

- 🎯 **Simulador de rifas interactivo** - Selección de números del 00 al 99
- 🎊 **Sorteo aleatorio** - Sistema de sorteo justo y transparente
- 👤 **Autenticación JWT** - Sistema seguro de usuarios ✅
- 🔐 **Contraseñas encriptadas** - Seguridad con bcryptjs ✅
- 🗄️ **Base de datos SQLite** - Conectada y funcionando ✅
- 📱 **Diseño responsivo** - Funciona en móviles y desktop
- 🎨 **Interfaz moderna** - Diseño atractivo y fácil de usar

## 🚀 Demo en Vivo

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/simulador-rifas-bd.git

# Instalar dependencias
cd simulador-rifas-bd/backend
npm install

# Ejecutar el servidor
npm run dev

# Abrir en el navegador
# http://localhost:3000
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript Vanilla** - Lógica del simulador

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web minimalista
- **SQLite** - Base de datos ligera y eficiente
- **JWT** - Autenticación sin estado ✅
- **bcryptjs** - Encriptación de contraseñas ✅
- **dotenv** - Variables de entorno ✅

## 📁 Estructura del Proyecto

```
simulador-rifas-bd/
├── frontend/                    # Aplicación web
│   └── rifa_app_62.html        # Interfaz de usuario
├── backend/                    # Servidor API
│   ├── app.js                 # Servidor Express
│   ├── package.json           # Dependencias
│   ├── .env                   # Variables de entorno
│   ├── middleware/            # Middleware de autenticación
│   │   └── auth.js           # JWT middleware
│   ├── routes/               # Rutas de la API
│   │   └── auth.js          # Autenticación endpoints
│   ├── test/                # Scripts de prueba
│   │   └── test-auth.js     # Pruebas de autenticación
│   └── database/            # Base de datos
│       ├── database.js      # Conexión SQLite
│       └── rifas.db        # Archivo de base de datos
└── README.md               # Este archivo
```

## 📋 Estado del Desarrollo

- ✅ **Servidor Express funcionando**
- ✅ **Git configurado y subido a GitHub**  
- ✅ **Base de datos SQLite conectada**
- ✅ **Sistema de autenticación JWT completo**
- ✅ **Registro y login de usuarios**
- ✅ **Encriptación de contraseñas**
- ✅ **Middleware de protección de rutas**
- ✅ **Scripts de pruebas automatizados**
- ⏳ **API REST para rifas** (próximo paso)
- ⏳ **Integración frontend-backend** (planificado)

## 🎯 Funcionalidades Implementadas

### Simulador Básico (Frontend)
- Selección manual de números (00-99)
- Selección aleatoria de números
- Carrito de números seleccionados
- Sorteo aleatorio del ganador
- Animaciones y efectos visuales
- Modal de resultado del sorteo

### Sistema de Autenticación (Backend) ✅
- **POST /api/auth/register** - Registro de usuarios
- **POST /api/auth/login** - Inicio de sesión
- **GET /api/auth/me** - Información del usuario
- **POST /api/auth/logout** - Cerrar sesión
- **Middleware JWT** - Protección de rutas
- **Contraseñas encriptadas** - Seguridad bcryptjs

### Próximas Funcionalidades
- 🎊 Creación de rifas personalizadas (API)
- 📊 Dashboard de usuario
- 🗄️ Persistencia completa de rifas
- 📧 Sistema de notificaciones
- 🔗 Integración frontend-backend

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm start          # Iniciar servidor (producción)
npm run dev        # Modo desarrollo (auto-reload)
npm test          # Ejecutar pruebas de autenticación

# Base de datos
# La BD se inicializa automáticamente al iniciar el servidor

# Git
git status         # Ver estado
git add .          # Agregar cambios
git commit -m ""   # Hacer commit
git push           # Subir cambios
```

## 🗄️ Base de Datos

### Tablas implementadas:
- **users**: Usuarios del sistema (id, username, email, password_hash, created_at)
- **rifas**: Simulaciones creadas por usuarios (próximamente)
- **rifa_numbers**: Números seleccionados en cada rifa (próximamente)

### Endpoints de API disponibles:
```
GET  /                    - Aplicación web
GET  /api/test           - Prueba de servidor
POST /api/auth/register  - Registro de usuario
POST /api/auth/login     - Inicio de sesión
GET  /api/auth/me        - Usuario actual (requiere token)
POST /api/auth/logout    - Cerrar sesión (requiere token)
```

### Probar la API:
```bash
# Ejecutar pruebas automatizadas
cd backend
npm test
```

## 🧪 Pruebas del Sistema

El proyecto incluye un script de pruebas automatizado que verifica:
- ✅ Conexión del servidor
- ✅ Registro de usuarios
- ✅ Login de usuarios  
- ✅ Validación de tokens JWT
- ✅ Protección de rutas

## 📚 Características Técnicas

### Seguridad Implementada:
- **JWT tokens** - Autenticación sin estado
- **bcryptjs** - Hash de contraseñas con salt
- **Middleware de protección** - Rutas protegidas
- **Validación de entrada** - Sanitización de datos
- **Variables de entorno** - Configuración segura

### Arquitectura:
- **API RESTful** - Endpoints bien estructurados
- **Separación frontend/backend** - Arquitectura escalable
- **Base de datos relacional** - SQLite con foreign keys
- **Código modular** - Organización por responsabilidades

## 👨‍💻 Desarrollador

**[Tu Nombre]**  
Talento Tech curso NODE.JS 2025  
Instructor: [Nombre del instructor]

## 📄 Licencia

Este proyecto es parte del programa educativo Talento Tech curso NODE.JS.

---

⭐ **¿Te gusta el proyecto?** ¡Dale una estrella en GitHub!

## 🎯 Próximos Commits

1. **API de Rifas** - CRUD completo para gestión de rifas
2. **Integración Frontend** - Conectar interfaz con autenticación
3. **Dashboard de Usuario** - Panel de control personalizado
4. **Deploy a producción** - Subir a Heroku/Vercel