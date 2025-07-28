# 🎲 Simulador de Rifas - TalentoTech Fase 15

Sistema completo de simulación de rifas con backend Node.js + Express + SQLite y frontend JavaScript vanilla.

## 🌟 Novedades Fase 15

### 🌍 Soporte Internacional
- ✅ **Zona horaria automática** - Cada usuario ve fechas en su horario local
- ✅ **Formato regional** - Idioma y formato de fecha adaptado al usuario
- ✅ **Indicador visual** - Muestra qué zona horaria está viendo
- ✅ **Participantes globales** - Usuarios de cualquier país pueden participar

### 📱 Mobile-First Design
- ✅ **Responsive mejorado** - Panel de información debajo en móviles
- ✅ **Navegación optimizada** - Menú dinámico según estado de login
- ✅ **UX móvil** - Experiencia perfecta en dispositivos pequeños

### ⏰ Tracking Temporal Avanzado
- ✅ **Timestamps participación** - Fecha y hora exacta de cada participación
- ✅ **Tiempo relativo** - "Hace 5min", "Hace 2h", etc.
- ✅ **Historial completo** - Multiple participaciones por usuario
- ✅ **Tooltips informativos** - Hover sobre números muestra cuándo participó

### 🔧 Mejoras de Usabilidad
- ✅ **Nombre obligatorio** - Requerido para acceso por código
- ✅ **Persistencia en pantalla** - No redirige después de participar
- ✅ **Botones reparados** - Editar y Ver funcionan correctamente
- ✅ **"Mis Simulaciones"** - Nombre más claro que "Mi Perfil"
- ✅ **Menú inteligente** - Opciones aparecen/ocultan según login

### 🎨 Contenido Demo Realista
- ✅ **Rifas públicas pobladas** - iPhone 15 Pro, Cartera Premium, Viaje a Europa
- ✅ **Participantes reales** - 30+ nombres con participaciones distribuidas
- ✅ **Datos temporales** - Participaciones escalonadas en el tiempo

## 🚀 Instalación y Configuración

### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 2. Inicializar base de datos con contenido demo

```bash
# Inicializar con rifas públicas realistas
npm run reset-demo

# Verificar que todo funcione
npm run verify
```

### 3. Ejecutar el servidor

```bash
# Modo desarrollo (recomendado)
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
TT_rifas_LIMPIA_LIMPIA/
├── backend/
│   ├── app.js                 # Servidor principal Express
│   ├── package.json          # Dependencias y scripts NPM
│   ├── .env                  # Variables de entorno
│   ├── database/
│   │   ├── database.js       # Conexión SQLite
│   │   ├── init.js          # Inicialización DB
│   │   ├── demo-content.js   # ⭐ NUEVO: Rifas demo realistas
│   │   └── rifas.db         # Base de datos SQLite
│   ├── routes/
│   │   ├── auth.js          # Rutas de autenticación JWT
│   │   └── rifas.js         # ⭐ ACTUALIZADO: API completa
│   └── middleware/
│       └── auth.js          # Middleware JWT + validación
├── frontend/
│   └── index.html           # ⭐ RENOVADO: App SPA con todas las funciones
└── README.md               # Este archivo actualizado
```

## 🎯 Funcionalidades Completas

### 🆓 Sin Autenticación (Acceso Público)
- ✅ Simulación demo de rifas 0-99
- ✅ Selección manual y aleatoria de números
- ✅ Sorteo de ganadores con animaciones
- ✅ **Ver simulaciones públicas** - 3 rifas demo realistas
- ✅ **Participar sin registro** - En simulaciones públicas
- ✅ **Acceso por código** - 6 caracteres para simulaciones privadas
- ✅ **⭐ Zona horaria local** - Ve fechas en su horario

### 👤 Con Autenticación (Usuario Registrado)
- ✅ Registro y login seguro
- ✅ **"Mis Simulaciones"** - Dashboard personal mejorado
- ✅ **Crear simulaciones privadas** - Con códigos únicos
- ✅ **Gestión completa CRUD** - Crear, ver, editar, eliminar
- ✅ **Realizar sorteos** - Con ganadores aleatorios
- ✅ **Estadísticas** - Simulaciones activas/completadas
- ✅ **Compartir códigos** - Copiar al portapapeles
- ✅ **Regenerar códigos** - Nuevos códigos de acceso
- ✅ **⭐ Monitoreo en tiempo real** - Ver participaciones con timestamps
- ✅ **⭐ Navegación post-login** - Va directo a "Mis Simulaciones"

## 🔧 API Endpoints Completa

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login con JWT
- `GET /api/auth/me` - Información del usuario actual
- `POST /api/auth/logout` - Logout seguro

