# Raspberry Pi 5 for Community Servers

## What it is

The Raspberry Pi 5 is a single-board ARM computer released in October 2023 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). It has a quad-core Arm Cortex-A76 at 2.4 GHz ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). It has a PCIe 2.0 interface for NVMe SSDs ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

RAM sizes have changed since the repo research. The current Raspberry Pi product page lists unit-only models at 1, 2, 4, 8, and 16 GB ([Raspberry Pi product page](https://www.raspberrypi.com/products/raspberry-pi-5/), fetched 2026-10-30). The repo overview lists only 2, 4, and 8 GB ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). The 16 GB model uses the BCM2712 chip and was launched in January 2025 at $120 ([Raspberry Pi news](https://www.raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120/)).

## Strengths

- Low power draw for an always-on machine ([cooling and power](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker and ARM64 software run on it ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Official images or ARM64 support for YunoHost, CasaOS, and CapRover ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Low cost for the board itself. See the price section.

## Limits

- The comparison calls 4 GB the sweet spot for most community server applications ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Slower than x86 CPUs for heavy compute, compiling, and video work ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- SD cards are slow and wear out. Boot from a USB SSD or NVMe SSD instead ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- One Gigabit Ethernet port and no built-in redundancy ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Sustained load can cause thermal throttling. Use a heatsink or active cooling ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Typical community use

Personal cloud storage, home automation, DNS and DHCP, and monitoring dashboards. Good for small community services with few simultaneous users ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Power draw

The Pi 5 uses 3.3 W at idle and 8.0 W under full load ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Add 1.5-4 W for an NVMe or USB SSD ([cooling and power](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)). The official power supply is 5 V, 5 A USB-C ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).

## Price

Board prices from the 1 December 2025 price change ([Raspberry Pi news](https://www.raspberrypi.com/news/1gb-raspberry-pi-5-now-available-at-45-and-memory-driven-price-rises/)):

- 1 GB: $45
- 2 GB: $55
- 4 GB: $70
- 8 GB: $95
- 16 GB: $145

The same announcement blames rising LPDDR4 memory costs. The product page fetched on 2026-10-30 also showed "Raspberry Pi 5 16GB is available now for $305". That figure does not match the announcement and its context is unclear, so check the current store price before buying. The repo's earlier figure of $60-80 for the board is out of date.

The repo's two-year total for a Pi 5 4 GB, including power supply, NVMe storage, cooling, case, and electricity, was $240 at the time of the research ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). It predates the December 2025 price change.

## Community Box fit

A Pi 5 fits a low-power, single-service node. Pick the 4 GB or 8 GB model and boot from an SSD. For more RAM or CPU, see the [Intel NUC notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). For attached drives, see the [ZimaBoard notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).
