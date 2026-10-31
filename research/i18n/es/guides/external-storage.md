---
title: Almacenamiento externo
sourcePath: guides/external-storage.md
sourceHash: 32d256e985b282f9
translatedBy: glm-4.6
---

# Guía de Almacenamiento Externo para la Expansión de Servidores Comunitarios

Esta guía cubre la conexión, el formateo y el montaje de dispositivos de almacenamiento adicionales (USB, SATA, SSD) para expandir la capacidad y mejorar la resiliencia de los datos en despliegues de servidores comunitarios.

## Entendiendo las Opciones de Almacenamiento Externo

El almacenamiento externo proporciona capacidades cruciales para los servidores comunitarios:

- **Expansión de Capacidad**: Agregar almacenamiento sin reemplazar las unidades existentes
- **Redundancia de Datos**: Crear copias de respaldo en dispositivos físicos separados
- **Mejora del Rendimiento**: Usar SSDs para cargas de trabajo de alto rendimiento
- **Arquitectura Modular**: Agregar y quitar almacenamiento fácilmente a medida que cambian las necesidades

### Tipos de Conexión de Almacenamiento

| Tipo de Conexión | Velocidad | Mejor Caso de Uso | Compatibilidad |
|----------------|-------|---------------|---------------|
| USB 3.0/3.1 | 5-10 Gbps | Unidades de respaldo, almacenamiento portátil | Universal |
| USB-C | Hasta 40 Gbps | SSDs externos de alta velocidad | Sistemas modernos |
| eSATA | 6 Gbps | Almacenamiento externo permanente | Sistemas de escritorio |
| Thunderbolt | Hasta 40 Gbps | Cargas de trabajo profesionales | Mac/PC de gama alta |
| SATA Interno | 6 Gbps | Expansión de almacenamiento principal | Escritorio/servidor |

## Preparación Previa a la Conexión

### Inventario del Almacenamiento Actual

Antes de agregar almacenamiento externo, documente su configuración actual:

```bash
# List all block devices
lsblk

# Show disk usage
df -h

# Display detailed disk information
sudo fdisk -l
```

### Verificación de Puertos Disponibles

Identifique los puertos de conexión disponibles:
- Puertos USB 3.0+ (típicamente conectores azules)
- Puertos eSATA
- Conexiones SATA internas
- Requisitos de energía para unidades de 3.5"

> **⚠️ Requisitos de Energía**
> 
> Las unidades SATA de 3.5" requieren conexiones de energía separadas. Las unidades de 2.5" generalmente pueden alimentarse mediante USB. Planifique su infraestructura de energía en consecuencia.

## Paso 1: Conexión Física

### Conexión de Unidad USB

1. **Ubique el puerto USB apropiado** (se recomienda USB 3.0+ para un mejor rendimiento)
2. **Conecte la unidad** asegurándose de que la conexión sea firme
3. **Para adaptadores USB-SATA**: Conecte tanto el cable USB como el de energía si es necesario
4. **Espere el reconocimiento** (típicamente 5-10 segundos)

### Conexión de Unidad SATA

Para conexiones SATA internas:

1. **Apague completamente el sistema**
2. **Conecte el cable de datos SATA** al puerto SATA de la placa base
3. **Conecte el cable de energía SATA** desde la fuente de alimentación
4. **Fije la unidad en el soporte de montaje** si es una instalación permanente
5. **Encienda y verifique en BIOS/UEFI** el reconocimiento de la unidad

### Verificación de la Conexión Física

```bash
# Check system messages for new device
dmesg | tail -20

# List all SCSI/SATA devices
lsscsi

# Monitor real-time device detection
sudo tail -f /var/log/syslog
```

## Paso 2: Detección e Identificación de la Unidad

### Detección Automática

La mayoría de los sistemas Linux detectan automáticamente los nuevos dispositivos de almacenamiento:

```bash
# List all block devices with file system info
lsblk -f

# Show all storage devices
sudo fdisk -l

# Display device information by ID
ls -la /dev/disk/by-id/
```

### Escaneo Manual de Dispositivos

Si la detección automática falla:

```bash
# Rescan SCSI devices
echo "- - -" | sudo tee /sys/class/scsi_host/host*/scan

# Rescan specific SCSI host (replace X with host number)
echo "1" | sudo tee /sys/class/block/sdX/device/rescan
```

### Identificación de Su Nueva Unidad

Busque el nuevo dispositivo en la salida:

```bash
# Example output showing new USB drive
$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   10G  0 disk 
├─sda1   8:1    0    1G  0 part /boot
└─sda2   8:2    0    9G  0 part /
sdb      8:16   1  7.4G  0 disk  ← New USB drive
```

## Paso 3: Preparación y Formateo de la Unidad

### Verificación del Sistema de Archivos Existente

Antes de formatear, verifique si la unidad ya contiene datos:

```bash
# Check for existing file systems
sudo blkid /dev/sdb

# Attempt to identify file system type
sudo file -s /dev/sdb1
```

### Creación de la Tabla de Particiones (si es necesario)

Para unidades completamente nuevas:

```bash
# Create GPT partition table (recommended for drives >2TB)
sudo parted /dev/sdb mklabel gpt

# Or create MBR partition table (for compatibility)
sudo parted /dev/sdb mklabel msdos
```

### Creación de Particiones

#### Usando parted (recomendado)

```bash
# Start parted on the new drive
sudo parted /dev/sdb

# Create a single partition using all available space
(parted) mkpart primary ext4 0% 100%

# Exit parted
(parted) quit
```

#### Usando fdisk

```bash
# Start fdisk
sudo fdisk /dev/sdb

# Create new partition (n), primary (p), partition 1, accept defaults
# Write changes (w)
```

### Formateo de la Partición

Elija el sistema de archivos apropiado según sus necesidades:

#### ext4 (Recomendado para Linux)

```bash
# Format with ext4 file system
sudo mkfs.ext4 /dev/sdb1

# Format with label for easy identification
sudo mkfs.ext4 -L "backup-storage" /dev/sdb1
```

#### NTFS (para compatibilidad con Windows)

```bash
# Install NTFS tools if not available
sudo apt install ntfs-3g

# Format with NTFS
sudo mkfs.ntfs -f -L "shared-storage" /dev/sdb1
```

#### exFAT (compatibilidad multiplataforma)

```bash
# Install exFAT tools
sudo apt install exfat-fuse exfat-utils

# Format with exFAT
sudo mkfs.exfat -n "portable-storage" /dev/sdb1
```

### Verificación del Formateo

```bash
# Check the new file system
sudo blkid /dev/sdb1

# Verify file system integrity
sudo fsck /dev/sdb1
```

## Paso 4: Montaje del Almacenamiento Externo

### Creación del Punto de Montaje

```bash
# Create directory for mount point
sudo mkdir -p /mnt/external-storage

# Or use a more descriptive path
sudo mkdir -p /srv/backup-storage
```

### Montaje Temporal

Para pruebas o acceso temporal:

```bash
# Mount the drive
sudo mount /dev/sdb1 /mnt/external-storage

# Verify mount
df -h | grep external-storage

# Check mount details
mount | grep sdb1
```

### Montaje Permanente

Para el montaje automático al arrancar, edite `/etc/fstab`:

#### Obtener el UUID de la Unidad

```bash
# Find the UUID of your partition
sudo blkid /dev/sdb1
# Output: /dev/sdb1: UUID="12345678-1234-1234-1234-123456789012" TYPE="ext4" LABEL="backup-storage"
```

#### Editar fstab

```bash
# Backup current fstab
sudo cp /etc/fstab /etc/fstab.backup

# Edit fstab
sudo nano /etc/fstab
```

Agregue una línea para su nueva unidad:

```
# External backup storage
UUID=12345678-1234-1234-1234-123456789012 /srv/backup-storage ext4 defaults,nofail 0 2
```

#### Opciones de fstab Explicadas

- `defaults`: Usar las opciones de montaje predeterminadas
- `nofail`: No fallar el arranque si falta la unidad
- `0`: No hacer dump de este sistema de archivos
- `2`: Verificar el sistema de archivos después de la partición raíz

