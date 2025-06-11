# Router Selection Guide for LibreMesh Community Networks

This guide helps you evaluate and select routers that are compatible and reliable for LibreMesh firmware installation and community networking purposes. Making the right hardware choice is crucial for a successful community network deployment.

## Quick Decision Matrix

Before diving into detailed specifications, use this matrix to quickly determine if a router is suitable for your LibreMesh deployment:

| Requirement | Minimum | Recommended | Ideal |
|-------------|---------|-------------|-------|
| Flash Memory | 8 MB | 16 MB | 32+ MB |
| RAM | 64 MB | 128 MB | 256+ MB |
| Radios | 1 (2.4 GHz) | 2 (2.4 + 5 GHz) | 3+ (Multiple 5 GHz) |
| Ethernet Ports | 1 LAN | 4 LAN + 1 WAN | 5+ Gigabit |
| Chipset | Any OpenWrt-supported | Atheros/MediaTek | Atheros ath9k/ath10k |

*`[Router Hardware Lineup](router-lineup.png)` — Photo showcasing several recommended router models side-by-side, including TP-Link, GL.iNet, and Asus models.*

## Hardware Requirements Deep Dive

### Memory Specifications

**Flash Memory (Storage)**
- **8 MB minimum**: Allows basic LibreMesh installation with `-mini` firmware
- **16 MB recommended**: Standard LibreMesh with full feature set
- **32+ MB ideal**: Enables additional packages, extensive logging, and future upgrades

**RAM (System Memory)**
- **64 MB minimum**: Basic mesh operation with limited concurrent connections
- **128 MB recommended**: Stable performance with 20-50 devices
- **256+ MB ideal**: High-capacity nodes supporting 100+ devices and advanced features

*`[Specs Label Closeup](router-specs-label.png)` — Close-up of a router's sticker showing relevant specs/labels including memory specifications and model information.*

> **💡 Tip**: Look for the specifications label on the bottom or back of the router. Memory specifications are often listed as "Flash: XXX MB" and "RAM: XXX MB".

### Wireless Radio Requirements

**Essential Radio Configuration**
- **2.4 GHz radio**: Required for client access and mesh backhaul
- **5 GHz radio**: Strongly recommended for high-speed mesh backhaul
- **Multiple 5 GHz radios**: Ideal for dedicated backhaul and client access separation

**Supported Chipsets (Priority Order)**
1. **Atheros ath9k** (AR9xxx series): Best LibreMesh compatibility
2. **Atheros ath10k** (QCA9xxx series): Good performance, wider Wi-Fi 6 support
3. **MediaTek MT76xx**: Reliable alternative with good price/performance ratio
4. **Broadcom**: Limited LibreMesh support, avoid if possible

> **⚠️ Warning**: Avoid routers with Realtek wireless chipsets as they have poor LibreMesh/OpenWrt support.

### Network Interface Requirements

**Ethernet Connectivity**
- **Minimum**: 1 LAN port for configuration and local connections
- **Standard**: 4 LAN ports + 1 WAN port for typical installations
- **Advanced**: Gigabit ports with PoE support for professional deployments

**Special Considerations**
- **WAN port flexibility**: Some single-port devices can be configured with software WAN
- **PoE capability**: Essential for outdoor installations and remote powering
- **Switch integration**: Built-in switches reduce equipment requirements

## Recommended Router Models by Category

### Budget-Friendly Options ($30-60)

**TP-Link Archer C7 v2/v5**
- Flash: 16 MB | RAM: 128 MB
- Dual-band AC1750 (2.4GHz + 5GHz)
- Atheros QCA9558 + QCA9880 chipset
- Pros: Excellent OpenWrt support, proven reliability
- Cons: Older Wi-Fi 5 standard

**GL.iNet GL-AR300M16**
- Flash: 16 MB | RAM: 128 MB  
- Single-band N300 (2.4GHz only)
- Atheros AR9331 chipset
- Pros: Compact size, pre-installed OpenWrt
- Cons: Single radio limits mesh performance

### Mid-Range Options ($60-120)

**TP-Link Archer C6 v3.x**
- Flash: 16 MB | RAM: 128 MB
- Dual-band AC1200 (2.4GHz + 5GHz)
- MediaTek MT7621A + MT7603E/MT7613BE
- Pros: Good price-performance, stable chipset
- Cons: Requires careful version checking

**GL.iNet Flint (GL-AX1800)**
- Flash: 128 MB | RAM: 512 MB
- Dual-band AX1800 Wi-Fi 6
- Qualcomm IPQ6010 chipset
- Pros: Wi-Fi 6 support, large memory
- Cons: Newer chipset with limited community testing

### Professional/High-Performance ($120+)

**Ubiquiti Rocket M2/M5**
- Flash: 8 MB | RAM: 64 MB
- Single-band dedicated mesh radios
- Atheros AR7241 + AR9280 chipset
- Pros: Purpose-built for WISP/mesh, weatherproof
- Cons: Requires separate access point for clients

