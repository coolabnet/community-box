---
title: Verificación de Compatibilidad
sourcePath: guides/hardware-compatibility-check.md
sourceHash: 19c6e673b1561c82
translatedBy: glm-4.6
---

# Guía de Verificación de Compatibilidad de Hardware para Servidores Reciclados

## Descripción General

Esta guía proporciona procedimientos completos para verificar y probar la compatibilidad de componentes en computadoras recicladas antes de desplegarlas como servidores comunitarios. Una prueba de compatibilidad adecuada previene problemas de despliegue y garantiza un funcionamiento estable.

## Preparación Prevía a las Pruebas

### Lista de Verificación de Evaluación Inicial
- [ ] Documentar todos los componentes de hardware visibles
- [ ] Tomar fotos de la configuración actual
- [ ] Registrar números de modelo y números de serie
- [ ] Revisar daños físicos evidentes
- [ ] Verificar que todos los cables y conexiones estén presentes
- [ ] Asegurar un espacio de trabajo adecuado y herramientas disponibles

### Herramientas y Software Requeridos
- **Herramientas de Hardware**:
  - Juego de destornilladores Phillips
  - Pulsera antiestática
  - Multímetro digital
  - Aire comprimido en lata
  - Pasta térmica (si es necesario)
  - Componentes de repuesto en buen estado para pruebas

- **Herramientas de Software**:
  - USB booteable con herramientas de diagnóstico
  - CPU-Z para identificación de componentes
  - MemTest86+ para pruebas de RAM
  - CrystalDiskInfo para salud del almacenamiento
  - Prime95 o software de pruebas de estrés
  - Utilidades de diagnóstico del fabricante del hardware

## Verificación de Compatibilidad de CPU

### Compatibilidad de Socket y Chipset
1. **Identificar la CPU Actual**:
   - Usar CPU-Z para identificar el modelo exacto
   - Verificar el tipo de socket (LGA1151, AM4, etc.)
   - Verificar la compatibilidad del chipset

2. **Revisar Opciones de Actualización**:
   ```
   Search Format: "[Motherboard Model] CPU compatibility list"
   Example: "Dell OptiPlex 7050 supported CPU list"
   ```

3. **Verificación de Soporte de BIOS**:
   - Revisar la versión actual del BIOS
   - Verificar si la CPU requiere una actualización del BIOS
   - Descargar el último BIOS del fabricante

### Procedimiento de Prueba de CPU
```bash
# Basic CPU Information
lscpu                    # Linux command
wmic cpu get name        # Windows command

# Stress Testing
prime95                  # Run for 30 minutes minimum
stress -c 4 -t 1800     # Linux stress test
```

### Validación de Rendimiento
- [ ] Todos los núcleos detectados correctamente
- [ ] Frecuencias de operación dentro de especificación
- [ ] Temperatura por debajo de 80°C bajo carga
- [ ] Sin throttling térmico detectado
- [ ] Funciones de virtualización habilitadas (si es necesario)

## Pruebas de Compatibilidad de Memoria (RAM)

### Verificación de Especificaciones de Memoria

| Factor | Método de Verificación | Requisitos |
|--------|--------------|--------------|
| Tipo | Inspección física/CPU-Z | DDR3/DDR4 que coincida con la placa base |
| Velocidad | Configuración BIOS/UEFI | Compatible con CPU y placa base |
| Capacidad | Propiedades del sistema | Dentro del máximo de la placa base |
| Timing | Pruebas de estrés de memoria | Estable a las velocidades nominales |
| ECC | Documentación del hardware | Compatible con soporte ECC de la placa base |

### Protocolo de Pruebas de Memoria

#### Paso 1: Prueba Básica de Reconocimiento
```bash
# Linux Memory Detection
free -h
cat /proc/meminfo
dmidecode --type memory

# Windows Memory Detection
wmic memorychip get capacity,speed,memorytype
```

#### Paso 2: Prueba Integral de Memoria
1. **Iniciar MemTest86+** desde la unidad USB
2. **Ejecutar ciclos de prueba completos** (mínimo 2 pasadas)
3. **Probar cada módulo individualmente** si ocurren errores
4. **Probar diferentes combinaciones de ranuras**

#### Paso 3: Prueba de Memoria del Sistema Operativo
```bash
# Windows Memory Diagnostic
mdsched.exe

# Linux Memory Test
memtester 1024M 5    # Test 1GB, 5 iterations
```

