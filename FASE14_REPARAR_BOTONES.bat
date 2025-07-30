@echo off
cls
echo.
echo ===============================================
echo 🔧 FASE 14: REPARACION CRITICA - BOTONES VER
echo ===============================================
echo.
echo 🎯 PROBLEMA: Botones "Editar" y "Ver" no funcionan
echo 🔧 SOLUCION: Inicializar backend y reparar BD
echo.

REM Cambiar al directorio del backend
cd /d "%~dp0\backend"

echo ⏳ 1/6 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js no está instalado
    echo 📥 Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js detectado
)

echo.
echo ⏳ 2/6 Instalando dependencias...
call npm install --silent

echo.
echo ⏳ 3/6 Reparando base de datos...
node reparar_ver.js

echo.
echo ⏳ 4/6 Verificando configuración...
node diagnostico_ver.js

echo.
echo ===============================================
echo 🚀 5/6 INICIANDO SERVIDOR BACKEND
echo ===============================================
echo.
echo 📌 URL: http://localhost:3000
echo 📌 Para DETENER: Ctrl+C
echo.
echo ✅ Una vez iniciado, abre tu navegador en:
echo    http://localhost:3000
echo.
echo ✅ Credenciales de prueba:
echo    Usuario: demo
echo    Contraseña: demo123
echo.
echo ✅ Los botones "Ver" y "Editar" deberían funcionar
echo.
echo ===============================================

REM Iniciar el servidor en modo desarrollo
call npm run dev
