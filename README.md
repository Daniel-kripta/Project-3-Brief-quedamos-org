# quedamos.org

Plataforma web ética para centralizar la gestión de eventos y fomentar el encuentro social físico en el contexto territorial de Canarias.

**Project 3 · Ironhack Fullstack Bootcamp · Mayo 2026**

---

## Índice

- [Qué es quedamos.org](#qué-es-quedamosorg)
- [Screenshots](#screenshots)
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
- [Backlog — Fase 2 y mejoras futuras](#backlog--fase-2-y-mejoras-futuras)

---

## Qué es quedamos.org

quedamos.org forma parte de un proyecto social destinado a mejorar la calidad de vida de las personas a través del fortalecimiento del tejido social. La plataforma facilita la gestión de eventos para entidades sociales y a particulares, al tiempo que ayuda a encontrar espacios de encuentro atendiendo a la diversidad de las personas — sin algoritmos, sin perfiles invasivos, sin dark patterns.

El MVP (Fase 1) corresponde a un proyecto de bootcamp y cubre:

- Registro y login con roles diferenciados (`USER`, `ORGANIZER`, `ADMIN`)
- Descubrir y filtrar eventos por área, categoría y fecha
- Confirmar y cancelar asistencia a eventos
- Panel de organizador para publicar y gestionar eventos propios
- Panel de administración para gestión global de usuarios y eventos
- Notificación por email al confirmar asistencia (nodemailer)

**Qué NO hace el MVP:** no organiza ni asume responsabilidad por eventos, no construye perfiles con foto, no funciona como red social de consumo continuo, no recopila datos sensibles.

Para la fundamentación académica del proyecto y la justificación de las decisiones de diseño, ver [Fundamentación_APP.md](Fundamentación_APP.md).

---

## Screenshots

<p>
  <img src="frontend/src/assets/screenshots/home_screenshot.png" width="45%" />
  <img src="frontend/src/assets/screenshots/eventDetail_screenshot.png" width="45%" />
</p>

<p>
  <img src="frontend/src/assets/screenshots/home-desktop_screenshot.png" width="92%" />
</p>

---

## Demo

| Servicio | URL |
|---------|-----|
| Frontend (Vercel) | https://quedamos-org.vercel.app |
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
  → Middleware: validateId / verifyToken / requireRole / validate(schema)
  → Controller (lógica de negocio)
  → Prisma Client
  → PostgreSQL
  → errorHandler (P2002→409, P2025→404, P2003→404, resto→500)
```

`validateId` valida que `req.params.id` sea un entero y lo adjunta como `req.id`. Va antes de `verifyToken` porque la validación del id es más barata que la verificación criptográfica del JWT.

`authLimiter` protege `POST /api/auth/login` y `POST /api/auth/register` — máximo 10 peticiones por IP en 15 minutos (express-rate-limit).

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
| `/info/sobre-el-proyecto` | Info | Pública |
| `/info/contacto` | ContactPage | Pública |
| `/info/:slug` | StaticPage | Pública |

**Estado global:** Context API — solo `AuthContext` en el MVP: user, token, login, logout, cargando.

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
| GET | `/api/events` | No | Listar con filtros: `?area=`, `?categoryId=`, `?from=`, `?to=`, `?page=`, `?limit=` (def. 9). Devuelve `{ data, total, page, totalPages }` |
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

### User actual — `/api/users`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/users/me/attendances` | Autenticado | Mis eventos confirmados |
| GET | `/api/users/me/events` | Autenticado | Mis eventos como organizador |

### Admin — `/api/admin`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/admin/users` | ADMIN | Listar users paginado: `?page=`, `?limit=` (def. 10). Devuelve `{ data, total, page, totalPages }` |
| GET | `/api/admin/events` | ADMIN | Listar eventos paginado: `?page=`, `?limit=` (def. 10). Devuelve `{ data, total, page, totalPages }` |
| DELETE | `/api/admin/users/:id` | ADMIN | Borrar user |

---

## Tests

```bash
cd backend
npm test
```

21 tests de integración con Vitest + Supertest (cobertura de líneas: 89.88%):

| # | Suite | Test | Resultado esperado |
|---|-------|------|--------------------|
| 1 | Auth | POST /api/auth/register con datos válidos | 201 + token |
| 2 | Auth | POST /api/auth/register con email duplicado | 409 |
| 3 | Auth | POST /api/auth/login con credenciales correctas | 200 + token |
| 4 | Auth | POST /api/auth/login con credenciales incorrectas | 401 |
| 5 | Events | GET /api/events sin auth | 200 |
| 6 | Events | POST /api/events sin token | 401 |
| 7 | Events | POST /api/events con token USER | 403 |
| 8 | Events | POST /api/events con categoryId inexistente | 404 |
| 9 | Events | POST /api/events con token ORGANIZER | 201 |
| 10 | Events | POST + DELETE /api/events/:id/attend | 201 y 200 |
| 11 | Events | GET /api/events/areas sin auth | 200 |
| 12 | Events | GET /api/events/abc (id no numérico) | 400 |
| 13 | Events | GET /api/events/:id/attend con token | 200 |
| 14 | Events | GET /api/categories sin auth | 200 |
| 15 | Events | GET /api/users/me/attendances con token | 200 |
| 16 | Events | GET /api/users/me/events con token ORGANIZER | 200 |
| 17 | Events | PUT /api/events/:id con token ORGANIZER | 200 |
| 18 | Events | GET /api/admin/users con token ADMIN | 200 |
| 19 | Events | GET /api/admin/events con token ADMIN | 200 |
| 20 | Events | DELETE /api/events/:id con token ORGANIZER | 200 |
| 21 | Events | DELETE /api/admin/users/:id con token ADMIN | 200 |

Se optó por no seguir TDD por la magnitud del proyecto.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite |
| Routing | React Router v7 |
| Estado global | Context API |
| HTTP client | fetch nativo |
| Estilos | CSS Modules |
| Backend | Node.js + Express 5 |
| ORM | Prisma 5 |
| Base de datos | PostgreSQL |
| Autenticación | JWT — 7 días de expiración |
| Hash contraseñas | bcryptjs — 10 salt rounds |
| Validación backend | Zod |
| Rate limiting | express-rate-limit |
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

**Ordenación de rutas en Express.** `GET /events/areas` después de `GET /events/:id` hace que Express trate "areas" como un id. Solución: las rutas estáticas siempre antes que las dinámicas. El mismo principio aplica en React Router.

**`cqw` referenciando el viewport en lugar de `main`.** Sin un ancestro con `container-type`, `cqw` cae al viewport. Solución: añadir `container-type: inline-size` al elemento `main` en `index.css`.

**`fetch` no lanza error en respuestas 4xx/5xx.** A diferencia de axios, `fetch` solo rechaza la promesa ante errores de red. Para manejar errores HTTP hay que comprobar `response.ok` manualmente antes de procesar la respuesta.

---

## Resumen del uso de IA en el desarrollo

Durante el desarrollo integré Claude, Gemini y Perplexity como par de programación. Escribí la mayoría del código yo; la metodología más habitual fue: la IA explicaba cada concepto antes de implementarlo, revisaba errores y orientaba decisiones arquitectónicas. Mantuve el control crítico sobre las propuestas, descartando las que no encajaban con la filosofía del proyecto. El log completo, sesión por sesión, está en [Documentacion_IA.md](Documentacion_IA.md).

---

## Tiempos de desarrollo

Los tiempos de desarrollo se ciñen a los minutos efectivos empleados para cada bloque.

| Día | Bloque | Estimado | Real |
|-----|--------|---------|------|
| 0 | Prework + Prebloques | — | 265 min |
| 1 | Setup + Auth backend | 275 min | 258 min |
| 2 | CRUD eventos + asistencias | 240 min | 195 min |
| 3 | Admin + integración + tests + deploy | 265 min | 455 min |
| 4 | Frontend setup + auth + rutas | 240 min | 321 min |
| 5 | Layout + componentes + deploy + schema v2 | — | 475 min |
| 6 | Páginas funcionales + reformulación del proyecto | — | 390 min |
| 7-8 | CSS + polish + validateId + páginas estáticas + tests | — | 720 min |
| **Total** | | | **~3.079 min (~51h 20min)** |

---

## Backlog — Fase 2 y mejoras futuras

El proyecto social quedamos.org está concebido para crecer por fases. Actualmente se plantean 4. Lo que sigue es el backlog de funcionalidades planificadas consecutivas a la fase 1 que termina con este MVP.

### Mejoras técnicas (sin fase asignada)

- **Soft delete de users** — marcar con `deletedAt` en lugar de borrado en cascada, para preservar el historial de eventos y asistencias. Mejora la experiencia de organizers y users que quieran o deban tener una memoria de eventos.
- **Sustituir Gmail por Resend o SendGrid** en producción — Gmail con contraseña de aplicación es frágil. Resend y SendGrid tienen plan gratuito y no requieren configuración especial. Implementado en gmail para el proyecto bootcamp.
- **Filtrar usuario por rol en el backend** (`?role=USER`) en lugar de hacerlo en el frontend.
- **Endpoint de reset de contraseña para admin** (`POST /api/admin/users/:id/reset-password`). Actualmente si un user pierde su contraseña (o acceso a correo cuando se implemente método de recuperación) no hay forma de recuperarlo administrativamente.
- **Recuento de asistencias en panel de admin** — añadir `_count: { select: { attendances: true } }` a `getAllUsers` para que el admin vea cuántos eventos confirma cada persona.
- **Exportar a calendario** — generar `.ics` al confirmar asistencia para añadir el evento al calendario personal sin depender de ninguna plataforma externa.
- **Buscador por texto libre** — buscar por palabras en título y descripción, sin depender solo de categorías. Funcionalidad de Prisma no usada para el MVP.

### Fase 2 — Coordinación social

- **Modo "busco compañía"** — marcar que quieres ir pero prefieres ir en compañía.
- **Compartir transporte** — opción "quiero compartir transporte", coincidencia por proximidad, propuesta de trayectos compartidos.
- **Sistema de reserva previa** — marcar interés antes de que abran las inscripciones para recibir aviso cuando se abran.
- **Lista de espera** — apuntarse si el aforo está completo.
- **Historial privado de asistencias** — registro visible solo para la persona usuaria, para recordar a qué eventos fue.
- **Newsletter semanal opt-in** — resumen según los filtros configurados en el perfil. Opt-in explícito, nunca por defecto.
- **Perfil de entidad** — página mínima: nombre, descripción, tipo, municipio y lista de eventos activos.
- **Historial del organizer** — vista de eventos pasados propios, exportable. Solo visible para propio organizer.
- **Vista de mapa** — eventos sobre un mapa de Gran Canaria con Leaflet + OpenStreetMap (sin tracking, sin API key, coherente con la filosofía de privacidad del proyecto).
- **Identificación obligatoria de entidades** — DNI/CIF para publicar eventos. Requisito de seguridad a largo plazo.