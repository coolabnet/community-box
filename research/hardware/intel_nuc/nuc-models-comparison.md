# Intel NUC Models Comparison for Server Deployment

## Overview

This comprehensive comparison covers Intel NUC models suitable for community server deployment, focusing on specifications relevant to self-hosting platforms like YunoHost, Caprover, and CasaOS.

## Current Generation Models (2024-2025)

### ASUS NUC Models (13th Generation)

| Model | CPU | Cores/Threads | Base/Boost GHz | TDP | Max RAM | Storage | Network | Price Range |
|-------|-----|---------------|----------------|-----|---------|---------|---------|-------------|
| **NUC13ANHi3** | i3-1315U | 6 (2P+4E) / 8 | 1.2/4.5 | 15W | 64GB | M.2 + 2.5" | 2.5GbE | $300-400 |
| **NUC13ANHi5** | i5-1340P | 12 (4P+8E) / 16 | 1.9/4.6 | 28W | 64GB | M.2 + 2.5" | 2.5GbE | $450-550 |
| **NUC13ANHi7** | i7-1360P | 12 (4P+8E) / 16 | 2.2/5.0 | 28W | 64GB | M.2 + 2.5" | 2.5GbE | $600-700 |
| **NUC13ANKi5** | i5-1340P | 12 (4P+8E) / 16 | 1.9/4.6 | 28W | 64GB | 2x M.2 | 2.5GbE | $490-590 |
| **NUC13ANKi7** | i7-1360P | 12 (4P+8E) / 16 | 2.2/5.0 | 28W | 64GB | 2x M.2 | 2.5GbE | $650-750 |

### ASUS ROG NUC Gaming Models (2025)

| Model | CPU | GPU | Cores/Threads | TDP | Max RAM | Storage | Network | Price Range |
|-------|-----|-----|---------------|-----|---------|---------|---------|-------------|
| **ROG NUC 2025** | Core Ultra 9 275HX | RTX 5080 Mobile | 24 (8P+16E) / 32 | 160W | 96GB | 2x M.2 | 2.5GbE | $3000+ |

### Intel Legacy Models (12th Generation)

| Model | CPU | Cores/Threads | Base/Boost GHz | TDP | Max RAM | Storage | Network | Status |
|-------|-----|---------------|----------------|-----|---------|---------|---------|--------|
| **NUC12WSHi3** | i3-1220P | 10 (2P+8E) / 12 | 1.1/4.4 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legacy |
| **NUC12WSHi5** | i5-1240P | 12 (4P+8E) / 16 | 1.7/4.4 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legacy |
| **NUC12WSHi7** | i7-1260P | 12 (4P+8E) / 16 | 2.1/4.7 | 28W | 64GB | M.2 + 2.5" | 1GbE | Legacy |

## Detailed Specifications Comparison

### Performance Characteristics

| Model | Passmark CPU Score* | Graphics | PCIe Lanes | Thunderbolt | USB Ports | Power Consumption |
|-------|-------------------|----------|------------|-------------|-----------|-------------------|
| **NUC13ANHi3** | ~12,000 | Intel UHD | 16 | TB4 (2x) | 6x USB 3.2 | 15W idle, 35W load |
| **NUC13ANHi5** | ~18,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W idle, 45W load |
| **NUC13ANHi7** | ~20,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W idle, 50W load |
| **NUC13ANKi5** | ~18,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W idle, 45W load |
| **NUC13ANKi7** | ~20,000 | Intel Iris Xe | 16 | TB4 (2x) | 6x USB 3.2 | 15W idle, 50W load |
| **ROG NUC 2025** | ~35,000+ | RTX 5080 | 20 | TB4 (1x) | 7x USB 3.2 | 25W idle, 160W load |

*Approximate scores - actual performance may vary

### Memory and Storage Details

| Model | RAM Type | Max Capacity | RAM Slots | Storage Slots | Max Storage | Boot Options |
|-------|----------|--------------|-----------|---------------|-------------|--------------|
| **NUC13ANHi3** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANHi5** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANHi7** | DDR4-3200 SO-DIMM | 64GB | 2x | M.2 + SATA | 4TB + 4TB | UEFI, Legacy |
| **NUC13ANKi5** | DDR4-3200 SO-DIMM | 64GB | 2x | 2x M.2 | 8TB total | UEFI, Legacy |
| **NUC13ANKi7** | DDR4-3200 SO-DIMM | 64GB | 2x | 2x M.2 | 8TB total | UEFI, Legacy |
| **ROG NUC 2025** | DDR5-5600 SO-DIMM | 96GB | 2x | 2x M.2 | 8TB total | UEFI only |

### Connectivity and I/O

| Model | Ethernet | WiFi | Bluetooth | Display Outputs | Audio | Dimensions (mm) |
|-------|----------|------|-----------|-----------------|-------|-----------------|
| **NUC13ANHi3** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANHi5** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANHi7** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×54 |
| **NUC13ANKi5** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×35 |
| **NUC13ANKi7** | 2.5GbE | WiFi 6E | BT 5.3 | 2x TB4, 1x HDMI | 3.5mm | 117×117×35 |
| **ROG NUC 2025** | 2.5GbE | WiFi 7 | BT 5.4 | 2x DP2.1, 2x HDMI2.1 | 3.5mm | 282×188×57 |

## Server Platform Compatibility Matrix

### Operating System Support

