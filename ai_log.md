# Log de uso de IA — quedamos.org

**Herramienta utilizada:** Claude (claude-sonnet-4-6) via Claude Code CLI, Gemini y Perplexity
**Modalidad:** Par de programación interactivo. Yo escribo todo el código; Claude explica conceptos, revisa errores y orienta en decisiones arquitectónicas.

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