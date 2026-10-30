---
title: YunoHost
sourcePath: software/yunohost/README.md
sourceHash: 1bff59f1946a2dc7
translatedBy: glm-4.6
---

# Descripción general de YunoHost para servidores comunitarios

## Introducción

YunoHost es un sistema operativo completo para servidores que simplifica la implementación y administración de aplicaciones web. Proporciona una interfaz fácil de usar para instalar, configurar y mantener diversos servicios con un mínimo de conocimientos técnicos requeridos[11][14].

## Características principales

### Gestión de aplicaciones
- **Instalaciones con un clic**: Más de 200 aplicaciones preempaquetadas disponibles
- **Actualizaciones automáticas**: Tanto para el sistema como para las aplicaciones instaladas
- **Catálogo de aplicaciones**: Explora e instala aplicaciones web directamente desde la interfaz de administración
- **Compatibilidad con múltiples aplicaciones**: Aloja múltiples servicios en un solo servidor

### Gestión de usuarios
- **Gestión de dominios**: Compatibilidad con múltiples dominios y subdominios
- **Portal de usuarios**: Portal SSO (Single Sign-On / inicio de sesión único) personalizable para usuarios
- **Integración de correo electrónico**: Servidor de correo completo con antispam y antivirus
- **LDAP/Active Directory**: Integración con servicios de directorio existentes

### Funciones de seguridad
- **Certificados SSL/TLS**: Gestión automática de certificados de Let's Encrypt
- **Fail2Ban**: Protección contra ataques de fuerza bruta
- **Firewall**: Configuración de firewall integrada
- **Copias de seguridad automáticas**: Soluciones de respaldo programadas y bajo demanda
- **Autoactualización**: Parches de seguridad aplicados automáticamente

## Compatibilidad con el hardware de Community Box

### Compatibilidad con Raspberry Pi
- **Raspberry Pi 4**: Compatibilidad oficial con imágenes dedicadas
- **Raspberry Pi 5**: Compatibilidad nativa con la última versión de YunoHost 12+
- **RAM mínima**: 1GB (2GB recomendados para producción)
- **Almacenamiento**: Se recomiendan tarjetas microSD clase A1/A2 (32GB mínimo)

### Compatibilidad con Intel NUC
- **Compatibilidad total con x86_64**: Excelente rendimiento en hardware Intel
- **Compatibilidad multiusuario**: Puede manejar cómodamente más de 20 usuarios concurrentes
- **Especificaciones recomendadas**: 4GB+ de RAM, 64GB+ de almacenamiento
- **Configuración óptima**: Almacenamiento SSD para un mejor rendimiento

### Compatibilidad con ZimaBoard
- **Arquitectura ARM64**: Compatibilidad nativa
- **Configuración de almacenamiento**: Compatibilidad con múltiples unidades para almacenamiento redundante
- **Configuración recomendada**: Almacenamiento SATA o NVMe con configuración RAID
- **Casos de uso**: Servidores para pequeñas empresas, portales comunitarios

## Requisitos de instalación

### Requisitos del sistema
- **RAM**: 1GB mínimo (2GB+ recomendados)
- **Almacenamiento**: 16GB mínimo (64GB recomendados)
- **Red**: Conexión Ethernet altamente recomendada
- **Sistema operativo**: ISO de YunoHost o sistema base basado en Debian

### Métodos de instalación
1. **Instalación directa**: Grabar la imagen oficial de YunoHost
2. **Base Debian**: Instalar sobre una instalación Debian existente
3. **Docker**: Disponible para pruebas y desarrollo
4. **Vagrant**: Para entornos de desarrollo

## Aplicaciones populares

### Comunicación
- **Matrix Synapse**: Protocolo de mensajería descentralizada
- **Jitsi Meet**: Solución de videoconferencia
- **Servidor de correo**: Servidor de correo completo con webmail
- **IRC**: Servidor de Internet Relay Chat

### Colaboración
- **Nextcloud**: Plataforma para compartir archivos y colaborar
- **Kanboard**: Herramienta de gestión de proyectos
- **Calibre Web**: Gestión de biblioteca digital
- **Monica**: Gestión de relaciones personales

### Servicios comunitarios
- **WordPress**: Sistema de gestión de contenidos
- **Pi-hole**: Bloqueo de anuncios en toda la red
- **Vaultwarden**: Gestor de contraseñas
- **MediaWiki**: Plataforma wiki comunitaria

## Implementación de plataformas comunitarias

### Configuración básica comunitaria
1. **Instalar YunoHost**: Grabar y configurar el sistema base
2. **Configurar dominio**: Establecer el dominio principal y SSL
3. **Crear usuarios**: Añadir a los miembros de la comunidad como usuarios
4. **Instalar aplicaciones**: Implementar los servicios esenciales
5. **Configurar copias de seguridad**: Establecer un programa de respaldos automáticos

