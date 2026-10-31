---
title: Descargar Imágenes
sourcePath: guides/download-images.md
sourceHash: 6d5ec64b8320a764
translatedBy: glm-4.6
---

# Descargar imágenes

Esta guía explica qué es una imagen de sistema operativo, cuál elegir para tu hardware, cómo verificar que el archivo descargado está intacto y dónde obtener cada una de su fuente oficial. Enlazamos a los proyectos originales en lugar de alojar copias, para que siempre obtengas la versión actual y las sumas de verificación del propio proyecto.

## Qué es una imagen

Una imagen de sistema operativo es un único archivo que contiene un sistema completo: el kernel, el software y la configuración necesaria para arrancar. La escribes en una memoria USB, tarjeta SD o disco duro, y luego arrancas la computadora desde ese disco.

Hay dos tipos de archivos comunes:

- **ISO** (`.iso`): una imagen de disco desde la que arrancas. Algunas ISO son instaladores: hacen preguntas e instalan en el disco. Otras son imágenes live: se ejecutan desde la memoria USB sin instalar. La descripción de descarga del proyecto indica cuál tipo obtienes.
- **IMG** (`.img`, a menudo comprimida como `.img.xz`): una imagen de disco lista para usar. La escribes directamente en el disco; no se ejecuta ningún instalador. Las imágenes de Raspberry Pi suelen ser de este tipo.

Algunos proyectos no proporcionan una imagen. En su lugar, ofrecen un **script de instalación**: partes de un sistema Linux estándar que ya tienes (por ejemplo, Debian o Ubuntu) y ejecutas un comando que instala el software encima. Usa un script cuando ya tienes una máquina Linux funcionando. Usa una imagen cuando empiezas desde un disco vacío.

## Cuál elegir

| Tu hardware | Qué usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, computadora de escritorio o portátil reutilizada | Una ISO x86 (amd64) o script de instalación |
| Raspberry Pi 3, 4 o 5 | Imagen de Raspberry Pi OS de 64 bits (arm64) |
| Raspberry Pi original, Pi 2 o Pi Zero | Imagen de Raspberry Pi OS de 32 bits (armhf) (2) |
| Raspberry Pi Zero 2 W | Consulta primero la página del modelo (2) |
| Router con LibreMesh | Firmware de router para tu modelo exacto (6) |

Si no estás seguro del tipo de procesador que tienes, consulta la guía de hardware de tu dispositivo antes de descargar nada. Un archivo compilado para la arquitectura incorrecta no arrancará.

## Cómo escribir una imagen

Usa Balena Etcher para computadoras, tarjetas SD y unidades USB. Sigue las instrucciones paso a paso en [etcher-guide.md](etcher-guide.md).

El firmware de router no se escribe de esta manera. Una imagen de router LibreMesh se instala a través de la propia interfaz web del router o del modo de recuperación, de una de dos maneras: una imagen factory para la primera instalación sobre el firmware de fábrica, o una imagen sysupgrade cuando el router ya ejecuta OpenWrt. Para una primera instalación, sigue [libremesh-installation.md](libremesh-installation.md), que explica paso a paso cómo flashear una imagen factory. Para actualizar un router que ya ejecuta OpenWrt, sigue las [instrucciones de sysupgrade de OpenWrt](https://openwrt.org/docs/guide-user/installation/generic.sysupgrade) y la [página de inicio de LibreMesh](https://libremesh.org/getting-started.html).

Escribir en un disco borra todo lo que hay en la unidad de destino. Verifica la letra o el tamaño del disco antes de empezar.

## Cómo verificar una suma de verificación

Una suma de verificación (checksum) es una huella digital de un archivo. La mayoría de las páginas de descarga oficiales publican la huella esperada junto al archivo; la tabla siguiente señala las excepciones.

Calcula la huella SHA-256 del archivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Símbolo del sistema o PowerShell):** `certutil -hashfile file.iso SHA256`

Compara la cadena hexadecimal larga con el valor publicado por el proyecto. Ambos deben coincidir exactamente. Si no coinciden, la descarga está incompleta o alterada; descárgalo de nuevo.

## Descargas oficiales

