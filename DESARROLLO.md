# 🔧 GUÍA DE DESARROLLO - TalentoTech Fase 12

## 🚀 Inicio Rápido

### Opción 1: Script Automático (RECOMENDADO)
```cmd
# Doble clic en INICIAR.bat
```

### Opción 2: Manual
```cmd
cd backend
npm install
npm run init-db    # ⚠️ IMPORTANTE: Ejecutar para actualizar a Fase 12
npm run dev
```

## 📋 Comandos Disponibles

### Backend
```cmd
npm start          # Modo producción
npm run dev        # Modo desarrollo (con nodemon)
npm run init-db    # Crear/actualizar base de datos (FASE 12)
npm run reset-db   # Reiniciar DB con datos de ejemplo
```

## 🆕 Novedades Fase 12

### 🏛️ Cumplimiento Legal Argentina
- ❌ **Eliminado campo `price_per_number`** - Sin referencias monetarias
- ✅ **Simulaciones educativas** - Solo fines educativos
- ✅ **Avisos legales** - En toda la aplicación

### 🔑 Sistema de Códigos de Acceso
- **Códigos únicos:** 6 caracteres alfanuméricos (ej: A1B2C3)
- **Simulaciones privadas:** Solo accesibles por código
- **Regeneración:** Crear nuevos códigos cuando sea necesario
- **Compartir fácil:** Copiar al portapapeles

### 🌐 Tipos de Simulaciones
- **Públicas:** Demostraciones abiertas (sin código necesario)
- **Privadas:** Creadas por usuarios (requieren código de acceso)

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Frontend:** HTML5 + CSS3 + JavaScript Vanilla
- **Backend:** Node.js + Express.js
- **Base de Datos:** SQLite3
- **Autenticación:** JWT + bcrypt
- **🆕 Códigos:** Sistema alfanumérico único

### Estructura de Archivos
```
TT_rifas_LIMPIA_LIMPIA/
├── backend/
│   ├── app.js                 # Servidor principal
│   ├── config.js              # Configuración
│   ├── package.json           # Dependencias
│   ├── .env                   # Variables de entorno
│   ├── database/
│   │   ├── database.js        # Conexión SQLite
│   │   ├── init.js           # Inicialización (ACTUALIZADA FASE 12)
│   │   └── rifas.db          # Base de datos (auto-generada)
│   ├── routes/
│   │   ├── auth.js           # Rutas autenticación
│   │   └── rifas.js          # Rutas simulaciones (ACTUALIZADA FASE 12)
│   └── middleware/
│       └── auth.js           # Middleware JWT
├── frontend/
│   └── index.html            # Aplicación SPA (ACTUALIZADA FASE 12)
├── INICIAR.bat               # Script de inicio
├── README.md                 # Documentación principal (ACTUALIZADA)
├── DESARROLLO.md             # Este archivo (ACTUALIZADO)
└── GITHUB_FASE12.md         # Instrucciones Git (NUEVO)
```

## 🗄️ Esquema de Base de Datos (Actualizado Fase 12)

### Tabla: users
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `created_at` (DATETIME)

### Tabla: rifas (ACTUALIZADA FASE 12)
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `user_id` (FK → users.id, NULLABLE para simulaciones públicas)
- `title` (VARCHAR)
- `description` (TEXT)
- `access_code` (VARCHAR(6), 🆕 NUEVO) - Código único de acceso
- `max_numbers` (INTEGER, DEFAULT 100)
- `status` (VARCHAR, DEFAULT 'active')
- `is_public` (BOOLEAN, 🆕 NUEVO) - Simulación pública o privada
- `winner_number` (INTEGER)
- `created_at` (DATETIME)
- ❌ **ELIMINADO:** `price_per_number` (cumplimiento legal)

### Tabla: rifa_numbers
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `rifa_id` (FK → rifas.id)
- `number` (INTEGER)
- `is_selected` (BOOLEAN)
- `participant_name` (VARCHAR)
- `selected_at` (DATETIME)
- UNIQUE(rifa_id, number)

## 🔌 API Endpoints (Actualizados Fase 12)

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Logout

### Simulaciones (Rifas)
- `GET /api/rifas` - Listar simulaciones públicas
- `GET /api/rifas/my` - Mis simulaciones (auth requerida)
- `POST /api/rifas` - Crear simulación (auth requerida, 🆕 genera código)
- `PUT /api/rifas/:id` - Editar simulación (auth requerida)
- `DELETE /api/rifas/:id` - Eliminar simulación (auth requerida)
- `GET /api/rifas/:id` - Detalles de simulación pública
- `POST /api/rifas/:id/numbers` - Seleccionar números (público/código)
- `GET /api/rifas/:id/numbers` - Ver números seleccionados
- `POST /api/rifas/:id/draw` - Realizar sorteo (auth requerida)

### 🆕 NUEVOS - Códigos de Acceso (Fase 12)
- `GET /api/rifas/access/:code` - Acceder por código
- `POST /api/rifas/access/:code/numbers` - Participar por código
- `POST /api/rifas/:id/regenerate-code` - Regenerar código (auth requerida)

## 🔐 Seguridad

