# Log de uso de IA — quedamos.org

**Herramienta utilizada:** Claude (claude-sonnet-4-6) via Claude Code CLI, Gemini y Perplexity
**Modalidad:** Par de programación interactivo. Yo escribo todo el código; Claude explica conceptos, revisa errores y orienta en decisiones arquitectónicas.
**Actualizado:** 12/05/2026

---
## 2026-05-08/09 — Prework

- **Herramienta:** Claude (claude-sonnet-4-6), Gemini
- **Contexto:** Tenía la idea de proyecto y necesitaba 3 cosas: Redactar el proyecto, adaptar el proyecto a lo que nos piden en el Brief y estructurar el trabajo. 
- **Cómo se usó:** Con Gemini, puesto que tiene una mayor ventana de contexto (en torno a 4 veces la de Claude y más barato) le expliqué todo el proyecto, dando detalle del proyecto social en el que se enmarca. Para eso usé el método de asegurarme que entienda todo el contexto. Con esto se generó un documento con el proyecto que pasé posteriormente a Claude. A Claude le pedí, que ese documento lo contrastara con el project.md, que es la descripción del Brief. Con este contexto le pedí a Claude dos cosas: negociar conmigo cómo sería el proyecto y posteriormente crear un archivo CLAUDE.md con todo lo acordado. De este CLAUDE.md se generó un plan de trabajo.
- **Tiempo con IA:** 265 min | **Tiempo sin IA (estimado):** incierto
- **Aprendizaje:** Mejoré la eficiencia en la comunicación con Claude y la eficiencia en el consumo de tokens.

---
## 2026-05-09 — Setup + Schema Prisma + Auth backend

- **Herramienta:** Claude (claude-sonnet-4-6)
- **Contexto:** Primera sesión del proyecto. Configuración del monorepo, schema Prisma y autenticación completa.
- **Cómo se usó:** No se usaron prompts puntuales sino una sesión de trabajo continua. Claude explicaba cada concepto antes de escribir código, y yo escribía el código a mano basándome en las explicaciones.
- **Qué obtuve:** Explicaciones de CORS, separación server.js/app.js, ORM, singleton pattern, middleware en Express, JWT, bcrypt, Zod. Revisión de errores de sintaxis en tiempo real.
- **Qué modifiqué o descarté:**
  - Prisma v7 instalado por defecto tuvo que bajarse a v5 por breaking changes incompatibles con este stack (la URL de conexión ya no va en schema.prisma en v7).
  - El campo `municipality` fue renombrado a `area` por decisión propia al entender mejor el dominio del proyecto.
  - Varias rutas en events.routes.js corregidas al entender que `verifyToken` debe ir siempre antes que `requireRole`.
- **Tiempo con IA:** 258 min | **Tiempo sin IA (estimado):** 480 min
- **Aprendizaje:**
  - Entendí por qué se separan `server.js` y `app.js`: los tests necesitan importar la app sin abrir un puerto real.
  - Entendí que el patrón singleton en `lib/prisma.js` evita abrir múltiples conexiones a la BD.
  - Entendí la diferencia entre `select` (campos de la misma tabla) e `include` (tablas relacionadas) en Prisma.
  - Entendí que `@@unique([userId, eventId])` es una restricción de tabla, no de campo, y que previene inscripciones duplicadas devolviendo P2002.
  - Entendí que `module.exports = valor` y `module.exports = { clave: valor }` son distintos y que las llaves en el `require` dependen de eso.

---

## 2026-05-10 — CRUD eventos + asistencias + categorías + usuarios

- **Herramienta:** Claude (claude-sonnet-4-6)
- **Contexto:** Segunda sesión. Controladores de eventos, asistencias, categorías y rutas completas del backend.
- **Cómo se usó:** Mismo patrón: Claude explica la lógica de cada función, yo la escribe. Claude revisa errores de sintaxis y lógica.
- **Qué obtuve:** Estructura del `where` dinámico para filtros, uso de `_count` en Prisma, patrón de verificación de permisos en controladores, uso de `@@unique` compuesto como identificador en `deleteMany`.
- **Qué modifiqué o descarté:**
  - `getEvent` inicialmente escrito con query params en lugar de `req.params` — corregido al entender la diferencia entre parámetros de ruta y de query.
  - `cancelAttendance` tenía el `res.json` dentro del objeto de `prisma.attendance.delete()` — corregido al entender que son sentencias separadas.
  - `updateEvent` tenía el bloque `update` fuera del `try` — corregido.
  - Se añadió el campo `imageUrl String?` al schema (con migración) al reflexionar sobre que los eventos necesitan imagen, aunque la implementación queda pendiente para el frontend. En la negociación con Claude indiqué que, en la filosofía de la App no hay fotografías para users, y Claude extendió esa restricción a que no habría imágenes. Se observó y se corrigió el error.
