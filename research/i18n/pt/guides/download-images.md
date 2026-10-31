---
title: Download de Imagens
sourcePath: guides/download-images.md
sourceHash: cf8c55fb8a6c4b63
translatedBy: glm-4.6
---

# Baixar Imagens

Este guia explica o que é uma imagem de sistema operacional, qual escolher para o seu hardware, como verificar se o arquivo baixado está íntegro e onde obter cada um de sua fonte oficial. Nós linkamos para os projetos upstream em vez de hospedar cópias, para que você sempre obtenha a versão atual e os checksums do próprio projeto.

## O que é uma imagem

Uma imagem de sistema operacional é um único arquivo que contém um sistema completo: o kernel, os softwares e as configurações necessárias para iniciar. Você grava em um pendrive, cartão SD ou disco rígido e, em seguida, inicializa o computador a partir desse dispositivo.

Existem dois tipos comuns de arquivo:

- **ISO** (`.iso`): uma imagem de disco da qual você inicializa. Algumas ISOs são instaladores: fazem perguntas e instalam no disco. Outras são imagens live: rodam do pendrive sem instalar. A descrição de download do projeto informa qual tipo você está obtendo.
- **IMG** (`.img`, frequentemente compactada como `.img.xz`): uma imagem de disco pronta para uso. Você a grava diretamente no disco; nenhum instalador é executado. As imagens do Raspberry Pi geralmente são deste tipo.

Alguns projetos não fornecem uma imagem. Em vez disso, fornecem um **script de instalação**: você começa com um sistema Linux padrão que já possui (por exemplo, Debian ou Ubuntu) e executa um único comando que instala o software por cima. Use um script quando já tiver uma máquina Linux funcionando. Use uma imagem quando estiver começando com um disco vazio.

## Qual escolher

| Seu hardware | O que usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, desktop ou laptop reaproveitado | Uma ISO x86 (amd64) ou script de instalação |
| Raspberry Pi 3, 4, 5, ou Zero 2 W | Imagem do Raspberry Pi OS 64 bits (arm64) |
| Raspberry Pi original, Pi 2, ou Pi Zero | Imagem do Raspberry Pi OS 32 bits (armhf) (2) |
| Roteador para LibreMesh | Firmware do roteador para o seu modelo exato (6) |

Se não tiver certeza do tipo do seu processador, consulte o guia de hardware do seu dispositivo antes de baixar qualquer coisa. Um arquivo compilado para a arquitetura errada não iniciará.

## Como gravar uma imagem

Use o Balena Etcher para computadores, cartões SD e unidades USB. Siga as instruções passo a passo no [guia do Etcher](etcher-guide.md).

