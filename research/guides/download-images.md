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
| Raspberry Pi 3, 4, 5, or Zero 2 W | 64-bit (arm64) Raspberry Pi OS image |
| Original Raspberry Pi, Pi 2, or Pi Zero | 32-bit (armhf) Raspberry Pi OS image (2) |
| Router for LibreMesh | Router firmware for your exact model (6) |

If you are not sure of your processor type, check the hardware guide for your device before you download anything. A file built for the wrong architecture will not start.

## How to write an image

Use Balena Etcher for computers, SD cards, and USB drives. Follow the step-by-step instructions in [Etcher guide](etcher-guide.md).

Router firmware is not written this way. It is installed through the router's own web interface or recovery mode, and the steps depend on the model. Read the [OpenWrt wiki page](https://openwrt.org/toh/start) for your router first.

- **Router on its original (stock) firmware:** install OpenWrt first. Download the factory image for your model from the [OpenWrt Firmware Selector](https://firmware-selector.openwrt.org/) and follow the [OpenWrt first-time installation](https://openwrt.org/docs/guide-quick-start/factory_installation) steps. Check that the router boots and works.
- **Router already running OpenWrt:** upgrade it to LibreMesh. This erases the router's current settings.
  1. Get the LibreMesh image for your exact model from the [LibreMesh firmware selector](https://firmware-selector.libremesh.org/). Pick the file marked sysupgrade; its file extension varies by model.
  2. Open the OpenWrt web interface (LuCI) and go to **System > Backup / Flash Firmware**.
  3. Save the current settings: next to **Download backup**, click **Generate archive** and keep the file.
  4. Under **Flash new firmware image**, click **Flash image...**, then **Browse…** to choose the LibreMesh file, then **Upload**.
  5. In the window that opens, untick **Keep settings and retain the current configuration** so LibreMesh starts from its own defaults. Click **Continue** to start flashing. Do not unplug the router until it restarts.

The [LibreMesh getting started page](https://libremesh.org/getting-started.html) describes this flow, including an SSH method. If a router no longer starts, follow the recovery steps on its OpenWrt wiki page.

Writing a disk erases everything on the target drive. Check the drive letter or size before you start.

## How to check a checksum

A checksum is a fingerprint of a file. Most official download pages publish the expected fingerprint next to the file; the table below notes the exceptions.

Compute the SHA-256 fingerprint of the file:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Command Prompt or PowerShell):** `certutil -hashfile file.iso SHA256`

Compare the long hexadecimal string with the value published by the project. Both must match exactly. If it does not, the download is incomplete or altered; download it again.

## Official downloads

Each row links to the project's own download page. A row with no checksum means the project publishes no fingerprint on the page it links to. The notes below the table explain the exceptions.

| Platform | Type | Architectures | Download | Checksums |
|---|---|---|---|---|
| Debian 13 | Installer ISO | amd64, arm64 | [debian.org](https://www.debian.org/distrib/netinst) | [amd64](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Debian 12 (for YunoHost) | Installer ISO | amd64, arm64 | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/) (3) | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | Live server ISO | amd64, arm64 | [ubuntu.com](https://ubuntu.com/download/server) | [amd64](https://releases.ubuntu.com/), [arm64](https://cdimage.ubuntu.com/ubuntu/releases/) (8) |
| Raspberry Pi OS | Image or live ISO | arm64, armhf; amd64 for Desktop | [raspberrypi.com](https://www.raspberrypi.com/software/operating-systems/) | On download page (2) |
| YunoHost | Install script on Debian 12 | Follows Debian 12 (x86, ARM) | [install.yunohost.org](https://install.yunohost.org) (1) | None for script (4) |
| CasaOS | Install script | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/) | None for script (4) |
| CapRover | Docker container | amd64, arm64, arm/v7 | [caprover.com](https://caprover.com/docs/get-started.html) | None for container (4) |
| balenaOS | Device image | Per device (about 20 types) | [balena.io/os](https://www.balena.io/os) | Not shown on page (5) |
| OpenMediaVault | Installer ISO | amd64 | [openmediavault.org](https://www.openmediavault.org/download.html) | On download page |
| TrueNAS | Installer ISO | x86_64 | [truenas.com](https://www.truenas.com/download-truenas-scale/) (7) | On download page |
| Proxmox VE | Installer ISO | amd64; arm64 for some servers (9) | [proxmox.com](https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso) | On download page |
| ButterBox | Raspberry Pi image | Pi Zero 2 W, Pi 4 | [likebutter.app](https://likebutter.app/docs/build-a-box/raspberry-pi/install-butter/) (10) | None published (10) |
| LibreMesh | Custom router image | Per router model | [firmware selector](https://firmware-selector.libremesh.org/) | Only if the build shows one (6) |

### Notes

1. YunoHost needs Debian 12 (Bookworm) as its base, not Debian 13. The [YunoHost on top of Debian guide](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian) says to download Bookworm (Debian 12). The image download is marked broken in the upstream docs, so use the install script.
2. Raspberry Pi: 64-bit for Pi 3, 4, 5, and Zero 2 W; 32-bit for the original Pi, Pi 2, and Pi Zero. The Desktop ISO is a live image that runs from a USB stick without installing.
3. Debian archive: the SHA256SUMS file sits beside each ISO in its own directory. Check the matching line with the commands above. The 12.15.0 directory is the last Debian 12 point release listed in the archive; use the newest 12.x directory if it changes. Debian also documents this at [Debian CD verification](https://www.debian.org/CD/verify.html).
4. An install script or container has no file to check. Review the script before you run it.
5. The balena.io page shows no checksum. Check the balena documentation for a published checksum before you write the image.
6. The selector builds a custom image for your router. When the build provides a checksum, the selector shows it as sha256sum beside the image. The selector source shows this behavior; we did not confirm it on a live build. If no checksum is shown, keep the file the selector gives you. Do not substitute stock OpenWrt checksums; they cover different images.
7. The TrueNAS download asks for a newsletter sign-up. Its SHA256 value, `.sha256`, and `.gpg` files are next to each ISO.
8. Ubuntu publishes a long-term support (LTS) release, such as 26.04, and a shorter interim release, such as 26.10. Use the LTS release for a community server. Open the folder for the release you downloaded; its SHA256SUMS file is inside (for arm64, in the `release` subfolder).
9. Proxmox VE: on a PC, Intel NUC or ZimaBoard, use the standard (amd64) ISO; the processor needs Intel VT or AMD-V turned on. The arm64 ISO is for some ARM servers only; Proxmox does not support Raspberry Pi. The SHA256 value is listed beside each ISO.
10. ButterBox runs on Raspberry Pi Zero 2 W and Pi 4. Its install page links the image download; pick the latest version and unzip it before you write it with Raspberry Pi Imager. The project publishes no checksum, so check that the file size matches the size shown on the Dropbox download page. A PC version is listed as coming soon.

## Sources

Fetched 2026-10-30; LibreMesh, OpenWrt, Ubuntu and Raspberry Pi rows rechecked 2026-10-31. Proxmox VE and ButterBox rows added 2026-10-31.

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
