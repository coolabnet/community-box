# Hardware Compatibility Check Guide for Recycled Servers

## Overview

This guide provides comprehensive procedures for verifying and testing component compatibility in recycled computers before deploying them as community servers. Proper compatibility testing prevents deployment issues and ensures stable operation.

## Pre-Testing Preparation

### Initial Assessment Checklist
- [ ] Document all visible hardware components
- [ ] Take photos of current configuration
- [ ] Record model numbers and serial numbers
- [ ] Check for obvious physical damage
- [ ] Verify all cables and connections are present
- [ ] Ensure adequate workspace and tools available

### Required Tools and Software
- **Hardware Tools**:
  - Phillips head screwdriver set
  - Anti-static wrist strap
  - Digital multimeter
  - Compressed air canister
  - Thermal paste (if needed)
  - Spare known-good components for testing

- **Software Tools**:
  - Bootable USB with diagnostic tools
  - CPU-Z for component identification
  - MemTest86+ for RAM testing
  - CrystalDiskInfo for storage health
  - Prime95 or stress testing software
  - Hardware vendor diagnostic utilities

## CPU Compatibility Verification

### Socket and Chipset Compatibility
1. **Identify Current CPU**:
   - Use CPU-Z to identify exact model
   - Check socket type (LGA1151, AM4, etc.)
   - Verify chipset compatibility

2. **Check Upgrade Options**:
   ```
   Search Format: "[Motherboard Model] CPU compatibility list"
   Example: "Dell OptiPlex 7050 supported CPU list"
   ```

3. **BIOS Support Verification**:
   - Check current BIOS version
   - Verify if CPU requires BIOS update
   - Download latest BIOS from manufacturer

### CPU Testing Procedure
```bash
# Basic CPU Information
lscpu                    # Linux command
wmic cpu get name        # Windows command

# Stress Testing
prime95                  # Run for 30 minutes minimum
stress -c 4 -t 1800     # Linux stress test
```

### Performance Validation
- [ ] All cores detected correctly
- [ ] Operating frequencies within specification
- [ ] Temperature stays below 80°C under load
- [ ] No thermal throttling detected
- [ ] Virtualization features enabled (if required)

## Memory (RAM) Compatibility Testing

### Memory Specification Verification

| Factor | Check Method | Requirements |
|--------|--------------|--------------|
| Type | Physical inspection/CPU-Z | DDR3/DDR4 match motherboard |
| Speed | BIOS/UEFI settings | Supported by both CPU and motherboard |
| Capacity | System Properties | Within motherboard maximum |
| Timing | Memory stress testing | Stable at rated speeds |
| ECC | Hardware documentation | Match motherboard ECC support |

### Memory Testing Protocol

#### Step 1: Basic Recognition Test
```bash
# Linux Memory Detection
free -h
cat /proc/meminfo
dmidecode --type memory

# Windows Memory Detection
wmic memorychip get capacity,speed,memorytype
```

#### Step 2: Comprehensive Memory Test
1. **Boot MemTest86+** from USB drive
2. **Run complete test cycles** (minimum 2 passes)
3. **Test each stick individually** if errors occur
4. **Test different slot combinations**

#### Step 3: Operating System Memory Test
```bash
# Windows Memory Diagnostic
mdsched.exe

# Linux Memory Test
memtester 1024M 5    # Test 1GB, 5 iterations
```

### Memory Compatibility Matrix

| Motherboard Generation | Supported Types | Max Capacity | Speeds |
|----------------------|----------------|--------------|---------|
| Intel 6th-8th Gen | DDR4 | 32-64 GB | 2133-2666 MHz |
| Intel 4th-5th Gen | DDR3/DDR3L | 16-32 GB | 1333-1600 MHz |
| AMD AM4 | DDR4 | 64-128 GB | 2133-3200 MHz |
| AMD FM2+ | DDR3 | 32 GB | 1333-2133 MHz |

## Storage Compatibility Assessment

### Interface Compatibility Check

#### SATA Compatibility
```bash
# Check SATA mode (AHCI/IDE)
dmesg | grep -i sata
lspci | grep -i sata

# Windows SATA information
devmgmt.msc (Device Manager > IDE ATA/ATAPI controllers)
```

#### NVMe Compatibility
- **Requirements**: PCIe 3.0+ M.2 slot with NVMe support
- **BIOS Setting**: NVMe mode enabled
- **Boot Support**: UEFI firmware with NVMe boot capability

### Storage Testing Procedures

#### Health Assessment
1. **Check Drive Health**:
   ```bash
   # Linux
   smartctl -a /dev/sda
   hdparm -I /dev/sda
   
   # Windows
   wmic diskdrive get status
   chkdsk C: /f
   ```

2. **Performance Testing**:
   ```bash
   # Sequential Read/Write Test
   dd if=/dev/zero of=/tmp/testfile bs=1G count=1 oflag=direct
   dd if=/tmp/testfile of=/dev/null bs=1G count=1 iflag=direct
   
   # Windows (using CrystalDiskMark)
   crystaldiskmark.exe
   ```

### Storage Compatibility Matrix

| Interface | Speed | Hot-Swap | Boot Support | Recommended Use |
|-----------|--------|----------|--------------|-----------------|
| SATA III | 6 Gbps | Yes* | Yes | Primary storage |
| SATA II | 3 Gbps | Yes* | Yes | Secondary storage |
| NVMe | 32 Gbps | No | Yes** | Boot/system drive |
| USB 3.0 | 5 Gbps | Yes | Limited | External/backup |

*Requires hot-swap capable chassis
**Requires UEFI firmware

## Network Component Testing

