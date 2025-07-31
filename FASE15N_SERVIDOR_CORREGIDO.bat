@echo off
title FASE 15N - Reiniciar Servidor con Correccion
color 0A

echo.
echo ===============================================
echo    FASE 15N: REINICIAR SERVIDOR CORREGIDO
echo ===============================================
echo.
echo La correccion de la ruta /participate ha sido aplicada.
echo Ahora necesitas reiniciar el servidor para que tome efecto.
echo.
echo ===============================================
echo.

cd backend

echo [1/3] Deteniendo servidor anterior (si existe)...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo [2/3] Limpiando procesos...
timeout /t 1 >nul

echo [3/3] Iniciando servidor con la correccion aplicada...
echo.
echo ===============================================
echo    SERVIDOR INICIADO CON CORRECCION
echo ===============================================
echo.
echo ^> Backend corriendo en: http://localhost:3000
echo ^> Frontend disponible en: http://localhost:3000
echo ^> Ruta corregida: POST /api/rifas/:id/participate
echo.
echo ===============================================
echo    COMO PROBAR LA CORRECCION
echo ===============================================
echo.
echo 1. Abrir navegador en: http://localhost:3000
echo 2. Ir a "Acceder por Codigo"
echo 3. Usar un codigo de simulacion valido
echo 4. Seleccionar numeros y hacer clic en "Participar"
echo 5. Verificar que NO aparezca error 404
echo.
echo Para detener el servidor: Ctrl+C
echo.

npm run dev