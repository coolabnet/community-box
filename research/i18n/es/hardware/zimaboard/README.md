---
title: Visión general
sourcePath: hardware/zimaboard/README.md
sourceHash: fdc3239201234557
translatedBy: glm-4.6
---

# ZimaBoard para servidores comunitarios

## Qué es

ZimaBoard es un servidor de placa única x86 fabricado por IceWhale. Tiene un procesador Intel Celeron y memoria RAM LPDDR4 integrada ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)). Se vende en tres modelos: 216, 432 y 832 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)). El 216 tiene un N3350 de doble núcleo con 2 GB de RAM. El 432 y el 832 tienen un N3450 de cuatro núcleos con 4 GB u 8 GB de RAM ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).

## Fortalezas

- Soporte completo de software x86. Linux, Windows, OpenWrt y pfSense funcionan en él ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Dos puertos SATA de 6 Gb/s para discos y una ranura externa PCIe 2.0 x4 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).
- Dos puertos Ethernet Gigabit ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).
- Sin ventilador. El disipador es pasivo ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Viene con CasaOS preinstalado ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Límites

- Los CPU Celeron son adecuados, no rápidos. La placa sirve mejor para varios servicios ligeros que para una aplicación exigente ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- La RAM máxima es 8 GB ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Las NIC Realtek pueden necesitar controladores adicionales en routers basados en FreeBSD como pfSense y OPNsense ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Poco GPIO. Una salida Mini DisplayPort ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).
- Se requiere un adaptador externo de 12 V, 3 A. Varios discos de 3.5 pulgadas pueden necesitar su propia fuente de alimentación ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Uso comunitario típico

Software NAS como TrueNAS u OpenMediaVault. Servidores multimedia como Plex o Jellyfin. Routers con OpenWrt u OPNsense. Centrales de domótica ([overview](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-overview.md)).

## Consumo de energía

El TDP es de 6 W para los tres modelos. El uso típico es de 2-6 W para el 216, 3-8 W para el 432 y 4-10 W para el 832 ([models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md)).

## Rango de precios

- ZimaBoard 216 (2 GB): $119.90
- ZimaBoard 432 (4 GB): $159.90
- ZimaBoard 832 (8 GB): $199.90

Fuente: [models comparison](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/zima-models-comparison.md). Los discos se venden aparte.

## Encaje en Community Box

Un ZimaBoard sirve como un nodo pequeño de almacenamiento o router siempre encendido. Elige 4 GB u 8 GB si el equipo ejecuta varios servicios. Para un nodo de menor consumo con menos almacenamiento, consulta las [notas del Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md). Para un CPU más rápido y más RAM, consulta las [notas del Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md).