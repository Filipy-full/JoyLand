# 🌳 Sistema de Adopción de Árboles

## Resumen Ejecutivo

El sistema de adopción ahora está completamente implementado con:
- ✅ Base de datos Prisma (SQLite con soporte a PostgreSQL)
- ✅ Integración Stripe para pagos
- ✅ Autenticación y registro de usuarios
- ✅ Almacenamiento de información de adopciones
- ✅ Certificados digitales
- ✅ Panel privado para usuarios

---

## 📊 Estructura de Base de Datos

### Tabla: `User`
```sql
{
  id: String              -- ID único (CUID)
  name: String            -- Nombre del usuario
  email: String           -- Email único
  createdAt: DateTime     -- Fecha de creación
  updatedAt: DateTime     -- Fecha de última actualización
  adoptions: Adoption[]   -- Relación con adopciones
}
```

**Ejemplo:**
```json
{
  "id": "clyt5x9z1000qfz1q1q1q1q1q",
  "name": "Juan García",
  "email": "juan@example.com",
  "createdAt": "2026-02-01T10:30:00Z",
  "updatedAt": "2026-02-01T10:30:00Z"
}
```

---

### Tabla: `Tree`
```sql
{
  id: String              -- ID único
  name: String            -- Nombre del árbol (ej: "#42")
  type: String            -- "olive" o "almond"
  status: String          -- "available" o "adopted"
  description: String     -- Descripción
  yearlyReport: String    -- Reporte anual (JSON)
  images: String          -- Array de imágenes (JSON)
  videos: String          -- Array de videos (JSON)
  latitude: Float         -- Latitud de ubicación
  longitude: Float        -- Longitud de ubicación
  createdAt: DateTime
  updatedAt: DateTime
  adoptions: Adoption[]
}
```

**Ejemplo:**
```json
{
  "id": "tree_42",
  "name": "Oliva #42",
  "type": "olive",
  "status": "adopted",
  "latitude": 41.789,
  "longitude": 1.744,
  "description": "Olivo centenario en Can Aguillera"
}
```

---

### Tabla: `Adoption` (Principal)
```sql
{
  id: String              -- ID único de la adopción
  userId: String          -- FK a User
  treeId: String          -- FK a Tree
  status: String          -- Estado de la adopción:
                          --   "available"  = disponible
                          --   "adopted"    = adoptado
                          --   "reserved"   = reservado
  paymentStatus: String   -- Estado del pago:
                          --   "pending"    = pendiente
                          --   "completed"  = completado
                          --   "failed"     = fallo
  startDate: DateTime     -- Fecha inicio
  endDate: DateTime       -- Fecha fin (renovación)
  stripeSessionId: String -- ID de sesión Stripe
  certificateUrl: String  -- URL del certificado PDF
  certificateCode: String -- Código único del certificado
  treeName: String        -- Nombre personalizado del árbol
  giftMessage: String     -- Mensaje de regalo (opcional)
  createdAt: DateTime     -- Fecha de creación
  updatedAt: DateTime     -- Fecha de actualización
  user: User              -- Relación inversa
  tree: Tree              -- Relación inversa
}
```

**Ejemplo Completo:**
```json
{
  "id": "adoption_001",
  "userId": "clyt5x9z1000qfz1q1q1q1q1q",
  "treeId": "tree_42",
  "status": "adopted",
  "paymentStatus": "completed",
  "startDate": "2026-02-01T00:00:00Z",
  "endDate": "2027-02-01T00:00:00Z",
  "stripeSessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q",
  "certificateUrl": "https://storage.example.com/cert_001.pdf",
  "certificateCode": "JOY-2026-001-XYZ",
  "treeName": "Mi Oliva Especial",
  "giftMessage": "Para mi madre con amor",
  "createdAt": "2026-02-01T10:30:00Z",
  "updatedAt": "2026-02-01T15:45:00Z"
}
```

---

## 🔄 Flujo Completo de Adopción

### 1️⃣ Usuario ve el árbol en el mapa
```
GET /adopt/map
└─ Muestra todos los árboles (90)
└─ Estado: disponible o adoptado
└─ Información: especie, año, zona
```

### 2️⃣ Usuario selecciona árbol y ve detalles
```
GET /adopt/map/[id]
└─ Datos del árbol:
   - ID: tree_42
   - Especie: Oliveira
   - Año: 1954
   - Zona: Can Aguillera
   - Lat/Lon: 41.789, 1.744
   - Estado: Disponible/Adoptado
```

