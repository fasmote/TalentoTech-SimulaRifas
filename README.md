# 🎲 Simulador de Rifas - TalentoTech Fase 12

Sistema completo de simulación de rifas con backend Node.js + Express + SQLite y frontend JavaScript vanilla.

## 🆕 Novedades Fase 12

### 📋 Cumplimiento Legal Argentina
- ❌ **Eliminado campo "precio"** - Cumple con normativa argentina sobre juegos
- ✅ **Simulaciones educativas** - Sin valor monetario real
- ✅ **Avisos legales** - Clarifica que es solo simulación

### 🔐 Sistema de Códigos de Acceso
- ✅ **Simulaciones privadas** - Solo accesibles por código de 6 caracteres
- ✅ **Códigos únicos** - Generados automáticamente (ej: A1B2C3)
- ✅ **Compartir fácil** - Copia y comparte códigos
- ✅ **Regenerar códigos** - Crear nuevos códigos cuando sea necesario

### 🌐 Simulaciones Públicas vs Privadas
- **Públicas**: Demostraciones abiertas para usuarios no registrados
- **Privadas**: Creadas por usuarios registrados, acceso solo por código

## 🚀 Instalación y Configuración

### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 2. Inicializar la base de datos (IMPORTANTE - Fase 12)

```bash
npm run init-db
```

