---
title: Descripción general
sourcePath: hardware/raspberry_pi_5/README.md
sourceHash: d37570cb218a0d65
translatedBy: glm-4.6
---

# Raspberry Pi 5 para servidores comunitarios

## Qué es

La Raspberry Pi 5 es una computadora ARM de placa única lanzada en octubre de 2023 ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Tiene un Arm Cortex-A76 de cuatro núcleos a 2.4 GHz ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). Tiene una interfaz PCIe 2.0 para SSDs NVMe ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

Los tamaños de RAM han cambiado desde la investigación del repositorio. La página de producto actual de Raspberry Pi lista modelos solo de la unidad en 1, 2, 4, 8 y 16 GB ([página de producto de Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/), consultada el 30-10-2026). El resumen del repositorio lista solo 2, 4 y 8 GB ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)). El modelo de 16 GB usa el chip BCM2712 y fue lanzado en enero de 2025 a $120 ([noticias de Raspberry Pi](https://www.raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120/)).

## Fortalezas

- Bajo consumo eléctrico para una máquina siempre encendida ([refrigeración y energía](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)).
- Docker y software ARM64 funcionan en ella ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Imágenes oficiales o soporte ARM64 para YunoHost, CasaOS y CapRover ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Bajo costo de la placa en sí. Consulta la sección de precios.

## Límites

- La comparación señala que 4 GB es el punto óptimo para la mayoría de las aplicaciones de servidor comunitario ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).
- Más lenta que las CPUs x86 para cómputo pesado, compilación y trabajo con video ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Las tarjetas SD son lentas y se desgastan. Arranca desde un SSD USB o un SSD NVMe en su lugar ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- Un solo puerto Ethernet Gigabit y sin redundancia integrada ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).
- La carga sostenida puede causar limitación térmica. Usa un disipador o refrigeración activa ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Uso comunitario típico

Almacenamiento en la nube personal, automatización del hogar, DNS y DHCP, y paneles de monitoreo. Adecuada para servicios comunitarios pequeños con pocos usuarios simultáneos ([resumen](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-overview.md)).

## Consumo eléctrico

Los datos de prueba del repositorio indican 3.3 W en reposo y 8.0 W bajo carga completa ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). El consumo máximo es mayor. El artículo de lanzamiento de Raspberry Pi dice que el consumo máximo "increases to around 12W" (aumenta a alrededor de 12 W) para las cargas de trabajo más exigentes, incluidas pruebas de virus de potencia ([lanzamiento de Raspberry Pi 5](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/), consultado el 30-10-2026). Dimensiona la fuente para unos 12 W, no 8 W. Agrega 1.5-4 W para un SSD NVMe o USB ([refrigeración y energía](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-cooling-power.md)). La fuente de alimentación oficial es USB-C de 5 V y 5 A ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)).

## Precio

Precios de lista actuales, según lo consultado el 30-10-2026:

- 2 GB: $77.50, vigente desde el 1 de octubre de 2026 ([noticias de Raspberry Pi, 1 de octubre de 2026](https://www.raspberrypi.com/news/price-increases-for-2gb-raspberry-pi-4-and-raspberry-pi-5/)).
- 16 GB: $305, según la [página de producto](https://www.raspberrypi.com/products/raspberry-pi-5/). La página no muestra fecha.

La página de producto lista los modelos de 1, 4 y 8 GB sin precios. Los últimos precios con fecha que encontré para esos modelos son del 1 de diciembre de 2025: 1 GB $45, 4 GB $70, 8 GB $95 ([noticias de Raspberry Pi, 1 de diciembre de 2025](https://www.raspberrypi.com/news/1gb-raspberry-pi-5-now-available-at-45-and-memory-driven-price-rises/)). Ese anuncio listaba el modelo de 16 GB a $145. Los $305 de la página de producto son aproximadamente el doble. El artículo del 1 de octubre de 2026 cubre solo el modelo de 2 GB. Verifica el precio en la tienda antes de comprar los modelos de 1, 4, 8 o 16 GB. El rango anterior de $60-80 por placa en el repositorio está desactualizado.

El total a dos años del repositorio para una Pi 5 de 4 GB, incluyendo fuente de alimentación, almacenamiento NVMe, refrigeración, carcasa y electricidad, era de $240 al momento de la investigación ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/rpi-models-comparison.md)). Es anterior al cambio de precios de diciembre de 2025.

## Encaje en Community Box

Una Pi 5 encaja como nodo de bajo consumo de un solo servicio. Elige el modelo de 4 GB u 8 GB y arranca desde un SSD. Para más RAM o CPU, consulta las [notas de Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para discos conectados, consulta las [notas de ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).