---
title: Pruebas de red de OONI
sourcePath: guides/ooni-network-testing.md
sourceHash: 26836f71d381300b
translatedBy: glm-4.6
---

# OONI Probe: Probar si los sitios web están bloqueados

OONI Probe es una herramienta gratuita. Comprueba si los sitios web y las aplicaciones están bloqueados en una red. Se ejecuta en el teléfono o la computadora de un miembro. No es un servicio de servidor. Esta guía recomienda los dispositivos personales como opción de despliegue. La herramienta de línea de comandos de OONI también puede ejecutarse en Linux y Raspberry Pi, pero esta guía no recomienda instalarla en una Community Box ni en ningún servidor compartido.

## Qué hace OONI Probe

OONI Probe ejecuta pruebas desde el dispositivo donde está instalado. Puede comprobar si un sitio web o una aplicación está bloqueado. También puede medir la velocidad y el rendimiento de la red. La [página principal de OONI](https://ooni.org/) lo describe como una herramienta para probar el bloqueo de sitios web y aplicaciones.

OONI Probe está disponible en estas formas:

- **Móvil:** Android e iOS. La aplicación está en Google Play, la App Store y F-Droid ([página de instalación](https://ooni.org/install)).
- **Escritorio:** Windows y macOS ([página de instalación](https://ooni.org/install)).
- **Línea de comandos:** Linux y macOS en la página de instalación. La [guía de CLI](https://ooni.org/support/ooni-probe-cli) indica macOS, Debian/Ubuntu y Raspberry Pi como plataformas compatibles.

## Qué se publica

La [política de datos de OONI](https://ooni.org/about/data-policy/) describe lo que se recopila por defecto, a menos que decidas no enviar mediciones:

- la fecha y hora de cada medición, que no se puede desactivar,
- un código de país, derivado de tu dirección IP, que no se puede desactivar,
- tu red (ASN) y el tipo de red, como Wi-Fi o datos móviles, que no se puede desactivar,
- el sistema operativo (aplicaciones) o el nombre del navegador,
- las mediciones de las pruebas que ejecutes.

La política dice que OONI no busca almacenar direcciones IP y las elimina donde puede. También dice que la sonda puede enviar datos que contienen información de identificación, como direcciones IP o encabezados HTTP.

[OONI Explorer](https://explorer.ooni.org/) publica estos datos abiertos. La [página de riesgos](https://ooni.org/about/risks/) dice que las mediciones se publican por defecto y que puedes optar por no participar en la configuración de la aplicación.

**Las pruebas de rendimiento son diferentes.** La política de datos dice que si ejecutas las pruebas de rendimiento, M-Lab recopila y publica tu dirección IP sea cual sea la configuración de tu OONI Probe. Optar por no participar en OONI no impide esto. No ejecutes pruebas de rendimiento a menos que aceptes que tu dirección IP será publicada.

## Pruebas automatizadas en instalaciones de Linux

La [guía de CLI](https://ooni.org/support/ooni-probe-cli) dice que en Debian/Ubuntu y Raspberry Pi, las pruebas automatizadas se realizan por defecto después de la instalación. Estas ejecuciones automatizadas se ejecutan como usuario `ooniprobe`, no como tu usuario de inicio de sesión.

Para revisar los resultados de esas ejecuciones automatizadas, la guía usa la configuración `OONI_HOME`. Por ejemplo:

- `sudo OONI_HOME=/var/lib/ooniprobe -u ooniprobe ooniprobe list`
- `sudo OONI_HOME=/var/lib/ooniprobe -u ooniprobe ooniprobe show <measurement-id>`

La guía documenta los comandos `ooniprobe autorun` (comandos de inicio, detención, estado y registro), pero dice que estos solo funcionan en macOS. No documenta cómo desactivar las pruebas automatizadas en Debian/Ubuntu o Raspberry Pi. La clave de configuración `sharing.upload_results` controla las subidas, no la programación.

Por esa razón, no instales la CLI en Debian/Ubuntu o Raspberry Pi a menos que tengas una manera probada de detener las ejecuciones automatizadas. Consulta la documentación actual de OONI o pregunta al proyecto antes de instalarla allí.

## Riesgos legales y de seguridad

La propia [página de riesgos](https://ooni.org/about/risks/) de OONI es la fuente principal de esta sección. Léela completa antes de instalar la aplicación.

- El riesgo legal varía según el país. OONI aconseja a los miembros consultar a un abogado con licencia en su país antes de instalar o ejecutar OONI Probe.
- En algunos países, la medición activa de la red puede ser ilegal. La página dice que puede tratarse como una forma de espionaje.
- Cualquiera que observe tu tráfico de internet, como un ISP, un gobierno o un empleador, puede ver que ejecutas OONI Probe.
- La prueba Web Connectivity contacta una amplia gama de sitios. Algunos pueden ser objetables o ilegales en algunos países.
- OONI dice que los usuarios ejecutan el software bajo su propio riesgo.

Esta guía no ofrece asesoría legal. Cada miembro debe decidir por sí mismo, con un abogado local si es posible. La comunidad no debe presionar a los miembros para ejecutar las pruebas.

## Encaje en una red comunitaria

OONI Probe encaja como una aplicación complementaria en los dispositivos de los propios miembros. La comunidad no necesita alojar nada. Las pruebas contactan sitios web, por lo que un dispositivo necesita una conexión mientras se ejecuta una prueba. En una red sin internet, las pruebas no pueden llegar a los sitios que comprueban. Una comunidad con internet débil o inexistente no debería planear ejecuciones regulares de OONI.

## Preguntas abiertas

- (inferido) La CLI puede conservar los resultados hasta que vuelva una conexión. La guía de CLI consultada no confirmó esto.
- (inferido) Los teléfonos antiguos pueden no ejecutar bien la aplicación móvil. No probado ni verificado aquí.
- La licencia del software de OONI está enlazada desde la página de riesgos como [github.com/ooni/license](https://github.com/ooni/license). El texto no fue revisado para esta guía.
- La guía no documenta cómo desactivar las pruebas automatizadas de la CLI en Debian/Ubuntu o Raspberry Pi. Verifica con OONI antes de confiar en cualquier método.

## Fuentes

Consultadas el 2026-10-30.

- https://ooni.org/ (página principal de OONI: qué hacen el proyecto y la aplicación)
- https://ooni.org/install (plataformas: Android, iOS, Windows, macOS, Linux y CLI de macOS)
- https://ooni.org/support/ooni-probe-cli (plataformas de CLI, pruebas automatizadas por defecto en Debian/Ubuntu y Raspberry Pi, comandos de revisión de OONI_HOME, autorun solo en macOS, sharing.upload_results)
- https://ooni.org/about/data-policy/ (campos recopilados por defecto, publicación de IP por M-Lab para pruebas de rendimiento)
- https://ooni.org/about/risks/ (publicación por defecto, opción de no participar, riesgos legales y de seguridad, enlace a la licencia del software)
- https://explorer.ooni.org/ (OONI Explorer: datos abiertos)