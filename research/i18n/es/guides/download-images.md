---
title: Descargar Imágenes
sourcePath: guides/download-images.md
sourceHash: 4ec3cad5540ff339
translatedBy: glm-4.6
---

# Descargar imágenes

Esta guía explica qué es una imagen de sistema operativo, cuál elegir para tu hardware, cómo verificar que el archivo que descargaste está intacto y dónde obtener cada uno de su fuente oficial. Enlazamos a los proyectos originales en lugar de alojar copias, para que siempre obtengas la versión actual y las sumas de verificación del propio proyecto.

## Qué es una imagen

Una imagen de sistema operativo es un solo archivo que contiene un sistema completo: el kernel, el software y la configuración necesaria para arrancar. La escribes en una memoria USB, tarjeta SD o disco duro, y luego arrancas la computadora desde ese disco.

Hay dos tipos de archivo comunes:

- **ISO** (`.iso`): una imagen de disco desde la que se arranca. Algunas ISO son instaladores: hacen preguntas e instalan en el disco. Otras son imágenes live: se ejecutan desde la memoria USB sin instalar. La descripción de descarga del proyecto indica de qué tipo se trata.
- **IMG** (`.img`, a menudo comprimida como `.img.xz`): una imagen de disco lista para usar. La escribes directamente en el disco; no se ejecuta ningún instalador. Las imágenes de Raspberry Pi suelen ser de este tipo.

Algunos proyectos no proporcionan una imagen. En su lugar, proporcionan un **script de instalación**: partes de un sistema Linux estándar que ya tienes (por ejemplo Debian o Ubuntu) y ejecutas un comando que instala el software encima. Usa un script si ya tienes una máquina Linux funcionando. Usa una imagen si estás empezando desde un disco vacío.

## Cuál elegir

| Tu hardware | Qué usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, computadora de escritorio o portátil reutilizada | Una ISO x86 (amd64) o un script de instalación |
| Raspberry Pi 3, 4, 5 o Zero 2 W | Imagen de Raspberry Pi OS de 64 bits (arm64) |
| Raspberry Pi original, Pi 2 o Pi Zero | Imagen de Raspberry Pi OS de 32 bits (armhf) (2) |
| Router para LibreMesh | Firmware de router para tu modelo exacto (6) |

Si no estás seguro del tipo de procesador que tienes, consulta la guía de hardware de tu dispositivo antes de descargar nada. Un archivo compilado para la arquitectura equivocada no arrancará.

## Cómo escribir una imagen

Usa Balena Etcher para computadoras, tarjetas SD y unidades USB. Sigue las instrucciones paso a paso en la [guía de Etcher](etcher-guide.md).

