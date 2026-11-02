---
title: Evidencia del catálogo de aplicaciones
sourcePath: software/applications-catalog.md
sourceHash: 9f44083ca81aed60
translatedBy: glm-4.6
---

# Evidencia del catálogo de aplicaciones

Esta página enumera el software en `app/src/data/applications/applications.json` y las fuentes detrás de cada entrada. Las categorías están en BORRADOR. Esperan el acuerdo de LocNet ([issue #57](https://github.com/coolabnet/community-box/issues/57)).

- **recommended** (recomendada): el repo tiene una guía de despliegue en `services/` para esta app, y la app se mantiene.
- **candidate** (candidata): la app tiene menos evidencia. Se muestra con una etiqueta de "menos evidencia".

Un número aparece solo cuando un documento oficial lo indica. "documented" (documentado) significa que la fuente indica el número. "estimated" (estimado) significa que lo dedujimos a partir de una fuente. "unknown" (desconocido) significa que no hay fuente, por lo que no se da ningún número. Una lista de arquitecturas vacía significa desconocido.

## Entradas

| id | categorías | estado | RAM | arch | plataformas | licencia | evidencia |
|---|---|---|---|---|---|---|---|
| nextcloud | mediaStorage, officeCollab | recommended | 512 MB (estimated) | amd64, arm64 | docker, yunohost | AGPL-3.0 | [requisitos](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html), [YunoHost](https://github.com/YunoHost-Apps/nextcloud_ynh), [licencia](https://github.com/nextcloud/server/blob/master/COPYING), [imagen](https://github.com/docker-library/official-images/blob/master/library/nextcloud) |
| jellyfin | mediaStorage | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-2.0 | [documentación de instalación](https://jellyfin.org/docs/general/installation/), [YunoHost](https://github.com/YunoHost-Apps/jellyfin_ynh), [licencia](https://github.com/jellyfin/jellyfin/blob/master/LICENSE), [imagen](https://hub.docker.com/r/jellyfin/jellyfin) |
| moodle | education | recommended | unknown | unknown | yunohost | GPL-3.0 | [repo](https://github.com/moodle/moodle), [YunoHost](https://github.com/YunoHost-Apps/moodle_ynh), [licencia](https://github.com/moodle/moodle/blob/main/COPYING.txt) |
| wordpress | localMedia | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-2.0-or-later | [requisitos](https://wordpress.org/about/requirements/), [YunoHost](https://github.com/YunoHost-Apps/wordpress_ynh), [licencia](https://github.com/WordPress/WordPress/blob/master/license.txt), [imagen](https://github.com/docker-library/official-images/blob/master/library/wordpress) |
| kiwix | education, languageCulture | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-3.0 | [sitio](https://kiwix.org), [YunoHost](https://github.com/YunoHost-Apps/kiwix_ynh), [licencia](https://github.com/kiwix/kiwix-tools/blob/main/COPYING), [imagen](https://github.com/kiwix/kiwix-tools/pkgs/container/kiwix-serve) |
| ubuntumm | networkManagement | candidate | unknown | unknown | ninguna listada | unknown | [fuente del catálogo](https://github.com/coolabnet/community-box/blob/main/app/src/utils/recommendations.ts) |
| kolibri | education | recommended | unknown | amd64, arm64 | docker, native | MIT | [repo](https://github.com/learningequality/kolibri), [licencia](https://github.com/learningequality/kolibri/blob/develop/LICENSE), [imagen](https://hub.docker.com/r/learningequality/kolibri), [guía](https://github.com/coolabnet/community-box/blob/main/services/education/README.md) |
| syncthing | mediaStorage | recommended | unknown | amd64, arm64 | docker, yunohost | MPL-2.0 | [licencia](https://github.com/syncthing/syncthing/blob/main/LICENSE), [releases](https://github.com/syncthing/syncthing/releases/latest), [imagen](https://hub.docker.com/r/syncthing/syncthing), [YunoHost](https://github.com/YunoHost-Apps/syncthing_ynh), [guía](https://github.com/coolabnet/community-box/blob/main/services/files/README.md) |
| azuracast | localMedia | recommended | 2048 MB de RAM, 20 GB de disco (documented) | amd64, arm64 | docker, yunohost | AGPL-3.0 | [requisitos](https://www.azuracast.com/docs/getting-started/requirements/), [licencia](https://github.com/AzuraCast/AzuraCast/blob/main/LICENSE.md), [YunoHost](https://github.com/YunoHost-Apps/azuracast_ynh), [guía](https://github.com/coolabnet/community-box/blob/main/services/radio/README.md) |
| pihole | networkManagement | recommended | 512 MB de RAM, 2 GB de disco (documented) | amd64, arm64 | docker, yunohost, native | EUPL-1.2 | [prerrequisitos](https://docs.pi-hole.net/main/prerequisites/), [licencia](https://github.com/pi-hole/pi-hole/blob/master/LICENSE), [imagen](https://hub.docker.com/r/pihole/pihole), [YunoHost](https://github.com/YunoHost-Apps/pihole_ynh), [guía](https://github.com/coolabnet/community-box/blob/main/services/filtering/README.md) |
| adguardhome | networkManagement | recommended | unknown | amd64, arm64 | docker, yunohost, native | GPL-3.0 | [licencia](https://github.com/AdguardTeam/AdGuardHome/blob/master/LICENSE.txt), [imagen](https://hub.docker.com/r/adguard/adguardhome), [introducción](https://github.com/AdguardTeam/AdGuardHome/wiki/Getting-Started), [YunoHost](https://github.com/YunoHost-Apps/adguardhome_ynh), [guía](https://github.com/coolabnet/community-box/blob/main/services/filtering/README.md) |
| speedtest-tracker | networkManagement | candidate | unknown | amd64, arm64 | docker | MIT | [README](https://github.com/alexjustesen/speedtest-tracker/blob/1.x/README.md), [licencia](https://github.com/alexjustesen/speedtest-tracker/blob/1.x/LICENSE.md), [imagen](https://hub.docker.com/r/linuxserver/speedtest-tracker), [guía](https://github.com/coolabnet/community-box/blob/main/services/monitoring/README.md) |
| chatmail-relay | communication | candidate | 1024 MB de RAM, 10 GB de disco (documented) | unknown | native | MIT | [guía de configuración](https://chatmail.at/doc/relay/getting_started.html), [licencia](https://github.com/chatmail/relay/blob/main/LICENSE), [investigación](https://github.com/coolabnet/community-box/blob/main/research/guides/local-messaging-deltachat.md) |
| whisper-cpp | languageCulture | candidate | 852 MB de RAM (documented, modelo pequeño) | amd64, arm64 | docker, native | MIT | [README](https://github.com/ggml-org/whisper.cpp/blob/master/README.md), [licencia](https://github.com/ggml-org/whisper.cpp/blob/master/LICENSE), [ejemplo de servidor](https://github.com/ggml-org/whisper.cpp/tree/master/examples/server), [investigación](https://github.com/coolabnet/community-box/blob/main/research/guides/offline-transcription-whisper.md) |
| comapeo-cloud | territoryMapping | candidate | unknown | amd64 | docker | MIT | [README](https://github.com/digidem/comapeo-cloud/blob/main/README.md), [package.json](https://github.com/digidem/comapeo-cloud/blob/main/package.json), [imagen](https://hub.docker.com/r/communityfirst/comapeo-cloud) |

Verificado el 2026-11-02.

## Notas sobre números específicos

- **nextcloud, 512 MB (estimated).** La [página de requisitos](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html) dice que Nextcloud necesita al menos 128 MB de RAM por proceso y recomienda al menos 512 MB por proceso. Usamos la cifra recomendada para un proceso. La página no da un total para un servidor completo.
- **whisper-cpp, 852 MB.** El [README](https://github.com/ggml-org/whisper.cpp/blob/master/README.md) enumera alrededor de 852 MB de memoria para el modelo `small`. El modelo `tiny` necesita alrededor de 273 MB. Los modelos más grandes necesitan más. La cifra depende del modelo que elijas.
- **chatmail-relay, 1 GB de RAM y 10 GB de disco.** La [guía de configuración](https://chatmail.at/doc/relay/getting_started.html) dice "1GB RAM, one CPU, and perhaps 10GB storage for a few thousand active" (1 GB de RAM, una CPU, y quizás 10 GB de almacenamiento para unos pocos miles de direcciones activas). La guía matiza la cifra de almacenamiento con "perhaps" (quizás).
- **azuracast y pihole.** Estas son las cifras mínimas de los requisitos oficiales. AzuraCast también da cifras recomendadas de 4 GB de RAM, 4 núcleos de CPU y 40 GB de disco para unas pocas estaciones.
## Opciones que vale la pena conocer

- **FileBrowser no está en el catálogo.** `services/files/` lo usa, pero upstream lo archivó el 2026-09-01. El [README](https://github.com/filebrowser/filebrowser/blob/master/README.md) dice que no habrá más versiones ni correcciones de seguridad. No listamos software sin mantenimiento.
- **OONI Probe no está en el catálogo.** La [guía del repositorio](https://github.com/coolabnet/community-box/blob/main/research/guides/ooni-network-testing.md) dice que se ejecuta en los dispositivos propios de los integrantes y no es un servicio de servidor.
- **Grafana no está en el catálogo.** `services/monitoring/` lo menciona solo como un complemento opcional de Speedtest Tracker.
- **Speedtest Tracker es un candidato.** El archivo compose del repositorio usa la imagen `henrywhitaker3/speedtest-tracker`. Docker Hub muestra que su etiqueta más reciente fue publicada en 2021. El README del proyecto dice que la imagen ahora la construye LinuxServer.io (`linuxserver/speedtest-tracker`).
- **CoMapeo Cloud.** El repositorio no tiene archivo LICENSE. La licencia proviene de `package.json` (`MIT`). La etiqueta `latest` de Docker Hub lista solo amd64.

## Preguntas abiertas

- El comportamiento sin conexión y en LAN es desconocido para la mayoría de las entradas nuevas. Solo Kolibri tiene una fuente ([README upstream](https://github.com/learningequality/kolibri/blob/develop/README.md): offline-first). Syncthing se anuncia en la red local ([especificación de descubrimiento](https://docs.syncthing.net/specs/localdisco-v4.html)), por lo que la sincronización en LAN probablemente funcione sin Internet (inferido).
- Los idiomas de la interfaz están vacíos para todas las entradas nuevas. Ninguna fuente ofrece una lista de idiomas verificada.
- El nivel de mantenimiento es "desconocido" para todas las entradas nuevas. No lo calificamos a partir de la actividad de commits.
- Faltan las cifras de recursos para Kolibri, Syncthing, AdGuard Home, Speedtest Tracker y CoMapeo Cloud. No encontramos ninguna cifra oficial.
- La arquitectura del relay de chatmail es desconocida. La guía de configuración nombra Debian 12 y no nombra una arquitectura de CPU. Si un relay funciona sin Internet también es desconocido, como señala la [guía de Delta Chat](https://github.com/coolabnet/community-box/blob/main/research/guides/local-messaging-deltachat.md).
- El archivo `LICENSE` de Pi-hole aplica EUPL-1.2 a todo el proyecto con excepciones listadas (se infiere que son componentes de terceros incluidos). No leímos la lista de excepciones.
- Si la imagen de Docker Hub `communityfirst/comapeo-cloud` está actualizada con respecto al repositorio de GitHub es desconocido. El repositorio se actualizó después de la etiqueta de la imagen (inferido de las fechas de publicación).
- Las entradas de plataforma distintas de YunoHost y Docker (`native`) se basan en la documentación de instalación de los proyectos y no fueron probadas.
- Cuáles de estas aplicaciones ejecutan realmente en el campo las comunidades de CoMapeo, Kolibri o Delta Chat aún no se sabe. No se citan informes de campo.