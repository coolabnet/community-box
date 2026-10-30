---
title: Energía y Red
sourcePath: hardware/intel_nuc/nuc-power-network.md
sourceHash: ff706946c051892b
translatedBy: glm-4.6
---

# Guía de Configuración de la Fuente de Alimentación, Almacenamiento y Red para Intel NUC

## Introducción

Optimizar la fuente de alimentación, las opciones de almacenamiento y la conectividad de red es crucial para una implementación confiable de un servidor Intel NUC. Esta guía proporciona recomendaciones integrales para estos componentes críticos al usar Intel NUCs como plataformas de servidor comunitario con YunoHost, Caprover, CasaOS o soluciones similares de auto-alojamiento.

## Consideraciones sobre la Fuente de Alimentación

### Adaptadores de Corriente Oficiales

Los Intel NUCs requieren adaptadores de corriente específicos que varían según el modelo:

| Serie NUC | Potencia | Tipo de Conector | Notas |
|------------|--------------|----------------|-------|
| NUC13 Estándar | 19V, 90W | Barril de 5.5mm | Configuración más común |
| NUC12/13 Pro | 19V, 120W | Barril de 5.5mm | Modelos de mayor potencia |
| ROG NUC 2025 | 19.5V, 230W | Barril de 7.4mm | Variantes gaming/alto rendimiento |
| NUCs Anteriores | 19V, 65W | Barril de 5.5mm | Modelos antiguos (NUC10 y anteriores) |

#### Especificaciones Importantes
- **Voltaje de salida**: Siempre 19-19.5V DC
- **Potencia**: Ajustar los vatios a tu modelo específico
- **Tamaño del conector**: Barril de 5.5mm x 2.5mm (modelos estándar)
- **Polaridad**: Centro positivo (+) en todos los modelos

### Mejores Prácticas para Adaptadores de Corriente

#### ✅ Recomendado
- **Usar adaptadores OEM** siempre que sea posible
- **Adaptadores de terceros de calidad** con certificación UL/CE
- **Adaptadores con protección contra sobrecorriente integrada**
- **Calibre de cable adecuado** para la longitud (más grueso para distancias más largas)

#### ❌ Evitar
- **Adaptadores universales** con múltiples puntas/voltajes seleccionables
- **Adaptadores de potencia insuficiente** (por debajo de los vatios especificados)
- **Adaptadores baratos sin certificación** que pueden dañar los componentes
- **Adaptadores sin certificaciones de seguridad**

### Sistema de Alimentación Ininterrumpida (UPS)

Para implementaciones de servidores, se recomienda encarecidamente un UPS:

#### Especificaciones Mínimas del UPS
- **Capacidad**: 300-500VA para NUCs estándar
- **Salida**: Onda sinusoidal pura preferible (pero no obligatoria)
- **Tiempo de funcionamiento**: Mínimo 10-15 minutos a carga completa
- **Tipo de batería**: Plomo-ácido sellada o ion de litio
- **Comunicación**: Interfaz USB para apagado automático

#### Modelos de UPS Recomendados
- **APC BE600M1**: Nivel de entrada, 600VA/330W, 7 tomacorrientes
- **CyberPower CP1000PFCLCD**: Gama media, 1000VA/600W, onda sinusoidal pura
- **APC BR1500MS**: Gama alta, 1500VA/900W, onda sinusoidal, AVR
- **Tripp Lite SMART1500LCDT**: 1500VA/900W, pantalla LCD, tiempo de funcionamiento extendido

#### Consejos de Configuración del UPS
1. Conectar el NUC a un tomacorriente con respaldo de batería
2. Instalar software de monitoreo del UPS en el servidor
3. Configurar los parámetros de apagado automático
4. Probar la funcionalidad del UPS trimestralmente
5. Reemplazar las baterías cada 3-5 años

### Planificación del Consumo de Energía

Los Intel NUCs son extremadamente eficientes en energía en comparación con los servidores tradicionales:

| Modelo | Consumo en Reposo | Carga Típica | Carga Pesada | Costo Anual* |
|-------|------------|--------------|------------|--------------|
| NUC i3 | 4-8W | 15-25W | 35W | $15-30 |
| NUC i5 | 6-10W | 20-35W | 45W | $20-40 |
| NUC i7 | 8-12W | 25-40W | 50W | $25-45 |
| ROG NUC | 20-30W | 80-120W | 160W+ | $80-150 |

*Basado en $0.12/kWh, funcionamiento 24/7

