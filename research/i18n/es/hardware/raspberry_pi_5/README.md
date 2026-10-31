---
title: Descripción general
sourcePath: hardware/raspberry_pi_5/README.md
sourceHash: 1ea7ba8eedcffad8
translatedBy: glm-4.6
---

# Raspberry Pi 5 para servidores comunitarios

## Qué es

La Raspberry Pi 5 es una computadora ARM de placa única lanzada en octubre de 2023 ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Tiene un quad-core Arm Cortex-A76 a 2.4 GHz ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). Tiene una interfaz PCIe 2.0 para SSD NVMe ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

Las opciones de RAM han cambiado desde la investigación del repositorio. La página de producto actual de Raspberry Pi lista modelos solo de unidad en 1, 2, 4, 8 y 16 GB. No lista un modelo de 3 GB ([página de producto de Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/), consultada el 2026-10-30). La visión general del repositorio lista solo 2, 4 y 8 GB ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Fortalezas

- Bajo consumo energético para una máquina siempre encendida ([refrigeración y energía](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker y software ARM64 funcionan en ella ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Imágenes oficiales o soporte ARM64 para YunoHost, CasaOS y CapRover ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Bajo costo de la placa en sí. Vea la sección de precios.

## Límites

- La comparación señala que 4 GB es el punto ideal para la mayoría de las aplicaciones de servidores comunitarios ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Más lenta que las CPUs x86 actuales de escritorio y mini-PC (como el Intel NUC) para cómputo pesado, compilación y trabajo con video, aunque más rápida que placas x86 antiguas de bajo consumo ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Las tarjetas SD son lentas y se desgastan. Arranque desde un SSD USB o SSD NVMe en su lugar ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Un puerto Gigabit Ethernet y sin redundancia integrada ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- La carga sostenida puede causar limitación térmica. Use un disipador de calor o refrigeración activa ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Uso comunitario típico

Almacenamiento en la nube personal, automatización del hogar, DNS y DHCP, y paneles de monitoreo. Buena para servicios comunitarios pequeños con pocos usuarios simultáneos ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Consumo y alimentación

Los datos de prueba del repositorio indican 3.3 W en reposo y 8.0 W bajo carga completa ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). El consumo pico de la placa es de aproximadamente 12 W. El artículo de lanzamiento de Raspberry Pi da esta cifra para las cargas de trabajo más exigentes, incluidas pruebas de power-virus ([lanzamiento de Raspberry Pi 5](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/), consultado el 2026-10-30). Agregue 1.5-4 W para un SSD NVMe o USB ([refrigeración y energía](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).

La cifra pico de la placa no es la capacidad de la fuente. Raspberry Pi recomienda su fuente de alimentación USB-C de 27 W para la Pi 5 ([documentación de Raspberry Pi](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html), consultada el 2026-10-30). Esa fuente está clasificada en 5 V, 5 A. Es la elección correcta cuando se conectan unidades USB o SSD. Una fuente de 3 A limita los dispositivos USB aguas abajo a 600 mA ([documentación de Raspberry Pi](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html); [artículo de lanzamiento](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/)).

## Precio

Los precios de lista han cambiado varias veces en 2025 y 2026 debido a los costos de memoria. Consulte la [página oficial del producto](https://www.raspberrypi.com/products/raspberry-pi-5/) para conocer los precios actuales.

## Encaje en Community Box

Una Pi 5 se adapta a un nodo de bajo consumo y servicio único. Elija el modelo de 4 GB u 8 GB y arranque desde un SSD, con la fuente de 27 W si conecta unidades. Para más RAM o CPU, vea las [notas sobre Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para unidades conectadas, vea las [notas sobre ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).