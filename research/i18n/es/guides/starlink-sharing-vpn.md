---
title: Compartiendo Starlink con una VPN
sourcePath: guides/starlink-sharing-vpn.md
sourceHash: 00e901b6fd0866a6
translatedBy: glm-4.6
---

# Compartir una conexión Starlink a través de una red comunitaria

Algunas redes comunitarias usan una conexión Starlink como su enlace de internet. Esta guía explica una configuración básica para compartir ese enlace. También explica por qué los miembros fuera de la red pueden no alcanzar un servidor en el sitio. Se mantiene a nivel conceptual. No es una configuración paso a paso.

## El Problema Central: CGNAT

La configuración IPv4 predeterminada de Starlink no acepta conexiones entrantes. El centro de ayuda de Starlink indica que usa NAT de nivel de operador (CGNAT). CGNAT permite que muchos clientes compartan una dirección pública. Bloquea todos los puertos entrantes, por lo que un servidor detrás de Starlink no puede ser alcanzado desde el exterior por defecto ([Ayuda de Starlink: ¿Qué dirección IP proporciona Starlink?](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

El centro de ayuda de Starlink dice:

- Una dirección IPv4 pública está disponible solo en los planes Local y Global Priority. Se activa desde el panel de la cuenta. Verifica los términos actuales del plan antes de asumirlo.
- Los routers Wi-Fi propios de Starlink no admiten reenvío de puertos ni reglas de firewall para IPv4 o IPv6.
- Los usuarios que necesitan acceso entrante son dirigidos a un router de terceros o a un plan con opción de IPv4 pública.

La página de ayuda sobre VPN de Starlink dice que las VPN basadas en SSL típicamente funcionan mejor a través de CGNAT. También dice que CGNAT descarta los protocolos 47 (GRE), 50 (ESP), 51 (AH) y 115 (L2TP) ([Ayuda de Starlink: ¿Funciona Starlink con VPNs?](https://starlink.com/support/article/e5dc0b86-09b4-084b-918b-3fa181e5fb5d)).

El centro de ayuda también dice que estas condiciones pueden cambiar a medida que el servicio crece.

## Por Qué una Overlay Ayuda

Una VPN o red overlay le da a cada dispositivo una dirección privada. Los dispositivos se conectan hacia afuera a un punto de control o relay. El tráfico luego se mueve entre dispositivos a través de ese enlace. No se necesita ningún puerto entrante en Starlink.

Dos opciones comunes:

- **WireGuard** es un túnel VPN. El proyecto lo describe como un [túnel VPN rápido, moderno y seguro](https://www.wireguard.com/). Utiliza un conjunto fijo de primitivas criptográficas, incluyendo ChaCha20, Poly1305 y Curve25519 ([página del protocolo WireGuard](https://www.wireguard.com/protocol/)). Tú gestionas las claves y los peers.
- **Tailscale** está construido sobre WireGuard. Su documentación lo describe como una [plataforma de conectividad Zero Trust basada en identidad](https://tailscale.com/kb/1151/what-is-tailscale). Su propia descripción dice que funciona como una red overlay entre tus dispositivos y usa NAT traversal ([README de Headscale, citando a Tailscale](https://github.com/juanfont/headscale)).
- **Headscale** es un servidor de control autoalojado y de código abierto para clientes de Tailscale. Cubre un solo tailnet, orientado a uso personal o grupos pequeños ([README de Headscale](https://github.com/juanfont/headscale)). El README de Headscale dice que el software cliente de Tailscale es de código abierto, excepto los clientes GUI para Windows, macOS e iOS, y el servidor de control.

La documentación de Tailscale dice que los exit nodes pueden enrutar todo el tráfico de un dispositivo a través de un nodo elegido. También dicen que los exit nodes están disponibles en todos los planes ([exit nodes de Tailscale](https://tailscale.com/kb/1103/exit-nodes)). Verifica los términos actuales del plan antes de confiar en esto.

## Topología Básica

Una disposición simple:

1. La antena y el router de Starlink proporcionan el enlace de internet.
2. Un dispositivo gateway ejecutando OpenWrt o LibreMesh se conecta al router de Starlink. LibreMesh es un [framework para construir firmware basado en OpenWrt para nodos de malla inalámbrica](https://libremesh.org/).
3. El gateway comparte el enlace con los nodos de la malla.
4. Un cliente VPN u overlay en el gateway o en un servidor se conecta hacia afuera a un punto de control o a un peer.
5. Los miembros alcanzan el servidor comunitario a través de esa overlay. El servidor permanece detrás de CGNAT.

El gateway es el punto crítico. Si falla, toda la red pierde su enlace. Planifica una ruta de respaldo o un fallback claro.

## Ancho de Banda y Uso Justo

Un enlace compartido tiene una capacidad fija. Muchos miembros en un solo enlace pueden ralentizarse entre sí. Establece límites antes de lanzar el servicio:

- Decide quién puede usar el enlace y para qué.
- Observa el uso durante unas semanas.
- Da prioridad a los servicios que la comunidad necesita, como la mensajería o el servidor comunitario.

Los límites de datos, las reglas de uso justo y las políticas de velocidad de Starlink difieren según el plan. Esta guía no los verificó. Consulta los términos actuales de tu plan.

## Términos de Reventa y Compartición

Los términos de servicio de Starlink rigen si puedes compartir o revender la conexión. La página en [starlink.com/legal](https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service) no se mostró en la captura utilizada para esta guía. No asumas que compartir está permitido. Lee los términos y consulta al soporte de Starlink por escrito antes de compartir el enlace con una comunidad.

## Preguntas Abiertas

- Las reglas de compartición y reventa en los términos de servicio de Starlink no fueron verificadas. Ver la sección anterior.
- (inferido) Si la dirección IPv4 pública del plan Priority funciona para los dispositivos de todos los miembros de la comunidad. No probado.
- (inferido) Si un router de terceros dado puede pasar una dirección pública a través de Starlink. No verificado en las fuentes consultadas.
- Límites de datos actuales y política de uso justo de los planes de Starlink. No verificado.

## Fuentes

Consultadas el 2026-10-30. Las páginas de ayuda de Starlink devolvieron solo las estructuras de las páginas en la captura. Las afirmaciones sobre Starlink anteriores provienen de extractos de búsqueda de esas mismas URLs del centro de ayuda, así que verifícalas en las páginas en vivo.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (dirección IP, CGNAT, planes IPv4 públicos, limitaciones del router)
- https://starlink.com/support/article/e5dc0b86-09b4-084b-918b-3fa181e5fb5d (guía de VPN, protocolos descartados por CGNAT)
- https://www.wireguard.com/ (descripción de WireGuard y criptografía)
- https://www.wireguard.com/protocol/ (primitivas utilizadas)
- https://tailscale.com/kb/1151/what-is-tailscale (descripción de Tailscale)
- https://tailscale.com/kb/1103/exit-nodes (exit nodes)
- https://github.com/juanfont/headscale (propósito de Headscale, estado de código abierto)
- https://libremesh.org/ (descripción de LibreMesh)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (no se mostró; listado para la verificación de términos)