| Model | Ubuntu Server | Debian | CentOS/RHEL | Windows Server | Proxmox | ESXi |
|-------|---------------|--------|-------------|----------------|---------|------|
| **NUC13ANHi3** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver req'd | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANHi5** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver req'd | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANHi7** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver req'd | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANKi5** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver req'd | ✅ 7.4+ | ✅ 7.0+ |
| **NUC13ANKi7** | ✅ 22.04+ | ✅ 11+ | ✅ 8+ | ⚠️ Driver req'd | ✅ 7.4+ | ✅ 7.0+ |
| **ROG NUC 2025** | ✅ 22.04+ | ✅ 12+ | ✅ 9+ | ❌ Not recommended | ✅ 8.0+ | ✅ 8.0+ |

### Community Platform Support

| Model | YunoHost | CasaOS | Caprover | Home Assistant | Nextcloud | Docker |
|-------|----------|--------|----------|----------------|-----------|--------|
| **NUC13ANHi3** | ✅ Good | ✅ Excellent | ✅ Good | ✅ Excellent | ✅ Good | ✅ Excellent |
| **NUC13ANHi5** | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent |
| **NUC13ANHi7** | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent |
| **NUC13ANKi5** | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent |
| **NUC13ANKi7** | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent |
| **ROG NUC 2025** | ⚠️ Overkill | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent |

## Recommended Configurations by Use Case

### Home Server Starter (Light Usage)
**Recommended: NUC13ANHi3**
- **RAM**: 16GB (2x 8GB DDR4-3200)
- **Storage**: 500GB NVMe SSD + 2TB SATA SSD
- **Use Cases**: File sharing, basic media streaming, personal cloud
- **Estimated Cost**: $400-500 (barebones + components)

### Balanced Home Server (Medium Usage)
**Recommended: NUC13ANHi5 or NUC13ANKi5**
- **RAM**: 32GB (2x 16GB DDR4-3200)
- **Storage**: 1TB NVMe SSD + 4TB SATA SSD (ANHi5) or 2x 2TB NVMe (ANKi5)
- **Use Cases**: Multiple services, container workloads, development
- **Estimated Cost**: $600-800 (barebones + components)

### High-Performance Server (Heavy Usage)
**Recommended: NUC13ANHi7 or NUC13ANKi7**
- **RAM**: 64GB (2x 32GB DDR4-3200)
- **Storage**: 2TB NVMe SSD + 4TB SATA SSD
- **Use Cases**: Virtualization, multiple VMs, intensive workloads
- **Estimated Cost**: $900-1200 (barebones + components)

### Gaming/Enthusiast Server
**Recommended: ROG NUC 2025**
- **RAM**: 64-96GB DDR5
- **Storage**: 2x 4TB NVMe SSD
- **Use Cases**: Game servers, GPU computing, AI workloads
- **Estimated Cost**: $3500+ (complete system)

## Model Selection Decision Tree

```
Do you need GPU acceleration or gaming performance?
├─ YES → ROG NUC 2025
└─ NO → Continue

Is maximum storage flexibility important?
├─ YES → NUC13ANKi5/i7 (dual M.2, no 2.5" bay)
└─ NO → Continue

What's your performance requirement?
├─ Basic (file sharing, simple services) → NUC13ANHi3
├─ Medium (containers, multiple services) → NUC13ANHi5
└─ High (virtualization, heavy workloads) → NUC13ANHi7
```

## Energy Efficiency Comparison

| Model | Idle Power | Typical Load | Max Power | Est. Annual Cost* |
|-------|------------|--------------|-----------|------------------|
| **NUC13ANHi3** | 5-8W | 15-25W | 35W | $15-30 |
| **NUC13ANHi5** | 6-10W | 20-35W | 45W | $20-40 |
| **NUC13ANHi7** | 8-12W | 25-40W | 50W | $25-45 |
| **NUC13ANKi5** | 6-10W | 20-35W | 45W | $20-40 |
| **NUC13ANKi7** | 8-12W | 25-40W | 50W | $25-45 |
| **ROG NUC 2025** | 20-30W | 80-120W | 160W | $80-130 |

*Based on $0.12/kWh, 24/7 operation

## Upgrade and Expansion Capabilities

### Memory Upgrades
- **All Standard Models**: Support up to 64GB DDR4-3200 SO-DIMM
- **ROG NUC**: Supports up to 96GB DDR5-5600 SO-DIMM
- **Installation**: Tool-free access in most models

### Storage Expansion
- **ANH Models**: 1x M.2 2280 + 1x 2.5" SATA bay
- **ANK Models**: 2x M.2 2280 slots (no 2.5" bay)
- **ROG NUC**: 2x M.2 2280 slots + advanced cooling

### Connectivity Expansion
- **Thunderbolt 4**: Supports external GPU, storage, networking
- **USB 3.2**: Multiple ports for additional peripherals
- **Network**: USB-to-Ethernet adapters for additional NICs

## Legacy Model Considerations

### When to Consider Older Models
- **Budget constraints**: NUC11/12 models offer good value
- **Specific compatibility**: Some software works better with older hardware
- **Available inventory**: Legacy models may be discounted

### Migration Path
- Start with current generation for best longevity
- Consider upgrade path when planning initial configuration
- Factor in driver support timeline

## Purchasing Recommendations

### Where to Buy
- **ASUS Direct**: Latest models, full warranty
- **System Integrators**: Pre-configured options
- **Major Retailers**: Competitive pricing, return policies
- **Used Market**: Legacy models at reduced prices

### What to Avoid
- **Very old models** (NUC6 and earlier): Limited modern OS support
- **Unknown sellers**: Warranty and support concerns
- **Incomplete kits**: Ensure all necessary components included

---

**Next Steps:**
- Review [nuc-bios-setup.md](nuc-bios-setup.md) for configuration guidelines
- Check [nuc-power-network.md](nuc-power-network.md) for setup best practices

*Specifications subject to change. Always verify with manufacturer documentation before purchase.*