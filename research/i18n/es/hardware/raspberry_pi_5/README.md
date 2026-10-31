---
title: Descripción general
sourcePath: hardware/raspberry_pi_5/README.md
sourceHash: a55c1eff2a28d2b5
translatedBy: glm-4.6
---

# Raspberry Pi 5 para servidores comunitarios

## Qué es

La Raspberry Pi 5 es una computadora ARM de placa única lanzada en octubre de 2023 ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Tiene un procesador Arm Cortex-A76 de cuatro núcleos a 2.4 GHz ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). Tiene una interfaz PCIe 2.0 para SSDs NVMe ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

Las opciones de RAM han cambiado desde la investigación del repositorio. La página de producto actual de Raspberry Pi lista modelos solo con la unidad en 1, 2, 4, 8 y 16 GB. No lista un modelo de 3 GB ([página de producto de Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/), consultada 2026-10-30). La descripción general del repositorio lista solo 2, 4 y 8 GB ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Fortalezas

- Bajo consumo de energía para una máquina siempre encendida ([refrigeración y energía](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker y software ARM64 funcionan en ella ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Imágenes oficiales o soporte ARM64 para YunoHost, CasaOS y CapRover ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Bajo costo de la placa en sí. Ver la sección de precios.

## Límites

- La comparación señala que 4 GB es el punto óptimo para la mayoría de las aplicaciones de servidor comunitario ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Más lento que las CPUs x86 para cómputo intensivo, compilación y trabajo con video ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Las tarjetas SD son lentas y se desgastan. Arranca desde un SSD USB o un SSD NVMe en su lugar ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Un puerto Gigabit Ethernet y sin redundancia integrada ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- La carga sostenida puede causar throttling térmico. Usa un disipador o refrigeración activa ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Uso comunitario típico

Almacenamiento en la nube personal, automatización del hogar, DNS y DHCP, y paneles de monitoreo. Buena para servicios comunitarios pequeños con pocos usuarios simultáneos ([descripción general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Consumo y suministro de energía

Los datos de prueba del repositorio indican 3.3 W en reposo y 8.0 W a plena carga ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). El consumo máximo de la placa es de aproximadamente 12 W. El artículo de lanzamiento de Raspberry Pi da esta cifra para las cargas de trabajo más exigentes, incluidas pruebas de power-virus ([lanzamiento de Raspberry Pi 5](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/), consultado 2026-10-30). Agrega 1.5-4 W para un SSD NVMe o USB ([refrigeración y energía](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).

La cifra máxima de la placa no es la capacidad de la fuente. Raspberry Pi recomienda su fuente de alimentación USB-C de 27 W para el Pi 5 ([documentación de Raspberry Pi](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html), consultada 2026-10-30). Esa fuente está especificada en 5 V, 5 A. Es la elección correcta cuando se conectan unidades USB o SSDs. Una fuente de 3 A limita los dispositivos USB aguas abajo a 600 mA ([documentación de Raspberry Pi](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html); [artículo de lanzamiento](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/)).

## Precio

Los precios de lista han cambiado varias veces en 2025 y 2026 debido a los costos de memoria. Consulta la [página oficial de producto](https://www.raspberrypi.com/products/raspberry-pi-5/) para ver los precios actuales.

## Encaje en Community Box

Un Pi 5 encaja como un nodo de bajo consumo de servicio único. Elige el modelo de 4 GB u 8 GB y arranca desde un SSD, con la fuente de 27 W si conectas unidades. Para más RAM o CPU, ver las [notas sobre Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para unidades conectadas, ver las [notas sobre ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).