@echo off
echo ===========================================
echo    FASE 15d - ACTIVAR RIFAS PUBLICAS
echo ===========================================
echo.

cd /d "C:\Users\Clau\Desktop\TT_rifas_LIMPIA_LIMPIA\backend"

echo 📍 Directorio actual: %CD%
echo.

echo 🔍 1. Verificando estado de la base de datos...
node verificar.js
echo.

echo 🎁 2. Ejecutando demo-content...
node database\demo-content.js
echo.

if %ERRORLEVEL% EQU 0 (
    echo ✅ DEMO CONTENT EJECUTADO EXITOSAMENTE!
    echo.
    echo 🎊 RIFAS PUBLICAS DISPONIBLES:
    echo    📱 iPhone 15 Pro
    echo    👜 Cartera de Mujer Premium  
    echo    ✈️ Viaje a Europa
    echo.
    echo 🌐 Ahora ve a: http://localhost:3000
    echo 📋 Y haz clic en "Simulaciones Públicas"
    echo.
) else (
    echo ❌ ERROR ejecutando demo-content
    echo.
    echo 🔧 Intentando inicializar primero...
    node database\init.js
    echo.
    echo 🎁 Reintentando demo-content...
    node database\demo-content.js
)

echo.
echo ⏸️ Presiona cualquier tecla para continuar...
pause >nul
