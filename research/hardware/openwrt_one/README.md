# OpenWrt One

## What it is

The OpenWrt One is a Wi-Fi 6 router built for the OpenWrt project. It is made in collaboration with Banana Pi and sold through Software Freedom Conservancy (SFC) distributors. Its listed price starts at US$125 with case ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). It runs OpenWrt firmware and ships with the current release for its manufacturing batch ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

## Key specs

Specs below come from the OpenWrt wiki device page ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)) unless a line names another source:

- SoC: MediaTek Filogic 820 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- RAM: 1 GB DDR4 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Flash: the wiki says 256 MiB NAND for normal boot, plus 16 MiB NOR for recovery ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)). The Banana Pi specification agrees with the wiki on 256 MB NAND and 16 MB NOR ([Banana Pi](https://www.banana-pi.org/en/bananapi-router/173.html)). The SFC page says 128 MiB SPI NAND plus 4 MiB SPI NOR, with 1 GiB DDR4 RAM ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). The sources conflict, so verify the flash size on your unit before planning storage for images or logs.
- Wi-Fi: dual-band Wi-Fi 6 with 3x3/2x2 streams. The driver is mt76 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Ethernet: one 2.5 Gbit WAN port that also accepts PoE, and one 1 Gbit LAN port ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- USB: one USB 2.0 Type-A host port. A USB-C port on the front is the serial console ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- M.2: a 2242/2230 slot for an NVMe SSD, PCIe gen 2 x1 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Power input (manufacturer spec): USB-C at 15 V USB-PD, per the [Banana Pi OpenWrt One specification](https://www.banana-pi.org/en/bananapi-router/173.html), fetched 2026-10-30. Buy a USB-PD adapter that supports 15 V. Do not use a generic 12 V supply.
- Conflicting listing: the [SFC page](https://sfconservancy.org/activities/openwrt-one.html) describes USB-C power as 12 V USB-PD. A March 2025 [OpenWrt mailing-list message](https://lists.openwrt.org/pipermail/openwrt-adm/2025-March/002664.html) also says the board should be given 15 V, citing a "PD15V" label on the board. Two listings disagree, so follow the manufacturer's 15 V figure.
- PoE: the manufacturer spec lists "Optional 802.3at/af PoE via RT5040 module" ([Banana Pi](https://www.banana-pi.org/en/bananapi-router/173.html)). The wiki and SFC describe PoE as built in. Check whether your unit includes the module before you plan on PoE power.
- Size: 148 x 100.5 mm ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

The wiki does not give the CPU clock, the USB-C voltage, or the wattage. See the Power bullet for the voltage conflict.

## Why it matters for community networks

- It runs OpenWrt, open router firmware. The hardware and firmware are documented on the OpenWrt wiki ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- The SFC says it was built "with software freedom and right to repair in mind" ([SFC](https://sfconservancy.org/)). It also says the device "will never be locked down" and ships "the fully copyleft-compliant source code release from the start" ([SFC](https://sfconservancy.org/activities/openwrt-one.html)).
- Repairability matters for networks that run on donated or shared hardware. This is inferred, not stated by a source.

## Limits as a server

It is a router, not a server. With 1 GB RAM and small flash, it is too small for a general server. Use it as the network edge and run server apps on a separate machine. Compare with the [Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md), which the current Raspberry Pi product page lists at 1 to 16 GB ([Raspberry Pi product page](https://www.raspberrypi.com/products/raspberry-pi-5/)), and the [Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md), which the repo research lists at up to 64 GB and the current ASUS NUC 15 Pro at up to 96 GB ([ASUS](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/)). The single M.2 slot and USB 2.0 port limit storage speed (inferred from the specs above).

## Open Questions

- Resolved: upstream release support. The OpenWrt 24.10.0 release directory lists OpenWrt One images, including `openwrt-24.10.0-mediatek-filogic-openwrt_one-squashfs-sysupgrade.itb` ([OpenWrt downloads](https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/), fetched 2026-10-30). The wiki's "Supported Versions" section is still empty.
- Unresolved: flash size. The wiki and SFC conflict, as stated under Key specs.
- Unresolved: how well it runs LibreMesh. No source fetched links the two. (inferred: a standard OpenWrt device can run LibreMesh packages.)
- Unresolved: where the schematics are. The wiki points to an external site that was not fetched.
- The current price. The SFC page gives "starting at US$125" with no date.

## Sources

- https://openwrt.org/toh/openwrt/one (OpenWrt wiki device page, fetched 2026-10-30)
- https://sfconservancy.org/activities/openwrt-one.html (SFC device page, fetched 2026-10-30)
- https://sfconservancy.org/ (SFC home page, navigation text, fetched 2026-10-30)
- https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/ (OpenWrt 24.10.0 image directory, fetched 2026-10-30)
- https://www.banana-pi.org/en/bananapi-router/173.html (Banana Pi OpenWrt One specification, fetched 2026-10-30; 15 V USB-PD, optional RT5040 PoE module, 256 MB NAND / 16 MB NOR)- https://lists.openwrt.org/pipermail/openwrt-adm/2025-March/002664.html (OpenWrt mailing list, March 2025, fetched 2026-10-30; 15 V discussion)
