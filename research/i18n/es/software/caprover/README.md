---
title: CapRover
sourcePath: software/caprover/README.md
sourceHash: b73d7563b0db795c
translatedBy: glm-4.6
---

# Descripción general de CapRover para servidores comunitarios

## Introducción

CapRover es una PaaS (Plataforma como Servicio) gratuita y de código abierto que simplifica el despliegue de aplicaciones contenedorizadas en tu propio servidor. Proporciona una interfaz fácil de usar para gestionar contenedores Docker, despliegues y aplicaciones web con una configuración mínima requerida[52][55].

## Características principales

### Despliegue de aplicaciones
- **Aplicaciones de un clic**: Aplicaciones preconfiguradas que incluyen Node.js, Python, PHP y más
- **Integración con Git**: Despliegues automáticos desde repositorios Git
- **Dockerfiles personalizados**: Soporte para configuraciones de contenedores personalizadas
- **Compilaciones multi-etapa**: Construcción y optimización eficiente de imágenes de contenedores

### Balanceo de carga y escalado
- **Balanceador de carga integrado**: Balanceo de carga HTTP basado en Nginx
- **SSL automático**: Gestión de certificados de Let's Encrypt
- **Subdominios comodín**: Aprovisionamiento automático de subdominios
- **Verificaciones de estado**: Monitorea la salud y disponibilidad de las aplicaciones

### Soporte de bases de datos
- **PostgreSQL**: Despliegue de bases de datos con un clic
- **MySQL/MariaDB**: Soporte para bases de datos relacionales
- **MongoDB**: Opción de base de datos NoSQL
- **Redis**: Almacenamiento en caché y de sesiones

### Monitoreo y gestión
- **Panel de control web**: Panel de control intuitivo
- **Acceso a consola**: Acceso directo a la terminal de los contenedores
- **Gestión de registros**: Visualiza y busca registros de aplicaciones
- **Métricas**: Monitorea el uso de recursos y el rendimiento

## Compatibilidad de hardware

### Soporte para Raspberry Pi
- **Arquitectura ARM**: Soporte nativo para ARM64 y ARMv7
- **Raspberry Pi 4**: Recomendada para despliegues en producción
- **Raspberry Pi 5**: Excelente rendimiento con Docker
- **RAM mínima**: 2GB (se recomienda 4GB+ para múltiples aplicaciones)
- **Almacenamiento**: Se recomienda encarecidamente un SSD USB 3.0

### Compatibilidad con Intel NUC
- **Soporte x86_64**: Compatibilidad total con hardware Intel
- **Rendimiento excelente**: Puede manejar múltiples aplicaciones pesadas
- **Multiusuario**: Soporta despliegues concurrentes para diferentes usuarios
- **Especificaciones recomendadas**: 4GB+ de RAM, almacenamiento SSD

### Soporte para ZimaBoard
- **Soporte ARM64**: Compatibilidad nativa
- **Flexibilidad de almacenamiento**: Múltiples configuraciones de unidades
- **Intensivo en red**: Adecuada para aplicaciones que requieren rendimiento de red
- **Densidad de contenedores**: Puede ejecutar múltiples contenedores ligeros

## Opciones de instalación

### Instalación con Docker (recomendada)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install CapRover
docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

### Instalación en la nube
- **DigitalOcean**: Instalación con un clic a través del marketplace
- **AWS/GCP/Azure**: Despliega utilizando imágenes de proveedores de nube
- **Proveedores de VPS**: Funciona en cualquier VPS con soporte para Docker

## Métodos de despliegue

### Aplicaciones de un clic
CapRover proporciona aplicaciones preconfiguradas:

**Herramientas de desarrollo**
- **Node-RED**: Automatización de IoT y flujos de trabajo
- **Grafana**: Monitoreo y visualización
- **Netdata**: Monitoreo del sistema en tiempo real

**Gestión de contenido**
- **Ghost**: Plataforma de publicación
- **Strapi**: CMS headless
- **Directus**: Plataforma de datos