- **Tiempo con IA:** 195 min | **Tiempo sin IA (estimado):** 480 min
- **Aprendizaje:**
  - En la repetición de la lógica de crear el controller, luego el routes y luego incluirlo en app, con al asistencia de la IA, llegué a manejarme de forma autónoma en la última creación.
  - Entendí que los query params llegan siempre como string y hay que convertirlos con `Number()` antes de pasarlos a Prisma.
  - Entendí que `gte` en Prisma significa "greater than or equal" y que los filtros de fecha usan `{ gte: new Date(from) }`.
  - Entendí que `_count` no filtra sino que añade un campo calculado con el número de filas relacionadas.
  - Entendí que `_` se usa para indicar que esa variable la declaro pero no la voy a usar, y evitar que salte el error.
  - Entendí por qué hay que borrar las asistencias antes de borrar un evento: PostgreSQL rechaza borrar el padre si hay hijos con clave foránea apuntando a él.
  - Entendí que Prisma genera automáticamente el nombre `userId_eventId` para el `@@unique` compuesto y que se usa como identificador en `delete`.

---

## 2026-05-11 — Preparación Día 3: Postman + ajustes backend

- **Herramienta:** Claude (claude-sonnet-4-6)
- **Contexto:** Sesión de preparación antes de las tareas principales del Día 3. Sin codificación de nuevas funcionalidades.
- **Cómo se usó:** Claude guió la configuración de Postman y por otro lado, revisó el feedback de una herramienta externa (Gemini) contrastándolo con el código real.
- **Qué obtuve:** Conocimientos en Postman para completar con todas las rutas actuales usando entorno con captura automática de token. A partir de las pruebas en Postman localicé un fallo de diseño y se corrigió en `getMyAttendances`.
- **Qué modifiqué o descarté:**
  - Del Feedback de Gemini dos observaciones menores resultaron válidas: validación de NaN en IDs de ruta (evitar inyección de código), logging en el catch del webhook.
  - `getMyAttendances` corregido para incluir `include: { event: true }` — sin esto devolvía solo los IDs en lugar de los datos completos del evento.
- **Tiempo con IA:** 90 min | **Tiempo sin IA (estimado):** incierta, (tarea no pre-programada)
- **Aprendizaje:**
  - Entendí cómo funcionan las variables de entorno en Postman: el script `pm.environment.set("token", ...)` en el Login captura el token automáticamente y lo propaga al resto de requests mediante `{{token}}`.
  - Descubrí que Prisma Studio es una maravilla.

---

## 2026-05-11 — Admin + Nodemailer + Seed + Tests (Día 3 sesión mañana)

- **Herramienta:** Claude (claude-sonnet-4-6)
- **Contexto:** Continuación de la sesión del día 11. Completado el backend al 100%: controlador y rutas de admin, integración de email con nodemailer, seed de datos y tests de integración.
- **Cómo se usó:** Patrón similar a días anteriores para admin, seed y nodemailer, pero con mucho menos guiado y más autónomo. En los tests, la implicación fue deliberadamente menor: una vez entendido el patrón (beforeAll/afterAll, estructura de cada test), la generación de los archivos de test es una tarea repetitiva y mecánica donde la IA aporta más valor que la escritura manual.
- **Qué obtuve:** Admin completo (getAllUsers, getAllEvents, deleteUser con borrado en cascada correcto). Integración de nodemailer con Gmail via contraseña de aplicación, patrón fire-and-forget para no bloquear la respuesta. Seed idempotente con `upsert` y protección de entorno con `NODE_ENV`. 8 tests de integración pasando con Vitest + Supertest.
- **Qué modifiqué o descarté:**
  - n8n descartado por requerir correo corporativo en el registro — sustituido por nodemailer directamente.
  - `vitest.config.js` en CommonJS no funciona con Vitest — renombrado a `vitest.config.mjs` con sintaxis ES Module.
  - `dotenv` movido a `app.js` al descubrir que los tests importan la app directamente sin pasar por `server.js`, dejando `JWT_SECRET` sin cargar.
  - Tests fallaban por ejecución paralela de los dos archivos — resuelto con `fileParallelism: false` en la config de Vitest.
  - `deleteUser` en admin diseñado para bloquear el borrado de otros admins — decisión de negocio tomada durante el desarrollo.
  - Reflexión sobre soft delete como mejora futura: el borrado en cascada actual es funcional pero agresivo. Se documentó en README y CLAUDE.md para valorar cuando haya tiempo.
- **Tiempo con IA:** 245 min | **Tiempo sin IA (estimado):** 480 min
- **Aprendizaje:**
  - Entendí que el seed usa `upsert` en lugar de `create` para que sea idempotente: se puede ejecutar varias veces sin duplicar datos.
  - Entendí que Vitest ejecuta los archivos de test en paralelo por defecto, lo que puede causar condiciones de carrera cuando comparten la misma base de datos.

---

## 2026-05-11 — Deploy backend a Railway (Día 3, sesión tarde)