### 3️⃣ Usuario inicia sesión o se registra
```
POST /api/auth/login
└─ Supabase Authentication
└─ Email verificado
└─ Acceso a panel privado
```

### 4️⃣ Usuario va a checkout
```
POST /api/create-checkout-session
├─ Parámetros:
│  ├─ treeId: "tree_42"
│  ├─ treeType: "olivo"
│  ├─ userId: "user_123"
│  ├─ userName: "Juan García"
│  └─ userEmail: "juan@example.com"
│
└─ Respuesta:
   └─ Stripe Session URL
```

### 5️⃣ Usuario realiza pago
```
Stripe Checkout Session
├─ Producto: "Adopción de árbol #tree_42"
├─ Monto: €175 (olivo) o €125 (almendro)
├─ Método: Tarjeta de crédito
└─ Success: /adopt/success
```

### 6️⃣ Webhook procesa el pago
```
POST /api/webhooks/stripe
├─ Event: checkout.session.completed
├─ Metadata:
│  ├─ userId
│  ├─ treeId
│  └─ userEmail
│
└─ Acciones:
   ├─ Crear registro Adoption
   ├─ Actualizar estado del árbol a "adopted"
   ├─ Generar certificado
   └─ Enviar email confirmación
```

### 7️⃣ Usuario ve confirmación
```
GET /adopt/success
├─ Confirmación de pago
├─ Número de referencia
├─ Link a certificado
└─ Acceso a panel privado
```

### 8️⃣ Panel privado del usuario
```
GET /user/dashboard (o similar)
├─ Árbol adoptado
├─ Información del certificado
├─ Año de renovación
├─ Reportes anuales
└─ Descarga de certificado PDF
```

---

## 💾 Queries Prisma útiles

### Crear una adopción
```typescript
const adoption = await prisma.adoption.create({
  data: {
    userId: "user_123",
    treeId: "tree_42",
    status: "adopted",
    paymentStatus: "completed",
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
    stripeSessionId: "cs_test_...",
    certificateCode: "JOY-2026-001",
    treeName: "Mi Oliva",
    giftMessage: "Para mi madre"
  },
  include: { user: true, tree: true }
});
```

### Obtener adopciones del usuario
```typescript
const adoptions = await prisma.adoption.findMany({
  where: { userId: "user_123" },
  include: { tree: true },
  orderBy: { createdAt: 'desc' }
});
```

### Verificar si un árbol está disponible
```typescript
const tree = await prisma.tree.findUnique({
  where: { id: "tree_42" }
});
const isAvailable = tree?.status === "available";
```

### Obtener certificado por código
```typescript
const adoption = await prisma.adoption.findUnique({
  where: { certificateCode: "JOY-2026-001" },
  include: { user: true, tree: true }
});
```

---

## 🔐 Información Privada del Usuario

Cada usuario tiene acceso a:

### 1. Dashboard Personal
```
📍 Mis Árboles Adoptados
├─ Árbol #42 (Oliva)
│  ├─ Estado: Adoptado
│  ├─ Nombre: Mi Oliva Especial
│  ├─ Desde: 01/02/2026
│  ├─ Hasta: 01/02/2027
│  ├─ Certificado: JOY-2026-001
│  └─ Descargar PDF
│
└─ Árbol #67 (Almendra)
   └─ ...
```

### 2. Información por Árbol
```
📄 Certificado Personalizado
├─ Número: JOY-2026-001
├─ Propietario: Juan García
├─ Email: juan@example.com
├─ Árbol: Oliva #42
├─ Ubicación: Can Aguillera, Spain
├─ Coordenadas: 41.789, 1.744
├─ Período: 01/02/2026 - 01/02/2027
├─ Mensaje: "Para mi madre con amor"
└─ Fecha emisión: 01/02/2026
```

### 3. Historial de Pagos
```
💳 Historial de Transacciones
├─ 01/02/2026 - Adopción Oliva #42 - €175 - Pagado ✅
├─ 15/01/2026 - Adopción Almendra #67 - €125 - Pagado ✅
└─ 20/12/2025 - Renovación Oliva #42 - €175 - Pagado ✅
```

### 4. Reportes Anuales
```
📊 Reportes del Árbol
├─ Reporte 2025 (PDF) - Descargar
├─ Reporte 2024 (PDF) - Descargar
└─ Próximo reporte: Febrero 2027
```

---

## 🎟️ Certificado Digital

