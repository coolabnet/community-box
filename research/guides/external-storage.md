# External Storage Guide for Community Server Expansion

This guide covers connecting, formatting, and mounting additional storage devices (USB, SATA, SSD) to expand capacity and improve data resilience in community server deployments.

## Understanding External Storage Options

External storage provides crucial capabilities for community servers:

- **Capacity Expansion**: Add storage without replacing existing drives
- **Data Redundancy**: Create backup copies on separate physical devices
- **Performance Enhancement**: Use SSDs for high-performance workloads
- **Modular Architecture**: Easy addition and removal of storage as needs change

### Storage Connection Types

| Connection Type | Speed | Best Use Case | Compatibility |
|----------------|-------|---------------|---------------|
| USB 3.0/3.1 | 5-10 Gbps | Backup drives, portable storage | Universal |
| USB-C | Up to 40 Gbps | High-speed external SSDs | Modern systems |
| eSATA | 6 Gbps | Permanent external storage | Desktop systems |
| Thunderbolt | Up to 40 Gbps | Professional workloads | Mac/high-end PC |
| Internal SATA | 6 Gbps | Primary storage expansion | Desktop/server |

## Pre-Connection Preparation

### Inventory Current Storage

Before adding external storage, document your current setup:

```bash
# List all block devices
lsblk

# Show disk usage
df -h

# Display detailed disk information
sudo fdisk -l
```

### Check Available Ports

Identify available connection ports:
- USB 3.0+ ports (blue connectors typically)
- eSATA ports
- Internal SATA connections
- Power requirements for 3.5" drives

> **⚠️ Power Requirements**
> 
> 3.5" SATA drives require separate power connections. 2.5" drives can typically be powered via USB. Plan your power infrastructure accordingly.

## Step 1: Physical Connection

### USB Drive Connection

`[Mounting External Drive](mounting-external-drive.png)`

1. **Locate appropriate USB port** (USB 3.0+ recommended for better performance)
2. **Connect the drive** ensuring secure connection
3. **For USB-SATA adapters**: Connect both USB and power cables if required
4. **Wait for recognition** (typically 5-10 seconds)

### SATA Drive Connection

For internal SATA connections:

1. **Power down the system completely**
2. **Connect SATA data cable** to motherboard SATA port
3. **Connect SATA power cable** from power supply
4. **Secure drive in mounting bracket** if permanent installation
5. **Power on and check BIOS/UEFI** for drive recognition

### Verification of Physical Connection

```bash
# Check system messages for new device
dmesg | tail -20

# List all SCSI/SATA devices
lsscsi

# Monitor real-time device detection
sudo tail -f /var/log/syslog
```

## Step 2: Drive Detection and Identification

### Automatic Detection

Most Linux systems automatically detect new storage devices:

```bash
# List all block devices with file system info
lsblk -f

# Show all storage devices
sudo fdisk -l

# Display device information by ID
ls -la /dev/disk/by-id/
```

### Manual Device Scanning

If automatic detection fails:

```bash
# Rescan SCSI devices
echo "- - -" | sudo tee /sys/class/scsi_host/host*/scan

# Rescan specific SCSI host (replace X with host number)
echo "1" | sudo tee /sys/class/block/sdX/device/rescan
```

### Identifying Your New Drive

Look for the new device in the output:

```bash
# Example output showing new USB drive
$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   10G  0 disk 
├─sda1   8:1    0    1G  0 part /boot
└─sda2   8:2    0    9G  0 part /
sdb      8:16   1  7.4G  0 disk  ← New USB drive
```

## Step 3: Drive Preparation and Formatting

### Check Existing File System

Before formatting, check if the drive already contains data:

```bash
# Check for existing file systems
sudo blkid /dev/sdb

# Attempt to identify file system type
sudo file -s /dev/sdb1
```

### Create Partition Table (if needed)

For completely new drives:

```bash
# Create GPT partition table (recommended for drives >2TB)
sudo parted /dev/sdb mklabel gpt

# Or create MBR partition table (for compatibility)
sudo parted /dev/sdb mklabel msdos
```

### Create Partitions

#### Using parted (recommended)

```bash
# Start parted on the new drive
sudo parted /dev/sdb

# Create a single partition using all available space
(parted) mkpart primary ext4 0% 100%

# Exit parted
(parted) quit
```

#### Using fdisk

```bash
# Start fdisk
sudo fdisk /dev/sdb

# Create new partition (n), primary (p), partition 1, accept defaults
# Write changes (w)
```

### Format the Partition

`[Filesystem Format Screenshot](format-drive-ui.png)`

Choose the appropriate file system based on your needs:

#### ext4 (Recommended for Linux)

```bash
# Format with ext4 file system
sudo mkfs.ext4 /dev/sdb1

# Format with label for easy identification
sudo mkfs.ext4 -L "backup-storage" /dev/sdb1
```

#### NTFS (for Windows compatibility)

```bash
# Install NTFS tools if not available
sudo apt install ntfs-3g

# Format with NTFS
sudo mkfs.ntfs -f -L "shared-storage" /dev/sdb1
```

#### exFAT (cross-platform compatibility)

```bash
# Install exFAT tools
sudo apt install exfat-fuse exfat-utils

# Format with exFAT
sudo mkfs.exfat -n "portable-storage" /dev/sdb1
```

### Verify Formatting

```bash
# Check the new file system
sudo blkid /dev/sdb1

# Verify file system integrity
sudo fsck /dev/sdb1
```

## Step 4: Mounting External Storage