### 3. Ejecutar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
TT_rifas_LIMPIA_LIMPIA/
├── backend/
│   ├── app.js                 # Servidor principal
│   ├── package.json          # Dependencias Node.js
│   ├── .env                  # Variables de entorno
│   ├── database/
│   │   ├── database.js       # Conexión SQLite
│   │   ├── init.js          # Inicialización DB (ACTUALIZADA FASE 12)
│   │   └── rifas.db         # Base de datos (se crea automáticamente)
│   ├── routes/
│   │   ├── auth.js          # Rutas de autenticación
│   │   └── rifas.js         # Rutas de simulaciones (ACTUALIZADA FASE 12)
│   └── middleware/
│       └── auth.js          # Middleware JWT
├── frontend/
│   └── index.html           # Aplicación web (ACTUALIZADA FASE 12)
└── README.md               # Este archivo
```

## 🎯 Funcionalidades

### 🆓 Sin Autenticación (Modo Demo)
- ✅ Simulación de rifas 0-99
- ✅ Selección de números manual y aleatoria
- ✅ Sorteo de ganadores
- ✅ Visualización de simulaciones públicas de ejemplo
- ✅ **NUEVO:** Acceso por código de 6 caracteres
- ✅ **NUEVO:** Página dedicada para códigos

### 👤 Con Autenticación
- ✅ Registro y login de usuarios
- ✅ **NUEVO:** Crear simulaciones privadas (sin precio)
- ✅ **NUEVO:** Gestión de códigos de acceso
- ✅ Gestionar mis simulaciones (CRUD)
- ✅ Realizar sorteos
- ✅ Dashboard personal con estadísticas
- ✅ **NUEVO:** Compartir códigos fácilmente
- ✅ **NUEVO:** Regenerar códigos cuando sea necesario

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Logout

### Simulaciones (Rifas)
- `GET /api/rifas` - Todas las simulaciones públicas
- `GET /api/rifas/my` - Mis simulaciones (requiere auth)
- `POST /api/rifas` - Crear simulación (requiere auth)
- `PUT /api/rifas/:id` - Editar simulación (requiere auth)
- `DELETE /api/rifas/:id` - Eliminar simulación (requiere auth)
- `GET /api/rifas/:id` - Detalles de simulación
- `POST /api/rifas/:id/numbers` - Seleccionar números
- `GET /api/rifas/:id/numbers` - Ver números seleccionados
- `POST /api/rifas/:id/draw` - Realizar sorteo (requiere auth)

### 🆕 NUEVOS - Códigos de Acceso (Fase 12)
- `GET /api/rifas/access/:code` - Acceder por código
- `POST /api/rifas/access/:code/numbers` - Participar por código
- `POST /api/rifas/:id/regenerate-code` - Regenerar código (requiere auth)

## 🗄️ Base de Datos (Actualizada Fase 12)

### Tablas
- **users**: Usuarios del sistema
- **rifas**: Simulaciones (⚠️ SIN campo price_per_number)
  - `access_code` (NUEVO): Código de 6 caracteres
  - `is_public` (NUEVO): Simulación pública o privada
- **rifa_numbers**: Números seleccionados por simulación

### Usuario de Prueba
- **Usuario:** admin
- **Contraseña:** 123456
- **Email:** admin@talentotech.com

## 🔑 Cómo Usar los Códigos de Acceso

### Para Creadores (Usuarios Registrados)
1. Inicia sesión
2. Ve a "Mi Perfil"
3. Crea nueva simulación
4. Recibe código automático (ej: A1B2C3)
5. Comparte el código con participantes

### Para Participantes
1. Ve a "Acceder por Código"
2. Ingresa el código de 6 caracteres
3. Selecciona números
4. Participa en la simulación

## 🌐 Tipos de Simulaciones

### 🔓 Públicas (Demostración)
- Visibles en "Simulaciones Públicas"
- Creadas por el sistema
- Para practicar y experimentar
- Sin códigos necesarios

### 🔒 Privadas (Usuarios Registrados)
- Solo accesibles por código
- Creadas por usuarios logueados
- Código de 6 caracteres único
- Se pueden regenerar códigos

## 🔄 Sincronización entre PCs

**RECOMENDADO: Usar Google Drive**

1. Mueve toda la carpeta `TT_rifas_LIMPIA_LIMPIA` a Google Drive
2. En cada PC, sincroniza desde Google Drive
3. La base de datos SQLite se sincroniza automáticamente

### Alternativa: Git (Ver sección GitHub)

## 🏃‍♂️ Inicio Rápido

1. **Clonar/Descargar** el proyecto
2. **Instalar:** `cd backend && npm install`
3. **⚠️ IMPORTANTE - Inicializar DB Fase 12:** `npm run init-db`
4. **Ejecutar:** `npm run dev`
5. **Abrir:** http://localhost:3000

## ✅ Cumplimiento Requisitos TalentoTech

### Diseño del Sitio Web
- ✅ Múltiples páginas interconectadas
- ✅ Diseño responsivo
- ✅ Estética visual moderna
- ✅ **NUEVO:** Navegación mejorada con códigos

### Formularios
- ✅ Ingreso de datos (crear simulaciones, registro)
- ✅ Modificación de datos (editar simulaciones)
- ✅ Eliminación de datos (eliminar simulaciones)
- ✅ **NUEVO:** Formularios de códigos de acceso

### Base de Datos
- ✅ SQLite con 3 tablas relacionadas
- ✅ Tabla usuarios (ID, nombre, email, etc.)
- ✅ Tabla simulaciones (ID, título, descripción, código, etc.)
- ✅ **ACTUALIZADA:** Sin campos monetarios (cumplimiento legal)
- ✅ Conexión con Node.js

## 🏛️ Cumplimiento Legal Argentina

### ❌ Eliminación de Referencias Monetarias
- Sin campo "precio por número"
- Sin transacciones de dinero
- Solo simulaciones educativas

### ✅ Avisos Legales Incluidos
- Clarificación en todas las páginas
- "Simulación educativa sin valor monetario"
- Cumple normativa argentina sobre juegos

## 📊 Nuevas Funcionalidades Fase 12

1. **Sistema de Códigos**: Simulaciones privadas con códigos únicos
2. **Separación Público/Privado**: Demostraciones vs simulaciones personales
3. **Cumplimiento Legal**: Eliminación de referencias monetarias
4. **UX Mejorada**: Navegación clara entre tipos de simulaciones
5. **Compartir Fácil**: Copiar códigos al portapapeles
6. **Regenerar Códigos**: Nueva funcionalidad de seguridad

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- Validación de entrada
- Protección de rutas
- **NUEVO:** Códigos únicos de 6 caracteres
- **NUEVO:** Regeneración segura de códigos

## 📝 Notas de Desarrollo

- Frontend: HTML/CSS/JavaScript vanilla
- Backend: Node.js + Express
- Base de datos: SQLite
- Autenticación: JWT + bcrypt
- **NUEVO:** Sistema de códigos alfanuméricos
- Sin frameworks frontend pesados (mantiene simplicidad)

---

**Desarrollado para TalentoTech 2025 - Fase 12**
**✅ Cumple normativa argentina sobre juegos**