- **Herramienta:** Claude (claude-sonnet-4-6)
- **Contexto:** Con el backend al 100% (del MVP), se procedió a desplegar en Railway antes de empezar el frontend. Decisión deliberada: tener la URL de producción disponible antes de arrancar el Día 4.
- **Cómo se usó:** Claude guió el proceso paso a paso, explicando cada decisión antes de ejecutarla. La interacción fue más de navegación que de código: entender la interfaz de Railway, diagnosticar errores en los logs y tomar decisiones sobre configuración. También se obtuvo asistencia Claude para modificar el JSON de la colección de Postman y exportar el enviroment.
- **Qué obtuve:** Backend desplegado y funcionando en Railway (EU West, Netherlands) con PostgreSQL vinculado. Colección Postman actualizada con variable `{{Railway_url}}` para que se pueda testear directamente contra producción sin configurar nada.
- **Qué modifiqué o descarté:**
  - `start` script cambiado de `nodemon server.js` a `prisma migrate deploy && node server.js` — nodemon es devDependency y no se instala en producción.
  - Añadido `postinstall: prisma generate` — sin este paso, el cliente Prisma no se genera tras `npm install` y la app arranca sin los métodos del schema.
  - `DATABASE_URL` no se inyecta automáticamente entre servicios — hay que vincularla manualmente desde Variables del servicio de Node.
  - Seed saltado en producción por el condicional `NODE_ENV` — ejecutado con override `NODE_ENV=development node prisma/seed.js`.
  - Región cambiada a EU West (Netherlands) — decisión de coherencia con la filosofía RGPD del proyecto.
  - Colección Postman con todas las URLs migradas a `{{Railway_url}}` editando el JSON directamente y enviroment exportado.
- **Tiempo con IA:** 120 min | **Tiempo sin IA (estimado):** 180 min
- **Aprendizaje:**
  - Entendí que en Railway hay dos niveles distintos: el proyecto (configuración general) y el servicio (donde vive la app). El Root Directory se configura en el servicio, no en el proyecto.
  - Entendí que Railway no vincula servicios automáticamente — DATABASE_URL hay que referenciarla explícitamente con `${{Postgres.DATABASE_URL}}`.
  - Entendí la tensión entre `NODE_ENV=production` (buena práctica) y la necesidad puntual de ejecutar el seed: la solución es sobreescribir la variable solo para ese comando sin cambiar el entorno global.
  - Reflexioné sobre la elección de región: EU West no solo es más cercano geográficamente sino coherente con el marco RGPD que define la filosofía del proyecto.

---

## 2026-05-12 — Frontend setup + auth + rutas (Día 4)

- **Herramienta:** Claude (claude-sonnet-4-6)
- **Contexto:** Primera sesión del frontend. Setup completo, lógica de autenticación, rutas y páginas de login y registro.
- **Cómo se usó:** Sesión guiada con el mismo patrón que el backend: Claude explica qué, cómo y por qué antes de cada tarea, y yo escribo el código. En las partes más mecánicas o cuando no tenía suficiente contexto, pedí el código directamente para entenderla.
- **Qué obtuve:** Setup completo con Vite + React Router. AuthContext, useApi, ProtectedRoute, App.jsx con todas las rutas, Navbar dinámica según rol, Login y Register funcionales contra la API de Railway.
- **Qué modifiqué o descarté:**
  - Estructura de carpetas ampliada respecto al plan original: se añadieron `api/`, `layouts/`, `routes/` y `utils/` pensando en el proyecto completo, no solo el MVP.
- **Tiempo con IA:** ~321 min | **Tiempo sin IA (estimado):** 580 min
- **Aprendizaje:**
   - Entendí la diferencia entre `export default` y `export` con llaves, y cómo afecta al import.

---

## 2026-05-13 — Deploy Vercel + inicio Día 5 (sesión mañana)

- **Herramienta:** Claude (claude-sonnet-4-6)
- **Contexto:** Deploy del frontend en Vercel y primeras decisiones de UI/UX del proyecto. A partir de aquí el uso de IA cambia: Claude pasa a rol de consulta puntual, no de guía paso a paso.
- **Cómo se usó:** Para las decisiones de diseño y componentes consulta de dudas técnicas concretas. Para el deploy se contrastó un aviso de seguridad (Google Chrome) al respecto de la contraseña admin123, se pidió a Claude soporte para cambiarla en el seed y Railway, para evitar que salte ese aviso
- **Qué obtuve:** Frontend desplegado en `quedamos-org.vercel.app` y nueva contraseña de admin, sin aviso de seguridad.
- **Qué modifiqué o descarté:**
  - Custom Start Command de Railway modificado temporalmente para ejecutar el seed con la nueva contraseña, luego restaurado.
- **Tiempo con IA:** ___ min | **Tiempo sin IA (estimado):** ___
- **Aprendizaje:**
  - ...
