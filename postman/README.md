# quedamos-api — Postman

## Instrucciones de uso

1. Importa `quedamos-org-api.postman_collection.json`
2. Importa `quedamos-local.postman_environment.json`
3. Selecciona el entorno **quedamos-local** en el desplegable superior derecho
4. Ejecuta **Auth → Login** — el token se guarda automáticamente en la variable `{{token}}`
5. Ya puedes usar cualquier request autenticada sin configuración adicional

La URL de Railway está preconfigurada en el entorno.

## Users de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@quedamos.org` | `quedamos2026` | ADMIN |
| `info@asociacion-el-timple.ic` | `org123` | ORGANIZER |
| `senderismo@canarias.ic` | `org123` | ORGANIZER |
| `maria@example.ic` | `user123` | USER |
| `carlos@example.ic` | `user123` | USER |

## Estructura de la colección

| Carpeta | Requests |
|---------|---------|
| **Auth** | Register, Login |
| **Events** | Get all (público), Get all filtrado por área, Get by id, Create, Update, Delete, Attend, Cancel attendance |
| **Categories** | Get all (público) |
| **User** | My attendances, My events (como organizador) |
| **Admin** | Get all users, Get all events, Delete user |

## Notas

- `specialTagIds` en Create/Update son IDs de la tabla `Tag`. Los del seed son: `1` = Día de Canarias, `2` = Benéfico, `3` = Primera vez.
- `tags` acepta solo valores del vocabulario controlado: `paid`, `free`, `indoor`, `outdoor`, `beginner_friendly`, `collaboration`.
- `maxCapacity` es opcional — si no se envía o es `null`, el evento no tiene límite de aforo.

API desplegada en Railway (EU West — Países Bajos).
