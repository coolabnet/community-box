---
title: Descargar imágenes
sourcePath: guides/download-images.md
sourceHash: 9bfe7520db4d3c79
translatedBy: glm-4.6
---

# Descargar imágenes

Esta guía explica qué es una imagen de sistema operativo, cuál elegir para tu hardware, cómo verificar que el archivo que descargaste está íntegro y dónde obtener cada uno de su fuente oficial. Enlazamos a los proyectos originales en lugar de alojar copias, para que siempre obtengas la versión actual y las sumas de verificación del propio proyecto.

## Qué es una imagen

Una imagen de sistema operativo es un solo archivo que contiene un sistema completo: el kernel, el software y la configuración necesaria para arrancar. La escribes en una memoria USB, una tarjeta SD o un disco duro, y luego arrancas la computadora desde ese disco.

Hay dos tipos de archivo comunes:

- **ISO** (`.iso`): una imagen de disco desde la que se arranca. Algunas ISO son instaladores: hacen preguntas e instalan en el disco. Otras son imágenes live: se ejecutan desde la memoria USB sin instalar. La descripción de descarga del proyecto indica cuál tipo obtienes.
- **IMG** (`.img`, a menudo comprimida como `.img.xz`): una imagen de disco lista para usar. La escribes directamente en el disco; no se ejecuta ningún instalador. Las imágenes de Raspberry Pi suelen ser de este tipo.

Algunos proyectos no proporcionan una imagen. En su lugar, ofrecen un **script de instalación**: empiezas con un sistema Linux estándar que ya tienes (por ejemplo, Debian o Ubuntu) y ejecutas un comando que instala el software encima. Usa un script cuando ya tengas una máquina Linux funcionando. Usa una imagen cuando empieces desde un disco vacío.

## Cuál elegir

| Tu hardware | Qué usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, computadora de escritorio o portátil reutilizada | Una ISO x86 (amd64) o un script de instalación |
| Raspberry Pi 3, 4, 5 o Zero 2 W | Imagen de Raspberry Pi OS de 64 bits (arm64) |
| Raspberry Pi original, Pi 2 o Pi Zero | Imagen de Raspberry Pi OS de 32 bits (armhf) (2) |
| Router para LibreMesh | Firmware del router para tu modelo exacto (6) |

Si no estás seguro del tipo de procesador que tienes, consulta la guía de hardware de tu dispositivo antes de descargar nada. Un archivo compilado para la arquitectura equivocada no arrancará.

## Cómo escribir una imagen

Usa Balena Etcher para computadoras, tarjetas SD y unidades USB. Sigue las instrucciones paso a paso de la [guía de Etcher](etcher-guide.md).

