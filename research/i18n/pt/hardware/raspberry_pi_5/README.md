---
title: Visão geral
sourcePath: hardware/raspberry_pi_5/README.md
sourceHash: a55c1eff2a28d2b5
translatedBy: glm-4.6
---

# Raspberry Pi 5 para servidores comunitários

## O que é

O Raspberry Pi 5 é um computador ARM de placa única lançado em outubro de 2023 ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Ele tem um Arm Cortex-A76 quad-core de 2,4 GHz ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). Ele tem uma interface PCIe 2.0 para SSDs NVMe ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

As opções de RAM mudaram desde a pesquisa do repositório. A página atual de produtos do Raspberry Pi lista modelos apenas da unidade com 1, 2, 4, 8 e 16 GB. Não lista um modelo de 3 GB ([página de produtos do Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/), consultada em 2026-10-30). A visão geral do repositório lista apenas 2, 4 e 8 GB ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Pontos fortes

- Baixo consumo de energia para uma máquina sempre ligada ([refrigeração e energia](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker e softwares ARM64 funcionam nele ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Imagens oficiais ou suporte a ARM64 para YunoHost, CasaOS e CapRover ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Custo baixo para a placa em si. Veja a seção de preço.

## Limites

- A comparação considera os 4 GB o ponto ideal para a maioria das aplicações de servidor comunitário ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Mais lento que CPUs x86 para computação pesada, compilação e trabalho com vídeo ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Cartões SD são lentos e se desgastam. Em vez disso, inicialize a partir de um SSD USB ou SSD NVMe ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Uma única porta Gigabit Ethernet e nenhuma redundância integrada ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Carga sustentada pode causar limitação térmica. Use um dissipador de calor ou refrigeração ativa ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Uso comunitário típico

Armazenamento em nuvem pessoal, automação residencial, DNS e DHCP e painéis de monitoramento. Bom para pequenos serviços comunitários com poucos usuários simultâneos ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Consumo e fonte de energia

Os dados de teste do repositório indicam 3,3 W em repouso e 8,0 W sob carga total ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). O consumo máximo da placa é de cerca de 12 W. O artigo de lançamento do Raspberry Pi dá esse valor para as cargas de trabalho mais exigentes, incluindo testes de power-virus ([lançamento do Raspberry Pi 5](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/), consultado em 2026-10-30). Adicione de 1,5 a 4 W para um SSD NVMe ou USB ([refrigeração e energia](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).

O valor de consumo máximo da placa não é a especificação da fonte. A Raspberry Pi recomenda sua fonte de alimentação USB-C de 27 W para o Pi 5 ([documentação do Raspberry Pi](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html), consultada em 2026-10-30). Essa fonte é especificada em 5 V, 5 A. É a escolha certa quando unidades USB ou SSDs estão conectados. Uma fonte de 3 A limita os dispositivos USB downstream a 600 mA ([documentação do Raspberry Pi](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html); [artigo de lançamento](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/)).

## Preço

Os preços de tabela mudaram várias vezes em 2025 e 2026 por causa dos custos de memória. Consulte a [página oficial do produto](https://www.raspberrypi.com/products/raspberry-pi-5/) para os preços atuais.

## Adequação ao Community Box

Um Pi 5 serve como um nó de baixo consumo e serviço único. Escolha o modelo de 4 GB ou 8 GB e inicialize a partir de um SSD, com a fonte de 27 W se você conectar unidades. Para mais RAM ou CPU, veja as [notas sobre o Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para unidades conectadas, veja as [notas sobre o ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).