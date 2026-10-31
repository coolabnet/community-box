---
title: Cómo la herramienta elige un sistema operativo
sourcePath: software/os-recommendations.md
sourceHash: 3e769fba01ef4f42
translatedBy: glm-4.6
---

# Cómo la herramienta elige un sistema operativo

La herramienta de recomendación sugiere hasta 4 sistemas operativos. Utiliza tres respuestas: el uso principal del servidor, si puedes formatear (borrar y reinstalar) el dispositivo, y la principal recomendación de hardware.

## Pasos

1. **Uso principal.** Conserva solo los sistemas pensados para ese uso (educación, negocios o personal). Si no hay respuesta, la herramienta usa educación.
2. **Hardware.** Conserva solo los sistemas que funcionan en el dispositivo recomendado principal. Si ninguno encaja, la herramienta no muestra ningún sistema operativo en lugar de mostrar uno incompatible.
3. **Formateo.** Si no puedes formatear el dispositivo, conserva solo los sistemas para principiantes.
4. **Formateo requerido.** Proxmox VE reemplaza todo el disco, así que la herramienta lo ofrece solo cuando respondes que puedes formatear. Cuando se ofrece, va primero en la lista.
5. **Límite.** Muestra los primeros 4 sistemas que quedan.

## Catálogo

| Sistema | Uso principal | Nivel | Hardware |
|---|---|---|---|
| Ubuntu Server | educación, negocios, personal | principiante | Intel NUC, ZimaBoard, PC reutilizada |
| Debian | negocios, personal | intermedio | Intel NUC, ZimaBoard, PC reutilizada, Raspberry Pi |
| Raspberry Pi OS | educación, personal | principiante | Raspberry Pi |
| TrueNAS | negocios, educación | intermedio | Intel NUC, ZimaBoard, PC reutilizada |
| OpenMediaVault | educación, negocios | principiante | Intel NUC, ZimaBoard, PC reutilizada, Raspberry Pi |
| ButterBox | educación, personal | principiante | Raspberry Pi |
| Proxmox VE | negocios (solo si puedes formatear) | intermedio | Intel NUC, PC reutilizada (solo amd64) |

## Ejemplos

- **Negocios, Intel NUC o PC reutilizada, puedes formatear:** Proxmox VE, Ubuntu Server, Debian, TrueNAS. OpenMediaVault se descarta por el límite de 4.
- **Negocios, Intel NUC o PC reutilizada, no estás seguro del formateo:** Ubuntu Server, Debian, TrueNAS, OpenMediaVault.
- **Negocios, no puedes formatear:** Ubuntu Server, OpenMediaVault.
- **Educación, Raspberry Pi:** Raspberry Pi OS, OpenMediaVault, ButterBox.
- **Personal, Raspberry Pi, no puedes formatear:** Raspberry Pi OS, ButterBox.

## Notas

- **Proxmox VE** ejecuta máquinas virtuales y contenedores. Necesita un procesador x86 de 64 bits (amd64) con virtualización por hardware activada. Su mínimo de 2 GB de RAM cubre solo el host; cada máquina virtual necesita su propia memoria. ZimaBoard no está en la lista.
- **ButterBox** es una imagen de servidor sin conexión del Guardian Project para Raspberry Pi. Crea su propia red Wi-Fi y funciona sin acceso a internet.

Las reglas están en `getOSSuggestions` en `app/src/utils/recommendations.ts`. Las pruebas en `app/src/test/osSuggestions.test.ts` verifican cada ejemplo anterior.