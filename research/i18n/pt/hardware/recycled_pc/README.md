---
title: Visão geral
sourcePath: hardware/recycled_pc/README.md
sourceHash: 5436f1ddc86890bc
translatedBy: glm-4.6
---

# PCs Reutilizados e Reciclados para Servidores Comunitários

## O que é

Um PC reutilizado é um desktop de escritório, mini PC ou laptop que uma comunidade transforma em servidor. Máquinas empresariais vindas de renovações corporativas são a fonte usual ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)). Escolhas comuns incluem o Dell OptiPlex 7050 SFF, HP EliteDesk 800 G3, Lenovo ThinkCentre M920q e ThinkPad T480 ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).

## Pontos fortes

- Muito mais CPU, RAM e espaço de armazenamento do que um computador de placa única ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).
- Hardware x86-64, então softwares de servidor x86-64 são uma combinação natural. O guia de requisitos pede uma CPU x86 de 64 bits com suporte à virtualização ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)). Confirme se o sistema operacional e os aplicativos escolhidos suportam o modelo exato antes de instalar.
- Modelos empresariais são considerados confiáveis. A comparação estima 5-7 anos para Dell OptiPlex e HP EliteDesk ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- RAM e armazenamento atualizáveis. Torres de desktop são as melhores para upgrades ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Custo baixo. Servidores básicos custam $100-200 ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).

## Limites

- O consumo de energia é alto para torres de desktop. O consumo em repouso é de 60-80 W ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Laptops e mini PCs têm pouco espaço para expansão ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Hardware usado varia. Verifique as configurações da BIOS e redefina-as quando necessário. O guia de preparação lista senhas de BIOS desconhecidas, configurações corrompidas, problemas de compatibilidade e instabilidade após trocas de componentes como razões para redefinir ([preparação](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-preparation.md)).

## Especificações mínimas

Do guia de requisitos ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)):

- CPU: x86 de 64 bits, 1.4 GHz ou mais rápido, mínimo de 2 núcleos (4 recomendados), com VT-x ou AMD-V.
- RAM: mínimo absoluto de 4 GB, 8 GB recomendados, 16 GB ideal.
- Armazenamento: mínimo de SSD de 120 GB, 256 GB recomendados. Adicione um HDD de 1 TB para armazenamento de arquivos.
- Rede: Ethernet Gigabit obrigatória.
- Fonte de alimentação: o guia de requisitos indica um mínimo de 300 W, 80 PLUS Bronze ou melhor ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)). Esse número se aplica a desktops completos com vários discos. Dimensione máquinas pequenas de acordo com seus próprios adaptadores. O Lenovo ThinkCentre M920 Tiny, um modelo recomendado na comparação, vem com adaptadores de 65 W, 90 W ou 135 W ([Lenovo PSREF](https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M920_Tiny/ThinkCentre_M920_Tiny_Spec.html), consultado em 2026-10-30).

Exclua CPUs de 32 bits, máquinas com menos de 4 GB de RAM máxima e portas de rede de 100 Mbps ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).

## Consumo de energia

Por formato, da tabela comparativa ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)):

- Torre de desktop: 60-80 W em repouso, 150-250 W em carga.
- Fator de forma pequeno (SFF): 25-40 W em repouso, 80-120 W em carga.
- Laptop, conectado à tomada: 15-25 W em repouso, 45-65 W em carga.
- Mini PC: 10-20 W em repouso, 35-55 W em carga.

## Faixa de custos

- Servidor básico: $100-200. Servidor capaz: $200-400. Servidor de desempenho: $400-600 ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).
- Mini PC: $200-400. Laptop (6ª geração ou mais recente): $300-500 ([comparação de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).

## Preparação

Antes do uso, desligue, desconecte da tomada e aguarde 5-10 minutos. Anote os detalhes do sistema. Limpe a poeira, redefina a BIOS se necessário e teste os componentes ([preparação](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-preparation.md)).

## Adequação ao Community Box

Um PC reutilizado atende a uma comunidade que precisa de mais RAM e armazenamento do que um Pi, e tem espaço e energia para um desktop. Para hardware compacto e de menor consumo, consulte as [notas sobre Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para uma placa passiva (sem ventoinha) com portas para discos, consulte as [notas sobre ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).