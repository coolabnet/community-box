---
title: Baixar Imagens
sourcePath: guides/download-images.md
sourceHash: 84544ec59ddf5726
translatedBy: glm-4.6
---

# Baixar Imagens

Este guia explica o que é uma imagem de sistema operacional, qual escolher para o seu hardware, como verificar se o arquivo que você baixou está íntegro e onde obter cada um em sua fonte oficial. Nós apontamos para os projetos upstream em vez de hospedar cópias, para que você sempre obtenha a versão atual e os checksums do próprio projeto.

## O que é uma imagem

Uma imagem de sistema operacional é um único arquivo que contém um sistema completo: o kernel, os programas e as configurações necessárias para iniciar. Você grava-a em um pen drive, cartão SD ou disco rígido e, em seguida, inicializa o computador a partir desse disco.

Há dois tipos comuns de arquivo:

- **ISO** (`.iso`): uma imagem de disco da qual você inicializa. Algumas ISOs são instaladores: elas fazem perguntas e instalam no disco. Outras são imagens live: elas rodam a partir do pen drive sem instalar. A descrição de download do projeto diz qual tipo você está obtendo.
- **IMG** (`.img`, geralmente comprimida como `.img.xz`): uma imagem de disco pronta para uso. Você grava-a diretamente no disco; nenhum instalador é executado. Imagens do Raspberry Pi geralmente são desse tipo.

Alguns projetos não fornecem uma imagem. Em vez disso, fornecem um **script de instalação**: você começa com um sistema Linux padrão que já possui (por exemplo, Debian ou Ubuntu) e executa um único comando que instala o software por cima. Use um script quando já tiver uma máquina Linux funcionando. Use uma imagem quando estiver começando com um disco vazio.

## Qual escolher

| Seu hardware | O que usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, desktop ou notebook reaproveitado | Uma ISO x86 (amd64) ou script de instalação |
| Raspberry Pi 3, 4, 5 ou Zero 2 W | Imagem Raspberry Pi OS de 64 bits (arm64) |
| Raspberry Pi original, Pi 2 ou Pi Zero | Imagem Raspberry Pi OS de 32 bits (armhf) (2) |
| Roteador para LibreMesh | Firmware de roteador para o seu modelo exato (6) |

Se você não tem certeza do tipo do seu processador, consulte o guia de hardware do seu dispositivo antes de baixar qualquer coisa. Um arquivo compilado para a arquitetura errada não iniciará.

## Como gravar uma imagem

Use o Balena Etcher para computadores, cartões SD e unidades USB. Siga as instruções passo a passo no [guia do Etcher](etcher-guide.md).

