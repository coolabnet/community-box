---
title: Instalación
sourcePath: guides/libremesh-installation.md
sourceHash: 1170d67029ff662a
translatedBy: glm-4.6
---

# Guía de Instalación del Firmware LibreMesh

Esta guía completa proporciona instrucciones paso a paso para descargar, verificar, preparar e instalar (flashear) el firmware LibreMesh en tu router de destino. Sigue estos procedimientos con cuidado para garantizar una instalación exitosa y evitar daños al dispositivo.

## Requisitos Previos a la Instalación

### Preparación del Hardware
- **Router**: Dispositivo compatible de la [Guía de Selección de Router](router-selection-guide.md)
- **Computadora**: Máquina con Windows, macOS o Linux con puerto Ethernet
- **Cable Ethernet**: Cable Cat5e o Cat6 para conexión cableada
- **Fuente de alimentación**: Adaptador de corriente original del router
- **Herramientas**: Clip de papel o similar para el botón de reinicio (si es necesario)

### Requisitos de Software
- **Navegador web**: Chrome, Firefox, Safari o Edge
- **Cliente TFTP**: Para situaciones de recuperación (PumpKIN, Tftpd64 o integrado)
- **Terminal/Símbolo del sistema**: Para diagnósticos de red

> **⚠️ Aviso de Seguridad**: La instalación del firmware conlleva el riesgo de dañar el dispositivo ("brickearlo"). Asegúrate de tener una fuente de alimentación estable y sigue las instrucciones con precisión. Nunca interrumpas el proceso de flasheo.

## Paso 1: Descargar el Firmware LibreMesh

### Encontrar el Firmware de tu Router

*`[Firmware Selector Screenshot](libremesh-download-page.png)` — Herramienta del Selector de Firmware de LibreMesh para encontrar el firmware correcto.*

1. **Visita el Selector de Firmware de LibreMesh**: https://firmware-selector.libremesh.org/
2. **Navega a la categoría de tu router**: Explora por fabricante (TP-Link, GL.iNet, Asus, etc.)
3. **Localiza el modelo y revisión exactos**: Haz coincidir tu dispositivo con precisión
4. **Elige el tipo de firmware**:
   - **`-factory.bin`**: Para routers con firmware de fábrica/original
   - **`-sysupgrade.bin`**: Para routers que ya ejecutan OpenWrt/LibreMesh

### Verificación del Firmware

> **🔒 Mejores Prácticas de Seguridad**: Siempre verifica la integridad del firmware antes de la instalación para evitar que un firmware dañado o malicioso dañe tu dispositivo.

**Descarga los archivos de verificación** junto con tu firmware:
- **Archivo de checksum SHA256**: Generalmente llamado `sha256sums`
- **Firma GPG**: Frecuentemente `sha256sums.gpg` para verificación de autenticidad

**Verificar checksum (Linux/macOS)**:
```bash
sha256sum -c sha256sums
```

**Verificar checksum (Windows)**:
```powershell
Get-FileHash -Algorithm SHA256 filename.bin
```

**Compara la salida** con el valor del archivo de checksum. Deben coincidir exactamente.

> **💡 Consejo**: Si los checksums no coinciden, vuelve a descargar el firmware. Nunca instales un firmware con checksums que no coincidan.

## Paso 2: Preparar tu Conexión de Red

### Configuración de Red de la Computadora

1. **Desactiva las conexiones inalámbricas**: Apaga el Wi-Fi para evitar conflictos de enrutamiento
2. **Configura una IP estática**: Establece la interfaz Ethernet de tu computadora para que coincida con la subred del router
   - **Dirección IP**: 192.168.1.100 (o 192.168.0.100)
   - **Máscara de Subred**: 255.255.255.0
   - **Puerta de enlace**: Déjala en blanco por ahora

### Configuración de la Conexión Física

*`[Ethernet Connection Preparation](ethernet-cable-setup.png)` — Usuario conectando el cable LAN entre la computadora y el router para el flasheo, mostrando el enrutamiento adecuado del cable y los puntos de conexión.*

