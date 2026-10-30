---
title: Particionamiento
sourcePath: guides/disk-partitioning.md
sourceHash: 09359b725b9a277e
translatedBy: glm-4.6
---

# Guía para principiantes sobre particionamiento de discos para servidores comunitarios

Esta guía completa cubre los fundamentos del particionamiento de discos utilizando herramientas gráficas y de línea de comandos, con recomendaciones específicas para implementaciones de servidores comunitarios.

## Entendiendo el particionamiento de discos

El particionamiento de discos divide un dispositivo de almacenamiento en secciones separadas e independientes llamadas particiones[16]. Cada partición puede tener su propio sistema de archivos y cumple propósitos específicos en entornos de servidores. Un particionamiento adecuado mejora el rendimiento del sistema, simplifica las copias de seguridad y aumenta la seguridad[17].

### ¿Por qué particionar los discos de tu servidor?

1. **Separación de responsabilidades**: Mantén los archivos del sistema separados de los datos de usuarios y registros[17]
2. **Optimización del rendimiento**: Reduce la fragmentación del disco y la contención de E/S[17]
3. **Mejora de la seguridad**: Aísla los datos sensibles y los componentes del sistema
4. **Eficiencia de las copias de seguridad**: Permite copias de seguridad dirigidas de tipos de datos específicos
5. **Tolerancia a fallos**: Evita que una partición llena afecte a todo el sistema[17]

## Distribución de particiones recomendada para servidores comunitarios

`[Partition Layout Example](partition-layout.png)`

### Esquema de particiones estándar

Para la mayoría de las implementaciones de servidores comunitarios, considera esta distribución:

| Partición | Punto de montaje | Tamaño | Sistema de archivos | Propósito |
|-----------|-------------|------|-------------|---------|
| Boot | `/boot` | 1GB | ext4 | Archivos del gestor de arranque y kernels |
| Root | `/` | 20-50GB | ext4 | Archivos del sistema y aplicaciones |
| Var | `/var` | 10-20GB | ext4 | Datos variables, archivos temporales |
| Var Log | `/var/log` | 5-10GB | ext4 | Registros del sistema y aplicaciones[17] |
| Home | `/home` | 10-50GB | ext4 | Directorios de usuarios |
| Tmp | `/tmp` | 2-5GB | ext4 | Archivos temporales[17] |
| Data | `/srv` o `/data` | Espacio restante | ext4 | Datos de aplicaciones y servicios |
| Swap | N/A | 1-2x RAM | swap | Memoria virtual |

> **💡 Mejor práctica**
> 
> Separar `/var/log` de `/var` evita que los archivos de registro llenen toda la partición `/var` y afecten la estabilidad del sistema[17].

## Método 1: Particionamiento gráfico con GParted

GParted (GNOME Partition Editor) proporciona una interfaz intuitiva para gestionar particiones de disco[9].

