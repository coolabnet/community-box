---
title: Visão geral
sourcePath: hardware/openwrt_one/README.md
sourceHash: be2d490a4eb8ccf3
translatedBy: glm-4.6
---

# OpenWrt One

## O que é

O OpenWrt One é um roteador Wi-Fi 6 construído para o projeto OpenWrt. Ele é feito em colaboração com a Banana Pi e vendido por meio de distribuidores da Software Freedom Conservancy (SFC). O preço listado começa em US$125 com case ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). Ele executa o firmware OpenWrt e vem com a versão atual para o seu lote de fabricação ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

## Especificações principais

As especificações abaixo vêm da página do dispositivo na OpenWrt wiki ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)), a menos que uma linha cite outra fonte:

- SoC: MediaTek Filogic 820 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- RAM: 1 GB DDR4 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Flash: a wiki diz 256 MiB NAND para boot normal, mais 16 MiB NOR para recuperação ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)). A página da SFC diz 128 MiB SPI NAND mais 4 MiB SPI NOR, com 1 GiB de RAM DDR4 ([SFC](https://sfconservancy.org/activities/openwrt-one.html)). As fontes conflitam, então verifique o tamanho da flash na sua unidade antes de planejar armazenamento para imagens ou logs.
- Wi-Fi: Wi-Fi 6 dual-band com streams 3x3/2x2. O driver é o mt76 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Ethernet: uma porta WAN de 2.5 Gbit que também aceita PoE, e uma porta LAN de 1 Gbit ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- USB: uma porta host USB 2.0 Type-A. Uma porta USB-C na frente é o console serial ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- M.2: um slot 2242/2230 para SSD NVMe, PCIe gen 2 x1 ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- Energia: a wiki diz que PoE (802.3af/at) é fornecido pela porta WAN de 2.5G ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)). A página da SFC descreve alimentação USB-C com 12 V USB-PD, ou PoE ([SFC](https://sfconservancy.org/activities/openwrt-one.html)).
- Conflito de tensão do USB-C. A SFC diz 12 V USB-PD. Uma mensagem de março de 2025 na lista de discussão do OpenWrt diz que a placa deve receber 15 V, citando um rótulo "PD15V" na placa, e que "any standards-compliant 15V power supply will provide enough amperage" ([OpenWrt mailing list](https://lists.openwrt.org/pipermail/openwrt-adm/2025-March/002664.html), acessado em 2026-10-30). A página de documentação da Banana Pi, que deveria fornecer o número oficial, retornou apenas o título quando acessada em 2026-10-30. Use o adaptador oficial que veio com a sua unidade ou aquele indicado pelo vendedor. Não presuma uma fonte genérica de 12 V.
- PoE: a página de documentação da Banana Pi não pôde ser lida, então não pude confirmar se PoE é um módulo opcional em algumas configurações. Verifique o anúncio do produto quanto ao PoE antes de contar com ele.
- Tamanho: 148 x 100.5 mm ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).

A wiki não informa o clock da CPU, a tensão do USB-C ou a potência. Veja o item Energia para o conflito de tensão.

## Por que isso importa para redes comunitárias

- Ele executa o OpenWrt, firmware de roteador livre. O hardware e o firmware estão documentados na OpenWrt wiki ([OpenWrt wiki](https://openwrt.org/toh/openwrt/one)).
- A SFC diz que ele foi construído "com liberdade de software e direito a reparo em mente" ([SFC](https://sfconservancy.org/)). Ela também diz que o dispositivo "nunca será travado" e vem com "o lançamento do código-fonte totalmente em conformidade com copyleft desde o início" ([SFC](https://sfconservancy.org/activities/openwrt-one.html)).
- A reparabilidade importa para redes que funcionam com hardware doado ou compartilhado. Isso é inferido, não afirmado por uma fonte.

## Limites como servidor

É um roteador, não um servidor. Com 1 GB de RAM e flash pequena, ele é pequeno demais para um servidor de uso geral. Use-o como borda da rede e execute aplicativos de servidor em uma máquina separada. Compare com o [Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md), que a página atual do produto Raspberry Pi lista com 1 a 16 GB ([página do produto Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/)), e com o [Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md), que a pesquisa do repositório lista com até 64 GB e o atual ASUS NUC 15 Pro com até 96 GB ([ASUS](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/)). O único slot M.2 e a porta USB 2.0 limitam a velocidade de armazenamento (inferido das especificações acima).

## Questões abertas

- Resolvido: suporte a releases upstream. O diretório da versão OpenWrt 24.10.0 lista imagens do OpenWrt One, incluindo `openwrt-24.10.0-mediatek-filogic-openwrt_one-squashfs-sysupgrade.itb` ([downloads OpenWrt](https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/), acessado em 2026-10-30). A seção "Supported Versions" da wiki ainda está vazia.
- Não resolvido: tamanho da flash. A wiki e a SFC conflitam, conforme indicado em Especificações principais.
- Não resolvido: quão bem ele executa LibreMesh. Nenhuma fonte acessada vincula os dois. (inferido: um dispositivo OpenWrt padrão pode executar pacotes LibreMesh.)
- Não resolvido: onde estão os esquemas. A wiki aponta para um site externo que não foi acessado.
- O preço atual. A página da SFC dá "starting at US$125" sem data.

## Fontes

- https://openwrt.org/toh/openwrt/one (página do dispositivo na OpenWrt wiki, acessado em 2026-10-30)
- https://sfconservancy.org/activities/openwrt-one.html (página do dispositivo na SFC, acessado em 2026-10-30)
- https://sfconservancy.org/ (página inicial da SFC, texto de navegação, acessado em 2026-10-30)
- https://downloads.openwrt.org/releases/24.10.0/targets/mediatek/filogic/ (diretório de imagens OpenWrt 24.10.0, acessado em 2026-10-30)
- https://docs.banana-pi.org/en/OpenWRT-One/BananaPi_OpenWRT-One (acessado em 2026-10-30; retornou apenas o título da página, então não usado para especificações)
- https://lists.openwrt.org/pipermail/openwrt-adm/2025-March/002664.html (lista de discussão do OpenWrt, março de 2025, acessado em 2026-10-30; discussão sobre 15 V)