### Ethernet Controller Verification
```bash
# Linux Network Interface Check
ip link show
ethtool eth0
lspci | grep -i ethernet

# Windows Network Adapter Check
ipconfig /all
devmgmt.msc (Network adapters)
```

### Network Performance Testing
1. **Link Speed Verification**:
   ```bash
   # Check negotiated speed
   ethtool eth0 | grep Speed
   cat /sys/class/net/eth0/speed
   ```

2. **Throughput Testing**:
   ```bash
   # iperf3 network performance test
   iperf3 -s                    # Server mode
   iperf3 -c [server_ip]        # Client mode
   ```

### Wireless Compatibility (if applicable)
- **Driver Availability**: Check Linux/Windows driver support
- **Standard Support**: 802.11n minimum (802.11ac preferred)
- **Enterprise Features**: WPA2-Enterprise, 802.1X support

## Power Supply Compatibility

### Power Requirements Calculation

| Component | Typical Power Draw | High-End Power Draw |
|-----------|-------------------|-------------------|
| Intel i5 CPU | 65W | 95W |
| Intel i7 CPU | 65W | 125W |
| DDR4 RAM (8GB) | 3W | 5W |
| 2.5" SSD | 2W | 3W |
| 3.5" HDD | 6W | 10W |
| Motherboard | 25W | 35W |
| Network Card | 5W | 10W |

### PSU Testing Protocol
1. **Voltage Testing**:
   ```bash
   # Check PSU voltages under load
   sensors            # Linux hardware monitoring
   +3.3V: 3.14V - 3.47V (±5%)
   +5V:   4.75V - 5.25V (±5%)
   +12V:  11.40V - 12.60V (±5%)
   ```

2. **Load Testing**:
   - Run stress test on CPU and GPU simultaneously
   - Monitor voltages throughout test
   - Check for system stability under maximum load

### PSU Compatibility Requirements
- **Wattage**: 150% of calculated maximum power draw
- **Efficiency**: 80 PLUS Bronze minimum
- **Connectors**: Match motherboard and storage requirements
- **Form Factor**: ATX/SFX compatibility with chassis

## Expansion Card Compatibility

### PCIe Slot Verification
```bash
# Check available PCIe slots
lspci -vv
lspci | grep -i pci

# Check PCIe versions and lanes
lspci -vvv | grep LnkCap
```

### Common Expansion Cards Testing

#### Network Interface Cards
- **Driver Compatibility**: Operating system support
- **Performance**: Gigabit minimum throughput
- **Features**: VLAN, jumbo frame support

#### Storage Controllers
- **RAID Support**: Hardware vs. software RAID
- **Drive Compatibility**: SATA/SAS support matrix
- **Performance**: IOPs and throughput benchmarks

## Thermal Management Verification

### Cooling System Assessment
1. **Fan Operation Check**:
   ```bash
   # Monitor fan speeds
   sensors
   pwmconfig          # Configure PWM fan control
   ```

2. **Temperature Monitoring**:
   ```bash
   # Continuous temperature monitoring
   watch sensors
   stress --cpu 4 --timeout 600s  # 10-minute stress test
   ```

### Thermal Testing Protocol
- **Idle Temperatures**: < 40°C for CPU
- **Load Temperatures**: < 80°C for CPU under stress
- **Fan Response**: Automatic speed adjustment based on temperature
- **Thermal Throttling**: No throttling under normal server loads

## Compatibility Testing Automation

### Hardware Detection Script
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

### Windows PowerShell Script
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

## Compatibility Documentation

### Test Results Template
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

## Troubleshooting Common Issues

### Memory Compatibility Problems
**Symptoms**: System won't boot, random crashes, blue screens
**Solutions**:
- Test memory sticks individually
- Check supported memory types in motherboard manual
- Update BIOS to latest version
- Adjust memory timing in BIOS
- Use memory from motherboard QVL (Qualified Vendor List)

### Storage Compatibility Issues
**Symptoms**: Drive not detected, slow performance, boot failures
**Solutions**:
- Verify SATA mode (AHCI vs IDE) in BIOS
- Check cable connections and try different SATA ports
- Update storage controller drivers
- Enable NVMe support in BIOS for M.2 drives
- Check for firmware updates on storage devices

### Network Compatibility Problems
**Symptoms**: No network connectivity, limited speeds, driver issues
**Solutions**:
- Download and install latest network drivers
- Check cable and port connections
- Test with known-good network cable
- Verify network settings in BIOS
- Consider add-in network card if onboard fails

## Quality Assurance Checklist

### Final Compatibility Verification
- [ ] All components properly detected by OS
- [ ] No hardware conflicts in Device Manager
- [ ] System stable under load for 24+ hours
- [ ] All expected features functional
- [ ] Performance meets minimum requirements
- [ ] Documentation complete and accurate

### Burn-in Testing Protocol
1. **48-Hour Stress Test**:
   - CPU: 100% load for 8 hours daily
   - Memory: Continuous testing rotation
   - Storage: Read/write cycle testing
   - Network: Continuous throughput testing

2. **Temperature Monitoring**:
   - Log temperatures throughout burn-in
   - Verify no thermal throttling
   - Confirm fan operation at various loads

3. **Stability Verification**:
   - No system crashes or freezes
   - No error messages in system logs
   - All components maintain rated performance

## Next Steps

After completing compatibility testing:

1. **Document Results**: Complete compatibility test report
2. **Physical Preparation**: Follow [Recycled Preparation](recycled-preparation.md) guide
3. **BIOS Configuration**: Use [BIOS Access and Setup](bios-access-and-setup.md) for server optimization
4. **Operating System**: Install and configure server OS
5. **Service Configuration**: Deploy intended server services

---

*Compatibility testing should be performed in a controlled environment with proper safety precautions. Always verify compatibility with intended operating system and server applications.*