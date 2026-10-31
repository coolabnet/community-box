---
title: How the tool picks an operating system
---

# How the tool picks an operating system

The recommendation tool suggests up to 4 operating systems. It uses three answers: the main use of the server, how confident you are setting up a computer as a server (*Yes, confidently*, *With guidance* or *No*), and the top hardware recommendation. Every system on this page is installed by erasing the device, so the setup answer measures skill, not whether you may erase it.

## Steps

1. **Main use.** Keep only the systems meant for that use (education, business or personal). If there is no answer, the tool uses education.
2. **Hardware.** Keep only the systems that run on the top recommended device. If none fit, the tool shows no operating system instead of an incompatible one.
3. **Setup skill.** If you answer *No*, keep only beginner systems. Advanced systems (Proxmox VE) appear only if you answer *Yes, confidently*.
4. **Limit.** Show up to 4 systems in catalog order. An advanced system goes last and takes the last slot if the list is full.

## Catalog

| System | Main use | Level | Hardware |
|---|---|---|---|
| Ubuntu Server | education, business, personal | beginner | Intel NUC, ZimaBoard, reused PC |
| Debian | business, personal | intermediate | Intel NUC, ZimaBoard, reused PC, Raspberry Pi |
| Raspberry Pi OS | education, personal | beginner | Raspberry Pi |
| TrueNAS | business, education | intermediate | Intel NUC, ZimaBoard, reused PC |
| OpenMediaVault | education, business | beginner | Intel NUC, ZimaBoard, reused PC, Raspberry Pi |
| ButterBox | education, personal | beginner | Raspberry Pi |
| Proxmox VE | business | advanced | Intel NUC, ZimaBoard, reused PC (amd64 only) |

## Examples

- **Business, Intel NUC, ZimaBoard or reused PC, *Yes, confidently*:** Ubuntu Server, Debian, TrueNAS, Proxmox VE. OpenMediaVault drops out because of the limit of 4.
- **Business, Intel NUC, ZimaBoard or reused PC, *With guidance*:** Ubuntu Server, Debian, TrueNAS, OpenMediaVault.
- **Business, Intel NUC, ZimaBoard or reused PC, *No*:** Ubuntu Server, OpenMediaVault.
- **Education, Raspberry Pi:** Raspberry Pi OS, OpenMediaVault, ButterBox.
- **Personal, Raspberry Pi, *No*:** Raspberry Pi OS, ButterBox.

## Notes

- **Proxmox VE** runs virtual machines and containers, so one box can host several systems side by side. It is marked advanced because you manage the host and each virtual machine. On the PCs, Intel NUCs and ZimaBoards the tool recommends, it needs a 64-bit x86 (amd64) processor with hardware virtualization turned on. Its 2 GB minimum RAM covers only the host; each virtual machine needs its own memory. On ZimaBoard, use the 8 GB model (832) and install to a SATA or NVMe SSD, not the built-in eMMC (see [ZimaBoard troubleshooting](../hardware/zimaboard/zima-troubleshooting.md)). Proxmox also has an arm64 build for some ARM servers, but it does not support Raspberry Pi.
- **ButterBox** is an offline server image from the Guardian Project for Raspberry Pi Zero 2 W and Pi 4. It runs its own Wi-Fi network and works without internet access.

The rules live in `getOSSuggestions` in `app/src/utils/recommendations.ts`. The tests in `app/src/test/osSuggestions.test.ts` check each example above.

See [Download Images](../guides/download-images.md) for the official download link of each system.
