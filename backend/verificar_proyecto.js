const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO CONFIGURACIÓN DEL PROYECTO...\n');

// Verificar estructura de archivos
const checks = [
    { file: '../public/index.html', desc: 'HTML principal' },
    { file: '../public/css/styles.css', desc: 'Estilos CSS' },
    { file: '../public/js/app.js', desc: 'JavaScript principal' },
    { file: '../public/js/rifas.js', desc: 'JavaScript rifas' }
];

let allOk = true;

checks.forEach(check => {
    const fullPath = path.join(__dirname, check.file);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        console.log(`✅ ${check.desc}: ${check.file} (${stats.size} bytes)`);
    } else {
        console.log(`❌ ${check.desc}: ${check.file} - NO ENCONTRADO`);
        allOk = false;
    }
});

console.log('\n🔧 VERIFICANDO CONFIGURACIÓN DEL SERVIDOR...\n');

// Verificar configuración de app.js
const appJsPath = path.join(__dirname, 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

if (appJsContent.includes("path.join(__dirname, '../public')")) {
    console.log('✅ Rutas estáticas: Configuradas correctamente para ../public');
} else {
    console.log('❌ Rutas estáticas: NECESITAN ACTUALIZACIÓN');
    allOk = false;
}

if (appJsContent.includes("'../public/index.html'")) {
    console.log('✅ Ruta principal: Configurada correctamente para ../public/index.html');
} else {
    console.log('❌ Ruta principal: NECESITA ACTUALIZACIÓN');
    allOk = false;
}

console.log('\n' + '='.repeat(50));

if (allOk) {
    console.log('🎉 ¡TODO CORRECTO! El proyecto está listo para funcionar.');
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('1. Ejecutar: npm run dev');
    console.log('2. Ir a: http://localhost:3000');
    console.log('3. Verificar que la aplicación carga correctamente');
} else {
    console.log('⚠️  HAY PROBLEMAS QUE RESOLVER.');
    console.log('Revisa los errores marcados arriba.');
}

console.log('\n🚀 Para iniciar el servidor: npm run dev');
