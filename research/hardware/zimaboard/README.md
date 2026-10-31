# ZimaBoard for Community Servers

## What it is

ZimaBoard is an x86 single-board server made by IceWhale. It has an Intel Celeron processor and onboard LPDDR4 RAM ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)). It ships in three models: 216, 432, and 832 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)). The 216 has a dual-core N3350 with 2 GB RAM. The 432 and 832 have a quad-core N3450 with 4 GB or 8 GB RAM ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).

## Strengths

- Full x86 software support. Linux, Windows, OpenWrt, and pfSense run on it ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Two SATA 6 Gb/s ports for drives, and one external PCIe 2.0 x4 slot ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).
- Two Gigabit Ethernet ports ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).
- Fanless. The heatsink is passive ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Ships with CasaOS installed ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Limits

- The Celeron CPUs are adequate, not fast. The board suits several light services better than one demanding application ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Maximum RAM is 8 GB ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Realtek NICs can need extra drivers on FreeBSD-based routers such as pfSense and OPNsense ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Little GPIO. One Mini DisplayPort output ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- An external 12 V, 3 A adapter is required. Several 3.5-inch drives may need their own power ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Typical community use

NAS software such as TrueNAS or OpenMediaVault. Media servers such as Plex or Jellyfin. Routers running OpenWrt or OPNsense. Home automation hubs ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Power draw

TDP is 6 W for all three models. Typical use is 2-6 W for the 216, 3-8 W for the 432, and 4-10 W for the 832 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).

## Cost range

- ZimaBoard 216 (2 GB): $119.90
- ZimaBoard 432 (4 GB): $159.90
- ZimaBoard 832 (8 GB): $199.90

Source: [models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md). Drives are extra.

## Community Box fit

A ZimaBoard fits a small always-on storage or router node. Choose 4 GB or 8 GB if the box runs several services. For a lower-power node with less storage, see the [Raspberry Pi 5 notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md). For a faster CPU and more RAM, see the [Intel NUC notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md).
