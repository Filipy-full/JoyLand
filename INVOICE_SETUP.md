# 📄 Configuración de Facturas Automáticas con Stripe

## Implementación Completada

He agregado la funcionalidad de creación automática de facturas en el webhook. 

## ¿Qué hace?

Después de completar un pago, el sistema automáticamente:

1. ✅ **Crea o busca un Customer en Stripe** con el email del usuario
2. ✅ **Genera una factura (Invoice)** con todos los árboles adoptados
3. ✅ **Finaliza la factura** y la marca como pagada
4. ✅ **Envía el PDF por email** al usuario automáticamente

## Cómo funciona

```typescript
// El código agregado al webhook hace:

1. Buscar customer existente por email
   - Si existe: usa ese customer
   - Si no existe: crea nuevo customer

2. Crear invoice con:
   - Descripción: "Adopción de X árbol(es) - JoyLand"
   - Customer email
   - Metadata con IDs de árboles

3. Agregar line items:
   - Por cada árbol: "Adopción de árbol '[nombre]'" - 200 EUR

4. Finalizar invoice:
   - Auto-finaliza y genera PDF
   - Marca como pagado (paid_out_of_band)
   - Stripe envía email con PDF automáticamente
```

## Activar en Stripe Dashboard

Para que funcione completamente, activa en Dashboard:

1. **Ve a**: https://dashboard.stripe.com/test/settings/emails
2. **Activa**: "Successful invoices" 
3. **Personaliza** el email con tu logo/marca

## Ver Facturas

Los usuarios pueden:
- Recibir el PDF por email automáticamente
- Descargar desde Stripe Dashboard
- Ver en tu panel de admin (si implementas)

## Datos en la Factura

Cada factura incluye:
- ✅ Número de factura único
- ✅ Fecha de emisión
- ✅ Nombre y email del cliente
- ✅ Desglose de items (cada árbol)
- ✅ Total con IVA (configurable)
- ✅ Logo de JoyLand (configurable en Dashboard)
- ✅ Información fiscal de tu empresa

## Configuración Fiscal (Importante)

Para facturas válidas en España/EU:

1. **Ve a**: https://dashboard.stripe.com/test/settings/company
2. **Completa**:
   - Nombre de empresa: "JoyLand Spain S.L." (o tu nombre legal)
   - CIF/NIF: Tu número fiscal
   - Dirección fiscal completa
   - Email de soporte

3. **Configura IVA** (si aplica):
   - Ve a: https://dashboard.stripe.com/test/settings/tax
   - Activa Tax calculation
   - Configura 21% IVA para España

## Testing

Para probar:

1. Haz una compra con tarjeta de prueba `4242 4242 4242 4242`
2. Revisa los logs del webhook - deberías ver:
   ```
   📄 Creating invoice in Stripe...
   ✅ Created new customer: cus_...
   ✅ Invoice created and sent: {
     invoiceId: 'in_...',
     invoiceNumber: 'ABC-1234',
     invoicePdf: 'https://...'
   }
   ```
3. Revisa tu email de prueba - recibirás el PDF
4. Ve a [Stripe Dashboard → Invoices](https://dashboard.stripe.com/test/invoices) para ver todas las facturas

## Personalizar Factura

Para agregar tu logo/marca:

1. **Ve a**: https://dashboard.stripe.com/test/settings/branding
2. **Sube**:
   - Logo de JoyLand
   - Colores corporativos (sage/amber)
   - Footer con información de contacto

3. **Nota al pie** personalizada:
   ```
   Gracias por adoptar un árbol con JoyLand.
   Tu contribución ayuda a preservar nuestros olivares y almendros centenarios.
   
   Para consultas: joylandspain@gmail.com
   Web: https://joyland.es
   ```

## Ventajas de Stripe Invoices

✅ **Cumplimiento fiscal**: Facturas válidas en UE
✅ **Almacenamiento**: Guardadas en Stripe Dashboard forever
✅ **Email automático**: Enviadas sin código adicional
✅ **Descarga**: Usuarios pueden descargar cuando quieran
✅ **Búsqueda**: Buscar por customer, número, fecha, etc.
✅ **Reportes**: Exportar facturas para contabilidad

## Próximos Pasos

1. ✅ **Activar emails en Dashboard**
2. ✅ **Configurar datos fiscales de tu empresa**
3. ✅ **Agregar logo/marca**
4. ⏳ **Probar con pago real**
5. ⏳ **Exportar facturas para contabilidad**

## API Endpoints Adicionales (Opcional)

Si quieres permitir que usuarios descarguen facturas desde tu app:

```typescript
// GET /api/user/invoices
// Lista todas las facturas del usuario

// GET /api/user/invoices/[id]
// Descarga PDF de factura específica
```

¿Necesitas implementar estos endpoints? 📊