#### Consejos de Eficiencia Energética
- Activar las funciones de gestión de energía en la BIOS
- Usar almacenamiento SSD en lugar de discos mecánicos
- Configurar los ajustes de gestión de energía del sistema operativo
- Programar servicios no críticos en horarios de menor demanda
- Monitorear el consumo de energía con enchufes inteligentes o software del UPS

## Configuración de Almacenamiento

Los Intel NUCs ofrecen múltiples opciones de almacenamiento que pueden optimizarse para la implementación de servidores.

### Tipos de Interfaz de Almacenamiento

| Interfaz | Velocidad | Uso Típico | Consumo de Energía | Recomendado Para |
|-----------|-------|-------------|-------------------|-----------------|
| M.2 NVMe PCIe 4.0 | Hasta 7,000 MB/s | SO, bases de datos | 5-8W | Aplicaciones de alto rendimiento |
| M.2 NVMe PCIe 3.0 | Hasta 3,500 MB/s | SO, contenedores | 4-7W | Equilibrio rendimiento/costo |
| M.2 SATA | Hasta 550 MB/s | Almacenamiento general | 2-4W | Configuraciones económicas |
| SSD SATA de 2.5" | Hasta 550 MB/s | Almacenamiento multimedia | 2-5W | Grandes necesidades de capacidad |
| HDD SATA de 2.5" | Hasta 150 MB/s | Archivado | 5-10W | No recomendado |

### Recomendaciones de Configuración de Almacenamiento

#### Unidad del Sistema (SO y Aplicaciones)
- **Recomendado**: SSD NVMe (mínimo 250GB)
- **Modelos Preferidos**: Samsung 980 Pro, WD Black SN850, Kingston KC3000
- **Durabilidad Mínima**: 300 TBW para uso en servidores
- **Sobre-asignación**: 20% de espacio sin asignar para mayor longevidad

#### Almacenamiento de Datos
- **Recomendado**: SSD SATA para la bahía de 2.5" (si está disponible)
- **Modelos Preferidos**: Samsung 870 EVO, Crucial MX500, WD Blue
- **Capacidad**: 1-4TB según las necesidades
- **Consideración**: Almacenamiento externo para requisitos de mayor capacidad

#### Configuración de Doble Unidad (Óptima)
1. **Unidad del Sistema**: 500GB-1TB NVMe para el SO y aplicaciones
2. **Unidad de Datos**: 2-4TB SSD SATA para datos de usuario, multimedia y copias de seguridad

### Configuración de Almacenamiento por Modelo de NUC

| Modelo NUC | Opciones de Almacenamiento | Configuración Óptima |
|-----------|----------------|------------------------|
| NUC13ANHi3/i5/i7 | 1x M.2 + 1x SATA de 2.5" | 1TB NVMe + 2TB SSD SATA |
| NUC13ANKi5/i7 | 2 ranuras M.2 | 1TB NVMe (SO) + 2TB NVMe (datos) |
| ROG NUC 2025 | 2 ranuras M.2 | 2TB NVMe (SO) + 4TB NVMe (datos) |

### Consejos de Optimización de Almacenamiento

#### Optimización del Rendimiento
1. **Usar TRIM**: Activar el soporte TRIM en el sistema operativo
2. **Selección del Sistema de Archivos**:
   - ext4 para uso general de Linux
   - ZFS para integridad de datos (requiere más RAM)
   - Btrfs para capacidades de instantáneas
3. **Alineación de Particiones**: Asegurar la alineación correcta para SSDs
4. **Sobre-asignación**: Dejar 10-20% de espacio sin asignar
5. **Configuración de Swap**: Uso mínimo de swap con SSDs

#### Consideraciones de Fiabilidad
1. **Copias de Seguridad Regulares**: La estrategia de respaldo 3-2-1 es esencial
2. **Monitoreo SMART**: Instalar y configurar smartmontools
3. **Nivelación de Desgaste**: Elegir SSDs con buenos algoritmos de nivelación de desgaste
4. **Monitoreo de Temperatura**: Mantener los discos dentro del rango óptimo de temperatura
5. **Mantenimiento Programado**: Comprobaciones periódicas del sistema de archivos

### Opciones de Almacenamiento Externo

Para ampliar más allá de la capacidad interna:

#### Almacenamiento de Conexión Directa (DAS)
- **Gabinetes USB 3.2/Thunderbolt**: Alta velocidad, conexión directa
- **Modelos Recomendados**: Sabrent, Orico, CalDigit
- **Conexión**: USB 3.2 Gen 2 o Thunderbolt para el mejor rendimiento
- **Configuración**: Opciones JBOD o RAID por hardware

