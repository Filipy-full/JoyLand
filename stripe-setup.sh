#!/bin/bash

# Script para configurar y probar Stripe en modo desarrollo

echo "🔧 Configurando Stripe para JoyLand..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sin color

# 1. Verificar variables de entorno
echo "📋 Verificando variables de entorno..."
if [ -f .env.local ]; then
    if grep -q "STRIPE_SECRET_KEY" .env.local && grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" .env.local; then
        echo -e "${GREEN}✓ Variables de Stripe configuradas${NC}"
    else
        echo -e "${YELLOW}⚠ Faltan variables de Stripe en .env.local${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Archivo .env.local no encontrado${NC}"
fi

echo ""

# 2. Información sobre webhook
echo "🔗 Para configurar el webhook de Stripe en desarrollo:"
echo ""
echo "Ejecuta en otra terminal:"
echo "  stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo "Esto te dará un WEBHOOK SECRET que debes agregar a .env.local:"
echo "  STRIPE_WEBHOOK_SECRET=whsec_..."
echo ""

# 3. Endpoints de Stripe en la app
echo "📍 Endpoints de Stripe configurados:"
echo "  • POST /api/create-checkout-session - Crear sesión de pago"
echo "  • POST /api/webhooks/stripe - Recibir eventos de Stripe"
echo ""

# 4. Probar conexión con Stripe
echo "🧪 Probando conexión con Stripe..."
if command -v stripe &> /dev/null; then
    stripe config --list 2>/dev/null | grep -E "device_name|test_mode" || echo "No autenticado con Stripe CLI"
else
    echo "Stripe CLI no instalado"
fi

echo ""
echo -e "${GREEN}✅ Configuración de Stripe lista${NC}"
echo ""
echo "Para iniciar el webhook en desarrollo, ejecuta:"
echo "  ./stripe-webhook.sh"