### Matriz de Compatibilidad de Memoria

| Generación de Placa Base | Tipos Compatibles | Capacidad Máxima | Velocidades |
|----------------------|----------------|--------------|---------|
| Intel 6.ª-8.ª Gen | DDR4 | 32-64 GB | 2133-2666 MHz |
| Intel 4.ª-5.ª Gen | DDR3/DDR3L | 16-32 GB | 1333-1600 MHz |
| AMD AM4 | DDR4 | 64-128 GB | 2133-3200 MHz |
| AMD FM2+ | DDR3 | 32 GB | 1333-2133 MHz |

## Evaluación de Compatibilidad de Almacenamiento

### Verificación de Compatibilidad de Interfaces

#### Compatibilidad SATA
```bash
# Check SATA mode (AHCI/IDE)
dmesg | grep -i sata
lspci | grep -i sata

# Windows SATA information
devmgmt.msc (Device Manager > IDE ATA/ATAPI controllers)
```

#### Compatibilidad NVMe
- **Requisitos**: Ranura M.2 PCIe 3.0+ con soporte NVMe
- **Configuración del BIOS**: Modo NVMe habilitado
- **Soporte de Arranque**: Firmware UEFI con capacidad de arranque NVMe

### Procedimientos de Prueba de Almacenamiento

#### Evaluación de Salud
1. **Verificar la Salud de la Unidad**:
   ```bash
   # Linux
   smartctl -a /dev/sda
   hdparm -I /dev/sda
   
   # Windows
   wmic diskdrive get status
   chkdsk C: /f
   ```

2. **Pruebas de Rendimiento**:
   ```bash
   # Sequential Read/Write Test
   dd if=/dev/zero of=/tmp/testfile bs=1G count=1 oflag=direct
   dd if=/tmp/testfile of=/dev/null bs=1G count=1 iflag=direct
   
   # Windows (using CrystalDiskMark)
   crystaldiskmark.exe
   ```

### Matriz de Compatibilidad de Almacenamiento

| Interfaz | Velocidad | Hot-Swap | Soporte de Arranque | Uso Recomendado |
|-----------|--------|----------|--------------|-----------------|
| SATA III | 6 Gbps | Sí* | Sí | Almacenamiento principal |
| SATA II | 3 Gbps | Sí* | Sí | Almacenamiento secundario |
| NVMe | 32 Gbps | No | Sí** | Unidad de arranque/sistema |
| USB 3.0 | 5 Gbps | Sí | Limitado | Externo/respaldo |

*Requiere chasis con capacidad de hot-swap
**Requiere firmware UEFI

## Pruebas de Componentes de Red

### Verificación del Controlador Ethernet
```bash
# Linux Network Interface Check
ip link show
ethtool eth0
lspci | grep -i ethernet

# Windows Network Adapter Check
ipconfig /all
devmgmt.msc (Network adapters)
```

### Pruebas de Rendimiento de Red
1. **Verificación de Velocidad de Enlace**:
   ```bash
   # Check negotiated speed
   ethtool eth0 | grep Speed
   cat /sys/class/net/eth0/speed
   ```

2. **Pruebas de Rendimiento (Throughput)**:
   ```bash
   # iperf3 network performance test
   iperf3 -s                    # Server mode
   iperf3 -c [server_ip]        # Client mode
   ```

### Compatibilidad Inalámbrica (si aplica)
- **Disponibilidad de Controladores**: Verificar soporte de drivers en Linux/Windows
- **Soporte de Estándares**: 802.11n mínimo (802.11ac preferido)
- **Funciones Empresariales**: Soporte de WPA2-Enterprise, 802.1X

## Compatibilidad de la Fuente de Alimentación

### Cálculo de Requisitos de Energía

| Componente | Consumo Típico | Consumo de Alto Rendimiento |
|-----------|-------------------|-------------------|
| CPU Intel i5 | 65W | 95W |
| CPU Intel i7 | 65W | 125W |
| RAM DDR4 (8GB) | 3W | 5W |
| SSD 2.5" | 2W | 3W |
| HDD 3.5" | 6W | 10W |
| Placa base | 25W | 35W |
| Tarjeta de red | 5W | 10W |

