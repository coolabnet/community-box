---
title: Configuración del BIOS
sourcePath: hardware/intel_nuc/nuc-bios-setup.md
sourceHash: 48f435ea0fc646fe
translatedBy: glm-4.6
---

# Guía de configuración de BIOS/UEFI de Intel NUC para despliegue de servidor comunitario

## Introducción

Una configuración adecuada de BIOS/UEFI es crucial para el funcionamiento estable de los dispositivos Intel NUC como servidores. Esta guía proporciona instrucciones paso a paso adaptadas para plataformas de servidor comunitario como YunoHost, Caprover y CasaOS, centradas en la fiabilidad, la seguridad y el rendimiento óptimo.

## Preparación previa a la configuración

### Equipo necesario
- **Teclado USB con cable** (los teclados Bluetooth pueden no funcionar en la BIOS)
- **Monitor HDMI/DisplayPort** (las pantallas USB-C pueden no mostrar la BIOS)
- **Adaptador de corriente** adecuado para tu modelo de NUC
- **Memoria USB** (para actualizaciones de BIOS si es necesario)

### Notas importantes
- Conecta siempre el teclado a los puertos USB traseros para acceder a la BIOS
- Desactiva Fast Boot en Windows antes de acceder a la BIOS si usas arranque dual
- Ten lista tu contraseña de supervisor de BIOS/UEFI si la estableciste previamente

## Acceso a la BIOS/UEFI

### Método estándar
1. **Enciende** el NUC mientras mantienes pulsada la tecla **F2**
2. Sigue manteniendo F2 hasta que aparezca la configuración de la BIOS
3. Si usas un ASUS NUC, es posible que veas brevemente el logotipo de ASUS

### Métodos alternativos (si F2 falla)

#### Método 1: Menú del botón de encendido
1. **Apaga** el NUC completamente
2. **Mantén pulsado** el botón de encendido durante 3 segundos y suéltalo
3. **Pulsa F7** cuando aparezca el Power Button Menu
4. Selecciona "BIOS Setup" en el menú

#### Método 2: Arranque en frío
1. **Desenchufa** completamente el adaptador de corriente
2. Espera 10 segundos
3. **Vuelve a conectar** la corriente y pulsa F2 repetidamente de inmediato
4. Este método suele funcionar cuando Fast Boot está habilitado

#### Método 3: Configuración UEFI (Windows)
Si Windows está instalado:
1. Mantén pulsada **Shift** mientras haces clic en "Restart" (Reiniciar)
2. Ve a **Troubleshoot** → **Advanced Options** → **UEFI Firmware Settings**
3. Haz clic en **Restart** para arrancar en la BIOS

## Configuración inicial de la BIOS

### Paso 1: Restablecer los valores predeterminados
```
1. Presione F9 (Load BIOS Defaults)
2. Confirme con Enter
3. Esto asegura una configuración inicial limpia
```

### Paso 2: Información básica del sistema
Verifica que la siguiente información sea correcta:
- **Versión de BIOS**: Anota la versión actual
- **Modelo de CPU**: Confirma la identificación del procesador
- **Memoria**: Verifica que se detecte toda la RAM instalada
- **Almacenamiento**: Comprueba que se reconozcan todas las unidades

## Ajustes esenciales para servidor

### Configuración de seguridad

#### Establecer contraseña de supervisor
```
Navigation: Advanced → Security → Passwords → Set Supervisor Password
Recommended: Contraseña de 12+ caracteres con mezcla de letras y números
Storage: Documente la contraseña de forma segura - requerida para cambios futuros
```

#### Configurar Secure Boot (Recomendado: Disabled para Linux)
```
Navigation: Advanced → Security → Secure Boot
Setting: Disabled
Reason: Muchas distribuciones de Linux requieren Secure Boot disabled
Alternative: Algunas distribuciones más nuevas son compatibles con Secure Boot
```

