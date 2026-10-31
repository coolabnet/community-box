---
title: Juegos locales y entretenimiento
sourcePath: guides/local-games-entertainment.md
sourceHash: f11bed1c803eb434
translatedBy: glm-4.6
---

# Juegos y entretenimiento alojados localmente

Muchas redes comunitarias tienen poco o ningún internet. Aun así, los miembros quieren cosas que hacer en sus dispositivos y en la red local. Esta guía define el entretenimiento alojado localmente y con capacidad sin conexión. Establece criterios para elegirlo y enumera algunos ejemplos que fueron verificados contra los sitios oficiales.

Esta es una guía, no una entrada de catálogo.

**Una nota sobre los juegos de azar.** Los comentarios de los socios detrás de esta guía plantearon los juegos de azar en línea como una preocupación. Esta guía no afirma que los juegos locales reduzcan los juegos de azar. No se evaluó ninguna evidencia sobre esa cuestión. Cualquier decisión sobre el riesgo de juegos de azar necesita su propia revisión.

## Qué Cuenta como Entretenimiento Local

Para esta guía, el entretenimiento local tiene tres características:

1. **Funciona en el hardware o dispositivos propios de la comunidad.** El servidor o la computadora de un miembro lo aloja. Los miembros acceden a él a través de la red local.
2. **Funciona sin conexión después de la configuración.** Instalar el software o el contenido puede necesitar internet una vez. Usarlo no debería necesitarlo.
3. **Es legalmente utilizable.** La licencia permite a la comunidad instalarlo y compartirlo.

Cualquier cosa que necesite un servicio de internet en vivo para jugar no pasa la prueba sin conexión.

## Criterios de Selección

Use estas preguntas antes de agregar cualquier cosa:

- **Licencia:** ¿El código o contenido está bajo una licencia libre o abierta? Lea el archivo de licencia. No confíe en un resumen.
- **Uso sin conexión:** ¿Funciona sin internet después de la configuración? Pruébelo desconectando solo el enlace ascendente de internet. Mantenga la red local con energía, para que el servidor y el Wi-Fi sigan funcionando.
- **Recursos:** ¿Funcionará en el hardware que tiene? Pruebe en el dispositivo más débil que planee usar.
- **Idiomas:** ¿La interfaz, o el contenido, está en un idioma que los miembros lean?
- **Adecuación por edad:** Revise la clasificación o las notas de contenido. Los grupos de edades mixtas necesitan cuidado extra.
- **Mantenimiento:** ¿El proyecto sigue actualizándose? ¿Quién aplicará las actualizaciones?

## Ejemplos Candidatos

Cada ejemplo a continuación fue verificado en su sitio oficial o repositorio. Ninguno fue probado en hardware comunitario.

**1. Luanti (un motor de juego voxel).** Luanti se describe a sí mismo como un [motor de juego voxel de código abierto](https://luanti.org/en/). Está disponible para Windows, macOS, GNU/Linux, BSDs y Android. Su sitio dice que puedes jugar [solo, localmente con amigos, o en línea en un servidor](https://luanti.org/en/). El repositorio del proyecto incluye instrucciones para [ejecutar un servidor con Docker](https://github.com/luanti-org/luanti). Un servidor local podría permitir a los miembros jugar juntos en la LAN. Revise el archivo de licencia antes de usarlo.

**2. Jellyfin (servidor multimedia local).** Jellyfin se describe a sí mismo como [software libre](https://jellyfin.org/) que le permite recopilar, administrar y transmitir sus medios desde un servidor que usted ejecuta. Una comunidad podría alojar películas, música y otros medios de los que tenga derechos. Revise los derechos del contenido y las necesidades de recursos del servidor antes de planificar.

**3. Kiwix (biblioteca de lectura sin conexión).** El repositorio de herramientas de Kiwix describe [kiwix-serve y kiwix-manage](https://github.com/Kiwix/kiwix-tools) como herramientas de línea de comandos de Kiwix. Los temas de su repositorio incluyen uso sin conexión y el formato ZIM. Kiwix es material de lectura, no un juego. Inclúyalo solo si la comunidad considera la lectura sin conexión como entretenimiento. El sitio del proyecto también ofrece [dispositivos hotspot](https://kiwix.org/).

Se consideraron dos tipos más de candidatos pero no fueron verificados aquí:

- Colecciones de juegos HTML5 abiertos con licencias claras. No se verificó ninguna fuente para esta guía.
- Otros motores de juegos clásicos o retro. No se verificó ninguna fuente.

## Qué No Está Cubierto

- Dimensionamiento de hardware para cada ejemplo.
- Licencias para cada juego o elemento multimedia. Revise cada uno.
- Si estas herramientas reducen algún comportamiento dañino. Esta guía no evalúa eso.
- Instalación paso a paso. Siga la documentación oficial de cada herramienta.

## Preguntas Abiertas

- (inferido) El servidor de Luanti necesita más memoria que un servidor local básico. No medido.
- (inferido) La transcodificación de Jellyfin puede ralentizar un servidor de bajo consumo. No probado aquí.
- Las licencias del contenido de Luanti, Jellyfin y Kiwix no fueron verificadas. Lea el archivo de licencia de cada proyecto antes de usarlo.
- Qué colecciones de juegos HTML5 abiertos tienen licencias claras. No investigado.
- Si los miembros de la comunidad quieren juegos locales en absoluto. Esto necesita una decisión comunitaria, no técnica.

## Fuentes

Consultado el 2026-10-30.

- https://luanti.org/en/ (descripción del motor, plataformas, modos de juego incluido servidor)
- https://github.com/luanti-org/luanti (descripción del motor; enlace a la documentación del servidor Docker)
- https://jellyfin.org/ (descripción del servidor multimedia de software libre)
- https://github.com/Kiwix/kiwix-tools (herramientas de línea de comandos kiwix-serve y kiwix-manage)
- https://kiwix.org/ (página principal del proyecto Kiwix; productos hotspot)