### Instalación de GParted

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install gparted
```

**CentOS/RHEL/Fedora:**
```bash
sudo dnf install gparted  # Fedora
sudo yum install gparted  # CentOS/RHEL
```

### Uso de GParted

#### Paso 1: Iniciar GParted

1. Abre GParted desde el menú de aplicaciones o ejecuta:
   ```bash
   sudo gparted
   ```
2. Ingresa tu contraseña de administrador cuando se solicite
3. GParted escaneará todos los dispositivos de almacenamiento disponibles

`[GParted In Use](gparted-screenshot.png)`

#### Paso 2: Seleccionar el disco de destino

1. Usa el menú desplegable en la esquina superior derecha para seleccionar el disco de destino
2. **Verifica el tamaño y modelo del disco** para asegurarte de estar trabajando con el dispositivo correcto
3. Revisa las particiones existentes mostradas en el esquema gráfico

> **⚠️ Advertencia crítica**
> 
> Siempre verifica que hayas seleccionado el disco correcto. Las operaciones de particionamiento destruirán los datos existentes.

#### Paso 3: Crear tabla de particiones (si es necesario)

Para discos nuevos:
1. Ve a **Dispositivo** → **Crear tabla de particiones**
2. Selecciona **GPT** para discos mayores de 2TB o sistemas modernos
3. Selecciona **MBR (msdos)** para compatibilidad con sistemas más antiguos[13]
4. Haz clic en **Aplicar**

#### Paso 4: Crear nuevas particiones

1. Haz clic derecho en el espacio sin asignar
2. Selecciona **Nueva**
3. Configura las opciones de la partición:
   - **Tamaño**: Especifica el tamaño de la partición en MB o GB
   - **Crear como**: Elige Primaria, Extendida o Lógica
   - **Sistema de archivos**: Selecciona ext4 para particiones Linux
   - **Etiqueta**: Añade etiquetas descriptivas (por ejemplo, "server-root", "data-storage")
4. Haz clic en **Añadir** para poner en cola la operación

#### Paso 5: Aplicar los cambios

1. Revisa todas las operaciones en cola en la lista de operaciones pendientes
2. Haz clic en **Aplicar** para ejecutar todos los cambios
3. Confirma la operación cuando se solicite
4. Espera a que finalice (esto puede tardar varios minutos en particiones grandes)

### Operaciones avanzadas de GParted

#### Redimensionar particiones existentes

1. Haz clic derecho en la partición a redimensionar
2. Selecciona **Redimensionar/Mover**
3. Arrastra los límites de la partición o ingresa tamaños específicos
4. Aplica los cambios

#### Mover particiones

Usa el diálogo **Redimensionar/Mover** para cambiar la ubicación de las particiones en el disco[11]. Esto es útil para consolidar espacio libre.

## Método 2: Particionamiento por línea de comandos

Las herramientas de línea de comandos ofrecen más control y capacidades de automatización para implementaciones de servidores.

### Uso de fdisk

`fdisk` es una poderosa herramienta de particionamiento por línea de comandos disponible en todos los sistemas Linux[14][16].

#### Paso 1: Identificar el disco de destino

```bash
sudo fdisk -l
```

Este comando lista todos los discos y sus particiones actuales[14]. Identifica tu disco de destino (por ejemplo, `/dev/sdb`).

#### Paso 2: Iniciar fdisk

```bash
sudo fdisk /dev/sdb
```

Reemplaza `/dev/sdb` con tu disco de destino[14].

#### Paso 3: Crear particiones

Dentro del indicador de fdisk:

1. **Crear nueva partición**: Escribe `n`
2. **Seleccionar tipo de partición**: 
   - `p` para partición primaria
   - `e` para partición extendida[14]
3. **Elegir número de partición**: Acepta el valor predeterminado o especifícalo (1-4 para primarias)
4. **Establecer primer sector**: Acepta el valor predeterminado para una alineación óptima
5. **Establecer último sector**: Especifica el tamaño usando el formato `+20G` para una partición de 20GB[14]

#### Paso 4: Establecer el tipo de partición

1. Escribe `t` para cambiar el tipo de partición
2. Selecciona el número de partición
3. Ingresa el código de tipo:
   - `83` para Linux (ext4)
   - `82` para Linux swap
   - `8e` para Linux LVM[26]

#### Paso 5: Escribir los cambios

1. Escribe `p` para previsualizar la tabla de particiones
2. Escribe `w` para escribir los cambios y salir[14]

### Uso de parted

`parted` ofrece características más avanzadas y soporta tablas de particiones GPT[16].

#### Uso básico de parted

```bash
# Start parted on target drive
sudo parted /dev/sdb

# Create GPT partition table
(parted) mklabel gpt

# Create partitions
(parted) mkpart primary ext4 0% 20GB
(parted) mkpart primary ext4 20GB 40GB
(parted) mkpart primary linux-swap 40GB 42GB

# Exit parted
(parted) quit
```

## Formatear nuevas particiones

Después de crear las particiones, formatéalas con los sistemas de archivos apropiados[23].

### Formatear particiones ext4

```bash
# Format with ext4
sudo mkfs.ext4 /dev/sdb1

# Format with label
sudo mkfs.ext4 -L "server-root" /dev/sdb1
```

### Crear partición swap

```bash
# Format swap partition
sudo mkswap /dev/sdb3

# Enable swap
sudo swapon /dev/sdb3
```

### Verificar el formateo

```bash
# Check file system information
sudo blkid /dev/sdb1

# List all block devices
lsblk -f
```

## Montar particiones

### Montaje temporal

```bash
# Create mount point
sudo mkdir /mnt/server-data

