# Methodology: Comparative Study of Self-Hosting Hardware & Software for CCCIs

## Purpose

This methodology describes how we systematically evaluate, compare, and document hardware and software platforms for community network self-hosting, with the aim of providing actionable data and recommendations for CCCIs (Community Connectivity and Communication Initiatives).

---

## 1. Objectives

- **Identify optimal combinations** of low-cost hardware and self-hosted service management software for community networks.
- **Evaluate performance, usability, and suitability** for key CCCI functions (content hosting, local portals, streaming, privacy, and more).
- **Document installation and operational steps** to aid reproducibility and lower adoption barriers for new communities.

---

## 2. Evaluation Scope

### 2.1 Hardware Platforms
- Zimaboard (Mini x86 SBC)
- Raspberry Pi 5 (ARM SBC)
- Intel NUC (Small x86 system)

### 2.2 Software Platforms
- CasaOS
- CapRover
- Yunohost
- ZimaOS
- BalenaOS

### 2.3 Core Community Services Deployed
- Community Portal (TinaCMS/WordPress)
- Web radio (AzuraCast)
- Local movie server (Jellyfin)
- Traffic monitoring (Speedtest)
- Internet filtering (PiHole/AdGuard)
- Educational resources (Kolibri)
- File storage (FileBrowser)

---

## 3. Testing Procedures

### 3.1 Environment Setup

- For initial testing, platforms are installed on a cloud VPS for proof-of-concept.
- Each hardware device is then set up physically with the tested platforms and apps.

### 3.2 Installation & Configuration Steps

For each **software platform**:
1. **Document installation process**
   - Pre-checks, image/source downloads, flashing/writing, first boot.
   - Initial UI/CLI access and configuration.
2. **Service deployment**
   - Attempt install of each core service through the management UI or CLI.
   - Record configuration needs (e.g. domain, SSL, admin/user roles).
3. **Network/domain setup**
   - Configure local and custom domains, LAN/WAN access, SSL certs where appropriate.

### 3.3 Usability and Operational Testing

- Record time and technical steps required for initial setup, updates, and user/admin onboarding.
- Evaluate UI/UX for a non-technical operator.
- Test adding new users, basic monitoring, and taking/administering backups.

### 3.4 Performance & Stability Testing

- Simulate client devices accessing streaming and local content to assess load limits (by concurrency).
- Measure system resource usage (CPU, RAM, Disk) and power consumption at idle and peak loads.
- Perform resilience check: power cycle device while under load, observe restart behavior.

### 3.5 Data Collection

All findings are recorded in standardized markdown or spreadsheet tables, including:
- Installation steps and obstacles
- Service availability and install difficulty
- User/admin experience notes and ratings
- Performance and device limits
- Power and recovery data

---

## 4. Evaluation Metrics

### A. Hardware Metrics

1. **Performance**
   - CPU benchmark scores (e.g., with stress)
   - RAM/IO usage under load (Glances)
2. **Networking**
   - Actual LAN throughput (iperf3)
   - Number of concurrent users (as tested with ab/jellyfin clients)
3. **Power Efficiency**
   - Idle & max power (Wattmeter/manual)
   - Power/user (estimation)
4. **Physical & Thermal Stability**
   - Device stability after stress/power cycle (manual + logs)
5. **Expandability & Cost**
   - Storage/IO expansion options
   - Upfront and operational cost (USD)

---

### B. Software Metrics

1. **Installation & Usability**
   - Steps and time from image to working system
   - Non-technical operator suitability (subjective + step count)
2. **Service Availability**
   - Which apps are installable via UI/CLI
3. **Performance/Resource Management**
   - Resource use for each deployed app (Glances logs)
   - Service quality with multiple users
4. **Stability & Recovery**
   - Recovery from update/crash/power off (manual test + logs)
   - Update process and reliability
5. **Security & Updates**
   - Update frequency, ease of patching
6. **Localization & Community**
   - Languages supported in management UI
   - Active user/dev community, forum/docs activity
7. **Licensing**
   - Open source/FOSS compliance

---
---

## 5. Documentation & Reproducibility

- Every test is logged with timestamps, commands, outputs, screenshots/log files, and user feedback.
- All scripts/config files used in automation or auxiliary testing are added to the `scripts/` directory.
- Issues and troubleshooting steps are tracked in the project GitHub issues section and referenced in test logs.
- Summary results are shared as machine-readable (CSV/XLSX) and human-readable (md/pdf) tables.

---

## 6. Review & Validation

- Peer review of results by at least two team members.
- External input from LocNet and CCCI community testers where feasible.
- Final recommendations are consensus and evidence-based.

---

## 7. Reporting

- Process, findings, and lessons learned are compiled into the main comparative report.
- Slides and outreach materials are created for webinars and training.

---

## 8. Updates & Extensions

- The methodology and test procedures are improved with feedback and new technology releases.
- Roadmap includes possible new platforms, new services, and deeper performance testing.

---

_Last updated: [23-04-2025]_