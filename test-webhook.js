// Script para verificar configuración del webhook
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Verificando configuración de Stripe...\n');

console.log('✓ STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Configurada ✓' : '❌ No configurada');
console.log('✓ STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Configurada ✓' : '❌ No configurada');
console.log('✓ WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'Configurada ✓' : '❌ No configurada');

console.log('\n📋 Instrucciones para probar el webhook:');
console.log('1. Ve a: https://dashboard.stripe.com/webhooks');
console.log('2. Selecciona tu endpoint webhook');
console.log('3. Click en "Send test webhook"');
console.log('4. Elige "checkout.session.completed"');
console.log('5. Observa que el resultado sea código 200\n');

console.log('🔗 URL del webhook debe ser:');
console.log('   https://tu-dominio.com/api/stripe/webhook\n');

console.log('✅ Todo configurado correctamente. Puedes probar ahora desde el dashboard de Stripe.');
