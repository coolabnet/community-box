---
title: Comparación de modelos
sourcePath: hardware/zimaboard/zima-models-comparison.md
sourceHash: 87d91ed29365c634
translatedBy: glm-4.6
---

# Comparación de Modelos de ZimaBoard

## Resumen de Modelos

ZimaBoard está disponible en tres modelos distintos diseñados para satisfacer diferentes requisitos de rendimiento y presupuestos. Todos los modelos comparten el mismo factor de forma y capacidades de expansión básicas, variando en potencia de procesamiento, memoria y configuraciones de almacenamiento[4][9][64].

## Comparación Detallada de Especificaciones

| Especificación | ZimaBoard 216 | ZimaBoard 432 | ZimaBoard 832 |
|---------------|---------------|---------------|---------------|
| **CPU** | Intel Celeron N3350<br>Dual Core<br>1.1-2.4GHz | Intel Celeron N3450<br>Quad Core<br>1.1-2.2GHz | Intel Celeron N3450<br>Quad Core<br>1.1-2.2GHz |
| **Caché de CPU** | 2MB L2 | 2MB L2 | 2MB L2 |
| **Benchmark de CPU** | ~1158 PassMark | ~1920 PassMark | ~1920 PassMark |
| **Arquitectura** | x86-64 (64 bits) | x86-64 (64 bits) | x86-64 (64 bits) |
| **RAM** | 2GB LPDDR4 (Integrada) | 4GB LPDDR4 (Integrada) | 8GB LPDDR4 (Integrada) |
| **Almacenamiento eMMC** | 16GB eMMC 5.1 | 32GB eMMC 5.1 | 32GB eMMC 5.1 |
| **Gráficos** | Intel HD Graphics 500<br>200-650MHz | Intel HD Graphics 500<br>200-700MHz | Intel HD Graphics 500<br>200-700MHz |
| **TDP** | 6W | 6W | 6W |
| **Consumo Típico de Energía** | 2-6W | 3-8W | 4-10W |
| **Precio (USD)** | $119.9 | $159.9 | $199.9 |

## Características de Hardware Compartidas

Todos los modelos de ZimaBoard incluyen opciones idénticas de conectividad y expansión:

### Conectividad
- **Ethernet**: 2x Gigabit Ethernet (Realtek 8111H)
- **USB**: 2x puertos USB 3.0
- **Pantalla**: 1x Mini-DisplayPort 1.2 (soporte 4K@60Hz)
- **Alimentación**: Entrada DC de 12V/3A (jack de barril)

### Expansión de Almacenamiento
- **SATA**: 2x puertos SATA 6.0 Gb/s
- **PCIe**: 1x ranura PCIe 2.0 x4 (externa)
- **Almacenamiento Máximo**: Hasta 36TB mediante unidades SATA

### Características Adicionales
- **Refrigeración**: Diseño de disipador pasivo (sin ventilador)
- **Seguridad de Hardware**: Soporte de Intel VT-d, VT-x, AES-NI
- **Códecs de Video**: H.264 (AVC), H.265 (HEVC), MPEG-2, VC-1
- **Dimensiones**: 138.7 x 81.4 x 34.9 mm (An x P x Al)
- **Peso**: 278g

## Análisis de Rendimiento

### ZimaBoard 216 (Nivel de Entrada)
**Casos de Uso Objetivo:**
- Router/firewall doméstico básico (pfSense, OpenWrt)
- Servidor de archivos simple o NAS ligero
- Gateway IoT o dispositivo de borde
- Entorno de desarrollo y pruebas

**Características de Rendimiento:**
- CPU de doble núcleo adecuada para multitarea básica
- 2GB de RAM suficiente para servicios ligeros
- Capacidades limitadas de transcodificación (1-2 flujos 1080p)
- Adecuado para redes pequeñas (1-5 usuarios)

**Limitaciones:**
- Puede tener dificultades con aplicaciones intensivas en memoria
- Soporte limitado de usuarios concurrentes
- Rendimiento de transcodificación básico

### ZimaBoard 432 (Equilibrado)
**Casos de Uso Objetivo:**
- Servidor multimedia doméstico (Plex/Jellyfin con transcodificación ligera)
- Home lab multiservicio
- Router de pequeña oficina con servicios adicionales
- Host de contenedores Docker (5-10 contenedores)

**Características de Rendimiento:**
- CPU de cuatro núcleos que proporciona buena multitarea
- 4GB de RAM adecuados para cargas de trabajo moderadas
- Soporta 2-3 flujos de transcodificación simultáneos
- Buen equilibrio entre rendimiento y costo

**Punto Óptimo Para:**
- La mayoría de los usuarios de home lab
- Entornos de carga de trabajo mixta
- Usuarios que desean margen de crecimiento

### ZimaBoard 832 (Rendimiento)
**Casos de Uso Objetivo:**
- Servidor multimedia de alto rendimiento (múltiples flujos 4K)
- Host de virtualización (Proxmox, ESXi)
- Dispositivo de red con múltiples VMs
- Servidor de desarrollo con múltiples servicios

**Características de Rendimiento:**
- Misma CPU que el 432 pero con RAM máxima
- 8GB de RAM permiten virtualización y aplicaciones intensivas en memoria
- Soporta 3-4 flujos de transcodificación simultáneos
- El mejor rendimiento para entornos multiusuario

**Ideal Para:**
- Usuarios avanzados y entusiastas
- Entornos de virtualización
- Servidores multimedia multiusuario
- Servicios domésticos de nivel producción

## Tamaños de Despliegue Objetivo