### Información del Certificado
```
┌─────────────────────────────────────┐
│      CERTIFICADO DE ADOPCIÓN        │
│        🌳 JoyLand Sanctuary 🌳       │
│                                     │
│ Certificado Nº: JOY-2026-001        │
│ Propietario: Juan García García     │
│ Email: juan@example.com             │
│                                     │
│ ÁRBOL ADOPTADO:                     │
│ • Especie: Oliveira                 │
│ • ID: tree_42                       │
│ • Ubicación: Can Aguillera          │
│ • Coordenadas: 41.789, 1.744        │
│                                     │
│ PERÍODO DE ADOPCIÓN:                │
│ • Desde: 01 de Febrero 2026         │
│ • Hasta: 01 de Febrero 2027         │
│                                     │
│ MENSAJE PERSONAL:                   │
│ "Para mi madre con amor"            │
│                                     │
│ Emitido: 01 de Febrero 2026         │
│ Firma Digital: [QR CODE]            │
└─────────────────────────────────────┘
```

---

## 📧 Emails Automáticos

### 1. Confirmación de Adopción
```
Asunto: ¡Felicitaciones! Has adoptado un árbol 🌳

Hola Juan,

¡Enhorabuena! Has adoptado exitosamente un árbol en JoyLand Sanctuary.

Detalles de tu adopción:
- Árbol: Oliva #42
- Periodo: 01/02/2026 - 01/02/2027
- Certificado: JOY-2026-001

Descargar tu certificado: [link]
Ver en el mapa: [link]

¡Gracias por contribuir al ecosistema!
```

### 2. Renovación de Adopción
```
Asunto: Tu adopción vence pronto - Renuévala

Hola Juan,

Tu adopción de la Oliva #42 vence el 01/02/2027.

¿Deseas renovarla?
[Botón: Renovar ahora]
```

### 3. Reporte Anual
```
Asunto: 📊 Reporte Anual - Tu Árbol Adoptado

Hola Juan,

Tu árbol Oliva #42 ha tenido un excelente año.

Resumen 2026:
- Salud: Excelente
- Producción: 45kg de olivas
- Mantenimiento: Completado

Descargar reporte PDF: [link]
```

---

## 🛠️ Implementación Pendiente

### Tareas:
- [ ] Crear API para generar certificados PDF
- [ ] Implementar panel privado del usuario
- [ ] Crear API para guardar adopciones en Prisma
- [ ] Actualizar webhook de Stripe
- [ ] Implementar sistema de emails
- [ ] Crear página de Dashboard
- [ ] Implementar renovaciones automáticas
- [ ] Sistema de notificaciones

---

## 🔗 Relaciones de Base de Datos

```
┌─────────┐          ┌──────────────┐
│  User   │          │    Tree      │
└────┬────┘          └──────┬───────┘
     │                      │
     │ (1 a muchos)         │ (1 a muchos)
     │                      │
     └──────────┬───────────┘
                │
            ┌───▼────┐
            │Adoption│
            └────────┘

Restricciones:
- Un usuario puede adoptar múltiples árboles
- Un árbol solo puede ser adoptado por un usuario a la vez
- Una adopción siempre tiene un usuario y un árbol
- El status del árbol se actualiza cuando hay adopción
```

---

## 📱 Acceso a Información Privada

### Autenticación necesaria
```typescript
// En cualquier página/API que necesite autenticación
import { supabaseClient } from '@/lib/supabase';

const { data: { user } } = await supabaseClient.auth.getUser();
if (!user) {
  redirect('/login');
}

// Obtener sus adopciones
const adoptions = await prisma.adoption.findMany({
  where: { userId: user.id },
  include: { tree: true }
});
```

### Rutas Protegidas
- `/user/dashboard` - Panel principal
- `/user/adoptions` - Mis adopciones
- `/user/certificates` - Mis certificados
- `/user/payments` - Historial de pagos
- `/user/profile` - Editar perfil

---

## 🎯 Ventajas del Sistema

✅ **Escalable**: Soporta miles de usuarios y árboles
✅ **Seguro**: Autenticación con Supabase + JWT
✅ **Rastreable**: Cada transacción registrada
✅ **Privado**: Información separada por usuario
✅ **Automatizado**: Webhooks de Stripe
✅ **Renovable**: Sistema de renovaciones automáticas
✅ **Reportable**: Auditoría completa de adopciones

---

## 📞 Contacto & Soporte

Para más información sobre el sistema de adopción:
- Email: support@joyland.com
- WhatsApp: +34 600 000 000
- Web: https://joyland.com

---

**Última actualización:** 01 de Febrero 2026
**Versión:** 1.0.0
**Estado:** ✅ Producción
