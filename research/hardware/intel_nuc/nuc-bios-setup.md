# Intel NUC BIOS/UEFI Setup Guide for Community Server Deployment

## Introduction

Proper BIOS/UEFI configuration is crucial for stable server operation of Intel NUC devices. This guide provides step-by-step instructions tailored for community server platforms like YunoHost, Caprover, and CasaOS, focusing on reliability, security, and optimal performance.

## Pre-Setup Preparation

### Required Equipment
- **Wired USB keyboard** (Bluetooth keyboards may not work during BIOS)
- **HDMI/DisplayPort monitor** (USB-C displays may not show BIOS)
- **Power adapter** appropriate for your NUC model
- **USB flash drive** (for BIOS updates if needed)

### Important Notes
- Always connect keyboard to rear USB ports for BIOS access
- Disable Fast Boot in Windows before accessing BIOS if dual-booting
- Have your BIOS/UEFI supervisor password ready if previously set

## Accessing BIOS/UEFI

### Standard Method
1. **Power on** the NUC while holding **F2** key
2. Continue holding F2 until BIOS setup appears
3. If using ASUS NUC, you may see the ASUS logo briefly

### Alternative Methods (if F2 fails)

#### Method 1: Power Button Menu
1. **Power off** the NUC completely
2. **Press and hold** power button for 3 seconds, then release
3. **Press F7** when Power Button Menu appears
4. Select "BIOS Setup" from the menu

#### Method 2: Cold Boot Method
1. **Unplug** power adapter completely
2. Wait 10 seconds
3. **Reconnect** power and immediately press F2 repeatedly
4. This method often works when Fast Boot is enabled

#### Method 3: UEFI Settings (Windows)
If Windows is installed:
1. Hold **Shift** while clicking "Restart"
2. Go to **Troubleshoot** → **Advanced Options** → **UEFI Firmware Settings**
3. Click **Restart** to boot into BIOS

## Initial BIOS Configuration

### Step 1: Reset to Defaults
```
1. Press F9 (Load BIOS Defaults)
2. Confirm with Enter
3. This ensures clean starting configuration
```

### Step 2: Basic System Information
Verify the following information is correct:
- **BIOS Version**: Note current version
- **CPU Model**: Confirm processor identification
- **Memory**: Verify all installed RAM is detected
- **Storage**: Check all drives are recognized

## Essential Server Settings

### Security Configuration

#### Set Supervisor Password
```
Navigation: Advanced → Security → Passwords → Set Supervisor Password
Recommended: 12+ character password with mix of letters, numbers
Storage: Document password securely - required for future changes
```

#### Configure Secure Boot (Recommended: Disabled for Linux)
```
Navigation: Advanced → Security → Secure Boot
Setting: Disabled
Reason: Many Linux distributions require Secure Boot disabled
Alternative: Some newer distributions support Secure Boot
```

#### Boot Configuration
```
Navigation: Advanced → Boot → Boot Configuration
Settings:
- Network Boot: Disabled (unless PXE booting required)
- USB Boot: Enabled (for installation media)
- Boot Device Control: Lock UEFI Boot (prevents unauthorized changes)
```

### Power Management Settings

#### Configure Power Behavior
```
Navigation: Advanced → Power → Secondary Power Settings

After Power Failure: Power On
- Ensures server restarts automatically after power outages
- Critical for headless server operation

Wake on LAN: Enabled
- Allows remote wake via network magic packets
- Useful for energy-efficient operation

USB Wake Support: Disabled
- Prevents accidental wake from USB device activity
- Recommended for server stability
```

#### CPU Power Settings
```
Navigation: Advanced → Power → CPU Power Management

Enhanced Intel SpeedStep: Enabled
- Allows dynamic CPU frequency scaling
- Improves energy efficiency under variable loads

Turbo Mode: Enabled
- Allows CPU to exceed base frequency when needed
- Important for server performance during peak loads
```

### Cooling and Thermal Management

