---
title: Descripción general
sourcePath: hardware/intel_nuc/README.md
sourceHash: 54bd1f4aefb9d671
translatedBy: glm-4.6
---

# Intel NUC para servidores comunitarios

## Qué es

Un Intel NUC es una mini PC x86 pequeña que se vende como kit barebone. Tú agregas la RAM, el almacenamiento y el sistema operativo. La marca pasó a ASUS en 2023 ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)). La investigación del repositorio cubre los modelos de 13.ª generación ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). ASUS ahora vende el NUC 15 Pro con procesadores Intel Core Ultra Series 2, hasta 96 GB de memoria DDR5-6400 y un puerto de 2.5 GbE ([ASUS NUC 15 Pro](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/), consultado el 2026-10-30). Verifica el modelo que compres, porque la generación y las especificaciones varían. La mayoría de los modelos antiguos tienen un volumen menor a un litro ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Fortalezas

- CPUs modernas. Los modelos i5 e i7 tienen 12 núcleos y 16 hilos ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)).
- Hasta 64 GB de RAM en los modelos de 13.ª generación de la investigación del repositorio, y dos ranuras M.2 en algunos modelos ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). El actual NUC 15 Pro admite hasta 96 GB ([ASUS](https://www.asus.com/displays-desktops/nucs/nuc-mini-pcs/asus-nuc-15-pro/)).
- Ejecuta distribuciones Linux estándar. YunoHost, CasaOS y CapRover funcionan todos en él ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Silencioso y fácil de colocar en un escritorio o estante ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Límites

- La mayoría de los modelos tienen un solo puerto Ethernet, de 1 Gbps o 2.5 Gbps. Las configuraciones multi-red necesitan un adaptador USB ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Sin bahías de disco de intercambio en caliente. La mayoría de los modelos admiten dos o tres dispositivos de almacenamiento ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Algunos modelos pueden necesitar tener Secure Boot desactivado para ciertos sistemas Linux. El acceso al BIOS puede ser difícil durante el arranque rápido ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).
- Windows Server necesita soluciones provisionales de controladores ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Uso comunitario típico

Servidores domésticos para compartir archivos y hacer copias de seguridad. Plataformas comunitarias como YunoHost y CapRover. Cargas de trabajo Docker pequeñas. La visión general sugiere un NUC10 o más nuevo para YunoHost ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)).

## Consumo de energía

Para el NUC13ANH i5, la tabla de energía en la comparación de modelos indica 6-10 W en reposo, 20-35 W en carga típica y 45 W como máximo ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). La cifra de 45 W no es un pico real: una reseña independiente del NUC 13 Pro midió alrededor de 85–92 W bajo carga turbo completa ([minipc-review.com](https://minipc-review.com/en/asus-intel-nuc-13-pro-review-mini-pc)). Dimensiona los sistemas solares o de baterías para picos cortos cercanos a 90 W, y usa el adaptador incluido con el equipo. La tabla de especificaciones del mismo documento indica 15 W en reposo y 45 W en carga para este modelo ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md)). La visión general indica 4.5-10 W en reposo entre los modelos ([visión general](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-overview.md)). Por lo tanto, el rango en reposo es incierto. Mide con un medidor enchufable antes de dimensionar el presupuesto de energía.

## Rango de precios

Precios de venta al público de los modelos de 13.ª generación en la tabla de comparación. El repositorio no fecha estas cifras, así que verifica los precios actuales:

- NUC13ANH i3: $300-400
- NUC13ANH i5: $450-550
- NUC13ANH i7: $600-700
- NUC13ANK i5 (dos ranuras M.2): $490-590

Los precios provienen de la [comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/nuc-models-comparison.md). Agrega RAM y almacenamiento por separado.

## Ajuste al Community Box

Un NUC encaja en el rol de servidor de propósito general. Úsalo cuando una comunidad necesita más CPU y RAM que una Raspberry Pi y puede aceptar un mayor consumo de energía. Para un único servicio siempre activo con presupuesto ajustado, consulta las [notas de la Raspberry Pi 5](https://github.com/coolabnet/community-box/blob/main/research/hardware/raspberry_pi_5/README.md). Para usos con mucho almacenamiento, consulta las [notas de la ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).