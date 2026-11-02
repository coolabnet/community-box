---
title: Applications catalog evidence
---

# Applications catalog evidence

This page lists the software in `app/src/data/applications/applications.json` and the sources behind each entry. The categories are DRAFT. They wait for LocNet agreement ([issue #57](https://github.com/coolabnet/community-box/issues/57)).

- **recommended:** the repo has a deployment guide in `services/` for this app, and the app is maintained.
- **candidate:** the app has less evidence. Show it with a "less evidence" label.

A number appears only when an official document states it. "documented" means the source states the number. "estimated" means we reasoned it from a source. "unknown" means no source, so no number is given. An empty architecture list means unknown.

## Entries

| id | categories | status | RAM | arch | platforms | license | evidence |
|---|---|---|---|---|---|---|---|
| nextcloud | mediaStorage, officeCollab | recommended | 512 MB (estimated) | amd64, arm64 | docker, yunohost | AGPL-3.0 | [requirements](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html), [YunoHost](https://github.com/YunoHost-Apps/nextcloud_ynh), [license](https://github.com/nextcloud/server/blob/master/COPYING), [image](https://github.com/docker-library/official-images/blob/master/library/nextcloud) |
| jellyfin | mediaStorage | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-2.0 | [install docs](https://jellyfin.org/docs/general/installation/), [YunoHost](https://github.com/YunoHost-Apps/jellyfin_ynh), [license](https://github.com/jellyfin/jellyfin/blob/master/LICENSE), [image](https://hub.docker.com/r/jellyfin/jellyfin) |
| moodle | education | recommended | unknown | unknown | yunohost | GPL-3.0 | [repo](https://github.com/moodle/moodle), [YunoHost](https://github.com/YunoHost-Apps/moodle_ynh), [license](https://github.com/moodle/moodle/blob/main/COPYING.txt) |
| wordpress | localMedia | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-2.0-or-later | [requirements](https://wordpress.org/about/requirements/), [YunoHost](https://github.com/YunoHost-Apps/wordpress_ynh), [license](https://github.com/WordPress/WordPress/blob/master/license.txt), [image](https://github.com/docker-library/official-images/blob/master/library/wordpress) |
| kiwix | education, languageCulture | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-3.0 | [site](https://kiwix.org), [YunoHost](https://github.com/YunoHost-Apps/kiwix_ynh), [license](https://github.com/kiwix/kiwix-tools/blob/main/COPYING), [image](https://github.com/kiwix/kiwix-tools/pkgs/container/kiwix-serve) |
| ubuntumm | networkManagement | candidate | unknown | unknown | none listed | unknown | [catalog source](https://github.com/coolabnet/community-box/blob/main/app/src/utils/recommendations.ts) |
| kolibri | education | recommended | unknown | amd64, arm64 | docker, native | MIT | [repo](https://github.com/learningequality/kolibri), [license](https://github.com/learningequality/kolibri/blob/develop/LICENSE), [image](https://hub.docker.com/r/learningequality/kolibri), [guide](https://github.com/coolabnet/community-box/blob/main/services/education/README.md) |
| syncthing | mediaStorage | recommended | unknown | amd64, arm64 | docker, yunohost | MPL-2.0 | [license](https://github.com/syncthing/syncthing/blob/main/LICENSE), [releases](https://github.com/syncthing/syncthing/releases/latest), [image](https://hub.docker.com/r/syncthing/syncthing), [YunoHost](https://github.com/YunoHost-Apps/syncthing_ynh), [guide](https://github.com/coolabnet/community-box/blob/main/services/files/README.md) |
| azuracast | localMedia | recommended | 2048 MB RAM, 20 GB disk (documented) | amd64, arm64 | docker, yunohost | AGPL-3.0 | [requirements](https://www.azuracast.com/docs/getting-started/requirements/), [license](https://github.com/AzuraCast/AzuraCast/blob/main/LICENSE.md), [YunoHost](https://github.com/YunoHost-Apps/azuracast_ynh), [guide](https://github.com/coolabnet/community-box/blob/main/services/radio/README.md) |
| pihole | networkManagement | recommended | 512 MB RAM, 2 GB disk (documented) | amd64, arm64 | docker, yunohost, native | EUPL-1.2 | [prerequisites](https://docs.pi-hole.net/main/prerequisites/), [license](https://github.com/pi-hole/pi-hole/blob/master/LICENSE), [image](https://hub.docker.com/r/pihole/pihole), [YunoHost](https://github.com/YunoHost-Apps/pihole_ynh), [guide](https://github.com/coolabnet/community-box/blob/main/services/filtering/README.md) |
| adguardhome | networkManagement | recommended | unknown | amd64, arm64 | docker, yunohost, native | GPL-3.0 | [license](https://github.com/AdguardTeam/AdGuardHome/blob/master/LICENSE.txt), [image](https://hub.docker.com/r/adguard/adguardhome), [getting started](https://github.com/AdguardTeam/AdGuardHome/wiki/Getting-Started), [YunoHost](https://github.com/YunoHost-Apps/adguardhome_ynh), [guide](https://github.com/coolabnet/community-box/blob/main/services/filtering/README.md) |
| speedtest-tracker | networkManagement | candidate | unknown | amd64, arm64 | docker | MIT | [README](https://github.com/alexjustesen/speedtest-tracker/blob/1.x/README.md), [license](https://github.com/alexjustesen/speedtest-tracker/blob/1.x/LICENSE.md), [image](https://hub.docker.com/r/linuxserver/speedtest-tracker), [guide](https://github.com/coolabnet/community-box/blob/main/services/monitoring/README.md) |
| chatmail-relay | communication | candidate | 1024 MB RAM, 10 GB disk (documented) | unknown | native | MIT | [setup guide](https://chatmail.at/doc/relay/getting_started.html), [license](https://github.com/chatmail/relay/blob/main/LICENSE), [research](https://github.com/coolabnet/community-box/blob/main/research/guides/local-messaging-deltachat.md) |
| whisper-cpp | languageCulture | candidate | 852 MB RAM (documented, small model) | amd64, arm64 | docker, native | MIT | [README](https://github.com/ggml-org/whisper.cpp/blob/master/README.md), [license](https://github.com/ggml-org/whisper.cpp/blob/master/LICENSE), [server example](https://github.com/ggml-org/whisper.cpp/tree/master/examples/server), [research](https://github.com/coolabnet/community-box/blob/main/research/guides/offline-transcription-whisper.md) |
| comapeo-cloud | territoryMapping | candidate | unknown | amd64 | docker | MIT | [README](https://github.com/digidem/comapeo-cloud/blob/main/README.md), [package.json](https://github.com/digidem/comapeo-cloud/blob/main/package.json), [image](https://hub.docker.com/r/communityfirst/comapeo-cloud) |

Checked on 2026-11-02.

## Notes on specific numbers

- **nextcloud, 512 MB (estimated).** The [requirements page](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html) says Nextcloud needs at least 128 MB of RAM per process and recommends at least 512 MB per process. We use the recommended figure for one process. The page does not give a total for a whole server.
- **whisper-cpp, 852 MB.** The [README](https://github.com/ggml-org/whisper.cpp/blob/master/README.md) lists about 852 MB of memory for the `small` model. The `tiny` model needs about 273 MB. Larger models need more. The figure depends on the model you choose.
- **chatmail-relay, 1 GB RAM and 10 GB disk.** The [setup guide](https://chatmail.at/doc/relay/getting_started.html) says "1GB RAM, one CPU, and perhaps 10GB storage for a few thousand active" addresses. The guide hedges the storage figure with "perhaps".
- **azuracast and pihole.** These are the minimum figures in the official requirements. AzuraCast also gives recommended figures of 4 GB RAM, 4 CPU cores and 40 GB disk for a few stations.

## Choices worth knowing

- **FileBrowser is not in the catalog.** `services/files/` uses it, but upstream archived it on 2026-09-01. The [README](https://github.com/filebrowser/filebrowser/blob/master/README.md) says there will be no more releases or security fixes. We do not list unmaintained software.
- **OONI Probe is not in the catalog.** The [repo guide](https://github.com/coolabnet/community-box/blob/main/research/guides/ooni-network-testing.md) says it runs on members' own devices and is not a server service.
- **Grafana is not in the catalog.** `services/monitoring/` mentions it only as an optional add-on to Speedtest Tracker.
- **Speedtest Tracker is a candidate.** The repo compose file uses the image `henrywhitaker3/speedtest-tracker`. Docker Hub shows its latest tag was pushed in 2021. The project README says the image is now built by LinuxServer.io (`linuxserver/speedtest-tracker`).
- **CoMapeo Cloud.** The repo has no LICENSE file. The license comes from `package.json` (`MIT`). The Docker Hub `latest` tag lists only amd64.

## Open Questions

- Offline and LAN behavior is unknown for most new entries. Only Kolibri has a source ([upstream README](https://github.com/learningequality/kolibri/blob/develop/README.md): offline-first). Syncthing announces itself on the local network ([discovery spec](https://docs.syncthing.net/specs/localdisco-v4.html)), so LAN sync likely works without Internet (inferred).
- UI languages are empty for all new entries. No source gives a verified language list.
- Maintenance level is "unknown" for all new entries. We did not rate it from commit activity.
- Resource numbers are missing for Kolibri, Syncthing, AdGuard Home, Speedtest Tracker and CoMapeo Cloud. We found no official figure.
- The chatmail relay architecture is unknown. The setup guide names Debian 12 and does not name a CPU architecture. Whether a relay works with no Internet is also unknown, as the [Delta Chat guide](https://github.com/coolabnet/community-box/blob/main/research/guides/local-messaging-deltachat.md) notes.
- Pi-hole's `LICENSE` file applies EUPL-1.2 to the whole project with listed exceptions (inferred to be bundled third-party parts). We did not read the exceptions list.
- Whether the Docker Hub image `communityfirst/comapeo-cloud` is current with the GitHub repo is unknown. The repo was updated after the image tag (inferred from push dates).
- Platform entries other than YunoHost and Docker (`native`) rest on the project install docs and were not tested.
- Which of these apps CoMapeo, Kolibri or Delta Chat communities in the field actually run is not yet known. No field reports are cited.
