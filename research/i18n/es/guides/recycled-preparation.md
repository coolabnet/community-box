---
title: Preparación
sourcePath: guides/recycled-preparation.md
sourceHash: 2530d2ef46d16ed1
translatedBy: glm-4.6
---

---
title: Preparación
---

# Guía de Preparación de Computadoras Recicladas

## Descripción General

Esta guía completa proporciona instrucciones paso a paso para limpiar físicamente, restablecer y preparar computadoras recicladas para su implementación como servidores. Una preparación adecuada garantiza un rendimiento óptimo, confiabilidad y larga vida útil del hardware reutilizado.

## Precauciones de Seguridad

### Seguridad Eléctrica
- [ ] **Apagar Completamente**: Apague y desenchufe de la toma de corriente
- [ ] **Descarga del Botón de Encendido**: Mantenga presionado el botón de encendido durante 10 segundos después de desenchufar
- [ ] **Esperar la Descarga de Capacitores**: Espere 5-10 minutos antes de abrir el gabinete
- [ ] **Retirar la Batería**: Desconecte la batería de la laptop si corresponde
- [ ] **Usar Protección Antiestática**: Pulsera antiestática o descarga a tierra frecuente

### Seguridad Física
- [ ] **Área de Trabajo**: Espacio de trabajo limpio, bien iluminado y libre de estática
- [ ] **Protección Ocular**: Gafas de seguridad al usar aire comprimido
- [ ] **Ventilación**: Flujo de aire adecuado para la eliminación de polvo
- [ ] **Bordes Afilados**: Tenga precaución con los bordes metálicos del gabinete
- [ ] **Levantamiento**: Técnicas adecuadas de levantamiento para equipos pesados

### Consideraciones Ambientales
- [ ] **Limpieza al Aire Libre**: Use aire comprimido en el exterior cuando sea posible
- [ ] **Contención del Polvo**: Cubra los equipos cercanos durante la limpieza
- [ ] **Disposición**: Eliminación adecuada de los materiales de limpieza y componentes retirados

## Herramientas y Suministros Necesarios

