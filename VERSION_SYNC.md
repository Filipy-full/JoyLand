# Sincronización Cliente-Servidor

Este documento explica cómo tu aplicación JoyLand evita desajustes entre versiones del frontend y backend.

## 🔄 Cómo Funciona

### 1. **Versionado Centralizado**
- La versión única se define en `package.json`
- En cada build, se sincroniza automáticamente al archivo `.env.local`
- La variable `NEXT_PUBLIC_APP_VERSION` está disponible en el cliente

### 2. **Health Check Endpoint**
- `GET /api/health` - Retorna la versión del servidor
- Disponible en producción para validar sincronización

### 3. **Validación en Runtime**
- Función `checkVersionCompatibility()` en `lib/version-check.ts`
- Compara versiones del cliente y servidor
- Alerta si hay desajuste

## 📋 Pasos para Usar

### En tu aplicación:
```typescript
import { checkVersionCompatibility } from '@/lib/version-check';

// En un efecto o durante inicialización
const versionStatus = await checkVersionCompatibility();

if (versionStatus.status === 'mismatch') {
  console.warn('Versiones desincronizadas. Considera recargar la página.');
  // Opcionalmente, recarga automáticamente
}
```

## 🚀 Flujo de Deployment

```
1. Actualizar versión en package.json (v0.1.0 → v0.1.1)
2. Ejecutar: npm run build
3. Script version-check.js sincroniza a .env.local
4. NEXT_PUBLIC_APP_VERSION se inyecta en el cliente
5. Servidor usa la misma versión en /api/health
6. Desplegar a Vercel
```

## ⚙️ Configuración en Vercel

Agrega esta variable en tu dashboard de Vercel:
- **Variable**: No es necesaria en Vercel (se genera en build)
- **Recomendación**: Usa la versión en `package.json` como fuente de verdad

## ✅ Checklist

- [x] Endpoint `/api/health` creado
- [x] Script de sincronización de versiones
- [x] Utilidad de validación cliente-servidor
- [x] Variables de entorno sincronizadas

## 🔍 Monitoreo

Para verificar que todo funciona:

```bash
# Localmente
curl http://localhost:3000/api/health

# En producción
curl https://tudominio.com/api/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "timestamp": "2026-01-27T10:30:00.000Z",
  "environment": "production"
}
```
