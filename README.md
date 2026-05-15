# quedamos.org

Plataforma web ética para centralizar la gestión de eventos y fomentar el encuentro social físico en Canarias.

**Project 3 · Ironhack Fullstack Bootcamp · Mayo 2026**

---

## Índice

- [Qué es quedamos.org](#qué-es-quedamosorg)
- [Demo](#demo)
- [Quick start](#quick-start)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Arquitectura](#arquitectura)
- [Base de datos](#base-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Tests](#tests)
- [Stack tecnológico](#stack-tecnológico)
- [Complicaciones y resoluciones](#complicaciones-y-resoluciones)
- [Resumen del uso de IA en el desarrollo](#resumen-del-uso-de-ia-en-el-desarrollo)
- [Tiempos de desarrollo](#tiempos-de-desarrollo)
- [Mejoras futuras](#mejoras-futuras)

---

## Qué es quedamos.org

quedamos.org forma parte de un proyecto social destinado a mejorar la calidad de vida de las personas a través de la reconstrucción del tejido social en Canarias. La plataforma facilita la gestión de eventos para entidades sociales al tiempo que ayuda a encontrar espacios de encuentro atendiendo a la diversidad de las personas — sin algoritmos, sin perfiles invasivos, sin dark patterns.

El MVP (Fase 1) cubre:

- Registro y login con roles diferenciados (`USER`, `ORGANIZER`, `ADMIN`)
- Descubrir y filtrar eventos por área, categoría y fecha
- Confirmar y cancelar asistencia a eventos
- Panel de organizador para publicar y gestionar eventos propios
- Panel de administración para gestión global de usuarios y eventos
- Notificación por email al confirmar asistencia (nodemailer)

**Qué NO hace el MVP:** no organiza ni asume responsabilidad por eventos, no construye perfiles con foto, no funciona como red social de consumo continuo, no recopila datos sensibles.

---

## Demo

| Servicio | URL |
|---------|-----|
| Frontend (Vercel) | _pendiente de deploy_ |
| API (Railway) | https://project-3-brief-quedamos-org-production.up.railway.app |

Credenciales de prueba:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| ADMIN | admin@quedamos.org | quedamos2026 |
| ORGANIZER | info@asociacion-el-timple.ic | org123 |
| USER | maria@example.ic | user123 |

---

## Quick start

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd Project-3-Brief-quedamos-org
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # editar con DATABASE_URL, JWT_SECRET, PORT
npx prisma migrate dev
npx prisma db seed
npm run dev            # arranca en http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm install
# crear .env con VITE_API_URL=http://localhost:3000
npm run dev            # arranca en http://localhost:5173
```

---

## Variables de entorno

**`backend/.env`**
```
DATABASE_URL="postgresql://user:pass@localhost:5432/quedamos_db"
JWT_SECRET="secreto-largo-y-aleatorio"
PORT=3000
EMAIL_USER="tu-cuenta@gmail.com"
EMAIL_PASS="contraseña-de-aplicacion"
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:3000
```

---

## Scripts disponibles

**Backend:**
```
npm run dev    # desarrollo con nodemon
npm start      # producción (migrate deploy + node server.js)
npm test       # tests con Vitest + Supertest
```

**Frontend:**
```
npm run dev    # desarrollo con Vite
npm run build  # build de producción
```

---

## Arquitectura

### Backend

```
Request
  → Routes (mapeo HTTP)
  → Middleware: verifyToken / requireRole / validate(schema)
  → Controller (lógica de negocio)
  → Prisma Client
  → PostgreSQL
  → errorHandler (P2002→409, P2025→404, resto→500)
```

### Frontend

**Rutas:**

| Ruta | Componente | Protección |
|------|-----------|-----------|
| `/` | Home | Pública |
| `/events/:id` | EventDetail | Pública (botón "voy" requiere auth) |
| `/login` | Login | Pública |
| `/register` | Register | Pública |
| `/dashboard` | Dashboard | Autenticado |
| `/events/new` | EventForm | ORGANIZER / ADMIN |
| `/events/:id/edit` | EventForm | ORGANIZER / ADMIN |
| `/admin` | Admin | Solo ADMIN |

**Estado global:** Context API — solo `AuthContext` en el MVP: usuario, token, login, logout, cargando.

**Hook principal:** `useApi` — encapsula fetch con token automático desde localStorage, estados `loading` y `error`.

---

## Base de datos

5 tablas: `User`, `Category`, `Tag`, `Event`, `Attendance`.

**User** — roles `USER`, `ORGANIZER`, `ADMIN`. Incluye arrays de preferencias y exclusiones para Fase 2.

**Event** — tabla central. Relacionada con `User` (organizador), `Category` y `Tag`. Campo `area` para zonas de Gran Canaria. `maxCapacity` nullable: si es `null`, el evento no tiene límite ni requiere inscripción previa.

**Attendance** — una fila por asistencia confirmada. Restricción `@@unique([userId, eventId])` para evitar duplicados.

**Category** — categorías de eventos con `slug` para filtrado y URLs.

**Tag** — etiquetas editoriales (many-to-many con Event). Distintas de `tags String[]` en Event, que son atributos funcionales con vocabulario controlado (`paid`, `free`, `indoor`, `outdoor`, `beginner_friendly`, `collaboration`).

### Roles

| Rol | Permisos |
|-----|----------|
| `USER` | Ver eventos, confirmar/cancelar asistencia |
| `ORGANIZER` | Todo lo de USER + crear/editar/borrar sus propios eventos |
| `ADMIN` | Todo + editar/borrar cualquier evento + panel de administración |

---

## Endpoints de la API

### Auth — `/api/auth`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registro |
| POST | `/api/auth/login` | No | Login. Devuelve JWT |

### Eventos — `/api/events`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/events` | No | Listar con filtros: `?area=`, `?categoryId=`, `?from=`, `?to=` |
| GET | `/api/events/areas` | No | Lista de áreas con eventos |
| GET | `/api/events/:id` | No | Detalle + count asistentes |
| GET | `/api/events/:id/attend` | Autenticado | Comprobar si el usuario asiste |
| POST | `/api/events` | ORGANIZER/ADMIN | Crear evento |
| PUT | `/api/events/:id` | Propietario/ADMIN | Editar evento |
| DELETE | `/api/events/:id` | Propietario/ADMIN | Borrar evento |
| POST | `/api/events/:id/attend` | Autenticado | Confirmar asistencia + envía email |
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

## Tests

```bash
cd backend
npm test
```

8 tests de integración con Vitest + Supertest:

| # | Test | Resultado esperado |
|---|------|-------------------|
| 1 | POST /api/auth/register con datos válidos | 201 |
| 2 | POST /api/auth/register con email duplicado | 409 |
| 3 | POST /api/auth/login con credenciales correctas | 200 + token |
| 4 | GET /api/events sin auth | 200 |
| 5 | POST /api/events sin token | 401 |
| 6 | POST /api/events con token de USER | 403 |
| 7 | POST /api/events con token de ORGANIZER | 201 |
| 8 | POST + DELETE /api/events/:id/attend | 201 y 200 |

Se optó por no seguir TDD: con 8 días de desarrollo y evaluación centrada en funcionalidad, los tests se escriben al final para verificar el comportamiento implementado, no para guiarlo.

---

## Stack tecnológico

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
| Autenticación | JWT — 7 días de expiración |
| Hash contraseñas | bcryptjs — 10 salt rounds |
| Validación backend | Zod |
| Tests | Vitest + Supertest |
| Integración externa | nodemailer (Gmail) |
| Deploy backend + BD | Railway (EU West) |
| Deploy frontend | Vercel |

---

## Complicaciones y resoluciones

**Prisma v7 incompatible con el stack del bootcamp.** La versión más reciente introdujo breaking changes. Solución: bajar a Prisma 5, estable con Node.js + Express en este contexto.

**Railway no tiene shell interactiva.** No es posible ejecutar comandos puntuales como seed o migraciones manuales. Solución: cambiar temporalmente el Custom Start Command del servicio, ejecutar y revertir.

**`dotenv` debe cargarse en `app.js`, no en `server.js`.** Los tests importan `app` directamente sin pasar por `server.js`. Si la carga está solo en `server.js`, los tests no leen las variables de entorno. Solución: mover `dotenv.config()` a `app.js`.

**`fileParallelism: false` en Vitest.** Dos suites compartiendo la misma BD generan condiciones de carrera. Solución: deshabilitar la ejecución paralela de archivos de test.

**Ordenación de rutas en Express.** `GET /events/areas` después de `GET /events/:id` hace que Express trate "areas" como un id. Solución: las rutas estáticas siempre antes que las dinámicas.

**`cqw` referenciando el viewport en lugar de `main`.** Sin un ancestro con `container-type`, `cqw` cae al viewport. Solución: añadir `container-type: inline-size` al elemento `main` en `index.css`.

---

## Resumen del uso de IA en el desarrollo

**Claude (claude-sonnet-4-6)** vía Claude Code CLI — par de programación durante todo el desarrollo. Daniel escribe todo el código; Claude explica conceptos, revisa errores, advierte sobre decisiones arquitectónicas y guía la resolución de bugs. El log completo de uso está en [ai_log.md](ai_log.md).

---

## Tiempos de desarrollo

| Día | Bloque | Estimado | Real |
|-----|--------|---------|------|
| 0 | Prework + Prebloques | — | 255 min |
| 1 | Setup + Auth backend | 275 min | 258 min |
| 2 | CRUD eventos + asistencias | 240 min | 195 min |
| 3 | Admin + integración + tests | 265 min | 126 min |
| 4 | Frontend setup + auth + rutas | 240 min | 321 min |
| 5 | Layout + componentes + deploy | 240 min | — |
| 6 | Páginas funcionales + recogida de cable | 240 min | — |
| 7 | CSS + responsive + polish | 240 min | — |
| 8 | Bugs + README + presentación | 300 min | — |
| **Total** | | **~2100 min (~35h)** | — |

---

## Mejoras futuras

### Backend

- [ ] Validar que `req.params.id` es numérico — `Number('abc')` devuelve `NaN` y el errorHandler responde 500 en lugar de 400.
- [ ] Sustituir Gmail por Resend o SendGrid en producción.
- [ ] Endpoint de reset de contraseña para admin (`POST /api/admin/users/:id/reset-password`).
- [ ] Filtrar usuarios por rol en el backend (`?role=USER`) en lugar de hacerlo en el frontend.

### Base de datos

- [ ] **Soft delete**: marcar usuarios como eliminados (`deletedAt`) en lugar de borrado en cascada, para preservar el historial de eventos y asistencias.
- [ ] Migrar `role` de campo único a relación many-to-many (Fase 2) para permitir que una persona sea USER y ORGANIZER simultáneamente.

### Frontend

- [ ] Páginas estáticas institucionales: `/sobre-el-proyecto`, `/privacidad`, `/contacto`, `/denuncias`, `/accesibilidad`, `/aviso-legal`.
- [ ] Página de perfil de usuario con gestión de preferencias (`preferredZones`, `preferredCategoryIds`, etc.) — Fase 2.
