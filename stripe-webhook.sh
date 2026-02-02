#!/bin/bash

# Script para iniciar el webhook de Stripe en desarrollo

echo "🎧 Iniciando Stripe Webhook Listener..."
echo ""
echo "Este proceso reenviará los eventos de Stripe a tu servidor local"
echo "Mantén esta terminal abierta mientras desarrollas"
echo ""

# Verificar que el servidor esté corriendo
if ! curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "⚠️  Advertencia: El servidor Next.js no parece estar corriendo en localhost:3000"
    echo "   Inicia el servidor con: npm run dev"
    echo ""
fi

# Iniciar listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Si el comando falla
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error al iniciar el webhook listener"
    echo ""
    echo "Posibles soluciones:"
    echo "1. Autentícate con Stripe CLI: stripe login"
    echo "2. Verifica que Stripe CLI esté instalado: stripe --version"
    echo "3. Verifica tu conexión a internet"
fi