#### Fan Control Configuration
```
Navigation: Advanced → Cooling → CPU Fan Header

Fan Control Mode: Quiet
- Minimizes noise for home/office environments
- Alternative: Balanced for higher performance needs

Custom Fan Curves: Available on some models
- Set based on temperature thresholds
- Balance between cooling and noise
```

### Storage Configuration

#### M.2 and SATA Settings
```
Navigation: Advanced → Devices → Storage

SATA Mode: AHCI
- Required for Linux compatibility
- DO NOT use RAID/RST mode unless specifically needed

M.2 Slot Configuration: Auto
- Allows automatic detection of NVMe/SATA drives
- Verify all installed drives appear in list
```

#### Boot Priority Configuration
```
Navigation: Advanced → Boot → Boot Priority

UEFI Boot Priority:
1. USB (for installation)
2. Primary storage device
3. Network boot (if required)

Legacy Boot: Disabled
- Modern operating systems prefer UEFI
- Reduces potential compatibility issues
```

## Operating System Specific Settings

### Linux Server Distributions (Ubuntu, Debian, CentOS)

#### Essential Settings
```
UEFI Boot: Enabled
Secure Boot: Disabled
CSM (Compatibility Support Module): Disabled
Intel VT-x: Enabled (for virtualization)
Intel VT-d: Enabled (for advanced virtualization)
```

#### Network Configuration
```
Navigation: Advanced → Devices → Network

Wake on LAN: Enabled
Network Stack: Enabled (for PXE if needed)
```

### Windows Server Considerations

#### Special Requirements
```
Secure Boot: Can remain enabled for Windows Server 2019+
TPM: Enabled if available
Intel AMT: Enabled for remote management (business models)
```

#### Network Driver Preparation
Note: Windows Server requires manual network driver installation
- Download Intel LAN drivers beforehand
- Use "Have Disk" method during driver installation
- Consult your model-specific documentation for detailed driver installation steps

## Advanced Configuration Options

### Intel vPro and AMT Settings (Business Models)

#### Enable Remote Management
```
Navigation: Advanced → Intel AMT Configuration

Intel AMT: Enabled
Network Access: Network Active
SOL Terminal: Enabled (for Serial Over LAN)

Setup Process:
1. Enable AMT in BIOS
2. Configure network settings
3. Set AMT password during first boot
4. Access via https://[nuc-ip]:16992
```

### Virtualization Settings

#### For ESXi, Proxmox, Hyper-V
```
Intel Virtualization Technology (VT-x): Enabled
Intel VT for Directed I/O (VT-d): Enabled
Execute Disable Bit: Enabled

Additional for ESXi:
- SR-IOV: Enabled (if available)
- IOMMU: Enabled
```

### Memory Configuration

#### Memory Settings
```
Navigation: Advanced → Memory

Memory Profile: Auto or XMP Profile 1
- Enables rated memory speeds
- Important for performance

ECC Support: Auto
- Enabled automatically if ECC memory detected
- Not available on consumer NUC models
```

## Platform-Specific Optimizations

### YunoHost Configuration
```
Recommended Settings:
- Secure Boot: Disabled
- Legacy Boot: Disabled
- Network Boot: Disabled
- Wake on LAN: Enabled
- Auto Power On: Enabled

Known Issues:
- Some NUC models require UEFI boot disabled
- Test installation with UEFI first, fallback to Legacy if needed
```

### CasaOS Configuration
```
Recommended Settings:
- Standard Linux server settings
- Docker optimization: Intel VT-x Enabled
- Wake on LAN: Enabled for remote management

No special requirements - works with standard Ubuntu/Debian setup
```

### Caprover Configuration
```
Recommended Settings:
- Docker support: Intel VT-x Enabled
- Network optimization: Wake on LAN Enabled
- Standard Linux server configuration

Virtualization support recommended for container efficiency
```

## BIOS Update Process

### Checking BIOS Version
```
Current Version: Note from main BIOS screen
Latest Version: Check ASUS support site for your model
Update Needed: If version is more than 6 months old
```

### Update Methods

