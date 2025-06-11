# Router Troubleshooting Guide

This guide provides systematic troubleshooting procedures for common router setup and flashing problems including incomplete flash, unresponsive devices, firmware restoration, physical reset practices, and advanced serial recovery methods.

## Emergency Response Quick Reference

### Immediate Actions for Bricked Router

**If your router appears "bricked" (unresponsive):**

1. **Stay calm**: Most situations are recoverable
2. **Do not power cycle repeatedly**: This can worsen the situation
3. **Check LED patterns**: Note current behavior for diagnosis
4. **Verify power supply**: Ensure adequate voltage and current
5. **Try hardware reset**: Follow brand-specific procedures below

> **⚠️ Important**: Never attempt multiple recovery methods simultaneously. Complete one method fully before trying another.

## Hardware Reset Procedures

### Universal Reset Button Method

*`[Reset Button Location](router-reset-button.png)` — Highlighted photo of a typical hardware reset button on a router, showing button location and surrounding indicators.*

**Basic Reset Procedure**:
1. **Locate reset button**: Usually recessed hole labeled "RESET"
2. **Prepare tool**: Paperclip, pin, or similar pointed object
3. **Power on router**: Ensure device is fully powered
4. **Press and hold**: Insert tool and press button firmly
5. **Hold duration**: 10-30 seconds depending on manufacturer
6. **Release and wait**: Allow router to complete reboot cycle

### Brand-Specific Reset Procedures

**TP-Link Routers**:
```
Power State: ON
Button: WPS/RESET
Duration: 10+ seconds
Indicator: SYS LED changes from slow-flash to quick-flash
Action: Release button when LED pattern changes
```

**ASUS Routers**:
```
Power State: ON
Button: RESET (rear panel)
Duration: 5-10 seconds
Indicator: Power LED flashes rapidly
Action: Release when LED behavior changes
```

**GL.iNet Routers**:
```
Power State: ON
Button: RESET
Duration: 10 seconds
Indicator: LED turns off briefly then solid
Action: Release when LED stabilizes
```

**Ubiquiti Devices**:
```
Power State: Power on while holding
Button: RESET
Duration: Hold during power-on for 10 seconds
Indicator: LED sequence changes
Special: For TFTP recovery, continue holding until specific LED pattern
```

**Netgear Routers**:
```
Power State: ON
Button: RESET (rear or side)
Duration: 7+ seconds
Indicator: Power LED changes color or pattern
Action: Release when LED indicates factory reset mode
```

### Advanced Reset Modes

**RouterBOARD/MikroTik Reset Functions**:
- **3 seconds**: Load backup bootloader
- **Hold until LED flashes**: Reset configuration to default
- **+5 seconds (LED solid)**: Enable CAPs mode
- **+5 more seconds (LED off)**: Netinstall mode

## TFTP Recovery Procedures

### TFTP Recovery Setup

**Prerequisites**:
- **TFTP server software**: PumpKIN (Windows), tftpd (Linux/macOS)
- **Recovery firmware**: Appropriate factory firmware image
- **Network configuration**: Static IP in router's subnet
- **Direct connection**: Ethernet cable between computer and router

**Network Configuration**:
```
Computer IP: 192.168.0.66 (or 192.168.1.66)
Subnet Mask: 255.255.255.0
Gateway: (leave blank)
Router IP: 192.168.0.1 (or 192.168.1.1)
```

### TFTP Recovery Execution

**Standard TFTP Recovery Process**:

1. **Prepare TFTP server**:
   - Install and configure TFTP server software
   - Place recovery firmware in TFTP root directory
   - Start TFTP service

2. **Configure network**:
   - Set computer IP to appropriate subnet
   - Disable firewall temporarily
   - Ensure no other DHCP servers active

3. **Initiate recovery mode**:
   - Power off router completely
   - Hold reset button firmly
   - Apply power while continuing to hold reset
   - Watch for TFTP request in server logs

4. **File transfer**:
   - Router requests specific filename (often "recovery.bin")
   - TFTP server transfers firmware automatically
   - Wait for transfer completion (usually 30-60 seconds)

5. **Installation**:
   - Router flashes firmware internally
   - Wait 2-5 minutes for installation
   - Device reboots to factory firmware

### Brand-Specific TFTP Procedures