El firmware de routers no se escribe de esta manera. Se instala a través de la propia interfaz web del router o del modo de recuperación, y los pasos dependen del modelo. Lee primero la [página de la wiki de OpenWrt](https://openwrt.org/toh/start) para tu router.

- **Router con su firmware original (stock):** instala primero OpenWrt. Descarga la imagen factory para tu modelo desde el [OpenWrt Firmware Selector](https://firmware-selector.openwrt.org/) y sigue los pasos de [instalación inicial de OpenWrt](https://openwrt.org/docs/guide-quick-start/factory_installation). Verifica que el router arranque y funcione.
- **Router que ya ejecuta OpenWrt:** actualízalo a LibreMesh. Esto borra la configuración actual del router.
  1. Obtén la imagen de LibreMesh para tu modelo exacto desde el [selector de firmware de LibreMesh](https://firmware-selector.libremesh.org/). Elige el archivo marcado como sysupgrade; su extensión de archivo varía según el modelo.
  2. Abre la interfaz web de OpenWrt (LuCI) y ve a **System > Backup / Flash Firmware**.
  3. Guarda la configuración actual: junto a **Download backup**, haz clic en **Generate archive** y conserva el archivo.
  4. En **Flash new firmware image**, haz clic en **Flash image...**, luego en **Browse…** para elegir el archivo de LibreMesh, y después en **Upload**.
  5. En la ventana que se abre, desmarca **Keep settings and retain the current configuration** para que LibreMesh arranque con sus valores predeterminados. Haz clic en **Continue** para iniciar el flasheo. No desconectes el router hasta que se reinicie.

La [página de inicio de LibreMesh](https://libremesh.org/getting-started.html) describe este flujo, incluido un método por SSH. Si un router ya no arranca, sigue los pasos de recuperación en su página de la wiki de OpenWrt.

Escribir un disco borra todo lo que hay en la unidad de destino. Verifica la letra o el tamaño de la unidad antes de empezar.

## Cómo verificar una suma de verificación

Una suma de verificación (checksum) es la huella digital de un archivo. La mayoría de las páginas oficiales de descarga publican la huella esperada junto al archivo; la tabla siguiente indica las excepciones.

Calcula la huella SHA-256 del archivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Símbolo del sistema o PowerShell):** `certutil -hashfile file.iso SHA256`

Compara la cadena hexadecimal larga con el valor publicado por el proyecto. Ambos deben coincidir exactamente. Si no es así, la descarga está incompleta o alterada; descárgalo de nuevo.
## Descargas oficiales

Cada fila enlaza a la página de descargas propia del proyecto. Una fila sin suma de verificación significa que el proyecto no publica ninguna huella digital en la página a la que enlaza. Las notas bajo la tabla explican las excepciones.

| Plataforma | Tipo | Arquitecturas | Descarga | Sumas de verificación |
|---|---|---|---|---|
| Debian 13 | ISO de instalación | amd64, arm64 | [debian.org](https://www.debian.org/distrib/netinst) | [amd64](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Debian 12 (para YunoHost) | ISO de instalación | amd64, arm64 | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/) (3) | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO de servidor live | amd64, arm64 | [ubuntu.com](https://ubuntu.com/download/server) | [amd64](https://releases.ubuntu.com/), [arm64](https://cdimage.ubuntu.com/ubuntu/releases/) (8) |
| Raspberry Pi OS | Imagen o ISO live | arm64, armhf; amd64 para Desktop | [raspberrypi.com](https://www.raspberrypi.com/software/operating-systems/) | En la página de descarga (2) |
| YunoHost | Script de instalación sobre Debian 12 | Sigue a Debian 12 (x86, ARM) | [install.yunohost.org](https://install.yunohost.org) (1) | Ninguna para el script (4) |
| CasaOS | Script de instalación | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/) | Ninguna para el script (4) |
| CapRover | Contenedor Docker | amd64, arm64, arm/v7 | [caprover.com](https://caprover.com/docs/get-started.html) | Ninguna para el contenedor (4) |
| balenaOS | Imagen de dispositivo | Por dispositivo (unos 20 tipos) | [balena.io/os](https://www.balena.io/os) | No se muestra en la página (5) |
| OpenMediaVault | ISO de instalación | amd64 | [openmediavault.org](https://www.openmediavault.org/download.html) | En la página de descarga |
| TrueNAS | ISO de instalación | x86_64 | [truenas.com](https://www.truenas.com/download-truenas-scale/) (7) | En la página de descarga |
| LibreMesh | Imagen personalizada de router | Por modelo de router | [selector de firmware](https://firmware-selector.libremesh.org/) | Solo si la compilación muestra una (6) |

### Notas

1. YunoHost necesita Debian 12 (Bookworm) como base, no Debian 13. La [guía de YunoHost sobre Debian](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian) indica descargar Bookworm (Debian 12). La descarga de la imagen aparece como rota en la documentación oficial, así que usa el script de instalación.
2. Raspberry Pi: 64 bits para Pi 3, 4, 5 y Zero 2 W; 32 bits para la Pi original, Pi 2 y Pi Zero. La ISO de Desktop es una imagen live que se ejecuta desde una memoria USB sin instalar.
3. Archivo de Debian: el archivo SHA256SUMS está junto a cada ISO en su propio directorio. Comprueba la línea correspondiente con los comandos de arriba. El directorio 12.15.0 es la última versión puntual de Debian 12 listada en el archivo; usa el directorio 12.x más nuevo si cambia. Debian también lo documenta en [Verificación de CD de Debian](https://www.debian.org/CD/verify.html).
4. Un script de instalación o un contenedor no tiene ningún archivo que verificar. Revisa el script antes de ejecutarlo.
5. La página de balena.io no muestra ninguna suma de verificación. Consulta la documentación de balena para ver si hay una suma publicada antes de grabar la imagen.
6. El selector compila una imagen personalizada para tu router. Cuando la compilación proporciona una suma de verificación, el selector la muestra como sha256sum junto a la imagen. El código fuente del selector muestra este comportamiento; no lo confirmamos en una compilación en vivo. Si no se muestra ninguna suma de verificación, conserva el archivo que te dé el selector. No sustituyas las sumas de verificación estándar de OpenWrt; corresponden a imágenes distintas.
7. La descarga de TrueNAS pide suscribirse a un boletín. Sus archivos `.sha256` y `.gpg` con el valor SHA256 están junto a cada ISO.
8. Ubuntu publica una versión de soporte a largo plazo (LTS), como 26.04, y una versión intermedia más corta, como 26.10. Usa la versión LTS para un servidor comunitario. Abre la carpeta de la versión que descargaste; su archivo SHA256SUMS está dentro (para arm64, en la subcarpeta `release`).

## Fuentes

Consultadas el 2026-10-30; filas de LibreMesh, OpenWrt, Ubuntu y Raspberry Pi reverificadas el 2026-10-31.

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