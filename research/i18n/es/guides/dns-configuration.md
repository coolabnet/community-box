---
title: Configuración de DNS
sourcePath: guides/dns-configuration.md
sourceHash: 21ab7f5dec9d1b26
translatedBy: glm-4.6
---

# Configuración de DNS para LibreMesh

Esta guía explica cómo configurar los servicios DNS en redes LibreMesh para permitir un acceso confiable a los servicios locales, implementar caché y establecer el nombramiento de dominios dentro de la red mesh.

## Introducción al DNS en redes Mesh

El Sistema de Nombres de Dominio (DNS) es un componente crítico de cualquier red, ya que traduce nombres de dominio legibles por humanos en direcciones IP. En las redes mesh, la configuración de DNS adquiere una importancia adicional debido a:

- **Servicios locales**: Es necesario proporcionar acceso a los servicios alojados dentro de la mesh
- **Arquitectura distribuida**: Múltiples nodos pueden proporcionar servicios a través de la red
- **Operación sin conexión**: Las redes deben funcionar incluso sin conectividad a internet
- **Restricciones de recursos**: El hardware limitado requiere soluciones DNS eficientes

LibreMesh usa dnsmasq como su servicio DNS principal, proporcionando una solución ligera pero potente para redes mesh[36][37].

`[Network Diagram with Local DNS](local-dns-diagram.png) — Schematic showing flow of local DNS queries.]`

## Arquitectura DNS en LibreMesh

### Descripción de los componentes

El sistema DNS en LibreMesh consta de varios componentes integrados[37][38][40]:

1. **dnsmasq**: El servidor DNS principal y el servicio DHCP
2. **Estado compartido**: Mecanismo para distribuir la información DNS entre los nodos
3. **Configuración de hosts**: Definiciones de nombres de host locales y de toda la red
4. **Configuración de dominios**: Ajustes para los dominios locales dentro de la mesh

### Flujo de resolución

Cuando un cliente en la red mesh realiza una consulta DNS[41]:

1. La solicitud primero va a la instancia local de dnsmasq en el nodo al que está conectado
2. Si el dominio es local de la mesh, se resuelve usando los registros locales
3. Si es un dominio de internet y está en caché, se devuelve el resultado almacenado en caché
4. De lo contrario, la consulta se reenvía a los servidores DNS ascendentes
5. Si no hay conectividad a internet, solo se resuelven los dominios locales

## Configuración básica de DNS

### Acceso a la configuración de DNS

La configuración de DNS en LibreMesh puede modificarse mediante varios métodos[55]:

1. **Interfaz web**: Hay ajustes DNS limitados disponibles a través de la interfaz web de LibreMesh
2. **Configuración UCI**: Editar los ajustes usando UCI (Unified Configuration Interface)
3. **Edición directa de archivos**: Modificar los archivos de configuración en `/etc/config/`

### Archivos de configuración

Los principales archivos de configuración para DNS en LibreMesh son[37][38]:

