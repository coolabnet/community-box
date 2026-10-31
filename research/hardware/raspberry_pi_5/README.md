# Raspberry Pi 5 for Community Servers

## What it is

The Raspberry Pi 5 is a single-board ARM computer released in October 2023 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). It has a quad-core Arm Cortex-A76 at 2.4 GHz. It comes with 2, 4, or 8 GB of LPDDR4X RAM ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). It has a PCIe 2.0 interface for NVMe SSDs ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Strengths

- Low power draw for an always-on machine ([cooling and power](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Native ARM64 Docker support ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Official images or ARM64 support for YunoHost, CasaOS, and CapRover ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Cheap to replace. The board alone is $60-80 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).

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

## Cost range

- Board: $60-80 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- The comparison's two-year total for a Pi 5 4 GB, including power supply, NVMe storage, cooling, case, and electricity, is $240 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).

## Community Box fit

A Pi 5 fits a low-power, single-service node. Pick the 4 GB or 8 GB model and boot from an SSD. For more RAM or CPU, see the [Intel NUC notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). For attached drives, see the [ZimaBoard notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).
