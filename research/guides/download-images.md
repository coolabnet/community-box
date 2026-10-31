---
title: Download Images
---

# Download Images

This guide explains what an operating-system image is, which one to pick for your hardware, how to check that the file you downloaded is intact, and where to get each one from its official source. We link to upstream projects instead of hosting copies, so you always get the current release and the project's own checksums.

## What an image is

An operating-system image is a single file that contains a complete system: the kernel, the software, and the settings needed to start. You write it to a USB stick, SD card, or hard drive, then boot the computer from that drive.

There are two common file types:

- **ISO** (`.iso`): a disk image you boot from. Some ISOs are installers: they ask questions and install to the drive. Others are live images: they run from the USB stick without installing. The project's download description says which kind you get.
- **IMG** (`.img`, often compressed as `.img.xz`): a ready-to-run disk image. You write it directly to the drive; no installer runs. Raspberry Pi images are usually this type.

Some projects do not provide an image at all. Instead they provide an **install script**: you start with a standard Linux system you already have (for example Debian or Ubuntu) and run one command that installs the software on top. Use a script when you already have a working Linux machine. Use an image when you are starting from an empty disk.

## Which one to pick

| Your hardware | What to use |
|---|---|
| x86 PC, Intel NUC, ZimaBoard, reused desktop or laptop | An x86 (amd64) ISO or install script |
| Raspberry Pi 3, 4, or 5 | The 64-bit (arm64) Raspberry Pi OS image |
| Original Raspberry Pi, Raspberry Pi 2, or Raspberry Pi Zero | The 32-bit (armhf) Raspberry Pi OS image; the official page lists these models for 32-bit |
| Raspberry Pi Zero 2 W | Not named on the official page; check the model page before choosing (64-bit is expected for this processor) |
| Router running LibreMesh | A firmware image for your exact router model, chosen in the LibreMesh firmware selector |

If you are not sure of your processor type, check the hardware guide for your device before you download anything. A file built for the wrong architecture will not start.

## How to write an image

Use Balena Etcher or another image writer. Follow the step-by-step instructions in [etcher-guide.md](etcher-guide.md).

Writing erases everything on the target drive. Check the drive letter or size before you start.

## How to check a checksum

A checksum is a fingerprint of a file. Most official download pages publish the expected fingerprint next to the file; the table below notes the exceptions. If your file produces a different fingerprint, the download is incomplete or altered. Download it again.

Compute the SHA-256 fingerprint of the file:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Command Prompt or PowerShell):** `certutil -hashfile file.iso SHA256`

Compare the long hexadecimal string with the value published by the project. Both must match exactly.

## Official downloads

Each row links to the project's own download page. A row with no checksum means the project publishes no fingerprint on the page it links to. For an install script or container there is no file to check, so review the script before you run it. For an image, look for a checksum in the project's documentation before you write it.

| Platform | What you get | Architectures | Official download | Checksums |
|---|---|---|---|---|
| Debian | Installer ISO (netinst) | amd64, arm64 | [debian.org/distrib/netinst](https://www.debian.org/distrib/netinst) | [amd64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | Live server ISO (LTS release; installs from the live system) | amd64, arm64 | [ubuntu.com/download/server](https://ubuntu.com/download/server) | amd64: SHA256SUMS in each release folder at [releases.ubuntu.com](https://releases.ubuntu.com/). arm64: [cdimage.ubuntu.com 26.04 SHA256SUMS](https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS) |
| Raspberry Pi OS | Image (`.img.xz`) for Raspberry Pi; live Desktop ISO for PC | arm64 (64-bit) and armhf (32-bit) for Pi; amd64 for the Desktop ISO | [raspberrypi.com/software/operating-systems](https://www.raspberrypi.com/software/operating-systems/) | Shown on the download page under each image, in the SHA256 file integrity hash section |
| YunoHost | Install script on a fresh Debian 12 (Bookworm) system; the image download is marked broken in the upstream docs | Follows the Debian 12 base (x86 and ARM) | Base: [Debian 12 archive](https://cdimage.debian.org/cdimage/archive/) and [YunoHost on top of Debian](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian); script: [install.yunohost.org](https://install.yunohost.org) | No checksum published for the script. Image signing key: [yunohost_bookworm.asc](https://forge.yunohost.org/keys/yunohost_bookworm.asc) |
| CasaOS | Install script on Ubuntu, Debian, Raspberry Pi OS, or CentOS: `curl -fsSL https://get.casaos.io \| sudo bash` | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/); script at [get.casaos.io](https://get.casaos.io) | No checksum published (install script) |
| CapRover | Docker container, run on a host with Docker installed | amd64, arm64, arm/v7 (listed for the latest tag on Docker Hub) | [caprover.com/docs/get-started](https://caprover.com/docs/get-started.html); tags: [Docker Hub](https://hub.docker.com/r/caprover/caprover/tags) | No checksum published (container image) |
| balenaOS | Host OS image for supported devices; written with balenaEtcher | Depends on device (about 20 device types on the page) | [balena.io/os](https://www.balena.io/os) (choose your device in the Download section); writer: [etcher.balena.io](https://etcher.balena.io/) | No checksum shown on the balena.io page; check the balena documentation for a published checksum before you write the image |
| OpenMediaVault | ISO installer for a Debian-based NAS | amd64 only | [openmediavault.org/download](https://www.openmediavault.org/download.html) | SHA256 printed under each ISO on the download page |
| TrueNAS | Community Edition ISO (SCALE); the download asks for a newsletter sign-up | x86_64 | [truenas.com/download-truenas-scale](https://www.truenas.com/download-truenas-scale/) | SHA256 value, `.sha256` and `.gpg` files next to each ISO |
| LibreMesh | Custom firmware image built by the selector for your router model; the selector requests the build from an ASU (online ImageBuilder) instance | Depends on router model | Selector: [firmware-selector.libremesh.org](https://firmware-selector.libremesh.org/); build details: [libremesh.org/build](https://libremesh.org/build/) | Use the checksum for the exact image the selector produced. We did not confirm where the selector publishes it, so do not substitute stock OpenWrt sums, which cover different images |

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
- https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian
- https://cdimage.debian.org/cdimage/archive/
- https://libremesh.org/build/
- https://www.raspberrypi.com/documentation/computers/os.html
- https://www.raspberrypi.com/news/raspberry-pi-desktop-now-available-for-pc-and-mac/
- https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS
- https://releases.ubuntu.com/26.04/SHA256SUMS
- https://hub.docker.com/r/caprover/caprover/tags
- https://hub.docker.com/v2/repositories/caprover/caprover/tags/latest