#### Almacenamiento Conectado en Red (NAS)
- **Recomendación**: Synology, QNAP, o una solución NAS personalizada
- **Conexión**: Vía red Ethernet
- **Protocolo**: SMB/CIFS, NFS o iSCSI
- **Consideraciones**: El ancho de banda de la red se convierte en el factor limitante
## Conectividad de Red

Optimizar la conectividad de red es esencial para un funcionamiento confiable del servidor.

### Interfaces de Red Integradas

| Generación NUC | Interfaz Estándar | Velocidad | Características |
|----------------|-------------------|-------|----------|
| NUC 13 (ASUS) | Intel I225-V | 2.5 Gigabit | Wake-on-LAN, PXE |
| NUC 12 | Intel I219-V | 1 Gigabit | Wake-on-LAN, PXE |
| NUC 11 | Intel I219-V | 1 Gigabit | Wake-on-LAN, PXE |
| ROG NUC 2025 | Intel I225-LM | 2.5 Gigabit | Gestión avanzada |

### Configuración de Interfaces de Red

#### Configuración Básica
1. **Actualiza los controladores** a la última versión
2. **Habilita Wake-on-LAN** en BIOS y el sistema operativo
3. **Configura IP estática** mediante reserva DHCP o asignación estática
4. **Establece el MTU adecuado** (típicamente 1500, o 9000 para jumbo frames si es compatible)
5. **Desactiva protocolos no utilizados** para reducir la superficie de ataque

#### Ajustes Avanzados (Linux)
```bash
# Increase network buffers
echo 'net.core.rmem_max=16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max=16777216' >> /etc/sysctl.conf

# Optimize TCP settings
echo 'net.ipv4.tcp_rmem=4096 87380 16777216' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_wmem=4096 65536 16777216' >> /etc/sysctl.conf

# Apply changes
sysctl -p
```

### Múltiples Interfaces de Red

Para configuraciones de servidor más complejas que requieren múltiples NICs:

#### Adaptadores USB a Ethernet
- **Chipsets recomendados**: Realtek RTL8153, AX88179
- **Opciones de velocidad**: 1Gbps o 2.5Gbps disponibles
- **Compatibilidad**: Excelente con Linux, requiere instalación de controladores en Windows Server
- **Limitaciones**: Menor rendimiento que las NICs internas, usa ancho de banda USB

#### Adaptadores de Red Thunderbolt
- **Ventajas**: Rendimiento casi nativo, múltiples puertos disponibles
- **Modelos recomendados**: CalDigit, OWC, Sonnet
- **Configuración**: Se pueden usar para servicios dedicados o VLANs
- **Consideraciones**: Mayor costo, puede requerir alimentación externa

### Conectividad Inalámbrica

Aunque las conexiones por cable son preferidas para servidores, hay opciones inalámbricas disponibles:

#### Configuración Wi-Fi
- **Estándares**: Wi-Fi 6/6E (802.11ax) integrado en la mayoría de los NUC recientes
- **Casos de uso**: Conectividad secundaria, redes aisladas
- **Seguridad**: Cifrado WPA3, filtrado MAC, VLANs aisladas
- **Limitaciones**: No recomendado como conexión principal del servidor

#### Bluetooth
- **Disponibilidad**: Integrado en todos los NUC modernos
- **Casos de uso**: Limitado para servidores, posiblemente para sensores o conectividad de periféricos
- **Compatibilidad**: Puede no funcionar en entornos de sistemas operativos de servidor
- **Recomendación**: Desactivar en BIOS si no es necesario

### Consideraciones de Seguridad de Red

#### Configuración del Firewall
1. **Habilita el firewall del sistema operativo** con política de denegación por defecto
2. **Abre solo los puertos requeridos** para servicios específicos
3. **Implementa limitación de tasa** para SSH y servicios web
4. **Registra todos los intentos de conexión** para monitoreo
5. **Auditoría regular** de puertos y servicios abiertos

#### Segregación VLAN (Avanzado)
- **VLAN separada** para acceso de administración
- **VLAN dedicada** para servicios expuestos
- **VLAN interna** para comunicación entre servidores
- **Requisitos**: Switch compatible con VLAN, configuración adecuada del router

## Energía y Redundancia de Red

