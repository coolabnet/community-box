---
title: Comparación de modelos
sourcePath: hardware/intel_nuc/nuc-models-comparison.md
sourceHash: 30aecd86774014b3
translatedBy: glm-4.6
---

# Comparación de Modelos Intel NUC para Despliegue de Servidores

## Descripción General

Esta comparación exhaustiva cubre los modelos de Intel NUC adecuados para el despliegue de servidores comunitarios, enfocándose en las especificaciones relevantes para plataformas de auto-alojamiento como YunoHost, Caprover y CasaOS.

## Modelos de la Generación Actual (2024-2025)

### Modelos ASUS NUC (13.ª Generación)

| Modelo | CPU | Núcleos/Hilos | Base/Boost GHz | TDP | RAM Máx. | Almacenamiento | Red | Rango de Precio |
|-------|-----|---------------|----------------|-----|---------|---------|-------------|-------------|
| **NUC13ANHi3** | i3-1315U | 6 (2P+4E) / 8 | 1.2/4.5 | 15W | 64GB | M.2 + 2.5" | 2.5GbE | $300-400 |
| **NUC13ANHi5** | i5-1340P | 12 (4P+8E) / 16 | 1.9/4.6 | 28W | 64GB | M.2 + 2.5" | 2.5GbE | $450-550 |
| **NUC13ANHi7** | i7-1360P | 12 (4P+8E) / 16 | 2.2/5.0 | 28W | 64GB | M.2 + 2.5" | 2.5GbE | $600-700 |
| **NUC13ANKi5** | i5-1340P | 12 (4P+8E) / 16 | 1.9/4.6 | 28W | 64GB | 2x M.2 | 2.5GbE | $490-590 |
| **NUC13ANKi7** | i7-1360P | 12 (4P+8E) / 16 | 2.2/5.0 | 28W | 64GB | 2x M.2 | 2.5GbE | $650-750 |

### Modelos de Juego ASUS ROG NUC (2025)

| Modelo | CPU | GPU | Núcleos/Hilos | TDP | RAM Máx. | Almacenamiento | Red | Rango de Precio |
|-------|-----|-----|---------------|-----|---------|---------|-------------|-------------|
| **ROG NUC 2025** | Core Ultra 9 275HX | RTX 5080 Mobile | 24 (8P+16E) / 32 | 160W | 96GB | 2x M.2 | 2.5GbE | $3000+ |

### Modelos Anteriores de Intel (12.ª Generación)

| Modelo | CPU | Núcleos/Hilos | Base/Boost GHz | TDP | RAM Máx. | Almacenamiento | Red | Estado |
|-------|-----|---------------|----------------|-----|---------|---------|-------------|--------|
| **NUC12WSHi3** | i3-1220P | 10 (2P+8E) / 12 | 1.1/4.4 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legado |
| **NUC12WSHi5** | i5-1240P | 12 (4P+8E) / 16 | 1.7/4.4 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legado |
| **NUC12WSHi7** | i7-1260P | 12 (4P+8E) / 16 | 2.1/4.7 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legado |

## Comparación Detallada de Especificaciones

### Características de Rendimiento

| Modelo | Puntuación Passmark CPU* | Gráficos | Líneas PCIe | Thunderbolt | Puertos USB | Consumo de Energía |
|-------|-------------------|----------|------------|-------------|-----------|-------------------|
| **NUC13ANHi3** | ~12,000 | Intel UHD | 16 | TB4 (2x) | 6x USB 3.2 | 15W en reposo, 35W en carga |
| **NUC13ANHi5** | ~18,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W en reposo, 45W en carga |
| **NUC13ANHi7** | ~20,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W en reposo, 50W en carga |
| **NUC13ANKi5** | ~18,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W en reposo, 45W en carga |
| **NUC13ANKi7** | ~20,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W en reposo, 50W en carga |
| **ROG NUC 2025** | ~35,000+ | RTX 5080 | 20 | TB4 (1x) | 7x USB 3.2 | 25W en reposo, 160W en carga |

*Puntuaciones aproximadas: el rendimiento real puede variar

### Detalles de Memoria y Almacenamiento

