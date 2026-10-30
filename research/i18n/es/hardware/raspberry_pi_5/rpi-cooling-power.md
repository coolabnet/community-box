---
title: Refrigeración y energía
sourcePath: hardware/raspberry_pi_5/rpi-cooling-power.md
sourceHash: 8a4721cf3a868724
translatedBy: glm-4.6
---

# Requisitos de Refrigeración y Energía de Raspberry Pi

## Introducción

Una refrigeración efectiva y una correcta alimentación eléctrica son fundamentales para garantizar la estabilidad, la durabilidad y el rendimiento óptimo de los servidores Raspberry Pi. Esta guía proporciona información detallada sobre los requisitos de energía, las estrategias de eficiencia energética y las soluciones de refrigeración para implementaciones de servidores comunitarios con Raspberry Pi.

## Requisitos de la Fuente de Alimentación

### Requisitos de Energía Específicos por Modelo

| Modelo de Raspberry Pi | Voltaje | Corriente Mínima | Corriente Recomendada | Tipo de Conector | Notas de Entrega de Energía |
|-------------------|---------|------------------|---------------------|----------------|---------------------|
| Raspberry Pi 3B+ | 5V | 2.5A | 3.0A | Micro-USB | Sensible a las caídas de voltaje |
| Raspberry Pi 4 Model B | 5V | 3.0A | 3.5A | USB-C | Las primeras revisiones tenían problemas con cables con e-marker |
| Raspberry Pi 5 | 5V | 5.0A | 5.0A | USB-C | Mayores requisitos de energía para dispositivos PCIe |

### Recomendaciones de Fuentes de Alimentación

#### Fuentes Oficiales vs. de Terceros
- **Fuentes Oficiales de Raspberry Pi**: Diseñadas específicamente para los requisitos del Pi, proporcionando energía estable y una entrega de corriente adecuada
- **Opciones de Calidad de Terceros**: Deben proporcionar 5V estables y amperaje suficiente (la calidad importa significativamente)
- **Evitar Adaptadores Genéricos**: Muchas fuentes genéricas afirman ofrecer alto amperaje pero no lo entregan, causando inestabilidad

#### Pautas para la Selección de Fuentes de Alimentación
- **Asegurar la Corriente Nominal Adecuada**: Siempre exceder los requisitos mínimos (3A para Pi 4, 5A para Pi 5)[7][8]
- **Verificar la Estabilidad del Voltaje**: Las fuentes de calidad mantienen 5V estables incluso bajo carga
- **La Calidad del Cable Importa**: Usar cables cortos y gruesos para minimizar la caída de voltaje
- **Compatibilidad con Cables USB-C con e-marker**: Los primeros modelos de Pi 4 tenían problemas con ciertos cables USB-C[8]
- **Considerar un Margen Extra**: Agregar 0.5-1A a los requisitos al usar dispositivos externos

### Escenarios Típicos de Consumo de Energía

#### Raspberry Pi 3B+
- **En reposo**: ~350mA (1.75W)[23]
- **Carga ligera de servidor**: ~400mA (2.0W)
- **Carga completa de CPU**: ~980mA (4.9W)
- **Con USB WiFi/SSD**: Agregar 200-400mA (1-2W)

#### Raspberry Pi 4
- **En reposo**: ~540mA (2.7W)[23]
- **Carga ligera de servidor**: ~650mA (3.25W)
- **Carga completa de CPU**: ~1280mA (6.4W)[23]
- **Con SSD USB 3.0**: Agregar 300-600mA (1.5-3W)[23]

#### Raspberry Pi 5
- **En reposo**: ~660mA (3.3W)[26]
- **Carga ligera de servidor**: ~800mA (4.0W)
- **Carga completa de CPU**: ~1600mA (8.0W)
- **Con NVMe PCIe**: Agregar 400-800mA (2-4W)

## Estrategias de Eficiencia Energética

### Optimizaciones de Software

#### Deshabilitar Componentes de Hardware No Utilizados
- **Eliminar la Salida HDMI**: Ahorrar ~25mA agregando `hdmi_blanking=2` al config.txt[27]
- **Deshabilitar Bluetooth**: Agregar `dtoverlay=disable-bt` al config.txt
- **Deshabilitar WiFi**: Agregar `dtoverlay=disable-wifi` al config.txt si se usa Ethernet
- **Reducir la Memoria de la GPU**: Para servidores sin monitor, configurar la memoria mínima de GPU (16MB para Pi 4 o anterior)[66][71]

#### Sistema Operativo y Servicios
- **Usar Distribuciones Lite**: Elegir imágenes de SO mínimas sin entorno de escritorio
- **Deshabilitar Servicios Innecesarios**: Identificar y deshabilitar servicios en segundo plano no utilizados
- **Optimizar Contenedores Docker**: Usar imágenes base ligeras y minimizar la cantidad de contenedores
- **Controlar la Programación de Procesos**: Ajustar los valores nice para tareas en segundo plano no críticas