#### Configuración de arranque
```
Navigation: Advanced → Boot → Boot Configuration
Settings:
- Network Boot: Disabled (a menos que se requiera arranque PXE)
- USB Boot: Enabled (para medios de instalación)
- Boot Device Control: Lock UEFI Boot (evita cambios no autorizados)
```

### Ajustes de gestión de energía

#### Configurar el comportamiento de energía
```
Navigation: Advanced → Power → Secondary Power Settings

After Power Failure: Power On
- Asegura que el servidor se reinicie automáticamente tras cortes de energía
- Crítico para la operación de servidores headless

Wake on LAN: Enabled
- Permite el despertar remoto mediante magic packets de red
- Útil para una operación eficiente en energía

USB Wake Support: Disabled
- Evita despertares accidentales por actividad de dispositivos USB
- Recomendado para la estabilidad del servidor
```

#### Ajustes de energía de la CPU
```
Navigation: Advanced → Power → CPU Power Management

Enhanced Intel SpeedStep: Enabled
- Permite el escalado dinámico de frecuencia de CPU
- Mejora la eficiencia energética con cargas variables

Turbo Mode: Enabled
- Permite que la CPU exceda la frecuencia base cuando sea necesario
- Importante para el rendimiento del servidor en picos de carga
```

### Refrigeración y gestión térmica

#### Configuración del control de ventiladores
```
Navigation: Advanced → Cooling → CPU Fan Header

Fan Control Mode: Quiet
- Minimizes noise for home/office environments
- Alternative: Balanced for higher performance needs

Custom Fan Curves: Available on some models
- Set based on temperature thresholds
- Balance between cooling and noise
```

### Configuración de almacenamiento

#### Ajustes de M.2 y SATA
```
Navigation: Advanced → Devices → Storage

SATA Mode: AHCI
- Requerido para compatibilidad con Linux
- NO use el modo RAID/RST a menos que sea específicamente necesario

M.2 Slot Configuration: Auto
- Permite la detección automática de unidades NVMe/SATA
- Verifique que todas las unidades instaladas aparezcan en la lista
```

#### Configuración de prioridad de arranque
```
Navigation: Advanced → Boot → Boot Priority

UEFI Boot Priority:
1. USB (para instalación)
2. Dispositivo de almacenamiento principal
3. Arranque por red (si es requerido)

Legacy Boot: Disabled
- Los sistemas operativos modernos prefieren UEFI
- Reduce posibles problemas de compatibilidad
```

## Ajustes específicos del sistema operativo

### Distribuciones de servidor Linux (Ubuntu, Debian, CentOS)

#### Ajustes esenciales
```
UEFI Boot: Enabled
Secure Boot: Disabled
CSM (Compatibility Support Module): Disabled
Intel VT-x: Enabled (para virtualización)
Intel VT-d: Enabled (para virtualización avanzada)
```

#### Configuración de red
```
Navigation: Advanced → Devices → Network

Wake on LAN: Enabled
Network Stack: Enabled (para PXE si es necesario)
```

### Consideraciones para Windows Server

#### Requisitos especiales
```
Secure Boot: Puede permanecer enabled para Windows Server 2019+
TPM: Enabled si está disponible
Intel AMT: Enabled para administración remota (modelos de negocio)
```

#### Preparación de controladores de red
Nota: Windows Server requiere la instalación manual de controladores de red
- Descarga previamente los controladores Intel LAN
- Usa el método "Have Disk" durante la instalación del controlador
- Consulta la documentación específica de tu modelo para conocer los pasos detallados de instalación de controladores

## Opciones de configuración avanzada

### Ajustes de Intel vPro y AMT (modelos de negocio)

#### Habilitar la gestión remota
```
Navigation: Advanced → Intel AMT Configuration

Intel AMT: Enabled
Network Access: Network Active
SOL Terminal: Enabled (para Serial Over LAN)

Setup Process:
1. Habilite AMT en el BIOS
2. Configure los ajustes de red
3. Establezca la contraseña de AMT durante el primer arranque
4. Acceda vía https://[nuc-ip]:16992
```

