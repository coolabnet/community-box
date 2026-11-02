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
| filebrowser-quantum | mediaStorage | candidate | 512 MB (documented) | amd64, arm64 | docker, native | Apache-2.0 | [README](https://github.com/gtsteffaniak/filebrowser/blob/main/README.md), [release v2.0.2-stable](https://github.com/gtsteffaniak/filebrowser/releases/tag/v2.0.2-stable), [license](https://github.com/gtsteffaniak/filebrowser/blob/main/LICENSE), [image](https://hub.docker.com/r/gtstef/filebrowser), [guide](https://github.com/coolabnet/community-box/blob/main/services/files/README.md) |
| azuracast | localMedia | recommended | 2048 MB RAM, 20 GB disk (documented) | amd64, arm64 | docker, yunohost | AGPL-3.0 | [requirements](https://www.azuracast.com/docs/getting-started/requirements/), [license](https://github.com/AzuraCast/AzuraCast/blob/main/LICENSE.md), [YunoHost](https://github.com/YunoHost-Apps/azuracast_ynh), [guide](https://github.com/coolabnet/community-box/blob/main/services/radio/README.md) |
| pihole | networkManagement | recommended | 512 MB RAM, 2 GB disk (documented) | amd64, arm64 | docker, yunohost, native | EUPL-1.2 | [prerequisites](https://docs.pi-hole.net/main/prerequisites/), [license](https://github.com/pi-hole/pi-hole/blob/master/LICENSE), [image](https://hub.docker.com/r/pihole/pihole), [YunoHost](https://github.com/YunoHost-Apps/pihole_ynh), [guide](https://github.com/coolabnet/community-box/blob/main/services/filtering/README.md) |
| adguardhome | networkManagement | recommended | unknown | amd64, arm64 | docker, yunohost, native | GPL-3.0 | [license](https://github.com/AdguardTeam/AdGuardHome/blob/master/LICENSE.txt), [image](https://hub.docker.com/r/adguard/adguardhome), [getting started](https://github.com/AdguardTeam/AdGuardHome/wiki/Getting-Started), [YunoHost](https://github.com/YunoHost-Apps/adguardhome_ynh), [guide](https://github.com/coolabnet/community-box/blob/main/services/filtering/README.md) |
| speedtest-tracker | networkManagement | candidate | unknown | amd64, arm64 | docker | MIT | [README](https://github.com/alexjustesen/speedtest-tracker/blob/1.x/README.md), [license](https://github.com/alexjustesen/speedtest-tracker/blob/1.x/LICENSE.md), [image](https://hub.docker.com/r/linuxserver/speedtest-tracker), [guide](https://github.com/coolabnet/community-box/blob/main/services/monitoring/README.md) |
| chatmail-relay | communication | candidate | 1024 MB RAM, 10 GB disk (documented) | unknown | native | MIT | [setup guide](https://chatmail.at/doc/relay/getting_started.html), [license](https://github.com/chatmail/relay/blob/main/LICENSE), [research](https://github.com/coolabnet/community-box/blob/main/research/guides/local-messaging-deltachat.md) |
| whisper-cpp | languageCulture | candidate | 852 MB RAM (documented, small model) | amd64, arm64 | docker, native | MIT | [README](https://github.com/ggml-org/whisper.cpp/blob/master/README.md), [license](https://github.com/ggml-org/whisper.cpp/blob/master/LICENSE), [server example](https://github.com/ggml-org/whisper.cpp/tree/master/examples/server), [research](https://github.com/coolabnet/community-box/blob/main/research/guides/offline-transcription-whisper.md) |
| comapeo-local-server | territoryMapping | candidate | unknown | unknown | native | AGPL-3.0 | [README](https://github.com/digidem/comapeo-local-server/blob/main/README.md), [repo](https://github.com/digidem/comapeo-local-server) |

Checked on 2026-11-02.

## Notes on specific numbers

- **nextcloud, 512 MB (estimated).** The [requirements page](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html) says Nextcloud needs at least 128 MB of RAM per process and recommends at least 512 MB per process. We use the recommended figure for one process. The page does not give a total for a whole server.
- **whisper-cpp, 852 MB.** The [README](https://github.com/ggml-org/whisper.cpp/blob/master/README.md) lists about 852 MB of memory for the `small` model. The `tiny` model needs about 273 MB. Larger models need more. The figure depends on the model you choose.
- **chatmail-relay, 1 GB RAM and 10 GB disk.** The [setup guide](https://chatmail.at/doc/relay/getting_started.html) says "1GB RAM, one CPU, and perhaps 10GB storage for a few thousand active" addresses. The guide hedges the storage figure with "perhaps".
- **filebrowser-quantum, 512 MB.** The comparison chart in the [README](https://github.com/gtsteffaniak/filebrowser/blob/main/README.md) lists "Min. Memory Requirements" of 512 MB for Quantum.
- **azuracast and pihole.** These are the minimum figures in the official requirements. AzuraCast also gives recommended figures of 4 GB RAM, 4 CPU cores and 40 GB disk for a few stations.

## Choices worth knowing

- **FileBrowser Quantum replaces FileBrowser.** Upstream archived the original FileBrowser on 2026-09-01. Its [README](https://github.com/filebrowser/filebrowser/blob/master/README.md) says there will be no more releases or security fixes. We list the maintained fork [FileBrowser Quantum](https://github.com/gtsteffaniak/filebrowser) instead. It is a candidate because `services/files/` still deploys the original image.
- **OONI Probe is not in the catalog.** The [repo guide](https://github.com/coolabnet/community-box/blob/main/research/guides/ooni-network-testing.md) says it runs on members' own devices and is not a server service.
- **Grafana is not in the catalog.** `services/monitoring/` mentions it only as an optional add-on to Speedtest Tracker.
- **Speedtest Tracker is a candidate.** The repo compose file uses the image `henrywhitaker3/speedtest-tracker`. Docker Hub shows its latest tag was pushed in 2021. The project README says the image is now built by LinuxServer.io (`linuxserver/speedtest-tracker`).
- **CoMapeo Local Server, not CoMapeo Cloud.** [CoMapeo Cloud](https://github.com/digidem/comapeo-cloud) is meant for a public HTTPS host: its README deploys it on fly.io and reaches it at `https://<your-app-name>.fly.dev`. The CoMapeo team says it needs HTTPS, so it does not fit an offline box. [CoMapeo Local Server](https://github.com/digidem/comapeo-local-server) is a daemon that finds CoMapeo phones on the LAN over mDNS and syncs with them. Its README asks for Linux, Node.js 24 or later and a LAN, and says to run it on the host with `systemd`, not in Docker. The README states AGPL-3.0, but the repo has no LICENSE file.

## Open Questions

- Offline and LAN behavior is unknown for most new entries. Only Kolibri has a source ([upstream README](https://github.com/learningequality/kolibri/blob/develop/README.md): offline-first). Syncthing announces itself on the local network ([discovery spec](https://docs.syncthing.net/specs/localdisco-v4.html)), so LAN sync likely works without Internet (inferred).
- UI languages are empty for all new entries. No source gives a verified language list.
- Maintenance level is "unknown" for all new entries. We did not rate it from commit activity.
- Resource numbers are missing for Kolibri, Syncthing, AdGuard Home, Speedtest Tracker and CoMapeo Local Server. We found no official figure.
- The chatmail relay architecture is unknown. The setup guide names Debian 12 and does not name a CPU architecture. Whether a relay works with no Internet is also unknown, as the [Delta Chat guide](https://github.com/coolabnet/community-box/blob/main/research/guides/local-messaging-deltachat.md) notes.
- Pi-hole's `LICENSE` file applies EUPL-1.2 to the whole project with listed exceptions (inferred to be bundled third-party parts). We did not read the exceptions list.
- Whether CoMapeo Local Server syncs with no Internet at all is not stated in its README (inferred from its LAN-only mDNS design). Its CPU architecture support is also not stated.
- `services/files/` should move from the archived FileBrowser image to FileBrowser Quantum (`gtstef/filebrowser`). Not tested yet.
- Platform entries other than YunoHost and Docker (`native`) rest on the project install docs and were not tested.
- Which of these apps CoMapeo, Kolibri or Delta Chat communities in the field actually run is not yet known. No field reports are cited.
