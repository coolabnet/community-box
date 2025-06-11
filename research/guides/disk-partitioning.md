# Beginner's Guide to Disk Partitioning for Community Servers

This comprehensive guide covers disk partitioning fundamentals using both graphical and command-line tools, with specific recommendations for community server deployments.

## Understanding Disk Partitioning

Disk partitioning divides a storage device into separate, independent sections called partitions[16]. Each partition can have its own file system and serves specific purposes in server environments. Proper partitioning improves system performance, simplifies backups, and enhances security[17].

### Why Partition Your Server Drives?

1. **Separation of Concerns**: Keep system files separate from user data and logs[17]
2. **Performance Optimization**: Reduce disk fragmentation and I/O contention[17]
3. **Security Enhancement**: Isolate sensitive data and system components
4. **Backup Efficiency**: Enable targeted backups of specific data types
5. **Fault Tolerance**: Prevent one full partition from affecting the entire system[17]

## Recommended Partition Layout for Community Servers

`[Partition Layout Example](partition-layout.png)`

### Standard Partition Scheme

For most community server deployments, consider this layout:

| Partition | Mount Point | Size | File System | Purpose |
|-----------|-------------|------|-------------|---------|
| Boot | `/boot` | 1GB | ext4 | Boot loader files and kernels |
| Root | `/` | 20-50GB | ext4 | System files and applications |
| Var | `/var` | 10-20GB | ext4 | Variable data, temporary files |
| Var Log | `/var/log` | 5-10GB | ext4 | System and application logs[17] |
| Home | `/home` | 10-50GB | ext4 | User directories |
| Tmp | `/tmp` | 2-5GB | ext4 | Temporary files[17] |
| Data | `/srv` or `/data` | Remaining space | ext4 | Application data and services |
| Swap | N/A | 1-2x RAM | swap | Virtual memory |

> **💡 Best Practice**
> 
> Separating `/var/log` from `/var` prevents log files from filling up the entire `/var` partition and affecting system stability[17].

## Method 1: Graphical Partitioning with GParted

GParted (GNOME Partition Editor) provides an intuitive interface for managing disk partitions[9].

### Installing GParted

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

### Using GParted

#### Step 1: Launch GParted

1. Open GParted from the Applications menu or run:
   ```bash
   sudo gparted
   ```
2. Enter your admin password when prompted
3. GParted will scan all available storage devices

`[GParted In Use](gparted-screenshot.png)`

#### Step 2: Select Target Drive

1. Use the dropdown menu in the top-right to select your target drive
2. **Verify the drive size and model** to ensure you're working with the correct device
3. Review existing partitions displayed in the graphical layout

> **⚠️ Critical Warning**
> 
> Always verify you've selected the correct drive. Partitioning operations will destroy existing data.

#### Step 3: Create Partition Table (if needed)

For new drives:
1. Go to **Device** → **Create Partition Table**
2. Select **GPT** for drives larger than 2TB or modern systems
3. Select **MBR (msdos)** for compatibility with older systems[13]
4. Click **Apply**

#### Step 4: Create New Partitions

1. Right-click on unallocated space
2. Select **New**
3. Configure partition settings:
   - **Size**: Specify partition size in MB or GB
   - **Create as**: Choose Primary, Extended, or Logical
   - **File system**: Select ext4 for Linux partitions
   - **Label**: Add descriptive labels (e.g., "server-root", "data-storage")
4. Click **Add** to queue the operation

#### Step 5: Apply Changes

1. Review all queued operations in the pending operations list
2. Click **Apply** to execute all changes
3. Confirm the operation when prompted
4. Wait for completion (this may take several minutes for large partitions)

### Advanced GParted Operations

#### Resizing Existing Partitions

1. Right-click the partition to resize
2. Select **Resize/Move**
3. Drag the partition boundaries or enter specific sizes
4. Apply changes

#### Moving Partitions

Use the **Resize/Move** dialog to shift partition locations on the disk[11]. This is useful for consolidating free space.

## Method 2: Command-Line Partitioning

Command-line tools offer more control and automation capabilities for server deployments.

### Using fdisk

`fdisk` is a powerful command-line partitioning tool available on all Linux systems[14][16].

#### Step 1: Identify Target Drive

```bash
sudo fdisk -l
```

This command lists all drives and their current partitions[14]. Identify your target drive (e.g., `/dev/sdb`).

#### Step 2: Start fdisk

```bash
sudo fdisk /dev/sdb
```

Replace `/dev/sdb` with your target drive[14].

#### Step 3: Create Partitions

Within the fdisk prompt:

1. **Create new partition**: Type `n`
2. **Select partition type**: 
   - `p` for primary partition
   - `e` for extended partition[14]
3. **Choose partition number**: Accept default or specify (1-4 for primary)
4. **Set first sector**: Accept default for optimal alignment
5. **Set last sector**: Specify size using `+20G` format for 20GB partition[14]

#### Step 4: Set Partition Type

