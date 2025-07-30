@echo off
color 0A
title SOLUCION DEFINITIVA - SimulaRifas Fase 15d

echo.
echo ============================================
echo   🎲 SOLUCION DEFINITIVA - FASE 15d
echo ============================================
echo.

cd /d "C:\Users\Clau\Desktop\TT_rifas_LIMPIA_LIMPIA\backend"

echo 📍 Directorio: %CD%
echo.

echo 🗄️ 1. Inicializando base de datos...
node solucion_completa.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Base de datos inicializada exitosamente!
    echo.
    echo 🚀 2. Iniciando servidor backend...
    echo.
    echo ⚠️  IMPORTANTE: 
    echo    NO abras index.html directamente
    echo    USA: http://localhost:3000
    echo.
    echo 🌐 El servidor se iniciará en 3 segundos...
    echo    Luego ve a: http://localhost:3000
    echo.
    timeout /t 3 /nobreak >nul
    
    echo 🔥 Iniciando servidor...
    npm run dev
) else (
    echo ❌ Error inicializando base de datos
    echo.
    echo 🔧 Intentando método alternativo...
    node database\init.js
    echo.
    echo 🚀 Iniciando servidor de todas formas...
    npm run dev
)