1. **Apaga el router**: Desconecta completamente el adaptador de corriente
2. **Conecta el cable Ethernet**: De la computadora al puerto LAN del router (no al WAN)
3. **Verifica la calidad del cable**: Asegúrate de que el cable no esté dañado y de que las conexiones estén firmes
4. **Enciende el router**: Conecta el adaptador de corriente y espera a que termine el arranque

### Métodos de Acceso al Router

**Para routers con firmware de fábrica**:
- **Direcciones comunes**: 192.168.1.1 o 192.168.0.1
- **Revisa la etiqueta del router**: La IP predeterminada suele estar impresa en la etiqueta del dispositivo
- **Credenciales de acceso**: Generalmente admin/admin o admin/(en blanco)

**Para routers con OpenWrt**:
- **Dirección estándar**: 192.168.1.1
- **Inicio de sesión predeterminado**: root con contraseña vacía (si no está configurado)

**Para routers con LibreMesh**:
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
- **Revisa la fuente de alimentación**: Asegúrate de que el router esté completamente alimentado y arrancado
- **Reinicia el router**: Usa el reinicio por hardware si la configuración está dañada
- **Prueba con otro navegador**: Algunos routers tienen problemas de compatibilidad con ciertos navegadores

## Paso 4: Flashear el Firmware LibreMesh

### Flasheo Estándar Basado en Web

*`[Router in Flash Mode](router-flash-mode.png)` — Router con LEDs o indicadores físicos señalando el modo de flasheo de firmware, mostrando los patrones típicos de LED durante la carga del firmware.*

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
   - [ ] Respaldo de la configuración actual (si se desea)

4. **Inicia el proceso de flasheo**:
   - **Haz clic en "Flash" o "Upgrade"**
   - **NO apagues** ni desconectes durante el proceso
   - **Espera a que termine** (generalmente 3-5 minutos)

### Procedimientos Específicos por Marca

**Omisión del Bloqueo FCC de TP-Link** (para modelos más recientes):
1. **Instala DD-WRT primero**: Usa la versión US de DD-WRT adecuada
2. **Vuelve a la versión de fábrica**: Descarga el firmware oficial de reversión
3. **Renombra el firmware LibreMesh**: Haz coincidir la convención de nombres exacta de TP-Link
4. **Flashea desde la interfaz de fábrica**: Sube el firmware LibreMesh renombrado

**Consideraciones para Ubiquiti AirOS**:
> **⚠️ Advertencia Crítica**: AirOS 5.6.x dejará tu dispositivo inutilizable. Primero haz un downgrade a AirOS 5.5.x usando el firmware oficial de las descargas de Ubiquiti.

**Dispositivos GL.iNet**:
- **Usa la recuperación U-Boot**: Si la interfaz web falla
- **Revisa los interruptores de hardware**: Algunos modelos tienen interruptores de selección de firmware

## Paso 5: Verificación Posterior a la Instalación

### Prueba Inicial de Conexión

Después de que la instalación del firmware termine:

1. **Espera el reinicio del router**: Permite 2-3 minutos para el arranque completo
2. **Reconfigura la red de la computadora**: Establécela en DHCP o una IP estática apropiada
3. **Accede a la interfaz de LibreMesh**: Navega a http://thisnode.info

### Configuración Inicial

**Establecer la Contraseña de Administrador**:
> **🔒 Crítico para la Seguridad**: Siempre establece una contraseña de administrador fuerte inmediatamente después de la instalación.

1. **Navega a la configuración de contraseña**: Generalmente se solicita en el primer acceso
2. **Elige una contraseña fuerte**: Mínimo 12 caracteres con mayúsculas y minúsculas, números y símbolos
3. **Guarda la configuración**: Aplica los ajustes y espera a que se recargue

**Verificación Básica de la Red**:
```bash
# Test connectivity to LibreMesh node
ping thisnode.info

# Check mesh network advertisement
iwinfo wlan0 scan | grep LibreMesh

# Verify network interfaces
ip addr show
```

### Pasos Esenciales Después de la Instalación

1. **Actualiza los paquetes del sistema**:
   ```bash
   opkg update
   opkg list-upgradable
   ```

2. **Configura la sincronización de hora**:
   - **Establece la zona horaria**: System → System → General Settings
   - **Habilita NTP**: Network → Time Synchronization