### Protocolo de Pruebas de la PSU
1. **Pruebas de Voltaje**:
   ```bash
   # Check PSU voltages under load
   sensors            # Linux hardware monitoring
   +3.3V: 3.14V - 3.47V (±5%)
   +5V:   4.75V - 5.25V (±5%)
   +12V:  11.40V - 12.60V (±5%)
   ```

2. **Pruebas de Carga**:
   - Ejecutar prueba de estrés en CPU y GPU simultáneamente
   - Monitorear los voltajes durante toda la prueba
   - Verificar la estabilidad del sistema bajo carga máxima

### Requisitos de Compatibilidad de la PSU
- **Potencia**: 150% del consumo máximo calculado
- **Eficiencia**: 80 PLUS Bronze mínimo
- **Conectores**: Coincidir con los requisitos de la placa base y el almacenamiento
- **Factor de Forma**: Compatibilidad ATX/SFX con el chasis

## Compatibilidad de Tarjetas de Expansión

### Verificación de Ranuras PCIe
```bash
# Check available PCIe slots
lspci -vv
lspci | grep -i pci

# Check PCIe versions and lanes
lspci -vvv | grep LnkCap
```

### Pruebas de Tarjetas de Expansión Comunes

#### Tarjetas de Interfaz de Red
- **Compatibilidad de Drivers**: Soporte del sistema operativo
- **Rendimiento**: Gigabit como mínimo
- **Funciones**: Soporte de VLAN, jumbo frames

#### Controladoras de Almacenamiento
- **Soporte RAID**: RAID por hardware vs. software
- **Compatibilidad de Unidades**: Matriz de soporte SATA/SAS
- **Rendimiento**: Pruebas de referencia de IOPs y throughput

## Verificación de Gestión Térmica

### Evaluación del Sistema de Refrigeración
1. **Verificación del Funcionamiento de Ventiladores**:
   ```bash
   # Monitor fan speeds
   sensors
   pwmconfig          # Configure PWM fan control
   ```

2. **Monitoreo de Temperaturas**:
   ```bash
   # Continuous temperature monitoring
   watch sensors
   stress --cpu 4 --timeout 600s  # 10-minute stress test
   ```

### Protocolo de Pruebas Térmicas
- **Temperaturas en Reposo**: < 40°C para la CPU
- **Temperaturas bajo Carga**: < 80°C para la CPU bajo estrés
- **Respuesta de Ventiladores**: Ajuste automático de velocidad según la temperatura
- **Throttling Térmico**: Sin throttling bajo cargas normales de servidor

## Automatización de Pruebas de Compatibilidad

### Script de Detección de Hardware
```bash
#!/bin/bash
# Automated hardware compatibility check

echo "=== Hardware Compatibility Check ==="
echo "Date: $(date)"
echo

echo "=== CPU Information ==="
lscpu | grep -E "(Model name|Architecture|CPU MHz|Core|Thread)"

echo "=== Memory Information ==="
free -h
dmidecode --type memory | grep -E "(Size|Speed|Type):"

echo "=== Storage Information ==="
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
df -h

echo "=== Network Information ==="
ip link show
ethtool eth0 2>/dev/null | grep -E "(Speed|Duplex)"

echo "=== PCIe Information ==="
lspci | grep -E "(VGA|Ethernet|SATA|USB)"

echo "=== Temperature Information ==="
sensors 2>/dev/null || echo "lm-sensors not installed"
```

### Script de Windows PowerShell
```powershell
# Hardware compatibility check for Windows
Write-Host "=== Hardware Compatibility Check ===" -ForegroundColor Green
Write-Host "Date: $(Get-Date)" -ForegroundColor Yellow

Write-Host "`n=== CPU Information ===" -ForegroundColor Green
Get-WmiObject -Class Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed

Write-Host "`n=== Memory Information ===" -ForegroundColor Green
Get-WmiObject -Class Win32_PhysicalMemory | Select-Object Capacity, Speed, MemoryType

Write-Host "`n=== Storage Information ===" -ForegroundColor Green
Get-WmiObject -Class Win32_DiskDrive | Select-Object Model, Size, InterfaceType

Write-Host "`n=== Network Information ===" -ForegroundColor Green
Get-WmiObject -Class Win32_NetworkAdapter | Where-Object {$_.NetEnabled -eq $true} | Select-Object Name, Speed
```

## Documentación de Compatibilidad

### Plantilla de Resultados de Pruebas
```
Hardware Compatibility Test Results
=====================================
Date: ___________
Technician: ___________
System Model: ___________

