# ZimaBoard Models Comparison

## Model Overview

ZimaBoard is available in three distinct models designed to cater to different performance requirements and budgets. All models share the same form factor and core expansion capabilities while varying in processing power, memory, and storage configurations[4][9][64].

## Detailed Specifications Comparison

| Specification | ZimaBoard 216 | ZimaBoard 432 | ZimaBoard 832 |
|---------------|---------------|---------------|---------------|
| **CPU** | Intel Celeron N3350<br>Dual Core<br>1.1-2.4GHz | Intel Celeron N3450<br>Quad Core<br>1.1-2.2GHz | Intel Celeron N3450<br>Quad Core<br>1.1-2.2GHz |
| **CPU Cache** | 2MB L2 | 2MB L2 | 2MB L2 |
| **CPU Benchmark** | ~1158 PassMark | ~1920 PassMark | ~1920 PassMark |
| **Architecture** | x86-64 (64-bit) | x86-64 (64-bit) | x86-64 (64-bit) |
| **RAM** | 2GB LPDDR4 (Onboard) | 4GB LPDDR4 (Onboard) | 8GB LPDDR4 (Onboard) |
| **eMMC Storage** | 16GB eMMC 5.1 | 32GB eMMC 5.1 | 32GB eMMC 5.1 |
| **Graphics** | Intel HD Graphics 500<br>200-650MHz | Intel HD Graphics 500<br>200-700MHz | Intel HD Graphics 500<br>200-700MHz |
| **TDP** | 6W | 6W | 6W |
| **Typical Power Usage** | 2-6W | 3-8W | 4-10W |
| **Price (USD)** | $119.9 | $159.9 | $199.9 |

## Shared Hardware Features

All ZimaBoard models include identical connectivity and expansion options:

### Connectivity
- **Ethernet**: 2x Gigabit Ethernet (Realtek 8111H)
- **USB**: 2x USB 3.0 ports
- **Display**: 1x Mini-DisplayPort 1.2 (4K@60Hz support)
- **Power**: 12V/3A DC input (barrel jack)

### Storage Expansion
- **SATA**: 2x SATA 6.0 Gb/s ports
- **PCIe**: 1x PCIe 2.0 x4 slot (external)
- **Maximum Storage**: Up to 36TB via SATA drives

### Additional Features
- **Cooling**: Passive heatsink design (fanless)
- **Hardware Security**: Intel VT-d, VT-x, AES-NI support
- **Video Codecs**: H.264 (AVC), H.265 (HEVC), MPEG-2, VC-1
- **Dimensions**: 138.7 x 81.4 x 34.9 mm (W x D x H)
- **Weight**: 278g

## Performance Analysis

### ZimaBoard 216 (Entry Level)
**Target Use Cases:**
- Basic home router/firewall (pfSense, OpenWrt)
- Simple file server or lightweight NAS
- IoT gateway or edge device
- Development and testing environment

**Performance Characteristics:**
- Dual-core CPU suitable for basic multitasking
- 2GB RAM adequate for lightweight services
- Limited transcoding capabilities (1-2 1080p streams)
- Suitable for small networks (1-5 users)

**Limitations:**
- May struggle with memory-intensive applications
- Limited concurrent user support
- Basic transcoding performance

### ZimaBoard 432 (Balanced)
**Target Use Cases:**
- Home media server (Plex/Jellyfin with light transcoding)
- Multi-service home lab
- Small office router with additional services
- Docker container host (5-10 containers)

**Performance Characteristics:**
- Quad-core CPU provides good multitasking
- 4GB RAM suitable for moderate workloads
- Supports 2-3 concurrent transcoding streams
- Good balance of performance and cost

**Sweet Spot For:**
- Most home lab users
- Mixed workload environments
- Users wanting room for growth

### ZimaBoard 832 (Performance)
**Target Use Cases:**
- High-performance media server (multiple 4K streams)
- Virtualization host (Proxmox, ESXi)
- Network appliance with multiple VMs
- Development server with multiple services

**Performance Characteristics:**
- Same CPU as 432 but with maximum RAM
- 8GB RAM enables virtualization and memory-intensive apps
- Supports 3-4 concurrent transcoding streams
- Best performance for multi-user environments

**Ideal For:**
- Power users and enthusiasts
- Virtualization environments
- Multi-user media servers
- Production-grade home services

## Target Deployment Sizes

