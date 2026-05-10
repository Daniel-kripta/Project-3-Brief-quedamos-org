Project 3 Brief | Aplicación Full-Stack con React y Node.js

# **Nombre: quedamos.org**

## 0. Introducción
Este proyecto representa la culminación técnica del aprendizaje en el bootcamp de desarrollo web Fullstack, con el objetivo de construir una aplicación completa y funcional que conecte un frontend interactivo con una arquitectura de backend y base de datos real. El reto consiste en validar la capacidad para tomar decisiones técnicas, gestionar la seguridad mediante autenticación de users y resolver la comunicación entre servicios en la nube. Para ello, se desarrolla una interfaz dinámica con React y una API REST estructurada con Node.js y Express, utilizando PostgreSQL y Prisma ORM para la gestión de datos, integrando servicios externos y desplegando todo el sistema en infraestructuras profesionales para asegurar su viabilidad en producción.

Periodo de desarrollo: Del 9 de mayo al 18 de mayo de 2026.

## 2. Estructura de base de datos

### Roles (MVP)

El sistema de roles es **único por persona**: al registrarse, cada persona elige entre `USER`, `ORGANIZER` o `ADMIN`. No es posible acumular roles.

Esto es una limitación consciente del MVP. Una persona que quiera organizar eventos debe registrarse como `ORGANIZER`, aunque también pueda apuntarse a eventos de otras personas organizadoras.

El escenario de una persona que es a la vez participante habitual y organizadora ocasional queda pendiente para la **Fase 2**, donde se migraría el campo `role` a una relación many-to-many con una tabla `roles`. Prisma gestionaría esa migración sin necesidad de rehacer la estructura base.

---

## 1. Mi proyecto: quedamos.org
MPV: Este proyecto consiste en el desarrollo de una plataforma web integral diseñada para centralizar la gestión de eventos y fomentar el encuentro social físico en Canarias. El proyecto se enmarca dentro de un proyecto social y corresponde a su primera fase: MVP. El sistema permite a las personas usuarias descubrir actividades locales, filtrar su búsqueda por municipios específicos y gestionar su asistencia a través de un entorno seguro que prioriza la privacidad y la protección comunitaria. Al mismo tiempo facilita a las entidades a ampliar el alcance de sus actividades y llevar más control sobre el aforo y perfil de asistencia.