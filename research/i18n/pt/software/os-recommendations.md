---
title: Como a ferramenta escolhe um sistema operacional
sourcePath: software/os-recommendations.md
sourceHash: 2e364ac5a5af282a
translatedBy: glm-4.6
---

# Como a ferramenta escolhe um sistema operacional

A ferramenta de recomendação sugere até 4 sistemas operacionais. Ela usa três respostas: o uso principal do servidor, o quanto você tem confiança para configurar um computador como servidor (*Sim, com confiança*, *Com orientação* ou *Não*) e a recomendação principal de hardware. Todos os sistemas nesta página são instalados apagando o dispositivo, então a resposta sobre configuração mede habilidade, não se você pode apagá-lo.

## Etapas

1. **Uso principal.** Mantém apenas os sistemas destinados a esse uso (educação, negócios ou pessoal). Se não houver resposta, a ferramenta usa educação.
2. **Hardware.** Mantém apenas os sistemas que rodam no dispositivo recomendado principal. Se nenhum for compatível, a ferramenta não mostra nenhum sistema operacional em vez de mostrar um incompatível.
3. **Habilidade de configuração.** Se você responder *Não*, mantém apenas sistemas para iniciantes. Sistemas avançados (Proxmox VE) aparecem apenas se você responder *Sim, com confiança*.
4. **Limite.** Mostra até 4 sistemas na ordem do catálogo. Um sistema avançado vai por último e ocupa a última vaga se a lista estiver cheia.

## Catálogo

| Sistema | Uso principal | Nível | Hardware |
|---|---|---|---|
| Ubuntu Server | educação, negócios, pessoal | iniciante | Intel NUC, ZimaBoard, PC reutilizado |
| Debian | negócios, pessoal | intermediário | Intel NUC, ZimaBoard, PC reutilizado, Raspberry Pi |
| Raspberry Pi OS | educação, pessoal | iniciante | Raspberry Pi |
| TrueNAS | negócios, educação | intermediário | Intel NUC, ZimaBoard, PC reutilizado |
| OpenMediaVault | educação, negócios | iniciante | Intel NUC, ZimaBoard, PC reutilizado, Raspberry Pi |
| ButterBox | educação, pessoal | iniciante | Raspberry Pi |
| Proxmox VE | negócios | avançado | Intel NUC, ZimaBoard, PC reutilizado (somente amd64) |

## Exemplos

- **Negócios, Intel NUC, ZimaBoard ou PC reutilizado, *Sim, com confiança*:** Ubuntu Server, Debian, TrueNAS, Proxmox VE. O OpenMediaVault fica de fora por causa do limite de 4.
- **Negócios, Intel NUC, ZimaBoard ou PC reutilizado, *Com orientação*:** Ubuntu Server, Debian, TrueNAS, OpenMediaVault.
- **Negócios, Intel NUC, ZimaBoard ou PC reutilizado, *Não*:** Ubuntu Server, OpenMediaVault.
- **Educação, Raspberry Pi:** Raspberry Pi OS, OpenMediaVault, ButterBox.
- **Pessoal, Raspberry Pi, *Não*:** Raspberry Pi OS, ButterBox.

## Notas

- O **Proxmox VE** executa máquinas virtuais e contêineres, então uma única máquina pode hospedar vários sistemas lado a lado. Ele é marcado como avançado porque você gerencia o host e cada máquina virtual. Nos PCs, Intel NUCs e ZimaBoards que a ferramenta recomenda, ele precisa de um processador x86 de 64 bits (amd64) com virtualização por hardware ativada. O mínimo de 2 GB de RAM cobre apenas o host; cada máquina virtual precisa de sua própria memória. No ZimaBoard, use o modelo de 8 GB (832) e instale em um SSD SATA ou NVMe, não na eMMC integrada (veja [Solução de problemas do ZimaBoard](../hardware/zimaboard/zima-troubleshooting.md)). O Proxmox também tem uma versão arm64 para alguns servidores ARM, mas não suporta o Raspberry Pi.
- O **ButterBox** é uma imagem de servidor offline do Guardian Project para Raspberry Pi Zero 2 W e Pi 4. Ele cria sua própria rede Wi-Fi e funciona sem acesso à internet.

As regras ficam em `getOSSuggestions` em `app/src/utils/recommendations.ts`. Os testes em `app/src/test/osSuggestions.test.ts` verificam cada exemplo acima.

Consulte [Baixar Imagens](../guides/download-images.md) para obter o link oficial de download de cada sistema.