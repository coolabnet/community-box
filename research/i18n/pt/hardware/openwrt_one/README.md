---
title: Visão geral
sourcePath: hardware/openwrt_one/README.md
sourceHash: 8d2edb2f040d3d48
translatedBy: glm-4.6
---

# OpenWrt One

## O que é

O OpenWrt One é um roteador Wi-Fi 6 construído para o projeto OpenWrt. É fabricado em colaboração com a Banana Pi e vendido por meio de distribuidores da Software Freedom Conservancy (SFC). Seu preço listado começa em US$125 com gabinete ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). Ele executa o firmware OpenWrt e vem com a versão atual para o seu lote de fabricação ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

## Especificações principais

As especificações abaixo vêm da página do dispositivo no OpenWrt wiki ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)), a menos que uma linha indique outra fonte:

- SoC: MediaTek Filogic 820 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- RAM: 1 GB DDR4 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Flash: o wiki indica 256 MiB NAND para boot normal, além de 16 MiB NOR para recuperação ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)). A especificação da Banana Pi concorda com o wiki quanto a 256 MB NAND e 16 MB NOR ([Banana Pi](https://www.banana-pi.org/en/bananapi-router/173.html)). A página da SFC indica 128 MiB SPI NAND mais 4 MiB SPI NOR, com 1 GiB de RAM DDR4 ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). As fontes conflitam, então verifique o tamanho da flash no seu aparelho antes de planejar armazenamento para imagens ou logs.
- Wi-Fi: Wi-Fi 6 dual-band com fluxos 3x3/2x2. O driver é o mt76 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Ethernet: uma porta WAN de 2,5 Gbit que também aceita PoE, e uma porta LAN de 1 Gbit ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- USB: uma porta host USB 2.0 Type-A. Uma porta USB-C na frente é o console serial ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- M.2: um slot 2242/2230 para SSD NVMe, PCIe gen 2 x1 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Entrada de energia (especificação do fabricante): USB-C a 15 V USB-PD, conforme a [especificação Banana Pi OpenWrt One](https://www.banana-pi.org/en/bananapi-router/173.html), consultada em 2026-10-30. Compre um adaptador USB-PD que suporte 15 V. Não use uma fonte genérica de 12 V.
- Listagem conflitante: a [página da SFC](https://sfconservancy.org/activities/openwrt-one.html) descreve a alimentação USB-C como 12 V USB-PD. Uma [mensagem da lista de e-mails do OpenWrt](https://lists.openwrt.org/pipermail/openwrt-adm/2025-March/002664.html) de março de 2025 também diz que a placa deve receber 15 V, citando um rótulo "PD15V" na placa. Duas listagens discordam, portanto siga o valor de 15 V do fabricante.
- PoE: a especificação do fabricante lista "Optional 802.3at/af PoE via RT5040 module" ([Banana Pi](https://www.banana-pi.org/en/bananapi-router/173.html)). O wiki e a SFC descrevem o PoE como integrado. Verifique se o seu aparelho inclui o módulo antes de planejar alimentação via PoE.
- Tamanho: 148 x 100,5 mm ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

O wiki não informa o clock da CPU, a tensão do USB-C nem a potência. Veja o item Power para o conflito de tensão.

## Por que isso importa para redes comunitárias

- Ele executa o OpenWrt, firmware aberto para roteadores. O hardware e o firmware estão documentados no OpenWrt wiki ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- A SFC diz que ele foi construído "com liberdade de software e direito a reparo em mente" ([SFC](https://sfconservancy.org/)). Também diz que o dispositivo "nunca será travado" e vem com "a versão completa do código-fonte em conformidade com copyleft desde o início" ([SFC](https://sfconservancy.org/activities/openwrt-one.html)).
- A capacidade de reparo importa para redes que funcionam com hardware doado ou compartilhado. Isso é inferido, não declarado por uma fonte.

## Limitações como servidor

É um roteador, não um servidor. Com 1 GB de RAM e flash pequeno, é pequeno demais para um servidor de uso geral. Use-o como borda da rede e execute aplicativos de servidor em uma máquina separada. Compare com o [Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md), que a página atual de produtos Raspberry Pi lista com 1 a 16 GB ([página de produtos Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/)), e com o [Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md), que a pesquisa do repositório lista com até 64 GB e o atual ASUS NUC 15 Pro com até 96 GB ([ASUS](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/)). O slot único M.2 e a porta USB 2.0 limitam a velocidade de armazenamento (inferido das especificações acima).

## Questões em aberto

- Resolvido: suporte a versões upstream. O diretório da versão OpenWrt 24.10.0 lista imagens do OpenWrt One, incluindo `openwrt-24.10.0-mediatek-filogic-openwrt_one-squashfs-sysupgrade.itb` ([downloads OpenWrt](https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/), consultado em 2026-10-30). A seção "Supported Versions" do wiki ainda está vazia.
- Não resolvido: tamanho da flash. O wiki e a SFC conflitam, conforme indicado nas Especificações principais.
- Não resolvido: quão bem ele executa o LibreMesh. Nenhuma fonte consultada conecta os dois. (inferido: um dispositivo OpenWrt padrão pode executar pacotes LibreMesh.)
- Não resolvido: onde estão os esquemas. O wiki aponta para um site externo que não foi consultado.
- O preço atual. A página da SFC indica "starting at US$125" sem data.

## Fontes

- https://openwrt.org/toh/openwrt/one (página do dispositivo no OpenWrt wiki, consultada em 2026-10-30)
- https://sfconservancy.org/activities/openwrt-one.html (página do dispositivo na SFC, consultada em 2026-10-30)
- https://sfconservancy.org/ (página inicial da SFC, texto de navegação, consultado em 2026-10-30)
- https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/ (diretório de imagens OpenWrt 24.10.0, consultado em 2026-10-30)
- https://www.banana-pi.org/en/bananapi-router/173.html (especificação Banana Pi OpenWrt One, consultada em 2026-10-30; 15 V USB-PD, módulo PoE RT5040 opcional, 256 MB NAND / 16 MB NOR)- https://lists.openwrt.org/pipermail/openwrt-adm/2025-March/002664.html (lista de e-mails do OpenWrt, março de 2025, consultada em 2026-10-30; discussão sobre 15 V)