# Intel NUC Power Supply, Storage, and Network Configuration Guide

## Introduction

Optimizing power supply, storage options, and network connectivity is crucial for reliable Intel NUC server deployment. This guide provides comprehensive recommendations for these critical components when using Intel NUCs as community server platforms with YunoHost, Caprover, CasaOS, or similar self-hosting solutions.

## Power Supply Considerations

### Official Power Adapters

Intel NUCs require specific power adapters that vary by model:

| NUC Series | Power Rating | Connector Type | Notes |
|------------|--------------|----------------|-------|
| Standard NUC13 | 19V, 90W | 5.5mm barrel | Most common configuration |
| NUC12/13 Pro | 19V, 120W | 5.5mm barrel | Higher-power models |
| ROG NUC 2025 | 19.5V, 230W | 7.4mm barrel | Gaming/high-performance variants |
| Older NUCs | 19V, 65W | 5.5mm barrel | Legacy models (NUC10 and earlier) |

#### Important Specifications
- **Output Voltage**: Always 19-19.5V DC
- **Power Rating**: Match wattage to your specific model
- **Connector Size**: 5.5mm x 2.5mm barrel (standard models)
- **Polarity**: Center positive (+) on all models

### Power Adapter Best Practices

#### ✅ Recommended
- **Use OEM adapters** whenever possible
- **Quality third-party adapters** with UL/CE certification
- **Adapters with built-in overcurrent protection**
- **Proper cable gauge** for length (thicker for longer runs)

#### ❌ Avoid
- **Universal adapters** with multiple tips/selectable voltages
- **Underpowered adapters** (below specified wattage)
- **Cheap, uncertified adapters** that may damage components
- **Adapters missing safety certifications**

### Uninterruptible Power Supply (UPS)

For server deployments, a UPS is strongly recommended:

#### Minimum UPS Specifications
- **Capacity**: 300-500VA for standard NUCs
- **Output**: Pure sine wave preferred (but not required)
- **Runtime**: Minimum 10-15 minutes at full load
- **Battery Type**: Sealed lead-acid or lithium-ion
- **Communication**: USB interface for automatic shutdown

#### Recommended UPS Models
- **APC BE600M1**: Entry-level, 600VA/330W, 7 outlets
- **CyberPower CP1000PFCLCD**: Mid-range, 1000VA/600W, pure sine wave
- **APC BR1500MS**: High-end, 1500VA/900W, sine wave, AVR
- **Tripp Lite SMART1500LCDT**: 1500VA/900W, LCD display, extended runtime

#### UPS Configuration Tips
1. Connect NUC to battery-backed outlet
2. Install UPS monitoring software on server
3. Configure automatic shutdown parameters
4. Test UPS functionality quarterly
5. Replace batteries every 3-5 years

### Power Consumption Planning

Intel NUCs are extremely energy-efficient compared to traditional servers:

| Model | Idle Power | Typical Load | Heavy Load | Annual Cost* |
|-------|------------|--------------|------------|--------------|
| NUC i3 Models | 4-8W | 15-25W | 35W | $15-30 |
| NUC i5 Models | 6-10W | 20-35W | 45W | $20-40 |
| NUC i7 Models | 8-12W | 25-40W | 50W | $25-45 |
| ROG NUC | 20-30W | 80-120W | 160W+ | $80-150 |

*Based on $0.12/kWh, 24/7 operation

#### Energy Efficiency Tips
- Enable BIOS power management features
- Use SSD storage instead of mechanical drives
- Configure OS power management settings
- Schedule non-critical services during off-peak times
- Monitor power usage with smart plugs or UPS software

## Storage Configuration

Intel NUCs offer multiple storage options that can be optimized for server deployment.

### Storage Interface Types

| Interface | Speed | Typical Use | Power Consumption | Recommended For |
|-----------|-------|-------------|-------------------|-----------------|
| M.2 NVMe PCIe 4.0 | Up to 7,000 MB/s | OS, databases | 5-8W | High-performance applications |
| M.2 NVMe PCIe 3.0 | Up to 3,500 MB/s | OS, containers | 4-7W | Balanced performance/cost |
| M.2 SATA | Up to 550 MB/s | General storage | 2-4W | Budget configurations |
| 2.5" SATA SSD | Up to 550 MB/s | Media storage | 2-5W | Large capacity needs |
| 2.5" SATA HDD | Up to 150 MB/s | Archival | 5-10W | Not recommended |

### Storage Configuration Recommendations