3. **Configura la red mesh**:
   - **Establece el nombre de la red**: Personaliza el nombre predeterminado "LibreMesh.org"
   - **Configura los canales**: Optimiza según el entorno de RF local
   - **Establece la clave mesh**: Habilita el cifrado para el backhaul mesh

## Paso 6: Integración a la Red

### Configuración de la Puerta de Enlace a Internet

**Conecta la interfaz WAN**:
1. **Conexión física**: Fuente de internet al puerto WAN del router
2. **Configura el protocolo**: DHCP, PPPoE o estático según se requiera
3. **Prueba la conectividad**: Verifica el acceso a internet a través de la red mesh

**Configura los roles de los puertos** (para dispositivos de un solo puerto):
```bash
# Set specific port as WAN
uci set network.wan.ifname='eth0.2'
uci commit network
service network restart
```

### Unión a la Red Mesh

**Descubrimiento automático de la red mesh**:
- Los nodos LibreMesh descubren automáticamente a sus vecinos
- **Verifica los enlaces mesh**: Network → Mesh Status
- **Revisa las tablas de enrutamiento**: Advanced → Status → Routes

**Configuración manual de la red mesh** (si es necesario):
```bash
# Set mesh ID and key
uci set lime.wifi.ap_ssid='YourNetworkName'
uci set lime.wifi.adhoc_ssid='YourMeshName_mesh'
uci commit lime
lime-config
reboot
```
## Solución de problemas de instalación

### Fallo en la recuperación del flasheo

Si falla la instalación del firmware:

1. **No entre en pánico**: La mayoría de los routers tienen mecanismos de recuperación
2. **Pruebe la recuperación TFTP**: Consulte la [Guía de solución de problemas del router](router-troubleshooting.md)
3. **Use reinicio por hardware**: Mantenga presionado el botón de reinicio durante el arranque
4. **Recuperación por consola serie**: Último recurso para usuarios avanzados

### Problemas comunes de instalación

**Errores de "Firmware no válido"**:
- **Verifique el nombre del archivo del firmware**: Debe coincidir con el formato esperado
- **Verifique el modelo/revisión**: Asegure la compatibilidad exacta con el hardware
- **Pruebe un método de carga diferente**: Interfaz web vs. TFTP

**El proceso de flasheo se queda colgado**:
- **Reinicie el router (ciclo de energía)**: Intente el modo de recuperación
- **Verifique la conectividad de red**: Asegure una conexión estable
- **Reduzca el tráfico de red**: Cierre otras aplicaciones

**Router sin respuesta después del flasheo**:
- **Espere más tiempo**: Algunos routers necesitan 5+ minutos para el primer arranque
- **Verifique los patrones de LED**: Compárelos con la secuencia normal de arranque
- **Intente restablecer de fábrica**: Procedimiento del botón de reinicio por hardware

## Lista de verificación

Después de una instalación exitosa de LibreMesh:

- [ ] **Contraseña de administrador configurada**: Contraseña segura establecida
- [ ] **Conectividad de red**: Acceso a Internet a través de la malla
- [ ] **Interfaz web accesible**: http://thisnode.info carga correctamente
- [ ] **Red en malla activa**: Otros nodos visibles en el estado de la malla
- [ ] **Redes inalámbricas transmitiendo**: Ambos SSIDs, de cliente y de malla
- [ ] **Hora del sistema sincronizada**: Zona horaria y NTP correctos
- [ ] **Servicios básicos en ejecución**: SSH, interfaz web, protocolos de malla

## Próximos pasos

Con LibreMesh instalado correctamente:

1. **Revise la [Guía de solución de problemas del router](router-troubleshooting.md)** para conocer los procedimientos de mantenimiento
2. **Planifique nodos adicionales**: Expanda la cobertura de la red en malla
3. **Configure funciones avanzadas**: QoS, portal cautivo, monitoreo
4. **Únase al soporte de la comunidad**: Listas de correo y foros para ayuda continua

> **📚 Recursos adicionales**: 
> - Documentación de configuración de LibreMesh: https://libremesh.org/docs/
> - Gestión de paquetes de OpenWrt: https://openwrt.org/docs/guide-user/additional-software/opkg
> - Foros de soporte de la comunidad: https://libremesh.org/communication.html