---
title: Visão geral
sourcePath: hardware/zimaboard/README.md
sourceHash: fdc3239201234557
translatedBy: glm-4.6
---

# ZimaBoard para servidores comunitários

## O que é

O ZimaBoard é um servidor single-board x86 fabricado pela IceWhale. Ele tem um processador Intel Celeron e memória RAM LPDDR4 integrada ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)). Ele é vendido em três modelos: 216, 432 e 832 ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)). O 216 tem um N3350 dual-core com 2 GB de RAM. O 432 e o 832 têm um N3450 quad-core com 4 GB ou 8 GB de RAM ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).

## Pontos fortes

- Suporte total a software x86. Linux, Windows, OpenWrt e pfSense rodam nele ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Duas portas SATA 6 Gb/s para unidades de disco e um slot PCIe 2.0 x4 externo ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).
- Duas portas Ethernet Gigabit ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).
- Sem ventoinha. O dissipador de calor é passivo ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Vem com o CasaOS instalado ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Limites

- Os CPUs Celeron são adequados, não rápidos. A placa serve melhor vários serviços leves do que uma aplicação exigente ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- RAM máxima de 8 GB ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- NICs Realtek podem precisar de drivers extras em roteadores baseados em FreeBSD, como pfSense e OPNsense ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Poucos pinos GPIO. Uma saída Mini DisplayPort ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- É necessário um adaptador externo de 12 V, 3 A. Várias unidades de 3,5 polegadas podem precisar de alimentação própria ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Usos comunitários típicos

Software de NAS como TrueNAS ou OpenMediaVault. Servidores de mídia como Plex ou Jellyfin. Roteadores executando OpenWrt ou OPNsense. Hubs de automação residencial ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Consumo de energia

O TDP é de 6 W para todos os três modelos. O uso típico é de 2-6 W para o 216, 3-8 W para o 432 e 4-10 W para o 832 ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).

## Faixa de preço

- ZimaBoard 216 (2 GB): $119.90
- ZimaBoard 432 (4 GB): $159.90
- ZimaBoard 832 (8 GB): $199.90

Fonte: [comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md). Unidades de disco são vendidas à parte.

## Adequação ao Community Box

Um ZimaBoard serve bem como nó pequeno de armazenamento ou roteador sempre ligado. Escolha 4 GB ou 8 GB se a caixa executar vários serviços. Para um nó de menor consumo com menos armazenamento, veja as [notas sobre o Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md). Para um CPU mais rápido e mais RAM, veja as [notas sobre o Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md).