# Recycled PC Hardware Requirements for Community Servers

## Overview

This guide establishes minimum and recommended hardware specifications for selecting suitable recycled computers to repurpose as community servers. These requirements balance performance needs with the practical limitations of older hardware while ensuring reliability for server workloads.

## Minimum Hardware Requirements

### Processor (CPU)
- **Minimum**: 64-bit processor (x86_64 architecture)
- **Clock Speed**: 1.4 GHz or higher
- **Cores**: At least 2 cores (4 cores recommended)
- **Generation**: Intel 4th generation (Haswell) or AMD equivalent and newer
- **Required Features**:
  - Support for NX bit and DEP
  - CMPXCHG16b, LAHF/SAHF, and PrefetchW instructions
  - Virtualization support (Intel VT-x or AMD-V)
  - Second Level Address Translation (EPT or NPT)

### Memory (RAM)
- **Absolute Minimum**: 4 GB DDR3/DDR4
- **Recommended Minimum**: 8 GB
- **Optimal**: 16 GB or more
- **Type**: DDR3-1600 or DDR4-2400 minimum
- **ECC Support**: Preferred but not required

### Storage
- **Boot Drive**: Minimum 120 GB SSD (256 GB recommended)
- **Data Storage**: 1 TB HDD minimum for file server functions
- **Interface**: SATA 3.0 (6 Gbps) preferred
- **RAID Support**: Hardware RAID controller preferred for redundancy

### Network Connectivity
- **Ethernet**: Gigabit Ethernet (1000 Mbps) required
- **Wi-Fi**: 802.11n minimum (802.11ac preferred)
- **Multiple NICs**: Beneficial for advanced networking configurations

### Power Supply
- **Wattage**: 300W minimum (efficiency rated preferred)
- **Efficiency**: 80 PLUS Bronze or better
- **Redundancy**: Dual PSU capability preferred for critical applications

## Recommended Hardware Specifications

### Enhanced Server Configuration
- **CPU**: Intel i5/i7 6th gen+ or AMD Ryzen 3/5/7
- **RAM**: 16-32 GB DDR4
- **Storage**: 512 GB NVMe SSD + 2+ TB HDD array
- **Network**: Dual Gigabit NICs
- **Form Factor**: Small Form Factor (SFF) or Micro tower preferred

## Hardware Selection Checklist

### Pre-Purchase Assessment
- [ ] Verify CPU meets 64-bit requirements
- [ ] Check maximum supported RAM capacity
- [ ] Confirm working Ethernet ports
- [ ] Test all USB ports functionality
- [ ] Inspect for physical damage or excessive wear
- [ ] Verify power supply functionality
- [ ] Check BIOS/UEFI accessibility
- [ ] Confirm expansion slot availability

### Compatibility Verification
- [ ] CPU supports virtualization features
- [ ] Motherboard supports target RAM configuration
- [ ] Storage interfaces match available drives
- [ ] Network cards support required speeds
- [ ] Power supply meets total system requirements
- [ ] BIOS/UEFI supports modern boot modes

### Physical Condition Assessment
- [ ] No visible component damage
- [ ] Clean internal components possible
- [ ] Adequate cooling system present
- [ ] All expansion slots accessible
- [ ] No signs of liquid damage
- [ ] Minimal dust accumulation

## Form Factor Considerations

### Desktop Towers
- **Pros**: Excellent expandability, good cooling, multiple drive bays
- **Cons**: Larger footprint, higher power consumption
- **Best For**: File servers, development servers, high-capacity storage

### Small Form Factor (SFF)
- **Pros**: Compact size, lower power consumption, quiet operation
- **Cons**: Limited expansion, fewer drive bays
- **Best For**: Web servers, lightweight applications, space-constrained environments

### Mini/Micro PCs
- **Pros**: Very compact, low power, silent operation
- **Cons**: Very limited expansion, often laptop components
- **Best For**: Basic services, edge computing, testing environments

## Budget Guidelines

### Cost-Effective Ranges
- **Basic Server**: $100-200 (older business PCs)
- **Capable Server**: $200-400 (recent business machines)
- **Performance Server**: $400-600 (workstation-class hardware)

### Total Cost of Ownership
- Factor in potential upgrade costs (RAM, storage)
- Consider power consumption over 3-5 years
- Account for replacement part availability
- Budget for initial refurbishment supplies

## Exclusion Criteria

### Avoid These Configurations
- 32-bit only processors
- Less than 4 GB maximum RAM capacity
- IDE/PATA storage interfaces only
- 100 Mbps Ethernet maximum
- Proprietary form factors with limited upgrade paths
- Systems with known reliability issues
- Machines requiring expensive proprietary components

## Special Considerations

### Low-Power Requirements
For energy-efficient operations:
- Target systems with 35W TDP CPUs
- Look for 80 PLUS Gold or higher PSUs
- Consider systems with solid-state cooling
- Prioritize Intel Atom or low-power AMD processors

### Redundancy and Reliability
For mission-critical applications:
- Prefer systems with ECC RAM support
- Look for dual PSU capability
- Consider RAID controller support
- Prioritize business/enterprise equipment

### Scalability Planning
- Choose systems with available expansion slots
- Ensure adequate power supply headroom
- Verify maximum supported RAM limits
- Consider clustering capability for future growth

## Quick Reference Specifications

| Component | Minimum | Recommended | Optimal |
|-----------|---------|-------------|---------|
| CPU | Dual-core 1.4GHz | Quad-core 2.0GHz+ | 6+ cores 3.0GHz+ |
| RAM | 4 GB DDR3 | 8 GB DDR4 | 16+ GB DDR4 |
| Storage | 120 GB SSD | 256 GB SSD + 1 TB HDD | 512 GB NVMe + 2+ TB |
| Network | 100 Mbps | 1 Gbps | Dual 1 Gbps |
| Power | 300W | 400W 80+ Bronze | 500W+ 80+ Gold |

## Next Steps

1. **Review**: [Recycled Models Comparison](recycled-models-comparison.md) for specific model recommendations
2. **Test**: Use [Hardware Compatibility Check](hardware-compatibility-check.md) to verify components
3. **Prepare**: Follow [Recycled Preparation](recycled-preparation.md) for refurbishment
4. **Configure**: Apply appropriate BIOS configuration for your specific hardware

---

*This guide provides general recommendations. Always verify specific compatibility requirements for your intended server applications and operating system.*