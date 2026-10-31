---
title: Baixar Imagens
sourcePath: guides/download-images.md
sourceHash: b8ef1f2567199508
translatedBy: glm-4.6
---

# Baixar Imagens

Este guia explica o que é uma "imagem" de sistema operacional, qual escolher para o seu hardware, como verificar se o arquivo baixado está íntegro e onde obter cada um na fonte oficial. Fazemos links para os projetos originais em vez de hospedar cópias, assim você sempre obtém a versão atual e os checksums do próprio projeto.

## O que é uma imagem

Uma imagem de sistema operacional é um único arquivo que contém um sistema completo: o kernel, os softwares e as configurações necessárias para iniciar. Você grava em um pendrive USB, cartão SD ou disco rígido e, em seguida, inicializa o computador a partir dessa unidade.

Há dois tipos de arquivos comuns:

- **ISO** (`.iso`): uma imagem de disco de instalador. Você inicializa a partir dela e responde às perguntas do instalador, como faria ao instalar Windows ou Linux de um DVD.
- **IMG** (`.img`, frequentemente comprimida como `.img.xz`): uma imagem de disco pronta para uso. Você grava diretamente na unidade; nenhum instalador é executado. Imagens do Raspberry Pi geralmente são desse tipo.

Alguns projetos não fornecem uma imagem. Em vez disso, fornecem um **script de instalação**: você começa com um sistema Linux padrão que já tem (por exemplo, Debian ou Ubuntu) e executa um único comando que instala o software por cima. Use um script quando você já tiver uma máquina Linux funcionando. Use uma imagem quando estiver começando com um disco vazio.

## Qual escolher

| Seu hardware | O que usar |
|---|---|
| PC x86, Intel NUC, ZimaBoard, desktop ou notebook reutilizado | Uma ISO x86 (amd64) ou script de instalação |
| Raspberry Pi | Uma imagem arm64, geralmente o Raspberry Pi OS 64-bit ou a build arm64 de uma plataforma |
| Roteador executando LibreMesh | Uma imagem de firmware para o modelo exato do seu roteador, escolhida no seletor de firmware do LibreMesh |

Se você não tem certeza do tipo do seu processador, consulte o guia de hardware do seu dispositivo antes de baixar qualquer coisa. Um arquivo compilado para a arquitetura errada não iniciará.

## Como gravar uma imagem

Use o Balena Etcher ou outro gravador de imagens. Siga as instruções passo a passo em [etcher-guide.md](etcher-guide.md).

A gravação apaga tudo na unidade de destino. Verifique a letra ou o tamanho da unidade antes de começar.

## Como verificar um checksum

Um checksum é uma impressão digital de um arquivo. Cada página oficial de download publica a impressão digital esperada. Se o seu arquivo produzir uma impressão digital diferente, o download está incompleto ou alterado. Baixe-o novamente.

Calcule a impressão digital SHA-256 do arquivo:

- **Linux:** `sha256sum file.iso`
- **macOS:** `shasum -a 256 file.iso`
- **Windows (Prompt de Comando ou PowerShell):** `certutil -hashfile file.iso SHA256`

Compare a longa sequência hexadecimal com o valor publicado pelo projeto. Ambos devem corresponder exatamente.

## Downloads oficiais

Cada linha aponta para a página de download do próprio projeto. Uma linha sem checksum significa que o projeto distribui um script de instalação ou um container, portanto não há arquivo para verificar; revise o script antes de executá-lo.

| Plataforma | O que você obtém | Arquiteturas | Download oficial | Checksums |
|---|---|---|---|---|
| Debian | ISO de instalador (netinst) | amd64, arm64 | [debian.org/distrib/netinst](https://www.debian.org/distrib/netinst) | [amd64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS), [arm64 SHA256SUMS](https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/SHA256SUMS) |
| Ubuntu Server | ISO de instalador (versão LTS) | amd64; arm64 na versão mais recente | [ubuntu.com/download/server](https://ubuntu.com/download/server) | SHA256SUMS em cada pasta de versão em [releases.ubuntu.com](https://releases.ubuntu.com/) |
| Raspberry Pi OS | Imagem (`.img.xz`) para Raspberry Pi; ISO Desktop para PC | arm64 e armhf (Pi); amd64 (ISO Desktop) | [raspberrypi.com/software/operating-systems](https://www.raspberrypi.com/software/operating-systems/) | Exibido na página de download sob cada imagem ("SHA256 file integrity hash") |
| YunoHost | Script de instalação em um sistema Debian existente (o download da imagem está marcado como quebrado na documentação upstream) | Depende da base Debian (x86 e ARM) | Script: [install.yunohost.org](https://install.yunohost.org); documentação: [guia de instalação doc.yunohost.org](https://doc.yunohost.org/admin/get_started/install_on) | Nenhum checksum publicado para o script. Chave de assinatura de imagem: [yunohost_bookworm.asc](https://forge.yunohost.org/keys/yunohost_bookworm.asc) |
| CasaOS | Script de instalação no Ubuntu, Debian, Raspberry Pi OS ou CentOS: `curl -fsSL https://get.casaos.io \| sudo bash` | amd64, armv7, arm64 | [casaos.zimaspace.com](https://casaos.zimaspace.com/); script em [get.casaos.io](https://get.casaos.io) | Nenhum checksum publicado (script de instalação) |
| CapRover | Container Docker, executado em um host com Docker instalado | amd64, arm64 (a imagem ARMv7 de 32 bits não é mais publicada) | [caprover.com/docs/get-started](https://caprover.com/docs/get-started.html) | Nenhum checksum publicado (imagem de container) |
| balenaOS | Imagem de Host OS para dispositivos suportados; gravada com balenaEtcher | Depende do dispositivo (cerca de 20 tipos de dispositivo na página) | [balena.io/os](https://www.balena.io/os) (escolha seu dispositivo na seção Download); gravador: [etcher.balena.io](https://etcher.balena.io/) | Nenhum checksum exibido na página |
| OpenMediaVault | ISO de instalador para um NAS baseado em Debian | somente amd64 | [openmediavault.org/download](https://www.openmediavault.org/download.html) | SHA256 impresso sob cada ISO na página de download |
| TrueNAS | ISO da Community Edition (SCALE); o download pede inscrição em newsletter | x86_64 | [truenas.com/download-truenas-scale](https://www.truenas.com/download-truenas-scale/) | Valor SHA256, arquivos `.sha256` e `.gpg` ao lado de cada ISO |
| LibreMesh | Imagem de firmware para o modelo do seu roteador, escolhida no seletor de firmware; o seletor aponta para os downloads do OpenWrt | Depende do modelo do roteador | Seletor: [firmware-selector.libremesh.org](https://firmware-selector.libremesh.org/); arquivos: [downloads.openwrt.org](https://downloads.openwrt.org/) | Cada pasta de versão do OpenWrt tem um arquivo `sha256sums`, por exemplo [25.12.6 x86/64](https://downloads.openwrt.org/releases/25.12.6/targets/x86/64/sha256sums) |

## Fontes

Consultados em 2026-10-30.

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