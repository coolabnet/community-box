---
title: Cómo la herramienta elige un sistema operativo
sourcePath: software/os-recommendations.md
sourceHash: 2e364ac5a5af282a
translatedBy: glm-4.6
---

# Cómo la herramienta elige un sistema operativo

La herramienta de recomendación sugiere hasta 4 sistemas operativos. Usa tres respuestas: el uso principal del servidor, tu confianza al configurar una computadora como servidor (*Sí, con confianza*, *Con guía* o *No*), y la recomendación principal de hardware. Cada sistema en esta página se instala borrando el dispositivo, por lo que la respuesta de configuración mide la habilidad, no si puedes borrarlo.

## Pasos

1. **Uso principal.** Se conservan solo los sistemas pensados para ese uso (educación, negocio o personal). Si no hay respuesta, la herramienta usa educación.
2. **Hardware.** Se conservan solo los sistemas que funcionan en el dispositivo recomendado principal. Si ninguno es compatible, la herramienta no muestra ningún sistema operativo en lugar de mostrar uno incompatible.
3. **Habilidad de configuración.** Si respondes *No*, se conservan solo los sistemas para principiantes. Los sistemas avanzados (Proxmox VE) aparecen solo si respondes *Sí, con confianza*.
4. **Límite.** Se muestran hasta 4 sistemas en orden de catálogo. Un sistema avanzado va al final y ocupa el último lugar si la lista está llena.

## Catálogo

| Sistema | Uso principal | Nivel | Hardware |
|---|---|---|---|
| Ubuntu Server | educación, negocio, personal | principiante | Intel NUC, ZimaBoard, PC reutilizada |
| Debian | negocio, personal | intermedio | Intel NUC, ZimaBoard, PC reutilizada, Raspberry Pi |
| Raspberry Pi OS | educación, personal | principiante | Raspberry Pi |
| TrueNAS | negocio, educación | intermedio | Intel NUC, ZimaBoard, PC reutilizada |
| OpenMediaVault | educación, negocio | principiante | Intel NUC, ZimaBoard, PC reutilizada, Raspberry Pi |
| ButterBox | educación, personal | principiante | Raspberry Pi |
| Proxmox VE | negocio | avanzado | Intel NUC, ZimaBoard, PC reutilizada (solo amd64) |

## Ejemplos

- **Negocio, Intel NUC, ZimaBoard o PC reutilizada, *Sí, con confianza*:** Ubuntu Server, Debian, TrueNAS, Proxmox VE. OpenMediaVault queda fuera por el límite de 4.
- **Negocio, Intel NUC, ZimaBoard o PC reutilizada, *Con guía*:** Ubuntu Server, Debian, TrueNAS, OpenMediaVault.
- **Negocio, Intel NUC, ZimaBoard o PC reutilizada, *No*:** Ubuntu Server, OpenMediaVault.
- **Educación, Raspberry Pi:** Raspberry Pi OS, OpenMediaVault, ButterBox.
- **Personal, Raspberry Pi, *No*:** Raspberry Pi OS, ButterBox.

## Notas

- **Proxmox VE** ejecuta máquinas virtuales y contenedores, por lo que un solo equipo puede alojar varios sistemas a la vez. Está marcado como avanzado porque gestionas el host y cada máquina virtual. En las PC, Intel NUC y ZimaBoard que recomienda la herramienta, necesita un procesador x86 de 64 bits (amd64) con la virtualización por hardware activada. Sus 2 GB mínimos de RAM cubren solo el host; cada máquina virtual necesita su propia memoria. En ZimaBoard, usa el modelo de 8 GB (832) e instala en un SSD SATA o NVMe, no en la eMMC integrada (ver [Solución de problemas de ZimaBoard](../hardware/zimaboard/zima-troubleshooting.md)). Proxmox también tiene una versión arm64 para algunos servidores ARM, pero no es compatible con Raspberry Pi.
- **ButterBox** es una imagen de servidor sin conexión del Guardian Project para Raspberry Pi Zero 2 W y Pi 4. Crea su propia red Wi-Fi y funciona sin acceso a internet.

Las reglas están en `getOSSuggestions` en `app/src/utils/recommendations.ts`. Las pruebas en `app/src/test/osSuggestions.test.ts` verifican cada ejemplo anterior.

Consulta [Descargar imágenes](../guides/download-images.md) para el enlace de descarga oficial de cada sistema.