**ASUS TUF-AX6000**
- Flash: 256 MB | RAM: 1 GB
- Tri-band AX6000 Wi-Fi 6
- MediaTek MT7986A Filogic chipset
- Pros: Enterprise-grade performance, extensive memory
- Cons: Higher power consumption, complex configuration

### Outdoor/Specialized Options

**Ubiquiti NanoStation M2/M5**
- Flash: 8 MB | RAM: 32 MB
- Point-to-point/point-to-multipoint links
- Atheros AR7240 + AR9280 chipset
- Pros: Weatherproof, integrated antenna, long range
- Cons: Limited for general-purpose routing

## Brand-Specific Considerations

### TP-Link Devices

**Advantages:**
- Wide OpenWrt/LibreMesh compatibility
- Cost-effective options across all price ranges
- Good availability worldwide

**Considerations:**
- **FCC Lock bypass**: Newer models may require DD-WRT intermediate step
- **Version checking**: Hardware revisions can vary significantly
- **Firmware naming**: Factory images must match exact official naming

> **⚠️ FCC Lock Warning**: TP-Link devices manufactured after 2016 may have firmware restrictions. Look for "18005" or "Invalid Filename" errors during flashing, which indicate FCC lock protection.

### GL.iNet Devices

**Advantages:**
- Pre-installed OpenWrt with easy LibreMesh upgrade path
- Compact travel-friendly form factors
- Good documentation and community support

**Considerations:**
- **Custom OpenWrt**: May use older or modified OpenWrt versions
- **Limited outdoor options**: Most models designed for indoor use
- **Price premium**: Often more expensive than equivalent TP-Link options

### ASUS Devices

**Advantages:**
- High-performance hardware with generous memory
- Good build quality and reliability
- Advanced networking features

**Considerations:**
- **Complex installation**: May require ASUS-specific flashing procedures
- **Higher cost**: Premium pricing compared to alternatives
- **Power requirements**: Often require more power than budget options

### Ubiquiti Devices

**Advantages:**
- Purpose-built for wireless networking
- Weatherproof outdoor options
- Excellent long-range performance

**Considerations:**
- **AirOS compatibility**: Avoid AirOS 5.6.x (requires downgrade)
- **Limited routing**: Some models designed as bridges/access points only
- **Professional focus**: May be overkill for small deployments

## Router Selection Decision Tree

### For Indoor Home/Office Networks
1. **Small (1-10 devices)**: GL.iNet GL-AR300M16 or TP-Link Archer C7
2. **Medium (10-30 devices)**: TP-Link Archer C6 v3 or GL.iNet Flint
3. **Large (30+ devices)**: ASUS TUF-AX6000 or multiple coordinated nodes

### For Outdoor Community Networks
1. **Point-to-point links**: Ubiquiti NanoStation M2/M5
2. **Mesh backhaul**: Ubiquiti Rocket M2/M5 with sector antennas
3. **Client access**: TP-Link outdoor models with weatherproof enclosures

### For Mixed Indoor/Outdoor Deployments
1. **Backbone nodes**: High-performance indoor routers with good cooling
2. **Extension nodes**: Weatherproof outdoor units
3. **Client access**: Strategically placed indoor access points

## Pre-Purchase Checklist

Before purchasing any router for LibreMesh use:

- [ ] **Verify OpenWrt compatibility** on the official Table of Hardware
- [ ] **Check hardware revision** matches supported versions exactly
- [ ] **Confirm memory specifications** meet your deployment requirements
- [ ] **Research installation complexity** for your specific model/revision
- [ ] **Check antenna connector types** if external antennas are needed
- [ ] **Verify power requirements** and PoE compatibility if needed
- [ ] **Read recent community reports** on LibreMesh mailing lists/forums

## Common Pitfalls to Avoid

### Hardware Selection Mistakes
- **Insufficient memory**: 4MB flash or 32MB RAM severely limits functionality
- **Wrong hardware revision**: Different revisions may have incompatible installation procedures
- **Unsupported chipsets**: Realtek or proprietary wireless chipsets
- **Single-band limitation**: 2.4GHz-only routers limit mesh performance

### Purchasing Considerations
- **Version confusion**: Ensure exact model and revision compatibility
- **Firmware lock**: Newer devices may have installation restrictions
- **Antenna limitations**: Non-removable antennas limit deployment flexibility
- **Power supply**: Missing or incompatible power adapters

## Next Steps

Once you've selected appropriate hardware:

1. **Proceed to [LibreMesh Installation Guide](libremesh-installation.md)** for firmware flashing procedures
2. **Review [Router Troubleshooting Guide](router-troubleshooting.md)** for recovery procedures
3. **Plan your network topology** considering radio capabilities and coverage requirements
4. **Prepare installation tools** including appropriate cables and software

> **📖 Related Reading**: For detailed installation instructions specific to your chosen router model, consult the LibreMesh hardware documentation and OpenWrt device pages before beginning firmware installation.