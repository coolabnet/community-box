---
title: How the tool picks an operating system
---

# How the tool picks an operating system

The recommendation tool suggests up to 4 operating systems. It uses three answers: the main use of the server, whether you can format (erase and reinstall) the device, and the top hardware recommendation.

## Steps

1. **Main use.** Keep only the systems meant for that use (education, business or personal). If there is no answer, the tool uses education.
2. **Hardware.** Keep only the systems that run on the top recommended device. If none fit, the tool shows no operating system instead of an incompatible one.
3. **Formatting.** If you cannot format the device, keep only beginner systems.
4. **Formatting required.** Proxmox VE replaces the whole disk, so the tool offers it only when you answer that you can format. When it is offered, it goes first in the list.
5. **Limit.** Show the first 4 systems that remain.

## Catalog

| System | Main use | Level | Hardware |
|---|---|---|---|
| Ubuntu Server | education, business, personal | beginner | Intel NUC, ZimaBoard, reused PC |
| Debian | business, personal | intermediate | Intel NUC, ZimaBoard, reused PC, Raspberry Pi |
| Raspberry Pi OS | education, personal | beginner | Raspberry Pi |
| TrueNAS | business, education | intermediate | Intel NUC, ZimaBoard, reused PC |
| OpenMediaVault | education, business | beginner | Intel NUC, ZimaBoard, reused PC, Raspberry Pi |
| ButterBox | education, personal | beginner | Raspberry Pi |
| Proxmox VE | business (only if you can format) | intermediate | Intel NUC, reused PC (amd64 only) |

## Examples

- **Business, Intel NUC or reused PC, can format:** Proxmox VE, Ubuntu Server, Debian, TrueNAS. OpenMediaVault drops out because of the limit of 4.
- **Business, Intel NUC or reused PC, not sure about formatting:** Ubuntu Server, Debian, TrueNAS, OpenMediaVault.
- **Business, Intel NUC or reused PC, cannot format:** Ubuntu Server, OpenMediaVault.
- **Education, Raspberry Pi:** Raspberry Pi OS, OpenMediaVault, ButterBox.
- **Personal, Raspberry Pi, cannot format:** Raspberry Pi OS, ButterBox.

## Notes

- **Proxmox VE** runs virtual machines and containers. On the PCs and Intel NUCs the tool recommends, it needs a 64-bit x86 (amd64) processor with hardware virtualization turned on. Its 2 GB minimum RAM covers only the host; each virtual machine needs its own memory. Proxmox also has an arm64 build for some ARM servers, but it does not support Raspberry Pi. ZimaBoard is not listed.
- **ButterBox** is an offline server image from the Guardian Project for Raspberry Pi Zero 2 W and Pi 4. It runs its own Wi-Fi network and works without internet access.

The rules live in `getOSSuggestions` in `app/src/utils/recommendations.ts`. The tests in `app/src/test/osSuggestions.test.ts` check each example above.

See [Download Images](../guides/download-images.md) for the official download link of each system.
