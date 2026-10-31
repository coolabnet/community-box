---
title: Configuración de DNS
sourcePath: guides/dns-configuration.md
sourceHash: ed32e7ec02534683
translatedBy: glm-4.6
---

# Configuración de DNS para LibreMesh

Esta guía explica cómo configurar los servicios DNS en redes LibreMesh para permitir un acceso confiable a los servicios locales, implementar caché y establecer nombres de dominio dentro de la red mesh.

## Introducción al DNS en Redes Mesh

El Sistema de Nombres de Dominio (DNS) es un componente crítico de cualquier red, ya que traduce nombres de dominio legibles por humanos en direcciones IP. En las redes mesh, la configuración de DNS adquiere una importancia adicional debido a:

- **Servicios Locales**: Es necesario proporcionar acceso a los servicios alojados dentro de la mesh
- **Arquitectura Distribuida**: Múltiples nodos pueden proporcionar servicios a través de la red
- **Operación Sin Conexión**: Las redes deben funcionar incluso sin conectividad a internet
- **Restricciones de Recursos**: El hardware limitado requiere soluciones DNS eficientes

LibreMesh utiliza dnsmasq como su servicio DNS principal, proporcionando una solución ligera pero potente para redes mesh[36][37].

## Arquitectura DNS en LibreMesh

### Descripción de los Componentes

El sistema DNS en LibreMesh consiste en varios componentes integrados[37][38][40]:

1. **dnsmasq**: El servidor DNS principal y servicio DHCP
2. **Estado Compartido**: Mecanismo para distribuir información DNS entre los nodos
3. **Configuración de Hosts**: Definiciones de nombres de host locales y de toda la red
4. **Configuración de Dominios**: Ajustes para los dominios locales dentro de la mesh

### Flujo de Resolución

Cuando un cliente en la red mesh realiza una consulta DNS[41]:

1. La solicitud va primero a la instancia local de dnsmasq en el nodo conectado
2. Si el dominio es local a la mesh, se resuelve usando los registros locales
3. Si es un dominio de internet y está en caché, se devuelve el resultado almacenado
4. De lo contrario, la consulta se reenvía a los servidores DNS ascendentes
5. Si no hay conectividad a internet, solo se resuelven los dominios locales

## Configuración Básica de DNS

### Acceso a la Configuración de DNS

La configuración de DNS en LibreMesh puede modificarse mediante varios métodos[55]:

1. **Interfaz Web**: Hay ajustes DNS limitados disponibles a través de la interfaz web de LibreMesh
2. **Configuración UCI**: Editar los ajustes usando UCI (Unified Configuration Interface)
3. **Edición Directa de Archivos**: Modificar los archivos de configuración en `/etc/config/`

### Archivos de Configuración

Los principales archivos de configuración para DNS en LibreMesh son[37][38]:

