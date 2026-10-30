---
title: Solución de problemas del router
sourcePath: guides/router-troubleshooting.md
sourceHash: cce5d4c4d3a82707
translatedBy: glm-4.6
---

# Guía de Solución de Problemas de Routers

Esta guía proporciona procedimientos sistemáticos de solución de problemas para problemas comunes de configuración y flasheo de routers, incluidos flasheos incompletos, dispositivos que no responden, restauración de firmware, prácticas de restablecimiento físico y métodos avanzados de recuperación por puerto serial.

## Referencia Rápida de Respuesta ante Emergencias

### Acciones Inmediatas para un Router Bloqueado (Bricked)

**Si tu router parece "bloqueado" (sin respuesta):**

1. **Mantén la calma**: La mayoría de las situaciones son recuperables
2. **No apagues y enciendas repetidamente**: Esto puede empeorar la situación
3. **Revisa los patrones de los LED**: Anota el comportamiento actual para el diagnóstico
4. **Verifica la fuente de alimentación**: Asegúrate de que el voltaje y la corriente sean adecuados
5. **Intenta un restablecimiento de hardware**: Sigue los procedimientos específicos de cada marca que se indican a continuación

> **⚠️ Importante**: Nunca intentes varios métodos de recuperación simultáneamente. Completa un método por completo antes de probar otro.

## Procedimientos de Restablecimiento de Hardware

### Método Universal del Botón de Restablecimiento

*`[Reset Button Location](router-reset-button.png)` — Fotografía destacada del botón de restablecimiento de hardware típico en un router, mostrando la ubicación del botón y los indicadores circundantes.*

**Procedimiento Básico de Restablecimiento**:
1. **Localiza el botón de restablecimiento**: Generalmente es un orificio hundido etiquetado "RESET"
2. **Prepara la herramienta**: Clip, alfiler u objeto puntiagudo similar
3. **Enciende el router**: Asegúrate de que el dispositivo esté completamente encendido
4. **Presiona y mantén presionado**: Inserta la herramienta y presiona el botón con firmeza
5. **Duración de la presión**: 10-30 segundos según el fabricante
6. **Suelta y espera**: Permite que el router complete el ciclo de reinicio

### Procedimientos de Restablecimiento por Marca

**Routers TP-Link**:
```
Estado de energía: ON
Botón: WPS/RESET
Duración: 10+ segundos
Indicador: El LED de SYS cambia de parpadeo lento a parpadeo rápido
Acción: Suelte el botón cuando cambie el patrón del LED
```

**Routers ASUS**:
```
Estado de energía: ON
Botón: RESET (panel trasero)
Duración: 5-10 segundos
Indicador: El LED de Power parpadea rápidamente
Acción: Suelte cuando cambie el comportamiento del LED
```

**Routers GL.iNet**:
```
Estado de energía: ON
Botón: RESET
Duración: 10 segundos
Indicador: El LED se apaga brevemente y luego queda fijo
Acción: Suelte cuando el LED se estabilice
```

**Dispositivos Ubiquiti**:
```
Estado de energía: Encender mientras se mantiene presionado
Botón: RESET
Duración: Mantener presionado durante el encendido por 10 segundos
Indicador: Cambia la secuencia del LED
Especial: Para recuperación TFTP, continúe presionando hasta ver un patrón específico del LED
```

**Routers Netgear**:
```
Estado de energía: ON
Botón: RESET (trasero o lateral)
Duración: 7+ segundos
Indicador: El LED de Power cambia de color o patrón
Acción: Suelte cuando el LED indique el modo de restablecimiento de fábrica
```

### Modos Avanzados de Restablecimiento

**Funciones de Restablecimiento de RouterBOARD/MikroTik**:
- **3 segundos**: Cargar el bootloader de respaldo
- **Mantener hasta que el LED parpadee**: Restablecer la configuración a los valores predeterminados
- **+5 segundos (LED fijo)**: Activar el modo CAPs
- **+5 segundos más (LED apagado)**: Modo Netinstall

