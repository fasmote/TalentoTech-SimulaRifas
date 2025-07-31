@echo off
echo.
echo =======================================================
echo    FASE 15N: CORRECCION RUTA PARTICIPATE
echo =======================================================
echo.
echo Ejecutando verificacion de la correccion...
echo.

node FASE15N_FIX_PARTICIPATE.js

echo.
echo =======================================================
echo    INSTRUCCIONES PARA PROBAR
echo =======================================================
echo.
echo 1. Si el backend NO esta corriendo:
echo    cd backend
echo    npm run dev
echo.
echo 2. Abrir el navegador en: http://localhost:3000
echo.
echo 3. Ir a "Acceder por Codigo"
echo.
echo 4. Ingresar un codigo de simulacion valido
echo.
echo 5. Seleccionar numeros y hacer clic en "Participar"
echo.
echo 6. Verificar que NO aparezca error 404
echo.
echo ¡La correccion deberia resolver el problema!
echo.
pause