- **/etc/config/dhcp**: Contiene la configuración de dnsmasq
- **/etc/config/lime**: Configuración principal de LibreMesh que afecta el comportamiento del DNS
- **/etc/hosts**: Definiciones de nombres de host locales
- **/etc/dnsmasq.d/**: Fragmentos de configuración adicionales

## Establecimiento de la Resolución DNS Local

### Configuración de Hosts Estáticos

Para agregar entradas de hosts estáticos para servicios locales[36][38]:

1. **Vía SSH**: Conéctese al nodo LibreMesh vía SSH:
   ```
   ssh root@thisnode.info
   ```

2. **Editar Archivo de Hosts**: Agregue entradas a `/etc/hosts`:
   ```
   vi /etc/hosts
   ```
   
   Agregue líneas con el formato:
   ```
   192.168.1.10   mediaserver.mesh
   192.168.1.20   wiki.mesh
   ```

3. **Reiniciar el Servicio DNS**:
   ```
   /etc/init.d/dnsmasq restart
   ```

### Uso de dnsmasq-distributed-hosts

LibreMesh incluye un paquete llamado dnsmasq-distributed-hosts que comparte la información de nombres de host a través de la mesh[25]:

1. **Verificar la Instalación del Paquete**:
   ```
   opkg list-installed | grep dnsmasq-distributed
   ```

2. **Configurar la Distribución de Hosts**:
   Edite `/etc/config/lime-community` para habilitar la distribución de hosts:
   ```
   config lime network
       option dns_distributed_hosts '1'
   ```

3. **Agregar Servicios Locales**: Registre los servicios locales en sus respectivos nodos usando el archivo de hosts

## Implementación de Alias de Dominio

### Nombres de Dominio Personalizados para Servicios Locales

Para crear nombres de dominio fáciles de usar para los servicios locales[25]:

1. **Crear la Configuración de Alias de Dominio**:
   ```
   vi /etc/config/domain-aliases
   ```

2. **Agregar Alias de Dominio**:
   ```
   config alias
       option domain 'community.portal'
       option target '192.168.1.100'
   
   config alias
       option domain 'local.library'
       option target '192.168.1.101'
   ```

3. **Aplicar la Configuración**:
   ```
   /etc/init.d/domain-aliases restart
   ```

### Extensiones de Dominio

LibreMesh normalmente utiliza estas extensiones de dominio para los servicios locales[41]:

- **.mesh**: Para servicios de toda la mesh
- **.local**: Para servicios específicos del nodo
- **.lan**: Para servicios de la red local

## Configuración de la Caché DNS

### Optimización de los Ajustes de Caché

La caché DNS mejora el rendimiento almacenando los resultados de consultas recientes[38][40]:

1. **Editar la Configuración de dnsmasq**:
   ```
   vi /etc/config/dhcp
   ```

2. **Configurar el Tamaño de la Caché**:
   ```
   config dnsmasq
       option cachesize '1000'
       option min_cache_ttl '3600'
   ```

3. **Aplicar los Cambios**:
   ```
   /etc/init.d/dnsmasq restart
   ```

### Caché DNS NodeLocal

Para despliegues más grandes, implemente una caché DNS local en el nodo para reducir la latencia de las consultas[40]:

1. **Instalar los Paquetes Necesarios**:
   ```
   opkg update
   opkg install dns-cache-local
   ```

2. **Configurar el Reenvío**:
   ```
   vi /etc/config/dns-cache-local
   ```
   
   Agregue:
   ```
   config dns-cache-local
       option enabled '1'
       option cache_size '10000'
   ```

3. **Reiniciar los Servicios**:
   ```
   /etc/init.d/dns-cache-local restart
   ```

## Operación DNS Sin Conexión

### Garantizar la Resiliencia Local

Configure el DNS para que funcione de manera confiable sin conectividad a internet[41]:

1. **Configurar el Dominio Local**:
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

2. **Establecer el Modo Autoritativo**:
   ```
   config dnsmasq
       option authoritative '1'
   ```

3. **Deshabilitar el Reenvío DNS Sin Conexión**:
   ```
   config dnsmasq
       option nonwildcard '1'
       option filterwin2k '1'
   ```

## Configuraciones Avanzadas de DNS

### Soporte de Múltiples Dominios

Para admitir múltiples dominios locales[36]:

1. **Configurar las Definiciones de Dominio**:
   ```
   config dnsmasq
       list local '/mesh/'
       list local '/community/'
       list local '/services/'
   ```

2. **Configurar el Comportamiento del Dominio**:
   ```
   config dnsmasq
       option domain 'mesh'
       option expand_hosts '1'
       option local_service '1'
   ```

### Integración con DNS Externo

Para redes con conectividad a internet[38]:

1. **Configurar los Servidores DNS Ascendentes**:
   ```
   config dnsmasq
       list server '8.8.8.8'
       list server '1.1.1.1'
   ```

2. **Configurar el Reenvío Inteligente**:
   ```
   config dnsmasq
       option all_servers '1'
       option sequential_ip '1'
   ```

## Características Especiales del DNS en LibreMesh

### Dominio thisnode.info

LibreMesh implementa un dominio especial llamado "thisnode.info" que siempre se resuelve al nodo actual[41]:

1. Este dominio funciona en todos los nodos de la red
2. Acceder a http://thisnode.info siempre abre la interfaz web del nodo local
3. Esta función simplifica la administración de nodos

### Estado Compartido para DNS

LibreMesh utiliza un sistema de estado compartido para distribuir la información DNS[37]:

1. **Habilitar el Estado Compartido**:
   ```
   config lime network
       option use_shared_state '1'
   ```

2. **Configurar el Compartir de Estado**:
   ```
   config lime shared_state
       option sharing_strategy 'all'
       option shared_data 'hosts dnsmasq-lease'
   ```

## Resolución de Problemas de DNS

### Problemas Comunes y Soluciones

#### Nombres de Dominio que No se Resuelven

1. **Comprobar el Servicio dnsmasq**:
   ```
   /etc/init.d/dnsmasq status
   ```

2. **Verificar la Configuración**:
   ```
   cat /etc/config/dhcp
   ```

3. **Probar la Resolución**:
   ```
   nslookup local.service 127.0.0.1
   ```

4. **Revisar los Registros**:
   ```
   logread | grep dnsmasq
   ```

#### Problemas de Propagación del DNS

Si las entradas DNS no se propagan a través de la mesh:

1. **Verificar el Estado Compartido**:
   ```
   cat /tmp/shared-state/dnsmasq-hosts
   ```

2. **Comprobar la Conectividad de la Mesh**:
   ```
   ping othernode.mesh
   ```

3. **Reiniciar el Servicio de Estado Compartido**:
   ```
   /etc/init.d/shared-state restart
   ```

#### Resolución Lenta

Para una resolución DNS lenta:

1. **Optimizar los Ajustes de Caché**:
   ```
   config dnsmasq
       option cachesize '2000'
       option min_cache_ttl '7200'
   ```

2. **Comprobar Fugas de DNS**:
   ```
   tcpdump -i any port 53
   ```

## Reemplazo de dnsmasq

LibreMesh actualmente utiliza dnsmasq tanto para DNS como para DHCP, pero existen planes para separar estas funciones[37]:

1. **Estado Actual**: dnsmasq gestiona tanto DNS como DHCP en las versiones actuales de LibreMesh
2. **Planes Futuros**: odhcpd puede reemplazar la funcionalidad DHCP manteniendo dnsmasq para DNS
3. **Compatibilidad**: Cualquier cambio mantendrá la compatibilidad con las configuraciones existentes

## Mejores Prácticas para el DNS de LibreMesh

### Optimización del Rendimiento

1. **Dimensionar Correctamente la Caché**: Ajuste el tamaño de la caché según la memoria del nodo (mayor para los nodos pasarela)
2. **Minimizar las Anulaciones de TTL**: Solo anule el TTL para los recursos de acceso frecuente
3. **Usar Dominios Locales**: Mantenga los servicios específicos de la mesh bajo nombres de dominio consistentes

### Consideraciones de Seguridad

1. **Restringir las Transferencias de Zona**: Limite las transferencias de zona solo a los nodos de la mesh
2. **Implementar Filtrado DNS**: Considere el filtrado de contenido basado en DNS para las políticas de la comunidad
3. **Proteger los Archivos de Configuración**: Proteja la configuración DNS de cambios no autorizados

### Planificación de la Escalabilidad

1. **Estructura Jerárquica**: Para redes grandes, implemente una estructura DNS jerárquica
2. **Distribución de Carga**: Distribuya el servicio DNS entre múltiples nodos potentes
3. **Monitoreo**: Implemente el monitoreo de consultas DNS para identificar problemas de rendimiento

## Ejemplos de Implementación

### Red Comunitaria Pequeña

Para una red de 5-10 nodos:
```
config dnsmasq
    option domain 'ourcomm.mesh'
    option expandhosts '1'
    option local '/ourcomm.mesh/'
    option cachesize '500'
```

### Red Comunitaria Mediana

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

### Red Comunitaria Grande

Para una red de más de 100 nodos, implemente un DNS jerárquico con servidores DNS primario y secundario en nodos más potentes.
## Próximos Pasos

Para seguir desarrollando tu red LibreMesh:

- Revisa [libremesh-overview.md](./libremesh-overview.md) para obtener un contexto más amplio
- Consulta [mesh-network-basics.md](./mesh-network-basics.md) para conocer los fundamentos de redes
- Sigue [libremesh-installation.md](./libremesh-installation.md) para obtener orientación sobre hardware y configuración

Al implementar un sistema DNS bien configurado, mejorarás la usabilidad, el rendimiento y la resiliencia de tu red LibreMesh, permitiendo un acceso fluido tanto a los recursos locales como a los de internet.