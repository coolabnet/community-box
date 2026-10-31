---
title: Instalación
sourcePath: guides/libremesh-installation.md
sourceHash: a1625a47a8da20e7
translatedBy: glm-4.6
---

# Guía de Instalación del Firmware LibreMesh

Esta guía completa proporciona instrucciones paso a paso para descargar, verificar, preparar e instalar (flashear) el firmware LibreMesh en tu router de destino. Sigue estos procedimientos con cuidado para asegurar una instalación exitosa y evitar daños al dispositivo.

## Requisitos Previos a la Instalación

### Preparación del Hardware
- **Router**: Dispositivo compatible de la [Guía de Selección de Router](router-selection-guide.md)
- **Computadora**: Máquina con Windows, macOS o Linux con puerto Ethernet
- **Cable Ethernet**: Cable Cat5e o Cat6 para conexión por cable
- **Fuente de alimentación**: Adaptador de corriente original del router
- **Herramientas**: Clip de papel o similar para el botón de reinicio (si es necesario)

### Requisitos de Software
- **Navegador web**: Chrome, Firefox, Safari o Edge
- **Cliente TFTP**: Para situaciones de recuperación (PumpKIN, Tftpd64 o integrado)
- **Terminal/Símbolo del sistema**: Para diagnósticos de red

> **⚠️ Aviso de Seguridad**: La instalación del firmware conlleva riesgo de dañar el dispositivo ("brickearlo"). Asegúrate de tener una fuente de alimentación estable y sigue las instrucciones con precisión. Nunca interrumpas el proceso de flasheo.

## Paso 1: Descargar el Firmware LibreMesh

### Encontrar el Firmware de tu Router

1. **Visita el LibreMesh Firmware Selector**: https://firmware-selector.libremesh.org/
2. **Navega a la categoría de tu router**: Explora por fabricante (TP-Link, GL.iNet, Asus, etc.)
3. **Localiza el modelo y revisión exactos**: Coincide con precisión con tu dispositivo
4. **Elige el tipo de firmware**:
   - **`-factory.bin`**: Para routers con firmware de fábrica/original
   - **`-sysupgrade.bin`**: Para routers que ya ejecutan OpenWrt/LibreMesh

### Verificación del Firmware

> **🔒 Mejor Práctica de Seguridad**: Siempre verifica la integridad del firmware antes de la instalación para evitar que un firmware corrupto o malicioso dañe tu dispositivo.

**Descarga los archivos de verificación** junto con tu firmware:
- **Archivo de checksum SHA256**: Generalmente llamado `sha256sums`
- **Firma GPG**: A menudo `sha256sums.gpg` para verificar la autenticidad

**Verificar el checksum (Linux/macOS)**:
```bash
sha256sum -c sha256sums
```

**Verificar el checksum (Windows)**:
```powershell
Get-FileHash -Algorithm SHA256 filename.bin
```

**Compara la salida** con el valor del archivo de checksum. Deben coincidir exactamente.

> **💡 Consejo**: Si los checksums no coinciden, vuelve a descargar el firmware. Nunca instales firmware con checksums que no coincidan.

## Paso 2: Preparar tu Conexión de Red

### Configuración de Red de la Computadora

1. **Desactiva las conexiones inalámbricas**: Apaga el Wi-Fi para evitar conflictos de enrutamiento
2. **Configura una IP estática**: Establece la interfaz Ethernet de tu computadora para que coincida con la subred del router
   - **Dirección IP**: 192.168.1.100 (o 192.168.0.100)
   - **Máscara de Subred**: 255.255.255.0
   - **Puerta de Enlace**: Déjala en blanco por ahora

### Configuración de la Conexión Física

1. **Apaga el router**: Desconecta completamente el adaptador de corriente
2. **Conecta el cable Ethernet**: De la computadora al puerto LAN del router (no al WAN)
3. **Verifica la calidad del cable**: Asegúrate de que el cable no esté dañado y de que las conexiones estén firmes
4. **Enciende el router**: Conecta el adaptador de corriente y espera a que termine el arranque

### Métodos de Acceso al Router

**Para Routers con Firmware de Fábrica**:
- **Direcciones comunes**: 192.168.1.1 o 192.168.0.1
- **Revisa la etiqueta del router**: La IP predeterminada suele estar impresa en la etiqueta del dispositivo
- **Credenciales de acceso**: Generalmente admin/admin o admin/(en blanco)

**Para Routers OpenWrt**:
- **Dirección estándar**: 192.168.1.1
- **Inicio de sesión predeterminado**: root con contraseña vacía (si no está configurado)

