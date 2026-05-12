# quedamos.org

Plataforma web ética para centralizar la gestión de eventos y fomentar el encuentro social físico en Canarias.

**Project 3 · Ironhack Fullstack Bootcamp · Mayo 2026**

---

## 1. Qué es quedamos.org

quedamos.org es una plataforma que permite a personas y entidades de Canarias descubrir, organizar y asistir a eventos presenciales no mercantiles. El proyecto responde a una necesidad real de reconstruir el tejido social mediante la participación activa en actividades locales.

El MVP (Fase 1) cubre:
- Registro y login con roles diferenciados (USER, ORGANIZER, ADMIN)
- Descubrir y filtrar eventos por área, categoría y fecha
- Confirmar y cancelar asistencia a eventos
- Panel de organización para publicar y gestionar eventos propios
- Panel de administración para gestión global
- Notificación por email al confirmar asistencia (nodemailer)

**Qué NO hace el MVP:** no organiza ni asume responsabilidad por eventos, no construye perfiles con foto, no funciona como red social de consumo continuo, no recopila datos sensibles.

---

## 2. Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Estado global | Context API |
| HTTP client | fetch nativo |
| Estilos | CSS Modules |
| Backend | Node.js + Express |
| ORM | Prisma 5 |
| Base de datos | PostgreSQL |
| Autenticación | JWT (jsonwebtoken) — 7 días de expiración |
| Hash contraseñas | bcryptjs — 10 salt rounds |
| Validación backend | Zod |
| Tests | Vitest + Supertest |
| Integración externa | nodemailer (Gmail / Resend en producción) |
| Deploy backend + BD | Railway |
| Deploy frontend | Vercel |

---

## 3. Estructura de la base de datos

4 tablas: `User`, `Category`, `Event`, `Attendance`.

### Modelos principales

**User** — gestiona personas registradas con tres roles posibles: `USER`, `ORGANIZER`, `ADMIN`.

**Event** — tabla central del sistema. Relacionada con `User` (organizador) y `Category`. Incluye campo `area` para zonas geográficas de Gran Canaria (municipios y zonas urbanas).

**Attendance** — registra una fila por persona inscrita a un evento. La combinación `userId + eventId` tiene restricción `@@unique` para evitar inscripciones duplicadas.

**Category** — tabla independiente para categorías de eventos (Cultura, Deporte, Música, etc.), cargada dinámicamente desde la API.

### Roles (MVP)

El sistema de roles es **único por persona**: al registrarse, cada persona elige entre `USER`, `ORGANIZER` o `ADMIN`.

| Rol | Permisos |
|-----|----------|
| `USER` | Ver eventos, confirmar/cancelar asistencia |
| `ORGANIZER` | Todo lo de USER + crear/editar/borrar sus propios eventos |
| `ADMIN` | Todo + editar/borrar cualquier evento + panel de administración |

El escenario de una persona que es a la vez participante habitual y organizadora ocasional queda pendiente para la Fase 2, donde se migraría `role` a una relación many-to-many. Prisma gestionaría esa migración sin rehacer la estructura base.

### Campo `imageUrl`

Campo opcional (`String?`) añadido al modelo `Event`. Existe en la BD pero su implementación en el frontend queda pendiente: se decidirá entre permitir solo URLs externas o integrar un servicio de almacenamiento (Cloudinary, S3).

---

## 4. Endpoints de la API

### Auth — `/api/auth`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registro. Body: name, email, password, role |
| POST | `/api/auth/login` | No | Login. Devuelve JWT |

### Eventos — `/api/events`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/events` | No | Listar con filtros: `?area=`, `?categoryId=`, `?from=` |
| GET | `/api/events/:id` | No | Detalle + count asistentes |
| POST | `/api/events` | ORGANIZER/ADMIN | Crear evento |
| PUT | `/api/events/:id` | Propietario/ADMIN | Editar evento |
| DELETE | `/api/events/:id` | Propietario/ADMIN | Borrar evento |
| POST | `/api/events/:id/attend` | Autenticado | Confirmar asistencia |
| DELETE | `/api/events/:id/attend` | Autenticado | Cancelar asistencia |

### Categorías — `/api/categories`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/categories` | No | Listar todas las categorías |

### Usuario actual — `/api/users`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/users/me/attendances` | Autenticado | Mis eventos confirmados |
| GET | `/api/users/me/events` | Autenticado | Mis eventos como organizador |

### Admin — `/api/admin`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/admin/users` | ADMIN | Listar todos los usuarios |
| GET | `/api/admin/events` | ADMIN | Listar todos los eventos |
| DELETE | `/api/admin/users/:id` | ADMIN | Borrar usuario |

---

## 5. Instalación local