Cada fila enlaza a la propia página de descarga del proyecto. Una fila sin suma de verificación significa que el proyecto no publica ninguna huella en la página que enlaza. Las notas debajo de la tabla explican las excepciones.

| Plataforma | Tipo | Arquitecturas | Descarga | Sumas de verificación |
|---|---|---|---|---|
| Debian 13 | ISO de instalación | amd64, arm64 | [debian.org](https://www.debian.org/distrib/netinst) | [amd64](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Debian 12 (para YunoHost) | ISO de instalación | amd64, arm64 | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/) (3) | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO live de servidor | amd64, arm64 | [ubuntu.com](https://ubuntu.com/download/server) | amd64 [releases](https://releases.ubuntu.com/26.04/SHA256SUMS), arm64 [cdimage](https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS) |
| Raspberry Pi OS | Imagen o ISO live | arm64, armhf; amd64 para Desktop | [raspberrypi.com](https://www.raspberrypi.com/software/operating-systems/) | En la página de descarga (2) |
| YunoHost | Script de instalación sobre Debian 12 | Sigue a Debian 12 (x86, ARM) | [install.yunohost.org](https://install.yunohost.org) (1) | Ninguna para el script (4) |
| CasaOS | Script de instalación | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/) | Ninguna para el script (4) |
| CapRover | Contenedor Docker | amd64, arm64, arm/v7 | [caprover.com](https://caprover.com/docs/get-started.html) | Ninguna para el contenedor (4) |
| balenaOS | Imagen de dispositivo | Por dispositivo (unos 20 tipos) | [balena.io/os](https://www.balena.io/os) | No se muestra en la página (5) |
| OpenMediaVault | ISO de instalación | amd64 | [openmediavault.org](https://www.openmediavault.org/download.html) | En la página de descarga |
| TrueNAS | ISO de instalación | x86_64 | [truenas.com](https://www.truenas.com/download-truenas-scale/) (7) | En la página de descarga |
| LibreMesh | Imagen de router personalizada | Por modelo de router | [selector de firmware](https://firmware-selector.libremesh.org/) | Solo si la compilación muestra una (6) |

### Notas

1. YunoHost necesita Debian 12 (Bookworm) como base, no Debian 13. La [guía de YunoHost sobre Debian](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian) indica descargar Bookworm (Debian 12). La descarga de la imagen está marcada como rota en la documentación del proyecto original, así que usa el script de instalación.
2. Raspberry Pi: 64 bits para Pi 3, 4 y 5; 32 bits para la Pi original, Pi 2 y Pi Zero. La página oficial no menciona la Zero 2 W, así que consulta la página del modelo. La ISO Desktop es una imagen live que se ejecuta desde una memoria USB sin instalar.
3. Archivo de Debian: el archivo SHA256SUMS se encuentra junto a cada ISO en su propio directorio. Verifica la línea correspondiente con los comandos anteriores. El directorio 12.15.0 es la última versión puntual de Debian 12 listada en el archivo; usa el directorio 12.x más nuevo si cambia. Debian también documenta esto en [Debian CD verification](https://www.debian.org/CD/verify.html).
4. Un script de instalación o un contenedor no tiene ningún archivo que verificar. Revisa el script antes de ejecutarlo.
5. La página de balena.io no muestra ninguna suma de verificación. Consulta la documentación de balena para ver si hay una suma publicada antes de escribir la imagen.
6. El selector compila una imagen personalizada para tu router. Cuando la compilación proporciona una suma de verificación, el selector la muestra como sha256sum junto a la imagen. El código fuente del selector muestra este comportamiento; no lo confirmamos en una compilación en vivo. Si no se muestra ninguna suma de verificación, conserva el archivo que te da el selector. No sustituyas las sumas de verificación del OpenWrt de fábrica; corresponden a imágenes diferentes.
7. La descarga de TrueNAS pide registrarse en un boletín. Sus archivos de valor SHA256, `.sha256` y `.gpg` están junto a cada ISO.
## Fuentes

Consultadas el 2026-10-30.

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
- https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS
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
- https://raw.githubusercontent.com/libremesh/firmware-selector-openwrt-org/main/www/js/images.js
- https://downloads.openwrt.org/