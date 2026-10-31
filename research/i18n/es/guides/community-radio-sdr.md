---
title: Radio Comunitaria y Prácticas de SDR
sourcePath: guides/community-radio-sdr.md
sourceHash: 6f735e37bdff31a2
translatedBy: glm-4.6
---

# Radio, Mensajes y Cámaras para Monitoreo Local: Prácticas

Algunas redes comunitarias cubren zonas sin internet. Los integrantes pueden necesitar enviar un mensaje corto, una lectura de agua o un valor de sensor por radio. Algunos también usan cámaras para vigilar sitios compartidos. Esta nota explica las herramientas básicas y las reglas que se deben verificar primero. Es una nota de prácticas, no una guía de productos. Aquí no se respalda ninguna herramienta.

## Qué es la SDR

La radio definida por software (SDR) usa software para procesar las señales de radio que capta un receptor. Un dongle USB de bajo costo basado en el chip RTL-SDR es un punto de partida común. [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) lo describe como un dongle de unos $30 que convierte una computadora en un escáner de radio. La página dice que el dongle puede recibir frecuencias desde 500 kHz hasta 1.75 GHz, según el modelo. El rango utilizable depende del chip sintonizador interno.

El software RTL-SDR es un proyecto abierto. Su [repositorio](https://github.com/osmocom/rtl-sdr) lo describe como la conversión de un dongle DVB basado en RTL2832 en un receptor SDR. El repositorio indica una licencia GPL-2.0.

## Recibir y Transmitir Son Cosas Distintas

Los dongles RTL-SDR no pueden transmitir. [RTL-SDR.com](https://www.rtl-sdr.com/about-rtl-sdr/) lo dice directamente. Un dongle de solo recepción puede escuchar señales. No puede enviarlas.

Transmitir requiere más cuidado. La mayoría de los países exigen una licencia o una autorización antes de que una estación transmita en la mayoría de las frecuencias. Algunas bandas están exentas de licencia, pero tienen límites de potencia y de uso. (inferido) La Unión Internacional de Telecomunicaciones (UIT) publica el Reglamento de Radiocomunicaciones. Es el tratado internacional que rige cómo se comparte el espectro radioeléctrico ([ITU Radio Regulations](https://www.itu.int/pub/R-REG-RR)). La página de la UIT no indica la regla de licenciamiento en su propio texto. Consulta a tu regulador nacional para conocer la regla que te aplica. (inferido para la mayoría de los países; ver Preguntas Abiertas)

Regla práctica: escucha primero. No transmitas hasta haber verificado la licencia de tu país, tu frecuencia y tu nivel de potencia.

## LoRa y Meshtastic para Mensajes Cortos

LoRa es un método de radio para enlaces de bajo consumo y largo alcance. La [LoRa Alliance](https://lora-alliance.org/about-lorawan/) dice que LoRaWAN opera en bandas de radio sin licencia. Las bandas sin licencia igual tienen reglas sobre potencia y tiempo en el aire. Verifícalas para tu país. (inferido)

Meshtastic es un proyecto de código abierto que funciona en radios LoRa. Su [documentación](https://meshtastic.org/docs/) dice que funciona sin teléfono para mensajes de malla y que no necesita un router dedicado. Su [descripción general](https://meshtastic.org/docs/overview/) señala estos puntos:

- La carga útil de un mensaje es de máximo 239 bytes. El cliente limita los mensajes a unos 200 bytes.
- Cada relé reduce el límite de saltos en uno. Un nodo con límite de saltos 0 no repite el mensaje.
- Normalmente se necesita una app cliente. Se conecta al nodo por Bluetooth, Wi-Fi, Ethernet o serial. Algunos dispositivos tienen una interfaz de pantalla en el dispositivo ([Meshtastic device UI](https://meshtastic.org/docs/configuration/device-uis/meshtasticui/)).
- Internet es opcional. Solo se usa para MQTT, que conecta un nodo a internet.

El repositorio del firmware indica una licencia GPL-3.0 ([meshtastic/firmware](https://github.com/meshtastic/firmware)).

Esto sirve para mensajes de texto cortos y lecturas de sensores. No sirve para fotos, video ni archivos grandes. Mantén cada mensaje corto y de forma fija, para que el receptor pueda interpretarlo a mano.

Advertencia de privacidad: el canal predeterminado (LongFast) usa una clave conocida públicamente, por lo que cualquier persona con una radio Meshtastic puede leer los mensajes en él. No envíes nombres, iniciales ni ubicaciones en el canal predeterminado. Usa un canal privado con su propia clave. Incluso en un canal privado, los metadatos de los paquetes, como el ID del nodo emisor, la temporización y el conteo de saltos, son visibles para cualquiera que reciba los paquetes ([Meshtastic encryption](https://meshtastic.org/docs/overview/encryption/)).

En un canal privado, una lectura de agua podría seguir este patrón: código del sitio, fecha, hora, lectura e iniciales de quien lee. Usa el mismo patrón cada vez.

La descripción general no menciona las tarjetas compatibles. Esta nota no recomienda ninguna.

## Cámaras y CCTV

Las cámaras que graban personas plantean problemas de privacidad. La guía del Consejo Europeo de Protección de Datos sobre dispositivos de video cubre esto en detalle ([EDPB Guidelines 3/2019](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf)). Puntos clave de esa guía:

- Coloca un cartel de advertencia en un punto fácil de ver antes del área monitoreada, aproximadamente a la altura de los ojos. Indica el propósito y el responsable, y dónde encontrar más información.
- Conserva las grabaciones almacenadas solo el tiempo necesario. Bórralas, idealmente automáticamente, después de unos días. Almacenarlas más de 72 horas requiere una razón más fuerte.
- Establece un período de retención claro para cada propósito.

Esta guía está escrita para la UE. Otros países tienen sus propias reglas. Consulta las tuyas.

Pasos prácticos:

- Decide primero el propósito. Vigilar un tanque de agua es un propósito distinto de grabar personas en una entrada.
- Apunta las cámaras a lo que necesitas ver, no a casas ni a senderos usados por personas.
- Limita quién puede ver las grabaciones. Avisa a la gente de que hay cámaras en uso.

## Monitoreo Humano de Territorios

Las cámaras y la radio solo ayudan cuando una persona revisa los datos. Establece un turno de lecturas y una regla de alertas. Haz pruebas antes de una emergencia.

## Preguntas Abiertas

- La regla de licencia para transmitir en tu país y en tu frecuencia elegida. No se verificó aquí. (se infiere que la mayoría de los países exigen licencia para la mayoría de las transmisiones)
- Límites de potencia y de tiempo en el aire para LoRa en tu región. No se verificaron aquí.
- Opciones de hardware para nodos LoRa y su costo. No se respaldan aquí.
- Reglas locales sobre CCTV y consentimiento fuera de la UE. No se verificaron.
- Si una comunidad local puede usar cámaras compartidas sin el consentimiento de cada persona a la vista. Consulta a un abogado local. (inferido)

## Fuentes

Consultadas el 2026-10-30.

- https://www.rtl-sdr.com/about-rtl-sdr/ (dongle es de solo recepción, unos $30, notas sobre rango de frecuencias)
- https://github.com/osmocom/rtl-sdr (descripción del software RTL-SDR, licencia GPL-2.0)
- https://www.itu.int/pub/R-REG-RR (ITU Radio Regulations, el tratado internacional para el espectro radioeléctrico)
- https://lora-alliance.org/about-lorawan/ (LoRa y LoRaWAN, bandas sin licencia)
- https://meshtastic.org/docs/ (descripción general de Meshtastic, no se necesita teléfono para mensajes de malla)
- https://meshtastic.org/docs/overview/ (tamaño de carga útil, límite de saltos, conexión del cliente, MQTT es opcional)
- https://meshtastic.org/docs/overview/encryption/ (la clave del canal predeterminado es pública; los canales privados exponen metadatos de paquetes)
- https://meshtastic.org/docs/configuration/device-uis/meshtasticui/ (interfaz de pantalla en el dispositivo en algunos dispositivos)
- https://github.com/meshtastic/firmware (licencia GPL-3.0)
- https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en_0.pdf (carteles de advertencia, información de primera capa, límites de almacenamiento)