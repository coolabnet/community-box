---
title: Recetas de Co-op Cloud
sourcePath: guides/coopcloud-recipes.md
sourceHash: 5ce3bb546f64fd2e
translatedBy: glm-4.6
---

# Co-op Cloud y Recipes: Cuándo Encajan en una Community Box

Co-op Cloud es un grupo de proyectos de software. Se describe a sí mismo como un [common de software y federación internacional](https://coopcloud.tech/) que construye tecnología democrática. Su herramienta principal para ejecutar aplicaciones es `abra`, un programa de línea de comandos. Las aplicaciones se despliegan a partir de archivos llamados recipes.

Esta guía explica los términos, la madurez del proyecto y cuándo Co-op Cloud encaja en una Community Box. Es una guía, no una entrada de catálogo.

Nota: una participante del Global Gathering 2026 recomendó Co-op Cloud. Esta guía registra ese comentario. No es evidencia de que la herramienta funcione bien para cualquier comunidad.

## Qué Es Co-op Cloud

Co-op Cloud ofrece:

- **abra:** el cliente de línea de comandos. El proyecto lo llama el [cliente insignia y herramienta de línea de comandos](https://git.coopcloud.tech/toolshed/abra) de Co-op Cloud. Está escrito en Go y es software libre. Su [archivo LICENSE](https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE) es la GNU General Public License v3.
- **Recipes:** los archivos de configuración que `abra` utiliza para desplegar aplicaciones.
- **Docs:** guías para operadores y mantenedores en [docs.coopcloud.tech](https://docs.coopcloud.tech/).

La documentación describe a los operadores como personas que administran un despliegue de Co-op Cloud. Los operadores suelen ser [individuos o miembros de cooperativas tecnológicas o colectivos](https://docs.coopcloud.tech/operators/).

## Qué Es un Recipe

El proyecto define un recipe como [el archivo de configuración usado para desplegar aplicaciones con la CLI abra](https://docs.coopcloud.tech/abra/recipes/). Un catálogo web lista los recipes que existen. Buscas una aplicación ahí y luego la despliegas con `abra`.

La página de recipes utiliza dos escalas diferentes. Lee ambas.

**Puntuación de CI (0 a 3).** Esta escala mide la automatización en la integración continua de un recipe:

- 0: ninguna.
- 1: despliegue básico, con secretos y redes configurados a mano.
- 2: secretos y redes automáticos.
- 3: lo mismo que 2, más una verificación de salud.

**Estado general (1 a 5).** Esta es una escala separada para el recipe en su conjunto:

- 5: todo lo del nivel 4, más inicio de sesión único.
- 4: imagen upstream, copias de seguridad, correo electrónico, verificación de salud y pruebas de integración.
- 3: imagen upstream, con uno o dos elementos del nivel 4 ausentes.
- 2: tres o cuatro elementos del nivel 4 ausentes, o sin imagen upstream.
- 1: alfa.

Las dos escalas miden cosas diferentes. Revisa ambas antes de desplegar una aplicación.

## Advertencia de Madurez

La [página principal de la documentación](https://docs.coopcloud.tech/) dice que el proyecto sigue siendo software de calidad beta. Pide a los usuarios que lo consideren antes de ejecutarlo en producción. La versión de abra que aparece en el repositorio es 0.13.0-beta.

Para una red comunitaria, esto significa que un despliegue de Co-op Cloud necesita un operador capaz de leer errores, actualizar software y resolver problemas sin ayuda externa.

## Hardware y Conectividad: Consideraciones con Condiciones

Estas son condiciones a verificar, no requisitos universales.

**Despliegue sin conexión o solo local.** El [manual de operadores](https://docs.coopcloud.tech/operators/handbook/) dice que puede que quieras ejecutar Co-op Cloud directamente en un dispositivo, para probar un recipe o para ejecutar aplicaciones fuera de la nube. Advierte que los nombres de host locales impiden que Traefik obtenga certificados de Let's Encrypt. La solución sugerida es el modo staging, certificados comodín y un certificado autofirmado. Espera configuración adicional. Pruébalo antes de depender de ello.

**Hardware ARM.** El manual cita un comentario de la comunidad. Dice que ARM funciona solo si las imágenes que usas soportan ARM, y que abra no funcionaba en ARM al momento de ese comentario. Usa imágenes multi-arquitectura o ARM cuando puedas. Verifica que abra funcione en tu placa antes de planificar en torno a él.

**x86 y acceso a internet.** El manual no establece una regla de que el servidor deba ser x86 o estar siempre en línea. Verifica la arquitectura y la conectividad que tus recipes necesitan, no una regla general.

## Opciones Más Simples en Este Repositorio

Este repositorio ya documenta plataformas más simples. Lee primero estas notas de proyecto:

- [CasaOS](../software/casaos/README.md)
- [YunoHost](../software/yunohost/README.md)
- [CapRover](../software/caprover/README.md)
- [balena](../software/balena/README.md)

Esta guía no volvió a revisar esas plataformas. Usa las notas del repositorio para ellas.

Elige Co-op Cloud cuando la comunidad tenga una necesidad clara que las plataformas más simples no cubran, y cuando al menos un mantenedor pueda trabajar desde una terminal y probar actualizaciones.

## Preguntas Abiertas

- (inferido) Las aplicaciones de Co-op Cloud se ejecutan en Docker Swarm. El encargo de esta guía lo indica, pero las páginas consultadas para esta guía no lo confirmaron. Verifica la [documentación de abra](https://docs.coopcloud.tech/abra/) antes de confiar en ello.
- (inferido) Un despliegue normal necesita acceso a internet para descargar imágenes de contenedores. No confirmado en las páginas consultadas.
- La afirmación sobre ARM proviene de un comentario de la comunidad, no de una matriz de soporte oficial. Verifica el soporte actual de abra y de las imágenes antes de comprar hardware.
- La licencia de los recipes individuales no fue verificada. Revisa cada recipe antes de reutilizarlo.

## Fuentes

Consultadas el 2026-10-30.

- https://coopcloud.tech/ (descripción del proyecto: common de software, federación, herramientas)
- https://docs.coopcloud.tech/ (advertencia de calidad beta, lista de guías)
- https://docs.coopcloud.tech/operators/ (quiénes son los operadores)
- https://docs.coopcloud.tech/operators/handbook/ (despliegue sin conexión, nombres de host locales y certificados, imágenes ARM y abra)
- https://docs.coopcloud.tech/abra/recipes/ (definición de recipe, puntuación de CI de 0 a 3, estado general de 1 a 5)
- https://git.coopcloud.tech/toolshed/abra (descripción de abra: CLI insignia, Go, software libre, versión 0.13.0-beta)
- https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE (GNU GPL v3)