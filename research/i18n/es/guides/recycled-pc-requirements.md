---
title: Requisitos de PC Reciclada
sourcePath: guides/recycled-pc-requirements.md
sourceHash: 092186213fa41cde
translatedBy: glm-4.6
---

# Requisitos de hardware de computadoras recicladas para servidores comunitarios

## Descripción general

Esta guía establece las especificaciones mínimas y recomendadas de hardware para seleccionar computadoras recicladas adecuadas y reconvertirlas como servidores comunitarios. Estos requisitos equilibran las necesidades de rendimiento con las limitaciones prácticas del hardware antiguo, al mismo tiempo que garantizan la confiabilidad para cargas de trabajo de servidor.

## Requisitos mínimos de hardware

### Procesador (CPU)
- **Mínimo**: procesador de 64 bits (arquitectura x86_64)
- **Velocidad de reloj**: 1.4 GHz o superior
- **Núcleos**: al menos 2 núcleos (4 núcleos recomendados)
- **Generación**: Intel de 4ta generación (Haswell) o equivalente AMD y más recientes
- **Características requeridas**:
  - Soporte para bit NX y DEP
  - Instrucciones CMPXCHG16b, LAHF/SAHF y PrefetchW
  - Soporte de virtualización (Intel VT-x o AMD-V)
  - Traducción de direcciones de segundo nivel (EPT o NPT)

### Memoria (RAM)
- **Mínimo absoluto**: 4 GB DDR3/DDR4
- **Mínimo recomendado**: 8 GB
- **Óptimo**: 16 GB o más
- **Tipo**: DDR3-1600 o DDR4-2400 como mínimo
- **Soporte ECC**: preferible pero no requerido

### Almacenamiento
- **Unidad de arranque**: SSD de 120 GB como mínimo (256 GB recomendados)
- **Almacenamiento de datos**: HDD de 1 TB como mínimo para funciones de servidor de archivos
- **Interfaz**: SATA 3.0 (6 Gbps) preferible
- **Soporte RAID**: controlador RAID por hardware preferible para redundancia

### Conectividad de red
- **Ethernet**: Gigabit Ethernet (1000 Mbps) requerido
- **Wi-Fi**: 802.11n como mínimo (802.11ac preferible)
- **Múltiples NIC**: beneficioso para configuraciones de red avanzadas

### Fuente de alimentación
- **Potencia**: 300W como mínimo (con certificación de eficiencia preferible)
- **Eficiencia**: 80 PLUS Bronze o superior
- **Redundancia**: capacidad de doble fuente preferible para aplicaciones críticas

## Especificaciones de hardware recomendadas

### Configuración de servidor mejorada
- **CPU**: Intel i5/i7 de 6ta generación o superior o AMD Ryzen 3/5/7
- **RAM**: 16-32 GB DDR4
- **Almacenamiento**: SSD NVMe de 512 GB + arreglo HDD de 2+ TB
- **Red**: NIC Gigabit dobles
- **Factor de forma**: Small Form Factor (SFF) o torre Micro preferibles

## Lista de verificación para la selección de hardware

### Evaluación previa a la compra
- [ ] Verificar que la CPU cumpla con los requisitos de 64 bits
- [ ] Comprobar la capacidad máxima de RAM soportada
- [ ] Confirmar que los puertos Ethernet funcionen
- [ ] Probar la funcionalidad de todos los puertos USB
- [ ] Inspeccionar en busca de daños físicos o desgaste excesivo
- [ ] Verificar la funcionalidad de la fuente de alimentación
- [ ] Comprobar la accesibilidad del BIOS/UEFI
- [ ] Confirmar la disponibilidad de ranuras de expansión

### Verificación de compatibilidad
- [ ] La CPU soporta funciones de virtualización
- [ ] La placa base soporta la configuración de RAM objetivo
- [ ] Las interfaces de almacenamiento coinciden con las unidades disponibles
- [ ] Las tarjetas de red soportan las velocidades requeridas
- [ ] La fuente de alimentación cumple con los requisitos totales del sistema
- [ ] El BIOS/UEFI soporta modos de arranque modernos

### Evaluación de la condición física
- [ ] Sin daños visibles en los componentes
- [ ] Los componentes internos pueden limpiarse
- [ ] Sistema de refrigeración adecuado presente
- [ ] Todas las ranuras de expansión accesibles
- [ ] Sin señales de daño por líquidos
- [ ] Acumulación mínima de polvo

