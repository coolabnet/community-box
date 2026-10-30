---
title: Configuración del BIOS
sourcePath: hardware/intel_nuc/nuc-bios-setup.md
sourceHash: 48f435ea0fc646fe
translatedBy: glm-4.6
---

# Guía de configuración de BIOS/UEFI de Intel NUC para despliegue de servidores comunitarios

## Introducción

Una configuración adecuada de la BIOS/UEFI es crucial para el funcionamiento estable como servidor de los dispositivos Intel NUC. Esta guía proporciona instrucciones paso a paso adaptadas para plataformas de servidores comunitarios como YunoHost, Caprover y CasaOS, enfocándose en la fiabilidad, la seguridad y el rendimiento óptimo.

## Preparación previa a la configuración

### Equipo necesario
- **Teclado USB con cable** (los teclados Bluetooth pueden no funcionar en la BIOS)
- **Monitor HDMI/DisplayPort** (las pantallas USB-C pueden no mostrar la BIOS)
- **Adaptador de corriente** adecuado para tu modelo de NUC
- **Memoria USB** (para actualizaciones de BIOS si es necesario)

### Notas importantes
- Conecta siempre el teclado a los puertos USB traseros para acceder a la BIOS
- Desactiva el Inicio rápido en Windows antes de acceder a la BIOS si usas arranque dual
- Ten a mano tu contraseña de supervisor de BIOS/UEFI si la configuraste anteriormente

## Acceso a la BIOS/UEFI

### Método estándar
1. **Enciende** el NUC mientras mantienes pulsada la tecla **F2**
2. Sigue manteniendo F2 hasta que aparezca la configuración de la BIOS
3. Si usas un ASUS NUC, es posible que veas brevemente el logotipo de ASUS

### Métodos alternativos (si F2 falla)

#### Método 1: Menú del botón de encendido
1. **Apaga** completamente el NUC
2. **Mantén pulsado** el botón de encendido durante 3 segundos y suelta
3. **Pulsa F7** cuando aparezca el menú del botón de encendido
4. Selecciona "Configuración de BIOS" en el menú

#### Método 2: Arranque en frío
1. **Desconecta** completamente el adaptador de corriente
2. Espera 10 segundos
3. **Vuelve a conectar** la corriente e inmediatamente pulsa F2 repetidamente
4. Este método suele funcionar cuando el Inicio rápido está activado

#### Método 3: Configuración de UEFI (Windows)
Si tienes Windows instalado:
1. Mantén **Shift** mientras haces clic en "Reiniciar"
2. Ve a **Solucionar problemas** → **Opciones avanzadas** → **Configuración de firmware UEFI**
3. Haz clic en **Reiniciar** para arrancar en la BIOS

## Configuración inicial de la BIOS

### Paso 1: Restablecer a los valores predeterminados
```
1. Presione F9 (Load BIOS Defaults)
2. Confirme con Enter
3. Esto garantiza una configuración inicial limpia
```

### Paso 2: Información básica del sistema
Verifica que la siguiente información sea correcta:
- **Versión de BIOS**: Anota la versión actual
- **Modelo de CPU**: Confirma la identificación del procesador
- **Memoria**: Verifica que se detecte toda la RAM instalada
- **Almacenamiento**: Comprueba que se reconozcan todas las unidades

## Configuraciones esenciales para servidores

### Configuración de seguridad

#### Establecer contraseña de supervisor
```
Navigation: Advanced → Security → Passwords → Set Supervisor Password
Recommended: Contraseña de 12+ caracteres con combinación de letras y números
Storage: Documente la contraseña de forma segura - necesaria para cambios futuros
```

#### Configurar Secure Boot (Recomendado: desactivado para Linux)
```
Navigation: Advanced → Security → Secure Boot
Setting: Disabled
Reason: Muchas distribuciones de Linux requieren Secure Boot deshabilitado
Alternative: Algunas distribuciones más recientes soportan Secure Boot
```

#### Configuración de arranque
```
Navigation: Advanced → Boot → Boot Configuration
Settings:
- Network Boot: Disabled (salvo que se requiera arranque PXE)
- USB Boot: Enabled (para medios de instalación)
- Boot Device Control: Lock UEFI Boot (evita cambios no autorizados)
```

### Configuraciones de gestión de energía