### ZimaBoard 216
- **Tamaño de Red**: 1-3 dispositivos
- **Usuarios Concurrentes**: 1-2 usuarios
- **Necesidades de Almacenamiento**: Compartición básica de archivos
- **Servicios**: 2-3 contenedores ligeros
- **Presupuesto**: Inversión de nivel de entrada

### ZimaBoard 432
- **Tamaño de Red**: 5-15 dispositivos
- **Usuarios Concurrentes**: 2-5 usuarios
- **Necesidades de Almacenamiento**: Biblioteca multimedia doméstica
- **Servicios**: 5-8 contenedores moderados
- **Presupuesto**: Inversión de rango medio

### ZimaBoard 832
- **Tamaño de Red**: 10-25 dispositivos
- **Usuarios Concurrentes**: 3-8 usuarios
- **Necesidades de Almacenamiento**: Grandes colecciones multimedia
- **Servicios**: 8-15 contenedores o VMs
- **Presupuesto**: Inversión enfocada en rendimiento

## Análisis de Consumo de Energía

| Modelo | Consumo en Reposo | Carga Ligera | Carga Pesada | Máximo |
|-------|------------|------------|------------|---------|
| 216 | 2.5W | 4W | 6W | 8W |
| 432 | 3W | 5W | 8W | 10W |
| 832 | 3.5W | 6W | 10W | 15W |

**Nota**: El consumo de energía varía significativamente según:
- Dispositivos de almacenamiento conectados
- Uso de tarjetas PCIe
- Tráfico de red
- Utilización de CPU
- Temperatura ambiente

## Recomendaciones de Memoria y Almacenamiento

### ZimaBoard 216
- **Adecuado Para**: Servicios ligeros, enrutamiento básico
- **Uso de RAM**: Típicamente 60-80% bajo carga normal
- **Estrategia de Almacenamiento**: Usar eMMC para el SO, una unidad SATA para datos
- **Prioridad de Expansión**: Enfocarse en almacenamiento antes que en rendimiento

### ZimaBoard 432
- **Adecuado Para**: Funciones equilibradas de servidor doméstico
- **Uso de RAM**: Típicamente 50-70% bajo carga normal
- **Estrategia de Almacenamiento**: eMMC para el SO, doble SATA para RAID/expansión
- **Prioridad de Expansión**: Mejoras de almacenamiento y red

### ZimaBoard 832
- **Adecuado Para**: Alto rendimiento y virtualización
- **Uso de RAM**: Típicamente 40-60% bajo carga normal
- **Estrategia de Almacenamiento**: PCIe NVMe para SO/VMs, SATA para almacenamiento masivo
- **Prioridad de Expansión**: Almacenamiento y red de alta velocidad

## Cómo Elegir el Modelo Adecuado

### Elige ZimaBoard 216 Si:
- El presupuesto es la preocupación principal ($119.9)
- Requisitos básicos de red/enrutamiento
- Entorno de un solo usuario
- Enfoque en aprendizaje y experimentación
- El consumo de energía es crítico

### Elige ZimaBoard 432 Si:
- Requisitos equilibrados de rendimiento y costo ($159.9)
- Servidor multimedia doméstico con transcodificación ligera
- Entorno familiar pequeño u oficina
- Se necesita margen para expansión de servicios
- Se desea la opción más versátil

### Elige ZimaBoard 832 Si:
- Máximo rendimiento dentro de la línea ZimaBoard ($199.9)
- Virtualización o múltiples VMs planificadas
- Se requiere un servidor multimedia de alto rendimiento
- Entorno multiusuario (3+ usuarios concurrentes)
- Se desea una inversión a prueba de futuro

## Análisis Competitivo

| Dispositivo | ZimaBoard 832 | Synology DS218+ | Intel NUC Kit | Raspberry Pi 4 8GB |
|--------|---------------|-----------------|---------------|-------------------|
| CPU | N3450 4 núcleos | J3355 2 núcleos | Varía | ARM Cortex-A72 |
| RAM | 8GB | 2GB | Varía | 8GB |
| Almacenamiento | 32GB + 2x SATA | 2 bahías | Varía | microSD |
| Precio | $199.9 | $299 | $300-500 | $75 |
| Expansión | PCIe + SATA | Limitada | Buena | Enfocada en GPIO |

## Rutas de Migración y Actualización

### Desde ZimaBoard 216:
- **Al 432**: Vale la pena por el aumento de RAM y rendimiento
- **Al 832**: Actualización significativa para necesidades de virtualización
- **Migración de Datos**: Transferencia simple de unidades entre unidades

### Desde ZimaBoard 432:
- **Al 832**: Recomendado para cargas de trabajo intensivas en memoria
- **Alternativa**: Agregar tarjetas de expansión PCIe para rendimiento

### Actualizaciones Externas:
- **Almacenamiento**: Controladores PCIe SATA para unidades adicionales
- **Redes**: Tarjetas de red PCIe para 10GbE o puertos adicionales
- **Cómputo**: Tarjetas aceleradoras PCIe para cargas de trabajo específicas

## Documentación Relacionada

- Para opciones detalladas de expansión: [zima-expansion-options.md](zima-expansion-options.md)
- Para configuración: [zima-overview.md](zima-overview.md)
- Para solución de problemas: [zima-troubleshooting.md](zima-troubleshooting.md)

## Recomendaciones de la Comunidad

Basado en comentarios de la comunidad y despliegues en el mundo real[55][17][34]:

- **Más Popular**: ZimaBoard 432 ofrece la mejor propuesta de valor
- **Mejor Inversión**: ZimaBoard 832 para uso a largo plazo y expandibilidad
- **Opción Económica**: ZimaBoard 216 para aprendizaje y aplicaciones básicas
- **Uso Profesional**: Considere ZimaBoard 832 con tarjetas de expansión de nivel empresarial