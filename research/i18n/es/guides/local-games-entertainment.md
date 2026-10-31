---
title: Juegos y entretenimiento locales
sourcePath: guides/local-games-entertainment.md
sourceHash: f2220f697a32cb3a
translatedBy: glm-4.6
---

# Juegos y entretenimiento alojados localmente

Muchas redes comunitarias tienen poco o ningún internet. Los integrantes igual quieren cosas que hacer en sus dispositivos y en la red local. Esta guía define el entretenimiento alojado localmente y con capacidad para funcionar sin conexión. Da criterios para elegirlo y enumera algunos ejemplos que fueron verificados en sitios oficiales.

Esta es una guía, no una entrada de catálogo.

**Una nota sobre los juegos de azar.** Los comentarios de los socios que dieron origen a esta guía señalaron los juegos de azar en línea como una preocupación. Esta guía no afirma que los juegos locales reduzcan los juegos de azar. No se evaluó ninguna evidencia sobre esa pregunta. Cualquier decisión sobre el riesgo de juegos de azar necesita su propia revisión.

## Qué cuenta como entretenimiento local

Para esta guía, el entretenimiento local tiene tres características:

1. **Funciona en el hardware o los dispositivos propios de la comunidad.** El servidor o la computadora de un integrante lo aloja. Los integrantes acceden a él a través de la red local.
2. **Funciona sin conexión después de la configuración.** Instalar el software o el contenido puede necesitar internet una vez. Usarlo no debería necesitarla.
3. **Es legalmente utilizable.** La licencia permite que la comunidad lo instale y lo comparta.

Cualquier cosa que necesite un servicio de internet en vivo para jugarse no cumple la prueba sin conexión.

## Criterios de selección

Usa estas preguntas antes de agregar cualquier cosa:

- **Licencia:** ¿El código o el contenido está bajo una licencia libre o abierta? Lee el archivo de licencia. No te bases en un resumen.
- **Uso sin conexión:** ¿Funciona sin internet después de la configuración? Pruébalo con el router desconectado.
- **Recursos:** ¿Funcionará en el hardware que tienes? Pruébalo en el dispositivo más débil que planeas usar.
- **Idiomas:** ¿La interfaz, o el contenido, está en un idioma que los integrantes leen?
- **Adecuación por edad:** Revisa la clasificación o las notas de contenido. Los grupos de edades mixtas necesitan cuidado extra.
- **Mantenimiento:** ¿El proyecto sigue actualizándose? ¿Quién aplicará las actualizaciones?

## Ejemplos candidatos

Cada ejemplo a continuación fue verificado en su sitio oficial o repositorio. Ninguno fue probado en hardware comunitario.

**1. Luanti (un motor de juegos voxel).** Luanti se describe como un [motor de juegos voxel de código abierto](https://luanti.org/en/). Está disponible para Windows, macOS, GNU/Linux, BSD y Android. Su sitio dice que puedes jugar [en solitario, localmente con amigos, o en línea en un servidor](https://luanti.org/en/). El repositorio del proyecto incluye instrucciones para [ejecutar un servidor con Docker](https://github.com/luanti-org/luanti). Un servidor local podría permitir a los integrantes jugar juntos en la LAN. Revisa el archivo de licencia antes de usarlo.

**2. Jellyfin (servidor multimedia local).** Jellyfin se describe como [software libre](https://jellyfin.org/) que te permite recolectar, administrar y transmitir tu contenido multimedia desde un servidor que tú operas. Una comunidad podría alojar películas, música y otros medios de los que tenga derechos. Revisa los derechos del contenido y las necesidades de recursos del servidor antes de planificar.

**3. Kiwix (biblioteca de lectura sin conexión).** El repositorio de herramientas de Kiwix describe [kiwix-serve y kiwix-manage](https://github.com/Kiwix/kiwix-tools) como herramientas de línea de comandos de Kiwix. Sus temas incluyen "offline" y "zim". Kiwix es material de lectura, no un juego. Inclúyelo solo si la comunidad considera la lectura sin conexión como entretenimiento. El sitio del proyecto también ofrece [dispositivos hotspot](https://kiwix.org/).

Se consideraron dos tipos más de candidatos, pero no se verificaron aquí:

- Colecciones de juegos HTML5 abiertos con licencias claras. No se revisó ninguna fuente para esta guía.
- Otros motores de juegos clásicos o retro. No se revisó ninguna fuente.

## Qué no está cubierto

- Dimensionamiento de hardware para cada ejemplo.
- Licencias para cada juego o elemento multimedia. Revisa cada uno.
- Si estas herramientas reducen algún comportamiento dañino. Esta guía no evalúa eso.
- Instalación paso a paso. Sigue la documentación oficial de cada herramienta.

## Preguntas abiertas

- (inferido) El servidor de Luanti necesita más memoria que un servidor local básico. No se midió.
- (inferido) La transcodificación de Jellyfin puede ralentizar un servidor de bajo consumo. No se probó aquí.
- Las licencias del contenido de Luanti, Jellyfin y Kiwix no fueron revisadas. Lee el archivo de licencia de cada proyecto antes de usarlo.
- Qué colecciones de juegos HTML5 abiertos tienen licencias claras. No se investigó.
- Si los integrantes de la comunidad quieren juegos locales en absoluto. Esto necesita una decisión comunitaria, no técnica.

## Fuentes

Consultadas el 2026-10-30.

- https://luanti.org/en/ (descripción del motor, plataformas, modos de juego incluyendo servidor)
- https://github.com/luanti-org/luanti (descripción del motor; enlace a la documentación del servidor con Docker)
- https://jellyfin.org/ (descripción del servidor multimedia de software libre)
- https://github.com/Kiwix/kiwix-tools (herramientas de línea de comandos kiwix-serve y kiwix-manage)
- https://kiwix.org/ (página principal del proyecto Kiwix; productos hotspot)