#### System Drive (OS and Applications)
- **Recommended**: NVMe SSD (minimum 250GB)
- **Preferred Models**: Samsung 980 Pro, WD Black SN850, Kingston KC3000
- **Minimum Endurance**: 300 TBW for server use
- **Over-provisioning**: 20% unallocated space for longevity

#### Data Storage
- **Recommended**: SATA SSD for 2.5" bay (if available)
- **Preferred Models**: Samsung 870 EVO, Crucial MX500, WD Blue
- **Capacity**: 1-4TB depending on needs
- **Consideration**: External storage for larger capacity requirements

#### Dual Drive Configuration (Optimal)
1. **System Drive**: 500GB-1TB NVMe for OS and applications
2. **Data Drive**: 2-4TB SATA SSD for user data, media, and backups

### Storage Configuration by NUC Model

| NUC Model | Storage Options | Optimal Configuration |
|-----------|----------------|------------------------|
| NUC13ANHi3/i5/i7 | 1x M.2 + 1x 2.5" SATA | 1TB NVMe + 2TB SATA SSD |
| NUC13ANKi5/i7 | 2x M.2 slots | 1TB NVMe (OS) + 2TB NVMe (data) |
| ROG NUC 2025 | 2x M.2 slots | 2TB NVMe (OS) + 4TB NVMe (data) |

### Storage Optimization Tips

#### Performance Optimization
1. **Use TRIM**: Enable TRIM support in the OS
2. **Filesystem Selection**:
   - ext4 for general Linux use
   - ZFS for data integrity (higher RAM requirements)
   - Btrfs for snapshot capabilities
3. **Partition Alignment**: Ensure proper alignment for SSDs
4. **Over-provisioning**: Leave 10-20% unallocated space
5. **Swap Configuration**: Minimal swap usage with SSDs

#### Reliability Considerations
1. **Regular Backups**: 3-2-1 backup strategy essential
2. **SMART Monitoring**: Install and configure smartmontools
3. **Wear Leveling**: Choose SSDs with good wear-leveling algorithms
4. **Temperature Monitoring**: Keep drives within optimal temperature range
5. **Scheduled Maintenance**: Periodic filesystem checks

### External Storage Options

For expanding beyond internal capacity:

#### Direct-Attached Storage (DAS)
- **USB 3.2/Thunderbolt Enclosures**: High-speed, direct-attached
- **Recommended Models**: Sabrent, Orico, CalDigit
- **Connection**: USB 3.2 Gen 2 or Thunderbolt for best performance
- **Configuration**: JBOD or hardware RAID options

#### Network-Attached Storage (NAS)
- **Recommendation**: Synology, QNAP, or custom NAS solution
- **Connection**: Via Ethernet network
- **Protocol**: SMB/CIFS, NFS, or iSCSI
- **Considerations**: Network bandwidth becomes limiting factor

## Network Connectivity

Optimizing network connectivity is essential for reliable server operation.

### Built-in Network Interfaces

| NUC Generation | Standard Interface | Speed | Features |
|----------------|-------------------|-------|----------|
| NUC 13 (ASUS) | Intel I225-V | 2.5 Gigabit | Wake-on-LAN, PXE |
| NUC 12 | Intel I219-V | 1 Gigabit | Wake-on-LAN, PXE |
| NUC 11 | Intel I219-V | 1 Gigabit | Wake-on-LAN, PXE |
| ROG NUC 2025 | Intel I225-LM | 2.5 Gigabit | Advanced management |

### Network Interface Configuration

#### Basic Configuration
1. **Update drivers** to latest version
2. **Enable Wake-on-LAN** in BIOS and OS
3. **Configure static IP** through DHCP reservation or static assignment
4. **Set proper MTU** (typically 1500, or 9000 for jumbo frames if supported)
5. **Disable unused protocols** to reduce attack surface

#### Advanced Tweaking (Linux)
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

### Multiple Network Interfaces

For more complex server setups requiring multiple NICs:

#### USB-to-Ethernet Adapters
- **Recommended Chipsets**: Realtek RTL8153, AX88179
- **Speed Options**: 1Gbps or 2.5Gbps available
- **Compatibility**: Excellent with Linux, driver installation required for Windows Server
- **Limitations**: Lower throughput than internal NICs, uses USB bandwidth

#### Thunderbolt Network Adapters
- **Advantages**: Near-native performance, multiple ports available
- **Recommended Models**: CalDigit, OWC, Sonnet
- **Configuration**: Can be used for dedicated services or VLANs
- **Considerations**: Higher cost, may require external power

### Wireless Connectivity

While wired connections are preferred for servers, wireless options are available:

