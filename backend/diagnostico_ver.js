const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('🔍 VERIFICANDO CONFIGURACIÓN DEL PROYECTO...\n');

// 1. Verificar estructura de archivos
console.log('📁 Verificando estructura de archivos:');
const requiredFiles = [
    'backend/app.js',
    'backend/package.json',
    'backend/.env',
    'backend/routes/rifas.js',
    'backend/routes/auth.js',
    'frontend/index.html'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - FALTA`);
    }
});

// 2. Verificar dependencias
console.log('\n📦 Verificando dependencias:');
try {
    const packageJson = require('./package.json');
    const requiredDeps = ['express', 'sqlite3', 'cors', 'jsonwebtoken', 'bcryptjs'];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies[dep]) {
            console.log(`✅ ${dep} v${packageJson.dependencies[dep]}`);
        } else {
            console.log(`❌ ${dep} - NO INSTALADO`);
        }
    });
} catch (error) {
    console.log('❌ Error leyendo package.json:', error.message);
}

// 3. Verificar variables de entorno
console.log('\n🔧 Verificando configuración:');
require('dotenv').config();
const envVars = ['PORT', 'JWT_SECRET', 'DB_PATH'];
envVars.forEach(variable => {
    if (process.env[variable]) {
        console.log(`✅ ${variable}: ${variable === 'JWT_SECRET' ? '[OCULTO]' : process.env[variable]}`);
    } else {
        console.log(`❌ ${variable} - NO CONFIGURADO`);
    }
});

// 4. Test de conexión básica
console.log('\n🌐 Testing básico del servidor:');
console.log('📌 Puerto configurado:', process.env.PORT || 3000);
console.log('📌 Base de datos:', process.env.DB_PATH || './database/rifas.db');

// 5. Instrucciones de solución
console.log('\n' + '='.repeat(50));
console.log('🚀 INSTRUCCIONES PARA SOLUCIONAR:');
console.log('='.repeat(50));
console.log('1. Ejecuta: SOLUCION_VER_SIMULACIONES.bat');
console.log('2. Espera a ver: "🚀 Servidor corriendo en http://localhost:3000"');
console.log('3. Abre tu navegador en: http://localhost:3000');
console.log('4. Los botones "Ver" y "Editar" deberían funcionar');
console.log('\n💡 Si hay errores, revisa que Node.js esté instalado');
console.log('💡 Versión recomendada: Node.js 16+ y npm 8+');
console.log('='.repeat(50));