CPU Compatibility:
[ ] Socket match confirmed
[ ] BIOS support verified
[ ] Stress test passed (30 min)
[ ] All cores operational
Notes: ________________________

Memory Compatibility:
[ ] Type match (DDR3/DDR4)
[ ] Speed supported
[ ] All slots functional
[ ] MemTest86+ passed (2 cycles)
Notes: ________________________

Storage Compatibility:
[ ] Interface supported (SATA/NVMe)
[ ] BIOS boot support
[ ] Health check passed
[ ] Performance adequate
Notes: ________________________

Network Compatibility:
[ ] Driver available
[ ] Gigabit speed confirmed
[ ] Auto-negotiation working
[ ] Cable test passed
Notes: ________________________

Power Supply:
[ ] Wattage adequate
[ ] All voltages stable
[ ] Load test passed
[ ] Efficiency acceptable
Notes: ________________________

Final Assessment:
[ ] All components compatible
[ ] System ready for deployment
[ ] Requires component replacement: ________
[ ] Not suitable for server use

Signature: ___________________
```

## Solución de Problemas Comunes

### Problemas de Compatibilidad de Memoria
**Síntomas**: El sistema no arranca, fallos aleatorios, pantallas azules
**Soluciones**:
- Probar los módulos de memoria individualmente
- Verificar los tipos de memoria compatibles en el manual de la placa base
- Actualizar el BIOS a la última versión
- Ajustar el timing de memoria en el BIOS
- Usar memoria de la QVL (Qualified Vendor List) de la placa base

### Problemas de Compatibilidad de Almacenamiento
**Síntomas**: Unidad no detectada, rendimiento lento, fallos de arranque
**Soluciones**:
- Verificar el modo SATA (AHCI vs IDE) en el BIOS
- Revisar las conexiones de cables y probar diferentes puertos SATA
- Actualizar los controladores de la controladora de almacenamiento
- Habilitar el soporte NVMe en el BIOS para unidades M.2
- Verificar actualizaciones de firmware en los dispositivos de almacenamiento

### Problemas de Compatibilidad de Red
**Síntomas**: Sin conectividad de red, velocidades limitadas, problemas de drivers
**Soluciones**:
- Descargar e instalar los últimos controladores de red
- Revisar las conexiones de cable y puerto
- Probar con un cable de red en buen estado
- Verificar la configuración de red en el BIOS
- Considerar una tarjeta de red adicional si la integrada falla
## Lista de Verificación de Control de Calidad

### Verificación Final de Compatibilidad
- [ ] Todos los componentes correctamente detectados por el sistema operativo
- [ ] Sin conflictos de hardware en el Administrador de dispositivos
- [ ] Sistema estable bajo carga durante más de 24 horas
- [ ] Todas las funciones esperadas operativas
- [ ] El rendimiento cumple con los requisitos mínimos
- [ ] Documentación completa y precisa

### Protocolo de Pruebas de Estrés Prolongado (Burn-in)
1. **Prueba de Estrés de 48 Horas**:
   - CPU: carga al 100% durante 8 horas diarias
   - Memoria: rotación continua de pruebas
   - Almacenamiento: pruebas de ciclos de lectura/escritura
   - Red: pruebas continuas de rendimiento de transferencia

2. **Monitoreo de Temperatura**:
   - Registrar temperaturas durante todo el burn-in
   - Verificar que no haya limitación térmica (thermal throttling)
   - Confirmar el funcionamiento de los ventiladores con varias cargas

3. **Verificación de Estabilidad**:
   - Sin bloqueos ni congelamientos del sistema
   - Sin mensajes de error en los registros del sistema
   - Todos los componentes mantienen su rendimiento nominal

## Próximos Pasos

Después de completar las pruebas de compatibilidad:

1. **Documentar Resultados**: Completar el informe de pruebas de compatibilidad
2. **Preparación Física**: Seguir la guía de [Recycled Preparation](recycled-preparation.md)
3. **Sistema Operativo**: Instalar y configurar el sistema operativo del servidor
4. **Configuración de Servicios**: Desplegar los servicios de servidor previstos

---

*Las pruebas de compatibilidad deben realizarse en un entorno controlado con las precauciones de seguridad adecuadas. Verifique siempre la compatibilidad con el sistema operativo y las aplicaciones de servidor previstas.*