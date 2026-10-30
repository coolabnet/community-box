---
title: Preparación
sourcePath: guides/recycled-preparation.md
sourceHash: 1ba0219d4fcbd386
translatedBy: glm-4.6
---

# Guía de Preparación de Computadoras Recicladas

## Descripción General

Esta guía completa proporciona instrucciones paso a paso para limpiar físicamente, restablecer y preparar computadoras recicladas para su implementación como servidores. Una preparación adecuada garantiza un rendimiento óptimo, confiabilidad y longevidad del hardware reutilizado.

## Precauciones de Seguridad

### Seguridad Eléctrica
- [ ] **Apagar Completamente**: Apagar y desenchufar del tomacorriente de pared
- [ ] **Descarga del Botón de Encendido**: Mantener presionado el botón de encendido por 10 segundos después de desenchufar
- [ ] **Esperar la Descarga de los Capacitores**: Esperar 5-10 minutos antes de abrir el gabinete
- [ ] **Retirar la Batería**: Desconectar la batería de la laptop si aplica
- [ ] **Usar Protección Antiestática**: Pulsera antiestática o descarga a tierra frecuente

### Seguridad Física
- [ ] **Área de Trabajo**: Espacio de trabajo limpio, bien iluminado y libre de estática
- [ ] **Protección Ocular**: Lentes de seguridad al usar aire comprimido
- [ ] **Ventilación**: Flujo de aire adecuado para la eliminación de polvo
- [ ] **Bordes Filosos**: Tener cuidado con los bordes metálicos del gabinete
- [ ] **Levantamiento**: Usar técnicas adecuadas para levantar equipos pesados

### Consideraciones Ambientales
- [ ] **Limpieza al Aire Libre**: Usar aire comprimido afuera cuando sea posible
- [ ] **Contención del Polvo**: Cubrir los equipos cercanos durante la limpieza
- [ ] **Disposición**: Desechar adecuadamente los materiales de limpieza y los componentes retirados

## Herramientas y Suministros Necesarios

