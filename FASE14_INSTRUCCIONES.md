# 🔧 SOLUCIÓN: Botones "Ver" y "Editar" no funcionan

## 🚨 **PROBLEMA IDENTIFICADO**
Los botones "Ver" y "Editar" muestran "error de conexión" porque **el backend no está ejecutándose**.

## ⚡ **SOLUCIÓN RÁPIDA**

### **Opción 1: Automática (Recomendada)**
```bash
# Hacer doble click en este archivo:
FASE14_REPARAR_BOTONES.bat
```

### **Opción 2: Manual**
```bash
# En línea de comandos:
cd backend
npm install
node reparar_ver.js
npm run dev
```

## 📋 **QUÉ HACE LA REPARACIÓN**

1. ✅ **Verifica Node.js** - Que esté instalado
2. ✅ **Instala dependencias** - Express, SQLite, etc.
3. ✅ **Repara base de datos** - Estructura y datos
4. ✅ **Crea usuario demo** - demo/demo123
5. ✅ **Inicia servidor** - http://localhost:3000
6. ✅ **Restaura funcionalidad** - Botones "Ver" y "Editar"

## 🎯 **DESPUÉS DE LA REPARACIÓN**

1. **Abre navegador** en: `http://localhost:3000`
2. **Inicia sesión** con: `demo` / `demo123`
3. **Ve a "Mis Simulaciones"**
4. **Haz click en "Ver" o "Editar"** - ¡Debería funcionar!

## 🔍 **VERIFICAR QUE FUNCIONA**

- ✅ Servidor dice: "🚀 Servidor corriendo en http://localhost:3000"
- ✅ Página carga en navegador
- ✅ Puedes iniciar sesión
- ✅ Botones "Ver" y "Editar" no dan error
- ✅ Se abren las pantallas de detalles

## ⚠️ **SI AÚN NO FUNCIONA**

1. **Verifica que Node.js esté instalado**: `node --version`
2. **Reinicia desde cero**: Ejecuta `FASE14_REPARAR_BOTONES.bat` de nuevo
3. **Revisa la consola**: ¿Hay errores en rojo?
4. **Puerto ocupado**: ¿Hay otro proceso en puerto 3000?

## 📞 **SIGUIENTE FASE**

Una vez que los botones funcionen:
- ✅ **FASE 14 COMPLETADA**: Botones "Ver" y "Editar" funcionan
- 🎯 **FASE 15**: Agregar contenido demo para usuarios sin login
- 🚀 **FASE 16**: Restructurar arquitectura MVC

---
*Documento creado para FASE 14 - Reparación Crítica*  
*TalentoTech - SimulaRifas - Julio 2025*
