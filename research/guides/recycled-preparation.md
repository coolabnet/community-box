# Recycled Computer Preparation Guide

## Overview

This comprehensive guide provides step-by-step instructions for physically cleaning, resetting, and preparing recycled computers for server deployment. Proper preparation ensures optimal performance, reliability, and longevity of repurposed hardware.

## Safety Precautions

### Electrical Safety
- [ ] **Power Off Completely**: Shut down and unplug from wall outlet
- [ ] **Power Button Discharge**: Press and hold power button for 10 seconds after unplugging
- [ ] **Wait for Capacitor Discharge**: Wait 5-10 minutes before opening case
- [ ] **Remove Battery**: Disconnect laptop battery if applicable
- [ ] **Use Anti-Static Protection**: Wrist strap or frequent grounding

### Physical Safety
- [ ] **Work Area**: Clean, well-lit, static-free workspace
- [ ] **Eye Protection**: Safety glasses when using compressed air
- [ ] **Ventilation**: Adequate airflow for dust removal
- [ ] **Sharp Edges**: Be cautious of metal case edges
- [ ] **Lifting**: Proper lifting techniques for heavy equipment

### Environmental Considerations
- [ ] **Outdoor Cleaning**: Use compressed air outside when possible
- [ ] **Dust Containment**: Cover nearby equipment during cleaning
- [ ] **Disposal**: Proper disposal of cleaning materials and removed components

## Required Tools and Supplies