### Ajustes de virtualización

#### Para ESXi, Proxmox, Hyper-V
```
Intel Virtualization Technology (VT-x): Enabled
Intel VT for Directed I/O (VT-d): Enabled
Execute Disable Bit: Enabled

Adicional para ESXi:
- SR-IOV: Enabled (si está disponible)
- IOMMU: Enabled
```

### Configuración de memoria

#### Ajustes de memoria
```
Navigation: Advanced → Memory

Memory Profile: Auto o XMP Profile 1
- Habilita las velocidades nominales de la memoria
- Importante para el rendimiento

ECC Support: Auto
- Se habilita automáticamente si se detecta memoria ECC
- No disponible en modelos NUC de consumo
```

## Optimizaciones específicas de plataforma

### Configuración de YunoHost
```
Recommended Settings:
- Secure Boot: Disabled
- Legacy Boot: Disabled
- Network Boot: Disabled
- Wake on LAN: Enabled
- Auto Power On: Enabled

Known Issues:
- Algunos modelos de NUC requieren el arranque UEFI deshabilitado
- Pruebe la instalación con UEFI primero, con fallback a Legacy si es necesario
```

### Configuración de CasaOS
```
Recommended Settings:
- Ajustes estándar de servidor Linux
- Optimización de Docker: Intel VT-x Enabled
- Wake on LAN: Enabled para administración remota

Sin requisitos especiales - funciona con la configuración estándar de Ubuntu/Debian
```

### Configuración de Caprover
```
Recommended Settings:
- Soporte de Docker: Intel VT-x Enabled
- Optimización de red: Wake on LAN Enabled
- Configuración estándar de servidor Linux

Se recomienda soporte de virtualización para la eficiencia de contenedores
```

## Proceso de actualización de BIOS

### Comprobación de la versión de BIOS
```
Current Version: Anote desde la pantalla principal del BIOS
Latest Version: Consulte el sitio de soporte de ASUS para su modelo
Update Needed: Si la versión tiene más de 6 meses de antigüedad
```

### Métodos de actualización

#### Método 1: Express BIOS Update (Recomendado)
```
Requirements: Entorno Windows
Process:
1. Descargue el instalador Express BIOS desde ASUS
2. Ejecute el instalador como Administrator
3. Siga las indicaciones para la actualización automática
4. El sistema se reiniciará automáticamente
```

#### Método 2: Actualización de BIOS con F7
```
Requirements: Unidad flash USB, archivo cápsula de BIOS
Process:
1. Descargue el archivo .cap al directorio raíz de la USB
2. Apague el NUC
3. Mantenga presionado el botón de encendido 3 segundos, luego suéltelo
4. Presione F7 cuando aparezca el Power Button Menu
5. El BIOS detectará e instalará la actualización automáticamente
```

#### Método 3: Actualización mediante UEFI Shell
```
Solo para usuarios avanzados - use la utilidad iFlash
Consulte la documentación de ASUS para pasos específicos
```

## Verificación posterior a la configuración

### Pruebas de estabilidad del sistema
```
1. Arranque el SO objetivo con éxito
2. Verifique que todo el hardware sea detectado correctamente
3. Revise el comportamiento de la administración de energía
4. Pruebe la conectividad de red
5. Valide el rendimiento del almacenamiento
```

### Herramientas de monitorización
```
Built-in Monitoring:
- Hardware Monitor: Revise temperaturas y voltajes
- Boot Options: Verifique la secuencia de arranque
- Security Status: Confirme los ajustes de seguridad

External Tools:
- Linux: lm-sensors, htop, iotop
- Windows: HWiNFO, CPU-Z, CrystalDiskInfo
```

## Errores de configuración comunes

### ❌ Errores que debes evitar