**Comunicación**
- **Rocket.Chat**: Comunicación de equipos
- **Mattermost**: Alternativa a Slack
- **Matrix**: Mensajería descentralizada

### Despliegue basado en Git
1. **Conecta el repositorio**: Vincula GitHub, GitLab o Bitbucket
2. **Configura la compilación**: Define los comandos y ajustes de compilación
3. **Despliegues automáticos**: Haz push para desplegar nuevas versiones
4. **Soporte de reversión**: Revierte fácilmente a versiones anteriores

### Despliegue con Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

## Configuración de servidores comunitarios

### Configuración básica
1. **Instala CapRover**: Despliega la plataforma base en tu hardware
2. **Configura el dominio**: Establece el dominio y los certificados SSL
3. **Instala la base de datos**: Despliega PostgreSQL o MySQL
4. **Despliega las aplicaciones**: Instala los servicios comunitarios
5. **Configura las copias de seguridad**: Establece una estrategia de respaldo automatizado

### Aplicaciones recomendadas para comunidades
- **Compartición de archivos**: Syncthing, Nextcloud
- **Automatización**: Node-RED para flujos de trabajo de IoT
- **Monitoreo**: Grafana para métricas del sistema
- **Desarrollo**: GitLab para repositorios de código
- **Comunicación**: Rocket.Chat para el chat de la comunidad

### Configuración multi-inquilino
- **Estrategia de subdominios**: apps.community.org, services.community.org
- **Gestión de usuarios**: Crea aplicaciones separadas para diferentes grupos de usuarios
- **Asignación de recursos**: Limita CPU/memoria por aplicación
- **Control de acceso**: Gestiona quién puede desplegar qué

## Optimización del rendimiento

### Optimización de contenedores
- **Compilaciones multi-etapa**: Reduce el tamaño final de la imagen
- **Imágenes Alpine**: Utiliza imágenes base ligeras cuando sea posible
- **Límites de recursos**: Configura restricciones de CPU y memoria
- **Agrupación de conexiones**: Optimiza las conexiones a la base de datos

### Consideraciones de hardware
- **Raspberry Pi**: Limita las aplicaciones concurrentes, usa almacenamiento SSD
- **Intel NUC**: Puede manejar más aplicaciones pesadas concurrentes
- **Red**: Usa Ethernet Gigabit para el mejor rendimiento
- **Almacenamiento**: Se requiere SSD para cargas de trabajo en producción

### Estrategias de caché
- **Redis**: Implementa Redis para el almacenamiento de sesiones y caché
- **Caché de Nginx**: Habilita el almacenamiento en caché HTTP en el balanceador de carga
- **Integración con CDN**: Usa Cloudflare o similar para recursos estáticos
- **Optimización de la base de datos**: Configura el almacenamiento en caché de consultas de la base de datos

## Copias de seguridad y recuperación ante desastres

### Estrategias de copia de seguridad
- **Panel Captain**: Funcionalidad de copia de seguridad integrada
- **Archivo tar**: Crea copias de seguridad completas del sistema
- **Integración con S3**: Almacena copias de seguridad en almacenamiento de objetos
- **Programación automatizada**: Configura intervalos regulares de copia de seguridad

### Proceso de recuperación
1. **Instalación nueva**: Despliega una nueva instancia de CapRover
2. **Restaura la copia de seguridad**: Sube y restaura desde la copia de seguridad
3. **Verifica los servicios**: Confirma que todas las aplicaciones estén en ejecución
4. **Actualiza el DNS**: Apunta los dominios al nuevo servidor si es necesario

## Consideraciones de seguridad

### Seguridad de contenedores
- **Análisis de imágenes**: Escanea las imágenes de contenedores en busca de vulnerabilidades
- **Permisos de usuario**: Ejecuta los contenedores como usuarios no root
- **Aislamiento de red**: Usa redes de Docker para la segmentación
- **Gestión de secretos**: Usa la gestión de secretos integrada