**TP-Link TFTP Recovery**:
```
Firmware Name: "recovery.bin" (rename your firmware file)
Router IP: 192.168.0.1
Computer IP: 192.168.0.66
Hold Reset: During power-on until transfer starts
Expected Duration: 30-45 seconds transfer, 2-3 minutes total
```

**Ubiquiti TFTP Recovery**:
```
Firmware Name: Original Ubiquiti firmware filename
Router IP: 192.168.1.20
Computer IP: 192.168.1.xxx (not .20)
Hold Reset: 20+ seconds during power-on
LED Pattern: Alternating 2-LED flash pattern indicates ready
```

**Netgear TFTP Recovery**:
```
Firmware Name: "recovery.img" or device-specific name
Router IP: 192.168.1.1
Computer IP: 192.168.1.2
Hold Reset: During power-on until Power LED turns amber
Indicator: Amber power LED indicates TFTP mode active
```

## Serial Console Recovery

### When to Use Serial Console

**Serial console recovery is necessary when**:
- TFTP recovery fails
- Bootloader is corrupted
- No network connectivity available
- Advanced debugging required

> **⚠️ Advanced Procedure**: Serial console recovery requires hardware modification and advanced technical skills. Proceed only if comfortable with electronics work.

### Serial Console Hardware Setup

*`[Serial Console Hookup](router-serial-console.png)` — Photo or diagram of attaching serial cables for advanced recovery, showing connection points and cable routing.*

**Required Equipment**:
- **USB-to-TTL adapter**: 3.3V logic levels (NOT RS232)
- **Jumper wires**: Female-to-male or appropriate connectors
- **Soldering equipment**: If header installation required
- **Multimeter**: For voltage verification

**Connection Mapping**:
```
Router          USB-TTL Adapter
GND     <--->   GND
TX      <--->   RX
RX      <--->   TX
VCC     <--->   (usually not connected)
```

> **🔌 Voltage Warning**: Ensure USB-TTL adapter operates at 3.3V. 5V levels can damage router circuitry permanently.

### Serial Console Access

**Software Configuration**:
- **Baud Rate**: 115200 (most common)
- **Data Bits**: 8
- **Parity**: None
- **Stop Bits**: 1
- **Flow Control**: None

**Terminal Software Options**:
- **Windows**: PuTTY, TeraTerm
- **macOS**: Screen, Minicom
- **Linux**: Minicom, Screen, Picocom

**Connection Commands**:
```bash
# Linux/macOS
screen /dev/ttyUSB0 115200

# Alternative Linux
minicom -D /dev/ttyUSB0 -b 115200

# Windows (use PuTTY GUI or)
putty -serial COM3 -sercfg 115200,8,n,1,N
```

### Bootloader Intervention

**Common Bootloader Prompts**:
- **U-Boot**: "Hit any key to stop autoboot"
- **CFE**: "CFE>" prompt
- **RedBoot**: "RedBoot>" prompt

**Typical Recovery Commands**:
```bash
# U-Boot TFTP recovery
setenv ipaddr 192.168.1.1
setenv serverip 192.168.1.100
tftp 0x80060000 firmware.bin
erase 0x9f020000 +0x7e0000
cp.b 0x80060000 0x9f020000 $filesize
bootm 0x9f020000

# Reset environment variables
env default -a
saveenv
reset
```

## Firmware Restoration Procedures

### Restoring Original Firmware

*`[Restoring Firmware Process](restoring-firmware.png)` — Series or diagram showing the steps of recovering from a failed install, including cable connections and interface screenshots.*

**When to Restore Original Firmware**:
- LibreMesh installation failed
- Device performance issues
- Warranty considerations
- Selling/returning device

**Restoration Methods Priority**:
1. **Web interface upgrade**: If LibreMesh/OpenWrt still accessible
2. **TFTP recovery**: Using original factory firmware
3. **Serial console**: For severe bootloader issues
4. **Professional service**: If above methods fail

### Stock Firmware Acquisition

**Official Sources**:
- **Manufacturer website**: Downloads/support section
- **Device model page**: Exact firmware for your revision
- **Version matching**: Ensure firmware matches hardware revision exactly

**Firmware Selection**:
- **Factory firmware**: For complete restoration
- **Recovery firmware**: Special minimal versions for TFTP
- **Regional versions**: Match original firmware region if specified