### Herramientas Esenciales
- **Destornilladores**: Juego de puntas Phillips (#0, #1, #2)
- **Aire Comprimido**: Varios envases o compresor de aire eléctrico
- **Suministros de Limpieza**: Alcohol isopropílico (90%+), paños de microfibra
- **Equipo de Seguridad**: Pulsera antiestática, lentes de seguridad
- **Organización**: Recipientes pequeños para tornillos, etiquetas para cables

### Herramientas Opcionales
- **Pasta Térmica**: Arctic MX-4 o equivalente para reasentar el CPU
- **Cintas para Cables**: Para mejorar la organización de cables
- **Destornilladores Torx**: Para algunos modelos de laptop
- **Herramientas de Apalancamiento de Plástico**: Para desarmar laptops
- **Cámara Digital**: Para documentar antes del desmontaje

### Materiales de Limpieza
| Material | Propósito | Notas de Seguridad |
|----------|-----------|-------------------|
| Alcohol Isopropílico 90%+ | Limpieza de componentes | Área bien ventilada |
| Paños de Microfibra | Limpieza de superficies | Sin pelusa, antiestáticos |
| Hisopos de Algodón | Limpieza de detalles | Que no dejen fibras de algodón |
| Aire Comprimido | Eliminación de polvo | Sostener los envases en vertical, ráfagas cortas |
| Cepillo de Cerdas Suaves | Polvo obstinado | Se prefieren cepillos antiestáticos |

## Documentación Previa al Desmontaje

### Recopilación de Información del Sistema
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

### Documentación Física
1. **Fotografía**:
   - Fotos generales del sistema desde varios ángulos
   - Primeros planos de las conexiones de cables
   - Ubicación de los componentes antes de retirarlos
   - Cualquier daño o configuración inusual

2. **Etiquetas y Marcas**:
   - Registrar números de modelo y números de serie
   - Anotar cualquier modificación personalizada
   - Documentar las rutas de los cables
   - Identificar componentes propietarios

## Desmontaje de Computadoras de Escritorio

### Paso 1: Preparación Externa
1. **Desconectar Todos los Cables**:
   - Cable de alimentación
   - Cables del monitor (VGA/HDMI/DisplayPort)
   - Dispositivos USB (teclado, mouse, etc.)
   - Cable de red
   - Cables de audio

2. **Retirar Componentes Externos**:
   - Medios ópticos de las unidades
   - Dispositivos USB y tarjetas SD
   - Cualquier accesorio conectado

### Paso 2: Apertura del Gabinete
1. **Remoción del Panel Lateral**:
   ```
   La mayoría de los gabinetes: Retire 2-4 tornillos de pulgar en el panel trasero
   Gabinetes sin herramientas: Presione las pestañas y deslice el panel
   Gabinetes antiguos: Tornillos Phillips en el panel trasero
   ```

2. **Verificación de Acceso**:
   - Asegurar acceso claro a todos los componentes
   - Retirar ambos paneles laterales si es necesario
   - Revisar si hay paneles de acceso adicionales

### Paso 3: Orden de Remoción de Componentes

#### Unidad de Fuente de Alimentación (si se necesita reemplazar)
1. **Desconectar Todos los Cables de Alimentación**:
   - Conector de 24 pines de la placa madre
   - Conector de alimentación del CPU de 4/8 pines
   - Conectores de alimentación PCIe
   - Conectores de alimentación SATA
   - Conectores Molex

2. **Retirar la Fuente de Alimentación**:
   - Desatornillar los 4 tornillos de la parte trasera del gabinete
   - Retirar cuidadosamente la unidad
   - Anotar la orientación para la reinstalación

#### Unidades de Almacenamiento
1. **Remoción de Cables SATA/Alimentación**:
   - Desconectar suavemente los cables de datos SATA
   - Retirar los conectores de alimentación SATA
   - Anotar el recorrido de los cables para el reensamblaje

2. **Remoción de la Unidad**:
   ```
   Discos duros de 3.5": 4 tornillos desde los lados de la jaula
   SSD de 2.5": 4 tornillos desde el soporte de montaje
   Unidades M.2: Un solo tornillo y levantar suavemente
   ```

#### Tarjetas de Expansión
1. **Retirar en Orden**:
   - Desatornillar los tornillos del soporte
   - Desbloquear los clips de retención PCIe
   - Levantar cuidadosamente las tarjetas en línea recta hacia arriba
   - Almacenar en bolsas antiestáticas

#### Memoria (RAM)
1. **Proceso de Remoción**:
   - Presionar los clips de retención en ambos extremos
   - Los módulos de RAM se levantarán en un ángulo de 30 grados
   - Jalar suavemente los módulos en línea recta hacia afuera
   - Manipular solo por los bordes

#### Enfriador del CPU (si se limpia/reemplaza)
1. **Remoción en Zócalo Intel**:
   ```
   Disipadores de pines a presión: Gire los pines 90° en sentido antihorario, tire hacia arriba
   Disipadores atornillados: Retire los tornillos en patrón de X
   ```

2. **Remoción en Zócalo AMD**:
   ```
   Retención por clip: Levante el brazo de retención, deslice el disipador para quitarlo
   Atornillado: Retire los tornillos en patrón de estrella
   ```

**⚠️ Advertencia**: El CPU puede quedar pegado al enfriador debido a la pasta térmica

## Desmontaje de Laptops

### Paso 1: Preparación Externa
1. **Gestión de Energía**:
   - Apagar completamente
   - Retirar la batería (si es extraíble)
   - Desconectar el adaptador de CA
   - Presionar el botón de encendido por 15 segundos

2. **Limpieza Externa**:
   - Retirar cualquier dispositivo conectado
   - Limpiar el exterior con un paño de microfibra húmedo
   - Prestar atención a las áreas de los puertos

### Paso 2: Remoción del Panel de Acceso
1. **Acceso al Panel Inferior**:
   ```
   Laptops modernas: Retire todos los tornillos visibles de la parte inferior
   Laptops antiguas: Pueden tener varios paneles de acceso
   Algunos modelos: Requieren quitar el teclado o la base de la palma primero
   ```

2. **Gestión de Tornillos**:
   - Usar recipientes pequeños para los diferentes tipos de tornillos
   - Algunas laptops usan tornillos de distintas longitudes
   - Tomar fotos de las ubicaciones de los tornillos

### Paso 3: Acceso a Componentes

#### Memoria y Almacenamiento
1. **Módulos de RAM**:
   - Generalmente accesibles a través del panel inferior
   - Soltar los clips y los módulos se levantarán en ángulo
   - Retirar con cuidado jalando por los bordes

2. **Unidades de Almacenamiento**:
   ```
   SATA de 2.5": Retire los tornillos del soporte, desconecte el cable
   M.2 NVMe: Retire un solo tornillo, levante en ángulo
   mSATA: Similar a M.2 pero con formato más pequeño
   ```

#### Desmontaje Avanzado (si es necesario)
**Nota**: Continuar solo si se tiene experiencia en reparación de laptops

1. **Remoción del Teclado**:
   - Soltar los clips o retirar los tornillos
   - Desconectar los cables de cinta con cuidado
   - Algunos modelos requieren retirar primero el reposamanos

2. **Conjunto de Pantalla**:
   - Retirar los tornillos de las bisagras
   - Desconectar los cables de pantalla y Wi-Fi
   - Separar cuidadosamente el conjunto de la pantalla

## Procedimientos de Limpieza

### Limpieza con Aire Comprimido
1. **Preparación**:
   - Llevar el equipo afuera o a un área bien ventilada
   - Usar lentes de seguridad
   - Sostener los envases de aire comprimido en vertical
   - Usar ráfagas cortas (2-3 segundos)

2. **Orden de Limpieza**:
   ```
   1. Fuente de poder (si es accesible)
   2. Disipador y ventilador del CPU
   3. Disipador y ventilador de la tarjeta gráfica
   4. Ventiladores del gabinete (sostenga las aspas mientras sopla)
   5. Componentes de la placa base
   6. Ranuras de tarjetas de expansión
   7. Bahías de unidades y conectores
   ```

3. **Protocolo de Limpieza de Ventiladores**:
   ```
   ⚠️ CRÍTICO: Mantenga las aspas del ventilador inmóviles mientras limpia
   - El aire comprimido puede hacer girar los ventiladores más allá de sus RPM nominales
   - El exceso de giro puede dañar los rodamientos
   - Use un hisopo de algodón para sostener el centro del ventilador si es necesario
   ```

### Limpieza de Detalles

#### Limpieza de la Placa Madre
1. **Limpieza de Superficies**:
   - Usar paño de microfibra seco para el polvo ligero
   - Alcohol isopropílico para residuos obstinados
   - Hisopos de algodón para espacios reducidos
   - Nunca usar agua ni solventes agresivos

2. **Limpieza de Conectores**:
   ```
   Ranuras de RAM: Aire comprimido, cepillo suave
   Ranuras PCIe: Solo aire comprimido
   Socket del CPU: Aire comprimido, extremo cuidado
   Conectores de poder: Alcohol isopropílico en los contactos
   ```

#### Limpieza del Disipador de Calor
1. **Eliminación de Polvo**:
   - Aire comprimido desde varios ángulos
   - Cepillar la acumulación de polvo obstinado
   - Asegurar que todos los pasajes de las aletas estén despejados

2. **Remoción de la Pasta Térmica** (si se reasienta el CPU):
   ```
   Materiales: Alcohol isopropílico 90%+, filtros de café
   Proceso: 
   1. Retire la pasta vieja con un raspador de plástico
   2. Limpie con un paño empapado en alcohol
   3. Limpieza final con filtro de café
   4. Asegúrese de que esté completamente seco antes de aplicar la nueva pasta
   ```

### Limpieza del Gabinete y del Exterior

#### Limpieza del Interior del Gabinete
1. **Eliminación de Polvo**:
   - Aire comprimido para el polvo suelto
   - Paño de microfibra para las superficies
   - Hisopos de algodón para esquinas y grietas

2. **Organización de Cables**:
   - Retirar el polvo de los paquetes de cables
   - Reorganizar para mejorar el flujo de aire
   - Reemplazar las cintas para cables dañadas

#### Limpieza del Exterior
1. **Superficies de Plástico**:
   ```
   Solución: Jabón suave y agua o alcohol isopropílico
   Método: Paño húmedo, no empapado
   Secado: Secado inmediato con un paño limpio
   ```

2. **Superficies Metálicas**:
   ```
   Solución: Alcohol isopropílico 70%+
   Método: Aplicación con paño de microfibra
   Acabado: Seque de inmediato para evitar manchas de agua
   ```

## Pruebas y Reemplazo de Componentes

### Pruebas de Componentes Previas a la Limpieza
1. **Inspección Visual**:
   - Buscar capacitores hinchados
   - Revisar si hay marcas de quemaduras o decoloración
   - Inspeccionar los cables en busca de daños
   - Verificar la integridad de las aspas de los ventiladores

2. **Funcionalidad Básica**:
   - Probar el arranque del sistema antes del desmontaje completo
   - Verificar que todos los ventiladores giren
   - Revisar si hay ruidos inusuales
   - Monitorear las temperaturas si es posible

### Verificación Posterior a la Limpieza
1. **Reasentamiento de Componentes**:
   - RAM: Presión firme y uniforme hasta que los clips encajen
   - Tarjetas PCIe: Presionar hacia abajo hasta que el clip de retención haga clic
   - Conectores de alimentación: Conexión firme, clips de retención enganchados
   - Cables SATA: Conexión suave pero segura

2. **Organización de Cables**:
   - Dirigir los cables lejos de los ventiladores
   - Asegurar los cables sueltos con cintas
   - Asegurar que ningún cable obstruya el flujo de aire
   - Verificar que todas las conexiones estén seguras
## Procedimientos de Restablecimiento de BIOS/CMOS

### Cuándo Restablecer la BIOS
- Contraseñas de BIOS desconocidas
- Configuración de BIOS dañada
- Problemas de compatibilidad de hardware
- Inestabilidad después de cambios de componentes

### Reemplazo de la Pila CMOS
1. **Ubicación de la Pila**:
   ```
   Computadora de escritorio: Generalmente visible en la placa base (CR2032)
   Laptop: Puede estar bajo el teclado o en un panel de acceso
   ```

2. **Proceso de Reemplazo**:
   ```
   1. Apague completamente y desenchufe el sistema
   2. Retire la batería CMOS (observe la orientación)
   3. Espere 5-10 minutos para la descarga completa
   4. Instale la batería nueva (respete la orientación)
   5. Encienda y configure el BIOS
   ```

### Restablecimiento con Puente CMOS (PC de Escritorio)
1. **Localizar el Puente CMOS**:
   - Generalmente etiquetado "CLRTC", "CLEAR" o "JBAT1"
   - Cerca de la pila CMOS o del chip BIOS
   - Consulta el manual de la placa base si tienes dudas

2. **Proceso de Restablecimiento**:
   ```
   1. Apague y desenchufe el sistema
   2. Mueva el jumper de los pines 1-2 a los pines 2-3
   3. Espere 10-15 segundos
   4. Regrese el jumper a su posición original (1-2)
   5. Encienda el sistema
   ```

### Métodos Alternativos de Restablecimiento
1. **Método del Botón de Encendido**:
   ```
   1. Desenchufe el sistema por completo
   2. Retire la batería CMOS
   3. Mantenga presionado el botón de encendido durante 30 segundos
   4. Reinstale la batería y encienda
   ```

2. **Botón de la Placa Base** (sistemas más nuevos):
   - Algunas placas tienen un botón dedicado de restablecimiento CMOS
   - Presiona el botón con el sistema apagado
   - No requiere manipular el puente

## Lista de Verificación de Control de Calidad

### Verificación Previa al Ensamblado
- [ ] Todos los componentes completamente limpios
- [ ] No se identificaron componentes dañados
- [ ] Pasta térmica reemplazada (si se retiró la CPU)
- [ ] Todos los cables y conectores limpios
- [ ] Sin objetos extraños dentro del gabinete
- [ ] Precauciones antiestáticas mantenidas

### Lista de Verificación de Ensamblado
- [ ] Componentes instalados en orden inverso al desmontaje
- [ ] Todos los tornillos correctamente apretados (sin apretar en exceso)
- [ ] Cables distribuidos para un flujo de aire óptimo
- [ ] Sin cables sueltos cerca de los ventiladores
- [ ] Todas las conexiones de alimentación seguras
- [ ] RAM y tarjetas de expansión completamente asentadas

### Prueba Inicial de Encendido
- [ ] El sistema enciende normalmente
- [ ] Todos los ventiladores girando (CPU, gabinete, GPU)
- [ ] Sin ruidos ni olores inusuales
- [ ] POST completado con éxito
- [ ] Todos los componentes detectados en la BIOS
- [ ] Lecturas de temperatura normales

## Problemas Comunes y Soluciones

### El Sistema No Enciende
**Causas Posibles**:
- Conexiones de alimentación flojas
- RAM mal asentada
- Conectores del panel frontal desconectados
- Problemas con la fuente de alimentación

**Soluciones**:
1. Verifica todas las conexiones de alimentación
2. Reasienta los módulos de RAM
3. Revisa la alineación de los conectores del panel frontal
4. Prueba con una configuración mínima

### Sobrecalentamiento Después de la Limpieza
**Causas Posibles**:
- Pasta térmica mal aplicada
- Disipador de CPU mal asentado
- Ventiladores desconectados
- Rutas de flujo de aire bloqueadas

**Soluciones**:
1. Verifica el montaje del disipador de la CPU
2. Revisa la aplicación de la pasta térmica
3. Confirma todas las conexiones de los ventiladores
4. Verifica la orientación del ventilador del gabinete

### Problemas de Arranque
**Causas Posibles**:
- Se requiere restablecer la BIOS
- Dispositivo de arranque no detectado
- Conexiones de almacenamiento flojas
- Sector de arranque dañado

**Soluciones**:
1. Restablece la BIOS a los valores predeterminados
2. Verifica las conexiones del dispositivo de almacenamiento
3. Revisa el orden de arranque en la BIOS
4. Prueba con otro dispositivo de almacenamiento

## Documentación y Etiquetado

### Documentación del Sistema
1. **Crear un Registro de Servicio**:
   ```
   Modelo del Sistema: _______________
   Número de Serie: ______________
   Fecha de Limpieza: ______________
   Técnico: ________________
   Componentes Reemplazados: ________
   Problemas Encontrados: ______________
   ```

2. **Documentación Fotográfica**:
   - Fotos antes y después de la limpieza
   - Documentación de cualquier daño o desgaste
   - Fotos de la configuración de componentes

### Seguimiento de Componentes
1. **Gestión de Inventario**:
   - Etiqueta los componentes retirados
   - Registra los números de serie de los componentes
   - Anota la información de compatibilidad
   - Registra los resultados de las pruebas de rendimiento

2. **Notas de Configuración**:
   - Modificaciones de la configuración de la BIOS
   - Cambios en la configuración de hardware
   - Requisitos de controladores
   - Problemas de compatibilidad conocidos

## Pasos Finales de Preparación

### Optimización del Sistema
1. **Configuración de la BIOS**:
   - Habilita la configuración óptima para uso de servidor
   - Configura las prioridades de arranque
   - Habilita las funciones de virtualización
   - Establece las opciones de administración de energía

2. **Prueba de Estrés del Hardware**:
   ```
   CPU Stress Test: 4-8 hours at 100% load
   Memory Test: Full MemTest86+ pass
   Storage Test: Read/write endurance test
   Temperature Monitoring: Throughout all tests
   ```

### Preparación para la Implementación
- [ ] Medios de instalación del sistema operativo preparados
- [ ] Paquetes de controladores descargados
- [ ] Configuración de red planificada
- [ ] Ajustes de seguridad documentados
- [ ] Procedimientos de respaldo y recuperación planificados

## Próximos Pasos

1. **Configuración de la BIOS**: Configura los ajustes BIOS/UEFI para la operación del servidor
2. **Verificación de Compatibilidad**: Revisa la [Verificación de Compatibilidad de Hardware](hardware-compatibility-check.md)
3. **Requisitos del Sistema**: Confirma los [Requisitos de PC Reciclado](recycled-pc-requirements.md)
4. **Selección de Modelo**: Consulta la [Comparación de Modelos Reciclados](recycled-models-comparison.md)

---

*Esta guía de preparación garantiza que las computadoras recicladas estén correctamente limpias, probadas y listas para una implementación confiable como servidor. Prioriza siempre la seguridad y tómate el tiempo necesario para hacer el trabajo correctamente.*