### Autenticación JWT
```javascript
// Header Authorization
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Encriptación de Contraseñas
- bcrypt con salt rounds 10 (desarrollo) / 12 (producción)

### 🆕 Códigos de Acceso
- 6 caracteres alfanuméricos únicos
- Generación automática con validación de unicidad
- Regeneración segura cuando sea necesario

### Validaciones
- Entrada de datos sanitizada
- Verificación de permisos por ruta
- Protección contra inyección SQL
- 🆕 Validación de códigos de acceso

## 👥 Usuarios de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| admin | admin@talentotech.com | 123456 | Administrador |

⚠️ **Nota Fase 12:** Los datos de ejemplo se reducen para simplicidad

## 🔑 Ejemplos de Códigos de Acceso

```
A1B2C3  # Ejemplo de código válido
X9Y8Z7  # Ejemplo de código válido
123ABC  # Ejemplo de código válido
```

### Generación de Códigos
```javascript
// Algoritmo de generación (backend/routes/rifas.js)
const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
```

## 🐛 Debugging

### Logs del Servidor
```javascript
console.log('🔨 Inicializando base de datos - Fase 12...');
console.log('✅ Base de datos inicializada correctamente!');
console.log('🔑 Códigos de acceso generados para rifas privadas existentes');
console.log('🚀 Servidor corriendo en http://localhost:3000');
```

### Errores Comunes Fase 12

1. **Base de datos desactualizada**
   ```
   Error: no such column: access_code
   ```
   **Solución:** `npm run init-db`

2. **Código inválido**
   ```
   Error: Código de simulación no válido
   ```
   **Solución:** Verificar que el código tenga 6 caracteres

3. **Simulación no pública**
   ```
   Error: Simulación no encontrada o no es pública
   ```
   **Solución:** Usar código de acceso o verificar permisos

## 🔄 Flujo de Desarrollo Fase 12

### 1. Usuario Sin Autenticar
1. **Modo Demo:** Simula sorteos localmente
2. **Simulaciones Públicas:** Ve demostraciones del sistema
3. **Acceso por Código:** Puede participar en simulaciones privadas
4. **No puede:** Crear simulaciones propias

### 2. Usuario Autenticado
1. Se registra/loguea
2. **Dashboard Personal:** Gestiona simulaciones privadas
3. **Crear Simulaciones:** Genera códigos únicos automáticamente
4. **Compartir Códigos:** Fácil distribución a participantes
5. **Gestión Completa:** CRUD de simulaciones
6. **Sorteos:** Realizar sorteos oficiales

### 3. Participación en Simulaciones
#### Públicas (Sin código)
1. Selecciona simulación de la lista
2. Elige números disponibles
3. Confirma participación

#### Privadas (Con código)
1. Ingresa código de 6 caracteres
2. Accede a la simulación
3. Elige números disponibles
4. Confirma participación

## 🏛️ Cumplimiento Legal

### ❌ Eliminaciones (Normativa Argentina)
- Campo `price_per_number`
- Referencias a dinero o precios
- Transacciones monetarias

### ✅ Inclusiones (Cumplimiento)
- Avisos legales en todas las páginas
- Clarificación "simulación educativa"
- Sin valor monetario real
- Solo fines educativos

## 🚀 Deployment Fase 12

### Variables de Entorno Producción
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secreto_super_seguro_de_produccion_fase12
DB_PATH=./database/rifas.db
```

### Build para Producción
```cmd
npm install --production
npm run init-db  # Actualizar estructura DB
npm start
```

## 📝 Requisitos TalentoTech (Fase 12)

### ✅ Cumplimiento Actualizado
- [x] Sitio web con múltiples páginas (4 secciones principales)
- [x] Diseño responsivo mejorado
- [x] Formularios (CRUD completo + códigos)
- [x] Base de datos con tablas relacionadas (actualizada)
- [x] Conexión backend-frontend robusta
- [x] Autenticación de usuarios
- [x] Gestión de datos completa
- [x] **🆕 Sistema de códigos únicos**
- [x] **🆕 Cumplimiento legal argentino**
- [x] **🆕 Simulaciones públicas/privadas**

### 📊 Métricas del Proyecto Fase 12
- **Líneas de código:** ~3000+
- **Archivos:** 18+
- **Tablas DB:** 3 relacionadas (actualizadas)
- **Endpoints API:** 15 (3 nuevos)
- **Funcionalidades:** 25+
- **🆕 Códigos únicos:** Generación automática
- **🆕 Páginas:** 4 secciones navegables

## 🎯 Testing Fase 12

### Casos de Prueba Principales

1. **Crear simulación privada**
   - Login → Mi Perfil → Crear Simulación
   - Verificar código generado

2. **Acceso por código**
   - Copiar código → Acceder por Código → Participar

3. **Simulaciones públicas**
   - Sin login → Simulaciones Públicas → Participar

4. **Regenerar código**
   - Mi Perfil → Regenerar código → Verificar nuevo código

---

**Desarrollado para TalentoTech 2025 - Fase 12**  
**Versión:** 2.0  
**Tecnologías:** Node.js + Express + SQLite + JavaScript Vanilla  
**🆕 Características:** Códigos de acceso + Cumplimiento legal argentino