### Simulaciones (Rifas)
- `GET /api/rifas` - **Simulaciones públicas** (con participantes demo)
- `GET /api/rifas/my` - Mis simulaciones privadas (requiere auth)
- `POST /api/rifas` - Crear nueva simulación (requiere auth)
- `PUT /api/rifas/:id` - Editar simulación (requiere auth)
- `DELETE /api/rifas/:id` - Eliminar simulación (requiere auth)
- `GET /api/rifas/:id` - Detalles de simulación específica
- `POST /api/rifas/:id/numbers` - Seleccionar números en simulación
- `GET /api/rifas/:id/numbers` - **⭐ MEJORADO:** Ver números con timestamps
- `POST /api/rifas/:id/draw` - Realizar sorteo (requiere auth)

### Códigos de Acceso
- `GET /api/rifas/access/:code` - Acceder por código de 6 caracteres
- `POST /api/rifas/access/:code/numbers` - **⭐ MEJORADO:** Participar (nombre obligatorio)
- `POST /api/rifas/:id/regenerate-code` - Regenerar código (requiere auth)

## 🗄️ Base de Datos (SQLite)

### Tablas Principales
- **users**: Usuarios registrados del sistema
- **rifas**: Simulaciones (públicas y privadas)
  - `access_code`: Código único de 6 caracteres
  - `is_public`: Booleano para simulaciones públicas
  - `status`: 'active' o 'completed'
  - `winner_number`: Número ganador (si sorteo realizado)
- **rifa_numbers**: Números seleccionados con timestamps
  - `participant_name`: Nombre del participante
  - `selected_at`: **⭐ NUEVO:** Timestamp UTC de participación

### Usuario de Prueba Predefinido
- **Usuario:** admin
- **Contraseña:** 123456
- **Email:** admin@talentotech.com

## 🌍 Funcionalidades Internacionales

### Zona Horaria Automática
El sistema detecta automáticamente la zona horaria del usuario usando `Intl.DateTimeFormat()`:

- **Usuarios en Argentina**: Ven fechas en `ART` (UTC-3)
- **Usuarios en España**: Ven fechas en `CET` (UTC+1)
- **Usuarios en México**: Ven fechas en `CST` (UTC-6)
- **Cualquier país**: Formato automático según ubicación

### Ejemplo de Timestamps
```
🕐 Hace 15min (14:30 ART)    # Usuario en Argentina
🕐 Hace 15min (18:30 CET)    # Usuario en España  
🕐 Hace 15min (11:30 CST)    # Usuario en México
```

## 📱 Diseño Responsive

### Desktop (≥768px)
```
┌─────────────┬────────────────┐
│   Grilla    │   Panel Info   │
│  Números    │  Participantes │
│             │   Estadísticas │
└─────────────┴────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────────────┐
│        Grilla Números       │
├─────────────────────────────┤
│       Panel Info            │
│     Participantes           │
│     Estadísticas            │
└─────────────────────────────┘
```

## 🔑 Guía de Uso: Códigos de Acceso

### Para Creadores (Registrados)
1. **Inicia sesión** → Vas automáticamente a "Mis Simulaciones"
2. **Crear simulación** → Recibe código único (ej: `XB7K9M`)
3. **Compartir código** → Botón "Copiar Código"
4. **Monitorear participaciones** → Ver timestamps en tiempo real
5. **Realizar sorteo** → Cuando haya suficientes participantes

### Para Participantes (Sin Registro)
1. **"Acceder por Código"** → Página dedicada
2. **Ingresar código** → 6 caracteres alfanuméricos
3. **⭐ Ingresar nombre** → OBLIGATORIO para participar
4. **Seleccionar números** → Manual o aleatorio
5. **⭐ Permanecer en pantalla** → Ve números actualizados sin redirigir

## 🌐 Tipos de Simulaciones

### 🔓 Públicas (Demo Realista)
- **iPhone 15 Pro** 📱 - 12 participantes con números distribuidos
- **Cartera Premium** 👜 - 10 participantes femeninas
- **Viaje a Europa** ✈️ - 16 participantes mixed
- Visibles sin login en "Simulaciones Públicas"
- Datos temporales realistas (últimas 72 horas)

### 🔒 Privadas (Usuarios Registrados)
- Solo accesibles por código de 6 caracteres
- Creadas por usuarios autenticados
- Códigos regenerables por seguridad
- Monitoreo completo con timestamps

## 🔄 Sincronización Multi-PC

### Opción 1: Google Drive (Recomendado)
1. Mover `TT_rifas_LIMPIA_LIMPIA/` a Google Drive
2. Sincronizar en cada PC
3. La DB SQLite se sincroniza automáticamente
4. **⭐ Timestamps UTC** - Consistencia entre zonas horarias