1. Type `t` to change partition type
2. Select partition number
3. Enter type code:
   - `83` for Linux (ext4)
   - `82` for Linux swap
   - `8e` for Linux LVM[26]

#### Step 5: Write Changes

1. Type `p` to preview partition table
2. Type `w` to write changes and exit[14]

### Using parted

`parted` offers more advanced features and supports GPT partition tables[16].

#### Basic parted Usage

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

## Formatting New Partitions

After creating partitions, format them with appropriate file systems[23].

### Format ext4 Partitions

```bash
# Format with ext4
sudo mkfs.ext4 /dev/sdb1

# Format with label
sudo mkfs.ext4 -L "server-root" /dev/sdb1
```

### Create Swap Partition

```bash
# Format swap partition
sudo mkswap /dev/sdb3

# Enable swap
sudo swapon /dev/sdb3
```

### Verify Formatting

```bash
# Check file system information
sudo blkid /dev/sdb1

# List all block devices
lsblk -f
```

## Mounting Partitions

### Temporary Mounting

```bash
# Create mount point
sudo mkdir /mnt/server-data

# Mount partition
sudo mount /dev/sdb2 /mnt/server-data
```

### Permanent Mounting

Edit `/etc/fstab` for automatic mounting at boot:

```bash
sudo nano /etc/fstab
```

Add entries using UUID for reliability:

```
UUID=12345678-1234-1234-1234-123456789012 /srv ext4 defaults 0 2
UUID=87654321-4321-4321-4321-210987654321 none swap sw 0 0
```

Get UUIDs with:
```bash
sudo blkid
```

## Platform-Specific Recommendations

### Raspberry Pi Servers

- **Boot Partition**: 256MB FAT32 for firmware
- **Root Partition**: 8-16GB ext4 minimum
- **Use SD card for boot, USB SSD for data** when possible

### x86 Community Servers

- **EFI System Partition**: 512MB FAT32 for UEFI systems
- **Boot Partition**: 1GB ext4
- **Consider LVM** for flexible storage management[17]

### ARM-based Servers

- Check manufacturer documentation for specific partition requirements
- May require special boot partitions or firmware sections

## Logical Volume Management (LVM)

LVM provides advanced storage management capabilities[17][24].

### LVM Benefits

1. **Dynamic Resizing**: Grow or shrink logical volumes as needed[24]
2. **Storage Pooling**: Combine multiple physical drives[17]
3. **Snapshots**: Create point-in-time backups
4. **Striping**: Improve performance across multiple drives

### Basic LVM Setup

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

## Common Partitioning Mistakes to Avoid

### Size-Related Issues

- **Root partition too small**: Minimum 20GB, preferably 30-50GB
- **No swap space**: Always include swap, even with abundant RAM
- **Oversized boot partition**: 1GB is typically sufficient

### File System Choices

- **Using FAT32 for Linux systems**: Use ext4 for better performance and features
- **Wrong partition types**: Ensure proper partition type codes in fdisk

### Planning Failures

- **No room for growth**: Leave 10-20% unallocated space for future expansion
- **Poor separation**: Keep logs separate from system files[17]

## Troubleshooting Common Issues

### Partition Recognition Problems

```bash
# Force kernel to re-read partition table
sudo partprobe /dev/sdb

# Or reboot if partprobe fails
sudo reboot
```

### Alignment Issues

- Always accept default start sectors for optimal SSD alignment
- Use `parted` with `align-check` command to verify alignment

### Mount Failures

```bash
# Check file system errors
sudo fsck /dev/sdb1

# Check /etc/fstab syntax
sudo mount -a
```

## Backup and Recovery

### Before Partitioning

1. **Backup important data** to external storage
2. **Document current partition layout**:
   ```bash
   sudo fdisk -l > partition-backup.txt
   sudo blkid > uuid-backup.txt
   ```

### Partition Table Backup

```bash
# Backup partition table
sudo dd if=/dev/sdb of=partition-table.backup bs=512 count=1

# Restore partition table (emergency use only)
sudo dd if=partition-table.backup of=/dev/sdb bs=512 count=1
```

## Integration with Other Server Setup Tasks

After partitioning:

- **Next**: Set up mount points and configure `/etc/fstab`
- **Storage Expansion**: See [external-storage.md](external-storage.md) for adding more drives
- **Initial Setup**: Complete OS installation using your new partition layout
- **Monitoring**: Set up disk usage monitoring for each partition

## Security Considerations

1. **Encrypt sensitive partitions** using LUKS
2. **Set appropriate mount options** (`noexec`, `nosuid` for `/tmp`)
3. **Regular monitoring** of partition usage
4. **Access controls** on mount points

## Conclusion

Proper disk partitioning is fundamental to stable, maintainable community servers. Use graphical tools like GParted for simplicity or command-line tools for automation and advanced features. Always plan partition layouts based on your specific use case, maintain backups, and monitor disk usage regularly.

The investment in proper partitioning pays dividends in system stability, performance, and maintenance efficiency throughout your server's lifecycle.