#### Optimizaciones del Sistema de Archivos y Almacenamiento
- **Reducir el Registro de Logs**: Configurar la rotación de logs con retención mínima
- **Usar tmpfs para Datos Volátiles**: Montar /tmp, /var/tmp, /var/log en RAM[42]
- **Deshabilitar el Registro del Tiempo de Acceso**: Agregar la opción `noatime` a los montajes del sistema de archivos
- **Compromiso entre SSD y Tarjeta SD**: Los SSD consumen más energía pero reducen el riesgo de corrupción

### Enfoques de Hardware

#### Optimización de la Entrega de Energía
- **Consideraciones de UPS**: Los sistemas UPS pequeños pueden proporcionar estabilidad eléctrica
- **Power Over Ethernet (PoE)**: Los Pi 4/5 admiten PoE con HATs adicionales, reduciendo el cableado
- **Batería de Respaldo**: Fundamental para prevenir la corrupción de la tarjeta SD durante cortes de energía

#### Configuraciones de Hardware de Ahorro de Energía
- **Conexión Selectiva de Dispositivos USB**: Conectar solo los periféricos esenciales
- **Gestión Externa de Energía**: Las regletas inteligentes pueden controlar la energía de los periféricos
- **Programación de Energía**: Implementar ciclos de activación/reposo para servicios no críticos

### Monitoreo y Gestión de Energía
- **Monitoreo de Energía**: Usar medidores de energía USB para medir el consumo real
- **Monitoreo por Software**: Instalar herramientas de monitoreo de energía como PowerTop
- **Operaciones Programadas**: Concentrar las tareas intensivas en ventanas de tiempo específicas
- **Escalado Dinámico de Frecuencia**: Configurar el gobernador de CPU para modos de ahorro de energía

## Gestión Térmica y Soluciones de Refrigeración

### Comportamiento Térmico

#### Monitoreo de Temperatura
- **Verificar la Temperatura Actual**: Ejecutar `vcgencmd measure_temp` para ver la temperatura de la CPU
- **Rangos Normales de Operación**:
  - En reposo: 30-45°C
  - Carga ligera: 45-55°C
  - Carga pesada: 55-70°C
  - Rango de advertencia: 70-80°C
  - Umbral de limitación (throttling): 80-85°C[6]

#### Impactos de la Limitación Térmica (Thermal Throttling)
- **Reducción del Rendimiento**: Las velocidades de reloj se reducen automáticamente a altas temperaturas
- **Umbrales de Limitación**:
  - Pi 3B+: Comienza a los 80°C, limitación severa a los 85°C[6]
  - Pi 4: Limitación progresiva de 80°C a 85°C[6]
  - Pi 5: Patrón similar pero con un diseño térmico mejorado

### Opciones de Refrigeración Pasiva

#### Disipadores de Calor
- **Disipadores Básicos**: Los pequeños disipadores de aluminio/cobre pueden reducir la temperatura entre 5-10°C[28]
- **Disipadores Extendidos**: Los disipadores más grandes con aletas proporcionan una reducción de 10-15°C
- **Gabinetes Totalmente Metálicos**: Los gabinetes de aluminio que actúan como disipadores ofrecen una mejora de 15-20°C
- **Consejos de Aplicación**: Usar almohadillas/pasta térmica de calidad y asegurar un contacto adecuado

#### Selección de Gabinete para Refrigeración Pasiva
- **Diseño Abierto**: Los gabinetes con ranuras de ventilación permiten la convección natural
- **El Material Importa**: Los gabinetes metálicos conducen mejor el calor que los de plástico
- **Orientación**: La orientación vertical mejora el flujo de aire natural
- **Exposición de Componentes**: Los diseños que exponen el SoC al flujo de aire funcionan mejor

### Soluciones de Refrigeración Activa

#### Opciones de Ventiladores
- **Ventiladores Directos Pequeños**: Los ventiladores de 30-40mm montados directamente sobre la CPU proporcionan una reducción de 20-30°C
- **Ventiladores de Gabinete**: Los ventiladores integrados en el gabinete mejoran el flujo de aire general
- **Ventiladores Controlados por GPIO**: Los ventiladores activados por temperatura reducen el ruido y el consumo de energía
- **Ventilador Oficial**: El ventilador oficial del Raspberry Pi 5 combina disipador y ventilador[31]

#### Refrigeración Activa Avanzada
- **Configuraciones de Doble Ventilador**: Ventiladores de entrada y salida para un flujo de aire máximo
- **Tubos de Calor**: Algunos gabinetes premium utilizan tecnología de tubos de calor
- **Enfriadores ICE Tower**: Torres altas de disipación con ventiladores para refrigeración extrema
- **Refrigeración Líquida**: Soluciones especializadas para overclocking (raramente necesarias para servidores)

