---
title: Visão Geral
sourcePath: hardware/intel_nuc/README.md
sourceHash: 54bd1f4aefb9d671
translatedBy: glm-4.6
---

# Intel NUC para servidores comunitários

## O que é

Um Intel NUC é um mini PC x86 pequeno vendido como kit barebone. Você adiciona RAM, armazenamento e um sistema operacional. A marca passou para a ASUS em 2023 ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)). A pesquisa do repositório cobre os modelos de 13ª geração ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). A ASUS agora vende o NUC 15 Pro com processadores Intel Core Ultra Series 2, até 96 GB de memória DDR5-6400 e uma porta 2.5 GbE ([ASUS NUC 15 Pro](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/), acessado em 2026-10-30). Verifique o modelo que você compra, porque a geração e as especificações variam. A maioria dos modelos mais antigos tem menos de um litro de volume ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Pontos fortes

- CPUs modernas. Os modelos i5 e i7 têm 12 núcleos e 16 threads ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)).
- Até 64 GB de RAM nos modelos de 13ª geração da pesquisa do repositório, e dois slots M.2 em alguns modelos ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). O atual NUC 15 Pro suporta até 96 GB ([ASUS](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/)).
- Executa distribuições Linux padrão. YunoHost, CasaOS e CapRover funcionam nele ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Silencioso e fácil de colocar em uma mesa ou prateleira ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Limites

- A maioria dos modelos tem uma porta Ethernet, de 1 Gbps ou 2.5 Gbps. Configurações de múltiplas redes precisam de um adaptador USB ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Sem baias de disco com hot-swap. A maioria dos modelos aceita dois ou três dispositivos de armazenamento ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Alguns modelos podem precisar do Secure Boot desativado para alguns sistemas Linux. O acesso à BIOS pode ser difícil durante o boot rápido ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- O Windows Server precisa de soluções alternativas de drivers ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Uso comunitário típico

Servidores domésticos para compartilhamento de arquivos e backups. Plataformas comunitárias como YunoHost e CapRover. Cargas de trabalho Docker pequenas. A visão geral sugere NUC10 ou mais recente para o YunoHost ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Consumo de energia

Para o NUC13ANH i5, a tabela de energia na comparação de modelos indica 6-10 W em repouso, 20-35 W em carga típica e 45 W no máximo ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). O valor de 45 W não é um pico real: uma análise independente do NUC 13 Pro mediu cerca de 85–92 W sob carga turbo total ([minipc-review.com](https://minipc-review.com/en/asus-intel-nuc-13-pro-review-mini-pc)). Dimensione sistemas solares ou de bateria para picos curtos próximos a 90 W, e use o adaptador fornecido com o equipamento. A tabela de especificações do mesmo documento lista 15 W em repouso e 45 W em carga para este modelo ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). A visão geral indica 4,5-10 W em repouso entre os modelos ([visão geral](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)). Portanto, a faixa de consumo em repouso é incerta. Meça com um medidor de tomada antes de dimensionar o orçamento de energia.

## Faixa de custo

Preços de varejo para os modelos de 13ª geração na tabela de comparação. O repositório não data esses valores, então verifique os preços atuais:

- NUC13ANH i3: $300-400
- NUC13ANH i5: $450-550
- NUC13ANH i7: $600-700
- NUC13ANK i5 (dois slots M.2): $490-590

Os preços são de [comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md). Some RAM e armazenamento por cima.

## Adequação ao Community Box

Um NUC se encaixa no papel de servidor de uso geral. Use-o quando uma comunidade precisar de mais CPU e RAM do que um Raspberry Pi oferece e puder aceitar um consumo de energia maior. Para um único serviço sempre ativo com orçamento apertado, veja as [notas sobre o Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md). Para uso com muito armazenamento, veja as [notas sobre o ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).