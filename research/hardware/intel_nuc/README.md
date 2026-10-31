# Intel NUC for Community Servers

## What it is

An Intel NUC is a small x86 mini PC sold as a barebone kit. You add RAM, storage, and an OS. The brand moved to ASUS in 2023 ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)). The repo's research covers 13th-generation models ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). ASUS now sells the NUC 15 Pro with Intel Core Ultra Series 2 processors, up to 96 GB of DDR5-6400 memory, and a 2.5 GbE port ([ASUS NUC 15 Pro](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/), fetched 2026-10-30). Check the model you buy, because the generation and specs vary. Most older models are under one liter in volume ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Strengths

- Modern CPUs. The i5 and i7 models have 12 cores and 16 threads ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)).
- Up to 64 GB RAM on the 13th-generation models in the repo research, and two M.2 slots on some models ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). The current NUC 15 Pro supports up to 96 GB ([ASUS](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/)).
- Runs standard Linux distributions. YunoHost, CasaOS, and CapRover all work on it ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Quiet and easy to place on a desk or shelf ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Limits

- Most models have one Ethernet port, at 1 Gbps or 2.5 Gbps. Multi-network setups need a USB adapter ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- No hot-swap drive bays. Most models take two or three storage devices ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Some models may need Secure Boot turned off for some Linux systems. BIOS access can be hard during fast boot ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Windows Server needs driver workarounds ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Typical community use

Home servers for file sharing and backups. Community platforms such as YunoHost and CapRover. Small Docker workloads. The overview suggests NUC10 or newer for YunoHost ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Power draw

For the NUC13ANH i5, the power table in the models comparison gives 6-10 W idle, 20-35 W typical load, and 45 W maximum ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). Treat 45 W as a peak figure, not a power budget. The same document's specs table lists 15 W idle and 45 W load for this model ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). The overview gives 4.5-10 W idle across models ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)). The idle range is therefore uncertain. Measure with a plug meter before you size the power budget. The adapter wattage for this model was not verified in the repo research or ASUS's current page.

## Cost range

Retail prices for the 13th-generation models in the comparison table. The repo does not date these figures, so check current prices:

- NUC13ANH i3: $300-400
- NUC13ANH i5: $450-550
- NUC13ANH i7: $600-700
- NUC13ANK i5 (two M.2 slots): $490-590

Prices are from [models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md). Add RAM and storage on top.

## Community Box fit

A NUC fits the general-purpose server role. Use it when a community needs more CPU and RAM than a Raspberry Pi and can accept a higher power draw. For a single always-on service on a tight budget, see the [Raspberry Pi 5 notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md). For storage-heavy use, see the [ZimaBoard notes](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).
