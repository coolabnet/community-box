---
title: Descargar Imágenes
sourcePath: guides/download-images.md
sourceHash: b8ef1f2567199508
translatedBy: glm-4.6
---

# Descargar imágenes

Esta guía explica qué es una "imagen" de sistema operativo, cuál elegir para tu hardware, cómo verificar que el archivo que descargaste está intacto y dónde obtener cada una de su fuente oficial. Enlazamos a los proyectos originales en lugar de alojar copias, para que siempre obtengas la versión actual y los checksums del propio proyecto.

## Qué es una imagen

Una imagen de sistema operativo es un archivo único que contiene un sistema completo: el kernel, el software y la configuración necesaria para arrancar. La escribes en una memoria USB, tarjeta SD o disco duro, y luego arrancas la computadora desde ese dispositivo.

Hay dos tipos de archivo comunes:

- **ISO** (`.iso`): una imagen de disco instaladora. Arrancas desde ella y respondes las preguntas del instalador, como harías al instalar Windows o Linux desde un DVD.
- **IMG** (`.img`, a menudo comprimida como `.img.xz`): una imagen de disco lista para usar. La escribes directamente en el dispositivo; no se ejecuta ningún instalador. Las imágenes de Raspberry Pi suelen ser de este tipo.

Algunos proyectos no proporcionan una imagen. En su lugar, ofrecen un **script de instalación**: comienzas con un sistema Linux estándar que ya tienes (por ejemplo, Debian o Ubuntu) y ejecutas un comando que instala el software encima. Usa un script si ya tienes una máquina Linux funcionando. Usa una imagen si estás empezando desde un disco vacío.

## Cuál elegir

| Tu hardware | Qué usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, desktop o laptop reutilizado | Una ISO x86 (amd64) o un script de instalación |
| Raspberry Pi | Una imagen arm64, generalmente Raspberry Pi OS de 64 bits o la compilación arm64 de una plataforma |
| Router con LibreMesh | Una imagen de firmware para tu modelo exacto de router, elegida en el selector de firmware de LibreMesh |

Si no estás seguro del tipo de procesador, consulta la guía de hardware de tu dispositivo antes de descargar nada. Un archivo compilado para la arquitectura incorrecta no arrancará.

## Cómo escribir una imagen

Usa Balena Etcher u otro programa para escribir imágenes. Sigue las instrucciones paso a paso en [etcher-guide.md](etcher-guide.md).

Escribir borra todo el contenido del dispositivo de destino. Verifica la letra o el tamaño del dispositivo antes de comenzar.

## Cómo verificar un checksum

Un checksum es una huella digital de un archivo. Cada página oficial de descarga publica la huella esperada. Si tu archivo produce una huella diferente, la descarga está incompleta o alterada. Descárgalo de nuevo.

Calcula la huella SHA-256 del archivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Símbolo del sistema o PowerShell):** `certutil -hashfile file.iso SHA256`

Compara la cadena hexadecimal larga con el valor publicado por el proyecto. Ambos deben coincidir exactamente.

## Descargas oficiales

Cada fila enlaza a la página de descarga del propio proyecto. Una fila sin checksum significa que el proyecto distribuye un script de instalación o un contenedor, por lo que no hay un archivo que verificar; revisa el script antes de ejecutarlo.

| Plataforma | Qué obtienes | Arquitecturas | Descarga oficial | Checksums |
|---|---|---|---|---|
| Debian | ISO instaladora (netinst) | amd64, arm64 | [debian.org/distrib/netinst](https://www.debian.org/distrib/netinst) | [amd64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO instaladora (versión LTS) | amd64; arm64 en la versión más reciente | [ubuntu.com/download/server](https://ubuntu.com/download/server) | SHA256SUMS en cada carpeta de versión en [releases.ubuntu.com](https://releases.ubuntu.com/) |
| Raspberry Pi OS | Imagen (`.img.xz`) para Raspberry Pi; ISO Desktop para PC | arm64 y armhf (Pi); amd64 (ISO Desktop) | [raspberrypi.com/software/operating-systems](https://www.raspberrypi.com/software/operating-systems/) | Mostrado en la página de descarga bajo cada imagen ("SHA256 file integrity hash") |
| YunoHost | Script de instalación sobre un sistema Debian existente (la descarga de imagen está marcada como rota en la documentación original) | Depende de la base de Debian (x86 y ARM) | Script: [install.yunohost.org](https://install.yunohost.org); documentación: [guía de instalación de doc.yunohost.org](https://doc.yunohost.org/admin/get_started/install_on) | No hay checksum publicado para el script. Clave de firma de imagen: [yunohost_bookworm.asc](https://forge.yunohost.org/keys/yunohost_bookworm.asc) |
| CasaOS | Script de instalación sobre Ubuntu, Debian, Raspberry Pi OS o CentOS: `curl -fsSL https://get.casaos.io \| sudo bash` | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/); script en [get.casaos.io](https://get.casaos.io) | No hay checksum publicado (script de instalación) |
| CapRover | Contenedor Docker, se ejecuta en un host con Docker instalado | amd64, arm64 (la imagen ARMv7 de 32 bits ya no se publica) | [caprover.com/docs/get-started](https://caprover.com/docs/get-started.html) | No hay checksum publicado (imagen de contenedor) |
| balenaOS | Imagen de Host OS para dispositivos compatibles; se escribe con balenaEtcher | Depende del dispositivo (unos 20 tipos de dispositivo en la página) | [balena.io/os](https://www.balena.io/os) (elige tu dispositivo en la sección Download); programa para escribir: [etcher.balena.io](https://etcher.balena.io/) | No se muestra checksum en la página |
| OpenMediaVault | ISO instaladora para un NAS basado en Debian | solo amd64 | [openmediavault.org/download](https://www.openmediavault.org/download.html) | SHA256 impreso bajo cada ISO en la página de descarga |
| TrueNAS | ISO de Community Edition (SCALE); la descarga pide suscribirse a un boletín | x86_64 | [truenas.com/download-truenas-scale](https://www.truenas.com/download-truenas-scale/) | Valor SHA256, archivos `.sha256` y `.gpg` junto a cada ISO |
| LibreMesh | Imagen de firmware para tu modelo de router, elegida en el selector de firmware; el selector enlaza a las descargas de OpenWrt | Depende del modelo de router | Selector: [firmware-selector.libremesh.org](https://firmware-selector.libremesh.org/); archivos: [downloads.openwrt.org](https://downloads.openwrt.org/) | Cada carpeta de versión de OpenWrt tiene un archivo `sha256sums`, por ejemplo [25.12.6 x86/64](https://downloads.openwrt.org/releases/25.12.6/targets/x86/64/sha256sums) |

## Fuentes

Consultado el 2026-10-30.

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