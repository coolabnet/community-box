---
title: LibreMesh
sourcePath: guides/libremesh-overview.md
sourceHash: 9d33d1cb9a17620a
translatedBy: glm-4.6
---

# Vista general de LibreMesh

## Introducción a LibreMesh

LibreMesh es un marco modular para crear firmwares basados en OpenWrt para nodos de red mesh inalámbrica, diseñado específicamente para redes comunitarias[1][10]. Varias comunidades alrededor del mundo utilizan LibreMesh como base de sus firmwares mesh locales, permitiendo redes inalámbricas descentralizadas y gestionadas por la comunidad.

`[Mesh Network Topology Illustration](mesh-network-topology.png) — Diagram of mesh-connected routers in a typical deployment.`

LibreMesh representa un cambio fundamental de las redes inalámbricas centralizadas tradicionales hacia una infraestructura distribuida y controlada por la comunidad. A diferencia de las configuraciones inalámbricas convencionales que dependen de un único punto de acceso o router, LibreMesh crea redes mesh autoconfigurables donde cada nodo puede enrutar tráfico para otros participantes, eliminando los puntos únicos de falla[10].

`[LibreMesh Logo or Screenshot](libremesh-logo.png) — Identifying the project visually.`

## Características principales y beneficios

### Configuración automática de red

La principal fortaleza de LibreMesh radica en su naturaleza autoconfigurable[1]. El firmware permite un despliegue sencillo de redes mesh versátiles y multirradio sin requerir amplia experiencia técnica por parte de los miembros de la comunidad. Una vez instalados, los nodos se descubren automáticamente entre sí y establecen conexiones mesh utilizando sofisticados protocolos de enrutamiento.

### Arquitectura de red de doble capa

LibreMesh implementa una arquitectura de red única de dos capas que proporciona tanto escalabilidad como segmentación[8][20]:

**Capa 2 (Capa de nube)**: Utiliza el protocolo de enrutamiento BATMAN-adv (Better Approach To Mobile Ad hoc Networking), que crea un dominio de colisión virtual de capa 2 a través de múltiples saltos. Esto permite itinerancia fluida para los dispositivos dentro de la misma "nube"[17][20].

**Capa 3 (Capa de red)**: Emplea el protocolo de enrutamiento Babel (anteriormente BMX6/BMX7) para enrutamiento dinámico nativo de IPv6 con características avanzadas y una sobrecarga de red mínima[17][20].

### Selección inteligente de puerta de enlace

El sistema proporciona una selección inteligente de puerta de enlace con redundancia y capacidad de elección por parte del usuario[8]. Se pueden compartir múltiples conexiones a internet a través de la mesh, con conmutación automática por error cuando las conexiones principales dejan de estar disponibles.

### Soporte multirradio

LibreMesh admite configuraciones multirradio, permitiendo que los routers utilicen diferentes bandas de frecuencia simultáneamente tanto para las conexiones troncales de la mesh como para el acceso de los clientes[5]. Esta separación mejora el rendimiento de la red al reducir la interferencia entre el tráfico de transporte y el de acceso.

## Topologías de red

### Redes mesh comunitarias

LibreMesh sobresale en despliegues a escala comunitaria donde vecindarios, zonas rurales o distritos urbanos crean infraestructura inalámbrica compartida. Las topologías comunes incluyen:

- **Redes de vecindario**: Conectar hogares y pequeños negocios dentro de un área geográfica
- **Conectividad rural**: Conectar lugares remotos con infraestructura de internet limitada
- **Mesh urbana**: Proporcionar conectividad redundante en entornos urbanos densos
- **Redes de campus**: Dar soporte a instituciones educativas o centros comunitarios

### Infraestructura híbrida

El marco admite despliegues híbridos que combinan:
- Conexiones troncales mesh entre puntos estratégicos
- Servicios tradicionales de punto de acceso para los usuarios finales
- Enlaces troncales cableados cuando están disponibles
- Múltiples conexiones de puerta de enlace a internet

## Casos de uso comunes en redes comunitarias

### Compartición de internet

Las comunidades pueden agrupar recursos para compartir conexiones a internet, reduciendo los costos individuales mientras mejoran la confiabilidad mediante la redundancia[22]. La mesh equilibra automáticamente el tráfico entre las puertas de enlace disponibles.