### Create Mount Point

```bash
# Create directory for mount point
sudo mkdir -p /mnt/external-storage

# Or use a more descriptive path
sudo mkdir -p /srv/backup-storage
```

### Temporary Mounting

For testing or temporary access:

```bash
# Mount the drive
sudo mount /dev/sdb1 /mnt/external-storage

# Verify mount
df -h | grep external-storage

# Check mount details
mount | grep sdb1
```

### Permanent Mounting

For automatic mounting at boot, edit `/etc/fstab`:

#### Get Drive UUID

```bash
# Find the UUID of your partition
sudo blkid /dev/sdb1
# Output: /dev/sdb1: UUID="12345678-1234-1234-1234-123456789012" TYPE="ext4" LABEL="backup-storage"
```

#### Edit fstab

```bash
# Backup current fstab
sudo cp /etc/fstab /etc/fstab.backup

# Edit fstab
sudo nano /etc/fstab
```

Add a line for your new drive:

```
# External backup storage
UUID=12345678-1234-1234-1234-123456789012 /srv/backup-storage ext4 defaults,nofail 0 2
```

#### fstab Options Explained

- `defaults`: Use default mount options
- `nofail`: Don't fail boot if drive is missing[20]
- `0`: Don't dump this file system
- `2`: Check file system after root partition

#### Test fstab Entry

```bash
# Test mount all entries in fstab
sudo mount -a

# Verify successful mount
df -h
```

## Step 5: Setting Permissions and Ownership

### Basic Permissions

```bash
# Set appropriate ownership
sudo chown -R $USER:$USER /srv/backup-storage

# Set permissions for user access
sudo chmod 755 /srv/backup-storage
```

### Group-Based Access

For multi-user server environments:

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

## Advanced Configuration Options

### Performance Optimization

#### Mount Options for SSDs

For SSD external drives, use optimized mount options:

```
UUID=12345678-1234-1234-1234-123456789012 /srv/ssd-storage ext4 defaults,noatime,discard,nofail 0 2
```

- `noatime`: Don't update access times (improves performance)
- `discard`: Enable TRIM commands for SSD health

#### I/O Scheduling

For external drives, consider deadline or noop schedulers:

```bash
# Check current scheduler
cat /sys/block/sdb/queue/scheduler

# Set deadline scheduler for external drive
echo deadline | sudo tee /sys/block/sdb/queue/scheduler
```

### Encryption Setup

For sensitive data, use LUKS encryption:

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

## Drive Health Monitoring

### S.M.A.R.T. Monitoring

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

### Regular Health Checks

Create a monitoring script:

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

## Backup and Redundancy Strategies

### Automated Backup Scripts

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

### RAID Configuration

For multiple external drives, consider software RAID:

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

## Troubleshooting Common Issues

### Drive Not Detected

1. **Check physical connections**
2. **Verify power supply** (especially for 3.5" drives)
3. **Try different USB port** or cable
4. **Check system logs**:
   ```bash
   dmesg | grep -i error
   sudo journalctl -f
   ```

### Mount Failures

```bash
# Check file system errors
sudo fsck /dev/sdb1

# Force mount with specific type
sudo mount -t ext4 /dev/sdb1 /mnt/external-storage

# Check for conflicting mounts
mount | grep sdb1
```

### Permission Issues

```bash
# Fix ownership issues
sudo chown -R $USER:$USER /mnt/external-storage

# Check SELinux contexts (if applicable)
ls -Z /mnt/external-storage
```

### Performance Problems

```bash
# Check I/O statistics
iostat 5

# Monitor disk usage
iotop

# Test read/write performance
sudo hdparm -tT /dev/sdb
```

## Security Considerations

### Access Control

1. **Limit mount points** to necessary directories only
2. **Use noexec option** for data-only partitions
3. **Regular permission audits**:
   ```bash
   find /srv/backup-storage -type f -perm 777
   ```

### Data Protection

1. **Encrypt sensitive external storage**
2. **Regular backup verification**
3. **Secure disposal** of old drives
4. **Access logging**:
   ```bash
   # Monitor file access
   tail -f /var/log/audit/audit.log | grep external-storage
   ```

## Integration with Server Services

### Web Server Integration

```bash
# Create web-accessible storage directory
sudo mkdir -p /srv/backup-storage/web-data
sudo chown -R www-data:www-data /srv/backup-storage/web-data

# Add to web server configuration
# Apache example:
# Alias /backup-data /srv/backup-storage/web-data
```

### Database Storage

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

## Maintenance Schedule

### Daily Tasks

- Monitor mount status
- Check available space
- Review system logs for errors

### Weekly Tasks

- Run file system checks
- Verify backup integrity
- Update usage documentation

### Monthly Tasks

- Run S.M.A.R.T. tests
- Review performance metrics
- Plan capacity expansion

## Integration with Other Guides

This external storage setup complements other server management tasks:

- **After OS Installation**: Follow [etcher-guide.md](etcher-guide.md) for initial system setup
- **Before Storage Setup**: Complete [disk-partitioning.md](disk-partitioning.md) for main system layout
- **Security Hardening**: Implement access controls and encryption
- **Monitoring Integration**: Add storage metrics to server monitoring

## Conclusion

External storage expansion is crucial for growing community server deployments. Proper planning, configuration, and maintenance ensure reliable operation and data protection. Always prioritize data safety through redundancy, monitoring, and regular maintenance procedures.

The modular approach to external storage allows community servers to scale efficiently while maintaining budget consciousness and operational simplicity.