### Endurecimiento del servidor
- **Firewall**: Configura las reglas del firewall del servidor
- **Claves SSH**: Usa solo autenticación basada en claves
- **Actualizaciones regulares**: Mantén el sistema host actualizado
- **SSL/TLS**: Asegúrate de que todo el tráfico use HTTPS

### Control de acceso
- **Acceso de administrador**: Limita el acceso al panel de CapRover
- **Gestión de usuarios**: Crea cuentas dedicadas por usuario
- **Claves de API**: Protege el acceso a la API con rotación
- **Registros de auditoría**: Revisa los registros de acceso regularmente

## Mantenimiento y monitoreo

### Mantenimiento regular
- **Actualiza CapRover**: Mantén la plataforma actualizada a la última versión
- **Actualizaciones de contenedores**: Actualiza las imágenes base y las dependencias
- **Espacio en disco**: Monitorea y limpia imágenes/volúmenes sin usar
- **Monitoreo del rendimiento**: Sigue las tendencias de uso de recursos

### Configuración del monitoreo
- **Integración con Grafana**: Despliega Grafana para un monitoreo avanzado
- **Verificaciones de estado**: Configura los endpoints de salud de las aplicaciones
- **Alertas**: Establece notificaciones para problemas críticos
- **Agregación de registros**: Centraliza los registros de todos los contenedores

### Solución de problemas comunes
- **Fallos de compilación**: Revisa los registros de compilación y las dependencias
- **Fallos de aplicaciones**: Revisa los registros de los contenedores
- **Degradación del rendimiento**: Monitorea el uso de recursos
- **Problemas con certificados SSL**: Renueva o revisa la configuración del DNS

## Recursos de la comunidad

### Documentación oficial
- **Sitio web**: https://caprover.com/
- **Documentación**: Guías y tutoriales completos
- **GitHub**: Código fuente y seguimiento de problemas
- **Discord**: Soporte activo mediante chat de la comunidad

### Ejemplos de despliegue
- **Aplicaciones de un clic**: Aplicaciones aportadas por la comunidad
- **Plantillas**: Comparte configuraciones de despliegue
- **CI/CD**: Ejemplos de GitHub Actions y GitLab CI
- **Docker Compose**: Configuraciones multi-contenedor
## Casos de uso para servidores comunitarios

### Comunidades de desarrollo
- **Alojamiento de código**: Repositorios Git con CI/CD
- **Entornos de pruebas**: Contenedores de pruebas efímeros
- **Documentación**: Despliegue de sitios de documentación
- **Gestión de proyectos**: Herramientas ágiles y rastreadores de incidencias

### Proveedores de servicios
- **Aplicaciones multiinquilino**: Sirven a múltiples comunidades
- **Pasarelas de API**: Gestión centralizada de API
- **Microservicios**: Dividir monolitos en servicios
- **Entornos de staging**: Probar antes del despliegue en producción

### Instituciones educativas
- **Proyectos estudiantiles**: Despliegue de aplicaciones estudiantiles
- **Plataformas de cursos**: Ejecutar sistemas de gestión del aprendizaje
- **Herramientas de investigación**: Alojar aplicaciones de investigación
- **Colaboración**: Plataformas para proyectos de equipo

## Conclusión

CapRover proporciona un excelente equilibrio entre simplicidad y potencia para despliegues de servidores comunitarios. Su arquitectura basada en Docker, el SSL automático y las aplicaciones de un solo clic lo hacen ideal para desplegar y gestionar múltiples servicios en el hardware de Community Box.

Para recomendaciones de hardware, los modelos Raspberry Pi funcionan bien para despliegues de una sola aplicación o de múltiples aplicaciones ligeras, mientras que los sistemas Intel NUC destacan en el manejo de múltiples aplicaciones concurrentes y cargas de trabajo más pesadas.

La escalabilidad de la plataforma permite comenzar pequeño y crecer a medida que evolucionan las necesidades de la comunidad, lo que la convierte en una opción sólida a largo plazo para la infraestructura comunitaria.

---

*Referencias: Documentación oficial de CapRover y recursos de la comunidad[52][55]*