## Common Problem Diagnosis

### LED Pattern Analysis

**Normal Boot Patterns**:
- **Power on**: All LEDs illuminate briefly
- **Boot process**: Sequential LED activation
- **Normal operation**: Steady power, wireless, and ethernet LEDs

**Problem Indicators**:
- **All LEDs off**: Power supply failure
- **Power LED only**: Boot failure, try reset
- **Rapid flashing**: Often indicates recovery mode
- **Alternating patterns**: May indicate TFTP mode
- **Continuous boot loops**: Corrupted firmware

### Network Connectivity Tests

**Basic Connectivity Verification**:
```bash
# Check network interface status
ip link show                    # Linux
ipconfig /all                   # Windows
ifconfig -a                     # macOS

# Test router connectivity
ping 192.168.1.1
ping 192.168.0.1
ping thisnode.info

# Check routing table
ip route                        # Linux
route print                     # Windows
netstat -rn                     # macOS

# Scan for devices
nmap -sn 192.168.1.0/24        # Common router subnet
arp -a                          # Show known devices
```

### Memory and Performance Issues

**Symptoms of Insufficient Memory**:
- Slow web interface response
- Connection timeouts
- Service crashes
- Inability to install packages

**Memory Diagnostics**:
```bash
# Check available memory
free -h
cat /proc/meminfo

# Check flash usage
df -h
du -sh /overlay/*

# Monitor running processes
top
ps aux
```

## Prevention and Maintenance

### Pre-Flash Precautions

**Before Any Firmware Installation**:
- [ ] **Verify power stability**: Use UPS if available
- [ ] **Check firmware compatibility**: Exact model/revision match
- [ ] **Backup current firmware**: If upgrade path available
- [ ] **Read installation notes**: Device-specific requirements
- [ ] **Prepare recovery tools**: TFTP server, serial adapter
- [ ] **Document current settings**: Network configuration backup

### Regular Maintenance Practices

**Monthly Maintenance**:
- **Check system logs**: Review for errors or warnings
- **Monitor memory usage**: Ensure sufficient free space
- **Verify mesh connectivity**: Test network paths
- **Update security keys**: Rotate passwords if needed

**Quarterly Maintenance**:
- **Firmware updates**: Check for LibreMesh releases
- **Configuration backup**: Save current settings
- **Performance testing**: Bandwidth and latency checks
- **Physical inspection**: Check for overheating or damage

## Emergency Contact Information

### Community Support Resources

**LibreMesh Community**:
- **Mailing List**: lime-users@lists.libremesh.org
- **IRC Channel**: #libremesh on oftc.net
- **Forum**: Community discussions and troubleshooting

**OpenWrt Community**:
- **Forum**: https://forum.openwrt.org/
- **Wiki**: Device-specific troubleshooting guides
- **Developer lists**: Technical implementation issues

### Professional Recovery Services

**When to Seek Professional Help**:
- Hardware modification required (soldering)
- Bootloader corruption beyond serial recovery
- Critical deployment with time constraints
- Insurance/warranty coverage available

## Recovery Success Verification

### Post-Recovery Checklist

After any recovery procedure:

- [ ] **Router responds**: Web interface or SSH accessible
- [ ] **Network connectivity**: Internet access restored
- [ ] **All interfaces functional**: Wireless and ethernet working
- [ ] **LED patterns normal**: Standard operational indicators
- [ ] **Performance acceptable**: No obvious speed/stability issues
- [ ] **Configuration restored**: Settings match requirements

### Long-term Monitoring

**Monitor for Recurring Issues**:
- **System stability**: Uptime and crash frequency
- **Memory usage trends**: Growing memory consumption
- **Network performance**: Bandwidth and latency changes
- **Log analysis**: Repeated error patterns

> **📋 Documentation**: Keep detailed records of all troubleshooting procedures and their outcomes. This information is valuable for preventing future issues and helping community members with similar problems.

## Related Guides

- **[Router Selection Guide](router-selection-guide.md)**: Choose appropriate hardware to minimize problems
- **[LibreMesh Installation Guide](libremesh-installation.md)**: Proper installation procedures to avoid issues
- **LibreMesh Configuration**: Advanced configuration to optimize performance