**Para Routers LibreMesh**:
- **Dirección mágica**: http://thisnode.info
- **Alternativa**: 10.13.0.1 o la IP de la puerta de enlace configurada

## Paso 3: Acceder a la Interfaz Web del Router

### Solución de Problemas de Conexión

Si no puedes acceder a la interfaz web del router:

**Verifica la conectividad de red**:
```bash
# Test basic connectivity
ping 192.168.1.1
ping 192.168.0.1

# Check routing table
ip route show default    # Linux
route print             # Windows
netstat -rn             # macOS
```

**Encuentra la IP del router automáticamente**:
```bash
# Linux/macOS - scan common subnets
nmap -sn 192.168.1.0/24
nmap -sn 192.168.0.0/24

# Windows - check ARP table
arp -a
```

**Soluciones comunes**:
- **Verifica la conexión del cable**: Prueba diferentes puertos Ethernet
- **Revisa la fuente de alimentación**: Asegúrate de que el router esté completamente encendido y arrancado
- **Reinicia el router**: Usa el reinicio por hardware si la configuración está dañada
- **Prueba con otro navegador**: Algunos routers tienen problemas de compatibilidad con ciertos navegadores

## Paso 4: Flashear el Firmware LibreMesh

### Flasheo Estándar Basado en Web

1. **Navega a la sección de actualización de firmware**:
   - **TP-Link**: Advanced → System Tools → Firmware Upgrade
   - **Asus**: Administration → Firmware Upgrade
   - **GL.iNet**: System → Upgrade
   - **OpenWrt genérico**: System → Backup/Flash Firmware

2. **Sube el archivo de firmware**:
   - **Haz clic en "Choose File"** o "Browse"
   - **Selecciona tu archivo `-factory.bin`**
   - **Verifica que el nombre del archivo** coincida exactamente con tu router

3. **Verificaciones importantes antes del flasheo**:
   - [ ] Archivo de firmware correcto seleccionado
   - [ ] Fuente de alimentación estable confirmada
   - [ ] Sin otra actividad de red en el router
   - [ ] Copia de seguridad de la configuración actual (si lo deseas)

4. **Inicia el proceso de flasheo**:
   - **Haz clic en "Flash" o "Upgrade"**
   - **NO apagues** ni desconectes durante el proceso
   - **Espera a que termine** (típicamente 3-5 minutos)

### Procedimientos Específicos por Marca

**Omisión del Bloqueo FCC de TP-Link** (para modelos más recientes):
1. **Instala primero DD-WRT**: Usa la versión DD-WRT US apropiada
2. **Vuelve a fábrica**: Descarga el firmware oficial de reversión
3. **Renombra el firmware LibreMesh**: Coincide exactamente con la convención de nombres de TP-Link
4. **Flashea desde la interfaz de fábrica**: Sube el firmware LibreMesh renombrado

**Consideraciones para Ubiquiti AirOS**:
> **⚠️ Advertencia Crítica**: AirOS 5.6.x brickeará tu dispositivo. Haz primero un downgrade a AirOS 5.5.x usando el firmware oficial de las descargas de Ubiquiti.

**Dispositivos GL.iNet**:
- **Usa la recuperación U-Boot**: Si la interfaz web falla
- **Revisa los interruptores de hardware**: Algunos modelos tienen interruptores de selección de firmware

## Paso 5: Verificación Posterior a la Instalación

### Prueba Inicial de Conexión

Después de que se complete la instalación del firmware:

1. **Espera el reinicio del router**: Permite 2-3 minutos para el arranque completo
2. **Reconfigura la red de la computadora**: Establécela en DHCP o una IP estática apropiada
3. **Accede a la interfaz LibreMesh**: Navega a http://thisnode.info

### Configuración Inicial

**Establecer la Contraseña de Administrador**:
> **🔒 Crítico para la Seguridad**: Establece siempre una contraseña de administrador fuerte inmediatamente después de la instalación.

1. **Navega a la configuración de contraseña**: Generalmente se solicita en el primer acceso
2. **Elige una contraseña fuerte**: Mínimo 12 caracteres con mayúsculas y minúsculas, números y símbolos
3. **Guarda la configuración**: Aplica los ajustes y espera a que se recargue

**Verificación Básica de Red**:
```bash
# Test connectivity to LibreMesh node
ping thisnode.info

# Check mesh network advertisement
iwinfo wlan0 scan | grep LibreMesh

# Verify network interfaces
ip addr show
```

### Pasos Esenciales Posteriores a la Instalación

