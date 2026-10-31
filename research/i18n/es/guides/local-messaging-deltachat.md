---
title: Mensajería local con Delta Chat
sourcePath: guides/local-messaging-deltachat.md
sourceHash: a0131c83367d2a3e
translatedBy: glm-4.6
---

# Mensajería local con Delta Chat

Esta guía explica Delta Chat y su red de relés. Muestra lo que describen los documentos oficiales para el uso sin conexión. Compara tres opciones para una Community Box.

## Qué es Delta Chat

[Delta Chat](https://delta.chat/en/) es un mensajero libre y de código abierto. Funciona en Android, iOS y escritorio. Consigue las aplicaciones en [get.delta.chat](https://get.delta.chat).

Delta Chat usa los estándares de correo electrónico de internet. Los mensajes viajan a través de relés chatmail, que son servidores de correo. Delta Chat usa un subconjunto seguro de OpenPGP para el cifrado de extremo a extremo. Los contactos intercambian claves mediante código QR o enlace de invitación, usando Secure-Join ([FAQ](https://delta.chat/en/help)).

Autocrypt configura el cifrado entre contactos y miembros de grupos automáticamente ([FAQ](https://delta.chat/en/help)). La FAQ indica que Autocrypt v2 está previsto para 2026. Esta guía no verificó si ya se ha lanzado.

## Relés chatmail

Un relé guarda los mensajes mientras un dispositivo está sin conexión. Los relés no almacenan nombres de grupos, avatares ni datos de contacto ([FAQ](https://delta.chat/en/help)).

Por defecto, la aplicación configura los relés por ti ([FAQ](https://delta.chat/en/help)). La página [chatmail.at/relays](https://chatmail.at/relays) lista los relés públicos. Nombra a nine.testrun.org como el relé de registro predeterminado para muchas aplicaciones chatmail.

Una comunidad puede ejecutar su propio relé. El [repositorio del relé](https://github.com/chatmail/relay) contiene las herramientas de instalación. La [guía de instalación](https://chatmail.at/doc/relay/getting_started.html) lista estos requisitos:

- Un servidor Debian 12 con puertos SMTP, submission, IMAPS y HTTPS accesibles.
- 1 GB de RAM, una CPU y unos 10 GB de almacenamiento para unos pocos miles de direcciones.
- Control de un dominio a través de un proveedor de DNS.
- Una máquina de compilación con acceso por clave SSH al usuario root del servidor.

La instalación necesita registros DNS A y AAAA para el dominio. Los dominios que comienzan con un guion bajo usan certificados autofirmados en lugar de Let's Encrypt.

Los documentos describen un relé experimental solo por IP. No necesita dominio y puede usar una dirección IPv4 en una red local. La [página de solo IP](https://chatmail.at/doc/relay/iponly.html) indica tres limitaciones:

- La opción es experimental y puede cambiar sin previo aviso.
- El cifrado del transporte usa certificados autofirmados, que la página califica de vulnerables a ataques de intermediario (man-in-the-middle).
- Los mensajes no están firmados con DKIM. Algunos relés pueden rechazarlos.

Los documentos no dicen si un relé funciona sin enlace a internet. Esta guía lo trata como desconocido.

## Funciones locales y sin conexión en los documentos

Los documentos oficiales describen estas funciones locales:

- **Transferencia a un segundo dispositivo.** Ambos dispositivos deben estar en la misma red Wi-Fi o red. Un código QR inicia la transferencia ([FAQ](https://delta.chat/en/help)).
- **Punto de acceso móvil como alternativa.** Si los dispositivos no pueden verse entre sí, la FAQ sugiere un hotspot de teléfono.
- **Contacto cara a cara.** Un código QR añade a un miembro en persona ([FAQ](https://delta.chat/en/help)).
- **Aplicaciones dentro del chat.** Las aplicaciones webxdc son archivos zip que se ejecutan dentro de los chats ([webxdc FAQ](https://delta.chat/en/help)).

Los documentos no describen un modo de chat solo en LAN. Los documentos no dicen que el chat funcione sin un relé. Ninguna fuente oficial en esta revisión confirma el chat sin conexión entre dos aplicaciones Delta Chat.

## Opciones para una Community Box

| Opción | ¿Necesita internet? | ¿Necesita dominio? | Esfuerzo |
|---|---|---|---|
| (a) Relés chatmail públicos | Sí | No | Bajo: instalar la aplicación y elegir un relé |
| (b) Autoalojar un relé chatmail | Sí para uso público. El uso solo en LAN no está documentado | Sí para la instalación estándar. La opción de solo IP es experimental | Alto: servidor Debian 12, DNS, SSH, herramientas de despliegue |
| (c) ButterBox en una Raspberry Pi | No | No | Medio: construir u obtener la caja |

La opción (a) encaja en un sitio con acceso a internet. La opción (b) encaja en un sitio que pueda alojar un servidor con DNS público.

ButterBox es la opción sin conexión en esta revisión. Emite su propia red Wi-Fi. [Butter Box](https://likebutter.app/) dice que funciona sin internet. Los usuarios se unen a una sala de chat pública o crean una privada. El sitio lista el chat cifrado como una característica. Dice que todo se almacena en la caja. Los [documentos](https://likebutter.app/docs) describen la caja como un hotspot con contenido local.

En GG2026, tanto Delta Chat como ButterBox funcionaron en una red local, según comentarios de la comunidad. AIR y DashChat prometieron soporte para servidor local. No tienen financiación comprometida ni hoja de ruta, así que aún no se recomiendan.

## Notas de privacidad

Los servidores de Delta Chat ven las direcciones del remitente y del destinatario y el tamaño del mensaje ([FAQ](https://delta.chat/en/help)). Las direcciones son aleatorias por defecto. Todos los demás datos de contacto y de grupo están cifrados en los dispositivos.

Para un uso sensible, crea un perfil separado con una dirección aleatoria. La FAQ recomienda esto como protección contra la recopilación de metadatos y el decomiso del dispositivo.

Los operadores de relés ejecutan sus propios servidores. Los relés públicos son operados por distintos grupos y personas ([página de relés](https://chatmail.at/relays)). Los documentos del relé describen como objetivo no recopilar datos privados ni metadatos ([repositorio del relé](https://github.com/chatmail/relay)). Eso es un objetivo de diseño, no el resultado de una auditoría.

Los documentos no listan la hora de los mensajes como visible para los relés. Es probable que los relés vean cuándo llegan los mensajes (inferido).

El sitio de ButterBox solo dice que tiene chat cifrado. No tiene una página de seguridad en las fuentes revisadas.

## Preguntas abiertas

- Qué configuración local usó Delta Chat en GG2026 aún no está documentado. Esta guía lo añadirá cuando el demostrador lo confirme.
- Si un relé autoalojado o de solo IP funciona sin enlace a internet es desconocido. Los documentos callan al respecto.
- Si dos aplicaciones Delta Chat pueden chatear en una LAN sin relé es desconocido (inferido: se necesita un relé).
- Si Autocrypt v2 ya se ha lanzado es desconocido.
- Los detalles del cifrado de chat de ButterBox son desconocidos. Las fuentes revisadas no los describen.