## Consideraciones sobre el factor de forma

### Torres de escritorio
- **Ventajas**: excelente expandibilidad, buena refrigeración, múltiples bahías para unidades
- **Desventajas**: mayor espacio ocupado, mayor consumo de energía
- **Ideal para**: servidores de archivos, servidores de desarrollo, almacenamiento de alta capacidad

### Small Form Factor (SFF)
- **Ventajas**: tamaño compacto, menor consumo de energía, operación silenciosa
- **Desventajas**: expansión limitada, menos bahías para unidades
- **Ideal para**: servidores web, aplicaciones ligeras, entornos con espacio limitado

### Mini/Micro PC
- **Ventajas**: muy compactos, bajo consumo, operación silenciosa
- **Desventajas**: expansión muy limitada, a menudo componentes de laptop
- **Ideal para**: servicios básicos, computación perimetral, entornos de pruebas

## Guías de presupuesto

### Rangos con buena relación costo-beneficio
- **Servidor básico**: $100-200 (computadoras de negocio antiguas)
- **Servidor capaz**: $200-400 (equipos de negocio recientes)
- **Servidor de alto rendimiento**: $400-600 (hardware de clase estación de trabajo)

### Costo total de propiedad
- Considerar los posibles costos de actualización (RAM, almacenamiento)
- Considerar el consumo de energía a lo largo de 3-5 años
- Tener en cuenta la disponibilidad de repuestos
- Presupuestar los suministros iniciales de reacondicionamiento

## Criterios de exclusión

### Evita estas configuraciones
- Procesadores solo de 32 bits
- Capacidad máxima de RAM menor a 4 GB
- Solo interfaces de almacenamiento IDE/PATA
- Ethernet máximo de 100 Mbps
- Factores de forma propietarios con rutas de actualización limitadas
- Sistemas con problemas de confiabilidad conocidos
- Máquinas que requieren componentes propietarios costosos

## Consideraciones especiales

### Requisitos de bajo consumo
Para operaciones de bajo consumo energético:
- Apuntar a sistemas con CPU de 35W de TDP
- Buscar fuentes de alimentación 80 PLUS Gold o superior
- Considerar sistemas con refrigeración de estado sólido
- Priorizar procesadores Intel Atom o AMD de bajo consumo

### Redundancia y confiabilidad
Para aplicaciones críticas para la misión:
- Preferir sistemas con soporte de RAM ECC
- Buscar capacidad de doble fuente de alimentación
- Considerar el soporte de controlador RAID
- Priorizar equipos de negocio/empresariales

### Planificación de la escalabilidad
- Elegir sistemas con ranuras de expansión disponibles
- Garantizar margen suficiente de la fuente de alimentación
- Verificar los límites máximos de RAM soportada
- Considerar la capacidad de clustering para crecimiento futuro

## Especificaciones de referencia rápida

| Componente | Mínimo | Recomendado | Óptimo |
|-----------|---------|-------------|---------|
| CPU | Doble núcleo 1.4GHz | Cuatro núcleos 2.0GHz+ | 6+ núcleos 3.0GHz+ |
| RAM | 4 GB DDR3 | 8 GB DDR4 | 16+ GB DDR4 |
| Almacenamiento | 120 GB SSD | 256 GB SSD + 1 TB HDD | 512 GB NVMe + 2+ TB |
| Red | 100 Mbps | 1 Gbps | Doble 1 Gbps |
| Energía | 300W | 400W 80+ Bronze | 500W+ 80+ Gold |

## Próximos pasos

1. **Revisar**: [Comparación de modelos reciclados](recycled-models-comparison.md) para recomendaciones de modelos específicos
2. **Probar**: Usar [Verificación de compatibilidad de hardware](hardware-compatibility-check.md) para verificar los componentes
3. **Preparar**: Seguir [Preparación de reciclados](recycled-preparation.md) para el reacondicionamiento
4. **Configurar**: Aplicar la configuración de BIOS apropiada para tu hardware específico

---

*Esta guía proporciona recomendaciones generales. Siempre verifica los requisitos específicos de compatibilidad para las aplicaciones de servidor y el sistema operativo que tengas previsto usar.*