El firmware del router no se escribe de esta manera. Se instala a través de la interfaz web propia del router o del modo de recuperación, y los pasos dependen del modelo. Lee primero la [página del wiki de OpenWrt](https://openwrt.org/toh/start) para tu router.

- **Router con su firmware original (de fábrica):** instala OpenWrt primero. Descarga la imagen factory para tu modelo desde el [OpenWrt Firmware Selector](https://firmware-selector.openwrt.org/) y sigue los pasos de [instalación inicial de OpenWrt](https://openwrt.org/docs/guide-quick-start/factory_installation). Verifica que el router arranque y funcione.
- **Router que ya ejecuta OpenWrt:** actualízalo a LibreMesh. Esto borra la configuración actual del router.
  1. Obtén la imagen de LibreMesh para tu modelo exacto desde el [selector de firmware de LibreMesh](https://firmware-selector.libremesh.org/). Elige el archivo marcado como sysupgrade; su extensión varía según el modelo.
  2. Abre la interfaz web de OpenWrt (LuCI) y ve a **System > Backup / Flash Firmware**.
  3. Guarda la configuración actual: junto a **Download backup**, haz clic en **Generate archive** y conserva el archivo.
  4. En **Flash new firmware image**, haz clic en **Flash image...**, luego en **Browse…** para elegir el archivo de LibreMesh y después en **Upload**.
  5. En la ventana que se abre, desmarca **Keep settings and retain the current configuration** para que LibreMesh arranque con sus valores predeterminados. Haz clic en **Continue** para iniciar el flasheo. No desconectes el router hasta que se reinicie.

La [página de inicio de LibreMesh](https://libremesh.org/getting-started.html) describe este flujo, incluido un método por SSH. Si un router ya no arranca, sigue los pasos de recuperación de su página del wiki de OpenWrt.

Escribir en un disco borra todo lo que hay en la unidad de destino. Verifica la letra o el tamaño de la unidad antes de empezar.

## Cómo verificar una suma de verificación

Una suma de verificación (checksum) es una huella digital de un archivo. La mayoría de las páginas de descarga oficiales publican la huella esperada junto al archivo; la tabla siguiente indica las excepciones.

Calcula la huella SHA-256 del archivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Símbolo del sistema o PowerShell):** `certutil -hashfile file.iso SHA256`

Compara la cadena hexadecimal larga con el valor publicado por el proyecto. Ambos deben coincidir exactamente. Si no coinciden, la descarga está incompleta o alterada; descárgalo de nuevo.
## Descargas oficiales

Cada fila enlaza a la propia página de descargas del proyecto. Una fila sin checksum significa que el proyecto no publica ninguna huella digital en la página a la que enlaza. Las notas debajo de la tabla explican las excepciones.

| Plataforma | Tipo | Arquitecturas | Descarga | Checksums |
|---|---|---|---|---|
| Debian 13 | ISO de instalación | amd64, arm64 | [debian.org](https://www.debian.org/distrib/netinst) | [amd64](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Debian 12 (para YunoHost) | ISO de instalación | amd64, arm64 | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/) (3) | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO de servidor live | amd64, arm64 | [ubuntu.com](https://ubuntu.com/download/server) | [amd64](https://releases.ubuntu.com/), [arm64](https://cdimage.ubuntu.com/ubuntu/releases/) (8) |
| Raspberry Pi OS | Imagen o ISO live | arm64, armhf; amd64 para Desktop | [raspberrypi.com](https://www.raspberrypi.com/software/operating-systems/) | En la página de descargas (2) |
| YunoHost | Script de instalación sobre Debian 12 | Sigue a Debian 12 (x86, ARM) | [install.yunohost.org](https://install.yunohost.org) (1) | Ninguno para el script (4) |
| CasaOS | Script de instalación | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/) | Ninguno para el script (4) |
| CapRover | Contenedor Docker | amd64, arm64, arm/v7 | [caprover.com](https://caprover.com/docs/get-started.html) | Ninguno para el contenedor (4) |
| balenaOS | Imagen de dispositivo | Por dispositivo (unos 20 tipos) | [balena.io/os](https://www.balena.io/os) | No se muestra en la página (5) |
| OpenMediaVault | ISO de instalación | amd64 | [openmediavault.org](https://www.openmediavault.org/download.html) | En la página de descargas |
| TrueNAS | ISO de instalación | x86_64 | [truenas.com](https://www.truenas.com/download-truenas-scale/) (7) | En la página de descargas |
| Proxmox VE | ISO de instalación | amd64; arm64 para algunos servidores (9) | [proxmox.com](https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso) | En la página de descargas |
| ButterBox | Imagen para Raspberry Pi | Pi Zero 2 W, Pi 4 | [likebutter.app](https://likebutter.app/docs/build-a-box/raspberry-pi/install-butter/) (10) | Ninguno publicado (10) |
| LibreMesh | Imagen personalizada para router | Por modelo de router | [selector de firmware](https://firmware-selector.libremesh.org/) | Solo si la compilación muestra uno (6) |

### Notas

1. YunoHost necesita Debian 12 (Bookworm) como base, no Debian 13. La [guía de YunoHost sobre Debian](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian) indica descargar Bookworm (Debian 12). La descarga de la imagen aparece marcada como rota en la documentación oficial, así que usa el script de instalación.
2. Raspberry Pi: 64 bits para Pi 3, 4, 5 y Zero 2 W; 32 bits para el Pi original, Pi 2 y Pi Zero. La ISO de Desktop es una imagen live que se ejecuta desde una memoria USB sin instalar.
3. Archivo de Debian: el archivo SHA256SUMS está junto a cada ISO en su propio directorio. Comprueba la línea correspondiente con los comandos de arriba. El directorio 12.15.0 es la última versión puntual de Debian 12 listada en el archivo; usa el directorio 12.x más nuevo si cambia. Debian también lo documenta en [verificación de CD de Debian](https://www.debian.org/CD/verify.html).
4. Un script de instalación o un contenedor no tiene un archivo que verificar. Revisa el script antes de ejecutarlo.
5. La página de balena.io no muestra ningún checksum. Consulta la documentación de balena para encontrar un checksum publicado antes de grabar la imagen.
6. El selector compila una imagen personalizada para tu router. Cuando la compilación proporciona un checksum, el selector lo muestra como sha256sum junto a la imagen. El código fuente del selector muestra este comportamiento; no lo confirmamos en una compilación en vivo. Si no se muestra ningún checksum, conserva el archivo que te entrega el selector. No sustituyas los checksums del OpenWrt estándar; corresponden a imágenes diferentes.
7. La descarga de TrueNAS pide suscribirse a un boletín. El valor SHA256 y los archivos `.sha256` y `.gpg` están junto a cada ISO.
8. Ubuntu publica una versión de soporte a largo plazo (LTS), como 26.04, y una versión interina más corta, como 26.10. Usa la versión LTS para un servidor comunitario. Abre la carpeta de la versión que descargaste; su archivo SHA256SUMS está dentro (para arm64, en la subcarpeta `release`).
9. Proxmox VE borra todo el disco. En una PC o Intel NUC, usa la ISO estándar (amd64); el procesador necesita Intel VT o AMD-V activados. La ISO arm64 es solo para algunos servidores ARM; Proxmox no es compatible con Raspberry Pi. El valor SHA256 aparece listado junto a cada ISO.
10. ButterBox funciona en Raspberry Pi Zero 2 W y Pi 4. Su página de instalación enlaza la descarga de la imagen; elige la versión más reciente y descomprímela antes de grabarla con Raspberry Pi Imager. El proyecto no publica ningún checksum, así que comprueba que el tamaño del archivo coincida con el tamaño mostrado en la página de descarga de Dropbox. Hay una versión para PC listada como próximamente.

## Fuentes

Consultado el 2026-10-30; las filas de LibreMesh, OpenWrt, Ubuntu y Raspberry Pi se verificaron de nuevo el 2026-10-31. Las filas de Proxmox VE y ButterBox se añadieron el 2026-10-31.

- https://www.debian.org/distrib/netinst
- https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS
- https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS
- https://cdimage.debian.org/cdimage/archive/
- https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/
- https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/SHA256SUMS
- https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/SHA256SUMS
- https://www.debian.org/CD/verify.html
- https://ubuntu.com/download/server
- https://releases.ubuntu.com/26.04/SHA256SUMS
- https://releases.ubuntu.com/26.10/SHA256SUMS
- https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS
- https://cdimage.ubuntu.com/ubuntu/releases/26.10/release/SHA256SUMS
- https://www.raspberrypi.com/software/operating-systems/
- https://www.raspberrypi.com/documentation/computers/os.html
- https://www.raspberrypi.com/news/raspberry-pi-desktop-now-available-for-pc-and-mac/
- https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian
- https://install.yunohost.org
- https://casaos.zimaspace.com/
- https://caprover.com/docs/get-started.html
- https://hub.docker.com/r/caprover/caprover/tags
- https://hub.docker.com/v2/repositories/caprover/caprover/tags/latest
- https://www.balena.io/os
- https://etcher.balena.io/
- https://www.openmediavault.org/download.html
- https://www.truenas.com/download-truenas-scale/
- https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso
- https://pve.proxmox.com/wiki/System_Requirements
- https://likebutter.app/docs/build-a-box
- https://likebutter.app/docs/build-a-box/raspberry-pi/install-butter/
- https://firmware-selector.libremesh.org/
- https://libremesh.org/build/
- https://libremesh.org/getting-started.html
- https://firmware-selector.openwrt.org/
- https://openwrt.org/toh/start
- https://openwrt.org/docs/guide-quick-start/factory_installation
- https://github.com/openwrt/luci/blob/master/modules/luci-mod-system/htdocs/luci-static/resources/view/system/flash.js
- https://github.com/openwrt/luci/blob/master/modules/luci-base/htdocs/luci-static/resources/ui.js
- https://libremesh.org/getting-started.html
- https://raw.githubusercontent.com/libremesh/firmware-selector-openwrt-org/main/www/js/images.js
- https://downloads.openwrt.org/