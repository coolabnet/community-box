---
title: Visión general
sourcePath: hardware/raspberry_pi_5/README.md
sourceHash: d5747e860e3f2b78
translatedBy: glm-4.6
---

# Raspberry Pi 5 para servidores comunitarios

## Qué es

La Raspberry Pi 5 es una computadora ARM de placa única lanzada en octubre de 2023 ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Tiene un procesador de cuatro núcleos Arm Cortex-A76 a 2.4 GHz ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). Tiene una interfaz PCIe 2.0 para SSDs NVMe ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

Los tamaños de RAM han cambiado desde la investigación del repositorio. La página de producto actual de Raspberry Pi lista modelos solo de la unidad con 1, 2, 4, 8 y 16 GB ([página de producto de Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/), consultada el 2026-10-30). La descripción general del repositorio lista solo 2, 4 y 8 GB ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). El modelo de 16 GB usa el chip BCM2712 y fue lanzado en enero de 2025 a $120 ([noticias de Raspberry Pi](https://www.raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120/)).

## Fortalezas

- Bajo consumo de energía para una máquina siempre encendida ([refrigeración y energía](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker y software ARM64 funcionan en ella ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Imágenes oficiales o soporte ARM64 para YunoHost, CasaOS y CapRover ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Bajo costo de la placa en sí. Ver la sección de precios.

## Límites

- La comparación señala los 4 GB como el punto óptimo para la mayoría de las aplicaciones de servidor comunitario ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Más lenta que las CPUs x86 para cómputo pesado, compilación y trabajo con video ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Las tarjetas SD son lentas y se desgastan. Arranca desde un SSD USB o un SSD NVMe en su lugar ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Un puerto Gigabit Ethernet y sin redundancia integrada ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- La carga sostenida puede causar limitación térmica. Usa un disipador o refrigeración activa ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Uso comunitario típico

Almacenamiento en la nube personal, automatización del hogar, DNS y DHCP, y paneles de monitoreo. Buena para servicios comunitarios pequeños con pocos usuarios simultáneos ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Consumo de energía

La Pi 5 consume 3.3 W en reposo y 8.0 W a plena carga ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Añade 1.5-4 W para un SSD NVMe o USB ([refrigeración y energía](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)). La fuente de alimentación oficial es USB-C de 5 V y 5 A ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).

## Precio

Precios de la placa a partir del cambio de precios del 1 de diciembre de 2025 ([noticias de Raspberry Pi](https://www.raspberrypi.com/news/1gb-raspberry-pi-5-now-available-at-45-and-memory-driven-price-rises/)):

- 1 GB: $45
- 2 GB: $55
- 4 GB: $70
- 8 GB: $95
- 16 GB: $145

El mismo anuncio culpa a los crecientes costos de la memoria LPDDR4. La página de producto, consultada el 2026-10-30, también mostraba "Raspberry Pi 5 16GB is available now for $305". Esa cifra no coincide con el anuncio y su contexto no está claro, así que verifica el precio actual de la tienda antes de comprar. La cifra anterior del repositorio de $60-80 por la placa está desactualizada.

El total a dos años del repositorio para una Pi 5 de 4 GB, incluyendo fuente de alimentación, almacenamiento NVMe, refrigeración, carcasa y electricidad, era de $240 al momento de la investigación ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Es anterior al cambio de precios de diciembre de 2025.

## Encaje en Community Box

Una Pi 5 encaja como un nodo de bajo consumo de un solo servicio. Elige el modelo de 4 GB u 8 GB y arranca desde un SSD. Para más RAM o CPU, consulta las [notas sobre Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para discos conectados, consulta las [notas sobre ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).