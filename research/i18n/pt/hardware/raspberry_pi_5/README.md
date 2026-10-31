---
title: Visão geral
sourcePath: hardware/raspberry_pi_5/README.md
sourceHash: d37570cb218a0d65
translatedBy: glm-4.6
---

# Raspberry Pi 5 para servidores comunitários

## O que é

O Raspberry Pi 5 é um computador ARM de placa única lançado em outubro de 2023 ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Ele tem um processador quad-core Arm Cortex-A76 a 2,4 GHz ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). Tem uma interface PCIe 2.0 para SSDs NVMe ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

Os tamanhos de RAM mudaram desde a pesquisa do repositório. A página atual do produto Raspberry Pi lista modelos somente a unidade com 1, 2, 4, 8 e 16 GB ([página do produto Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/), consultada em 30/10/2026). A visão geral do repositório lista apenas 2, 4 e 8 GB ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). O modelo de 16 GB usa o chip BCM2712 e foi lançado em janeiro de 2025 por $120 ([notícias da Raspberry Pi](https://www.raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120/)).

## Pontos fortes

- Baixo consumo de energia para uma máquina sempre ligada ([refrigeração e energia](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker e software ARM64 rodam nele ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Imagens oficiais ou suporte a ARM64 para YunoHost, CasaOS e CapRover ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Baixo custo para a placa em si. Veja a seção de preços.

## Limites

- A comparação considera 4 GB o ponto ideal para a maioria das aplicações de servidor comunitário ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Mais lento que CPUs x86 para computação pesada, compilação e trabalho com vídeo ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Cartões SD são lentos e se desgastam. Em vez disso, inicialize a partir de um SSD USB ou SSD NVMe ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Uma porta Ethernet Gigabit e nenhuma redundância integrada ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Carga sustentada pode causar thermal throttling (limitação térmica). Use um dissipador de calor ou refrigeração ativa ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Uso comunitário típico

Armazenamento em nuvem pessoal, automação residencial, DNS e DHCP, e painéis de monitoramento. Bom para serviços comunitários pequenos com poucos usuários simultâneos ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Consumo de energia

Os dados de teste do repositório indicam 3,3 W em repouso e 8,0 W sob carga total ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). O pico de consumo é maior. O artigo de lançamento da Raspberry Pi diz que o consumo de pico "increases to around 12W" (aumenta para cerca de 12 W) para as cargas de trabalho mais exigentes, incluindo testes power-virus ([lançamento do Raspberry Pi 5](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/), consultado em 30/10/2026). Dimensione a fonte para cerca de 12 W, não 8 W. Adicione 1,5–4 W para um SSD NVMe ou USB ([refrigeração e energia](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)). A fonte de alimentação oficial é USB-C de 5 V, 5 A ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).

## Preço

Preços de tabela atuais, consultados em 30/10/2026:

- 2 GB: $77,50, vigente a partir de 1º de outubro de 2026 ([notícias da Raspberry Pi, 1º de outubro de 2026](https://www.raspberrypi.com/news/price-increases-for-2gb-raspberry-pi-4-and-raspberry-pi-5/)).
- 16 GB: $305, conforme a [página do produto](https://www.raspberrypi.com/products/raspberry-pi-5/). A página não mostra data.

A página do produto lista 1, 4 e 8 GB sem preços. Os últimos preços com data que encontrei para esses são de 1º de dezembro de 2025: 1 GB $45, 4 GB $70, 8 GB $95 ([notícias da Raspberry Pi, 1º de dezembro de 2025](https://www.raspberrypi.com/news/1gb-raspberry-pi-5-now-available-at-45-and-memory-driven-price-rises/)). Esse anúncio listava 16 GB a $145. Os $305 da página do produto são cerca do dobro disso. O artigo de 1º de outubro de 2026 cobre apenas o modelo de 2 GB. Verifique o preço da loja antes de comprar os modelos de 1, 4, 8 ou 16 GB. A faixa anterior de $60–80 para a placa no repositório está desatualizada.

O total de dois anos do repositório para um Pi 5 de 4 GB, incluindo fonte de alimentação, armazenamento NVMe, refrigeração, case e eletricidade, era de $240 na época da pesquisa ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Isso antecede a mudança de preços de dezembro de 2025.

## Adequação ao Community Box

Um Pi 5 serve como um nó de baixo consumo e serviço único. Escolha o modelo de 4 GB ou 8 GB e inicialize a partir de um SSD. Para mais RAM ou CPU, veja as [notas sobre Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para unidades acopladas, veja as [notas sobre ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).