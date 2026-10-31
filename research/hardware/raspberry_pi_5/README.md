# Raspberry Pi 5 for Community Servers

## What it is

The Raspberry Pi 5 is a single-board ARM computer released in October 2023 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). It has a quad-core Arm Cortex-A76 at 2.4 GHz ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). It has a PCIe 2.0 interface for NVMe SSDs ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

RAM options have changed since the repo research. The current Raspberry Pi product page lists unit-only models at 1, 2, 4, 8, and 16 GB. It does not list a 3 GB model ([Raspberry Pi product page](https://www.raspberrypi.com/products/raspberry-pi-5/), fetched 2026-10-30). The repo overview lists only 2, 4, and 8 GB ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Strengths

- Low power draw for an always-on machine ([cooling and power](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker and ARM64 software run on it ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Official images or ARM64 support for YunoHost, CasaOS, and CapRover ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Low cost for the board itself. See the price section.

## Limits

- The comparison calls 4 GB the sweet spot for most community server applications ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Slower than current desktop and mini-PC x86 CPUs (such as the Intel NUC) for heavy compute, compiling, and video work, though faster than older low-power x86 boards ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- SD cards are slow and wear out. Boot from a USB SSD or NVMe SSD instead ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- One Gigabit Ethernet port and no built-in redundancy ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Sustained load can cause thermal throttling. Use a heatsink or active cooling ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Typical community use

Personal cloud storage, home automation, DNS and DHCP, and monitoring dashboards. Good for small community services with few simultaneous users ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Power draw and supply

The repo's test data gives 3.3 W at idle and 8.0 W under full load ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Peak board draw is about 12 W. Raspberry Pi's launch article gives this figure for the most demanding workloads, including power-virus tests ([Raspberry Pi 5 launch](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/), fetched 2026-10-30). Add 1.5-4 W for an NVMe or USB SSD ([cooling and power](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).

The board's peak figure is not the supply rating. Raspberry Pi recommends its 27 W USB-C power supply for the Pi 5 ([Raspberry Pi documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html), fetched 2026-10-30). That supply is rated 5 V, 5 A. It is the right choice when USB drives or SSDs are attached. A 3 A supply limits downstream USB devices to 600 mA ([Raspberry Pi documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html); [launch article](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/)).

## Price

List prices have changed several times in 2025 and 2026 because of memory costs. Check the [official product page](https://www.raspberrypi.com/products/raspberry-pi-5/) for current prices.

## Community Box fit

A Pi 5 fits a low-power, single-service node. Pick the 4 GB or 8 GB model and boot from an SSD, with the 27 W supply if you attach drives. For more RAM or CPU, see the [Intel NUC notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). For attached drives, see the [ZimaBoard notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).