## Procedimientos de Recuperación TFTP

### Configuración de la Recuperación TFTP

**Requisitos previos**:
- **Software de servidor TFTP**: PumpKIN (Windows), tftpd (Linux/macOS)
- **Firmware de recuperación**: Imagen de firmware de fábrica apropiada
- **Configuración de red**: IP estática en la subred del router
- **Conexión directa**: Cable Ethernet entre la computadora y el router

**Configuración de Red**:
```
IP de la computadora: 192.168.0.66 (o 192.168.1.66)
Máscara de subred: 255.255.255.0
Puerta de enlace: (dejar en blanco)
IP del router: 192.168.0.1 (o 192.168.1.1)
```

### Ejecución de la Recuperación TFTP

**Proceso Estándar de Recuperación TFTP**:

1. **Prepara el servidor TFTP**:
   - Instala y configura el software del servidor TFTP
   - Coloca el firmware de recuperación en el directorio raíz de TFTP
   - Inicia el servicio TFTP

2. **Configura la red**:
   - Establece la IP de la computadora en la subred apropiada
   - Deshabilita temporalmente el cortafuegos
   - Asegúrate de que no haya otros servidores DHCP activos

3. **Inicia el modo de recuperación**:
   - Apaga el router por completo
   - Mantén presionado el botón de restablecimiento con firmeza
   - Aplica energía mientras continúas manteniendo presionado el restablecimiento
   - Observa si aparece una solicitud TFTP en los registros del servidor

4. **Transferencia de archivos**:
   - El router solicita un nombre de archivo específico (a menudo "recovery.bin")
   - El servidor TFTP transfiere el firmware automáticamente
   - Espera a que se complete la transferencia (generalmente 30-60 segundos)

5. **Instalación**:
   - El router flashea el firmware internamente
   - Espera 2-5 minutos para la instalación
   - El dispositivo se reinicia con el firmware de fábrica

### Procedimientos TFTP por Marca

**Recuperación TFTP de TP-Link**:
```
Nombre del firmware: "recovery.bin" (renombrar su archivo de firmware)
IP del router: 192.168.0.1
IP de la computadora: 192.168.0.66
Mantener Reset: Durante el encendido hasta que comience la transferencia
Duración esperada: 30-45 segundos de transferencia, 2-3 minutos en total
```

**Recuperación TFTP de Ubiquiti**:
```
Nombre del firmware: Nombre de archivo original del firmware de Ubiquiti
IP del router: 192.168.1.20
IP de la computadora: 192.168.1.xxx (no .20)
Mantener Reset: 20+ segundos durante el encendido
Patrón del LED: Un patrón alternado de 2 LEDs indica que está listo
```

**Recuperación TFTP de Netgear**:
```
Nombre del firmware: "recovery.img" o nombre específico del dispositivo
IP del router: 192.168.1.1
IP de la computadora: 192.168.1.2
Mantener Reset: Durante el encendido hasta que el LED de Power se vuelva ámbar
Indicador: El LED de Power en ámbar indica que el modo TFTP está activo
```

## Recuperación por Consola Serial

### Cuándo Usar la Consola Serial

**La recuperación por consola serial es necesaria cuando**:
- La recuperación TFTP falla
- El bootloader está dañado
- No hay conectividad de red disponible
- Se requiere depuración avanzada

> **⚠️ Procedimiento Avanzado**: La recuperación por consola serial requiere modificación de hardware y habilidades técnicas avanzadas. Procede solo si te sientes cómodo trabajando con electrónica.

### Configuración del Hardware de la Consola Serial

*`[Serial Console Hookup](router-serial-console.png)` — Fotografía o diagrama de la conexión de cables seriales para una recuperación avanzada, mostrando los puntos de conexión y el enrutamiento de los cables.*

**Equipo Necesario**:
- **Adaptador USB a TTL**: Niveles lógicos de 3.3V (NO RS232)
- **Cables jumper**: Hembra a macho o conectores apropiados
- **Equipo de soldadura**: Si se requiere instalar un header
- **Multímetro**: Para verificar el voltaje

