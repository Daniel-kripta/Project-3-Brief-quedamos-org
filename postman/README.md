# Guía de uso — Colección Postman quedamos-api

## Importar la colección

1. Abre Postman
2. **Import** → selecciona `quedamos-api.postman_collection.json`

## Configurar el entorno

1. En el desplegable superior derecho, selecciona o crea el entorno `quedamos-local`
2. Añade una variable: nombre `token`, valor inicial vacío
3. **Importante:** Postman no recuerda el entorno seleccionado al cerrarse — vuelve a seleccionarlo cada vez que abras la aplicación

## Orden de ejecución recomendado

1. **Register** — crea el usuario de prueba (ORGANIZER por defecto)
2. **Login** — captura el token automáticamente en `{{token}}`
3. A partir de aquí el resto de requests autenticadas funcionan con ese token

## Usuarios del seed

El proyecto incluye un seed con los siguientes usuarios listos para usar:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@quedamos.org` | `admin123` | ADMIN |
| `eventos@culturalironhack.ic` | `org123` | ORGANIZER |
| `gestion-cultural@telde.ic` | `org123` | ORGANIZER |
| `maria@example.ic` | `user123` | USER |
| `carlos@example.ic` | `user123` | USER |

Para probar rutas de ADMIN: ejecuta el seed (`npx prisma db seed`), luego haz Login con `admin@quedamos.org` y el token se actualizará automáticamente.

## Notas

- Las rutas de Admin (`/api/admin/*`) requieren token de ADMIN
- Las rutas de creación/edición/borrado de eventos requieren token de ORGANIZER o ADMIN
- Los IDs en las URLs (ej. `/api/events/1`) corresponden a los datos del seed — ajústalos si es necesario
