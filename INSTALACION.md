# 🚀 INSTRUCCIONES DE INSTALACIÓN

## Pasos Rápidos para Empezar

### 1. Navegar al Backend
```cmd
cd backend
```

### 2. Instalar Dependencias
```cmd
npm install
```

### 3. Inicializar Base de Datos
```cmd
npm run init-db
```

### 4. Ejecutar el Servidor
```cmd
npm run dev
```

### 5. Abrir en el Navegador
Ir a: http://localhost:3000

## 👤 Usuario de Prueba
- **Usuario:** admin
- **Contraseña:** 123456

## ✅ Verificación
Si todo está bien verás:
- ✅ Mensaje: "Servidor corriendo en http://localhost:3000"
- ✅ Mensaje: "Conectado a la base de datos SQLite"
- ✅ La página web carga correctamente

## 🔄 Para Sincronizar entre PCs
1. Mueve toda la carpeta `TT_rifas_LIMPIA_LIMPIA` a Google Drive
2. En la otra PC, sincroniza desde Google Drive
3. Ejecuta los mismos pasos

## 🐛 Si hay Problemas
1. **Error de dependencias:** Elimina `node_modules` y ejecuta `npm install` de nuevo
2. **Error de puerto:** Cambiar puerto en `.env` (PORT=3001)
3. **Error de base de datos:** Elimina `database/rifas.db` y ejecuta `npm run init-db`

## 📁 Estructura Creada
```
TT_rifas_LIMPIA_LIMPIA/
├── backend/          ← Node.js + Express + SQLite
├── frontend/         ← HTML + CSS + JavaScript
└── README.md         ← Documentación completa
```

¡Listo para desarrollar! 🎉
