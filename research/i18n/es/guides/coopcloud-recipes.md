---
title: Recetas de Co-op Cloud
sourcePath: guides/coopcloud-recipes.md
sourceHash: 3bdcdf44fdb72aa7
translatedBy: glm-4.6
---

# Co-op Cloud y Recipes: Cuándo Encajan en una Caja Comunitaria

Co-op Cloud es un grupo de proyectos de software. Se describe a sí mismo como un [común de software y federación internacional](https://coopcloud.tech/) que construye tecnología democrática. Su herramienta principal para ejecutar aplicaciones es `abra`, un programa de línea de comandos. Las aplicaciones se despliegan a partir de archivos llamados recipes.

Esta guía explica los términos, la madurez del proyecto y cuándo Co-op Cloud encaja en una Caja Comunitaria. Es una guía, no una entrada de catálogo.

Nota: una participante del Global Gathering 2026 recomendó Co-op Cloud. Esta guía registra ese comentario. No es evidencia de que la herramienta funcione bien para cualquier comunidad.

## Qué Es Co-op Cloud

Co-op Cloud ofrece:

- **abra:** el cliente de línea de comandos. El proyecto lo llama el [cliente insignia y herramienta de línea de comandos](https://git.coopcloud.tech/toolshed/abra) de Co-op Cloud. Está escrito en Go y es software libre. Su [archivo LICENSE](https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE) es la GNU General Public License v3.
- **Recipes:** los archivos de configuración que `abra` usa para desplegar aplicaciones.
- **Docs:** guías para operadores y mantenedores en [docs.coopcloud.tech](https://docs.coopcloud.tech/).

La documentación describe a los operadores como personas que administran un despliegue de Co-op Cloud. Los operadores suelen ser [individuos o miembros de cooperativas tecnológicas o colectivos](https://docs.coopcloud.tech/operators/).

## Qué Es un Recipe

El proyecto define un recipe como [el archivo de configuración utilizado para desplegar aplicaciones con la CLI de abra](https://docs.coopcloud.tech/abra/recipes/). Un catálogo web lista los recipes que existen. Buscas una aplicación allí y luego la despliegas con `abra`.

Los recipes tienen una puntuación de calidad. La página de recipes lista cuatro niveles:

- 0: ninguno,
- 1: despliegue básico, con secretos y redes configurados a mano,
- 2: secretos y redes automáticos,
- 3: lo mismo que 2, más una verificación de salud.

Una puntuación más alta significa menos trabajo manual. Revisa la puntuación antes de desplegar una aplicación.

## Advertencia sobre la Madurez

La documentación dice que el proyecto es [software aún de calidad beta](https://docs.coopcloud.tech/). La página advierte a las personas usuarias que lo consideren antes de usarlo en producción. La versión de abra mostrada en el repositorio es 0.13.0-beta.

Para una red comunitaria, esto significa que un despliegue de Co-op Cloud necesita un operador que pueda leer errores, actualizar el software y solucionar problemas sin ayuda externa.

## Cuándo Encaja en una Caja Comunitaria

Co-op Cloud puede encajar cuando todas estas condiciones se cumplen:

- El servidor es una máquina x86 con suficiente memoria y almacenamiento, y está conectada a internet.
- Al menos una persona mantenedora se siente cómoda con la línea de comandos.
- La comunidad quiere aplicaciones que el catálogo de Co-op Cloud ya empaqueta.
- La comunidad acepta que el software es beta.

Es una mala opción cuando el servidor debe funcionar sin conexión, cuando nadie quiere usar una terminal, o cuando el equipo no puede probar actualizaciones.

## Opciones Más Simples en Este Repositorio

Este repositorio ya documenta plataformas más simples. Lee primero estas notas de proyectos:

- [CasaOS](../software/casaos/README.md)
- [YunoHost](../software/yunohost/README.md)
- [CapRover](../software/caprover/README.md)
- [balena](../software/balena/README.md)

Esta guía no volvió a revisar esas plataformas. Usa las notas del repositorio para ellas.

Elige Co-op Cloud solo cuando la comunidad tenga una necesidad clara que las plataformas más simples no cubran.

## Preguntas Abiertas

- (inferido) Las aplicaciones de Co-op Cloud se ejecutan en Docker Swarm. El brief de esta guía lo dice, pero las páginas consultadas para esta guía no lo confirmaron. Verifica la [documentación de abra](https://docs.coopcloud.tech/abra/) antes de depender de ello.
- (inferido) Un despliegue necesita acceso a internet para descargar imágenes de contenedores. No confirmado en las páginas consultadas.
- La licencia de los recipes individuales no fue verificada. Revisa cada recipe antes de reutilizarlo.
- La página de documentación de abra en docs.coopcloud.tech/abra/ no fue consultada para esta guía.

## Fuentes

Consultadas el 2026-10-30.

- https://coopcloud.tech/ (descripción del proyecto: común de software, federación, herramientas)
- https://docs.coopcloud.tech/ (advertencia de calidad beta, lista de guías)
- https://docs.coopcloud.tech/operators/ (quiénes son los operadores)
- https://docs.coopcloud.tech/abra/recipes/ (definición de recipe, catálogo, niveles de puntuación de CI)
- https://git.coopcloud.tech/toolshed/abra (descripción de abra: CLI insignia, Go, software libre, versión 0.13.0-beta)
- https://git.coopcloud.tech/toolshed/abra/raw/branch/main/LICENSE (GNU GPL v3)