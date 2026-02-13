# LibreMesh Firmware Installation Guide

This comprehensive guide provides step-by-step instructions for downloading, verifying, preparing, and flashing LibreMesh firmware onto your target router. Follow these procedures carefully to ensure a successful installation and avoid device damage.

## Pre-Installation Requirements

### Hardware Preparation
- **Router**: Compatible device from [Router Selection Guide](router-selection-guide.md)
- **Computer**: Windows, macOS, or Linux machine with Ethernet port
- **Ethernet cable**: Cat5e or Cat6 cable for wired connection
- **Power supply**: Original router power adapter
- **Tools**: Paperclip or similar for reset button (if needed)

### Software Requirements
- **Web browser**: Chrome, Firefox, Safari, or Edge
- **TFTP client**: For recovery situations (PumpKIN, Tftpd64, or built-in)
- **Terminal/Command prompt**: For network diagnostics

> **⚠️ Safety Notice**: Firmware installation carries risk of device damage ("bricking"). Ensure stable power supply and follow instructions precisely. Never interrupt the flashing process.

## Step 1: Download LibreMesh Firmware

### Finding Your Router's Firmware

*`[Firmware Selector Screenshot](libremesh-download-page.png)` — LibreMesh Firmware Selector tool for finding the correct firmware.*

1. **Visit the LibreMesh Firmware Selector**: https://firmware-selector.libremesh.org/
2. **Navigate to your router category**: Browse by manufacturer (TP-Link, GL.iNet, Asus, etc.)
3. **Locate exact model and revision**: Match your device precisely
4. **Choose firmware type**:
   - **`-factory.bin`**: For routers with stock/original firmware
   - **`-sysupgrade.bin`**: For routers already running OpenWrt/LibreMesh

### Firmware Verification

> **🔒 Security Best Practice**: Always verify firmware integrity before installation to prevent corrupted or malicious firmware from damaging your device.

**Download verification files** alongside your firmware:
- **SHA256 checksum file**: Usually named `sha256sums`
- **GPG signature**: Often `sha256sums.gpg` for authenticity verification

**Verify checksum (Linux/macOS)**:
```bash
sha256sum -c sha256sums
```

**Verify checksum (Windows)**:
```powershell
Get-FileHash -Algorithm SHA256 filename.bin
```

**Compare output** with the value in the checksum file. They must match exactly.

> **💡 Tip**: If checksums don't match, re-download the firmware. Never install firmware with mismatched checksums.

## Step 2: Prepare Your Network Connection

### Computer Network Configuration

1. **Disable wireless connections**: Turn off Wi-Fi to avoid routing conflicts
2. **Configure static IP**: Set your computer's Ethernet interface to match router subnet
   - **IP Address**: 192.168.1.100 (or 192.168.0.100)
   - **Subnet Mask**: 255.255.255.0
   - **Gateway**: Leave blank for now

### Physical Connection Setup

*`[Ethernet Connection Preparation](ethernet-cable-setup.png)` — User connecting LAN cable between computer and router for flashing, showing proper cable routing and connection points.*

1. **Power off router**: Unplug power adapter completely
2. **Connect Ethernet cable**: Computer to router LAN port (not WAN)
3. **Verify cable quality**: Ensure cable is not damaged and connections are secure
4. **Power on router**: Plug in power adapter and wait for boot completion

### Router Access Methods

**For Stock Firmware Routers**:
- **Common addresses**: 192.168.1.1 or 192.168.0.1
- **Check router label**: Default IP often printed on device sticker
- **Login credentials**: Usually admin/admin or admin/(blank)

**For OpenWrt Routers**:
- **Standard address**: 192.168.1.1
- **Default login**: root with empty password (if unconfigured)

**For LibreMesh Routers**:
- **Magic address**: http://thisnode.info
- **Alternative**: 10.13.0.1 or configured gateway IP

## Step 3: Access Router Web Interface

### Troubleshooting Connection Issues

If you cannot reach the router web interface:

**Check network connectivity**:
```bash
# Test basic connectivity
ping 192.168.1.1
ping 192.168.0.1

# Check routing table
ip route show default    # Linux
route print             # Windows
netstat -rn             # macOS
```

**Find router IP automatically**:
```bash
# Linux/macOS - scan common subnets
nmap -sn 192.168.1.0/24
nmap -sn 192.168.0.0/24

# Windows - check ARP table
arp -a
```

**Common solutions**:
- **Verify cable connection**: Try different Ethernet ports
- **Check power supply**: Ensure router is fully powered and booted
- **Reset router**: Use hardware reset if configuration is corrupted
- **Try different browser**: Some routers have browser compatibility issues

## Step 4: Flash LibreMesh Firmware

### Standard Web-Based Flashing

*`[Router in Flash Mode](router-flash-mode.png)` — Router with LEDs or physical indicators signaling firmware flashing mode, showing typical LED patterns during firmware upload.*

1. **Navigate to firmware upgrade section**:
   - **TP-Link**: Advanced → System Tools → Firmware Upgrade
   - **Asus**: Administration → Firmware Upgrade
   - **GL.iNet**: System → Upgrade
   - **Generic OpenWrt**: System → Backup/Flash Firmware

2. **Upload firmware file**:
   - **Click "Choose File"** or "Browse"
   - **Select your `-factory.bin` file**
   - **Verify filename** matches your router exactly

