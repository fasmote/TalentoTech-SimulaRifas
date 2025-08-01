#!/bin/bash
# Script de limpieza para el proyecto TalentoTech - SimulaRifas

echo "🧹 LIMPIANDO PROYECTO TALENTOTECH - SIMULARIFAS"
echo "================================================"

# Crear carpeta temporal si no existe
mkdir -p temp_delete

# Archivos .bat innecesarios
echo "📁 Moviendo archivos .bat..."
mv EJECUTAR_SOLUCION.bat temp_delete/ 2>/dev/null
mv FASE14_REPARAR_BOTONES.bat temp_delete/ 2>/dev/null
mv FASE15N_SERVIDOR_CORREGIDO.bat temp_delete/ 2>/dev/null
mv FASE15N_VERIFICAR_CORRECCION.bat temp_delete/ 2>/dev/null
mv INICIAR.bat temp_delete/ 2>/dev/null
mv SOLUCION_DEFINITIVA.bat temp_delete/ 2>/dev/null
mv SOLUCION_DEFINITIVA_VER.bat temp_delete/ 2>/dev/null
mv SOLUCION_TOTAL.bat temp_delete/ 2>/dev/null
mv SOLUCION_VER_SIMULACIONES.bat temp_delete/ 2>/dev/null

# Archivos de desarrollo temporal
echo "📄 Moviendo archivos de desarrollo..."
mv CHANGELOG.md temp_delete/ 2>/dev/null
mv "estilo consistente de comentarios.txt" temp_delete/ 2>/dev/null
mv FASE12_COMPLETADA.md temp_delete/ 2>/dev/null
mv FASE14_COMPLETADA.md temp_delete/ 2>/dev/null
mv FASE14_INSTRUCCIONES.md temp_delete/ 2>/dev/null
mv FASE15D_COMPLETADA.md temp_delete/ 2>/dev/null
mv FASE15E_COMPLETADA.md temp_delete/ 2>/dev/null
mv fase15m.txt temp_delete/ 2>/dev/null
mv FASE15N_CORRECCION_PARTICIPATE.md temp_delete/ 2>/dev/null
mv FASE15N_FIX_PARTICIPATE.js temp_delete/ 2>/dev/null
mv FASE15P_BUG_SOLUCIONADO.md temp_delete/ 2>/dev/null

# Archivos JavaScript temporales
echo "⚙️ Moviendo scripts temporales..."
mv fix_boton_ver.js temp_delete/ 2>/dev/null
mv fix_everything.js temp_delete/ 2>/dev/null
mv FUNCION_VIEWRIFA_CORREGIDA.js temp_delete/ 2>/dev/null
mv SOLUCION_VIEWRIFA_FASE15i.js temp_delete/ 2>/dev/null

# Archivos de documentación temporal
echo "📝 Moviendo documentación temporal..."
mv GITHUB_FASE12.md temp_delete/ 2>/dev/null
mv INSTALACION.md temp_delete/ 2>/dev/null
mv INSTRUCCIONES_FINALES.md temp_delete/ 2>/dev/null
mv INSTRUCCIONES_FINALES_VER.md temp_delete/ 2>/dev/null
mv RESUMEN_EJECUTIVO.md temp_delete/ 2>/dev/null
mv RESUMEN_SOLUCION_VER.md temp_delete/ 2>/dev/null
mv SOLUCION_URGENTE.md temp_delete/ 2>/dev/null
mv "ultimos commits.txt" temp_delete/ 2>/dev/null
mv VERIFICACION_FASE12.md temp_delete/ 2>/dev/null

echo "✅ LIMPIEZA COMPLETADA"
echo "📁 Archivos movidos a: temp_delete/"
echo ""
echo "🗂️ ESTRUCTURA FINAL PARA GITHUB:"
echo "├── .env.example"
echo "├── .gitignore"
echo "├── README.md"
echo "├── PRODUCTO.md"
echo "├── plan_fases_talentotech.md"
echo "├── backend/"
echo "├── public/"
echo "│   ├── css/styles.css"
echo "│   ├── js/app.js"
echo "│   ├── js/rifas.js"
echo "│   └── index.html"
echo "└── temp_delete/ (temporal)"
echo ""
echo "🚀 Proyecto listo para GitHub!"