### ZimaBoard 216
- **Network Size**: 1-3 devices
- **Concurrent Users**: 1-2 users
- **Storage Needs**: Basic file sharing
- **Services**: 2-3 lightweight containers
- **Budget**: Entry-level investment

### ZimaBoard 432
- **Network Size**: 5-15 devices
- **Concurrent Users**: 2-5 users
- **Storage Needs**: Home media library
- **Services**: 5-8 moderate containers
- **Budget**: Mid-range investment

### ZimaBoard 832
- **Network Size**: 10-25 devices
- **Concurrent Users**: 3-8 users
- **Storage Needs**: Large media collections
- **Services**: 8-15 containers or VMs
- **Budget**: Performance-focused investment

## Power Consumption Analysis

| Model | Idle Power | Light Load | Heavy Load | Maximum |
|-------|------------|------------|------------|---------|
| 216 | 2.5W | 4W | 6W | 8W |
| 432 | 3W | 5W | 8W | 10W |
| 832 | 3.5W | 6W | 10W | 15W |

**Note**: Power consumption varies significantly based on:
- Connected storage devices
- PCIe card usage
- Network traffic
- CPU utilization
- Ambient temperature

## Memory and Storage Recommendations

### ZimaBoard 216
- **Suitable For**: Lightweight services, basic routing
- **RAM Usage**: Typically 60-80% under normal load
- **Storage Strategy**: Use eMMC for OS, single SATA drive for data
- **Expansion Priority**: Focus on storage over performance

### ZimaBoard 432
- **Suitable For**: Balanced home server duties
- **RAM Usage**: Typically 50-70% under normal load
- **Storage Strategy**: eMMC for OS, dual SATA for RAID/expansion
- **Expansion Priority**: Storage and networking enhancements

### ZimaBoard 832
- **Suitable For**: High-performance and virtualization
- **RAM Usage**: Typically 40-60% under normal load
- **Storage Strategy**: PCIe NVMe for OS/VMs, SATA for bulk storage
- **Expansion Priority**: High-speed storage and networking

## Choosing the Right Model

### Choose ZimaBoard 216 If:
- Budget is primary concern ($119.9)
- Basic networking/routing requirements
- Single-user environment
- Learning and experimentation focus
- Power consumption is critical

### Choose ZimaBoard 432 If:
- Balanced performance and cost requirements ($159.9)
- Home media server with light transcoding
- Small family or office environment
- Room for service expansion needed
- Most versatile option desired

### Choose ZimaBoard 832 If:
- Maximum performance within ZimaBoard lineup ($199.9)
- Virtualization or multiple VMs planned
- High-performance media server required
- Multi-user environment (3+ concurrent users)
- Future-proofing investment desired

## Competitive Analysis

| Device | ZimaBoard 832 | Synology DS218+ | Intel NUC Kit | Raspberry Pi 4 8GB |
|--------|---------------|-----------------|---------------|-------------------|
| CPU | N3450 4-core | J3355 2-core | Varies | ARM Cortex-A72 |
| RAM | 8GB | 2GB | Varies | 8GB |
| Storage | 32GB + 2x SATA | 2-bay | Varies | microSD |
| Price | $199.9 | $299 | $300-500 | $75 |
| Expansion | PCIe + SATA | Limited | Good | GPIO focused |

## Migration and Upgrade Paths

### From ZimaBoard 216:
- **To 432**: Worthwhile for increased RAM and performance
- **To 832**: Significant upgrade for virtualization needs
- **Data Migration**: Simple drive transfer between units

### From ZimaBoard 432:
- **To 832**: Recommended for memory-intensive workloads
- **Alternative**: Add PCIe expansion cards for performance

### External Upgrades:
- **Storage**: PCIe SATA controllers for additional drives
- **Networking**: PCIe network cards for 10GbE or additional ports
- **Compute**: PCIe accelerator cards for specific workloads

## Related Documentation

- For detailed expansion options: [zima-expansion-options.md](zima-expansion-options.md)
- For setup and configuration: [zima-overview.md](zima-overview.md)
- For troubleshooting: [zima-troubleshooting.md](zima-troubleshooting.md)

## Community Recommendations

Based on community feedback and real-world deployments[55][17][34]:

- **Most Popular**: ZimaBoard 432 offers the best value proposition
- **Best Investment**: ZimaBoard 832 for long-term use and expandability
- **Budget Choice**: ZimaBoard 216 for learning and basic applications
- **Professional Use**: Consider ZimaBoard 832 with enterprise-grade expansion cards