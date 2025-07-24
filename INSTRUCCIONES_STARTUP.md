# 🚀 Instrucciones para Iniciar la Aplicación

## Paso 1: Verificar Dependencias

```bash
cd C:\Users\claud\OneDrive\Desktop\_bakcup_talentotechrifas\talentotech-simularifas\TalentoTech-SimulaRifas\backend
npm install
```

## Paso 2: Iniciar el Servidor Backend

```bash
# Desde la carpeta backend
npm run dev
```

**El servidor debe iniciarse en:** `http://localhost:3000`

## Paso 3: Abrir la Aplicación

Abre tu navegador y ve a: `http://localhost:3000`

## 🧪 Cómo Probar la Funcionalidad

### Test 1: Verificar Backend
1. Ve a `http://localhost:3000/api/test`
2. Deberías ver un JSON con el mensaje de éxito

### Test 2: Registro de Usuario
1. En la aplicación web, haz clic en "👤 Iniciar Sesión"
2. Haz clic en "Crear Cuenta"
3. Completa el formulario:
   - **Usuario:** `estudiante1`
   - **Email:** `estudiante1@test.com`
   - **Contraseña:** `1234`
4. El registro debe ser exitoso y quedar logueado automáticamente

### Test 3: Crear Rifa
1. Ve a "Mi Perfil" (solo aparece cuando estás logueado)
2. En el formulario "Crear Nueva Rifa":
   - **Título:** `Mi Primera Rifa TT`
   - **Descripción:** `Rifa de prueba para Talento Tech`
   - **Precio:** `5.50` (opcional)
3. Haz clic en "Crear Rifa"
4. ✅ **La rifa debe aparecer inmediatamente en tu lista**

### Test 4: Verificar Persistencia
1. Cierra sesión
2. Cierra el navegador
3. Vuelve a abrir y loguearte
4. ✅ **Tus rifas creadas deben seguir ahí**

### Test 5: Editar/Eliminar Rifas
1. En tu perfil, en la rifa creada:
2. Haz clic en "✏️ Editar" → Cambia el título
3. Haz clic en "🗑️ Eliminar" → Confirma la eliminación
4. ✅ **Los cambios deben persistir en la base de datos**

## 🔍 Verificar Base de Datos

La base de datos SQLite se crea automáticamente en:
```
backend/database/rifas.db
```

Puedes usar cualquier visor de SQLite para ver los datos guardados.

## 🐛 Solución de Problemas

### Error: "Error conectando al servidor"
- ✅ Verifica que el backend esté ejecutándose en `http://localhost:3000`
- ✅ Revisa la consola del navegador (F12) para ver errores específicos

### Error: JWT_SECRET no configurado
- ✅ Asegúrate de tener el archivo `.env` en la carpeta `backend`
- ✅ Debe contener: `JWT_SECRET=tu_secreto_super_seguro_aqui`

### Error: Base de datos no se crea
- ✅ Verifica permisos de escritura en la carpeta `backend/database`
- ✅ El archivo `rifas.db` se crea automáticamente al primer uso

## 📊 Endpoints de API Disponibles

- `GET /api/test` - Prueba del servidor
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/rifas/my` - Mis rifas (requiere autenticación)
- `POST /api/rifas` - Crear rifa (requiere autenticación)
- `PUT /api/rifas/:id` - Editar rifa (requiere autenticación)
- `DELETE /api/rifas/:id` - Eliminar rifa (requiere autenticación)

## ✅ Funcionamiento Esperado

✅ **Usuarios no logueados:** Pueden usar el simulador de números
✅ **Usuarios logueados:** Pueden crear, editar y eliminar rifas
✅ **Persistencia:** Las rifas se guardan en la base de datos SQLite
✅ **Autenticación:** JWT tokens para mantener la sesión
✅ **Seguridad:** Cada usuario solo puede ver/editar sus propias rifas

---

**¡Tu proyecto Talento Tech NODE.JS está completo y funcionando!** 🎉
