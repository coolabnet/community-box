---
title: Descargar imágenes
sourcePath: guides/download-images.md
sourceHash: 29621d25a1e950e3
translatedBy: glm-4.6
---

# Descargar imágenes

Esta guía explica qué es una imagen de sistema operativo, cuál elegir para tu hardware, cómo verificar que el archivo que descargaste está intacto y dónde obtener cada uno desde su fuente oficial. Enlazamos a los proyectos originales en lugar de alojar copias, así que siempre obtienes la versión actual y los checksums del propio proyecto.

## Qué es una imagen

Una imagen de sistema operativo es un archivo único que contiene un sistema completo: el kernel, el software y la configuración necesaria para arrancar. La escribes en una memoria USB, tarjeta SD o disco duro, y luego arrancas la computadora desde esa unidad.

Hay dos tipos de archivos comunes:

- **ISO** (`.iso`): una imagen de disco desde la que arrancas. Algunas ISO son instaladores: hacen preguntas e instalan en la unidad. Otras son imágenes live: se ejecutan desde la memoria USB sin instalar. La descripción de descarga del proyecto indica qué tipo obtienes.
- **IMG** (`.img`, a menudo comprimida como `.img.xz`): una imagen de disco lista para usar. La escribes directamente en la unidad; no se ejecuta ningún instalador. Las imágenes de Raspberry Pi suelen ser de este tipo.

Algunos proyectos no proporcionan una imagen. En su lugar, ofrecen un **script de instalación**: partes de un sistema Linux estándar que ya tienes (por ejemplo Debian o Ubuntu) y ejecutas un comando que instala el software encima. Usa un script cuando ya tienes una máquina Linux funcionando. Usa una imagen cuando partes de un disco vacío.

## Cuál elegir

| Tu hardware | Qué usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, computadora de escritorio o portátil reutilizada | Una ISO x86 (amd64) o un script de instalación |
| Raspberry Pi 3, 4 o 5 | La imagen de Raspberry Pi OS de 64 bits (arm64) |
| Raspberry Pi original, Raspberry Pi 2 o Raspberry Pi Zero | La imagen de Raspberry Pi OS de 32 bits (armhf); la página oficial lista estos modelos para 32 bits |
| Raspberry Pi Zero 2 W | No aparece nombrada en la página oficial; verifica la página del modelo antes de elegir (se espera 64 bits para este procesador) |
| Router con LibreMesh | Una imagen de firmware para tu modelo exacto de router, elegida en el selector de firmware de LibreMesh |

Si no estás seguro del tipo de tu procesador, consulta la guía de hardware de tu dispositivo antes de descargar nada. Un archivo compilado para la arquitectura equivocada no arrancará.

## Cómo escribir una imagen

Usa Balena Etcher u otro programa para escribir imágenes. Sigue las instrucciones paso a paso en [etcher-guide.md](etcher-guide.md).

Escribir borra todo el contenido de la unidad de destino. Verifica la letra o el tamaño de la unidad antes de empezar.

## Cómo verificar un checksum

Un checksum es una huella digital de un archivo. La mayoría de las páginas de descarga oficiales publican la huella esperada junto al archivo; la tabla siguiente indica las excepciones. Si tu archivo produce una huella diferente, la descarga está incompleta o alterada. Descárgalo de nuevo.

Calcula la huella SHA-256 del archivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Símbolo del sistema o PowerShell):** `certutil -hashfile file.iso SHA256`

Compara la cadena hexadecimal larga con el valor publicado por el proyecto. Ambos deben coincidir exactamente.

## Descargas oficiales

Cada fila enlaza a la página de descarga del propio proyecto. Una fila sin checksum significa que el proyecto no publica ninguna huella en la página a la que enlaza. Para un script de instalación o un contenedor no hay archivo que verificar, así que revisa el script antes de ejecutarlo. Para una imagen, busca un checksum en la documentación del proyecto antes de escribirla.

