---
title: Descripción general
sourcePath: hardware/openwrt_one/README.md
sourceHash: 8d2edb2f040d3d48
translatedBy: glm-4.6
---

# OpenWrt One

## Qué es

El OpenWrt One es un router Wi-Fi 6 creado para el proyecto OpenWrt. Está fabricado en colaboración con Banana Pi y se vende a través de distribuidores de Software Freedom Conservancy (SFC). Su precio de lista parte de US$125 con carcasa ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). Ejecuta el firmware OpenWrt y viene con la versión actual correspondiente a su lote de fabricación ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

## Especificaciones clave

Las especificaciones siguientes provienen de la página del dispositivo en el OpenWrt wiki ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)), salvo que una línea indique otra fuente:

- SoC: MediaTek Filogic 820 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- RAM: 1 GB DDR4 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Flash: el wiki indica 256 MiB NAND para el arranque normal, más 16 MiB NOR para recuperación ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)). La especificación de Banana Pi coincide con el wiki en 256 MB NAND y 16 MB NOR ([Banana Pi](https://www.banana-pi.org/en/bananapi-router/173.html)). La página del SFC indica 128 MiB SPI NAND más 4 MiB SPI NOR, con 1 GiB de RAM DDR4 ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). Las fuentes entran en conflicto, así que verifica el tamaño de flash en tu unidad antes de planificar el almacenamiento de imágenes o registros.
- Wi-Fi: Wi-Fi 6 de banda dual con flujos 3x3/2x2. El controlador es mt76 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Ethernet: un puerto WAN de 2.5 Gbit que también acepta PoE, y un puerto LAN de 1 Gbit ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- USB: un puerto host USB 2.0 Type-A. Un puerto USB-C en el frontal es la consola serie ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- M.2: una ranura 2242/2230 para un SSD NVMe, PCIe gen 2 x1 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Entrada de alimentación (especificación del fabricante): USB-C a 15 V USB-PD, según la [especificación de Banana Pi para el OpenWrt One](https://www.banana-pi.org/en/bananapi-router/173.html), consultada el 2026-10-30. Compra un adaptador USB-PD que soporte 15 V. No uses una fuente genérica de 12 V.
- Listado en conflicto: la [página del SFC](https://sfconservancy.org/activities/openwrt-one.html) describe la alimentación USB-C como 12 V USB-PD. Un [mensaje de la lista de correo de OpenWrt](https://lists.openwrt.org/pipermail/openwrt-adm/2025-March/002664.html) de marzo de 2025 también indica que la placa debe recibir 15 V, citando una etiqueta "PD15V" en la placa. Dos listados discrepan, así que sigue la cifra de 15 V del fabricante.
- PoE: la especificación del fabricante lista "Optional 802.3at/af PoE via RT5040 module" (PoE 802.3at/af opcional mediante módulo RT5040) ([Banana Pi](https://www.banana-pi.org/en/bananapi-router/173.html)). El wiki y el SFC describen el PoE como integrado. Comprueba si tu unidad incluye el módulo antes de planificar la alimentación por PoE.
- Tamaño: 148 x 100.5 mm ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

El wiki no indica la frecuencia de la CPU, el voltaje del USB-C ni el consumo en vatios. Consulta la viñeta de alimentación para el conflicto de voltaje.

## Por qué importa para redes comunitarias

- Ejecuta OpenWrt, firmware de router abierto. El hardware y el firmware están documentados en el OpenWrt wiki ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- El SFC indica que fue creado "with software freedom and right to repair in mind" (con la libertad del software y el derecho a reparar en mente) ([SFC](https://sfconservancy.org/)). También dice que el dispositivo "will never be locked down" (nunca estará bloqueado) y que incluye "the fully copyleft-compliant source code release from the start" (la publicación del código fuente totalmente compatible con copyleft desde el inicio) ([SFC](https://sfconservancy.org/activities/openwrt-one.html)).
- La reparabilidad importa para las redes que funcionan con hardware donado o compartido. Esto es inferido, no lo indica ninguna fuente.

## Límites como servidor

Es un router, no un servidor. Con 1 GB de RAM y flash pequeña, es demasiado limitado para un servidor general. Úsalo como borde de red y ejecuta las aplicaciones de servidor en una máquina aparte. Compara con la [Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md), que la página actual de productos de Raspberry Pi lista de 1 a 16 GB ([página de productos de Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/)), y con el [Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md), que la investigación del repositorio lista hasta 64 GB y el actual ASUS NUC 15 Pro hasta 96 GB ([ASUS](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/)). La única ranura M.2 y el puerto USB 2.0 limitan la velocidad de almacenamiento (inferido de las especificaciones anteriores).

## Preguntas abiertas

- Resuelto: soporte de versión ascendente. El directorio de la versión OpenWrt 24.10.0 lista imágenes del OpenWrt One, incluyendo `openwrt-24.10.0-mediatek-filogic-openwrt_one-squashfs-sysupgrade.itb` ([descargas de OpenWrt](https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/), consultado el 2026-10-30). La sección "Supported Versions" del wiki sigue vacía.
- Sin resolver: tamaño de flash. El wiki y el SFC entran en conflicto, como se indica en Especificaciones clave.
- Sin resolver: qué tan bien ejecuta LibreMesh. Ninguna fuente consultada vincula ambos. (inferido: un dispositivo OpenWrt estándar puede ejecutar paquetes de LibreMesh.)
- Sin resolver: dónde están los esquemas. El wiki apunta a un sitio externo que no fue consultado.
- El precio actual. La página del SFC indica "starting at US$125" (desde US$125) sin fecha.

## Fuentes

- https://openwrt.org/toh/openwrt/one (página del dispositivo en el OpenWrt wiki, consultada el 2026-10-30)
- https://sfconservancy.org/activities/openwrt-one.html (página del dispositivo en el SFC, consultada el 2026-10-30)
- https://sfconservancy.org/ (página de inicio del SFC, texto de navegación, consultado el 2026-10-30)
- https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/ (directorio de imágenes de OpenWrt 24.10.0, consultado el 2026-10-30)
- https://www.banana-pi.org/en/bananapi-router/173.html (especificación de Banana Pi OpenWrt One, consultada el 2026-10-30; 15 V USB-PD, módulo PoE RT5040 opcional, 256 MB NAND / 16 MB NOR)- https://lists.openwrt.org/pipermail/openwrt-adm/2025-March/002664.html (lista de correo de OpenWrt, marzo de 2025, consultada el 2026-10-30; discusión sobre 15 V)