- **/etc/config/dhcp**: Contiene la configuración de dnsmasq
- **/etc/config/lime**: Configuración principal de LibreMesh que afecta el comportamiento de DNS
- **/etc/hosts**: Definiciones de nombres de host locales
- **/etc/dnsmasq.d/**: Fragmentos de configuración adicionales

`[LibreMesh DNS Config Screenshot](libremesh-dns-config.png) — Web UI or config file with DNS settings highlighted.]`

## Configuración de la resolución DNS local

### Configuración de hosts estáticos

Para agregar entradas de hosts estáticas para servicios locales[36][38]:

1. **Vía SSH**: Conéctese al nodo LibreMesh vía SSH:
   ```
   ssh root@thisnode.info
   ```

2. **Editar el archivo hosts**: Agregue entradas a `/etc/hosts`:
   ```
   vi /etc/hosts
   ```
   
   Agregue líneas en el formato:
   ```
   192.168.1.10   mediaserver.mesh
   192.168.1.20   wiki.mesh
   ```

3. **Reiniciar el servicio DNS**:
   ```
   /etc/init.d/dnsmasq restart
   ```

### Uso de dnsmasq-distributed-hosts

LibreMesh incluye un paquete llamado dnsmasq-distributed-hosts que comparte la información de nombres de host a través de la mesh[25]:

1. **Verificar la instalación del paquete**:
   ```
   opkg list-installed | grep dnsmasq-distributed
   ```

2. **Configurar la distribución de hosts**:
   Edite `/etc/config/lime-community` para habilitar la distribución de hosts:
   ```
   config lime network
       option dns_distributed_hosts '1'
   ```

3. **Agregar servicios locales**: Registre los servicios locales en sus respectivos nodos usando el archivo hosts

## Implementación de alias de dominio

### Nombres de dominio personalizados para servicios locales

Para crear nombres de dominio fáciles de usar para servicios locales[25]:

1. **Crear la configuración de alias de dominio**:
   ```
   vi /etc/config/domain-aliases
   ```

2. **Agregar alias de dominio**:
   ```
   config alias
       option domain 'community.portal'
       option target '192.168.1.100'
   
   config alias
       option domain 'local.library'
       option target '192.168.1.101'
   ```

3. **Aplicar la configuración**:
   ```
   /etc/init.d/domain-aliases restart
   ```

### Extensiones de dominio

LibreMesh típicamente usa estas extensiones de dominio para servicios locales[41]:

- **.mesh**: Para servicios de toda la mesh
- **.local**: Para servicios específicos de un nodo
- **.lan**: Para servicios de la red local

## Configuración de la caché DNS

### Optimización de los ajustes de caché

La caché DNS mejora el rendimiento al almacenar los resultados de consultas recientes[38][40]:

1. **Editar la configuración de dnsmasq**:
   ```
   vi /etc/config/dhcp
   ```

2. **Configurar el tamaño de la caché**:
   ```
   config dnsmasq
       option cachesize '1000'
       option min_cache_ttl '3600'
   ```

3. **Aplicar los cambios**:
   ```
   /etc/init.d/dnsmasq restart
   ```

### Caché DNS NodeLocal

Para implementaciones más grandes, implemente una caché DNS local en el nodo para reducir la latencia de las consultas[40]:

1. **Instalar los paquetes necesarios**:
   ```
   opkg update
   opkg install dns-cache-local
   ```

2. **Configurar el reenvío**:
   ```
   vi /etc/config/dns-cache-local
   ```
   
   Agregue:
   ```
   config dns-cache-local
       option enabled '1'
       option cache_size '10000'
   ```

3. **Reiniciar los servicios**:
   ```
   /etc/init.d/dns-cache-local restart
   ```

## Operación DNS sin conexión

### Garantizar la resiliencia local

Configure el DNS para operar de manera confiable sin conectividad a internet[41]:

1. **Configurar el dominio local**:
   ```
   vi /etc/config/dhcp
   ```
   
   Agregue:
   ```
   config dnsmasq
       option local '/mesh/'
       option domain 'mesh'
       option expandhosts '1'
   ```

2. **Establecer el modo autoritativo**:
   ```
   config dnsmasq
       option authoritative '1'
   ```

3. **Desactivar el reenvío DNS sin conexión**:
   ```
   config dnsmasq
       option nonwildcard '1'
       option filterwin2k '1'
   ```

## Configuraciones DNS avanzadas

### Soporte para múltiples dominios

Para admitir varios dominios locales[36]:

1. **Configurar las definiciones de dominio**:
   ```
   config dnsmasq
       list local '/mesh/'
       list local '/community/'
       list local '/services/'
   ```

2. **Configurar el comportamiento del dominio**:
   ```
   config dnsmasq
       option domain 'mesh'
       option expand_hosts '1'
       option local_service '1'
   ```

### Integración con DNS externo

Para redes con conectividad a internet[38]:

1. **Configurar los servidores DNS ascendentes**:
   ```
   config dnsmasq
       list server '8.8.8.8'
       list server '1.1.1.1'
   ```

2. **Configurar el reenvío inteligente**:
   ```
   config dnsmasq
       option all_servers '1'
       option sequential_ip '1'
   ```

## Características especiales de DNS en LibreMesh

### Dominio thisnode.info

LibreMesh implementa un dominio especial llamado "thisnode.info" que siempre resuelve al nodo actual[41]:

1. Este dominio funciona en todos los nodos de la red
2. Acceder a http://thisnode.info siempre abre la interfaz web del nodo local
3. Esta función simplifica la administración de nodos

### Estado compartido para DNS

LibreMesh usa un sistema de estado compartido para distribuir la información DNS[37]:

1. **Habilitar el estado compartido**:
   ```
   config lime network
       option use_shared_state '1'
   ```

2. **Configurar el uso compartido del estado**:
   ```
   config lime shared_state
       option sharing_strategy 'all'
       option shared_data 'hosts dnsmasq-lease'
   ```

## Solución de problemas de DNS

### Problemas comunes y soluciones

#### Los nombres de dominio no se resuelven

1. **Verificar el servicio dnsmasq**:
   ```
   /etc/init.d/dnsmasq status
   ```

2. **Verificar la configuración**:
   ```
   cat /etc/config/dhcp
   ```

3. **Probar la resolución**:
   ```
   nslookup local.service 127.0.0.1
   ```

4. **Revisar los registros**:
   ```
   logread | grep dnsmasq
   ```

#### Problemas de propagación de DNS

Si las entradas DNS no se propagan a través de la mesh:

1. **Verificar el estado compartido**:
   ```
   cat /tmp/shared-state/dnsmasq-hosts
   ```

2. **Comprobar la conectividad de la mesh**:
   ```
   ping othernode.mesh
   ```

3. **Reiniciar el servicio de estado compartido**:
   ```
   /etc/init.d/shared-state restart
   ```

#### Resolución lenta

Para una resolución DNS lenta:

1. **Optimizar los ajustes de caché**:
   ```
   config dnsmasq
       option cachesize '2000'
       option min_cache_ttl '7200'
   ```

2. **Comprobar si hay fugas de DNS**:
   ```
   tcpdump -i any port 53
   ```

## Reemplazo de dnsmasq

LibreMesh actualmente usa dnsmasq tanto para DNS como para DHCP, pero existen planes para separar estas funciones[37]:

1. **Estado actual**: dnsmasq maneja tanto DNS como DHCP en las versiones actuales de LibreMesh
2. **Planes futuros**: odhcpd podría reemplazar la funcionalidad DHCP mientras se mantiene dnsmasq para DNS
3. **Compatibilidad**: Cualquier cambio mantendrá la compatibilidad con las configuraciones existentes

## Mejores prácticas para el DNS de LibreMesh

### Optimización del rendimiento

1. **Tamaño adecuado de la caché**: Ajuste el tamaño de la caché según la memoria del nodo (mayor para los nodos de gateway)
2. **Minimizar las anulaciones de TTL**: Solo anule el TTL para recursos con acceso frecuente
3. **Usar dominios locales**: Mantenga los servicios específicos de la mesh bajo nombres de dominio consistentes

### Consideraciones de seguridad

1. **Restringir las transferencias de zona**: Limite las transferencias de zona solo a los nodos de la mesh
2. **Implementar filtrado DNS**: Considere el filtrado de contenido basado en DNS para las políticas comunitarias
3. **Proteger los archivos de configuración**: Proteja la configuración DNS contra cambios no autorizados

### Planificación de la escalabilidad

1. **Estructura jerárquica**: Para redes grandes, implemente una estructura DNS jerárquica
2. **Distribución de carga**: Distribuya el servicio DNS entre múltiples nodos potentes
3. **Monitoreo**: Implemente el monitoreo de consultas DNS para identificar problemas de rendimiento

## Ejemplos de implementación

### Red comunitaria pequeña

Para una red de 5-10 nodos:
```
config dnsmasq
    option domain 'ourcomm.mesh'
    option expandhosts '1'
    option local '/ourcomm.mesh/'
    option cachesize '500'
```

### Red comunitaria mediana

Para una red de 20-50 nodos:
```
config dnsmasq
    option domain 'communitynet.mesh'
    option expandhosts '1'
    option local '/communitynet.mesh/'
    option local '/services.communitynet.mesh/'
    option cachesize '1000'
    option all_servers '1'
```

### Red comunitaria grande

Para una red de más de 100 nodos, implemente un DNS jerárquico con servidores DNS primarios y secundarios en nodos más potentes.
## Próximos Pasos

Para continuar con el desarrollo de tu red LibreMesh:

- Consulta [libremesh-overview.md](./libremesh-overview.md) para obtener un contexto más amplio
- Revisa [mesh-network-basics.md](./mesh-network-basics.md) para conocer los fundamentos de redes
- Sigue [libremesh-installation.md](./libremesh-installation.md) para obtener orientación sobre hardware y configuración

Al implementar un sistema DNS bien configurado, mejorarás la usabilidad, el rendimiento y la resiliencia de tu red LibreMesh, permitiendo un acceso fluido tanto a los recursos locales como a los de internet.