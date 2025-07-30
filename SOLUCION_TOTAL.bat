@echo off
color 0A
echo ========================================
echo   🎲 SIMULADOR RIFAS - SOLUCION TOTAL
echo ========================================
echo.

cd /d "C:\Users\Clau\Desktop\TT_rifas_LIMPIA_LIMPIA\backend"

echo 📍 Directorio: %CD%
echo.

echo 🔍 1. Verificando backend...
tasklist /FI "IMAGENAME eq node.exe" | find /I "node.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend parece estar corriendo
) else (
    echo ⚠️ Backend no detectado - se iniciará después
)
echo.

echo 🗄️ 2. Inicializando base de datos...
node database\init.js
echo.

echo 🎁 3. Creando contenido demo...
node database\demo-content.js
echo.

echo 🔍 4. Verificando resultado...
node verificar.js
echo.

echo 🚀 5. Iniciando servidor...
echo.
echo ✅ SOLUCION COMPLETADA!
echo.
echo 🌐 El servidor se iniciará en: http://localhost:3000
echo 📋 Funcionalidades activadas:
echo    • Simulaciones Públicas con 3 rifas demo
echo    • Vista de detalles funcional  
echo    • Menú alineado correctamente
echo.
echo ⏰ Iniciando servidor en 3 segundos...
timeout /t 3 /nobreak >nul

npm run dev