| Plataforma | Qué obtienes | Arquitecturas | Descarga oficial | Checksums |
|---|---|---|---|---|
| Debian | ISO de instalación (netinst) | amd64, arm64 | [debian.org/distrib/netinst](https://www.debian.org/distrib/netinst) | [amd64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO live de servidor (versión LTS; instala desde el sistema live) | amd64, arm64 | [ubuntu.com/download/server](https://ubuntu.com/download/server) | amd64: SHA256SUMS en cada carpeta de versión en [releases.ubuntu.com](https://releases.ubuntu.com/). arm64: [cdimage.ubuntu.com 26.04 SHA256SUMS](https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS) |
| Raspberry Pi OS | Imagen (`.img.xz`) para Raspberry Pi; ISO live de Desktop para PC | arm64 (64 bits) y armhf (32 bits) para Pi; amd64 para la ISO de Desktop | [raspberrypi.com/software/operating-systems](https://www.raspberrypi.com/software/operating-systems/) | Se muestra en la página de descarga debajo de cada imagen, en la sección SHA256 file integrity hash |
| YunoHost | Script de instalación sobre un sistema Debian 12 (Bookworm) recién instalado; la descarga de la imagen aparece marcada como rota en la documentación del proyecto original | Sigue la base de Debian 12 (x86 y ARM) | Base: [archivo de Debian 12](https://cdimage.debian.org/cdimage/archive/) y [YunoHost sobre Debian](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian); script: [install.yunohost.org](https://install.yunohost.org) | No se publica checksum del script. Clave de firma de la imagen: [yunohost_bookworm.asc](https://forge.yunohost.org/keys/yunohost_bookworm.asc) |
| CasaOS | Script de instalación sobre Ubuntu, Debian, Raspberry Pi OS o CentOS: `curl -fsSL https://get.casaos.io \| sudo bash` | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/); script en [get.casaos.io](https://get.casaos.io) | No se publica checksum (script de instalación) |
| CapRover | Contenedor Docker, ejecutar en un host con Docker instalado | amd64, arm64, arm/v7 (listados para la etiqueta más reciente en Docker Hub) | [caprover.com/docs/get-started](https://caprover.com/docs/get-started.html); etiquetas: [Docker Hub](https://hub.docker.com/r/caprover/caprover/tags) | No se publica checksum (imagen de contenedor) |
| balenaOS | Imagen de Host OS para dispositivos compatibles; se escribe con balenaEtcher | Depende del dispositivo (unos 20 tipos de dispositivo en la página) | [balena.io/os](https://www.balena.io/os) (elige tu dispositivo en la sección Download); programa para escribir: [etcher.balena.io](https://etcher.balena.io/) | No se muestra checksum en la página de balena.io; consulta la documentación de balena para ver un checksum publicado antes de escribir la imagen |
| OpenMediaVault | ISO de instalación para un NAS basado en Debian | solo amd64 | [openmediavault.org/download](https://www.openmediavault.org/download.html) | SHA256 impreso debajo de cada ISO en la página de descarga |
| TrueNAS | ISO de Community Edition (SCALE); la descarga pide registrarse en un boletín | x86_64 | [truenas.com/download-truenas-scale](https://www.truenas.com/download-truenas-scale/) | Valor SHA256, archivos `.sha256` y `.gpg` junto a cada ISO |
| LibreMesh | Imagen de firmware personalizada generada por el selector para tu modelo de router; el selector solicita la compilación a una instancia ASU (ImageBuilder en línea) | Depende del modelo de router | Selector: [firmware-selector.libremesh.org](https://firmware-selector.libremesh.org/); detalles de compilación: [libremesh.org/build](https://libremesh.org/build/) | Usa el checksum de la imagen exacta que produjo el selector. No confirmamos dónde lo publica el selector, así que no sustituyas los sums de OpenWrt original, que corresponden a imágenes distintas |
## Fuentes

Consultadas el 30-10-2026.

- https://www.debian.org/distrib/netinst
- https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS
- https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS
- https://ubuntu.com/download/server
- https://releases.ubuntu.com/
- https://www.raspberrypi.com/software/operating-systems/
- https://doc.yunohost.org/admin/get_started/install_on
- https://doc.yunohost.org/admin/get_started/install_on/regular_computer
- https://doc.yunohost.org/admin/get_started/install_on/raspberry_pi
- https://install.yunohost.org
- https://forge.yunohost.org/keys/yunohost_bookworm.asc
- https://casaos.zimaspace.com/
- https://get.casaos.io
- https://caprover.com/docs/get-started.html
- https://www.balena.io/os
- https://etcher.balena.io/
- https://www.openmediavault.org/download.html
- https://www.truenas.com/download-truenas-scale/
- https://firmware-selector.libremesh.org/
- https://downloads.openwrt.org/
- https://downloads.openwrt.org/releases/25.12.6/targets/x86/64/sha256sums
- https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian
- https://cdimage.debian.org/cdimage/archive/
- https://libremesh.org/build/
- https://www.raspberrypi.com/documentation/computers/os.html
- https://www.raspberrypi.com/news/raspberry-pi-desktop-now-available-for-pc-and-mac/
- https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS
- https://releases.ubuntu.com/26.04/SHA256SUMS
- https://hub.docker.com/r/caprover/caprover/tags
- https://hub.docker.com/v2/repositories/caprover/caprover/tags/latest