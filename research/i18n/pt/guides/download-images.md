---
title: Baixar Imagens
sourcePath: guides/download-images.md
sourceHash: 29621d25a1e950e3
translatedBy: glm-4.6
---

# Baixar Imagens

Este guia explica o que é uma imagem de sistema operacional, qual escolher para o seu hardware, como verificar se o arquivo baixado está íntegro e onde obter cada um na fonte oficial. Fazemos links para os projetos originais em vez de hospedar cópias, para que você sempre obtenha a versão atual e os checksums do próprio projeto.

## O que é uma imagem

Uma imagem de sistema operacional é um único arquivo que contém um sistema completo: o kernel, os softwares e as configurações necessárias para iniciar. Você grava-a em um pendrive USB, cartão SD ou disco rígido e, em seguida, inicializa o computador a partir desse disco.

Há dois tipos comuns de arquivo:

- **ISO** (`.iso`): uma imagem de disco a partir da qual você inicializa. Algumas ISOs são instaladores: elas fazem perguntas e instalam no disco. Outras são imagens live: elas rodam a partir do pendrive USB sem instalar. A descrição de download do projeto indica qual tipo você está obtendo.
- **IMG** (`.img`, frequentemente comprimida como `.img.xz`): uma imagem de disco pronta para uso. Você grava-a diretamente no disco; nenhum instalador é executado. As imagens do Raspberry Pi são geralmente deste tipo.

Alguns projetos não fornecem uma imagem. Em vez disso, fornecem um **script de instalação**: você começa com um sistema Linux padrão que já possui (por exemplo, Debian ou Ubuntu) e executa um comando que instala o software por cima. Use um script quando você já tiver uma máquina Linux em funcionamento. Use uma imagem quando estiver começando de um disco vazio.

## Qual escolher

| Seu hardware | O que usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, desktop ou laptop reutilizado | Uma ISO x86 (amd64) ou script de instalação |
| Raspberry Pi 3, 4 ou 5 | A imagem do Raspberry Pi OS de 64 bits (arm64) |
| Raspberry Pi original, Raspberry Pi 2 ou Raspberry Pi Zero | A imagem do Raspberry Pi OS de 32 bits (armhf); a página oficial lista esses modelos para 32 bits |
| Raspberry Pi Zero 2 W | Não mencionado na página oficial; verifique a página do modelo antes de escolher (espera-se 64 bits para este processador) |
| Roteador executando LibreMesh | Uma imagem de firmware para o modelo exato do seu roteador, escolhida no seletor de firmware do LibreMesh |

Se você não tiver certeza do tipo do seu processador, consulte o guia de hardware do seu dispositivo antes de baixar qualquer coisa. Um arquivo compilado para a arquitetura errada não iniciará.

## Como gravar uma imagem

Use o Balena Etcher ou outro gravador de imagens. Siga as instruções passo a passo em [etcher-guide.md](etcher-guide.md).

A gravação apaga tudo no disco de destino. Verifique a letra ou o tamanho do disco antes de começar.

## Como verificar um checksum

Um checksum é uma impressão digital de um arquivo. A maioria das páginas oficiais de download publica a impressão digital esperada ao lado do arquivo; a tabela abaixo indica as exceções. Se o seu arquivo produzir uma impressão digital diferente, o download está incompleto ou foi alterado. Baixe-o novamente.

Calcule a impressão digital SHA-256 do arquivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Prompt de Comando ou PowerShell):** `certutil -hashfile file.iso SHA256`

Compare a longa sequência hexadecimal com o valor publicado pelo projeto. Ambos devem corresponder exatamente.

## Downloads oficiais

Cada linha contém um link para a própria página de download do projeto. Uma linha sem checksum significa que o projeto não publica nenhuma impressão digital na página para a qual ele aponta. Para um script de instalação ou contêiner não há arquivo para verificar; portanto, revise o script antes de executá-lo. Para uma imagem, procure um checksum na documentação do projeto antes de gravá-la.

