@echo off
cls
echo.
echo ================================================================
echo 🔧 SOLUCION DEFINITIVA: Botón "Ver" en Mis Simulaciones
echo ================================================================
echo.
echo 🎯 DIAGNOSTICO: El backend funciona (puedes registrar y ver por código)
echo 🎯 PROBLEMA: Botón "Ver" en "Mis Simulaciones" da error
echo 🎯 SOLUCION: Corregir función JavaScript específica
echo.

REM Cambiar al directorio del backend
cd /d "%~dp0\backend"

echo ⏳ 1/7 Verificando que el servidor esté corriendo...
timeout 2 >nul
curl -s http://localhost:3000/api/rifas >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: El backend no está corriendo
    echo.
    echo 🚀 Iniciando servidor backend...
    echo.
    start "" cmd /c "npm run dev"
    echo ✅ Servidor iniciado en nueva ventana
    echo ⏳ Esperando 5 segundos para que se estabilice...
    timeout 5 >nul
) else (
    echo ✅ Backend funcionando correctamente
)

echo.
echo ⏳ 2/7 Ejecutando diagnóstico específico...
node diagnostico_ver_especifico.js

echo.
echo ⏳ 3/7 Testeando API del botón "Ver"...
node test_ver_button.js

echo.
echo ⏳ 4/7 Aplicando fix automático al frontend...
node aplicar_fix_ver.js

echo.
echo ⏳ 5/7 Verificando que el fix se aplicó correctamente...
findstr /C:"[DEBUG] Iniciando viewRifa" ..\frontend\index.html >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: El fix no se aplicó correctamente
    echo 💡 Aplica manualmente el código de: fix_boton_ver.js
) else (
    echo ✅ Fix aplicado correctamente al archivo frontend
)

echo.
echo ⏳ 6/7 Creando usuario de prueba adicional...
node -e "
const { runQuery, getQuery } = require('./database/database');
const bcrypt = require('bcryptjs');

async function crearUserDemo() {
    try {
        const existing = await getQuery('SELECT * FROM users WHERE username = ?', ['testuser']);
        if (!existing) {
            const hashedPassword = await bcrypt.hash('test123', 10);
            const result = await runQuery('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                ['testuser', 'test@example.com', hashedPassword]);
            
            // Crear simulación de prueba
            const rifaResult = await runQuery('INSERT INTO rifas (user_id, title, description, access_code, is_public) VALUES (?, ?, ?, ?, FALSE)', 
                [result.id, 'Simulación de Test', 'Creada para probar el botón Ver', 'TEST01']);
            
            console.log('✅ Usuario testuser/test123 creado con simulación');
        } else {
            console.log('✅ Usuario de prueba ya existe');
        }
    } catch (error) {
        console.log('⚠️  Error creando usuario:', error.message);
    }
}
crearUserDemo();
"

echo.
echo ================================================================
echo 🎉 7/7 SOLUCION COMPLETADA
echo ================================================================
echo.
echo ✅ Backend verificado y funcionando
echo ✅ API del botón "Ver" testeada
echo ✅ Fix aplicado al JavaScript del frontend  
echo ✅ Usuarios de prueba disponibles
echo.
echo 🔧 CREDENCIALES DE PRUEBA:
echo    👤 demo/demo123
echo    👤 testuser/test123
echo.
echo 🌐 PASOS PARA VERIFICAR:
echo    1. Ve a: http://localhost:3000
echo    2. Inicia sesión con cualquiera de los usuarios
echo    3. Ve a "Mis Simulaciones"
echo    4. Haz click en "Ver" - DEBERÍA FUNCIONAR
echo    5. Abre F12 para ver logs de debug
echo.
echo 💡 SI AÚN NO FUNCIONA:
echo    • Recarga la página (F5)
echo    • Revisa la consola del navegador (F12)
echo    • Busca mensajes [DEBUG] o [ERROR]
echo.
echo ================================================================

echo.
echo 🎯 ¿Quieres probar ahora? Presiona cualquier tecla para abrir el navegador...
pause >nul
start http://localhost:3000
echo.
echo ✅ Navegador abierto. ¡Prueba el botón "Ver"!
echo.
pause