### Opciones de Redundancia de Energía
- **Múltiples unidades UPS** para instalaciones críticas
- **Monitoreo de energía** y alertas
- **Ventanas de mantenimiento programadas** para actualizaciones
- **Reinicio automático** después de un corte de energía (configuración de BIOS)

### Opciones de Redundancia de Red
- **Configuración de doble NIC** con bonding/teaming
- **Conexión ISP secundaria** para servicios críticos
- **Scripts de failover** para monitoreo de conexión
- **Monitoreo de red** con capacidades de alertas

## Mejores Prácticas de Implementación

### Cableado y Organización
- **Cables CAT6/6A de calidad** para todas las conexiones por cable
- **Gestión adecuada de cables** para prevenir desconexiones
- **Cables etiquetados** para fácil identificación
- **Alivio de tensión** para todas las conexiones
- **Ventilación adecuada** alrededor del equipo

### Documentación
- **Diagrama de red** que muestre todas las conexiones
- **Inventario de direcciones IP** con direcciones MAC
- **Catálogo de servicios** que mapee servicios a puertos
- **Procedimientos de mantenimiento** para tareas comunes
- **Copia de seguridad de configuraciones** para todos los dispositivos de red

### Configuración de Monitoreo
- **Implementa Prometheus/Grafana** para monitoreo
- **Monitoreo SNMP** de equipos de red
- **Seguimiento del consumo de energía**
- **Monitoreo de temperatura** para todos los componentes
- **Monitoreo de uso de disco y SMART**

## Consideraciones Específicas por Plataforma

### YunoHost
- **Red**: Requiere conexión directa al router para DHCP/DNS adecuado
- **Almacenamiento**: Mínimo 32GB para el sistema, partición de datos separada recomendada
- **Energía**: La configuración estándar funciona bien, se recomienda UPS

### CasaOS
- **Red**: Funciona bien con la configuración estándar
- **Almacenamiento**: Se recomiendan discos separados para sistema y datos
- **Energía**: Muy eficiente, incluso un UPS básico es suficiente

### Caprover
- **Red**: Se requiere reenvío de puertos 80, 443, 3000
- **Almacenamiento**: SSD fuertemente recomendado para el rendimiento de contenedores
- **Energía**: Configuración estándar, se recomienda UPS para producción

## Solución de Problemas Comunes

### Problemas de Red
- **Sin conectividad**: Verifica las conexiones físicas y la instalación de controladores
- **Problemas de controladores**: A menudo se requiere instalación manual en sistemas operativos de servidor
- **Fallo de Wake-on-LAN**: Verifica que la configuración de BIOS y del sistema operativo coincida
- **Rendimiento lento**: Actualiza los controladores, verifica QoS/limitación de velocidad

### Problemas de Almacenamiento
- **No detectado**: Verifica la configuración de BIOS y la instalación física
- **Rendimiento lento**: Verifica la limitación térmica y las actualizaciones de firmware
- **Preocupaciones de confiabilidad**: Ejecuta pruebas SMART, verifica el firmware
- **Limitaciones de capacidad**: Considera opciones de expansión externa

### Problemas de Energía
- **Apagados inesperados**: Verifica la capacidad de la fuente de alimentación y el funcionamiento del UPS
- **No enciende**: Verifica las conexiones y la salida del adaptador de corriente
- **Preocupaciones de eficiencia energética**: Actualiza la gestión de energía de BIOS
- **Problemas relacionados con el calor**: Mejora la ventilación, limpia el sistema de refrigeración

## Ruta de Actualización y Expansión

### Consideraciones de Preparación para el Futuro
- **Comienza con componentes de calidad**: Prioriza la confiabilidad sobre la capacidad
- **Planifica la expansión**: Considera opciones externas desde el principio
- **Mantenimiento regular**: Actualizaciones de firmware y controladores
- **Monitoreo**: Implementa un monitoreo adecuado desde el inicio

### Opciones de Actualización
- **Memoria**: La RAM máxima proporciona la mayor vida útil
- **Almacenamiento**: Comienza con NVMe de calidad, expande con opciones externas
- **Red**: Considera Thunderbolt para capacidades de expansión
- **Servicios**: Contenedorización para fácil migración a nuevo hardware

---

**Próximos Pasos:**
- Completa la configuración de BIOS: [nuc-bios-setup.md](nuc-bios-setup.md)
- Revisa los detalles específicos por modelo: [nuc-models-comparison.md](nuc-models-comparison.md)

*Siempre verifica las recomendaciones específicas con las especificaciones exactas de tu modelo de NUC antes de comprar.*