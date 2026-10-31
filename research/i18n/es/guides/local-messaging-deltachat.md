---
title: Mensajería local con Delta Chat
sourcePath: guides/local-messaging-deltachat.md
sourceHash: 67fb831428321077
translatedBy: glm-4.6
---

# Mensajería local con Delta Chat

Esta guía explica Delta Chat y su red de relés. Muestra lo que la documentación oficial describe para el uso sin conexión. Compara cuatro opciones para una Community Box.

## Qué es Delta Chat

[Delta Chat](https://delta.chat/en/) es un mensajero libre y de código abierto. Funciona en Android, iOS y escritorio. Obtén las aplicaciones desde [get.delta.chat](https://get.delta.chat).

Delta Chat usa estándares de correo electrónico de internet. Los mensajes viajan a través de relés de chatmail, que son servidores de correo. Delta Chat usa un subconjunto seguro de OpenPGP para el cifrado de extremo a extremo. Los contactos intercambian claves mediante código QR o enlace de invitación, usando Secure-Join ([FAQ](https://delta.chat/en/help)).

Autocrypt configura el cifrado entre contactos y miembros de grupos automáticamente ([FAQ](https://delta.chat/en/help)). La FAQ dice que Autocrypt v2 está previsto para 2026. Esta guía no verificó si ya se ha lanzado.

## Relés de chatmail

Un relé guarda los mensajes mientras un dispositivo está sin conexión. Los relés no almacenan nombres de grupos, avatares ni detalles de contacto ([FAQ](https://delta.chat/en/help)).

De forma predeterminada, la aplicación configura los relés por ti ([FAQ](https://delta.chat/en/help)). La página [chatmail.at/relays](https://chatmail.at/relays) lista los relés públicos. Nombra a nine.testrun.org como el relé de incorporación predeterminado para muchas aplicaciones de chatmail.

Una comunidad puede ejecutar su propio relé. El [repositorio del relé](https://github.com/chatmail/relay) contiene las herramientas de instalación. La [guía de instalación](https://chatmail.at/doc/relay/getting_started.html) lista estos requisitos:

- Un servidor Debian 12 con los puertos SMTP, submission, IMAPS y HTTPS accesibles.
- 1 GB de RAM, una CPU y unos 10 GB de almacenamiento para unos pocos miles de direcciones.
- Control de un dominio a través de un proveedor de DNS.
- Una máquina de compilación con acceso por clave SSH al usuario root del servidor.

La instalación necesita un registro DNS A para el dominio. La [guía de instalación](https://chatmail.at/doc/relay/getting_started.html) recomienda IPv6 cuando está disponible, por lo que también muestra un registro AAAA. El registro AAAA es recomendable, no obligatorio. Los dominios que comienzan con un guion bajo usan certificados autofirmados en lugar de Let's Encrypt.

La documentación describe un relé experimental de solo IP. No necesita dominio y puede usar una dirección IPv4 en una red local. La [página de solo IP](https://chatmail.at/doc/relay/iponly.html) indica tres limitaciones:

- La opción es experimental y puede cambiar sin previo aviso.
- El cifrado del transporte usa certificados autofirmados, que la página califica de vulnerables a ataques de intermediario (man-in-the-middle).
- Los mensajes no están firmados con DKIM. Algunos relés pueden rechazarlos.

La documentación no dice si un relé funciona sin enlace a internet. Esta guía lo trata como desconocido.

## Funciones locales y sin conexión en la documentación

La documentación oficial describe estas funciones locales:

- **Transferencia a un segundo dispositivo.** Ambos dispositivos deben estar en la misma red Wi-Fi o red. Un código QR inicia la transferencia ([FAQ](https://delta.chat/en/help)).
- **Punto de acceso móvil como alternativa.** Si los dispositivos no pueden verse entre sí, la FAQ sugiere un punto de acceso de teléfono.
- **Contacto cara a cara.** Un código QR añade un miembro en persona ([FAQ](https://delta.chat/en/help)).
- **Aplicaciones dentro del chat.** Las aplicaciones Webxdc son archivos zip que se ejecutan dentro de los chats ([webxdc FAQ](https://delta.chat/en/help)).

La documentación no describe un modo de chat solo para LAN. La documentación no dice que el chat funcione sin un relé. La documentación oficial no confirma el chat sin conexión entre dos aplicaciones Delta Chat. ButterBox describe una configuración sin conexión en su propio blog, que se cubre más abajo.

## Opciones para una Community Box

| Opción | ¿Necesita internet? | ¿Necesita dominio? | Esfuerzo |
|---|---|---|---|
| (a) Relés de chatmail públicos | Sí | No | Bajo: instalar la aplicación y elegir un relé |
| (b) Autoalojar un relé de chatmail | Sí para uso público. El uso solo en LAN no está documentado | Sí para la configuración estándar. La opción de solo IP es experimental | Alto: servidor Debian 12, DNS, SSH, herramientas de despliegue |
| (c) ButterBox en una Raspberry Pi, solo chat | No | No | Medio: construir u obtener la caja |
| (d) Delta Chat a través de una ButterBox | No | No | Medio: la misma caja que (c), más la configuración de Delta Chat |

La opción (a) encaja en un sitio con acceso a internet. La opción (b) encaja en un sitio que pueda alojar un servidor con DNS público. La opción (b) incluye el relé experimental de solo IP. Ese relé es independiente de la opción (d). La opción (d) usa un relé que se ejecuta en la propia caja.

ButterBox es la opción sin conexión en esta revisión. Emite su propia red Wi-Fi. [Butter Box](https://likebutter.app/) dice que funciona sin internet. Los usuarios se unen a una sala de chat pública o crean una privada. El sitio lista el chat cifrado como una característica. Dice que todo se almacena en la caja. La [documentación](https://likebutter.app/docs) describe la caja como un punto de acceso con contenido local.

La opción (d) es la configuración concreta de Delta Chat sin conexión. La [página de Secure Messenger](https://likebutter.app/docs/services/secure-messenger) dice que las personas en la misma Butter Box pueden enviarse mensajes entre sí sin internet. La [publicación de ButterBox Delta Chat](https://likebutter.app/blog/butterbox-deltachat) dice que la caja ejecuta un servidor local MadMail, un servidor de chatmail de código abierto. La aplicación en cada dispositivo se configura con ese servidor local. La publicación llama a una sola ButterBox un centro de mensajería asíncrona. Dice que la aplicación de Android y MadMail vienen incluidas en el firmware base. Muestra un cliente de escritorio Linux funcionando, pero dice que empaquetar la aplicación de escritorio y el soporte web local son planes futuros. Las primeras pruebas se describen como prometedoras. Trata esto como una configuración de una sola caja que aún no está completa. Esta guía no la ha probado.

Comentarios de la comunidad de GG2026 dicen que Delta Chat y ButterBox funcionaron ambos en una red local. Esto no está verificado, por lo que no se recomienda ninguna opción a partir de ello. El mismo comentario dice que AIR y DashChat planean soporte de servidor local y carecen de financiación comprometida o de una hoja de ruta. Esto tampoco está verificado. El [informe de FIFAfrica 2026](https://likebutter.app/blog/fifafrica-2026) describe una demostración sin conexión de DashChat. DashChat funcionó sin conexión con una Butter Box como su servidor, y su centro de mensajes local se añadió a Butter Box. El informe no menciona AIR. Ni AIR ni DashChat se recomiendan todavía.
## Notas de privacidad

Los servidores de Delta Chat ven las direcciones del remitente y del destinatario y el tamaño de los mensajes ([FAQ](https://delta.chat/en/help)). Las direcciones son aleatorias por defecto. Otros datos de contactos y grupos viajan cifrados de extremo a extremo dentro de los mensajes y se guardan en los dispositivos. Los relays también ven la dirección IP de cada usuario, porque la necesitan para entregar los mensajes ([FAQ](https://delta.chat/en/help)).

Para usos sensibles, crea un perfil separado con una dirección aleatoria. La FAQ recomienda esto para limitar la recopilación de metadatos. Un perfil separado no protege por sí solo los datos en un teléfono o computadora que sea incautada. Activa también el cifrado de disco propio del dispositivo y el bloqueo de pantalla. Una [nota de un desarrollador de Delta Chat](https://support.delta.chat/t/researching-a-zero-trust-storage-layer-for-deltachat-core-rust-thoughts/4554/6) recomienda confiar en el cifrado del sistema operativo para los datos almacenados.

Los operadores de relays ejecutan sus propios servidores. Los relays públicos son operados por distintos grupos y personas ([página de relays](https://chatmail.at/relays)). La documentación de los relays describe como objetivo no recopilar datos privados ni metadatos ([repositorio del relay](https://github.com/chatmail/relay)). Ese es un objetivo de diseño, no el resultado de una auditoría.

La documentación no menciona los tiempos de los mensajes como visibles para los relays. Es probable que los relays vean cuándo llegan los mensajes (inferido).

**Advertencia: cambia las credenciales predeterminadas de ButterBox antes de desplegarla.** El equipo viene con credenciales predeterminadas documentadas para tres cuentas: el usuario del sistema operativo, el administrador del punto de acceso y el administrador del chat. La red Wi-Fi está abierta por defecto, sin contraseña. Cualquier persona cercana puede unirse a la red. Cualquiera que conozca la credencial predeterminada del administrador del chat puede tomar el control de la administración del chat. Cambia las tres credenciales y añade una contraseña Wi-Fi antes de que el equipo sirva a los usuarios. La [guía de seguridad de ButterBox](https://likebutter.app/docs/security) enumera los pasos. La [guía de inicio rápido](https://likebutter.app/docs/quick-start) indica que la red Wi-Fi está abierta por defecto y muestra cómo añadir una contraseña Wi-Fi en Admin Settings.

## Preguntas abiertas

- Qué configuración local de Delta Chat se usó en GG2026 no está confirmado. La configuración de Delta Chat de ButterBox es una candidata probable (inferido).
- Si un relay autoalojado o solo con IP funciona sin conexión a internet es desconocido. La documentación calla al respecto.
- Si Autocrypt v2 ya se ha lanzado es desconocido.
- Los detalles del cifrado del chat de ButterBox son desconocidos. Las fuentes revisadas no los describen.