#### Probar la Entrada de fstab

```bash
# Test mount all entries in fstab
sudo mount -a

# Verify successful mount
df -h
```

## Paso 5: Configuración de Permisos y Propiedad

### Permisos Básicos

```bash
# Set appropriate ownership
sudo chown -R $USER:$USER /srv/backup-storage

# Set permissions for user access
sudo chmod 755 /srv/backup-storage
```

### Acceso Basado en Grupos

Para entornos de servidor multiusuario:

```bash
# Create a group for storage access
sudo groupadd storage-users

# Add users to the group
sudo usermod -a -G storage-users username1
sudo usermod -a -G storage-users username2

# Set group ownership
sudo chgrp -R storage-users /srv/backup-storage

# Set group write permissions
sudo chmod -R 775 /srv/backup-storage
```

## Opciones de Configuración Avanzada

### Optimización del Rendimiento

#### Opciones de Montaje para SSDs

Para unidades externas SSD, use opciones de montaje optimizadas:

```
UUID=12345678-1234-1234-1234-123456789012 /srv/ssd-storage ext4 defaults,noatime,discard,nofail 0 2
```

- `noatime`: No actualizar los tiempos de acceso (mejora el rendimiento)
- `discard`: Habilitar comandos TRIM para la salud del SSD

#### Programación de E/S

Para unidades externas, considere los planificadores deadline o noop:

```bash
# Check current scheduler
cat /sys/block/sdb/queue/scheduler

# Set deadline scheduler for external drive
echo deadline | sudo tee /sys/block/sdb/queue/scheduler
```

### Configuración de Cifrado

Para datos sensibles, use el cifrado LUKS:

```bash
# Install encryption tools
sudo apt install cryptsetup

# Create encrypted container
sudo cryptsetup luksFormat /dev/sdb1

# Open encrypted device
sudo cryptsetup luksOpen /dev/sdb1 encrypted-storage

# Format the encrypted device
sudo mkfs.ext4 /dev/mapper/encrypted-storage

# Mount encrypted device
sudo mkdir /mnt/encrypted-storage
sudo mount /dev/mapper/encrypted-storage /mnt/encrypted-storage
```

## Monitoreo de la Salud de la Unidad

### Monitoreo S.M.A.R.T.

```bash
# Install smartmontools
sudo apt install smartmontools

# Check drive health
sudo smartctl -H /dev/sdb

# Full S.M.A.R.T. information
sudo smartctl -a /dev/sdb

# Run short self-test
sudo smartctl -t short /dev/sdb
```

### Verificaciones Regulares de Salud

Cree un script de monitoreo:

```bash
#!/bin/bash
# External drive health check script

DRIVE="/dev/sdb"
LOG_FILE="/var/log/external-drive-health.log"

echo "$(date): Checking drive health for $DRIVE" >> $LOG_FILE
sudo smartctl -H $DRIVE >> $LOG_FILE 2>&1

# Check mount status
if mountpoint -q /srv/backup-storage; then
    echo "$(date): Drive mounted successfully" >> $LOG_FILE
else
    echo "$(date): WARNING - Drive not mounted" >> $LOG_FILE
fi
```

## Estrategias de Respaldo y Redundancia

### Scripts de Respaldo Automatizados

```bash
#!/bin/bash
# Simple backup script for external storage

SOURCE_DIR="/srv/data"
BACKUP_DIR="/srv/backup-storage/daily-backup"
DATE=$(date +%Y%m%d)

# Create dated backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Perform incremental backup using rsync
rsync -av --link-dest="$BACKUP_DIR/latest" \
      "$SOURCE_DIR/" "$BACKUP_DIR/$DATE/"

# Update latest symlink
ln -nfs "$DATE" "$BACKUP_DIR/latest"

echo "Backup completed: $(date)" >> /var/log/backup.log
```

### Configuración de RAID

Para múltiples unidades externas, considere RAID por software:

