---
title: Selección de Router
sourcePath: guides/router-selection-guide.md
sourceHash: 71ea6aa25cbec92a
translatedBy: glm-4.6
---

# Guía de Selección de Routers para Redes Comunitarias LibreMesh

Esta guía te ayuda a evaluar y seleccionar routers compatibles y confiables para la instalación del firmware LibreMesh y fines de red comunitaria. Tomar la decisión correcta de hardware es crucial para una implementación exitosa de una red comunitaria.

## Matriz de Decisión Rápida

Antes de adentrarte en las especificaciones detalladas, usa esta matriz para determinar rápidamente si un router es adecuado para tu implementación de LibreMesh:

| Requisito | Mínimo | Recomendado | Ideal |
|-------------|---------|-------------|-------|
| Memoria Flash | 8 MB | 16 MB | 32+ MB |
| RAM | 64 MB | 128 MB | 256+ MB |
| Radios | 1 (2.4 GHz) | 2 (2.4 + 5 GHz) | 3+ (Múltiples 5 GHz) |
| Puertos Ethernet | 1 LAN | 4 LAN + 1 WAN | 5+ Gigabit |
| Chipset | Cualquiera compatible con OpenWrt | Atheros/MediaTek | Atheros ath9k/ath10k |

*`[Router Hardware Lineup](router-lineup.png)` — Foto que muestra varios modelos de routers recomendados lado a lado, incluyendo modelos de TP-Link, GL.iNet y Asus.*

## Análisis Profundo de los Requisitos de Hardware

### Especificaciones de Memoria

**Memoria Flash (Almacenamiento)**
- **8 MB mínimo**: Permite una instalación básica de LibreMesh con firmware `-mini`
- **16 MB recomendado**: LibreMesh estándar con el conjunto completo de funciones
- **32+ MB ideal**: Permite paquetes adicionales, registros extensos y actualizaciones futuras

**RAM (Memoria del Sistema)**
- **64 MB mínimo**: Operación básica de malla con conexiones concurrentes limitadas
- **128 MB recomendado**: Rendimiento estable con 20-50 dispositivos
- **256+ MB ideal**: Nodos de alta capacidad que soportan 100+ dispositivos y funciones avanzadas

*`[Specs Label Closeup](router-specs-label.png)` — Primer plano de la etiqueta de un router que muestra especificaciones/etiquetas relevantes, incluyendo especificaciones de memoria e información del modelo.*

> **💡 Consejo**: Busca la etiqueta de especificaciones en la parte inferior o posterior del router. Las especificaciones de memoria suelen aparecer como "Flash: XXX MB" y "RAM: XXX MB".

### Requisitos de Radios Inalámbricas

**Configuración Esencial de Radios**
- **Radio de 2.4 GHz**: Requerida para el acceso de clientes y el backhaul de la malla
- **Radio de 5 GHz**: Muy recomendada para backhaul de malla de alta velocidad
- **Múltiples radios de 5 GHz**: Ideal para separar el backhaul dedicado del acceso de clientes

**Chipsets Soportados (En Orden de Prioridad)**
1. **Atheros ath9k** (serie AR9xxx): La mejor compatibilidad con LibreMesh
2. **Atheros ath10k** (serie QCA9xxx): Buen rendimiento, mayor soporte para Wi-Fi 6
3. **MediaTek MT76xx**: Alternativa confiable con buena relación precio/rendimiento
4. **Broadcom**: Soporte limitado para LibreMesh, evita si es posible

> **⚠️ Advertencia**: Evita routers con chipsets inalámbricos Realtek ya que tienen un soporte deficiente para LibreMesh/OpenWrt.

### Requisitos de Interfaces de Red

**Conectividad Ethernet**
- **Mínimo**: 1 puerto LAN para configuración y conexiones locales
- **Estándar**: 4 puertos LAN + 1 puerto WAN para instalaciones típicas
- **Avanzado**: Puertos Gigabit con soporte PoE para implementaciones profesionales

**Consideraciones Especiales**
- **Flexibilidad del puerto WAN**: Algunos dispositivos de un solo puerto pueden configurarse con WAN por software
- **Capacidad PoE**: Esencial para instalaciones exteriores y alimentación remota
- **Integración de switch**: Los switches integrados reducen los requisitos de equipo