### Recomendaciones de Refrigeración Específicas para Servidores Comunitarios

#### Operación de Servidor 24/7
- **Requisito Mínimo**: Disipador extendido o ventilador pequeño
- **Recomendado**: Disipador combinado con ventilador controlado por temperatura
- **Óptimo**: Gabinete totalmente metálico con refrigeración de ventilador integrada

#### Servidores de Alta Carga
- **Mínimo**: Refrigeración activa con ventilador directo sobre la CPU
- **Recomendado**: Configuración de doble ventilador con disipadores grandes
- **Óptimo**: Active Cooler oficial del Raspberry Pi 5 o gabinete de refrigeración premium

#### Implementaciones de Bajo Consumo/Solares
- **Mínimo**: Disipadores básicos con gabinete bien ventilado
- **Recomendado**: Disipador pasivo grande en orientación vertical
- **Considerar**: Reducir la velocidad de reloj para disminuir la generación de calor
## Opciones de arranque y almacenamiento

### Consideraciones sobre tarjetas SD

#### Selección de tarjetas para confiabilidad
- **Usar tarjetas Clase A1/A2**: Rendimiento mejorado de E/S aleatoria, crucial para las operaciones del sistema operativo[48][50]
- **Capacidad mínima**: 16GB para plataformas comunitarias, se recomiendan 32GB
- **La calidad de la marca importa**: SanDisk, Samsung y Kingston ofrecen mejor confiabilidad
- **Clase de velocidad**: Mínimo V30/U3 para velocidades de escritura adecuadas

#### Reducción del desgaste de la tarjeta SD
- **Mover archivos de registro a la RAM**: Usar montajes tmpfs para reducir escrituras[42]
- **Deshabilitar swap o moverlo a USB**: Reduce las escrituras continuas en la tarjeta SD
- **Ajustes de journaling**: Configurar opciones de journaling más ligeras
- **Copias de seguridad regulares**: Crear imágenes periódicas para recuperarse de la corrupción

### Opciones alternativas de arranque

#### Arranque desde SSD USB (Pi 4 y Pi 5)
- **Mejora de rendimiento**: 2-4× más rápido que las tarjetas SD, hasta 13× para archivos grandes[47]
- **Ventaja de confiabilidad**: Los SSD tienen una vida útil sustancialmente mayor que las tarjetas SD
- **Proceso de configuración**: Requiere actualización del bootloader en la Pi 4 (estándar en la Pi 5)[49][51]
- **Hardware recomendado**: SSD SATA con adaptador USB 3.0 de calidad (chipset ASMedia)[43]

#### Arranque NVMe (Pi 5)
- **Rendimiento máximo**: La conexión directa PCIe elimina el cuello de botella del USB
- **Hardware requerido**: Adaptador PCIe a NVMe y unidad NVMe compatible
- **Consideración de energía**: Puede requerir energía adicional para unidades NVMe de alto rendimiento
- **Mejora de velocidad**: Hasta 10× más rápido que las tarjetas SD para servidores comunitarios[45]

#### Opciones de arranque por red
- **Almacenamiento centralizado**: Arrancar múltiples Pi desde una sola imagen
- **Configuración**: Requiere configuración de TFTP/NFS en un servidor central
- **Confiabilidad**: Elimina fallas del almacenamiento local, pero depende de la red
- **Rendimiento**: Depende de la velocidad de la red y la capacidad del servidor

## Mejores prácticas de energía y refrigeración

### Planificación de una configuración de energía robusta

#### Documentación y etiquetado
- **Registrar requisitos de energía**: Documentar las necesidades de energía de todos los componentes
- **Etiquetar las fuentes de alimentación**: Marcar cada fuente con su clasificación y el dispositivo asignado
- **Mapear dependencias**: Entender qué servicios dependen de qué hardware

#### Consideraciones de redundancia
- **Integración de UPS**: Incluso los UPS pequeños brindan protección valiosa
- **Apagado controlado**: Configurar el apagado automático ante cortes de energía
- **Monitoreo de energía**: Agregar monitoreo de energía con notificaciones
- **Planificación de energía de respaldo**: Calcular las necesidades de autonomía para servicios críticos

### Optimización para operación 24/7

#### Ubicación y entorno
- **Circulación de aire**: Asegurar espacio adecuado alrededor de los dispositivos
- **Temperatura ambiente**: Mantener el área del servidor por debajo de 25°C (77°F) si es posible
- **Gestión del polvo**: Limpieza regular para evitar acumulaciones
- **Aislamiento de vibraciones**: Minimizar el desgaste mecánico por vibraciones