```bash
# Install mdadm
sudo apt install mdadm

# Create RAID 1 mirror with two drives
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1

# Format and mount RAID array
sudo mkfs.ext4 /dev/md0
sudo mkdir /srv/raid-storage
sudo mount /dev/md0 /srv/raid-storage
```

## Solución de Problemas Comunes

### Unidad No Detectada

1. **Verifique las conexiones físicas**
2. **Verifique la fuente de alimentación** (especialmente para unidades de 3.5")
3. **Pruebe un puerto USB diferente** o cable
4. **Revise los registros del sistema**:
   ```bash
   dmesg | grep -i error
   sudo journalctl -f
   ```

### Fallos de Montaje

```bash
# Check file system errors
sudo fsck /dev/sdb1

# Force mount with specific type
sudo mount -t ext4 /dev/sdb1 /mnt/external-storage

# Check for conflicting mounts
mount | grep sdb1
```

### Problemas de Permisos

```bash
# Fix ownership issues
sudo chown -R $USER:$USER /mnt/external-storage

# Check SELinux contexts (if applicable)
ls -Z /mnt/external-storage
```

### Problemas de Rendimiento

```bash
# Check I/O statistics
iostat 5

# Monitor disk usage
iotop

# Test read/write performance
sudo hdparm -tT /dev/sdb
```

## Consideraciones de Seguridad

### Control de Acceso

1. **Limite los puntos de montaje** solo a los directorios necesarios
2. **Use la opción noexec** para particiones de solo datos
3. **Auditorías regulares de permisos**:
   ```bash
   find /srv/backup-storage -type f -perm 777
   ```

### Protección de Datos

1. **Cifre el almacenamiento externo sensible**
2. **Verificación regular de los respaldos**
3. **Eliminación segura** de unidades antiguas
4. **Registro de accesos**:
   ```bash
   # Monitor file access
   tail -f /var/log/audit/audit.log | grep external-storage
   ```

## Integración con Servicios del Servidor

### Integración con el Servidor Web

```bash
# Create web-accessible storage directory
sudo mkdir -p /srv/backup-storage/web-data
sudo chown -R www-data:www-data /srv/backup-storage/web-data

# Add to web server configuration
# Apache example:
# Alias /backup-data /srv/backup-storage/web-data
```

### Almacenamiento de Base de Datos

```bash
# Stop database service
sudo systemctl stop mysql

# Move data directory to external storage
sudo mv /var/lib/mysql /srv/backup-storage/mysql-data

# Create symlink
sudo ln -s /srv/backup-storage/mysql-data /var/lib/mysql

# Restart database
sudo systemctl start mysql
```

## Calendario de Mantenimiento

### Tareas Diarias

- Monitorear el estado de montaje
- Verificar el espacio disponible
- Revisar los registros del sistema en busca de errores

### Tareas Semanales

- Ejecutar verificaciones del sistema de archivos
- Verificar la integridad de los respaldos
- Actualizar la documentación de uso

### Tareas Mensuales

- Ejecutar pruebas S.M.A.R.T.
- Revisar las métricas de rendimiento
- Planificar la expansión de capacidad

## Integración con Otras Guías

Esta configuración de almacenamiento externo complementa otras tareas de gestión del servidor:

- **Después de la Instalación del SO**: Siga [etcher-guide.md](etcher-guide.md) para la configuración inicial del sistema
- **Antes de la Configuración del Almacenamiento**: Complete [disk-partitioning.md](disk-partitioning.md) para la distribución principal del sistema
- **Refuerzo de Seguridad**: Implemente controles de acceso y cifrado
- **Integración de Monitoreo**: Agregue métricas de almacenamiento al monitoreo del servidor

## Conclusión

La expansión de almacenamiento externo es crucial para el crecimiento de los despliegues de servidores comunitarios. Una planificación, configuración y mantenimiento adecuados garantizan un funcionamiento confiable y la protección de los datos. Priorice siempre la seguridad de los datos mediante la redundancia, el monitoreo y procedimientos de mantenimiento regulares.

El enfoque modular del almacenamiento externo permite que los servidores comunitarios escalen eficientemente manteniendo la conciencia presupuestaria y la simplicidad operativa.