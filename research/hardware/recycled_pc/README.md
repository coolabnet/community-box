# Reused and Recycled PCs for Community Servers

## What it is

A reused PC is an office desktop, mini PC, or laptop that a community repurposes as a server. Business machines from corporate refreshes are the usual source ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)). Common choices include the Dell OptiPlex 7050 SFF, HP EliteDesk 800 G3, Lenovo ThinkCentre M920q, and ThinkPad T480 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).

## Strengths

- Much more CPU, RAM, and storage room than a single-board computer ([requirements](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).
- x86-64 hardware, so x86-64 server software is a natural fit. The requirements guide asks for a 64-bit x86 CPU with virtualization support ([requirements](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)). Confirm that your chosen OS and apps support the exact model before you install.
- Business models are rated as reliable. The comparison estimates 5-7 years for Dell OptiPlex and HP EliteDesk ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Upgradable RAM and storage. Desktop towers rate best for upgrades ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Low cost. Basic servers cost $100-200 ([requirements](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).

## Limits

- Power use is high for desktop towers. Idle draw is 60-80 W ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Laptops and mini PCs have little room to expand ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Used hardware varies. Check BIOS settings, and reset them when needed. The preparation guide lists unknown BIOS passwords, corrupted settings, compatibility problems, and instability after component changes as reasons to reset ([preparation](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-preparation.md)).

## Minimum specs

From the requirements guide ([requirements](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)):

- CPU: 64-bit x86, 1.4 GHz or faster, 2 cores minimum (4 recommended), with VT-x or AMD-V.
- RAM: 4 GB absolute minimum, 8 GB recommended, 16 GB optimal.
- Storage: 120 GB SSD minimum, 256 GB recommended. Add a 1 TB HDD for file storage.
- Network: Gigabit Ethernet required.
- Power supply: the requirements guide gives 300 W minimum, 80 PLUS Bronze or better ([requirements](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)). That figure fits full desktops with several drives. Size small machines to their own adapter. Lenovo's ThinkCentre M920 Tiny, a recommended model in the comparison, ships with 65 W, 90 W, or 135 W adapters ([Lenovo PSREF](https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M920_Tiny/ThinkCentre_M920_Tiny_Spec.html), fetched 2026-10-30).

Exclude 32-bit CPUs, machines with less than 4 GB maximum RAM, and 100 Mbps network ports ([requirements](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).

## Power draw

By form factor, from the comparison table ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)):

- Desktop tower: 60-80 W idle, 150-250 W load.
- Small form factor: 25-40 W idle, 80-120 W load.
- Laptop, plugged in: 15-25 W idle, 45-65 W load.
- Mini PC: 10-20 W idle, 35-55 W load.

## Cost range

- Basic server: $100-200. Capable server: $200-400. Performance server: $400-600 ([requirements](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).
- Mini PC: $200-400. Laptop (6th gen or newer): $300-500 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).

## Preparation

Before use, power off, unplug, and wait 5-10 minutes. Note the system details. Clean dust, reset the BIOS if needed, and test components ([preparation](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-preparation.md)).

## Community Box fit

A reused PC fits a community that needs more RAM and storage than a Pi, and has space and power for a desktop. For compact, lower-power hardware, see the [Intel NUC notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). For a fanless board with drive ports, see the [ZimaBoard notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).