| Modelo | Tipo de RAM | Capacidad Máx. | Ranuras RAM | Ranuras de Almacenamiento | Almacenamiento Máx. | Opciones de Arranque |
|-------|----------|--------------|-----------|---------------|-------------|--------------|
| **NUC13ANHi3** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANHi5** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANHi7** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANKi5** | DDR4-3200 SO-DIMM | 64GB | 2x | 2x M.2 | 8TB en total | UEFI, Legacy |
| **NUC13ANKi7** | DDR4-3200 SO-DIMM | 64GB | 2x | 2x M.2 | 8TB en total | UEFI, Legacy |
| **ROG NUC 2025** | DDR5-5600 SO-DIMM | 96GB | 2x | 2x M.2 | 8TB en total | Solo UEFI |

### Conectividad y E/S

| Modelo | Ethernet | WiFi | Bluetooth | Salidas de Video | Audio | Dimensiones (mm) |
|-------|----------|------|-----------|-----------------|-------|-----------------|
| **NUC13ANHi3** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANHi5** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANHi7** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANKi5** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×35 |
| **NUC13ANKi7** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×35 |
| **ROG NUC 2025** | 2.5GbE | WiFi 7 | BT 5.4 | 2x DP2.1, 2x HDMI2.1 | 3.5mm | 282×188×57 |

## Matriz de Compatibilidad con Plataformas de Servidor

### Soporte de Sistemas Operativos

| Modelo | Ubuntu Server | Debian | CentOS/RHEL | Windows Server | Proxmox | ESXi |
|-------|---------------|--------|-------------|----------------|---------|------|
| **NUC13ANHi3** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Requiere controladores | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANHi5** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Requiere controladores | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANHi7** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Requiere controladores | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANKi5** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Requiere controladores | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANKi7** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Requiere controladores | ✅ 7.4+ | ✅ 7.0+ |
| **ROG NUC 2025** | ✅ 22.04+ | ✅ 12+ | ✅ 9+ | ❌ No recomendado | ✅ 8.0+ | ✅ 8.0+ |

### Soporte de Plataformas Comunitarias

| Modelo | YunoHost | CasaOS | Caprover | Home Assistant | Nextcloud | Docker |
|-------|----------|--------|----------|----------------|-----------|--------|
| **NUC13ANHi3** | ✅ Bueno | ✅ Excelente | ✅ Bueno | ✅ Excelente | ✅ Bueno | ✅ Excelente |
| **NUC13ANHi5** | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |
| **NUC13ANHi7** | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |
| **NUC13ANKi5** | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |
| **NUC13ANKi7** | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |
| **ROG NUC 2025** | ⚠️ Excesivo | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente | ✅ Excelente |

## Configuraciones Recomendadas según el Caso de Uso

### Servidor Doméstico Inicial (Uso Ligero)
**Recomendado: NUC13ANHi3**
- **RAM**: 16GB (2x 8GB DDR4-3200)
- **Almacenamiento**: SSD NVMe de 500GB + SSD SATA de 2TB
- **Casos de Uso**: Compartición de archivos, transmisión básica de medios, nube personal
- **Costo Estimado**: $400-500 (barebones + componentes)

### Servidor Doméstico Equilibrado (Uso Medio)
**Recomendado: NUC13ANHi5 o NUC13ANKi5**
- **RAM**: 32GB (2x 16GB DDR4-3200)
- **Almacenamiento**: SSD NVMe de 1TB + SSD SATA de 4TB (ANHi5) o 2x NVMe de 2TB (ANKi5)
- **Casos de Uso**: Múltiples servicios, cargas de trabajo en contenedores, desarrollo
- **Costo Estimado**: $600-800 (barebones + componentes)

### Servidor de Alto Rendimiento (Uso Intensivo)
**Recomendado: NUC13ANHi7 o NUC13ANKi7**
- **RAM**: 64GB (2x 32GB DDR4-3200)
- **Almacenamiento**: SSD NVMe de 2TB + SSD SATA de 4TB
- **Casos de Uso**: Virtualización, múltiples VMs, cargas de trabajo intensivas
- **Costo Estimado**: $900-1200 (barebones + componentes)

