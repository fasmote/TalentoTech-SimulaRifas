@echo off
echo.
echo ============================================
echo 🔧 SOLUCIONANDO PROBLEMA "VER SIMULACIONES"
echo ============================================
echo.

cd /d "%~dp0\backend"

echo ⏳ Paso 1: Instalando dependencias...
call npm install

echo.
echo ⏳ Paso 2: Inicializando base de datos...
call npm run init-db

echo.
echo ⏳ Paso 3: Agregando contenido demo...
call npm run demo-content

echo.
echo 🚀 Paso 4: Iniciando servidor backend...
echo.
echo 📌 El servidor se ejecutará en: http://localhost:3000
echo 📌 Para DETENER el servidor, presiona Ctrl+C
echo.
echo ✅ Una vez que veas "Servidor corriendo", abre otra ventana del navegador
echo ✅ Ve a: http://localhost:3000
echo ✅ Los botones "Ver" y "Editar" ahora deberían funcionar
echo.
echo ============================================

call npm run dev
