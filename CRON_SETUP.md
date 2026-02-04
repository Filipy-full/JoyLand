# Configuración del Cron Job para Expiración de Adopciones

## Endpoint
`POST /api/cron/expire-adoptions`

## Autenticación
El endpoint requiere un header de autenticación:
```
Authorization: Bearer YOUR_CRON_SECRET
```

## Configuración en Vercel

### 1. Crear variable de entorno
En tu proyecto de Vercel, añade:
- `CRON_SECRET`: Un token seguro (ej: `cron_abc123xyz789`)

### 2. Crear archivo vercel.json
Añade esto en la raíz del proyecto:

```json
{
  "crons": [
    {
      "path": "/api/cron/expire-adoptions",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Esto ejecutará el cron todos los días a las 2:00 AM UTC.

### 3. Configurar en Vercel Dashboard
1. Ve a tu proyecto en Vercel
2. Settings → Cron Jobs
3. Vercel detectará automáticamente el archivo vercel.json
4. El cron se activará solo en producción

## Horarios alternativos

- **Diario a las 2 AM**: `0 2 * * *`
- **Cada 12 horas**: `0 */12 * * *`
- **Cada hora**: `0 * * * *`
- **Cada lunes a las 9 AM**: `0 9 * * 1`

## Testing manual

Puedes probar el endpoint manualmente:

```bash
curl -X POST https://joylandweb.com/api/cron/expire-adoptions \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

O desde tu navegador (en dev):
```
http://localhost:3000/api/cron/expire-adoptions
```

## Qué hace el cron

1. ✅ Busca adopciones con `end_date` pasado y `status = 'adopted'`
2. ✅ Cambia el estado del árbol a `available`
3. ✅ Cambia el estado de la adopción a `expired`
4. ✅ Envía email al usuario notificando la expiración
5. ✅ Envía recordatorio 7 días antes de expirar (una sola vez)

## Respuesta del endpoint

```json
{
  "success": true,
  "expired": 3,
  "treesFreed": 3,
  "emailsSent": 3,
  "errors": [],
  "timestamp": "2024-01-15T02:00:00.000Z"
}
```

## Monitoreo

Vercel te mostrará los logs de cada ejecución del cron en:
- Dashboard → Project → Deployments → Functions

## Alternativa: Cron externo

Si prefieres usar un servicio externo como cron-job.org:
1. Crea una cuenta en https://cron-job.org
2. Añade un nuevo job:
   - URL: `https://joylandweb.com/api/cron/expire-adoptions`
   - Schedule: Diario a las 2 AM
   - Headers: `Authorization: Bearer YOUR_CRON_SECRET`

## Variables de entorno necesarias

Asegúrate de tener en Vercel:
- ✅ `CRON_SECRET`
- ✅ `RESEND_API_KEY`
- ✅ `RESEND_FROM` (ej: `JoyLand <no-reply@tudominio.com>`)
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_KEY`
