@echo off
echo 🎊 EJECUTANDO DEMO CONTENT - FASE 15c
echo =====================================

cd /d "C:\Users\Clau\Desktop\TT_rifas_LIMPIA_LIMPIA\backend"

echo 🔍 Verificando estado actual...
call npm run verify

echo.
echo 🎁 Creando contenido demo...
call npm run demo-content

echo.
echo ✅ DEMO CONTENT COMPLETADO!
echo.
echo 🚀 Para iniciar el servidor:
echo    npm run dev
echo.
echo 🌐 URL: http://localhost:3000
echo.
pause