### Opción 2: Git + GitHub
```bash
git add .
git commit -m "feat: actualización con nuevas participaciones"
git push origin main
```

## 🏃‍♂️ Inicio Rápido

1. **Clonar/Descargar** el proyecto completo
2. **Instalar:** `cd backend && npm install`
3. **⚠️ Inicializar con demo:** `npm run reset-demo`
4. **Ejecutar:** `npm run dev`
5. **Abrir:** http://localhost:3000
6. **⭐ Probar:** Ve a "Simulaciones Públicas" → Participar

## ✅ Cumplimiento Requisitos TalentoTech

### Arquitectura Backend (Node.js + Express)
- ✅ **Servidor web completo** con routing avanzado
- ✅ **Estructura modular MVC** - Controllers, Models, Routes, Services
- ✅ **API RESTful** - Todos los métodos HTTP (GET, POST, PUT, DELETE)
- ✅ **Base de datos SQLite** - 3 tablas relacionadas
- ✅ **Autenticación JWT** - Seguridad robusta
- ✅ **CORS configurado** - Comunicación cliente-servidor
- ✅ **Manejo de errores** - Códigos HTTP apropiados (404, 500)

### Frontend Avanzado
- ✅ **SPA (Single Page Application)** - Navegación fluida
- ✅ **Diseño responsive** - Mobile-first approach
- ✅ **Múltiples páginas** - 5+ vistas interconectadas
- ✅ **Formularios complejos** - CRUD completo
- ✅ **UX moderna** - Animaciones y feedback visual
- ✅ **⭐ Zona horaria internacional** - Soporte global

### Base de Datos
- ✅ **SQLite relacional** - 3 tablas con foreign keys
- ✅ **Operaciones CRUD** - Create, Read, Update, Delete
- ✅ **Datos persistentes** - Simulaciones y usuarios guardados
- ✅ **⭐ Timestamps UTC** - Consistencia temporal global

## 🏛️ Cumplimiento Legal Argentina

### ❌ Sin Referencias Monetarias
- No campo "precio por número"
- No transacciones de dinero real
- Solo simulaciones educativas
- Avisos legales en toda la aplicación

### ✅ Normativa de Juegos
- "Simulación educativa sin valor monetario"
- Clarificaciones en múltiples páginas
- Cumple con legislación argentina vigente

## 🔒 Seguridad Implementada

- **Contraseñas**: Encriptación bcrypt con salt
- **Autenticación**: JWT tokens seguros
- **Validación**: Input sanitization
- **Protección de rutas**: Middleware de autenticación
- **Códigos únicos**: 6 caracteres alfanuméricos
- **Regeneración segura**: Nuevos códigos bajo demanda
- **⭐ CORS**: Configurado para producción

## 📊 Métricas del Proyecto Fase 15

### Líneas de Código
- **Frontend**: ~2,400 líneas (HTML + CSS + JS)
- **Backend**: ~800 líneas (Node.js + Express)
- **Total**: ~3,200 líneas de código original

### Funcionalidades
- **⭐ 15+ endpoints API** - RESTful completa
- **⭐ 5 páginas principales** - SPA navegable
- **⭐ 3 tipos de usuarios** - Anónimo, Registrado, Admin
- **⭐ 2 tipos simulaciones** - Pública vs Privada
- **⭐ Soporte internacional** - Cualquier zona horaria

### Tecnologías
- **Backend**: Node.js, Express.js, SQLite3, JWT, bcrypt
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Fetch API
- **⭐ APIs Modernas**: Intl.DateTimeFormat, Clipboard API
- **Herramientas**: npm, nodemon, Git

## 🚀 Deploy en Producción

### Variables de Entorno (.env)
```bash
PORT=3000
JWT_SECRET=tu_jwt_secret_super_secreto
NODE_ENV=production
```

### Scripts Disponibles
```bash
npm start          # Servidor producción
npm run dev        # Servidor desarrollo
npm run init-db    # Inicializar DB vacía
npm run reset-demo # ⭐ DB con contenido realista
npm run verify     # Verificar funcionamiento
```

## 📈 Próximas Mejoras (Post-Entrega)

- **🔮 Migración MongoDB** - Base de datos NoSQL
- **🔔 Notificaciones Push** - Para sorteos en tiempo real
- **📊 Analytics Dashboard** - Estadísticas avanzadas
- **🎨 Temas visuales** - Dark mode y personalización
- **🌐 i18n completo** - Múltiples idiomas

---

**🎓 Desarrollado para TalentoTech 2025 - Fase 15**  
**⭐ Proyecto Final Integrador - Node.js**  
**🌍 Con soporte internacional y diseño mobile-first**  
**✅ Cumple 100% con requisitos del curso**