### Servicios locales

Las redes LibreMesh son excelentes para alojar servicios locales accesibles sin conectividad a internet:
- Servidores web locales y repositorios de contenido
- Plataformas de comunicación comunitaria
- Herramientas locales de compartición de archivos y colaboración
- Sistemas de comunicación de emergencia

### Aplicaciones educativas y sociales

Muchos despliegues se enfocan en beneficios educativos y sociales:
- Proporcionar acceso a internet a comunidades desatendidas
- Apoyar programas de alfabetización digital
- Permitir la creación y compartición de contenido local
- Facilitar la organización y comunicación comunitaria

### Respuesta a emergencias y desastres

La naturaleza resiliente y distribuida de las redes mesh las hace valiosas para escenarios de emergencia:
- Mantener la comunicación cuando la infraestructura tradicional falla
- Proporcionar acceso a internet durante desastres
- Apoyar los esfuerzos de coordinación para la respuesta a emergencias

## Organizaciones que apoyan LibreMesh

LibreMesh cuenta con el apoyo de numerosas organizaciones en todo el mundo[10]:

| Organización | Región |
|--------------|--------|
| AlterMundi | Argentina |
| FreiFunk | Alemania |
| FunkFeuer | Austria |
| Guifi | Península ibérica |
| Ibebrasil | Brasil |
| LibreRouter | Global |
| Ninux.org | Italia |
| Wakoma | Global |

## Redes comunitarias que usan LibreMesh

Los despliegues activos demuestran el éxito en el mundo real[10]:

| Red | Ubicación |
|---------|----------|
| Antennine | Apenino Boloñés |
| Calafou | Cataluña |
| Coolab | Brasil |
| Janastu CowMesh | Karnataka rural |

## Filosofía técnica

### Hardware y software de código abierto

LibreMesh encarna los principios de la tecnología abierta, con todo el software y muchos diseños de hardware disponibles bajo licencias abiertas[4]. Esta transparencia permite a las comunidades comprender, modificar y mantener sus redes de forma independiente.

### Propiedad comunitaria

El proyecto enfatiza la propiedad y el control comunitario sobre la infraestructura de red, alejándose de la dependencia de proveedores comerciales o autoridades centralizadas[10]. Este enfoque se alinea con movimientos más amplios hacia la soberanía digital y la resiliencia comunitaria.

### Escalabilidad y modularidad

El diseño modular permite a las comunidades comenzar en pequeño y crecer orgánicamente, añadiendo nodos y servicios a medida que las necesidades evolucionan[5]. El sistema escala desde enlaces simples de dos nodos hasta redes complejas de cientos de nodos.

## Cómo empezar

Para las comunidades interesadas en LibreMesh, la progresión típica incluye:

1. **Fase de planificación**: Evaluar las necesidades de la comunidad y los requisitos técnicos
2. **Selección de hardware**: Elegir los routers y equipos apropiados (ver [libremesh-installation.md](./libremesh-installation.md))
3. **Diseño de red**: Planificar la ubicación de los nodos y la topología (ver [mesh-network-basics.md](./mesh-network-basics.md))
4. **Configuración**: Establecer los parámetros básicos de red y los servicios
5. **Despliegue**: Instalar y configurar los nodos
6. **Integración comunitaria**: Capacitar a los usuarios y establecer la gobernanza

## Próximos pasos

Esta vista general proporciona la base para comprender las capacidades y aplicaciones de LibreMesh. Para una guía detallada de implementación:

- Revisar [mesh-network-basics.md](./mesh-network-basics.md) para conceptos de redes
- Consultar [libremesh-installation.md](./libremesh-installation.md) para procedimientos de hardware e instalación
- Referirse a [dns-configuration.md](./dns-configuration.md) para la configuración de servicios locales

LibreMesh representa más que solo tecnología de redes: es una herramienta para el empoderamiento comunitario y la autodeterminación digital. Al proporcionar la base técnica para redes controladas por la comunidad, permite a los grupos tomar propiedad de su infraestructura digital y crear soluciones de conectividad más resilientes y equitativas.