#### Configurar el comportamiento de energía
```
Navigation: Advanced → Power → Secondary Power Settings

After Power Failure: Power On
- Garantiza que el servidor se reinicie automáticamente después de cortes de energía
- Crítico para la operación de servidores sin monitor

Wake on LAN: Enabled
- Permite el encendido remoto mediante paquetes mágicos de red
- Útil para una operación eficiente en energía

USB Wake Support: Disabled
- Evita el despertar accidental por actividad de dispositivos USB
- Recomendado para la estabilidad del servidor
```

#### Configuraciones de energía de la CPU
```
Navigation: Advanced → Power → CPU Power Management

Enhanced Intel SpeedStep: Enabled
- Permite el escalado dinámico de la frecuencia del CPU
- Mejora la eficiencia energética bajo cargas variables

Turbo Mode: Enabled
- Permite que el CPU exceda su frecuencia base cuando sea necesario
- Importante para el rendimiento del servidor durante picos de carga
```

### Refrigeración y gestión térmica

#### Configuración del control de ventiladores
```
Navigation: Advanced → Cooling → CPU Fan Header

Fan Control Mode: Quiet
- Minimiza el ruido para entornos de hogar/oficina
- Alternative: Balanced para necesidades de mayor rendimiento

Custom Fan Curves: Disponibles en algunos modelos
- Configure según umbrales de temperatura
- Equilibrio entre refrigeración y ruido
```

### Configuración de almacenamiento

#### Configuraciones M.2 y SATA
```
Navigation: Advanced → Devices → Storage

SATA Mode: AHCI
- Requerido para compatibilidad con Linux
- NO use el modo RAID/RST salvo que sea específicamente necesario

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
3. Arranque por red (si es necesario)

Legacy Boot: Disabled
- Los sistemas operativos modernos prefieren UEFI
- Reduce posibles problemas de compatibilidad
```

## Configuraciones específicas del sistema operativo

### Distribuciones de servidores Linux (Ubuntu, Debian, CentOS)

#### Configuraciones esenciales
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
Secure Boot: Puede permanecer habilitado para Windows Server 2019+
TPM: Enabled si está disponible
Intel AMT: Enabled para administración remota (modelos empresariales)
```

#### Preparación de controladores de red
Nota: Windows Server requiere la instalación manual de controladores de red
- Descarga previamente los controladores de LAN de Intel
- Usa el método "Tener disco" durante la instalación del controlador
- Consulta la documentación específica de tu modelo para conocer los pasos detallados de instalación de controladores

## Opciones de configuración avanzada

### Configuraciones de Intel vPro y AMT (modelos empresariales)

#### Activar la gestión remota
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

### Configuraciones de virtualización

#### Para ESXi, Proxmox, Hyper-V
```
Intel Virtualization Technology (VT-x): Enabled
Intel VT for Directed I/O (VT-d): Enabled
Execute Disable Bit: Enabled

Additional for ESXi:
- SR-IOV: Enabled (si está disponible)
- IOMMU: Enabled
```

### Configuración de memoria

#### Configuraciones de memoria
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
- Algunos modelos de NUC requieren que el arranque UEFI esté deshabilitado
- Pruebe la instalación con UEFI primero, con alternativa a Legacy si es necesario
```

### Configuración de CasaOS
```
Recommended Settings:
- Configuración estándar de servidor Linux
- Docker optimization: Intel VT-x Enabled
- Wake on LAN: Enabled para administración remota

No hay requisitos especiales - funciona con la configuración estándar de Ubuntu/Debian
```

### Configuración de Caprover
```
Recommended Settings:
- Soporte de Docker: Intel VT-x Enabled
- Network optimization: Wake on LAN Enabled
- Configuración estándar de servidor Linux

Se recomienda soporte de virtualización para la eficiencia de contenedores
```

## Proceso de actualización de la BIOS

### Comprobación de la versión de BIOS
```
Current Version: Anote desde la pantalla principal del BIOS
Latest Version: Consulte el sitio de soporte de ASUS para su modelo
Update Needed: Si la versión tiene más de 6 meses de antigüedad
```

### Métodos de actualización

#### Método 1: Actualización Express de BIOS (Recomendado)
```
Requirements: Entorno Windows
Process:
1. Descargue el instalador Express BIOS desde ASUS
2. Ejecute el instalador como Administrador
3. Siga las indicaciones para la actualización automática
4. El sistema se reiniciará automáticamente
```

#### Método 2: Actualización de BIOS mediante F7
```
Requirements: Unidad flash USB, archivo capsule del BIOS
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
Consulte la documentación de ASUS para los pasos específicos
```

## Verificación posterior a la configuración