## Modelos de Routers Recomendados por Categoría

### Opciones Económicas ($30-60)

**TP-Link Archer C7 v2/v5**
- Flash: 16 MB | RAM: 128 MB
- Doble banda AC1750 (2.4GHz + 5GHz)
- Chipset Atheros QCA9558 + QCA9880
- Ventajas: Excelente soporte de OpenWrt, confiabilidad comprobada
- Desventajas: Estándar Wi-Fi 5 más antiguo

**GL.iNet GL-AR300M16**
- Flash: 16 MB | RAM: 128 MB  
- Una sola banda N300 (solo 2.4GHz)
- Chipset Atheros AR9331
- Ventajas: Tamaño compacto, OpenWrt preinstalado
- Desventajas: Una sola radio limita el rendimiento de la malla

### Opciones de Gama Media ($60-120)

**TP-Link Archer C6 v3.x**
- Flash: 16 MB | RAM: 128 MB
- Doble banda AC1200 (2.4GHz + 5GHz)
- MediaTek MT7621A + MT7603E/MT7613BE
- Ventajas: Buena relación precio-rendimiento, chipset estable
- Desventajas: Requiere verificar cuidadosamente la versión

**GL.iNet Flint (GL-AX1800)**
- Flash: 128 MB | RAM: 512 MB
- Doble banda AX1800 Wi-Fi 6
- Chipset Qualcomm IPQ6010
- Ventajas: Soporte Wi-Fi 6, gran memoria
- Desventajas: Chipset más nuevo con pruebas comunitarias limitadas

### Profesionales/Alto Rendimiento ($120+)

**Ubiquiti Rocket M2/M5**
- Flash: 8 MB | RAM: 64 MB
- Radios de malla dedicadas de una sola banda
- Chipset Atheros AR7241 + AR9280
- Ventajas: Diseñados específicamente para WISP/malla, resistentes a la intemperie
- Desventajas: Requiere un punto de acceso separado para clientes

**ASUS TUF-AX6000**
- Flash: 256 MB | RAM: 1 GB
- Triple banda AX6000 Wi-Fi 6
- Chipset MediaTek MT7986A Filogic
- Ventajas: Rendimiento de nivel empresarial, memoria extensa
- Desventajas: Mayor consumo de energía, configuración compleja

### Opciones para Exteriores/Especializadas

**Ubiquiti NanoStation M2/M5**
- Flash: 8 MB | RAM: 32 MB
- Enlaces punto a punto/punto a multipunto
- Chipset Atheros AR7240 + AR9280
- Ventajas: Resistentes a la intemperie, antena integrada, largo alcance
- Desventajas: Limitados para enrutamiento de propósito general

## Consideraciones Específicas por Marca

### Dispositivos TP-Link

**Ventajas:**
- Amplia compatibilidad con OpenWrt/LibreMesh
- Opciones rentables en todos los rangos de precios
- Buena disponibilidad en todo el mundo

**Consideraciones:**
- **Omisión del bloqueo FCC**: Los modelos más nuevos pueden requerir un paso intermedio con DD-WRT
- **Verificación de versión**: Las revisiones de hardware pueden variar significativamente
- **Nomenclatura del firmware**: Las imágenes de fábrica deben coincidir exactamente con la nomenclatura oficial

> **⚠️ Advertencia de Bloqueo FCC**: Los dispositivos TP-Link fabricados después de 2016 pueden tener restricciones de firmware. Busca errores "18005" o "Invalid Filename" durante el flasheo, que indican protección de bloqueo FCC.

### Dispositivos GL.iNet

**Ventajas:**
- OpenWrt preinstalado con una ruta sencilla de actualización a LibreMesh
- Formatos compactos y aptos para viajes
- Buena documentación y soporte comunitario

**Consideraciones:**
- **OpenWrt personalizado**: Puede usar versiones de OpenWrt más antiguas o modificadas
- **Opciones limitadas para exteriores**: La mayoría de los modelos están diseñados para uso en interiores
- **Precio premium**: A menudo más caros que las opciones equivalentes de TP-Link

### Dispositivos ASUS

**Ventajas:**
- Hardware de alto rendimiento con memoria generosa
- Buena calidad de construcción y confiabilidad
- Funciones avanzadas de red

