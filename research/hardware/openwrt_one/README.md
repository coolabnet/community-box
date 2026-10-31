# OpenWrt One

## What it is

The OpenWrt One is a Wi-Fi 6 router built for the OpenWrt project. It is made in collaboration with Banana Pi and sold through Software Freedom Conservancy (SFC) distributors. Its listed price starts at US$125 with case ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). It runs OpenWrt firmware and ships with the current release for its manufacturing batch ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

## Key specs

Each spec below is from the OpenWrt wiki device page ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)):

- SoC: MediaTek Filogic 820 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- RAM: 1 GB DDR4 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Flash: 256 MiB NAND for normal boot, plus 16 MiB NOR for recovery ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Wi-Fi: dual-band Wi-Fi 6 with 3x3/2x2 streams. The driver is mt76 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Ethernet: one 2.5 Gbit WAN port that also accepts PoE, and one 1 Gbit LAN port ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- USB: one USB 2.0 Type-A host port. A USB-C port on the front is the serial console ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- M.2: a 2242/2230 slot for an NVMe SSD, PCIe gen 2 x1 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Power: USB-C, or PoE through the 2.5G port ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Size: 148 x 100.5 mm ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

The wiki does not give the CPU clock, the power input voltage, or the wattage.

## Why it matters for community networks

- It runs OpenWrt, open router firmware. The hardware and firmware are documented on the OpenWrt wiki ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- The SFC says it was built "with software freedom and right to repair in mind" ([SFC](https://sfconservancy.org/)). It also says the device "will never be locked down" and ships "the fully copyleft-compliant source code release from the start" ([SFC](https://sfconservancy.org/activities/openwrt-one.html)).
- Repairability matters for networks that run on donated or shared hardware. This is inferred, not stated by a source.

## Limits as a server

It is a router, not a server. With 1 GB RAM and 256 MiB NAND, it is too small for a general server. Use it as the network edge and run server apps on a separate machine. Compare with the [Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md), which has 2 to 8 GB RAM, and the [Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md), which has up to 64 GB ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). The single M.2 slot and USB 2.0 port limit storage speed (inferred from the specs above).

## Open Questions

- Whether the OpenWrt One is in the mainline upstream OpenWrt release. The wiki's "Supported Versions" section is empty. It only mentions the 25.10 series for port roles. (inferred: it is supported in current OpenWrt releases.)
- How well it runs LibreMesh. No source fetched links the two. (inferred: a standard OpenWrt device can run LibreMesh packages.)
- Where the schematics are. The wiki points to an external site that was not fetched.
- The current price. The SFC page gives "starting at US$125" with no date.

## Sources

- https://openwrt.org/toh/openwrt/one (OpenWrt wiki device page, fetched 2026-10-30)
- https://sfconservancy.org/activities/openwrt-one.html (SFC device page, fetched 2026-10-30)
- https://sfconservancy.org/ (SFC home page, navigation text, fetched 2026-10-30)
