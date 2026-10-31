---
title: Descripción general
sourcePath: hardware/recycled_pc/README.md
sourceHash: 803194bced10229b
translatedBy: glm-4.6
---

# PC reutilizados y reciclados para servidores comunitarios

## Qué es

Una PC reutilizada es una computadora de escritorio de oficina, mini PC o laptop que una comunidad adapta para usarla como servidor. Las máquinas de negocios provenientes de renovaciones corporativas son la fuente habitual ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)). Las opciones comunes incluyen la Dell OptiPlex 7050 SFF, HP EliteDesk 800 G3, Lenovo ThinkCentre M920q y ThinkPad T480 ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).

## Fortalezas

- Mucho más CPU, RAM y espacio de almacenamiento que una computadora de placa única ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).
- Hardware x86-64, por lo que el software de servidor x86-64 encaja de forma natural. La guía de requisitos pide una CPU x86 de 64 bits con soporte de virtualización ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)). Confirma que tu sistema operativo y aplicaciones elegidos soporten el modelo exacto antes de instalar.
- Los modelos de negocios están calificados como confiables. La comparación estima 5-7 años para Dell OptiPlex y HP EliteDesk ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- RAM y almacenamiento actualizables. Los gabinetes de escritorio tienen la mejor calificación para actualizaciones ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Bajo costo. Los servidores básicos cuestan $100-200 ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).

## Límites

- El consumo eléctrico es alto para los gabinetes de escritorio. El consumo en reposo es de 60-80 W ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Las laptops y mini PCs tienen poco espacio para expandir ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).
- Algunas funciones de Wi-Fi y del BIOS deben revisarse antes de usar ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).
- El hardware usado varía. Revisa la configuración del BIOS y restablécela cuando sea necesario. La guía de preparación menciona contraseñas de BIOS desconocidas, configuraciones dañadas, problemas de compatibilidad e inestabilidad tras cambios de componentes como razones para restablecer ([preparación](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-preparation.md)).

## Especificaciones mínimas

De la guía de requisitos ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)):

- CPU: x86 de 64 bits, 1.4 GHz o más rápido, 2 núcleos como mínimo (4 recomendados), con VT-x o AMD-V.
- RAM: 4 GB como mínimo absoluto, 8 GB recomendados, 16 GB óptimo.
- Almacenamiento: SSD de 120 GB como mínimo, 256 GB recomendado. Agrega un HDD de 1 TB para almacenamiento de archivos.
- Red: Ethernet Gigabit requerida.
- Fuente de poder: la guía de requisitos indica 300 W como mínimo, 80 PLUS Bronze o mejor ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)). Esa cifra aplica a escritorios completos con varias unidades. Dimensiona las máquinas pequeñas según su propio adaptador. El Lenovo ThinkCentre M920 Tiny, un modelo recomendado en la comparación, viene con adaptadores de 65 W, 90 W o 135 W ([Lenovo PSREF](https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M920_Tiny/ThinkCentre_M920_Tiny_Spec.html), consultado el 2026-10-30).

Excluye CPUs de 32 bits, máquinas con menos de 4 GB de RAM máxima y puertos de red de 100 Mbps ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).

## Consumo eléctrico

Por factor de forma, de la tabla de comparación ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)):

- Gabinete de escritorio: 60-80 W en reposo, 150-250 W en carga.
- Factor de forma pequeño: 25-40 W en reposo, 80-120 W en carga.
- Laptop, conectada: 15-25 W en reposo, 45-65 W en carga.
- Mini PC: 10-20 W en reposo, 35-55 W en carga.

## Rango de costos

- Servidor básico: $100-200. Servidor capaz: $200-400. Servidor de rendimiento: $400-600 ([requisitos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-pc-requirements.md)).
- Mini PC: $200-400. Laptop (6.ª generación o más reciente): $300-500 ([comparación de modelos](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-models-comparison.md)).

## Preparación

Antes de usarla, apágala, desconéctala y espera 5-10 minutos. Anota los detalles del sistema. Limpia el polvo, restablece el BIOS si es necesario y prueba los componentes ([preparación](https://github.com/coolabnet/community-box/blob/main/research/guides/recycled-preparation.md)).

## Adecuación para Community Box

Una PC reutilizada es adecuada para una comunidad que necesita más RAM y almacenamiento que una Pi, y que tiene espacio y energía para un escritorio. Para hardware compacto y de menor consumo, consulta las [notas sobre Intel NUC](https://github.com/coolabnet/community-box/blob/main/research/hardware/intel_nuc/README.md). Para una placa sin ventilador con puertos para unidades, consulta las [notas sobre ZimaBoard](https://github.com/coolabnet/community-box/blob/main/research/hardware/zimaboard/README.md).