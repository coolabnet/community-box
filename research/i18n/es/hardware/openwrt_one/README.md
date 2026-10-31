---
title: Descripción general
sourcePath: hardware/openwrt_one/README.md
sourceHash: 8e84a63a929e0d54
translatedBy: glm-4.6
---

# OpenWrt One

## Qué es

El OpenWrt One es un router Wi-Fi 6 creado para el proyecto OpenWrt. Está fabricado en colaboración con Banana Pi y se vende a través de los distribuidores de Software Freedom Conservancy (SFC). Su precio listado parte de US$125 con carcasa ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). Ejecuta el firmware OpenWrt y viene con la versión actual para su lote de fabricación ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).

## Especificaciones clave

Las especificaciones siguientes provienen de la página del dispositivo en el wiki de OpenWrt ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)) salvo que una línea indique otra fuente:

- SoC: MediaTek Filogic 820 ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).
- RAM: 1 GB DDR4 ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).
- Flash: el wiki indica 256 MiB NAND para el arranque normal, más 16 MiB NOR para recuperación ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)). La página del SFC dice 128 MiB SPI NAND más 4 MiB SPI NOR, con 1 GiB de RAM DDR4 ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). Las fuentes se contradicen, así que verifica el tamaño de la flash de tu unidad antes de planificar el almacenamiento de imágenes o registros.
- Wi-Fi: Wi-Fi 6 de banda dual con flujos 3x3/2x2. El controlador es mt76 ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).
- Ethernet: un puerto WAN de 2.5 Gbit que también acepta PoE, y un puerto LAN de 1 Gbit ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).
- USB: un puerto host USB 2.0 Type-A. Un puerto USB-C en el frente es la consola serial ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).
- M.2: una ranura 2242/2230 para un SSD NVMe, PCIe gen 2 x1 ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).
- Alimentación: el wiki indica que PoE (802.3af/at) funciona a través del puerto WAN de 2.5G, y la página del SFC describe alimentación PoE o USB-C con 12 V USB-PD ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one); [SFC](https://sfconservancy.org/activities/openwrt-one.html)). La página de documentación de Banana Pi solo devolvió su título cuando se consultó el 2026-10-30, por lo que no pude confirmar si PoE es un módulo opcional en algunas configuraciones. Revisa el listado del producto para confirmar PoE antes de contar con él.
- Tamaño: 148 x 100.5 mm ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).

El wiki no indica la frecuencia de la CPU, el voltaje de entrada de alimentación ni los vatios.

## Por qué importa para redes comunitarias

- Ejecuta OpenWrt, firmware abierto para routers. El hardware y el firmware están documentados en el wiki de OpenWrt ([wiki de OpenWrt](https://openwrt.org/toh/openwrt/one)).
- El SFC dice que fue creado "with software freedom and right to repair in mind" ([SFC](https://sfconservancy.org/)). También dice que el dispositivo "will never be locked down" y que incluye "the fully copyleft-compliant source code release from the start" ([SFC](https://sfconservancy.org/activities/openwrt-one.html)).
- La reparabilidad importa para redes que funcionan con hardware donado o compartido. Esto se infiere; ninguna fuente lo declara.

## Límites como servidor

Es un router, no un servidor. Con 1 GB de RAM y una flash pequeña, es demasiado limitado para un servidor de propósito general. Úsalo como borde de red y ejecuta las aplicaciones de servidor en una máquina separada. Compáralo con la [Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md), que la página actual de productos de Raspberry Pi lista de 1 a 16 GB ([página de productos de Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/)), y con el [Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md), que la investigación del repositorio lista con hasta 64 GB y el actual ASUS NUC 15 Pro con hasta 96 GB ([ASUS](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/)). La única ranura M.2 y el puerto USB 2.0 limitan la velocidad de almacenamiento (inferido de las especificaciones anteriores).

## Preguntas abiertas

- Resuelto: soporte de versiones upstream. El directorio de la versión OpenWrt 24.10.0 lista imágenes de OpenWrt One, incluida `openwrt-24.10.0-mediatek-filogic-openwrt_one-squashfs-sysupgrade.itb` ([descargas de OpenWrt](https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/), consultado el 2026-10-30). La sección "Supported Versions" del wiki sigue vacía.
- Sin resolver: tamaño de la flash. El wiki y el SFC se contradicen, como se indica en Especificaciones clave.
- Sin resolver: qué tan bien ejecuta LibreMesh. Ninguna fuente consultada vincula ambos. (inferido: un dispositivo OpenWrt estándar puede ejecutar paquetes LibreMesh.)
- Sin resolver: dónde están los esquemas. El wiki apunta a un sitio externo que no fue consultado.
- El precio actual. La página del SFC indica "starting at US$125" sin fecha.

## Fuentes

- https://openwrt.org/toh/openwrt/one (página del dispositivo en el wiki de OpenWrt, consultada el 2026-10-30)
- https://sfconservancy.org/activities/openwrt-one.html (página del dispositivo en SFC, consultada el 2026-10-30)
- https://sfconservancy.org/ (página principal de SFC, texto de navegación, consultada el 2026-10-30)
- https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/ (directorio de imágenes de OpenWrt 24.10.0, consultado el 2026-10-30)
- https://docs.banana-pi.org/en/OpenWRT-One/BananaPi_OpenWRT-One (consultada el 2026-10-30; solo devolvió el título de la página, por lo que no se usó para las especificaciones)