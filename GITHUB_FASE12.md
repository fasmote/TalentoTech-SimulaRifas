# 🚀 Instrucciones para Subir Fase 12 a GitHub

## Pasos para crear y subir la rama `fase12`

### 1. Preparar el repositorio (si es primera vez)

Si aún no has inicializado Git en tu proyecto:

```bash
# Navegar al directorio del proyecto
cd C:\Users\Clau\Desktop\TT_rifas_LIMPIA_LIMPIA

# Inicializar Git
git init

# Agregar el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/fasmote/TalentoTech-SimulaRifas.git
```

### 2. Verificar estado actual

```bash
# Ver archivos modificados
git status

# Ver diferencias
git diff
```

### 3. Crear y cambiar a la nueva rama fase12

```bash
# Crear nueva rama desde la rama actual
git checkout -b fase12

# Verificar que estás en la rama correcta
git branch
```

### 4. Agregar todos los cambios de Fase 12

```bash
# Agregar todos los archivos modificados
git add .

# Verificar que se agregaron correctamente
git status
```

### 5. Hacer commit con los cambios

```bash
git commit -m "Fase 12: Implementación de códigos de acceso y cumplimiento legal

- Eliminado campo price_per_number (cumplimiento normativa argentina)
- Agregado sistema de códigos de acceso únicos (6 caracteres)
- Separación entre simulaciones públicas y privadas
- Nueva página de acceso por código
- Actualizada base de datos con campos access_code e is_public
- Mejoradas rutas del backend para manejar códigos
- Actualizado frontend con nueva navegación y funcionalidades
- Agregados avisos legales en toda la aplicación
- Funcionalidad de regenerar códigos de acceso
- Copia de códigos al portapapeles
- Documentación actualizada para Fase 12"
```

### 6. Subir la nueva rama a GitHub

```bash
# Subir la rama fase12 por primera vez
git push -u origin fase12
```

### 7. Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Verifica que aparezca la nueva rama `fase12`
3. Comprueba que todos los archivos estén actualizados

## 🔄 Para futuras actualizaciones en fase12

```bash
# Cambiar a la rama fase12 (si no estás ya)
git checkout fase12

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir cambios
git push origin fase12
```

## 📋 Archivos principales modificados en Fase 12

✅ `backend/database/init.js` - Actualizada estructura DB
✅ `backend/routes/rifas.js` - Nuevas rutas para códigos
✅ `frontend/index.html` - Interfaz completa actualizada
✅ `README.md` - Documentación Fase 12
✅ Este archivo de instrucciones

## 🎯 Funcionalidades implementadas

- [x] Eliminación de campo precio (cumplimiento legal)
- [x] Sistema de códigos de acceso únicos
- [x] Simulaciones públicas vs privadas
- [x] Página dedicada para códigos
- [x] Regeneración de códigos
- [x] Copia de códigos al portapapeles
- [x] Avisos legales en toda la app
- [x] Navegación mejorada
- [x] Documentación actualizada

## 🔗 Enlaces útiles

- **Repositorio**: https://github.com/fasmote/TalentoTech-SimulaRifas.git
- **Rama principal**: `main`
- **Rama Fase 12**: `fase12`

## ⚠️ Notas importantes

1. **Backup**: Asegúrate de tener backup en Google Drive
2. **Base de datos**: Ejecutar `npm run init-db` para actualizar estructura
3. **Testing**: Probar todas las funcionalidades antes del push
4. **Documentación**: README.md actualizado con todos los cambios

---

**¡Fase 12 lista para GitHub! 🎉**