**Consideraciones:**
- **Instalación compleja**: Puede requerir procedimientos de flasheo específicos de ASUS
- **Mayor costo**: Precios premium en comparación con alternativas
- **Requisitos de energía**: A menudo requieren más energía que las opciones económicas

### Dispositivos Ubiquiti

**Ventajas:**
- Diseñados específicamente para redes inalámbricas
- Opciones para exteriores resistentes a la intemperie
- Excelente rendimiento de largo alcance

**Consideraciones:**
- **Compatibilidad con AirOS**: Evita AirOS 5.6.x (requiere downgrade)
- **Enrutamiento limitado**: Algunos modelos están diseñados solo como puentes/puntos de acceso
- **Enfoque profesional**: Puede ser excesivo para implementaciones pequeñas

## Árbol de Decisión para la Selección de Routers

### Para Redes de Hogar/Oficina en Interiores
1. **Pequeña (1-10 dispositivos)**: GL.iNet GL-AR300M16 o TP-Link Archer C7
2. **Mediana (10-30 dispositivos)**: TP-Link Archer C6 v3 o GL.iNet Flint
3. **Grande (30+ dispositivos)**: ASUS TUF-AX6000 o múltiples nodos coordinados

### Para Redes Comunitarias en Exteriores
1. **Enlaces punto a punto**: Ubiquiti NanoStation M2/M5
2. **Backhaul de malla**: Ubiquiti Rocket M2/M5 con antenas sectoriales
3. **Acceso de clientes**: Modelos TP-Link para exteriores con gabinetes resistentes a la intemperie

### Para Implementaciones Mixtas de Interiores/Exteriores
1. **Nodos de columna vertebral**: Routers de interior de alto rendimiento con buena refrigeración
2. **Nodos de extensión**: Unidades para exteriores resistentes a la intemperie
3. **Acceso de clientes**: Puntos de acceso de interiores ubicados estratégicamente

## Lista de Verificación Previa a la Compra

Antes de comprar cualquier router para uso con LibreMesh:

- [ ] **Verificar la compatibilidad con OpenWrt** en la Tabla de Hardware oficial
- [ ] **Comprobar que la revisión de hardware** coincida exactamente con las versiones soportadas
- [ ] **Confirmar que las especificaciones de memoria** cumplan con los requisitos de tu implementación
- [ ] **Investigar la complejidad de instalación** para tu modelo/revisión específica
- [ ] **Comprobar los tipos de conectores de antena** si se necesitan antenas externas
- [ ] **Verificar los requisitos de energía** y la compatibilidad con PoE si es necesario
- [ ] **Leer reportes recientes de la comunidad** en las listas de correo/foros de LibreMesh
## Errores Comunes que se Deben Evitar

### Errores en la Selección de Hardware
- **Memoria insuficiente**: 4MB de flash o 32MB de RAM limitan severamente la funcionalidad
- **Revisión de hardware incorrecta**: Las diferentes revisiones pueden tener procedimientos de instalación incompatibles
- **Chipsets no compatibles**: Chipsets inalámbricos Realtek o propietarios
- **Limitación de banda única**: Los routers de solo 2.4GHz limitan el rendimiento de la malla

### Consideraciones al Comprar
- **Confusión de versiones**: Asegúrate de la compatibilidad exacta de modelo y revisión
- **Bloqueo de firmware**: Los dispositivos más nuevos pueden tener restricciones de instalación
- **Limitaciones de antena**: Las antenas no removibles limitan la flexibilidad de despliegue
- **Fuente de alimentación**: Adaptadores de corriente faltantes o incompatibles

## Próximos Pasos

Una vez que hayas seleccionado el hardware adecuado:

1. **Continúa con la [Guía de Instalación de LibreMesh](libremesh-installation.md)** para los procedimientos de flasheo del firmware
2. **Consulta la [Guía de Solución de Problemas de Routers](router-troubleshooting.md)** para los procedimientos de recuperación
3. **Planifica tu topología de red** considerando las capacidades de radio y los requisitos de cobertura
4. **Prepara las herramientas de instalación** incluyendo los cables y software apropiados

> **📖 Lectura Relacionada**: Para instrucciones de instalación detalladas específicas para tu modelo de router elegido, consulta la documentación de hardware de LibreMesh y las páginas de dispositivos de OpenWrt antes de comenzar la instalación del firmware.