O firmware de roteador não é gravado dessa forma. Ele é instalado pela própria interface web do roteador ou pelo modo de recuperação, e os passos dependem do modelo. Leia primeiro a [página da wiki do OpenWrt](https://openwrt.org/toh/start) para o seu roteador.

- **Roteador com o firmware original (de fábrica):** instale o OpenWrt primeiro. Baixe a imagem de fábrica para o seu modelo no [OpenWrt Firmware Selector](https://firmware-selector.openwrt.org/) e siga os passos da [instalação inicial do OpenWrt](https://openwrt.org/docs/guide-quick-start/factory_installation). Verifique se o roteador inicializa e funciona.
- **Roteador já executando OpenWrt:** baixe a imagem `squashfs-sysupgrade.bin` do LibreMesh no seletor de firmware. Faça o upload pela interface web do OpenWrt (LuCI) em **System > Backup / Flash Firmware**, ou execute `sysupgrade -n firmware.bin` via SSH.

A [página de primeiros passos do LibreMesh](https://libremesh.org/getting-started.html) descreve esse fluxo. Para recuperação e solução de problemas, veja o [guia de instalação do LibreMesh](libremesh-installation.md).

Gravar um disco apaga tudo no disco de destino. Verifique a letra ou o tamanho do disco antes de começar.

## Como verificar um checksum

Um checksum é uma impressão digital de um arquivo. A maioria das páginas oficiais de download publica a impressão digital esperada ao lado do arquivo; a tabela abaixo indica as exceções.

Calcule a impressão digital SHA-256 do arquivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Prompt de Comando ou PowerShell):** `certutil -hashfile file.iso SHA256`

Compare a longa sequência hexadecimal com o valor publicado pelo projeto. Ambos devem corresponder exatamente. Se não corresponderem, o download está incompleto ou alterado; baixe-o novamente.

## Downloads oficiais

Cada linha aponta para a própria página de download do projeto. Uma linha sem checksum significa que o projeto não publica impressão digital na página para a qual aponta. As notas abaixo da tabela explicam as exceções.

| Plataforma | Tipo | Arquiteturas | Download | Checksums |
|---|---|---|---|---|
| Debian 13 | ISO instalador | amd64, arm64 | [debian.org](https://www.debian.org/distrib/netinst) | [amd64](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Debian 12 (para YunoHost) | ISO instalador | amd64, arm64 | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/) (3) | [amd64](https://cdimage.debian.org/cdimage/archive/12.15.0/amd64/iso-cd/SHA256SUMS), [arm64](https://cdimage.debian.org/cdimage/archive/12.15.0/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO live server | amd64, arm64 | [ubuntu.com](https://ubuntu.com/download/server) | [amd64](https://releases.ubuntu.com/), [arm64](https://cdimage.ubuntu.com/ubuntu/releases/) (8) |
| Raspberry Pi OS | Imagem ou ISO live | arm64, armhf; amd64 para Desktop | [raspberrypi.com](https://www.raspberrypi.com/software/operating-systems/) | Na página de download (2) |
| YunoHost | Script de instalação sobre Debian 12 | Segue o Debian 12 (x86, ARM) | [install.yunohost.org](https://install.yunohost.org) (1) | Nenhum para o script (4) |
| CasaOS | Script de instalação | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/) | Nenhum para o script (4) |
| CapRover | Contêiner Docker | amd64, arm64, arm/v7 | [caprover.com](https://caprover.com/docs/get-started.html) | Nenhum para o contêiner (4) |
| balenaOS | Imagem de dispositivo | Por dispositivo (cerca de 20 tipos) | [balena.io/os](https://www.balena.io/os) | Não exibido na página (5) |
| OpenMediaVault | ISO instalador | amd64 | [openmediavault.org](https://www.openmediavault.org/download.html) | Na página de download |
| TrueNAS | ISO instalador | x86_64 | [truenas.com](https://www.truenas.com/download-truenas-scale/) (7) | Na página de download |
| LibreMesh | Imagem de roteador personalizada | Por modelo de roteador | [seletor de firmware](https://firmware-selector.libremesh.org/) | Apenas se o build exibir um (6) |

### Notas

1. O YunoHost precisa do Debian 12 (Bookworm) como base, não do Debian 13. O [guia YunoHost sobre Debian](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian) diz para baixar o Bookworm (Debian 12). O download da imagem está marcado como quebrado na documentação upstream, então use o script de instalação.
2. Raspberry Pi: 64 bits para Pi 3, 4, 5 e Zero 2 W; 32 bits para o Pi original, Pi 2 e Pi Zero. A ISO Desktop é uma imagem live que roda a partir de um pen drive sem instalar.
3. Arquivo do Debian: o arquivo SHA256SUMS fica ao lado de cada ISO em seu próprio diretório. Confira a linha correspondente com os comandos acima. O diretório 12.15.0 é a última versão pontual do Debian 12 listada no arquivo; use o diretório 12.x mais recente se ele mudar. O Debian também documenta isso em [Debian CD verification](https://www.debian.org/CD/verify.html).
4. Um script de instalação ou contêiner não tem arquivo para verificar. Revise o script antes de executá-lo.
5. A página balena.io não exibe checksum. Consulte a documentação do balena por um checksum publicado antes de gravar a imagem.
6. O seletor compila uma imagem personalizada para o seu roteador. Quando o build fornece um checksum, o seletor o exibe como sha256sum ao lado da imagem. O código-fonte do seletor mostra esse comportamento; não o confirmamos em um build real. Se nenhum checksum for exibido, mantenha o arquivo que o seletor fornece. Não substitua pelos checksums do OpenWrt de fábrica; eles correspondem a imagens diferentes.
7. O download do TrueNAS pede inscrição em um boletim informativo. Seus arquivos de valor SHA256, `.sha256` e `.gpg` ficam ao lado de cada ISO.
8. O Ubuntu publica uma versão de suporte de longo prazo (LTS), como a 26.04, e uma versão intermediária mais curta, como a 26.10. Use a versão LTS para um servidor comunitário. Abra a pasta da versão que você baixou; o arquivo SHA256SUMS está dentro (para arm64, na subpasta `release`).
## Fontes

Obtidas em 2026-10-30; linhas de LibreMesh, OpenWrt, Ubuntu e Raspberry Pi reverificadas em 2026-10-31.

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
- https://libremesh.org/getting-started.html
- https://raw.githubusercontent.com/libremesh/firmware-selector-openwrt-org/main/www/js/images.js
- https://downloads.openwrt.org/