### Servidor para Juegos/Entusiastas
**Recomendado: ROG NUC 2025**
- **RAM**: 64-96GB DDR5
- **Almacenamiento**: 2x SSD NVMe de 4TB
- **Casos de Uso**: Servidores de juegos, computación con GPU, cargas de trabajo de IA
- **Costo Estimado**: $3500+ (sistema completo)

## Árbol de Decisión para la Selección del Modelo

```
Do you need GPU acceleration or gaming performance?
├─ YES → ROG NUC 2025
└─ NO → Continue

Is maximum storage flexibility important?
├─ YES → NUC13ANKi5/i7 (dual M.2, no 2.5" bay)
└─ NO → Continue

What's your performance requirement?
├─ Basic (file sharing, simple services) → NUC13ANHi3
├─ Medium (containers, multiple services) → NUC13ANHi5
└─ High (virtualization, heavy workloads) → NUC13ANHi7
```

## Comparación de Eficiencia Energética

| Modelo | Consumo en Reposo | Carga Típica | Consumo Máx. | Costo Anual Estimado* |
|-------|------------|--------------|-----------|------------------|
| **NUC13ANHi3** | 5-8W | 15-25W | 35W | $15-30 |
| **NUC13ANHi5** | 6-10W | 20-35W | 45W | $20-40 |
| **NUC13ANHi7** | 8-12W | 25-40W | 50W | $25-45 |
| **NUC13ANKi5** | 6-10W | 20-35W | 45W | $20-40 |
| **NUC13ANKi7** | 8-12W | 25-40W | 50W | $25-45 |
| **ROG NUC 2025** | 20-30W | 80-120W | 160W | $80-130 |

*Basado en $0.12/kWh, operación 24/7
## Capacidades de Actualización y Expansión

### Actualizaciones de Memoria
- **Todos los Modelos Estándar**: Soportan hasta 64GB DDR4-3200 SO-DIMM
- **ROG NUC**: Soporta hasta 96GB DDR5-5600 SO-DIMM
- **Instalación**: Acceso sin herramientas en la mayoría de los modelos

### Expansión de Almacenamiento
- **Modelos ANH**: 1x M.2 2280 + 1x bahía SATA de 2.5"
- **Modelos ANK**: 2x ranuras M.2 2280 (sin bahía de 2.5")
- **ROG NUC**: 2x ranuras M.2 2280 + refrigeración avanzada

### Expansión de Conectividad
- **Thunderbolt 4**: Soporta GPU externa, almacenamiento, red
- **USB 3.2**: Múltiples puertos para periféricos adicionales
- **Red**: Adaptadores USB a Ethernet para NICs adicionales

## Consideraciones sobre Modelos Anteriores

### Cuándo Considerar Modelos Anteriores
- **Restricciones de presupuesto**: Los modelos NUC11/12 ofrecen buena relación calidad-precio
- **Compatibilidad específica**: Algunos software funcionan mejor con hardware anterior
- **Inventario disponible**: Los modelos anteriores pueden tener descuentos

### Ruta de Migración
- Comience con la generación actual para mayor longevidad
- Considere la ruta de actualización al planificar la configuración inicial
- Tenga en cuenta el cronograma de soporte de drivers

## Recomendaciones de Compra

### Dónde Comprar
- **ASUS Direct**: Modelos más recientes, garantía completa
- **Integradores de Sistemas**: Opciones preconfiguradas
- **Grandes Minoristas**: Precios competitivos, políticas de devolución
- **Mercado de Usados**: Modelos anteriores a precios reducidos

### Qué Evitar
- **Modelos muy antiguos** (NUC6 y anteriores): Soporte limitado de sistemas operativos modernos
- **Vendedores desconocidos**: Preocupaciones de garantía y soporte
- **Kits incompletos**: Asegúrese de que se incluyan todos los componentes necesarios

---

**Próximos Pasos:**
- Revise [nuc-bios-setup.md](nuc-bios-setup.md) para ver las pautas de configuración
- Consulte [nuc-power-network.md](nuc-power-network.md) para ver las mejores prácticas de configuración

*Las especificaciones están sujetas a cambios. Siempre verifique con la documentación del fabricante antes de comprar.*