#### Method 1: Express BIOS Update (Recommended)
```
Requirements: Windows environment
Process:
1. Download Express BIOS installer from ASUS
2. Run installer as Administrator
3. Follow prompts for automatic update
4. System will restart automatically
```

#### Method 2: F7 BIOS Update
```
Requirements: USB flash drive, BIOS capsule file
Process:
1. Download .cap file to USB root directory
2. Power off NUC
3. Hold power button 3 seconds, release
4. Press F7 when Power Button Menu appears
5. BIOS will auto-detect and install update
```

#### Method 3: UEFI Shell Update
```
Advanced users only - use iFlash utility
Refer to ASUS documentation for specific steps
```

## Post-Configuration Verification

### System Stability Testing
```
1. Boot to target OS successfully
2. Verify all hardware detected correctly
3. Check power management behavior
4. Test network connectivity
5. Validate storage performance
```

### Monitoring Tools
```
Built-in Monitoring:
- Hardware Monitor: Check temperatures and voltages
- Boot Options: Verify boot sequence
- Security Status: Confirm security settings

External Tools:
- Linux: lm-sensors, htop, iotop
- Windows: HWiNFO, CPU-Z, CrystalDiskInfo
```

## Common Configuration Mistakes

### ❌ Mistakes to Avoid

1. **Leaving Fast Boot Enabled**
   - Prevents BIOS access
   - Can cause boot issues with Linux

2. **Wrong Fan Settings**
   - "Performance" mode too loud for home use
   - "Silent" mode may cause thermal throttling

3. **Incorrect Virtualization Settings**
   - VT-x disabled prevents Docker/VMs
   - VT-d disabled limits advanced features

4. **Poor Security Configuration**
   - No supervisor password
   - Secure Boot enabled for unsupported OS

5. **Network Configuration Issues**
   - Wake on LAN disabled
   - Network boot left enabled unnecessarily

### ✅ Best Practices

1. **Document Settings**
   - Take photos of critical BIOS screens
   - Note any custom configurations

2. **Regular Updates**
   - Check for BIOS updates quarterly
   - Update during planned maintenance windows

3. **Backup Configuration**
   - Some models support BIOS profile export
   - Document custom settings for restoration

## Troubleshooting BIOS Issues

### Cannot Access BIOS
```
Solutions:
1. Use wired keyboard on rear port
2. Try cold boot method (unplug power)
3. Disable Fast Boot from Windows
4. Use Power Button Menu method
```

### BIOS Settings Not Saving
```
Causes:
- CMOS battery failure (rare on NUCs)
- Power interruption during save
- Corrupted BIOS settings

Solutions:
1. Load defaults and reconfigure
2. Update BIOS firmware
3. Contact ASUS support if persistent
```

### Boot Issues After Configuration
```
Recovery Options:
1. Load BIOS defaults (F9)
2. Use BIOS recovery jumper (if available)
3. Power Button Menu recovery
4. BIOS recovery mode
```

## Security Hardening

### Production Environment Settings
```
Supervisor Password: Required
User Password: Optional
Boot Device Control: Lock UEFI Boot Order
USB Boot: Disabled (after OS installation)
Network Boot: Disabled
Secure Boot: Enabled (if OS supports)
Intel AMT: Disabled (unless required)
```

### Home Environment Settings
```
Supervisor Password: Recommended
Wake on LAN: Enabled
Auto Power On: Enabled
USB Boot: Enabled (for maintenance)
Secure Boot: Disabled (for flexibility)
```

## Final Steps and Documentation

### Save Configuration
```
1. Press F10 to save and exit
2. Confirm changes when prompted
3. System will restart with new settings
```

### Document Your Setup
Create a configuration record including:
- BIOS version
- Key settings modified
- Passwords used (stored securely)
- Date of configuration
- Purpose/reasoning for settings

---

**Next Steps:**
- Configure power and network settings: [nuc-power-network.md](nuc-power-network.md)
- Review model-specific considerations: [nuc-models-comparison.md](nuc-models-comparison.md)

**Important**: Always verify these settings work with your specific model and intended operating system before deploying in production.