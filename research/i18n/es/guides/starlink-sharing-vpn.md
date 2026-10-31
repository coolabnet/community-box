---
title: Compartiendo Starlink con una VPN
sourcePath: guides/starlink-sharing-vpn.md
sourceHash: 9380975334445211
translatedBy: glm-4.6
---

# Compartir una Conexión Starlink a Través de una Red Comunitaria

Algunas redes comunitarias usan una conexión Starlink como su enlace a internet. Esta guía explica una configuración básica para compartir ese enlace. También explica por qué los miembros fuera de la red pueden no alcanzar un servidor en el sitio. Se mantiene conceptual. No es una configuración paso a paso.

## El Problema Central: CGNAT y Acceso Entrante

El centro de ayuda de Starlink dice que su configuración IPv4 predeterminada usa NAT de nivel de operador (CGNAT). CGNAT permite que muchos clientes compartan una dirección pública. Las conexiones entrantes están bloqueadas, por lo que un servidor detrás de la configuración predeterminada no puede ser alcanzado desde el exterior ([Ayuda de Starlink: dirección IP](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

Puntos de ese centro de ayuda para verificar en las páginas en vivo:

- Una dirección IPv4 pública depende del plan. El centro de ayuda menciona los planes Local y Global Priority.
- Los routers Wi-Fi propios de Starlink no admiten reenvío de puertos ni reglas de firewall para IPv4 o IPv6.
- A los miembros que necesitan acceso entrante se les indica usar un router de terceros o un plan con una opción de IPv4 pública.

IPv6 puede ofrecer otra ruta hacia el acceso entrante. Confirma para tu plan si se proporciona IPv6 nativo y si tu router lo deja pasar. Ver Preguntas Abiertas.

## Por Qué Ayuda una Superposición (Overlay)

Una VPN o red de superposición le da a cada dispositivo una dirección privada y un túnel cifrado hacia los demás. El túnel aún necesita una ruta que ambos lados puedan alcanzar. Esa ruta es la parte difícil detrás de CGNAT.

- **WireGuard** es un [túnel VPN rápido, moderno y seguro](https://www.wireguard.com/). Su [inicio rápido](https://www.wireguard.com/quickstart/) configura cada par con una dirección de endpoint y rangos de IP permitidos. WireGuard simple necesita un par que el otro lado pueda alcanzar en una dirección conocida. Si el servidor y el cliente están ambos detrás de CGNAT, ninguno puede aceptar la conexión. Entonces se necesita un tercer host con una dirección pública, como un pequeño servidor alquilado. Los paquetes keepalive ayudan a mantener abiertos los mapeos NAT. El inicio rápido no describe qué sucede cuando ambos lados son inalcanzables.
- **Tailscale** funciona sobre WireGuard. Su [página de tipos de conexión](https://tailscale.com/docs/reference/connection-types) dice que los dispositivos primero intentan conexiones directas sobre UDP. Cuando no funciona ninguna ruta directa, el tráfico pasa por servidores de relé DERP, y el tráfico retransmitido permanece cifrado de extremo a extremo con WireGuard.
- **Headscale no es un relé.** [Headscale](https://github.com/juanfont/headscale) es un servidor de control autoalojado para clientes de Tailscale. Su README dice que el servidor de control intercambia claves públicas de WireGuard entre nodos y asigna direcciones. No transporta tráfico de miembros. Una configuración de Headscale detrás de CGNAT aún necesita una ruta que funcione. Consulta la documentación propia de Headscale para opciones de relé (inferido).

## Protocolos que CGNAT Descarta

El artículo de Starlink sobre sitio a sitio enumera los protocolos que CGNAT descarta: protocolo IP 47 (GRE), 50 (ESP), 51 (AH) y 115 (L2TP) ([Ayuda de Starlink: VPN sitio a sitio](https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857)). El protocolo 115 es un número de protocolo IP. No es lo mismo que L2TP sobre UDP. Prueba tu túnel elegido en el enlace Starlink real antes de salir en vivo.

## Topología Básica

1. La antena y el router de Starlink proporcionan el enlace a internet.
2. Una puerta de enlace que ejecuta OpenWrt o LibreMesh se conecta al router de Starlink. LibreMesh es un [framework de firmware basado en OpenWrt para nodos de malla inalámbrica](https://libremesh.org/).
3. La puerta de enlace comparte el enlace con los nodos de la malla.
4. Un cliente de túnel en la puerta de enlace o un servidor se conecta a un par o relé alcanzable.
5. Los miembros alcanzan el servidor comunitario a través de ese túnel. El servidor en sí permanece detrás de CGNAT.

La puerta de enlace es un único punto de fallo. Planifica una ruta de respaldo o un fallback claro.

## Ancho de Banda y Uso Justo

Un enlace compartido tiene capacidad fija, y muchos miembros pueden ralentizarse entre sí. Decide quién puede usar el enlace y para qué. Supervisa el uso durante unas semanas. Da prioridad a los servicios que la comunidad más necesita. Los límites de datos y las reglas de uso justo de Starlink difieren según el plan y no fueron verificados aquí.

## Términos de Reventa y Compartición

Los términos de servicio de Starlink rigen si puedes compartir o revender la conexión. La página de términos no se renderizó en la obtención usada para esta guía. No asumas que compartir está permitido. Lee los términos y pregunta al soporte de Starlink por escrito antes de compartir el enlace con una comunidad.

## Preguntas Abiertas

- Las reglas de compartición y reventa en los términos de servicio de Starlink no fueron verificadas.
- Si Starlink proporciona IPv6 nativo en tu plan, y si un router de terceros puede pasar IPv6 entrante a un servidor. Confirma en las páginas en vivo.
- (inferido) Si las afirmaciones anteriores aún coinciden con las páginas de ayuda en vivo.
- (inferido) Cómo clasifica el artículo de Starlink a L2TP sobre UDP, que usa UDP en lugar del protocolo IP 115. Confirma con Starlink.
- Si la dirección IPv4 pública funciona para todos los dispositivos de la comunidad. No probado.

## Fuentes

Obtenido el 2026-10-30. WebFetch de las páginas del centro de ayuda de Starlink devolvió solo la palabra "Starlink", por lo que las afirmaciones de Starlink anteriores provienen de extractos de búsqueda de esas mismas URL. Verifícalas en las páginas en vivo antes de confiar en ellas.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (dirección IP y CGNAT; solo extracto)
- https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857 (VPN sitio a sitio, lista de protocolos; solo extracto)
- https://www.wireguard.com/ (descripción de WireGuard)
- https://www.wireguard.com/quickstart/ (endpoints de pares, rangos de IP permitidos, keepalives)
- https://tailscale.com/docs/reference/connection-types (conexiones directas, fallback de relé DERP, cifrado)
- https://github.com/juanfont/headscale (rol de servidor de control, no es un relé)
- https://libremesh.org/ (descripción de LibreMesh)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (no se renderizó; listado para la verificación de términos)