### Pruebas de estabilidad del sistema
```
1. Arranque el sistema operativo destino con éxito
2. Verifique que todo el hardware sea detectado correctamente
3. Compruebe el comportamiento de la gestión de energía
4. Pruebe la conectividad de red
5. Valide el rendimiento del almacenamiento
```

### Herramientas de monitorización
```
Built-in Monitoring:
- Hardware Monitor: Verifique temperaturas y voltajes
- Boot Options: Verifique la secuencia de arranque
- Security Status: Confirme los ajustes de seguridad

External Tools:
- Linux: lm-sensors, htop, iotop
- Windows: HWiNFO, CPU-Z, CrystalDiskInfo
```

## Errores comunes de configuración

### ❌ Errores que debes evitar

1. **Dejar el Inicio rápido activado**
   - Impide el acceso a la BIOS
   - Puede causar problemas de arranque con Linux

2. **Configuraciones incorrectas del ventilador**
   - El modo "Rendimiento" es demasiado ruidoso para uso doméstico
   - El modo "Silencioso" puede causar limitación térmica

3. **Configuraciones incorrectas de virtualización**
   - VT-x desactivado impide Docker/VMs
   - VT-d desactivado limita funciones avanzadas

4. **Mala configuración de seguridad**
   - Sin contraseña de supervisor
   - Secure Boot activado para sistemas operativos no compatibles

5. **Problemas de configuración de red**
   - Wake on LAN desactivado
   - Arranque por red dejado activado innecesariamente

### ✅ Buenas prácticas

1. **Documenta las configuraciones**
   - Toma fotos de las pantallas críticas de la BIOS
   - Anota cualquier configuración personalizada

2. **Actualizaciones regulares**
   - Comprueba si hay actualizaciones de BIOS trimestralmente
   - Actualiza durante ventanas de mantenimiento planificadas

3. **Copia de seguridad de la configuración**
   - Algunos modelos admiten la exportación de perfiles de BIOS
   - Documenta las configuraciones personalizadas para su restauración

## Solución de problemas de la BIOS

### No se puede acceder a la BIOS
```
Soluciones:
1. Usar teclado con cable en el puerto trasero
2. Probar el método de arranque en frío (desconectar la corriente)
3. Desactivar Inicio rápido desde Windows
4. Usar el método del Menú del Botón de Encendido
```

### Las configuraciones de BIOS no se guardan
```
Causas:
- Falla de la batería CMOS (raro en los NUC)
- Interrupción de energía durante el guardado
- Configuración del BIOS corrupta

Soluciones:
1. Cargar valores predeterminados y reconfigurar
2. Actualizar el firmware del BIOS
3. Contactar al soporte de ASUS si persiste
```

### Problemas de arranque después de la configuración
```
Opciones de recuperación:
1. Cargar valores predeterminados del BIOS (F9)
2. Usar el jumper de recuperación del BIOS (si está disponible)
3. Recuperación mediante el Menú del Botón de Encendido
4. Modo de recuperación del BIOS
```

## Refuerzo de seguridad

### Configuraciones para entornos de producción
```
Supervisor Password: Requerida
User Password: Opcional
Boot Device Control: Bloquear el orden de arranque UEFI
USB Boot: Desactivado (después de la instalación del sistema operativo)
Network Boot: Desactivado
Secure Boot: Activado (si el sistema operativo lo admite)
Intel AMT: Desactivado (a menos que sea necesario)
```

### Configuraciones para entornos domésticos
```
Supervisor Password: Recomendada
Wake on LAN: Activado
Auto Power On: Activado
USB Boot: Activado (para mantenimiento)
Secure Boot: Desactivado (para mayor flexibilidad)
```

## Pasos finales y documentación

### Guardar la configuración
```
1. Presionar F10 para guardar y salir
2. Confirmar los cambios cuando se solicite
3. El sistema se reiniciará con la nueva configuración
```

### Documenta tu configuración
Crea un registro de configuración que incluya:
- Versión de BIOS
- Configuraciones clave modificadas
- Contraseñas utilizadas (almacenadas de forma segura)
- Fecha de la configuración
- Propósito/razón de las configuraciones

---

**Próximos pasos:**
- Configura las opciones de energía y red: [nuc-power-network.md](nuc-power-network.md)
- Revisa las consideraciones específicas del modelo: [nuc-models-comparison.md](nuc-models-comparison.md)

**Importante**: Verifica siempre que estas configuraciones funcionen con tu modelo específico y el sistema operativo previsto antes de desplegar en producción.