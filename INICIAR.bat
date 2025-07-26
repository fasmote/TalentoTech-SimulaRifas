@echo off
echo ========================================
echo  SIMULADOR DE RIFAS - TALENTOTECH FASE 12
echo ========================================
echo.

REM Verificar si estamos en la carpeta correcta
if not exist "backend\package.json" (
    echo ❌ Error: No se encuentra el archivo package.json
    echo    Asegurate de ejecutar este script desde la carpeta TT_rifas_LIMPIA_LIMPIA
    pause
    exit /b 1
)

echo 📂 Cambiando al directorio backend...
cd backend

echo.
echo 📦 Verificando dependencias...
if not exist "node_modules" (
    echo 📥 Instalando dependencias de Node.js...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo 🗄️ Verificando/Actualizando base de datos (Fase 12)...
echo 🔨 Ejecutando actualización de estructura para Fase 12...
npm run init-db
if %errorlevel% neq 0 (
    echo ❌ Error inicializando/actualizando base de datos
    pause
    exit /b 1
) else (
    echo ✅ Base de datos actualizada para Fase 12
)

echo.
echo 🚀 Iniciando servidor de desarrollo...
echo.
echo ✅ Todo listo! El servidor Fase 12 se ejecutará en:
echo    👉 http://localhost:3000
echo.
echo 📋 Usuario de prueba disponible:
echo    - admin / 123456 (admin@talentotech.com)
echo.
echo 🆕 NOVEDADES FASE 12:
echo    🔑 Sistema de códigos de acceso únicos
echo    🏛️ Cumplimiento legal argentino (sin precios)
echo    🌐 Simulaciones públicas vs privadas
echo    📱 Navegación mejorada con 4 secciones
echo.
echo 📍 SECCIONES DISPONIBLES:
echo    🎯 Inicio - Simulador demo
echo    🎊 Simulaciones Públicas - Ejemplos para practicar
echo    🔑 Acceder por Código - Simulaciones privadas
echo    👤 Mi Perfil - Crear y gestionar simulaciones (requiere login)
echo.
echo ⏹️  Para detener el servidor: Ctrl + C
echo.

npm run dev