1. **Actualiza los paquetes del sistema**:
   ```bash
   opkg update
   opkg list-upgradable
   ```

2. **Configura la sincronización de hora**:
   - **Establece la zona horaria**: System → System → General Settings
   - **Habilita NTP**: Network → Time Synchronization

3. **Configura la red mesh**:
   - **Establece el nombre de red**: Personalízalo desde el predeterminado "LibreMesh.org"
   - **Configura los canales**: Optimiza según el entorno de RF local
   - **Establece la clave mesh**: Habilita el cifrado para el backhaul mesh

## Paso 6: Integración a la Red

### Configuración de la Pasarela de Internet

**Conecta la interfaz WAN**:
1. **Conexión física**: Fuente de internet al puerto WAN del router
2. **Configura el protocolo**: DHCP, PPPoE o estático según sea necesario
3. **Prueba la conectividad**: Verifica el acceso a internet a través de la mesh

**Configura los roles de los puertos** (para dispositivos de un solo puerto):
```bash
# Set specific port as WAN
uci set network.wan.ifname='eth0.2'
uci commit network
service network restart
```

### Unión a la Red Mesh

**Descubrimiento automático de la mesh**:
- Los nodos LibreMesh descubren automáticamente a sus vecinos
- **Verifica los enlaces mesh**: Network → Mesh Status
- **Revisa las tablas de enrutamiento**: Advanced → Status → Routes

**Configuración manual de la mesh** (si es necesario):
```bash
# Set mesh ID and key
uci set lime.wifi.ap_ssid='YourNetworkName'
uci set lime.wifi.adhoc_ssid='YourMeshName_mesh'
uci commit lime
lime-config
reboot
```
## Solución de problemas de instalación

### Recuperación de un flasheo fallido

Si la instalación del firmware falla:

1. **No entres en pánico**: La mayoría de los routers tienen mecanismos de recuperación
2. **Prueba la recuperación por TFTP**: Consulta la [Guía de solución de problemas del router](router-troubleshooting.md)
3. **Usa el reinicio por hardware**: Mantén presionado el botón de reinicio durante el arranque
4. **Recuperación por consola serial**: Último recurso para usuarios avanzados

### Problemas comunes de instalación

**Errores de "Invalid Firmware" (Firmware no válido)**:
- **Verifica el nombre del archivo del firmware**: Debe coincidir con el formato esperado
- **Verifica el modelo/revisión**: Asegúrate de la compatibilidad exacta con el hardware
- **Prueba un método de carga diferente**: Interfaz web vs. TFTP

**El proceso de flasheo se cuelga**:
- **Apaga y enciende el router**: Intenta entrar en modo de recuperación
- **Verifica la conectividad de red**: Asegúrate de tener una conexión estable
- **Reduce el tráfico de red**: Cierra otras aplicaciones

**El router no responde después del flasheo**:
- **Espera más tiempo**: Algunos routers necesitan 5+ minutos para el primer arranque
- **Verifica los patrones de los LED**: Compáralos con la secuencia de arranque normal
- **Prueba el restablecimiento de fábrica**: Procedimiento con el botón de reinicio por hardware

## Lista de verificación

Después de una instalación exitosa de LibreMesh:

- [ ] **Contraseña de administrador establecida**: Contraseña segura configurada
- [ ] **Conectividad de red**: Acceso a Internet a través de la mesh
- [ ] **Interfaz web accesible**: http://thisnode.info carga correctamente
- [ ] **Red mesh activa**: Otros nodos visibles en el estado de la mesh
- [ ] **Redes inalámbricas transmitiendo**: Tanto el SSID de clientes como el de la mesh
- [ ] **Hora del sistema sincronizada**: Zona horaria y NTP correctos
- [ ] **Servicios básicos en funcionamiento**: SSH, interfaz web, protocolos de la mesh

## Próximos pasos

Con LibreMesh instalado exitosamente:

1. **Revisa la [Guía de solución de problemas del router](router-troubleshooting.md)** para procedimientos de mantenimiento
2. **Planifica nodos adicionales**: Amplía la cobertura de la red mesh
3. **Configura funciones avanzadas**: QoS, portal cautivo, monitoreo
4. **Únete al soporte de la comunidad**: Listas de correo y foros para ayuda continua

> **📚 Recursos adicionales**: 
> - Documentación de configuración de LibreMesh: https://libremesh.org/docs/
> - Gestión de paquetes de OpenWrt: https://openwrt.org/docs/guide-user/additional-software/opkg
> - Foros de soporte de la comunidad: https://libremesh.org/communication.html