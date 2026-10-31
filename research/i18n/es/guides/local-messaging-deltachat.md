---
title: Mensajería local con Delta Chat
sourcePath: guides/local-messaging-deltachat.md
sourceHash: 56d6e6626521f5c7
translatedBy: glm-4.6
---

# Mensajería local con Delta Chat

Esta guía explica Delta Chat y su red de relés. Muestra lo que la documentación oficial describe para el uso sin conexión. Compara tres opciones para una Community Box.

## Qué es Delta Chat

[Delta Chat](https://delta.chat/en/) es un mensajero libre y de código abierto. Funciona en Android, iOS y escritorio. Descarga las aplicaciones desde [get.delta.chat](https://get.delta.chat).

Delta Chat utiliza los estándares de correo electrónico de internet. Los mensajes viajan a través de relés de chatmail, que son servidores de correo. Delta Chat usa un subconjunto seguro de OpenPGP para el cifrado de extremo a extremo. Los contactos intercambian claves mediante código QR o enlace de invitación, usando Secure-Join ([FAQ](https://delta.chat/en/help)).

Autocrypt configura el cifrado entre contactos y miembros de grupos automáticamente ([FAQ](https://delta.chat/en/help)). La FAQ indica que Autocrypt v2 está previsto para 2026. Esta guía no verificó si ya se ha lanzado.

## Relés de chatmail

Un relé almacena los mensajes mientras un dispositivo está sin conexión. Los relés no almacenan nombres de grupos, avatares ni datos de contacto ([FAQ](https://delta.chat/en/help)).

Por defecto, la aplicación configura los relés por ti ([FAQ](https://delta.chat/en/help)). La página [chatmail.at/relays](https://chatmail.at/relays) enumera los relés públicos. Menciona nine.testrun.org como el relé de registro predeterminado para muchas aplicaciones de chatmail.

Una comunidad puede ejecutar su propio relé. El [repositorio del relé](https://github.com/chatmail/relay) contiene las herramientas de instalación. La [guía de configuración](https://chatmail.at/doc/relay/getting_started.html) enumera estos requisitos:

- Un servidor Debian 12 con puertos SMTP, submission, IMAPS y HTTPS accesibles.
- 1 GB de RAM, una CPU y unos 10 GB de almacenamiento para unos pocos miles de direcciones.
- Control de un dominio a través de un proveedor de DNS.
- Una máquina de compilación con acceso por clave SSH al usuario root del servidor.

La configuración necesita registros DNS A y AAAA para el dominio. Los dominios que comienzan con guion bajo usan certificados autofirmados en lugar de Let's Encrypt.

La documentación describe un relé experimental de solo IP. No necesita dominio y puede usar una dirección IPv4 en una red local. La [página de solo IP](https://chatmail.at/doc/relay/iponly.html) indica tres limitaciones:

- La opción es experimental y puede cambiar sin previo aviso.
- El cifrado de transporte usa certificados autofirmados, que la página califica como vulnerables a ataques de intermediario (man-in-the-middle).
- Los mensajes no están firmados con DKIM. Algunos relés pueden rechazarlos.

La documentación no dice si un relé funciona sin enlace a internet. Esta guía lo considera desconocido.

## Funciones locales y sin conexión en la documentación

La documentación oficial describe estas funciones locales:

- **Transferencia a un segundo dispositivo.** Ambos dispositivos deben estar en la misma red Wi-Fi o red. Un código QR inicia la transferencia ([FAQ](https://delta.chat/en/help)).
- **Alternativa de punto de acceso móvil.** Si los dispositivos no pueden verse entre sí, la FAQ sugiere un hotspot de teléfono.
- **Contacto cara a cara.** Un código QR añade un miembro en persona ([FAQ](https://delta.chat/en/help)).
- **Aplicaciones dentro del chat.** Las aplicaciones Webxdc son archivos zip que se ejecutan dentro de los chats ([webxdc FAQ](https://delta.chat/en/help)).

La documentación no describe un modo de chat solo para LAN. La documentación no dice que el chat funcione sin un relé. Ninguna fuente oficial en esta revisión confirma el chat sin conexión entre dos aplicaciones de Delta Chat.

## Opciones para una Community Box

| Opción | ¿Necesita internet? | ¿Necesita dominio? | Esfuerzo |
|---|---|---|---|
| (a) Relés públicos de chatmail | Sí | No | Bajo: instalar la aplicación y elegir un relé |
| (b) Autoalojar un relé de chatmail | Sí para uso público. El uso solo en LAN no está documentado | Sí para la configuración estándar. La opción de solo IP es experimental | Alto: servidor Debian 12, DNS, SSH, herramientas de despliegue |
| (c) ButterBox en una Raspberry Pi | No | No | Medio: construir u obtener la caja |

La opción (a) se adapta a un sitio con acceso a internet. La opción (b) se adapta a un sitio que pueda alojar un servidor con DNS público.

ButterBox es la opción sin conexión en esta revisión. Emite su propia red Wi-Fi. [Butter Box](https://likebutter.app/) dice que funciona sin internet. Los usuarios se unen a una sala de chat pública o crean una privada. El sitio enumera el chat cifrado como una característica. Dice que todo se almacena en la caja. La [documentación](https://likebutter.app/docs) describe la caja como un hotspot con contenido local.

En GG2026, tanto Delta Chat como ButterBox funcionaron en una red local, según comentarios de la comunidad. AIR y DashChat prometieron soporte para servidor local. No tienen financiación ni hoja de ruta comprometidas, por lo que aún no se recomiendan.

## Notas de privacidad

Los servidores de Delta Chat ven las direcciones del remitente y el destinatario y el tamaño del mensaje ([FAQ](https://delta.chat/en/help)). Las direcciones son aleatorias por defecto. Todos los demás datos de contacto y de grupo están cifrados en los dispositivos.

Para un uso sensible, crea un perfil separado con una dirección aleatoria. La FAQ recomienda esto como protección contra la recopilación de metadatos y el decomiso del dispositivo.

Los operadores de relés ejecutan sus propios servidores. Los relés públicos son administrados por diferentes grupos y personas ([página de relés](https://chatmail.at/relays)). La documentación del relé describe como objetivo no recopilar datos privados ni metadatos ([repositorio del relé](https://github.com/chatmail/relay)). Ese es un objetivo de diseño, no un resultado de auditoría.

La documentación no indica que el momento de los mensajes sea visible para los relés. Los relés probablemente ven cuándo llegan los mensajes (inferido).

El sitio de ButterBox solo dice que tiene chat cifrado. No tiene página de seguridad en las fuentes revisadas.

## Preguntas abiertas

- Qué transporte local funcionó en GG2026 es desconocido. Esto está pendiente de la decisión Q20. Confirmar con quien hizo la demostración antes de publicar.
- Si un relé autoalojado o de solo IP funciona sin enlace a internet es desconocido. La documentación no lo menciona.
- Si dos aplicaciones de Delta Chat pueden chatear en una LAN sin relé es desconocido (inferido: se necesita un relé).
- Si Autocrypt v2 ya se ha lanzado es desconocido.
- Los detalles del cifrado de chat de ButterBox son desconocidos. Las fuentes revisadas no los describen.