**Mapa de Conexiones**:
```
Router          Adaptador USB-TTL
GND     <--->   GND
TX      <--->   RX
RX      <--->   TX
VCC     <--->   (generalmente no conectado)
```

> **🔌 Advertencia de Voltaje**: Asegúrate de que el adaptador USB-TTL funcione a 3.3V. Los niveles de 5V pueden dañar permanentemente los circuitos del router.

### Acceso a la Consola Serial

**Configuración del Software**:
- **Velocidad (Baud Rate)**: 115200 (la más común)
- **Bits de Datos**: 8
- **Paridad**: Ninguna
- **Bits de Parada**: 1
- **Control de Flujo**: Ninguno

**Opciones de Software de Terminal**:
- **Windows**: PuTTY, TeraTerm
- **macOS**: Screen, Minicom
- **Linux**: Minicom, Screen, Picocom

**Comandos de Conexión**:
```bash
# Linux/macOS
screen /dev/ttyUSB0 115200

# Alternative Linux
minicom -D /dev/ttyUSB0 -b 115200

# Windows (use PuTTY GUI or)
putty -serial COM3 -sercfg 115200,8,n,1,N
```

### Intervención del Bootloader

**Indicaciones Comunes del Bootloader**:
- **U-Boot**: "Hit any key to stop autoboot"
- **CFE**: Prompt "CFE>"
- **RedBoot**: Prompt "RedBoot>"

**Comandos Típicos de Recuperación**:
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

## Procedimientos de Restauración de Firmware

### Restauración del Firmware Original

*`[Restoring Firmware Process](restoring-firmware.png)` — Serie o diagrama que muestra los pasos para recuperarse de una instalación fallida, incluyendo las conexiones de cables y capturas de pantalla de la interfaz.*

**Cuándo Restaurar el Firmware Original**:
- La instalación de LibreMesh falló
- Problemas de rendimiento del dispositivo
- Consideraciones de garantía
- Venta/devolución del dispositivo

**Prioridad de los Métodos de Restauración**:
1. **Actualización desde la interfaz web**: Si LibreMesh/OpenWrt sigue siendo accesible
2. **Recuperación TFTP**: Usando el firmware de fábrica original
3. **Consola serial**: Para problemas graves del bootloader
4. **Servicio profesional**: Si los métodos anteriores fallan

### Obtención del Firmware Original

**Fuentes Oficiales**:
- **Sitio web del fabricante**: Sección de descargas/soporte
- **Página del modelo del dispositivo**: Firmware exacto para tu revisión
- **Coincidencia de versión**: Asegúrate de que el firmware coincida exactamente con la revisión del hardware

**Selección del Firmware**:
- **Firmware de fábrica**: Para una restauración completa
- **Firmware de recuperación**: Versiones mínimas especiales para TFTP
- **Versiones regionales**: Coincide con la región del firmware original si se especifica

## Diagnóstico de Problemas Comunes

### Análisis de Patrones de LED

**Patrones Normales de Arranque**:
- **Al encender**: Todos los LED se iluminan brevemente
- **Proceso de arranque**: Activación secuencial de los LED
- **Operación normal**: LED de energía, inalámbrico y ethernet estables

**Indicadores de Problemas**:
- **Todos los LED apagados**: Falla de la fuente de alimentación
- **Solo LED de energía**: Falla de arranque, intenta restablecer
- **Parpadeo rápido**: A menudo indica modo de recuperación
- **Patrones alternantes**: Puede indicar modo TFTP
- **Bucles de arranque continuos**: Firmware dañado

### Pruebas de Conectividad de Red

**Verificación Básica de Conectividad**:
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

### Problemas de Memoria y Rendimiento

**Síntomas de Memoria Insuficiente**:
- Respuesta lenta de la interfaz web
- Tiempos de espera agotados en las conexiones
- Fallos de los servicios
- Incapacidad para instalar paquetes

