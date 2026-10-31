---
title: Visão geral
sourcePath: hardware/raspberry_pi_5/README.md
sourceHash: d5747e860e3f2b78
translatedBy: glm-4.6
---

# Raspberry Pi 5 para servidores comunitários

## O que é

O Raspberry Pi 5 é um computador ARM de placa única lançado em outubro de 2023 ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Ele tem um quad-core Arm Cortex-A76 de 2.4 GHz ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). Ele tem uma interface PCIe 2.0 para SSDs NVMe ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

Os tamanhos de RAM mudaram desde a pesquisa do repositório. A página atual de produtos do Raspberry Pi lista modelos só com a unidade de 1, 2, 4, 8 e 16 GB ([página de produtos do Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/), consultada em 2026-10-30). A visão geral do repositório lista apenas 2, 4 e 8 GB ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). O modelo de 16 GB usa o chip BCM2712 e foi lançado em janeiro de 2025 por $120 ([notícias do Raspberry Pi](https://www.raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120/)).

## Pontos fortes

- Baixo consumo de energia para uma máquina sempre ligada ([refrigeração e energia](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker e softwares ARM64 rodam nele ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Imagens oficiais ou suporte a ARM64 para YunoHost, CasaOS e CapRover ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Baixo custo da placa em si. Veja a seção de preço.

## Limites

- A comparação considera 4 GB o ponto ideal para a maioria das aplicações de servidor comunitário ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Mais lento que CPUs x86 para computação pesada, compilação e trabalho com vídeo ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Cartões SD são lentos e se desgastam. Em vez disso, inicialize a partir de um SSD USB ou SSD NVMe ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Uma única porta Gigabit Ethernet e nenhuma redundância embutida ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Carga sustentada pode causar limitação térmica. Use um dissipador de calor ou refrigeração ativa ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Uso comunitário típico

Armazenamento em nuvem pessoal, automação residencial, DNS e DHCP e painéis de monitoramento. Bom para serviços comunitários pequenos com poucos usuários simultâneos ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Consumo de energia

O Pi 5 consome 3.3 W em repouso e 8.0 W sob carga total ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Adicione 1.5-4 W para um SSD NVMe ou USB ([refrigeração e energia](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)). A fonte de alimentação oficial é USB-C de 5 V, 5 A ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).

## Preço

Preços das placas a partir da mudança de preços de 1 de dezembro de 2025 ([notícias do Raspberry Pi](https://www.raspberrypi.com/news/1gb-raspberry-pi-5-now-available-at-45-and-memory-driven-price-rises/)):

- 1 GB: $45
- 2 GB: $55
- 4 GB: $70
- 8 GB: $95
- 16 GB: $145

O mesmo anúncio culpa o aumento dos custos da memória LPDDR4. A página de produtos consultada em 2026-10-30 também mostrava "Raspberry Pi 5 16GB is available now for $305". Esse valor não corresponde ao anúncio e seu contexto não está claro, então verifique o preço atual da loja antes de comprar. O valor anterior do repositório, de $60-80 pela placa, está desatualizado.

O total de dois anos do repositório para um Pi 5 de 4 GB, incluindo fonte de alimentação, armazenamento NVMe, refrigeração, gabinete e eletricidade, era de $240 na época da pesquisa ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Isso antecede a mudança de preços de dezembro de 2025.

## Adequação ao Community Box

Um Pi 5 serve como um nó de baixo consumo e serviço único. Escolha o modelo de 4 GB ou 8 GB e inicialize a partir de um SSD. Para mais RAM ou CPU, veja as [notas sobre Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para drives conectados, veja as [notas sobre ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).