O firmware do roteador não é gravado dessa forma. Ele é instalado através da própria interface web do roteador ou do modo de recuperação, e as etapas dependem do modelo. Leia primeiro a [página wiki do OpenWrt](https://openwrt.org/toh/start) do seu roteador.

- **Roteador com firmware original (stock):** instale o OpenWrt primeiro. Baixe a imagem factory para o seu modelo no [OpenWrt Firmware Selector](https://firmware-selector.openwrt.org/) e siga as etapas de [instalação inicial do OpenWrt](https://openwrt.org/docs/guide-quick-start/factory_installation). Verifique se o roteador inicializa e funciona.
- **Roteador já executando o OpenWrt:** primeiro salve suas configurações: na interface web do OpenWrt (LuCI), abra **System > Backup / Flash Firmware** e clique em **Download backup**. Em seguida, obtenha a imagem do LibreMesh para o seu modelo exato no [seletor de firmware do LibreMesh](https://firmware-selector.libremesh.org/). Escolha o arquivo marcado como sysupgrade; sua extensão varia conforme o modelo. Na mesma página, clique em **Flash image...** em **Flash new firmware image**, escolha o arquivo e desmarque **Keep settings and retain the current configuration** (manter configurações e reter a configuração atual) para que o LibreMesh comece com seus padrões próprios. Isso apaga as configurações atuais do roteador.

A [página de introdução do LibreMesh](https://libremesh.org/getting-started.html) descreve esse fluxo, incluindo um método via SSH. Se um roteador não iniciar mais, siga as etapas de recuperação em sua página wiki do OpenWrt.

Gravar um disco apaga tudo no disco de destino. Verifique a letra ou o tamanho da unidade antes de começar.

## Como verificar um checksum

Um checksum é uma impressão digital de um arquivo. A maioria das páginas oficiais de download publica a impressão digital esperada ao lado do arquivo; a tabela abaixo indica as exceções.

Calcule a impressão digital SHA-256 do arquivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Prompt de Comando ou PowerShell):** `certutil -hashfile file.iso SHA256`

Compare a longa sequência hexadecimal com o valor publicado pelo projeto. Ambos devem corresponder exatamente. Se não corresponderem, o download está incompleto ou alterado; baixe novamente.
## Downloads oficiais

Cada linha leva à própria página de downloads do projeto. Uma linha sem checksum significa que o projeto não publica nenhuma impressão digital na página para a qual aponta. As notas abaixo da tabela explicam as exceções.

| Plataforma | Tipo | Arquiteturas | Download | Checksums |
|---|---|---|---|---|
| Debian 13 | ISO de instalação | amd64, arm64 | [debian.org](https://www.debian.org/distrib/netinst) | [amd64](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Debian 12 (para YunoHost) | ISO de instalação | amd64, arm64 | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/) (3) | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO de live server | amd64, arm64 | [ubuntu.com](https://ubuntu.com/download/server) | [amd64](https://releases.ubuntu.com/), [arm64](https://cdimage.ubuntu.com/ubuntu/releases/) (8) |
| Raspberry Pi OS | Imagem ou ISO live | arm64, armhf; amd64 para Desktop | [raspberrypi.com](https://www.raspberrypi.com/software/operating-systems/) | Na página de download (2) |
| YunoHost | Script de instalação no Debian 12 | Segue o Debian 12 (x86, ARM) | [install.yunohost.org](https://install.yunohost.org) (1) | Nenhum para o script (4) |
| CasaOS | Script de instalação | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/) | Nenhum para o script (4) |
| CapRover | Contêiner Docker | amd64, arm64, arm/v7 | [caprover.com](https://caprover.com/docs/get-started.html) | Nenhum para o contêiner (4) |
| balenaOS | Imagem de dispositivo | Por dispositivo (cerca de 20 tipos) | [balena.io/os](https://www.balena.io/os) | Não exibido na página (5) |
| OpenMediaVault | ISO de instalação | amd64 | [openmediavault.org](https://www.openmediavault.org/download.html) | Na página de download |
| TrueNAS | ISO de instalação | x86_64 | [truenas.com](https://www.truenas.com/download-truenas-scale/) (7) | Na página de download |
| LibreMesh | Imagem de roteador personalizada | Por modelo de roteador | [seletor de firmware](https://firmware-selector.libremesh.org/) | Somente se o build exibir um (6) |

### Notas

1. O YunoHost precisa do Debian 12 (Bookworm) como base, não do Debian 13. O [guia YunoHost on top of Debian](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian) diz para baixar o Bookworm (Debian 12). O download da imagem está marcado como quebrado na documentação oficial, então use o script de instalação.
2. Raspberry Pi: 64 bits para Pi 3, 4, 5 e Zero 2 W; 32 bits para o Pi original, Pi 2 e Pi Zero. A ISO Desktop é uma imagem live que roda a partir de um pendrive USB sem instalação.
3. Arquivo do Debian: o arquivo SHA256SUMS fica ao lado de cada ISO em seu próprio diretório. Confira a linha correspondente com os comandos acima. O diretório 12.15.0 é o último lançamento pontual do Debian 12 listado no arquivo; use o diretório 12.x mais recente se ele mudar. O Debian também documenta isso em [Debian CD verification](https://www.debian.org/CD/verify.html).
4. Um script de instalação ou contêiner não tem arquivo para verificar. Revise o script antes de executá-lo.
5. A página balena.io não exibe checksum. Consulte a documentação da balena para um checksum publicado antes de gravar a imagem.
6. O seletor constrói uma imagem personalizada para o seu roteador. Quando o build fornece um checksum, o seletor o exibe como sha256sum ao lado da imagem. O código-fonte do seletor mostra esse comportamento; não o confirmamos em um build em execução. Se nenhum checksum for exibido, mantenha o arquivo que o seletor fornecer. Não substitua pelos checksums do OpenWrt padrão; eles cobrem imagens diferentes.
7. O download do TrueNAS pede um cadastro de newsletter. Os arquivos de valor SHA256, `.sha256` e `.gpg` ficam ao lado de cada ISO.
8. O Ubuntu publica um lançamento de suporte de longo prazo (LTS), como o 26.04, e um lançamento provisório mais curto, como o 26.10. Use o LTS para um servidor comunitário. Abra a pasta do lançamento que você baixou; o arquivo SHA256SUMS está dentro dela (para arm64, na subpasta `release`).

## Fontes

Obtido em 2026-10-30; linhas de LibreMesh, OpenWrt, Ubuntu e Raspberry Pi reverificadas em 2026-10-31.

- https://www.debian.org/distrib/netinst
- https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS
- https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS
- https://cdimage.debian.org/cdimage/archive/
- https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/
- https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/SHA256SUMS
- https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/SHA256SUMS
- https://www.debian.org/CD/verify.html
- https://ubuntu.com/download/server
- https://releases.ubuntu.com/26.04/SHA256SUMS
- https://releases.ubuntu.com/26.10/SHA256SUMS
- https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS
- https://cdimage.ubuntu.com/ubuntu/releases/26.10/release/SHA256SUMS
- https://www.raspberrypi.com/software/operating-systems/
- https://www.raspberrypi.com/documentation/computers/os.html
- https://www.raspberrypi.com/news/raspberry-pi-desktop-now-available-for-pc-and-mac/
- https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian
- https://install.yunohost.org
- https://casaos.zimaspace.com/
- https://caprover.com/docs/get-started.html
- https://hub.docker.com/r/caprover/caprover/tags
- https://hub.docker.com/v2/repositories/caprover/caprover/tags/latest
- https://www.balena.io/os
- https://etcher.balena.io/
- https://www.openmediavault.org/download.html
- https://www.truenas.com/download-truenas-scale/
- https://firmware-selector.libremesh.org/
- https://libremesh.org/build/
- https://libremesh.org/getting-started.html
- https://firmware-selector.openwrt.org/
- https://openwrt.org/toh/start
- https://openwrt.org/docs/guide-quick-start/factory_installation
- https://github.com/openwrt/luci/blob/master/modules/luci-mod-system/htdocs/luci-static/resources/view/system/flash.js
- https://libremesh.org/getting-started.html
- https://raw.githubusercontent.com/libremesh/firmware-selector-openwrt-org/main/www/js/images.js
- https://downloads.openwrt.org/