### Essential Tools
- **Screwdrivers**: Phillips head set (#0, #1, #2)
- **Compressed Air**: Multiple cans or electric air compressor
- **Cleaning Supplies**: Isopropyl alcohol (90%+), microfiber cloths
- **Safety Equipment**: Anti-static wrist strap, safety glasses
- **Organization**: Small containers for screws, labels for cables

### Optional Tools
- **Thermal Paste**: Arctic MX-4 or equivalent for CPU re-seating
- **Cable Ties**: For cable management improvements
- **Torx Screwdrivers**: For some laptop models
- **Plastic Prying Tools**: For laptop disassembly
- **Digital Camera**: For documentation before disassembly

### Cleaning Materials
| Material | Purpose | Safety Notes |
|----------|---------|--------------|
| Isopropyl Alcohol 90%+ | Component cleaning | Well-ventilated area |
| Microfiber Cloths | Surface cleaning | Lint-free, anti-static |
| Cotton Swabs | Detail cleaning | No cotton fibers left behind |
| Compressed Air | Dust removal | Hold cans upright, short bursts |
| Soft-bristle Brush | Stubborn dust | Anti-static brushes preferred |

## Pre-Disassembly Documentation

### System Information Gathering
```bash
# Before powering down, collect system information
# Windows
msinfo32                    # System Information
dxdiag                     # DirectX Diagnostics
devmgmt.msc               # Device Manager

# Linux
lshw -html > hardware.html # Hardware listing
dmidecode > dmidecode.txt  # Hardware details
lscpu > cpu_info.txt      # CPU information
```

### Physical Documentation
1. **Photography**:
   - Overall system photos from multiple angles
   - Close-ups of cable connections
   - Component placement before removal
   - Any damage or unusual configurations

2. **Labels and Markings**:
   - Record model numbers and serial numbers
   - Note any custom modifications
   - Document cable routing paths
   - Identify proprietary components

## Desktop Computer Disassembly

### Step 1: External Preparation
1. **Disconnect All Cables**:
   - Power cord
   - Monitor cables (VGA/HDMI/DisplayPort)
   - USB devices (keyboard, mouse, etc.)
   - Network cable
   - Audio cables

2. **Remove External Components**:
   - Optical media from drives
   - USB devices and SD cards
   - Any attached accessories

### Step 2: Case Opening
1. **Side Panel Removal**:
   ```
   Most cases: Remove 2-4 thumbscrews on rear panel
   Tool-free cases: Press tabs and slide panel
   Older cases: Phillips screws on rear panel
   ```

2. **Access Verification**:
   - Ensure clear access to all components
   - Remove both side panels if necessary
   - Check for additional access panels

### Step 3: Component Removal Order

#### Power Supply Unit (if replacement needed)
1. **Disconnect All Power Cables**:
   - 24-pin motherboard connector
   - 4/8-pin CPU power connector
   - PCIe power connectors
   - SATA power connectors
   - Molex connectors

2. **Remove PSU**:
   - Unscrew 4 screws from rear of case
   - Carefully remove unit
   - Note orientation for reinstallation

#### Storage Drives
1. **SATA/Power Cable Removal**:
   - Gently disconnect SATA data cables
   - Remove SATA power connectors
   - Note cable routing for reassembly

2. **Drive Removal**:
   ```
   3.5" HDDs: 4 screws from drive cage sides
   2.5" SSDs: 4 screws from mounting bracket
   M.2 drives: Single screw and gentle lifting
   ```

#### Expansion Cards
1. **Remove in Order**:
   - Unscrew bracket screws
   - Unlock PCIe retention clips
   - Carefully lift cards straight up
   - Store in anti-static bags

#### Memory (RAM)
1. **Removal Process**:
   - Press down retention clips on both ends
   - RAM modules will pop up at 30-degree angle
   - Gently pull modules straight out
   - Handle by edges only

#### CPU Cooler (if cleaning/replacing)
1. **Intel Socket Removal**:
   ```
   Push-pin coolers: Rotate pins 90° counterclockwise, pull up
   Screw-down coolers: Remove screws in X pattern
   ```

2. **AMD Socket Removal**:
   ```
   Clip retention: Lift retention arm, slide cooler off
   Screw-down: Remove screws in star pattern
   ```

**⚠️ Warning**: CPU may stick to cooler due to thermal paste

## Laptop Disassembly

### Step 1: External Preparation
1. **Power Management**:
   - Shut down completely
   - Remove battery (if removable)
   - Disconnect AC adapter
   - Press power button for 15 seconds

2. **External Cleaning**:
   - Remove any attached devices
   - Clean exterior with damp microfiber cloth
   - Pay attention to port areas

### Step 2: Access Panel Removal
1. **Bottom Panel Access**:
   ```
   Modern laptops: Remove all visible screws from bottom
   Older laptops: May have multiple access panels
   Some models: Require keyboard or palm rest removal first
   ```

2. **Screw Management**:
   - Use small containers for different screw types
   - Some laptops use different screw lengths
   - Take photos of screw locations

### Step 3: Component Access

#### Memory and Storage
1. **RAM Modules**:
   - Usually accessible through bottom panel
   - Release clips and modules pop up at angle
   - Remove carefully by pulling at edges

2. **Storage Drives**:
   ```
   2.5" SATA: Remove bracket screws, disconnect cable
   M.2 NVMe: Remove single screw, lift at angle
   mSATA: Similar to M.2 but smaller form factor
   ```

#### Advanced Disassembly (if needed)
**Note**: Only proceed if experienced with laptop repair

1. **Keyboard Removal**:
   - Release clips or remove screws
   - Disconnect ribbon cables carefully
   - Some models require palm rest removal first

2. **Display Assembly**:
   - Remove hinge screws
   - Disconnect display and Wi-Fi cables
   - Carefully separate display assembly

## Cleaning Procedures

### Compressed Air Cleaning
1. **Preparation**:
   - Take equipment outside or to well-ventilated area
   - Wear safety glasses
   - Hold compressed air cans upright
   - Use short bursts (2-3 seconds)

2. **Cleaning Order**:
   ```
   1. Power supply (if accessible)
   2. CPU heatsink and fan
   3. Graphics card heatsink and fan
   4. Case fans (hold fan blades while blowing)
   5. Motherboard components
   6. Expansion card slots
   7. Drive bays and connectors
   ```

3. **Fan Cleaning Protocol**:
   ```
   ⚠️ CRITICAL: Hold fan blades stationary while cleaning
   - Compressed air can spin fans beyond rated RPM
   - Over-spinning can damage bearings
   - Use cotton swab to hold fan center if needed
   ```

### Detail Cleaning

#### Motherboard Cleaning
1. **Surface Cleaning**:
   - Use dry microfiber cloth for light dust
   - Isopropyl alcohol for stubborn residue
   - Cotton swabs for tight spaces
   - Never use water or aggressive solvents

2. **Connector Cleaning**:
   ```
   RAM slots: Compressed air, gentle brush
   PCIe slots: Compressed air only
   CPU socket: Compressed air, extreme care
   Power connectors: Isopropyl alcohol on contacts
   ```

#### Heat Sink Cleaning
1. **Dust Removal**:
   - Compressed air from multiple angles
   - Brush stubborn dust buildup
   - Ensure all fin passages are clear

2. **Thermal Paste Removal** (if reseating CPU):
   ```
   Materials: Isopropyl alcohol 90%+, coffee filters
   Process: 
   1. Remove old paste with plastic scraper
   2. Clean with alcohol-soaked cloth
   3. Final cleaning with coffee filter
   4. Ensure completely dry before new paste
   ```

### Case and External Cleaning

#### Interior Case Cleaning
1. **Dust Removal**:
   - Compressed air for loose dust
   - Microfiber cloth for surfaces
   - Cotton swabs for corners and crevices

2. **Cable Management**:
   - Remove dust from cable bundles
   - Reorganize for better airflow
   - Replace damaged cable ties

#### Exterior Cleaning
1. **Plastic Surfaces**:
   ```
   Solution: Mild soap and water or isopropyl alcohol
   Method: Damp cloth, not soaking wet
   Drying: Immediate drying with clean cloth
   ```

2. **Metal Surfaces**:
   ```
   Solution: Isopropyl alcohol 70%+
   Method: Microfiber cloth application
   Finish: Dry immediately to prevent water spots
   ```

## Component Testing and Replacement

### Pre-Cleaning Component Tests
1. **Visual Inspection**:
   - Look for swollen capacitors
   - Check for burn marks or discoloration
   - Inspect cables for damage
   - Verify fan blade integrity

2. **Basic Functionality**:
   - Test system boot before full disassembly
   - Verify all fans spin up
   - Check for unusual noises
   - Monitor temperatures if possible

### Post-Cleaning Verification
1. **Component Reseating**:
   - RAM: Firm, even pressure until clips engage
   - PCIe cards: Push down until retention clip clicks
   - Power connectors: Firm connection, retention clips engaged
   - SATA cables: Gentle but secure connection

2. **Cable Management**:
   - Route cables away from fans
   - Secure loose cables with ties
   - Ensure no cables obstruct airflow
   - Verify all connections are secure

## BIOS/CMOS Reset Procedures

### When to Reset BIOS
- Unknown BIOS passwords
- Corrupted BIOS settings
- Hardware compatibility issues
- Instability after component changes

### CMOS Battery Replacement
1. **Battery Location**:
   ```
   Desktop: Usually visible on motherboard (CR2032)
   Laptop: May be under keyboard or accessible panel
   ```

2. **Replacement Process**:
   ```
   1. Power off completely and unplug system
   2. Remove CMOS battery (note orientation)
   3. Wait 5-10 minutes for complete discharge
   4. Install new battery (match orientation)
   5. Power on and configure BIOS
   ```

### CMOS Jumper Reset (Desktop)
1. **Locate CMOS Jumper**:
   - Usually labeled "CLRTC", "CLEAR", or "JBAT1"
   - Near CMOS battery or BIOS chip
   - Consult motherboard manual if uncertain

2. **Reset Process**:
   ```
   1. Power off and unplug system
   2. Move jumper from pins 1-2 to pins 2-3
   3. Wait 10-15 seconds
   4. Return jumper to original position (1-2)
   5. Power on system
   ```

### Alternative Reset Methods
1. **Power Button Method**:
   ```
   1. Unplug system completely
   2. Remove CMOS battery
   3. Hold power button for 30 seconds
   4. Reinstall battery and power up
   ```

2. **Motherboard Button** (newer systems):
   - Some boards have dedicated CMOS reset button
   - Press button while system is powered off
   - No jumper manipulation required

## Quality Control Checklist

### Pre-Reassembly Verification
- [ ] All components thoroughly cleaned
- [ ] No damaged components identified
- [ ] Thermal paste replaced (if CPU removed)
- [ ] All cables and connectors clean
- [ ] No foreign objects left in case
- [ ] Anti-static precautions maintained

### Reassembly Checklist
- [ ] Components installed in reverse order of removal
- [ ] All screws properly tightened (not over-tightened)
- [ ] Cables routed for optimal airflow
- [ ] No loose cables near fans
- [ ] All power connections secure
- [ ] RAM and expansion cards fully seated

### Initial Power-On Test
- [ ] System powers on normally
- [ ] All fans spinning (CPU, case, GPU)
- [ ] No unusual noises or smells
- [ ] POST completes successfully
- [ ] All components detected in BIOS
- [ ] Temperature readings normal

## Common Issues and Solutions

### System Won't Power On
**Possible Causes**:
- Loose power connections
- Incorrectly seated RAM
- Disconnected front panel connectors
- Power supply issues

**Solutions**:
1. Verify all power connections
2. Reseat RAM modules
3. Check front panel connector alignment
4. Test with minimal configuration

### Overheating After Cleaning
**Possible Causes**:
- Thermal paste not applied properly
- CPU cooler not properly seated
- Fans not connected
- Blocked airflow paths

**Solutions**:
1. Verify CPU cooler mounting
2. Check thermal paste application
3. Confirm all fan connections
4. Verify case fan orientation

### Boot Issues
**Possible Causes**:
- BIOS reset required
- Boot device not detected
- Loose storage connections
- Corrupted boot sector

**Solutions**:
1. Reset BIOS to defaults
2. Verify storage device connections
3. Check boot order in BIOS
4. Test with different storage device

## Documentation and Labeling

### System Documentation
1. **Create Service Record**:
   ```
   System Model: _______________
   Serial Number: ______________
   Date Cleaned: ______________
   Technician: ________________
   Components Replaced: ________
   Issues Found: ______________
   ```

2. **Photo Documentation**:
   - Before and after cleaning photos
   - Any damage or wear documentation
   - Component configuration photos

### Component Tracking
1. **Inventory Management**:
   - Label removed components
   - Track component serial numbers
   - Note compatibility information
   - Record performance test results

2. **Configuration Notes**:
   - BIOS settings modifications
   - Hardware configuration changes
   - Driver requirements
   - Known compatibility issues

## Final Preparation Steps

### System Optimization
1. **BIOS Configuration**:
   - Enable optimal settings for server use
   - Configure boot priorities
   - Enable virtualization features
   - Set power management options

2. **Hardware Burn-In**:
   ```
   CPU Stress Test: 4-8 hours at 100% load
   Memory Test: Full MemTest86+ pass
   Storage Test: Read/write endurance test
   Temperature Monitoring: Throughout all tests
   ```

### Deployment Preparation
- [ ] Operating system installation media prepared
- [ ] Driver packages downloaded
- [ ] Network configuration planned
- [ ] Security settings documented
- [ ] Backup and recovery procedures planned

## Next Steps

1. **BIOS Setup**: Configure BIOS/UEFI settings for server operation
2. **Compatibility Verification**: Review [Hardware Compatibility Check](hardware-compatibility-check.md)
3. **System Requirements**: Confirm [Recycled PC Requirements](recycled-pc-requirements.md)
4. **Model Selection**: Reference [Recycled Models Comparison](recycled-models-comparison.md)

---

*This preparation guide ensures recycled computers are properly cleaned, tested, and ready for reliable server deployment. Always prioritize safety and take time to do the job correctly.*