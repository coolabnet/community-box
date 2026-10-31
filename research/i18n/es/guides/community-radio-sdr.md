---
title: Radio Comunitaria y Prácticas de SDR
sourcePath: guides/community-radio-sdr.md
sourceHash: 9a689f5efd5359ca
translatedBy: glm-4.6
---

# Radio, Mensajes y Cámaras para Monitoreo Local: Prácticas

Algunas redes comunitarias cubren zonas sin internet. Los integrantes pueden necesitar enviar un mensaje corto, una lectura de agua o un valor de sensor por radio. Algunos también usan cámaras para vigilar sitios compartidos. Esta nota explica las herramientas básicas y las reglas que se deben revisar primero. Es una nota de prácticas, no una guía de productos. Aquí no se recomienda ninguna herramienta.

## Qué es SDR

La radio definida por software (SDR) usa software para procesar señales de radio que capta un receptor. Un dongle USB de bajo costo basado en el chip RTL-SDR es un punto de partida común. [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) lo describe como un dongle de unos $30 que convierte una computadora en un escáner de radio. La página dice que el dongle puede recibir frecuencias de 500 kHz hasta 1.75 GHz, según el modelo. El rango útil depende del chip sintonizador interno.

El software RTL-SDR es un proyecto abierto. Su [repositorio](https://github.com/osmocom/rtl-sdr) lo describe como la conversión de un dongle DVB basado en RTL2832 en un receptor SDR. El repositorio indica una licencia GPL-2.0.

## Recibir y Transmitir Son Diferentes

Los dongles RTL-SDR no pueden transmitir. [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) lo dice directamente. Un dongle de solo recepción puede escuchar señales. No puede enviarlas.

Transmitir requiere más cuidado. La mayoría de los países exigen una licencia o una autorización antes de que una estación transmita en la mayoría de las frecuencias. Algunas bandas están exentas de licencia, pero tienen límites de potencia y de uso. (inferido) La Unión Internacional de Telecomunicaciones (UIT) publica el Reglamento de Radiocomunicaciones. Es el tratado internacional que gobierna cómo se comparte el espectro radioeléctrico ([ITU Radio Regulations](https://www.itu.int/pub/R-REG-RR)). La página de la UIT no establece la regla de licencias en su propio texto. Consulta a tu regulador nacional para conocer la regla que te aplica. (inferido para la mayoría de los países; ver Preguntas Abiertas)

Regla práctica: primero escucha. No transmitas hasta haber verificado la licencia para tu país, tu frecuencia y tu nivel de potencia.

## LoRa y Meshtastic para Mensajes Cortos

LoRa es un método de radio para enlaces de bajo consumo y largo alcance. La [LoRa Alliance](https://lora-alliance.org/about-lorawan/) dice que LoRaWAN opera en bandas de radio sin licencia. Las bandas sin licencia igual tienen reglas sobre potencia y tiempo en el aire. Revísalas para tu país. (inferido)

Meshtastic es un proyecto de código abierto que funciona con radios LoRa. Su [documentación](https://meshtastic.org/docs/) dice que funciona sin teléfono para mensajes de malla y no necesita un enrutador dedicado. Su [descripción general](https://meshtastic.org/docs/overview/) establece estos puntos:

- La carga útil de un mensaje es de máximo 239 bytes. El cliente limita los mensajes a unos 200 bytes.
- Cada repetición reduce el límite de saltos en uno. Un nodo con límite de saltos 0 no repite el mensaje.
- Aún se necesita una aplicación cliente. Se conecta al nodo por Bluetooth, Wi-Fi, Ethernet o serie.
- Internet es opcional. Solo se usa para MQTT, que conecta un nodo a internet.

El repositorio del firmware indica una licencia GPL-3.0 ([meshtastic/firmware](https://github.com/meshtastic/firmware)).

Esto sirve para mensajes de texto cortos y lecturas de sensores. No sirve para fotos, video ni archivos grandes. Mantén cada mensaje corto y de formato fijo. Por ejemplo, una lectura de agua podría seguir este patrón: código del sitio, fecha, hora, lectura e iniciales de quien lee. Usa el mismo patrón cada vez para que el receptor pueda interpretarlo a mano.

La descripción general no nombra las placas compatibles. Esta nota no recomienda ninguna.

## Cámaras y CCTV

Las cámaras que graban a personas plantean problemas de privacidad. La guía del consejo europeo de protección de datos sobre dispositivos de video cubre esto en detalle ([EDPB Guidelines 3/2019](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf)). Puntos clave de esa guía:

- Coloca un letrero de advertencia en un punto fácil de ver antes del área monitoreada, aproximadamente a la altura de los ojos. Indica el propósito y el responsable, y dónde encontrar más información.
- Conserva las grabaciones almacenadas solo el tiempo necesario. Bórralas, idealmente de forma automática, después de unos días. Almacenar más allá de 72 horas requiere una razón más sólida.
- Define un período de retención claro para cada propósito.

Esta guía está escrita para la UE. Otros países tienen sus propias reglas. Consulta las tuyas.

Pasos prácticos:

- Decide primero el propósito. Vigilar un tanque de agua es un propósito diferente a grabar personas en una puerta.
- Apunta las cámaras a lo que necesitas ver, no a viviendas ni a senderos que usa la gente.
- Limita quién puede ver las grabaciones. Informa a las personas que hay cámaras en uso.

## Monitoreo Humano de Territorios

Las cámaras y la radio solo ayudan cuando una persona revisa los datos. Establece un turno de lecturas y una regla de alertas. Haz pruebas antes de una emergencia.

## Preguntas Abiertas

- La regla de licencias para transmitir en tu país y en tu frecuencia elegida. No se verificó aquí. (inferido que la mayoría de los países exigen licencia para la mayoría de las transmisiones)
- Límites de potencia y tiempo en el aire para LoRa en tu región. No se verificaron aquí.
- Opciones de hardware para nodos LoRa y su costo. No se recomienda ninguna aquí.
- Reglas locales sobre CCTV y consentimiento fuera de la UE. No se verificaron.
- Si una comunidad local puede usar cámaras compartidas sin el consentimiento de cada persona en el campo de visión. Consulta a un abogado local. (inferido)

## Fuentes

Consultadas el 2026-10-30.

- https://www.rtl-sdr.com/about-rtl-sdr/ (el dongle es de solo recepción, unos $30, notas sobre rango de frecuencias)
- https://github.com/osmocom/rtl-sdr (descripción del software RTL-SDR, licencia GPL-2.0)
- https://www.itu.int/pub/R-REG-RR (ITU Radio Regulations, el tratado internacional para el espectro radioeléctrico)
- https://lora-alliance.org/about-lorawan/ (LoRa y LoRaWAN, bandas sin licencia)
- https://meshtastic.org/docs/ (descripción de Meshtastic, no se necesita teléfono para mensajes de malla)
- https://meshtastic.org/docs/overview/ (tamaño de carga útil, límite de saltos, conexión del cliente, MQTT es opcional)
- https://github.com/meshtastic/firmware (licencia GPL-3.0)
- https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf (letreros de advertencia, información de primera capa, límites de almacenamiento)