| Plataforma | O que você obtém | Arquiteturas | Download oficial | Checksums |
|---|---|---|---|---|
| Debian | ISO do instalador (netinst) | amd64, arm64 | [debian.org/distrib/netinst](https://www.debian.org/distrib/netinst) | [SHA256SUMS amd64](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [SHA256SUMS arm64](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO de servidor live (versão LTS; instala a partir do sistema live) | amd64, arm64 | [ubuntu.com/download/server](https://ubuntu.com/download/server) | amd64: SHA256SUMS em cada pasta de versão em [releases.ubuntu.com](https://releases.ubuntu.com/). arm64: [SHA256SUMS 26.04 em cdimage.ubuntu.com](https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS) |
| Raspberry Pi OS | Imagem (`.img.xz`) para Raspberry Pi; ISO Desktop live para PC | arm64 (64 bits) e armhf (32 bits) para Pi; amd64 para a ISO Desktop | [raspberrypi.com/software/operating-systems](https://www.raspberrypi.com/software/operating-systems/) | Exibida na página de download sob cada imagem, na seção SHA256 file integrity hash |
| YunoHost | Script de instalação em um sistema Debian 12 (Bookworm) recém-instalado; o download da imagem está marcado como quebrado na documentação upstream | Segue a base do Debian 12 (x86 e ARM) | Base: [arquivo do Debian 12](https://cdimage.debian.org/cdimage/archive/) e [YunoHost sobre o Debian](https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian); script: [install.yunohost.org](https://install.yunohost.org) | Nenhum checksum publicado para o script. Chave de assinatura da imagem: [yunohost_bookworm.asc](https://forge.yunohost.org/keys/yunohost_bookworm.asc) |
| CasaOS | Script de instalação no Ubuntu, Debian, Raspberry Pi OS ou CentOS: `curl -fsSL https://get.casaos.io \| sudo bash` | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/); script em [get.casaos.io](https://get.casaos.io) | Nenhum checksum publicado (script de instalação) |
| CapRover | Contêiner Docker, executado em um host com Docker instalado | amd64, arm64, arm/v7 (listados para a tag mais recente no Docker Hub) | [caprover.com/docs/get-started](https://caprover.com/docs/get-started.html); tags: [Docker Hub](https://hub.docker.com/r/caprover/caprover/tags) | Nenhum checksum publicado (imagem de contêiner) |
| balenaOS | Imagem de Host OS para dispositivos suportados; gravada com balenaEtcher | Depende do dispositivo (cerca de 20 tipos de dispositivo na página) | [balena.io/os](https://www.balena.io/os) (escolha seu dispositivo na seção Download); gravador: [etcher.balena.io](https://etcher.balena.io/) | Nenhum checksum exibido na página balena.io; consulte a documentação do balena para um checksum publicado antes de gravar a imagem |
| OpenMediaVault | Instalador ISO para um NAS baseado em Debian | apenas amd64 | [openmediavault.org/download](https://www.openmediavault.org/download.html) | SHA256 impresso sob cada ISO na página de download |
| TrueNAS | ISO da Community Edition (SCALE); o download solicita inscrição em um boletim informativo | x86_64 | [truenas.com/download-truenas-scale](https://www.truenas.com/download-truenas-scale/) | Valor SHA256, arquivos `.sha256` e `.gpg` ao lado de cada ISO |
| LibreMesh | Imagem de firmware personalizada compilada pelo seletor para o modelo do seu roteador; o seletor solicita a compilação a uma instância ASU (ImageBuilder online) | Depende do modelo do roteador | Seletor: [firmware-selector.libremesh.org](https://firmware-selector.libremesh.org/); detalhes da compilação: [libremesh.org/build](https://libremesh.org/build/) | Use o checksum da imagem exata que o seletor produziu. Não confirmamos onde o seletor o publica, portanto não substitua pelos sums do OpenWrt padrão, que cobrem imagens diferentes |
## Fontes

Obtidas em 2026-10-30.

- https://www.debian.org/distrib/netinst
- https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS
- https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS
- https://ubuntu.com/download/server
- https://releases.ubuntu.com/
- https://www.raspberrypi.com/software/operating-systems/
- https://doc.yunohost.org/admin/get_started/install_on
- https://doc.yunohost.org/admin/get_started/install_on/regular_computer
- https://doc.yunohost.org/admin/get_started/install_on/raspberry_pi
- https://install.yunohost.org
- https://forge.yunohost.org/keys/yunohost_bookworm.asc
- https://casaos.zimaspace.com/
- https://get.casaos.io
- https://caprover.com/docs/get-started.html
- https://www.balena.io/os
- https://etcher.balena.io/
- https://www.openmediavault.org/download.html
- https://www.truenas.com/download-truenas-scale/
- https://firmware-selector.libremesh.org/
- https://downloads.openwrt.org/
- https://downloads.openwrt.org/releases/25.12.6/targets/x86/64/sha256sums
- https://doc.yunohost.org/admin/get_started/install_on/on_top_of_debian
- https://cdimage.debian.org/cdimage/archive/
- https://libremesh.org/build/
- https://www.raspberrypi.com/documentation/computers/os.html
- https://www.raspberrypi.com/news/raspberry-pi-desktop-now-available-for-pc-and-mac/
- https://cdimage.ubuntu.com/ubuntu/releases/26.04/release/SHA256SUMS
- https://releases.ubuntu.com/26.04/SHA256SUMS
- https://hub.docker.com/r/caprover/caprover/tags
- https://hub.docker.com/v2/repositories/caprover/caprover/tags/latest