```bash
# Clonar el repositorio
git clone <url-del-repo>

# Instalar dependencias del backend
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con DATABASE_URL, JWT_SECRET, PORT

# Ejecutar migraciones
npx prisma migrate dev

# Ejecutar seed de datos
npx prisma db seed

# Arrancar el servidor
npm run dev
```

```bash
# Instalar dependencias del frontend
cd frontend
npm install

# Configurar variable de entorno
cp .env.example .env
# Editar .env con VITE_API_URL=http://localhost:3000

# Arrancar el frontend
npm run dev
```

---

## 6. Tests

```bash
cd backend
npm test
```

8 tests de integración con Vitest + Supertest que cubren registro, login, CRUD de eventos con distintos roles y gestión de asistencias.

**Nota sobre metodología:** Se optó por no seguir TDD (Test Driven Development) por dos razones. Primera, el tiempo disponible es de 8 días y TDD ralentiza el desarrollo inicial mientras se asimila el flujo. Segunda, el brief evalúa que la API funciona correctamente, no la metodología de testing. Los tests se escriben al final del backend para verificar el comportamiento ya implementado, no para guiarlo.

---

## 7. Herramientas utilizadas

### Entorno de desarrollo
- **VSCodium** — editor de código
- **Postman** — pruebas manuales de la API durante el desarrollo
- **Prisma Studio** — exploración y verificación de datos en la BD

### Librerías y frameworks
- **Express** — framework HTTP para Node.js
- **Prisma 5** — ORM para PostgreSQL
- **Zod** — validación de schemas en el backend
- **bcryptjs** — hash de contraseñas
- **jsonwebtoken** — generación y verificación de JWT
- **Vitest + Supertest** — tests de integración

### IA
- **Claude (claude-sonnet-4-6)** vía Claude Code CLI — par de programación durante todo el desarrollo. Daniel escribe todo el código; Claude explica conceptos, revisa errores y guía decisiones arquitectónicas. El uso está documentado en detalle en [ai_log.md](ai_log.md).

---

## 8. Tiempos de desarrollo

Estimaciones calculadas asumiendo trabajo con asistencia de IA y proyecto de referencia.

| Día | Bloque | Estimado | Real |
|-----|--------|---------|------|
| 0 | Prework + Prebloques | ~~~     | 255 min |
| 1 | Setup + Auth backend | 275 min | 258 min |
| 2 | CRUD eventos + asistencias | 240 min | 195 min |
| 3 | Admin + integración + tests | 265 min | 126 min |
| 4 | Frontend setup + auth + rutas | 240 min | 321 min |
| 5 | Home + detalle + asistencia | 240 min | ___ |
| 6 | Paneles + responsive + polish | 240 min | ___ |
| 7 | Despliegue | 300 min | ___ |
| 8 | Bugs + README + presentación | 300 min | ___ |
| **Total** | | **~2100 min (~35h)** | ___ |

---

## 9. URLs de producción

| Servicio | URL |
|---------|-----|
| API (Railway) | https://project-3-brief-quedamos-org-production.up.railway.app |
| Frontend (Vercel) | _pendiente_ |

---

## 10. Mejoras futuras

### Backend

- [ ] Validar que `req.params.id` es numérico antes de pasarlo a Prisma — actualmente `Number('abc')` devuelve `NaN` y el errorHandler responde 500 en lugar de 400.
- [ ] Sustituir Gmail por Resend o SendGrid en producción para el envío de emails.
- [ ] Endpoint de reset de contraseña para admin (`POST /api/admin/users/:id/reset-password`) — actualmente no hay forma de recuperar acceso si se pierde la contraseña y el correo.
- [ ] Filtrar usuarios por rol en el backend (`GET /api/admin/users?role=USER`) en lugar de hacerlo en el frontend.
- [ ] Mostrar recuento de asistencias por persona usuaria en el panel de admin (`_count: { attendances: true }`).

### Base de datos

- [ ] **Soft delete / usuario fantasma**: en lugar de borrar usuarios en cascada, marcarlos como eliminados (`deletedAt`) y reasignar sus eventos y asistencias a un usuario especial "Persona eliminada". Así el historial de eventos se mantiene intacto.
- [ ] Migrar `role` de campo único a relación many-to-many para permitir que una misma persona sea USER y ORGANIZER a la vez (Fase 2).
- [ ] Añadir `onDelete: Cascade` en las relaciones de Attendance y Event para delegar el borrado en cascada a PostgreSQL en lugar de gestionarlo manualmente en los controladores.

### Frontend

- [ ] Implementar `imageUrl` en el formulario de eventos — decidir entre URL externa o integración con Cloudinary/S3.
- [ ] Redirigir al usuario tras login a la ruta de origen en lugar de siempre a `/dashboard` — mejor UX cuando se llega al login desde una ruta protegida.

### General

- [ ] Integrar Morgan para logging de peticiones HTTP en desarrollo.
- [ ] Añadir Helmet para cabeceras de seguridad HTTP.
