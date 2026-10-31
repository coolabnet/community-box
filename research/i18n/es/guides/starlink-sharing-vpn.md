---
title: Compartir Starlink con una VPN
sourcePath: guides/starlink-sharing-vpn.md
sourceHash: 4f2438bb31534309
translatedBy: glm-4.6
---

# Compartir una Conexión Starlink en una Red Comunitaria

Algunas redes comunitarias usan una conexión Starlink como su enlace a internet. Esta guía explica una configuración básica para compartir ese enlace, y por qué los miembros fuera de la red pueden no alcanzar un servidor en el sitio. Es conceptual, no una configuración paso a paso.

## IPv4 Está Bloqueado de Entrada; IPv6 Es Diferente

La configuración IPv4 predeterminada de Starlink usa NAT de nivel de operador (CGNAT), que comparte una dirección pública entre muchos clientes. Las conexiones IPv4 entrantes están bloqueadas ([ayuda de Starlink](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

Starlink también ofrece IPv6 nativo en sus planes, con un /64 para el lado WAN y un /56 para el lado LAN ([mismo artículo](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4); [FAQ Enterprise](https://starlink.com/na/support/article/4c4d6571-065f-f12a-648a-581aac7a9ef8)). El IPv6 entrante aún necesita una regla de router o firewall para el host y puerto específicos. Los routers Wi-Fi propios de Starlink no ofrecen reenvío de puertos ni reglas de firewall, por lo que un router de terceros es la opción habitual. IPv4 público es una opción aparte, disponible solo en algunos planes.

Muchas redes donde se conectan los miembros aún carecen de IPv6 (inferido). Así que una VPN o overlay sigue siendo la opción más portable.

## Por Qué un Overlay Ayuda

Una VPN u overlay da a cada dispositivo una dirección privada y un túnel cifrado. El túnel todavía necesita una ruta que ambos lados puedan alcanzar.

- **WireGuard** es un [túnel VPN rápido, moderno y seguro](https://www.wireguard.com/). Su [guía de inicio rápido](https://www.wireguard.com/quickstart/) configura cada par con un endpoint y rangos de IP permitidas. Un par debe ser alcanzable en una dirección conocida. Si ambos lados están detrás de CGNAT IPv4, se necesita un tercer host con una dirección alcanzable, como un pequeño servidor alquilado o una ruta IPv6. La guía de inicio rápido no dice qué sucede cuando ambos lados son inalcanzables.
- **Tailscale** funciona sobre WireGuard. Los nodos se inician a través de servidores DERP, que les ayudan a encontrarse entre sí. Tailscale luego intenta una conexión directa. Los relés DERP transportan tráfico solo cuando ninguna ruta directa funciona. El tráfico retransmitido permanece cifrado de extremo a extremo ([tipos de conexión](https://tailscale.com/docs/reference/connection-types)).
- **Headscale** es un servidor de control autoalojado para clientes de Tailscale. Intercambia claves públicas de WireGuard y asigna direcciones ([README](https://github.com/juanfont/headscale)). No retransmite tráfico por sí mismo. Tiene un servidor DERP incorporado, deshabilitado por defecto, que retransmite tráfico entre nodos cuando no se puede realizar una conexión directa ([documentación DERP de Headscale](https://headscale.net/stable/ref/derp/)). Una configuración con Headscale puede retransmitir, pero solo si habilitas y alojas ese componente.

## Alcanzar un Servidor en la Red Local

Un túnel en la puerta de enlace no hace, por sí solo, que un servidor LAN sea alcanzable. Dos opciones:

- **El servidor ejecuta el cliente del túnel.** Obtiene su propia dirección de túnel, y los miembros lo alcanzan directamente. Esta es la opción más simple.
- **La puerta de enlace anuncia la subred LAN.** Esto es un router de subred. Un administrador aprueba la ruta anunciada, y la puerta de enlace reenvía paquetes entre interfaces. Las reglas de firewall deben permitir el tráfico hacia el servidor. Las respuestas deben regresar por la puerta de enlace (inferido). La [guía de router de subred de Tailscale](https://tailscale.com/docs/features/subnet-routers/how-to/setup) cubre anunciar, aprobar y reenviar. No cubre completamente el enrutamiento de retorno, así que pruébalo en tu red.

Con WireGuard, el equivalente son los rangos de IP permitidas del par más las reglas de reenvío y firewall en la puerta de enlace.

## Protocolos Que CGNAT Descarta

El artículo de Starlink sitio a sitio enumera los protocolos que CGNAT descarta: protocolo IP 47 (GRE), 50 (ESP), 51 (AH) y 115 (L2TP) ([ayuda de Starlink](https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857)). El protocolo 115 es un número de protocolo IP, no L2TP sobre UDP. Prueba tu túnel en el enlace real antes de ponerlo en producción.

## Topología Básica

1. La antena y el router de Starlink proporcionan el enlace a internet.
2. Una puerta de enlace con OpenWrt o [LibreMesh](https://libremesh.org/) se conecta al router de Starlink y comparte el enlace con los nodos de la mesh.
3. Un cliente de túnel en la puerta de enlace o en el servidor se conecta a un par o relé alcanzable.
4. Los miembros alcanzan el servidor comunitario a través del túnel, usando una de las opciones de enrutamiento anteriores.

La puerta de enlace es un único punto de fallo. Planifica una ruta de respaldo o una alternativa.

## Ancho de Banda, Términos y Uso Justo

Un enlace compartido tiene una capacidad fija. Decide quién puede usarlo y para qué, y da prioridad a los servicios que la comunidad más necesita. Los límites de datos y las reglas de uso justo de Starlink varían según el plan, y esta guía no los verificó.

Los términos de servicio de Starlink rigen si puedes compartir o revender la conexión. La página de términos no se renderizó en la obtención usada para esta guía. No asumas que compartir está permitido. Consulta primero por escrito al soporte de Starlink.

## Preguntas Abiertas

- Las reglas de compartición y reventa en los términos de servicio de Starlink no fueron verificadas.
- Si el IPv6 entrante funciona a través de tu router y plan. Pruébalo.
- (inferido) Qué tan lejos llega un servidor solo-IPv6, dado cuántas redes de clientes carecen de IPv6.
- (inferido) Detalles de ruta de retorno y NAT para un router de subred.
- (inferido) Cómo clasifica el artículo de Starlink el L2TP sobre UDP, que usa UDP en lugar del protocolo IP 115.

## Fuentes

Obtenido el 2026-10-30. WebFetch de las páginas del centro de ayuda de Starlink devolvió solo la palabra "Starlink," así que las afirmaciones sobre Starlink provienen de extractos de búsqueda de las URLs siguientes. Verifícalas en las páginas en vivo.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (CGNAT, prefijos IPv6; extracto)
- https://starlink.com/na/support/article/4c4d6571-065f-f12a-648a-581aac7a9ef8 (FAQ Enterprise, prefijo IPv6; extracto)
- https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857 (lista de protocolos; extracto)
- https://www.wireguard.com/ y https://www.wireguard.com/quickstart/ (descripción de WireGuard, configuración de pares)
- https://tailscale.com/docs/reference/connection-types (DERP primero, conexión directa, cifrado)
- https://tailscale.com/docs/features/subnet-routers/how-to/setup (anuncio y aprobación de rutas, reenvío)
- https://github.com/juanfont/headscale (rol del servidor de control)
- https://headscale.net/stable/ref/derp/ (DERP incorporado, deshabilitado por defecto)
- https://libremesh.org/ (descripción de LibreMesh)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (no se renderizó)