**Diagnóstico de Memoria**:
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

## Prevención y Mantenimiento

### Precauciones Antes de Flashear

**Antes de Cualquier Instalación de Firmware**:
- [ ] **Verifica la estabilidad de la energía**: Usa un UPS si está disponible
- [ ] **Comprueba la compatibilidad del firmware**: Coincidencia exacta de modelo/revisión
- [ ] **Realiza una copia de seguridad del firmware actual**: Si hay una ruta de actualización disponible
- [ ] **Lee las notas de instalación**: Requisitos específicos del dispositivo
- [ ] **Prepara las herramientas de recuperación**: Servidor TFTP, adaptador serial
- [ ] **Documenta la configuración actual**: Copia de seguridad de la configuración de red

### Prácticas de Mantenimiento Regular

**Mantenimiento Mensual**:
- **Revisa los registros del sistema**: Busca errores o advertencias
- **Monitorea el uso de memoria**: Asegúrate de que haya suficiente espacio libre
- **Verifica la conectividad de la malla**: Prueba las rutas de red
- **Actualiza las claves de seguridad**: Rota las contraseñas si es necesario

**Mantenimiento Trimestral**:
- **Actualizaciones de firmware**: Revisa si hay versiones nuevas de LibreMesh
- **Copia de seguridad de la configuración**: Guarda la configuración actual
- **Pruebas de rendimiento**: Verificaciones de ancho de banda y latencia
- **Inspección física**: Revisa si hay sobrecalentamiento o daños
## Información de Contacto de Emergencia

### Recursos de Soporte de la Comunidad

**Comunidad LibreMesh**:
- **Lista de Correo**: lime-users@lists.libremesh.org
- **Canal IRC**: #libremesh en oftc.net
- **Foro**: Discusiones de la comunidad y resolución de problemas

**Comunidad OpenWrt**:
- **Foro**: https://forum.openwrt.org/
- **Wiki**: Guías de solución de problemas específicas por dispositivo
- **Listas de desarrolladores**: Problemas de implementación técnica

### Servicios Profesionales de Recuperación

**Cuándo Buscar Ayuda Profesional**:
- Modificación de hardware requerida (soldadura)
- Corrupción del bootloader más allá de la recuperación serial
- Despliegue crítico con restricciones de tiempo
- Cobertura de seguro/garantía disponible

## Verificación del Éxito de la Recuperación

### Lista de Verificación Post-Recovery

Después de cualquier procedimiento de recuperación:

- [ ] **El router responde**: Interfaz web o SSH accesible
- [ ] **Conectividad de red**: Acceso a Internet restaurado
- [ ] **Todas las interfaces funcionales**: Inalámbrica y ethernet operativas
- [ ] **Patrones de LED normales**: Indicadores operativos estándar
- [ ] **Rendimiento aceptable**: Sin problemas evidentes de velocidad/estabilidad
- [ ] **Configuración restaurada**: Los ajustes coinciden con los requisitos

### Monitoreo a Largo Plazo

**Monitorear Problemas Recurrentes**:
- **Estabilidad del sistema**: Tiempo de actividad y frecuencia de fallos
- **Tendencias de uso de memoria**: Consumo de memoria creciente
- **Rendimiento de red**: Cambios en ancho de banda y latencia
- **Análisis de registros**: Patrones de errores repetidos

> **📋 Documentación**: Mantenga registros detallados de todos los procedimientos de solución de problemas y sus resultados. Esta información es valiosa para prevenir problemas futuros y ayudar a miembros de la comunidad con problemas similares.

## Guías Relacionadas

- **[Guía de Selección de Router](router-selection-guide.md)**: Elija el hardware apropiado para minimizar problemas
- **[Guía de Instalación de LibreMesh](libremesh-installation.md)**: Procedimientos de instalación adecuados para evitar problemas
- **Configuración de LibreMesh**: Configuración avanzada para optimizar el rendimiento