3. **Important pre-flash checks**:
   - [ ] Correct firmware file selected
   - [ ] Stable power supply confirmed
   - [ ] No other network activity on router
   - [ ] Backup of current config (if desired)

4. **Initiate flash process**:
   - **Click "Flash" or "Upgrade"**
   - **Do NOT power off** or disconnect during process
   - **Wait for completion** (typically 3-5 minutes)

### Brand-Specific Procedures

**TP-Link FCC Lock Bypass** (for newer models):
1. **Install DD-WRT first**: Use appropriate DD-WRT US version
2. **Revert to factory**: Download official revert firmware
3. **Rename LibreMesh firmware**: Match exact TP-Link naming convention
4. **Flash via stock interface**: Upload renamed LibreMesh firmware

**Ubiquiti AirOS Considerations**:
> **⚠️ Critical Warning**: AirOS 5.6.x will brick your device. Downgrade to AirOS 5.5.x first using official firmware from Ubiquiti downloads.

**GL.iNet Devices**:
- **Use U-Boot recovery**: If web interface fails
- **Check for hardware switches**: Some models have firmware selection switches

## Step 5: Post-Installation Verification

### Initial Connection Test

After firmware installation completes:

1. **Wait for router reboot**: Allow 2-3 minutes for full startup
2. **Reconfigure computer network**: Set to DHCP or appropriate static IP
3. **Access LibreMesh interface**: Browse to http://thisnode.info

### First-Time Configuration

**Set Administrator Password**:
> **🔒 Security Critical**: Always set a strong admin password immediately after installation.

1. **Navigate to password settings**: Usually prompted on first access
2. **Choose strong password**: Minimum 12 characters with mixed case, numbers, symbols
3. **Save configuration**: Apply settings and wait for reload

**Basic Network Verification**:
```bash
# Test connectivity to LibreMesh node
ping thisnode.info

# Check mesh network advertisement
iwinfo wlan0 scan | grep LibreMesh

# Verify network interfaces
ip addr show
```

### Essential Post-Installation Steps

1. **Update system packages**:
   ```bash
   opkg update
   opkg list-upgradable
   ```

2. **Configure time synchronization**:
   - **Set timezone**: System → System → General Settings
   - **Enable NTP**: Network → Time Synchronization

3. **Configure mesh network**:
   - **Set network name**: Customize from default "LibreMesh.org"
   - **Configure channels**: Optimize for local RF environment
   - **Set mesh key**: Enable encryption for mesh backhaul

## Step 6: Network Integration

### Internet Gateway Configuration

**Connect WAN interface**:
1. **Physical connection**: Internet source to router WAN port
2. **Configure protocol**: DHCP, PPPoE, or static as required
3. **Test connectivity**: Verify internet access through mesh

**Configure port roles** (for single-port devices):
```bash
# Set specific port as WAN
uci set network.wan.ifname='eth0.2'
uci commit network
service network restart
```

### Mesh Network Joining

**Automatic mesh discovery**:
- LibreMesh nodes automatically discover neighbors
- **Verify mesh links**: Network → Mesh Status
- **Check routing tables**: Advanced → Status → Routes

**Manual mesh configuration** (if needed):
```bash
# Set mesh ID and key
uci set lime.wifi.ap_ssid='YourNetworkName'
uci set lime.wifi.adhoc_ssid='YourMeshName_mesh'
uci commit lime
lime-config
reboot
```

## Troubleshooting Installation Issues

### Failed Flash Recovery

If firmware installation fails:

1. **Do not panic**: Most routers have recovery mechanisms
2. **Try TFTP recovery**: See [Router Troubleshooting Guide](router-troubleshooting.md)
3. **Use hardware reset**: Hold reset button during boot
4. **Serial console recovery**: Last resort for advanced users

### Common Installation Problems

**"Invalid Firmware" Errors**:
- **Check firmware filename**: Must match expected format
- **Verify model/revision**: Ensure exact hardware compatibility
- **Try different upload method**: Web interface vs TFTP

**Flash Process Hangs**:
- **Power cycle router**: Attempt recovery mode
- **Check network connectivity**: Ensure stable connection
- **Reduce network traffic**: Close other applications

**Router Unresponsive After Flash**:
- **Wait longer**: Some routers need 5+ minutes for first boot
- **Check LED patterns**: Compare with normal boot sequence
- **Try factory reset**: Hardware reset button procedure

## Verification Checklist

After successful LibreMesh installation:

- [ ] **Admin password set**: Strong password configured
- [ ] **Network connectivity**: Internet access through mesh
- [ ] **Web interface accessible**: http://thisnode.info loads
- [ ] **Mesh network active**: Other nodes visible in mesh status
- [ ] **Wireless networks broadcasting**: Both client and mesh SSIDs
- [ ] **System time synchronized**: Correct time zone and NTP
- [ ] **Basic services running**: SSH, web interface, mesh protocols

## Next Steps

With LibreMesh successfully installed:

1. **Review [Router Troubleshooting Guide](router-troubleshooting.md)** for maintenance procedures
2. **Plan additional nodes**: Expand mesh network coverage
3. **Configure advanced features**: QoS, captive portal, monitoring
4. **Join community support**: Mailing lists and forums for ongoing help

> **📚 Additional Resources**: 
> - LibreMesh Configuration Documentation: https://libremesh.org/docs/
> - OpenWrt Package Management: https://openwrt.org/docs/guide-user/additional-software/opkg
> - Community Support Forums: https://libremesh.org/communication.html