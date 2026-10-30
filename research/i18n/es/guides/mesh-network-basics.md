---
title: Conceptos básicos de Mesh
sourcePath: guides/mesh-network-basics.md
sourceHash: 7c2ff6e29116e57c
translatedBy: glm-4.6
---

# Conceptos Básicos de Redes Mesh

## Introducción a las Redes Mesh

Las redes mesh representan un enfoque fundamentalmente diferente de la arquitectura de red en comparación con los modelos tradicionales de tipo hub-and-spoke. En las redes mesh, los dispositivos (nodos) se conectan de manera directa, dinámica y no jerárquica a tantos otros nodos como sea posible, creando múltiples rutas para la transmisión de datos[13]. Esta estructura descentralizada ofrece varias ventajas sobre las redes convencionales, particularmente en despliegues comunitarios.

`[Wireless Channel Map](wireless-channel-map.png) — Example showing proper channel selections to reduce interference.]`

## Conceptos Clave de Redes para LibreMesh

### Enrutamiento en Redes Mesh

Las redes mesh gestionan el enrutamiento mediante comunicación entre pares donde cada nodo actúa tanto como emisor como receptor de datos[12]. Este enfoque cooperativo de la transmisión de datos crea redes resilientes que pueden mantener la conectividad incluso cuando nodos individuales fallan.

#### Protocolos de Enrutamiento

LibreMesh emplea dos protocolos de enrutamiento principales en su arquitectura de doble capa[20]:

1. **BATMAN-adv (Better Approach To Mobile Ad hoc Networking)**: Un protocolo de capa 2 que crea un conmutador de red virtual a partir de los nodos mesh, haciendo que toda la red mesh aparezca como una única red de enlace local. Este protocolo:
   - Gestiona el enrutamiento de capa 2 (direcciones MAC)
   - Permite el roaming fluido dentro de una nube mesh
   - Crea lo que aparece a los clientes como un único dominio de colisión de red
   - Funciona en la capa de enlace de datos (capa 2 del modelo OSI)

2. **Babel**: Un protocolo de enrutamiento de vector de distancias para IPv6 e IPv4 con propiedades de convergencia rápida. Este protocolo:
   - Gestiona el enrutamiento de capa 3 (direcciones IP)
   - Proporciona conectividad entre nubes
   - Permite la selección inteligente de pasarelas
   - Funciona en la capa de red (capa 3 del modelo OSI)

### Conceptos de Topología de Red

Las redes mesh pueden implementar diferentes estructuras de topología según las necesidades[18]:

- **Malla Completa (Full Mesh)**: Cada nodo se comunica directamente con todos los demás nodos
- **Malla Parcial (Partial Mesh)**: Los nodos se comunican principalmente con nodos cercanos, y los datos "saltan" a través de múltiples nodos para llegar a destinos lejanos

LibreMesh admite ambas configuraciones, siendo la malla parcial más común en despliegues grandes por razones de eficiencia.

`[Node Discovery UI Screenshot](node-discovery-ui.png) — LibreMesh's interface showing known nodes.]`

### Configuración Automática

Una característica fundamental de LibreMesh es su capacidad de configurar automáticamente los parámetros de red[20]. Esto incluye:

- **Descubrimiento de Nodos**: Detección automática de otros nodos mesh dentro del alcance
- **Establecimiento de Rutas**: Creación dinámica de las rutas de enrutamiento óptimas
- **Asignación de Direcciones**: Asignación automática de direcciones IP basada en algoritmos deterministas
- **Selección de Pasarelas**: Elección inteligente de los puntos de salida a internet

Esta autoconfiguración reduce significativamente la experiencia técnica necesaria para desplegar y mantener redes mesh.

## Arquitectura de Red en LibreMesh

### Diseño de Doble Capa

La arquitectura de red de LibreMesh se basa en un sistema de dos capas que proporciona tanto flexibilidad como rendimiento[8][17][20]:

#### Nube de Capa 2

La capa de nube utiliza BATMAN-adv para crear "nubes" mesh — segmentos de red local que funcionan como un único dominio de colisión. Sus características clave incluyen:

- Todos los dispositivos dentro de una nube aparecen en la misma red local
- Roaming fluido para los dispositivos cliente dentro de la nube
- Aislamiento del tráfico de difusión dentro de los límites de la nube
- Redes locales simplificadas con descubrimiento automático

#### Red de Capa 3

La capa de red utiliza Babel (anteriormente BMX6/BMX7) para interconectar diferentes nubes y gestionar el enrutamiento entre ellas. Esto proporciona:

- Conectividad escalable entre nubes mesh separadas
- Selección inteligente de pasarelas para el acceso a internet
- Reducción del tráfico de difusión en toda la red más amplia
- Enrutamiento nativo IPv6 con compatibilidad IPv4

### Segmentación VLAN

LibreMesh utiliza etiquetado VLAN para aislar los protocolos de enrutamiento[17]:

- La VLAN de Babel es consistente en todos los nodos, permitiendo que los nodos conectados a nivel de enlace se encuentren entre sí
- La VLAN de BATMAN-adv depende de un identificador de nube (típicamente derivado del SSID del AP)
- Esta configuración permite aislar las nubes de capa 2 manteniendo la conectividad de capa 3

## Planificación de Canales Inalámbricos

### Principios de Selección de Canales

Una selección adecuada de canales es crucial para el rendimiento de las redes mesh inalámbricas[34][35]:

#### Consideraciones para 2.4 GHz

- Solo los canales 1, 6 y 11 no se superponen en la mayoría de las regiones
- La interferencia de canales adyacentes (ACI) ocurre cuando nodos cercanos utilizan canales parcialmente superpuestos
- La interferencia de co-canal (CCI) sucede cuando los nodos dentro del alcance utilizan el mismo canal

#### Planificación para 5 GHz

- Más canales disponibles permiten una mejor reutilización espacial
- Los canales con Selección Dinámica de Frecuencia (DFS) pueden requerir capacidades de detección de radar
- Las frecuencias más altas tienen un alcance reducido pero a menudo menos interferencia

### Estrategias de Asignación de Canales

Para un rendimiento óptimo de la red mesh, considera estas estrategias de planificación de canales:

1. **Separación de Canales**: Asegúrate de que los enlaces de backhaul mesh utilicen canales diferentes al acceso de clientes
2. **Reutilización Espacial**: Planifica las asignaciones de canales según la ubicación física de los nodos
3. **Mitigación de Interferencias**: Selecciona canales con la mínima interferencia externa
4. **Cumplimiento Normativo**: Respeta las regulaciones locales sobre el uso de frecuencias y niveles de potencia

## Tolerancia a Fallos y Redundancia

### Redundancia de Rutas

Las redes mesh destacan en proporcionar múltiples rutas para la transmisión de datos[18][19]. Esta redundancia garantiza:

- Que la comunicación pueda continuar si fallan nodos individuales
- Que el tráfico pueda redirigirse alrededor de nodos congestionados o dañados
- Que la capacidad de la red pueda escalar con nodos adicionales

### Capacidades de Autorreparación

Las redes LibreMesh se adaptan automáticamente a las condiciones cambiantes[18]:

- Detectando fallos de nodos y estableciendo rutas alternativas
- Adaptándose a la variación de la calidad del enlace seleccionando las rutas óptimas
- Incorporando nuevos nodos a la red mesh a medida que se conectan
- Equilibrando el tráfico entre las rutas disponibles

## Roaming en Redes Mesh

### Roaming de Capa 2

Una ventaja significativa de la implementación de BATMAN-adv en LibreMesh es su soporte para el roaming fluido de capa 2[8][17][20][42]:

- Los dispositivos pueden moverse entre puntos de acceso sin cambiar de dirección IP
- Las conexiones activas (sesiones TCP, transmisiones de video, llamadas VoIP) permanecen intactas durante las transiciones
- No se requiere configuración especial del cliente para el soporte de roaming

### Limitaciones del Roaming

El roaming en LibreMesh tiene algunas restricciones[42]:

- El roaming funciona solo dentro de una única nube de BATMAN-adv
- Los dispositivos no pueden hacer roaming fluido entre diferentes nubes mesh
- El rendimiento del roaming depende en parte de las capacidades del dispositivo cliente

## Consideraciones de Rendimiento

### Configuraciones Multi-Radio

Para un rendimiento óptimo, los nodos mesh pueden utilizar múltiples radios[7]:

- Una radio para las conexiones de backhaul mesh (idealmente 5 GHz)
- Otra radio para el acceso de clientes (típicamente 2.4 GHz)
- Radios adicionales para enlaces punto a punto dedicados

### Escalabilidad de la Red

Las redes LibreMesh pueden escalar mediante un diseño cuidadoso[8]:

- Segmentando redes grandes en múltiples nubes mesh
- Utilizando antenas direccionales para enlaces de larga distancia
- Implementando estructuras de red jerárquicas para despliegues grandes
- Una ubicación cuidadosa de las pasarelas y una planificación adecuada de la capacidad

## Conceptos Avanzados de Redes Mesh

### Enrutamiento Basado en Calidad

Los protocolos mesh modernos consideran la calidad del enlace al tomar decisiones de enrutamiento[16]:

- Midiendo las tasas de entrega de paquetes entre nodos
- Calculando los tiempos de transmisión a través de diferentes rutas
- Adaptándose a las condiciones inalámbricas cambiantes
- Equilibrando entre la ruta más corta y la de mayor calidad

### Segmentación de Red

LibreMesh admite la segmentación lógica de redes[8][17]:

- Creando nubes mesh separadas para diferentes áreas o propósitos
- Aislando los dominios de difusión para mejorar el rendimiento
- Implementando límites de seguridad entre segmentos de red
- Permitiendo diferentes políticas en diferentes partes de la red
## Solución de problemas de conectividad de la malla

### Problemas comunes y soluciones

Al solucionar problemas de redes mesh, considere estos escenarios comunes[56]:

1. **Red mesh visible pero sin conectividad a internet**
   - Verifique que al menos un punto de acceso raíz esté conectado mediante LAN cableada
   - Confirme que la configuración de la puerta de enlace sea correcta
   - Asegure un enrutamiento adecuado entre la malla y la puerta de enlace de internet

2. **Red mesh no visible**
   - Permita tiempo suficiente (hasta 5 minutos) para la inicialización de la red
   - Verifique que los puntos de acceso de la malla estén en el mismo canal
   - Compruebe si el Protocolo de Árbol de Expansión (Spanning Tree Protocol) está bloqueando la configuración de la malla

3. **Nodos faltantes en la red mesh**
   - Asegúrese de que todos los nodos tengan la configuración adecuada
   - Verifique la compatibilidad del canal inalámbrico
   - Compruebe la ubicación física y la distancia entre los nodos

4. **Rendimiento deficiente**
   - Busque interferencias de canal
   - Verifique la intensidad de la señal entre los nodos
   - Confirme la posición y orientación de las antenas
   - Monitoree clientes o servicios que consuman mucho ancho de banda

## Próximos pasos

Para la implementación práctica de estos conceptos:

- Consulte [libremesh-overview.md](./libremesh-overview.md) para obtener una comprensión más amplia de LibreMesh
- Siga [libremesh-installation.md](./libremesh-installation.md) para obtener orientación sobre hardware e instalación
- Consulte [dns-configuration.md](./dns-configuration.md) para la configuración de servicios locales

Al comprender estos conceptos fundamentales de redes mesh, estará mejor preparado para diseñar, implementar y mantener una red LibreMesh eficaz que satisfaga las necesidades de su comunidad.