1. **Dejar Fast Boot habilitado**
   - Impide el acceso a la BIOS
   - Puede causar problemas de arranque con Linux

2. **Ajustes incorrectos del ventilador**
   - El modo "Performance" es demasiado ruidoso para uso doméstico
   - El modo "Silent" puede causar limitación térmica

3. **Ajustes de virtualización incorrectos**
   - VT-x deshabilitado impide Docker/VMs
   - VT-d deshabilitado limita funciones avanzadas

4. **Configuración de seguridad deficiente**
   - Sin contraseña de supervisor
   - Secure Boot habilitado para un sistema operativo no compatible

5. **Problemas de configuración de red**
   - Wake on LAN deshabilitado
   - Arranque por red dejado habilitado innecesariamente

### ✅ Buenas prácticas

1. **Documenta los ajustes**
   - Toma fotos de las pantallas críticas de la BIOS
   - Anota cualquier configuración personalizada

2. **Actualizaciones periódicas**
   - Comprueba si hay actualizaciones de BIOS cada trimestre
   - Actualiza durante ventanas de mantenimiento planificadas

3. **Copia de seguridad de la configuración**
   - Algunos modelos admiten la exportación de perfiles de BIOS
   - Documenta los ajustes personalizados para su restauración

## Solución de problemas de BIOS

### No se puede acceder a la BIOS
```
Soluciones:
1. Usar teclado con cable en el puerto trasero
2. Probar el método de arranque en frío (desconectar la alimentación)
3. Deshabilitar Fast Boot desde Windows
4. Usar el método Power Button Menu
```

### Los ajustes de BIOS no se guardan
```
Causas:
- Falla de la batería CMOS (raro en los NUC)
- Interrupción de energía durante el guardado
- Ajustes del BIOS corruptos

Soluciones:
1. Cargar valores predeterminados y reconfigurar
2. Actualizar el firmware del BIOS
3. Contactar al soporte de ASUS si persiste
```

### Problemas de arranque tras la configuración
```
Opciones de recuperación:
1. Cargar valores predeterminados del BIOS (F9)
2. Usar el jumper de recuperación del BIOS (si está disponible)
3. Recuperación mediante Power Button Menu
4. Modo de recuperación del BIOS
```

## Refuerzo de seguridad

### Ajustes para entorno de producción
```
Supervisor Password: Required (Requerida)
User Password: Optional (Opcional)
Boot Device Control: Lock UEFI Boot Order
USB Boot: Disabled (Deshabilitado, después de instalar el SO)
Network Boot: Disabled (Deshabilitado)
Secure Boot: Enabled (Habilitado, si el SO lo admite)
Intel AMT: Disabled (Deshabilitado, salvo que sea necesario)
```

### Ajustes para entorno doméstico
```
Supervisor Password: Recommended (Recomendada)
Wake on LAN: Enabled (Habilitado)
Auto Power On: Enabled (Habilitado)
USB Boot: Enabled (Habilitado, para mantenimiento)
Secure Boot: Disabled (Deshabilitado, por flexibilidad)
```

## Pasos finales y documentación

### Guardar la configuración
```
1. Presionar F10 para guardar y salir
2. Confirmar los cambios cuando se solicite
3. El sistema se reiniciará con los nuevos ajustes
```

### Documenta tu configuración
Crea un registro de configuración que incluya:
- Versión de BIOS
- Ajustes clave modificados
- Contraseñas utilizadas (almacenadas de forma segura)
- Fecha de la configuración
- Propósito/motivo de los ajustes

---

**Siguientes pasos:**
- Configura los ajustes de energía y red: [nuc-power-network.md](nuc-power-network.md)
- Revisa las consideraciones específicas del modelo: [nuc-models-comparison.md](nuc-models-comparison.md)

**Importante**: Verifica siempre que estos ajustes funcionen con tu modelo específico y el sistema operativo previsto antes de desplegar en producción.