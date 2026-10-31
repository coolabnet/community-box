---
title: Cómo la herramienta elige un sistema operativo
sourcePath: software/os-recommendations.md
sourceHash: f7eccefa1e50b07a
translatedBy: glm-4.6
---

# Cómo la herramienta elige un sistema operativo

La herramienta de recomendación sugiere hasta 4 sistemas operativos. Utiliza tres respuestas: el uso principal del servidor, si puedes formatear (borrar y reinstalar) el dispositivo, y la recomendación principal de hardware.

## Pasos

1. **Uso principal.** Conserva solo los sistemas pensados para ese uso (educación, negocio o personal). Si no hay respuesta, la herramienta usa educación.
2. **Hardware.** Conserva solo los sistemas que funcionan en el dispositivo recomendado principal. Si ninguno es compatible, la herramienta no muestra ningún sistema operativo en lugar de uno incompatible.
3. **Formateo.** Si no puedes formatear el dispositivo, conserva solo los sistemas para principiantes.
4. **Formateo requerido.** Proxmox VE reemplaza todo el disco, por lo que la herramienta solo lo ofrece cuando respondes que puedes formatear. Cuando se ofrece, va primero en la lista.
5. **Límite.** Muestra los primeros 4 sistemas que quedan.

## Catálogo

| Sistema | Uso principal | Nivel | Hardware |
|---|---|---|---|
| Ubuntu Server | educación, negocio, personal | principiante | Intel NUC, ZimaBoard, PC reutilizada |
| Debian | negocio, personal | intermedio | Intel NUC, ZimaBoard, PC reutilizada, Raspberry Pi |
| Raspberry Pi OS | educación, personal | principiante | Raspberry Pi |
| TrueNAS | negocio, educación | intermedio | Intel NUC, ZimaBoard, PC reutilizada |
| OpenMediaVault | educación, negocio | principiante | Intel NUC, ZimaBoard, PC reutilizada, Raspberry Pi |
| ButterBox | educación, personal | principiante | Raspberry Pi |
| Proxmox VE | negocio (solo si puedes formatear) | intermedio | Intel NUC, PC reutilizada (solo amd64) |

## Ejemplos

- **Negocio, Intel NUC o PC reutilizada, puedes formatear:** Proxmox VE, Ubuntu Server, Debian, TrueNAS. OpenMediaVault se descarta debido al límite de 4.
- **Negocio, Intel NUC o PC reutilizada, no estás seguro del formateo:** Ubuntu Server, Debian, TrueNAS, OpenMediaVault.
- **Negocio, Intel NUC o PC reutilizada, no puedes formatear:** Ubuntu Server, OpenMediaVault.
- **Educación, Raspberry Pi:** Raspberry Pi OS, OpenMediaVault, ButterBox.
- **Personal, Raspberry Pi, no puedes formatear:** Raspberry Pi OS, ButterBox.

## Notas

- **Proxmox VE** ejecuta máquinas virtuales y contenedores. Requiere un procesador x86 de 64 bits (amd64) con la virtualización por hardware activada. Sus 2 GB mínimos de RAM solo cubren el host; cada máquina virtual necesita su propia memoria. ZimaBoard no está en la lista.
- **ButterBox** es una imagen de servidor fuera de línea del Guardian Project para Raspberry Pi. Crea su propia red Wi-Fi y funciona sin acceso a internet.

Las reglas se encuentran en `getOSSuggestions` en `app/src/utils/recommendations.ts`. Las pruebas en `app/src/test/osSuggestions.test.ts` verifican cada uno de los ejemplos anteriores.