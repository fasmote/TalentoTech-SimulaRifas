# 🎲 Simulador de Rifas con Backend

**Proyecto Final - Talento Tech curso NODE.JS 2025**

Un simulador interactivo de rifas con autenticación de usuarios y base de datos, desarrollado con Node.js, Express y SQLite.

## 🌟 Características

- 🎯 **Simulador de rifas interactivo** - Selección de números del 00 al 99
- 🎊 **Sorteo aleatorio** - Sistema de sorteo justo y transparente
- 👤 **Sistema de autenticación completo** - Login/Registro con localStorage ✅
- 🔐 **Gestión de usuarios segura** - Validaciones y contraseñas encriptadas ✅
- 🗄️ **Persistencia de datos** - LocalStorage para usuarios y simulaciones ✅
- 📱 **Diseño responsivo** - Funciona en móviles y desktop
- 🎨 **Interfaz moderna** - Modales elegantes y animaciones
- 🎮 **Modo demo sin registro** - Funciona para usuarios anónimos

## 🚀 Cómo Usar

### Opción 1: Usar directamente (Solo Frontend)
```bash
# Clonar el repositorio
git clone https://github.com/fasmote/simulador-rifas-bd.git

# Abrir el archivo HTML en tu navegador
cd simulador-rifas-bd/frontend
# Hacer doble click en index.html
```

### Opción 2: Con servidor backend (Completo)
```bash
# Instalar dependencias del backend
cd simulador-rifas-bd/backend
npm install

# Ejecutar el servidor
npm run dev

# Abrir en el navegador
# http://localhost:3000
```

### 🧪 Usuarios de Prueba
- **Usuario:** admin | **Contraseña:** 1234
- **Usuario:** estudiante1 | **Contraseña:** 1234  
- **Usuario:** demo | **Contraseña:** demo

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript Vanilla** - Lógica del simulador y autenticación
- **LocalStorage** - Persistencia de usuarios y datos ✅

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

### Frontend (Completado ✅)
- ✅ **Sistema de autenticación con modales**
- ✅ **Registro y login de usuarios**
- ✅ **Validaciones de formularios**
- ✅ **Persistencia con localStorage**
- ✅ **Interfaz responsiva y moderna**
- ✅ **Gestión de sesiones**
- ✅ **Creación de simulaciones personalizadas**
- ✅ **Usuarios de ejemplo para pruebas**

### Backend (En desarrollo 🔧)
- ✅ **Servidor Express funcionando**
- ✅ **Base de datos SQLite configurada**
- ✅ **API de autenticación JWT**
- ⏳ **Integración frontend-backend**
- ⏳ **API REST para rifas**

## 🎯 Funcionalidades Implementadas

### Simulador Básico (Frontend)
- Selección manual de números (00-99)
- Selección aleatoria de números
- Carrito de números seleccionados
- Sorteo aleatorio del ganador
- Animaciones y efectos visuales
- Modal de resultado del sorteo

### Sistema de Autenticación (Frontend) ✅
- **Registro de usuarios** - Formulario con validaciones
- **Inicio de sesión** - Modal elegante con UX moderna
- **Gestión de sesiones** - Persistencia con localStorage
- **Validaciones** - Email, contraseñas, usuarios únicos
- **Usuarios de ejemplo** - Para facilitar pruebas
- **Logout seguro** - Limpieza completa de datos
- **Protección de rutas** - Acceso controlado a perfil

### Funcionalidades Actuales ✅
- 🎊 Creación de rifas personalizadas
- 📊 Dashboard de usuario completo
- 🗄️ Persistencia de rifas en localStorage
- 🔔 Sistema de notificaciones visuales
- 👤 Gestión completa de perfil de usuario
- 🎯 Estadísticas de uso

### Próximas Funcionalidades
- 🔗 Integración con backend
- 📧 Sistema de notificaciones por email
- 🌐 Rifas públicas compartibles
- 📊 Analytics avanzados

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

### Frontend (Actual)
- ✅ **Registro de usuarios** - Validaciones completas
- ✅ **Login de usuarios** - Autenticación con localStorage
- ✅ **Gestión de sesiones** - Persistencia y logout
- ✅ **Creación de rifas** - Formularios y validaciones
- ✅ **Responsividad** - Probado en móviles y desktop
- ✅ **Usuarios de ejemplo** - admin/1234, demo/demo, estudiante1/1234

### Backend (Disponible)
- ✅ **API de autenticación JWT**
- ✅ **Base de datos SQLite**
- ✅ **Scripts de pruebas automatizados**

## 📚 Características Técnicas

### Seguridad Implementada:
- **Validación de formularios** - Campos requeridos y formato
- **Contraseñas seguras** - Mínimo 4 caracteres
- **Usuarios únicos** - Validación de duplicados
- **Emails válidos** - Verificación de formato
- **Limpieza de sesiones** - Logout seguro
- **Datos encapsulados** - localStorage organizado

### Arquitectura:
- **API RESTful** - Endpoints bien estructurados
- **Separación frontend/backend** - Arquitectura escalable
- **Base de datos relacional** - SQLite con foreign keys
- **Código modular** - Organización por responsabilidades

## 👨‍💻 Desarrollador

**Claudio Roh**  
Talento Tech curso NODE.JS 2025  
Instructor: Jean Paul Ferreira

## 📄 Licencia

Este proyecto es parte del programa educativo Talento Tech curso NODE.JS.

---

⭐ **¿Te gusta el proyecto?** ¡Dale una estrella en GitHub!

## 🐛 Problemas Resueltos

- ✅ **Login automático** - Ya no se loguea solo
- ✅ **Formularios de autenticación** - Modales elegantes
- ✅ **Persistencia de sesión** - Funciona correctamente
- ✅ **Validaciones completas** - Formularios seguros
- ✅ **Usuarios de ejemplo** - Para facilitar pruebas
- ✅ **Cache del navegador** - Sistema de datos limpio

## 🎯 Próximos Commits

1. **Integración Backend** - Conectar frontend con API
2. **Rifas compartidas** - Sistema de códigos únicos
3. **Notificaciones avanzadas** - Sistema de alertas
4. **Deploy a producción** - Subir a Vercel/Netlify

## 🎮 Instrucciones de Uso

### Como Usuario Anónimo
1. Abre `index.html` en tu navegador
2. Usa el simulador sin registrarte
3. Selecciona números y haz sorteos

### Como Usuario Registrado  
1. Click en "REGISTRARSE"
2. Completa el formulario
3. O usa: admin/1234, demo/demo, estudiante1/1234
4. Accede a "Mi Perfil" para crear rifas personalizadas
5. Gestiona tus simulaciones y estadísticas

### Funciones Avanzadas
- **Crear rifas:** Usa el formulario en "Mi Perfil"
- **Gestionar rifas:** Edita o elimina tus simulaciones
- **Ver estadísticas:** Revisa tu progreso de aprendizaje
- **Limpiar datos:** Ejecuta `clearAllData()` en consola