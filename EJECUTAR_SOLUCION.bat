@echo off
color 0A
title SOLUCION FASE 15d - SimulaRifas

echo.
echo =========================================
echo   🎲 SIMULADOR RIFAS - SOLUCION FASE 15d
echo =========================================
echo.

cd /d "C:\Users\Clau\Desktop\TT_rifas_LIMPIA_LIMPIA\backend"

echo 📍 Directorio: %CD%
echo.

echo 🚀 Ejecutando solución completa...
echo.

node solucion_completa.js

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   ✅ ¡SOLUCION COMPLETADA EXITOSAMENTE!
    echo ========================================
    echo.
    echo 🎊 RIFAS PUBLICAS CREADAS:
    echo    📱 iPhone 15 Pro ^(12 participantes^)
    echo    👜 Cartera Premium ^(10 participantes^)
    echo    ✈️ Viaje Europa ^(16 participantes^)
    echo.
    echo 🌐 SIGUIENTE PASO:
    echo    1. Ejecutar: npm run dev
    echo    2. Ir a: http://localhost:3000
    echo    3. Hacer clic en "Simulaciones Públicas"
    echo.
    echo ❓ ¿Quieres iniciar el servidor ahora? ^(S/N^)
    set /p respuesta=
    if /i "%respuesta%"=="S" (
        echo.
        echo 🚀 Iniciando servidor...
        npm run dev
    ) else (
        echo.
        echo 📋 Para iniciar más tarde ejecuta: npm run dev
    )
) else (
    echo ❌ Error en la ejecución
    echo.
    echo 🔧 Intentando método alternativo...
    echo.
    node database\init.js
)

echo.
echo ⏸️ Presiona cualquier tecla para salir...
pause >nul
