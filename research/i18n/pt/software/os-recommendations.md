---
title: Como a ferramenta escolhe um sistema operacional
sourcePath: software/os-recommendations.md
sourceHash: f7eccefa1e50b07a
translatedBy: glm-4.6
---

# Como a ferramenta escolhe um sistema operacional

A ferramenta de recomendação sugere até 4 sistemas operacionais. Ela usa três respostas: o uso principal do servidor, se você pode formatar (apagar e reinstalar) o dispositivo, e a principal recomendação de hardware.

## Etapas

1. **Uso principal.** Mantém apenas os sistemas destinados a esse uso (educação, negócios ou pessoal). Se não houver resposta, a ferramenta usa educação.
2. **Hardware.** Mantém apenas os sistemas que rodam no dispositivo mais recomendado. Se nenhum for compatível, a ferramenta não mostra nenhum sistema operacional em vez de mostrar um incompatível.
3. **Formatação.** Se você não pode formatar o dispositivo, mantém apenas os sistemas para iniciantes.
4. **Formatação necessária.** O Proxmox VE substitui o disco inteiro, então a ferramenta o oferece apenas quando você responde que pode formatar. Quando é oferecido, ele aparece em primeiro na lista.
5. **Limite.** Mostra os primeiros 4 sistemas que restarem.

## Catálogo

| Sistema | Uso principal | Nível | Hardware |
|---|---|---|---|
| Ubuntu Server | educação, negócios, pessoal | iniciante | Intel NUC, ZimaBoard, PC reaproveitado |
| Debian | negócios, pessoal | intermediário | Intel NUC, ZimaBoard, PC reaproveitado, Raspberry Pi |
| Raspberry Pi OS | educação, pessoal | iniciante | Raspberry Pi |
| TrueNAS | negócios, educação | intermediário | Intel NUC, ZimaBoard, PC reaproveitado |
| OpenMediaVault | educação, negócios | iniciante | Intel NUC, ZimaBoard, PC reaproveitado, Raspberry Pi |
| ButterBox | educação, pessoal | iniciante | Raspberry Pi |
| Proxmox VE | negócios (apenas se você puder formatar) | intermediário | Intel NUC, PC reaproveitado (somente amd64) |

## Exemplos

- **Negócios, Intel NUC ou PC reaproveitado, pode formatar:** Proxmox VE, Ubuntu Server, Debian, TrueNAS. O OpenMediaVault fica de fora por causa do limite de 4.
- **Negócios, Intel NUC ou PC reaproveitado, sem certeza sobre formatação:** Ubuntu Server, Debian, TrueNAS, OpenMediaVault.
- **Negócios, Intel NUC ou PC reaproveitado, não pode formatar:** Ubuntu Server, OpenMediaVault.
- **Educação, Raspberry Pi:** Raspberry Pi OS, OpenMediaVault, ButterBox.
- **Pessoal, Raspberry Pi, não pode formatar:** Raspberry Pi OS, ButterBox.

## Notas

- O **Proxmox VE** executa máquinas virtuais e contêineres. Ele precisa de um processador x86 de 64 bits (amd64) com virtualização por hardware ativada. Seu mínimo de 2 GB de RAM cobre apenas o host; cada máquina virtual precisa de sua própria memória. O ZimaBoard não está listado.
- O **ButterBox** é uma imagem de servidor offline do Guardian Project para Raspberry Pi. Ele cria sua própria rede Wi-Fi e funciona sem acesso à internet.

As regras ficam em `getOSSuggestions` em `app/src/utils/recommendations.ts`. Os testes em `app/src/test/osSuggestions.test.ts` verificam cada um dos exemplos acima.