#### Programa de mantenimiento
- **Verificaciones regulares de temperatura**: Monitorear cambios que indiquen problemas
- **Limpieza del sistema de refrigeración**: Limpiar ventiladores y disipadores trimestralmente
- **Prueba de fuentes de alimentación**: Verificar voltaje estable bajo carga periódicamente
- **Reemplazo de pasta térmica**: Cada 2 años para sistemas de uso intensivo

## Solución de problemas de energía y refrigeración

### Problemas comunes de energía

#### Advertencias de subtensión
- **Síntoma**: Ícono de rayo en pantalla o mensajes del kernel
- **Causas**: Fuente de alimentación inadecuada, cable de mala calidad, carga alta
- **Soluciones**: 
  - Actualizar a una fuente de alimentación de mayor calidad
  - Usar cables más cortos y gruesos
  - Reducir la carga de periféricos
  - Verificar conectores USB dañados

#### Fallas de arranque
- **Síntoma**: No arranca o reinicios aleatorios bajo carga
- **Causas**: Caídas de voltaje de la fuente de alimentación bajo carga
- **Soluciones**: 
  - Medir el voltaje con un multímetro en los puntos de prueba
  - Reemplazar la fuente de alimentación por una de mayor capacidad
  - Retirar periféricos que consumen mucha energía

#### Limitación de rendimiento
- **Síntoma**: Lentitud inexplicable, temperaturas altas
- **Causas**: Limitación térmica debido a mala refrigeración
- **Soluciones**:
  - Mejorar las soluciones de refrigeración
  - Verificar con `vcgencmd get_throttled` las banderas de limitación
  - Reducir la velocidad de reloj si es necesario

### Soluciones a problemas de refrigeración

#### Diagnóstico de sobrecalentamiento
- **Síntoma**: Temperaturas constantemente superiores a 75°C
- **Causas**: Refrigeración inadecuada, temperatura ambiente alta, carga sostenida intensa
- **Soluciones**: 
  - Agregar o mejorar soluciones de refrigeración
  - Reducir la temperatura ambiente
  - Verificar procesos que causen alto uso de CPU
  - Verificar la aplicación de pasta/almohadilla térmica

#### Fallas de ventiladores
- **Síntoma**: Temperaturas crecientes, ventilador sin girar
- **Causas**: Falla del ventilador, conexión floja, problema en el circuito de control
- **Soluciones**:
  - Verificar las conexiones GPIO para el control del ventilador
  - Reemplazar el ventilador defectuoso
  - Considerar opciones de refrigeración redundantes

## Casos de estudio de eficiencia energética

### Configuración de servidor comunitario de bajo consumo
- Raspberry Pi 4 2GB con servicios mínimos
- Optimizaciones de energía que reducen el consumo a ~2.5W promedio
- Refrigeración pasiva mediante carcasa de aluminio
- Costo anual estimado de energía: ~$7 (a $0.30/kWh)

### Centro comunitario de alto rendimiento
- Raspberry Pi 5 8GB con almacenamiento NVMe
- Múltiples servicios comunitarios (YunoHost, servidor multimedia, domótica)
- Refrigeración activa con enfriador oficial
- Costo anual estimado de energía: ~$22 (a $0.30/kWh)
- Un servidor x86 equivalente consumiría 5-10× más energía

### Ejemplo de despliegue fuera de la red
- Raspberry Pi 3B+ con configuración mínima
- Energía solar con respaldo de batería
- Optimizaciones de energía extensivas
- Servicios reducidos durante períodos de bajo consumo
- Capacidades de apagado completo de energía

## Conclusión

Una alimentación eléctrica adecuada y una buena gestión térmica son fundamentales para el éxito de los despliegues de servidores comunitarios con Raspberry Pi. Al seleccionar el hardware apropiado, implementar soluciones de refrigeración y optimizar la eficiencia energética, los servidores Raspberry Pi pueden ofrecer una estabilidad y un rendimiento excepcionales manteniendo un consumo mínimo de energía.

Para la mayoría de los despliegues de servidores comunitarios, recomendamos:

1. **Energía**: Fuente de alimentación oficial de Raspberry Pi correspondiente a tu modelo
2. **Refrigeración**: Como mínimo, un disipador de calidad; preferiblemente refrigeración activa para Pi 4/5
3. **Almacenamiento**: Arranque desde SSD USB para la Pi 4, NVMe PCIe para la Pi 5
4. **Eficiencia**: Implementar optimizaciones de software para un consumo reducido de energía

Estas recomendaciones equilibran la confiabilidad, el rendimiento y la eficiencia energética para operaciones 24/7 de servidores comunitarios.

---

*Para información específica sobre modelos, consulta [rpi-models-comparison.md](rpi-models-comparison.md). Para más recursos sobre Raspberry Pi, consulta los documentos de descripción general del hardware y comparación de modelos.*