### Herramientas Esenciales
- **Destornilladores**: Juego de puntas Phillips (#0, #1, #2)
- **Aire Comprimido**: Varios envases o compresor de aire eléctrico
- **Materiales de Limpieza**: Alcohol isopropílico (90%+), paños de microfibra
- **Equipo de Seguridad**: Pulsera antiestática, gafas de seguridad
- **Organización**: Recipientes pequeños para tornillos, etiquetas para cables

### Herramientas Opcionales
- **Pasta Térmica**: Arctic MX-4 o equivalente para reinstalar el CPU
- **Cintas para Cables**: Para mejorar la gestión de cables
- **Destornilladores Torx**: Para algunos modelos de laptop
- **Herramientas de Apertura de Plástico**: Para desarmar laptops
- **Cámara Digital**: Para documentación antes del desmontaje

### Materiales de Limpieza
| Material | Propósito | Notas de Seguridad |
|----------|---------|--------------|
| Alcohol Isopropílico 90%+ | Limpieza de componentes | Área bien ventilada |
| Paños de Microfibra | Limpieza de superficies | Sin pelusa, antiestático |
| Hisopos de Algodón | Limpieza de detalles | No dejar fibras de algodón |
| Aire Comprimido | Eliminación de polvo | Sostener los envases en vertical, ráfagas cortas |
| Cepillo de Cerdas Suaves | Polvo persistente | Se prefieren cepillos antiestáticos |

## Documentación Previo al Desmontaje

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
1. **Retiro del Panel Lateral**:
   ```
   La mayoría de los gabinetes: Retirar 2-4 tornillos de pulgar en el panel trasero
   Gabinetes sin herramientas: Presionar las pestañas y deslizar el panel
   Gabinetes antiguos: Tornillos Phillips en el panel trasero
   ```

2. **Verificación de Acceso**:
   - Asegurar acceso claro a todos los componentes
   - Retirar ambos paneles laterales si es necesario
   - Verificar si hay paneles de acceso adicionales

### Paso 3: Orden de Retiro de Componentes

#### Unidad de Fuente de Alimentación (si se necesita reemplazo)
1. **Desconectar Todos los Cables de Alimentación**:
   - Conector de 24 pines de la placa madre
   - Conector de alimentación del CPU de 4/8 pines
   - Conectores de alimentación PCIe
   - Conectores de alimentación SATA
   - Conectores Molex

2. **Retirar la Fuente de Alimentación**:
   - Desenroscar los 4 tornillos de la parte trasera del gabinete
   - Retirar la unidad con cuidado
   - Anotar la orientación para la reinstalación

#### Unidades de Almacenamiento
1. **Retiro de Cables SATA/Alimentación**:
   - Desconectar suavemente los cables de datos SATA
   - Retirar los conectores de alimentación SATA
   - Anotar el recorrido de los cables para el reensamblaje

2. **Retiro de las Unidades**:
   ```
   HDD de 3.5": 4 tornillos desde los lados de la jaula de la unidad
   SSD de 2.5": 4 tornillos desde el soporte de montaje
   Unidades M.2: Un solo tornillo y levantar suavemente
   ```

#### Tarjetas de Expansión
1. **Retirar en Orden**:
   - Desenroscar los tornillos del soporte
   - Desbloquear los clips de retención PCIe
   - Levantar las tarjetas cuidadosamente en línea recta
   - Guardar en bolsas antiestáticas

#### Memoria (RAM)
1. **Proceso de Retiro**:
   - Presionar los clips de retención en ambos extremos
   - Los módulos de RAM se levantarán en un ángulo de 30 grados
   - Extraer los módulos suavemente en línea recta
   - Manipular solo por los bordes

#### Enfriador del CPU (si se limpia/reemplaza)
1. **Retiro en Zócalo Intel**:
   ```
   Disipadores con pines de presión: Girar los pines 90° en sentido antihorario, jalar hacia arriba
   Disipadores atornillados: Retirar los tornillos en patrón X
   ```

2. **Retiro en Zócalo AMD**:
   ```
   Retención con clip: Levantar el brazo de retención, deslizar el disipador para quitarlo
   Atornillados: Retirar los tornillos en patrón de estrella
   ```

**⚠️ Advertencia**: El CPU puede quedar pegado al enfriador debido a la pasta térmica

## Desmontaje de Laptops

### Paso 1: Preparación Externa
1. **Gestión de Energía**:
   - Apagar completamente
   - Retirar la batería (si es extraíble)
   - Desconectar el adaptador de CA
   - Presionar el botón de encendido durante 15 segundos

2. **Limpieza Externa**:
   - Retirar cualquier dispositivo conectado
   - Limpiar el exterior con un paño de microfibra húmedo
   - Prestar atención a las áreas de los puertos

### Paso 2: Retiro del Panel de Acceso
1. **Acceso al Panel Inferior**:
   ```
   Laptops modernas: Retirar todos los tornillos visibles de la parte inferior
   Laptops antiguas: Pueden tener múltiples paneles de acceso
   Algunos modelos: Requieren retirar primero el teclado o el reposamanos
   ```

2. **Gestión de Tornillos**:
   - Usar recipientes pequeños para los diferentes tipos de tornillos
   - Algunas laptops usan tornillos de diferentes longitudes
   - Tomar fotos de las ubicaciones de los tornillos

### Paso 3: Acceso a los Componentes

#### Memoria y Almacenamiento
1. **Módulos de RAM**:
   - Generalmente accesibles a través del panel inferior
   - Liberar los clips y los módulos se levantan en ángulo
   - Retirar con cuidado tirando por los bordes

2. **Unidades de Almacenamiento**:
   ```
   SATA de 2.5": Retirar los tornillos del soporte, desconectar el cable
   M.2 NVMe: Retirar un solo tornillo, levantar en ángulo
   mSATA: Similar a M.2 pero con factor de forma más pequeño
   ```

#### Desmontaje Avanzado (si es necesario)
**Nota**: Continuar solo si tiene experiencia en reparación de laptops

1. **Retiro del Teclado**:
   - Liberar los clips o retirar los tornillos
   - Desconectar los cables de cinta con cuidado
   - Algunos modelos requieren retirar primero el descanso de palmas

2. **Conjunto de Pantalla**:
   - Retirar los tornillos de las bisagras
   - Desconectar los cables de la pantalla y Wi-Fi
   - Separar cuidadosamente el conjunto de la pantalla

## Procedimientos de Limpieza

### Limpieza con Aire Comprimido
1. **Preparación**:
   - Llevar el equipo al exterior o a un área bien ventilada
   - Usar gafas de seguridad
   - Sostener los envases de aire comprimido en vertical
   - Usar ráfagas cortas (2-3 segundos)

2. **Orden de Limpieza**:
   ```
   1. Fuente de poder (si es accesible)
   2. Disipador y ventilador del CPU
   3. Disipador y ventilador de la tarjeta gráfica
   4. Ventiladores del gabinete (sostener las aspas mientras se sopla)
   5. Componentes de la placa madre
   6. Ranuras de tarjetas de expansión
   7. Bahías de unidades y conectores
   ```

3. **Protocolo de Limpieza de Ventiladores**:
   ```
   ⚠️ CRÍTICO: Sostener las aspas del ventilador inmóviles mientras se limpia
   - El aire comprimido puede hacer girar los ventiladores más allá de sus RPM nominales
   - El exceso de giro puede dañar los rodamientos
   - Usar un cotonete para sostener el centro del ventilador si es necesario
   ```

### Limpieza de Detalles

#### Limpieza de la Placa Madre
1. **Limpieza de Superficies**:
   - Usar paño de microfibra seco para polvo ligero
   - Alcohol isopropílico para residuos persistentes
   - Hisopos de algodón para espacios reducidos
   - Nunca usar agua o solventes agresivos

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
   - Cepillar la acumulación de polvo persistente
   - Asegurar que todos los pasajes de las aletas estén despejados

2. **Eliminación de Pasta Térmica** (si se reinstala el CPU):
   ```
   Materiales: Alcohol isopropílico 90%+, filtros de café
   Proceso: 
   1. Retirar la pasta vieja con un raspador de plástico
   2. Limpiar con un paño empapado en alcohol
   3. Limpieza final con un filtro de café
   4. Asegurarse de que esté completamente seco antes de aplicar la nueva pasta
   ```

### Limpieza del Gabinete y el Exterior

#### Limpieza Interior del Gabinete
1. **Eliminación de Polvo**:
   - Aire comprimido para el polvo suelto
   - Paño de microfibra para las superficies
   - Hisopos de algodón para esquinas y grietas

2. **Gestión de Cables**:
   - Eliminar el polvo de los manojos de cables
   - Reorganizar para mejorar el flujo de aire
   - Reemplazar las cintas para cables dañadas

#### Limpieza Exterior
1. **Superficies de Plástico**:
   ```
   Solución: Jabón suave y agua o alcohol isopropílico
   Método: Paño húmedo, no empapado
   Secado: Secar de inmediato con un paño limpio
   ```

2. **Superficies Metálicas**:
   ```
   Solución: Alcohol isopropílico 70%+
   Método: Aplicación con paño de microfibra
   Acabado: Secar de inmediato para evitar manchas de agua
   ```

## Pruebas y Reemplazo de Componentes

### Pruebas de Componentes Antes de la Limpieza
1. **Inspección Visual**:
   - Buscar capacitores hinchados
   - Verificar si hay marcas de quemaduras o decoloración
   - Inspeccionar los cables en busca de daños
   - Verificar la integridad de las aspas de los ventiladores

2. **Funcionalidad Básica**:
   - Probar el arranque del sistema antes del desmontaje completo
   - Verificar que todos los ventiladores giren
   - Comprobar si hay ruidos inusuales
   - Monitorear temperaturas si es posible

### Verificación Después de la Limpieza
1. **Reinstalación de Componentes**:
   - RAM: Presión firme y uniforme hasta que los clips encajen
   - Tarjetas PCIe: Presionar hacia abajo hasta que el clip de retención haga clic
   - Conectores de alimentación: Conexión firme, clips de retención enganchados
   - Cables SATA: Conexión suave pero segura

2. **Gestión de Cables**:
   - Dirigir los cables lejos de los ventiladores
   - Asegurar los cables sueltos con cintas
   - Asegurar que ningún cable obstruya el flujo de aire
   - Verificar que todas las conexiones estén seguras
## Procedimientos de Restablecimiento de BIOS/CMOS

### Cuándo Restablecer la BIOS
- Contraseñas de BIOS desconocidas
- Configuraciones de BIOS dañadas
- Problemas de compatibilidad de hardware
- Inestabilidad después de cambios de componentes

### Reemplazo de la Batería CMOS
1. **Ubicación de la Batería**:
   ```
   PC de escritorio: Generalmente visible en la placa madre (CR2032)
   Laptop: Puede estar bajo el teclado o en un panel accesible
   ```

2. **Proceso de Reemplazo**:
   ```
   1. Apagar completamente el sistema y desconectarlo
   2. Retirar la batería CMOS (nota la orientación)
   3. Esperar 5-10 minutos para una descarga completa
   4. Instalar la batería nueva (respetar la orientación)
   5. Encender y configurar el BIOS
   ```

### Restablecimiento con el Jumper CMOS (Escritorio)
1. **Localizar el Jumper CMOS**:
   - Generalmente etiquetado como "CLRTC", "CLEAR" o "JBAT1"
   - Cerca de la batería CMOS o del chip BIOS
   - Consultar el manual de la placa base si hay dudas

2. **Proceso de Restablecimiento**:
   ```
   1. Apagar y desconectar el sistema
   2. Mover el jumper de los pines 1-2 a los pines 2-3
   3. Esperar 10-15 segundos
   4. Devolver el jumper a su posición original (1-2)
   5. Encender el sistema
   ```

### Métodos Alternativos de Restablecimiento
1. **Método del Botón de Encendido**:
   ```
   1. Desconectar el sistema completamente
   2. Retirar la batería CMOS
   3. Mantener presionado el botón de encendido durante 30 segundos
   4. Reinstalar la batería y encender
   ```

2. **Botón de la Placa Base** (sistemas más nuevos):
   - Algunas placas tienen un botón dedicado de restablecimiento CMOS
   - Presionar el botón con el sistema apagado
   - No requiere manipulación de jumpers

## Lista de Verificación de Control de Calidad

### Verificación Previal al Reensamblaje
- [ ] Todos los componentes completamente limpios
- [ ] No se identificaron componentes dañados
- [ ] Pasta térmica reemplazada (si se retiró el CPU)
- [ ] Todos los cables y conectores limpios
- [ ] Ningún objeto extraño dentro del gabinete
- [ ] Precauciones antiestáticas mantenidas

### Lista de Verificación de Reensamblaje
- [ ] Componentes instalados en orden inverso al desmontaje
- [ ] Todos los tornillos correctamente apretados (sin apretar en exceso)
- [ ] Cables tendidos para un flujo de aire óptimo
- [ ] Ningún cable suelto cerca de los ventiladores
- [ ] Todas las conexiones de alimentación aseguradas
- [ ] Memoria RAM y tarjetas de expansión completamente asentadas

### Prueba Inicial de Encendido
- [ ] El sistema enciende normalmente
- [ ] Todos los ventiladores girando (CPU, gabinete, GPU)
- [ ] Sin ruidos ni olores inusuales
- [ ] El POST se completa con éxito
- [ ] Todos los componentes detectados en la BIOS
- [ ] Lecturas de temperatura normales

## Problemas Comunes y Soluciones

### El Sistema No Enciende
**Posibles Causas**:
- Conexiones de alimentación flojas
- Memoria RAM mal asentada
- Conectores del panel frontal desconectados
- Problemas con la fuente de alimentación

**Soluciones**:
1. Verificar todas las conexiones de alimentación
2. Reasentar los módulos de RAM
3. Verificar la alineación de los conectores del panel frontal
4. Probar con una configuración mínima

### Sobrecalentamiento Después de la Limpieza
**Posibles Causas**:
- Pasta térmica mal aplicada
- Disipador del CPU mal asentado
- Ventiladores desconectados
- Rutas de flujo de aire bloqueadas

**Soluciones**:
1. Verificar el montaje del disipador del CPU
2. Revisar la aplicación de la pasta térmica
3. Confirmar todas las conexiones de los ventiladores
4. Verificar la orientación de los ventiladores del gabinete

### Problemas de Arranque
**Posibles Causas**:
- Se requiere restablecer la BIOS
- Dispositivo de arranque no detectado
- Conexiones de almacenamiento flojas
- Sector de arranque dañado

**Soluciones**:
1. Restablecer la BIOS a los valores predeterminados
2. Verificar las conexiones del dispositivo de almacenamiento
3. Revisar el orden de arranque en la BIOS
4. Probar con otro dispositivo de almacenamiento

## Documentación y Etiquetado

### Documentación del Sistema
1. **Crear un Registro de Servicio**:
   ```
   Modelo del sistema: _______________
   Número de serie: ______________
   Fecha de limpieza: ______________
   Técnico: ________________
   Componentes reemplazados: ________
   Problemas encontrados: ______________
   ```

2. **Documentación Fotográfica**:
   - Fotos antes y después de la limpieza
   - Documentación de cualquier daño o desgaste
   - Fotos de la configuración de componentes

### Seguimiento de Componentes
1. **Gestión de Inventario**:
   - Etiquetar los componentes retirados
   - Registrar los números de serie de los componentes
   - Anotar la información de compatibilidad
   - Registrar los resultados de las pruebas de rendimiento

2. **Notas de Configuración**:
   - Modificaciones de la configuración de la BIOS
   - Cambios en la configuración de hardware
   - Requisitos de controladores
   - Problemas de compatibilidad conocidos

## Pasos Finales de Preparación

### Optimización del Sistema
1. **Configuración de la BIOS**:
   - Habilitar las configuraciones óptimas para uso como servidor
   - Configurar las prioridades de arranque
   - Habilitar las funciones de virtualización
   - Configurar las opciones de gestión de energía

2. **Prueba de Resistencia (Burn-In) de Hardware**:
   ```
   Prueba de estrés del CPU: 4-8 horas al 100% de carga
   Prueba de memoria: Pase completo de MemTest86+
   Prueba de almacenamiento: Prueba de resistencia de lectura/escritura
   Monitoreo de temperatura: Durante todas las pruebas
   ```

### Preparación para la Implementación
- [ ] Medios de instalación del sistema operativo preparados
- [ ] Paquetes de controladores descargados
- [ ] Configuración de red planificada
- [ ] Configuraciones de seguridad documentadas
- [ ] Procedimientos de respaldo y recuperación planificados

## Próximos Pasos

1. **Configuración de la BIOS**: Configurar los ajustes de BIOS/UEFI para la operación como servidor
2. **Verificación de Compatibilidad**: Revisar [Verificación de Compatibilidad de Hardware](hardware-compatibility-check.md)
3. **Requisitos del Sistema**: Confirmar [Requisitos de PC Reciclados](recycled-pc-requirements.md)
4. **Selección de Modelos**: Consultar [Comparación de Modelos Reciclados](recycled-models-comparison.md)

---

*Esta guía de preparación garantiza que las computadoras recicladas estén correctamente limpiadas, probadas y listas para una implementación confiable como servidor. Siempre prioriza la seguridad y tómate el tiempo para hacer el trabajo correctamente.*