### Configuración avanzada
- **Dominios múltiples**: Crear subdominios para diferentes servicios
- **Aplicaciones personalizadas**: Implementar aplicaciones web personalizadas
- **Gestión de API**: Configurar API REST e integraciones
- **Integración LDAP**: Conectar con directorios de usuarios existentes

## Optimización del rendimiento

### Para Raspberry Pi
- **Usar almacenamiento SSD**: Evitar microSD para datos de producción
- **Optimizar aplicaciones**: Limitar aplicaciones pesadas concurrentes
- **Gestión de memoria**: Configurar swap si es necesario
- **Control de temperatura**: Asegurar una refrigeración adecuada

### Para hardware Intel
- **Escalabilidad multiusuario**: Puede admitir decenas de usuarios
- **Aplicaciones pesadas**: Ejecutar servicios intensivos en bases de datos
- **Configuración RAID**: Implementar almacenamiento redundante
- **Balanceo de carga**: Configurar múltiples servidores si es necesario

## Copias de seguridad y recuperación

### Estrategias de respaldo
- **Respaldos diarios automáticos**: Períodos de retención configurables
- **Específicos por aplicación**: Algunas aplicaciones admiten respaldos granulares
- **Respaldos cifrados**: Cifrado opcional para datos sensibles
- **Almacenamiento externo**: Sincronizar con ubicaciones remotas o almacenamiento en la nube

### Proceso de recuperación
1. **Recuperación del sistema**: Reinstalar el sistema base de YunoHost
2. **Restaurar desde respaldo**: Usar archivos de respaldo para restaurar
3. **Configuración de aplicaciones**: Reinstalar y reconfigurar las aplicaciones
4. **Verificación de datos**: Confirmar que todos los datos han sido restaurados

## Mantenimiento y actualizaciones

### Mantenimiento regular
- **Actualizar el sistema**: Actualizaciones mensuales de seguridad y funciones
- **Monitorear registros**: Revisar los registros de aplicaciones y del sistema
- **Verificación de respaldos**: Probar la restauración de respaldos periódicamente
- **Auditorías de seguridad**: Revisar el acceso y los permisos de los usuarios

### Solución de problemas comunes
- **Fallos de aplicaciones**: Revisar los registros y reiniciar los servicios
- **Problemas de rendimiento**: Monitorear el uso de recursos
- **Problemas de SSL**: Renovar certificados o revisar la configuración DNS
- **Acceso de usuarios**: Verificar permisos y configuración de dominio

## Soporte comunitario

### Recursos oficiales
- **Documentación**: https://yunohost.org/en/doc
- **Foro**: Foro de soporte comunitario activo
- **Chat**: Canales de chat IRC y Mattermost
- **Solicitudes de paquetes**: Enviar solicitudes para nuevas aplicaciones

### Contribuciones de la comunidad
- **Empaquetado de aplicaciones**: Ayudar a empaquetar aplicaciones para YunoHost
- **Traducciones**: Contribuir con traducciones a tu idioma
- **Informes de errores**: Reportar problemas en GitHub
- **Documentación**: Mejorar la documentación oficial

## Mejores prácticas de seguridad

### Refuerzo de la seguridad de tu servidor
1. **Cambiar contraseñas predeterminadas**: Actualizar todas las credenciales predeterminadas
2. **Desactivar inicio de sesión de root**: Restringir el acceso SSH por seguridad
3. **Configurar firewall**: Limitar los puertos expuestos a los esenciales
4. **Actualizaciones regulares**: Mantener el sistema y las aplicaciones actualizados
5. **Monitorear el acceso**: Revisar los registros en busca de actividad sospechosa

### Protección de datos
- **Cifrar datos sensibles**: Usar cifrado para información confidencial
- **Respaldos seguros**: Proteger los archivos de respaldo con cifrado robusto
- **Control de acceso**: Implementar el principio de mínimo privilegio
- **Auditorías regulares**: Revisar y actualizar las configuraciones de seguridad

## Conclusión

YunoHost proporciona una base excelente para servidores comunitarios, ofreciendo un equilibrio entre simplicidad y funcionalidad. Su extenso catálogo de aplicaciones, sus actualizaciones automáticas y sus funciones de seguridad lo hacen ideal para implementar y mantener servicios comunitarios con una mínima carga técnica.

En cuanto a las recomendaciones de hardware, YunoHost funciona bien en todas las plataformas de Community Box, con los modelos de Raspberry Pi adecuados para implementaciones más pequeñas y los sistemas Intel NUC para entornos más grandes y multiusuario.

---

*Referencias: Documentación oficial de YunoHost y recursos de la comunidad[11][14]*