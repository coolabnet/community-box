---
title: Download Images
---

# Download Images

This guide explains what an operating-system "image" is, which one to pick for your hardware, how to check that the file you downloaded is intact, and where to get each one from its official source. We link to upstream projects instead of hosting copies, so you always get the current release and the project's own checksums.

## What an image is

An operating-system image is a single file that contains a complete system: the kernel, the software, and the settings needed to start. You write it to a USB stick, SD card, or hard drive, then boot the computer from that drive.

There are two common file types:

- **ISO** (`.iso`): an installer disk image. You boot from it and answer the installer's questions, as you would when installing Windows or Linux from a DVD.
- **IMG** (`.img`, often compressed as `.img.xz`): a ready-to-run disk image. You write it directly to the drive; no installer runs. Raspberry Pi images are usually this type.

Some projects do not provide an image at all. Instead they provide an **install script**: you start with a standard Linux system you already have (for example Debian or Ubuntu) and run one command that installs the software on top. Use a script when you already have a working Linux machine. Use an image when you are starting from an empty disk.

## Which one to pick

| Your hardware | What to use |
|---|---|
| x86 PC, Intel NUC, ZimaBoard, reused desktop or laptop | An x86 (amd64) ISO or install script |
| Raspberry Pi | An arm64 image, usually the 64-bit Raspberry Pi OS or the arm64 build of a platform |
| Router running LibreMesh | A firmware image for your exact router model, chosen in the LibreMesh firmware selector |

If you are not sure of your processor type, check the hardware guide for your device before you download anything. A file built for the wrong architecture will not start.

## How to write an image

Use Balena Etcher or another image writer. Follow the step-by-step instructions in [etcher-guide.md](etcher-guide.md).

Writing erases everything on the target drive. Check the drive letter or size before you start.

## How to check a checksum

A checksum is a fingerprint of a file. Each official download page publishes the expected fingerprint. If your file produces a different fingerprint, the download is incomplete or altered. Download it again.

Compute the SHA-256 fingerprint of the file:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Command Prompt or PowerShell):** `certutil -hashfile file.iso SHA256`

Compare the long hexadecimal string with the value published by the project. Both must match exactly.

## Official downloads

Each row links to the project's own download page. A row with no checksum means the project distributes an install script or a container, so there is no file to check; review the script before you run it.

| Platform | What you get | Architectures | Official download | Checksums |
|---|---|---|---|---|
| Debian | Installer ISO (netinst) | amd64, arm64 | [debian.org/distrib/netinst](https://www.debian.org/distrib/netinst) | [amd64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | Installer ISO (LTS release) | amd64; arm64 on the newest release | [ubuntu.com/download/server](https://ubuntu.com/download/server) | SHA256SUMS in each release folder at [releases.ubuntu.com](https://releases.ubuntu.com/) |
| Raspberry Pi OS | Image (`.img.xz`) for Raspberry Pi; Desktop ISO for PC | arm64 and armhf (Pi); amd64 (Desktop ISO) | [raspberrypi.com/software/operating-systems](https://www.raspberrypi.com/software/operating-systems/) | Shown on the download page under each image ("SHA256 file integrity hash") |
| YunoHost | Install script on an existing Debian system (the image download is marked broken in the upstream docs) | Depends on the Debian base (x86 and ARM) | Script: [install.yunohost.org](https://install.yunohost.org); docs: [doc.yunohost.org install guide](https://doc.yunohost.org/admin/get_started/install_on) | No checksum published for the script. Image signing key: [yunohost_bookworm.asc](https://forge.yunohost.org/keys/yunohost_bookworm.asc) |
| CasaOS | Install script on Ubuntu, Debian, Raspberry Pi OS, or CentOS: `curl -fsSL https://get.casaos.io \| sudo bash` | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/); script at [get.casaos.io](https://get.casaos.io) | No checksum published (install script) |
| CapRover | Docker container, run on a host with Docker installed | amd64, arm64 (the 32-bit ARMv7 image is no longer published) | [caprover.com/docs/get-started](https://caprover.com/docs/get-started.html) | No checksum published (container image) |
| balenaOS | Host OS image for supported devices; written with balenaEtcher | Depends on device (about 20 device types on the page) | [balena.io/os](https://www.balena.io/os) (choose your device in the Download section); writer: [etcher.balena.io](https://etcher.balena.io/) | No checksum shown on the page |
| OpenMediaVault | ISO installer for a Debian-based NAS | amd64 only | [openmediavault.org/download](https://www.openmediavault.org/download.html) | SHA256 printed under each ISO on the download page |
| TrueNAS | Community Edition ISO (SCALE); the download asks for a newsletter sign-up | x86_64 | [truenas.com/download-truenas-scale](https://www.truenas.com/download-truenas-scale/) | SHA256 value, `.sha256` and `.gpg` files next to each ISO |
| LibreMesh | Firmware image for your router model, chosen in the firmware selector; the selector links to OpenWrt downloads | Depends on router model | Selector: [firmware-selector.libremesh.org](https://firmware-selector.libremesh.org/); files: [downloads.openwrt.org](https://downloads.openwrt.org/) | Each OpenWrt release folder has a `sha256sums` file, for example [25.12.6 x86/64](https://downloads.openwrt.org/releases/25.12.6/targets/x86/64/sha256sums) |

## Sources

Fetched 2026-10-30.

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
