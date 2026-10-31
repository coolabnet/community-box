---
title: Como a ferramenta escolhe um sistema operacional
sourcePath: software/os-recommendations.md
sourceHash: a56c6442c12e7fd1
translatedBy: glm-4.6
---

# Como a ferramenta escolhe um sistema operacional

A ferramenta de recomendação sugere até 4 sistemas operacionais. Ela usa três respostas: o uso principal do servidor, se você pode formatar (apagar e reinstalar) o dispositivo e a principal recomendação de hardware.

## Etapas

1. **Uso principal.** Mantém apenas os sistemas destinados a esse uso (educação, negócios ou pessoal). Se não houver resposta, a ferramenta usa educação.
2. **Hardware.** Mantém apenas os sistemas que rodam no dispositivo principal recomendado. Se nenhum for compatível, a ferramenta não mostra nenhum sistema operacional em vez de mostrar um incompatível.
3. **Formatação.** Se você não pode formatar o dispositivo, mantém apenas sistemas para iniciantes.
4. **Formatação necessária.** O Proxmox VE substitui o disco inteiro, então a ferramenta o oferece somente quando você responde que pode formatar. Quando é oferecido, ele aparece primeiro na lista.
5. **Limite.** Mostra os primeiros 4 sistemas restantes.

## Catálogo

| Sistema | Uso principal | Nível | Hardware |
|---|---|---|---|
| Ubuntu Server | educação, negócios, pessoal | iniciante | Intel NUC, ZimaBoard, PC reutilizado |
| Debian | negócios, pessoal | intermediário | Intel NUC, ZimaBoard, PC reutilizado, Raspberry Pi |
| Raspberry Pi OS | educação, pessoal | iniciante | Raspberry Pi |
| TrueNAS | negócios, educação | intermediário | Intel NUC, ZimaBoard, PC reutilizado |
| OpenMediaVault | educação, negócios | iniciante | Intel NUC, ZimaBoard, PC reutilizado, Raspberry Pi |
| ButterBox | educação, pessoal | iniciante | Raspberry Pi |
| Proxmox VE | negócios (somente se você pode formatar) | intermediário | Intel NUC, PC reutilizado (somente amd64) |

## Exemplos

- **Negócios, Intel NUC ou PC reutilizado, pode formatar:** Proxmox VE, Ubuntu Server, Debian, TrueNAS. O OpenMediaVault fica de fora por causa do limite de 4.
- **Negócios, Intel NUC ou PC reutilizado, não tem certeza sobre formatação:** Ubuntu Server, Debian, TrueNAS, OpenMediaVault.
- **Negócios, Intel NUC ou PC reutilizado, não pode formatar:** Ubuntu Server, OpenMediaVault.
- **Educação, Raspberry Pi:** Raspberry Pi OS, OpenMediaVault, ButterBox.
- **Pessoal, Raspberry Pi, não pode formatar:** Raspberry Pi OS, ButterBox.

## Notas

- **Proxmox VE** executa máquinas virtuais e contêineres. Nos PCs e Intel NUCs que a ferramenta recomenda, ele precisa de um processador x86 de 64 bits (amd64) com virtualização de hardware ativada. Seus 2 GB mínimos de RAM cobrem apenas o host; cada máquina virtual precisa de sua própria memória. O Proxmox também tem uma versão arm64 para alguns servidores ARM, mas não oferece suporte ao Raspberry Pi. O ZimaBoard não está listado.
- **ButterBox** é uma imagem de servidor offline do Guardian Project para Raspberry Pi Zero 2 W e Pi 4. Ela cria sua própria rede Wi-Fi e funciona sem acesso à internet.

As regras ficam em `getOSSuggestions` em `app/src/utils/recommendations.ts`. Os testes em `app/src/test/osSuggestions.test.ts` verificam cada exemplo acima.

Consulte [Baixar Imagens](../guides/download-images.md) para o link oficial de download de cada sistema.