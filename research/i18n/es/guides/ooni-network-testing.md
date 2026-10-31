---
title: Pruebas de red de OONI
sourcePath: guides/ooni-network-testing.md
sourceHash: 97a3d8f9da2d1626
translatedBy: glm-4.6
---

# OONI Probe: Comprobar si los sitios web están bloqueados

OONI Probe es una aplicación gratuita. Comprueba si los sitios web y las aplicaciones están bloqueados en una red. Un miembro la ejecuta en su propio teléfono o computadora. No es un servidor y no se ejecuta en la Community Box.

Esta guía explica qué hace OONI Probe, a dónde van sus resultados y qué riesgos debe considerar un miembro antes de ejecutarla.

## Qué hace OONI Probe

OONI Probe ejecuta pruebas desde el dispositivo donde está instalada. Puede probar si un sitio web o una aplicación está bloqueado. También puede medir la velocidad y el rendimiento de la red. El proyecto OONI la describe como una forma de [probar el bloqueo de sitios web y aplicaciones](https://ooni.org/).

OONI Probe está disponible en estas formas:

- **Móvil:** Android e iOS. La aplicación está en Google Play, el App Store y F-Droid ([página de instalación](https://ooni.org/install)).
- **Escritorio:** Windows y macOS ([página de instalación](https://ooni.org/install)).
- **Línea de comandos:** Linux y macOS ([página de instalación](https://ooni.org/install), con instrucciones en [ooni.org/install/cli](https://ooni.org/install/cli)).

Cada forma tiene su propia guía de usuario en el sitio de soporte de OONI.

## A dónde van los resultados

OONI publica los resultados de las pruebas. El sitio OONI Explorer muestra los datos como [datos abiertos sobre censura en internet](https://explorer.ooni.org/). La página de Explorer indica que los datos fueron recopilados por la comunidad global de OONI, y pide a los usuarios instalar OONI Probe y ejecutar pruebas para contribuir a ellos.

De forma predeterminada, OONI envía cada medición a su colector. El colector la publica en OONI Explorer y a través de la API de OONI. Un usuario puede darse de baja en la configuración de la aplicación ([página de riesgos de OONI](https://ooni.org/about/risks/)).

La página de riesgos de OONI indica que los datos publicados incluyen:

- tu ubicación aproximada,
- la red (ASN) desde la que te conectas,
- la hora en que ejecutaste la prueba.

OONI indica que no recopila deliberadamente tu dirección IP. La página también señala que una dirección IP puede aparecer de todos modos en encabezados HTTP u otros metadatos.

## Riesgos legales y de seguridad

La propia página de riesgos de OONI es la fuente principal de esta sección. Léela por completo antes de instalar la aplicación.

Puntos clave de esa página:

- El riesgo legal varía según el país. OONI aconseja a los miembros [consultar a un abogado autorizado en su país](https://ooni.org/about/risks/) antes de instalar o ejecutar OONI Probe.
- En algunos países, la medición activa de la red puede ser ilegal. La página indica que puede ser tratada como una forma de espionaje.
- Cualquiera que observe tu tráfico de internet, como un ISP, un gobierno o un empleador, puede ver que ejecutas OONI Probe.
- La prueba Web Connectivity contacta una amplia variedad de sitios. Algunos pueden ser objecionables o ilegales en algunos países.
- OONI declara que los usuarios ejecutan el software bajo su propio riesgo.

Esta guía no ofrece asesoría legal. Cada miembro debe decidir por sí mismo, idealmente con un abogado local. La comunidad no debe presionar a los miembros para ejecutar las pruebas.

## Adecuación para una red comunitaria

OONI Probe encaja como una aplicación complementaria. Los miembros la instalan en sus propios dispositivos. La comunidad no necesita alojar nada.

Necesidades de red:

- Las pruebas contactan sitios web, por lo que el dispositivo necesita una conexión mientras la prueba se ejecuta.
- Los resultados se suben a OONI. La página de riesgos describe esta subida como la ruta predeterminada.
- En una red sin internet, las pruebas no pueden alcanzar los sitios que comprueban. Un miembro aún puede instalar la aplicación con anticipación.

Una red comunitaria con internet débil o inexistente no debería planificar ejecuciones regulares de OONI. Un miembro con una conexión utilizable puede ejecutar pruebas en nombre de la comunidad, pero solo si acepta los riesgos mencionados anteriormente.

## Preguntas abiertas

- (inferido) La CLI puede conservar los resultados hasta que se restablezca la conexión. Los documentos consultados para esta guía no lo confirmaron. Consulta la [guía de usuario de la CLI](https://ooni.org/support/ooni-probe-cli) antes de depender de esto.
- (inferido) Los teléfonos más antiguos pueden no ejecutar bien la aplicación móvil. No probado ni verificado aquí.
- La licencia del software OONI Probe está enlazada desde la página de riesgos como [github.com/ooni/license](https://github.com/ooni/license). El texto no fue revisado para esta guía.

## Fuentes

Consultadas el 2026-10-30.

- https://ooni.org/ (página principal de OONI: qué hacen el proyecto y la aplicación)
- https://ooni.org/install (plataformas: Android, iOS, Windows, macOS, CLI de Linux)
- https://ooni.org/install/cli (enlazada desde la página de instalación; no consultada directamente)
- https://ooni.org/support/ooni-probe-cli (enlazada desde la página de instalación; no consultada directamente)
- https://ooni.org/about/risks/ (publicación predeterminada, campos publicados, riesgos legales y de seguridad, enlace a la licencia del software)
- https://explorer.ooni.org/ (OONI Explorer: datos abiertos, contribución mediante la ejecución de pruebas)