#### Wi-Fi Configuration
- **Standards**: Wi-Fi 6/6E (802.11ax) built into most recent NUCs
- **Use Cases**: Secondary connectivity, isolated networks
- **Security**: WPA3 encryption, MAC filtering, isolated VLANs
- **Limitations**: Not recommended as primary server connection

#### Bluetooth
- **Availability**: Built into all modern NUCs
- **Use Cases**: Limited for servers, possibly for sensors or peripheral connectivity
- **Compatibility**: May not function in server OS environments
- **Recommendation**: Disable in BIOS if not needed

### Network Security Considerations

#### Firewall Configuration
1. **Enable OS firewall** with default-deny policy
2. **Open only required ports** for specific services
3. **Implement rate limiting** for SSH and web services
4. **Log all connection attempts** for monitoring
5. **Regular audit** of open ports and services

#### VLAN Segregation (Advanced)
- **Separate VLAN** for management access
- **Dedicated VLAN** for exposed services
- **Internal VLAN** for server-to-server communication
- **Requirements**: VLAN-capable switch, proper router configuration

## Power and Network Redundancy

### Power Redundancy Options
- **Multiple UPS units** for critical installations
- **Power monitoring** and alerting
- **Scheduled maintenance windows** for updates
- **Automatic restart** after power failure (BIOS setting)

### Network Redundancy Options
- **Dual-NIC configuration** with bonding/teaming
- **Secondary ISP connection** for critical services
- **Failover scripts** for connection monitoring
- **Network monitoring** with alerting capabilities

## Implementation Best Practices

### Cabling and Organization
- **Quality CAT6/6A cables** for all wired connections
- **Proper cable management** to prevent disconnection
- **Labeled cables** for easy identification
- **Strain relief** for all connections
- **Adequate ventilation** around equipment

### Documentation
- **Network diagram** showing all connections
- **IP address inventory** with MAC addresses
- **Service catalog** mapping services to ports
- **Maintenance procedures** for common tasks
- **Backup configuration** for all network devices

### Monitoring Setup
- **Implement Prometheus/Grafana** for monitoring
- **SNMP monitoring** of network equipment
- **Power consumption tracking**
- **Temperature monitoring** for all components
- **Disk usage and SMART monitoring**

## Platform-Specific Considerations

### YunoHost
- **Network**: Requires direct connection to router for proper DHCP/DNS
- **Storage**: Minimum 32GB for system, separate data partition recommended
- **Power**: Standard configuration works well, UPS recommended

### CasaOS
- **Network**: Works well with standard configuration
- **Storage**: Separate system and data drives recommended
- **Power**: Very efficient, even basic UPS sufficient

### Caprover
- **Network**: Port forwarding for 80, 443, 3000 required
- **Storage**: SSD strongly recommended for container performance
- **Power**: Standard configuration, UPS recommended for production

## Troubleshooting Common Issues

### Network Issues
- **No connectivity**: Check physical connections, driver installation
- **Driver problems**: Manual installation often required for server OS
- **Wake-on-LAN failure**: Verify BIOS and OS settings match
- **Slow performance**: Update drivers, check for QoS/throttling

### Storage Issues
- **Not detected**: Verify BIOS settings, physical installation
- **Slow performance**: Check for thermal throttling, firmware updates
- **Reliability concerns**: Run SMART tests, verify firmware
- **Capacity limitations**: Consider external expansion options

### Power Issues
- **Unexpected shutdowns**: Check power supply rating, UPS functionality
- **Won't power on**: Verify power adapter connections and output
- **Power efficiency concerns**: Update to BIOS power management
- **Heat-related issues**: Improve ventilation, clean cooling system

## Upgrade and Expansion Pathway

### Future-proofing Considerations
- **Start with quality components**: Focus on reliability over capacity
- **Plan for expansion**: Consider external options early
- **Regular maintenance**: Firmware and driver updates
- **Monitoring**: Implement proper monitoring from the start

### Upgrade Options
- **Memory**: Maximum RAM provides longest service life
- **Storage**: Start with quality NVMe, expand with external options
- **Network**: Consider Thunderbolt for expansion capabilities
- **Services**: Containerization for easy migration to new hardware

---

**Next Steps:**
- Complete BIOS configuration: [nuc-bios-setup.md](nuc-bios-setup.md)
- Review model-specific details: [nuc-models-comparison.md](nuc-models-comparison.md)
- Prepare for common issues: [nuc-troubleshooting.md](nuc-troubleshooting.md)

*Always verify specific recommendations with your exact NUC model specifications before purchase.*