# Mount partition
sudo mount /dev/sdb2 /mnt/server-data
```

### Montaje permanente

Edita `/etc/fstab` para el montaje automático al arrancar:

```bash
sudo nano /etc/fstab
```

Añade entradas usando UUID para mayor confiabilidad:

```
UUID=12345678-1234-1234-1234-123456789012 /srv ext4 defaults 0 2
UUID=87654321-4321-4321-4321-210987654321 none swap sw 0 0
```

Obtén los UUIDs con:
```bash
sudo blkid
```

## Recomendaciones específicas por plataforma

### Servidores Raspberry Pi

- **Partición Boot**: 256MB FAT32 para el firmware
- **Partición Root**: mínimo 8-16GB ext4
- **Usa tarjeta SD para arranque, SSD USB para datos** cuando sea posible

### Servidores comunitarios x86

- **Partición de Sistema EFI**: 512MB FAT32 para sistemas UEFI
- **Partición Boot**: 1GB ext4
- **Considera LVM** para una gestión flexible del almacenamiento[17]

### Servidores basados en ARM

- Consulta la documentación del fabricante para requisitos específicos de particionamiento
- Puede requerir particiones de arranque o secciones de firmware especiales

## Gestión de Volúmenes Lógicos (LVM)

LVM proporciona capacidades avanzadas de gestión del almacenamiento[17][24].

### Beneficios de LVM

1. **Redimensionamiento dinámico**: Ampliar o reducir volúmenes lógicos según sea necesario[24]
2. **Agrupación de almacenamiento**: Combinar múltiples discos físicos[17]
3. **Instantáneas**: Crear copias de seguridad en un punto en el tiempo
4. **Striping**: Mejorar el rendimiento a través de múltiples discos

### Configuración básica de LVM

```bash
# Install LVM tools
sudo apt install lvm2

# Create physical volume
sudo pvcreate /dev/sdb1

# Create volume group
sudo vgcreate server-vg /dev/sdb1

# Create logical volumes
sudo lvcreate -L 20G -n root server-vg
sudo lvcreate -L 10G -n var server-vg
sudo lvcreate -l 100%FREE -n data server-vg

# Format logical volumes
sudo mkfs.ext4 /dev/server-vg/root
sudo mkfs.ext4 /dev/server-vg/var
sudo mkfs.ext4 /dev/server-vg/data
```

## Errores comunes de particionamiento a evitar

### Problemas relacionados con el tamaño

- **Partición root demasiado pequeña**: Mínimo 20GB, preferiblemente 30-50GB
- **Sin espacio swap**: Siempre incluye swap, incluso con RAM abundante
- **Partición boot sobredimensionada**: 1GB suele ser suficiente

### Elección de sistemas de archivos

- **Usar FAT32 para sistemas Linux**: Usa ext4 para mejor rendimiento y características
- **Tipos de partición incorrectos**: Asegúrate de usar los códigos de tipo de partición correctos en fdisk

### Fallos de planificación

- **Sin espacio para crecer**: Deja 10-20% de espacio sin asignar para expansión futura
- **Separación deficiente**: Mantén los registros separados de los archivos del sistema[17]

## Solución de problemas comunes

### Problemas de reconocimiento de particiones

```bash
# Force kernel to re-read partition table
sudo partprobe /dev/sdb

# Or reboot if partprobe fails
sudo reboot
```

### Problemas de alineación

- Acepta siempre los sectores de inicio predeterminados para una alineación óptima en SSD
- Usa `parted` con el comando `align-check` para verificar la alineación

### Fallos de montaje

```bash
# Check file system errors
sudo fsck /dev/sdb1

# Check /etc/fstab syntax
sudo mount -a
```
## Respaldo y recuperación

### Antes del particionado

1. **Respalde los datos importantes** en almacenamiento externo
2. **Documente la distribución actual de particiones**:
   ```bash
   sudo fdisk -l > partition-backup.txt
   sudo blkid > uuid-backup.txt
   ```

### Respaldo de la tabla de particiones

```bash
# Backup partition table
sudo dd if=/dev/sdb of=partition-table.backup bs=512 count=1

# Restore partition table (emergency use only)
sudo dd if=partition-table.backup of=/dev/sdb bs=512 count=1
```

## Integración con otras tareas de configuración del servidor

Después del particionado:

- **Siguiente**: Configure los puntos de montaje y configure `/etc/fstab`
- **Expansión de almacenamiento**: Consulte [external-storage.md](external-storage.md) para agregar más unidades
- **Configuración inicial**: Complete la instalación del sistema operativo usando su nueva distribución de particiones
- **Monitoreo**: Configure el monitoreo del uso del disco para cada partición

## Consideraciones de seguridad

1. **Cifre las particiones sensibles** usando LUKS
2. **Establezca las opciones de montaje adecuadas** (`noexec`, `nosuid` para `/tmp`)
3. **Monitoreo regular** del uso de las particiones
4. **Controles de acceso** en los puntos de montaje

## Conclusión

El particionado adecuado del disco es fundamental para servidores comunitarios estables y mantenibles. Use herramientas gráficas como GParted para simplificar o herramientas de línea de comandos para automatización y funciones avanzadas. Planifique siempre la distribución de particiones según su caso de uso específico, mantenga respaldos y monitoree el uso del disco regularmente.

La inversión en un particionado adecuado rinde dividendos en estabilidad del sistema, rendimiento y eficiencia de mantenimiento durante todo el ciclo de vida de su servidor.