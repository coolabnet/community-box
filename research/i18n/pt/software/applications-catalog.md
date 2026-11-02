---
title: Evidências do catálogo de aplicativos
sourcePath: software/applications-catalog.md
sourceHash: 9f44083ca81aed60
translatedBy: glm-4.6
---

# Evidência do catálogo de aplicações

Esta página lista o software em `app/src/data/applications/applications.json` e as fontes por trás de cada entrada. As categorias são RASCUNHO. Elas aguardam acordo da LocNet ([issue #57](https://github.com/coolabnet/community-box/issues/57)).

- **recommended (recomendado):** o repositório tem um guia de implantação em `services/` para este app, e o app é mantido.
- **candidate (candidato):** o app tem menos evidência. Mostrá-lo com um rótulo "less evidence" (menos evidência).

Um número aparece apenas quando um documento oficial o declara. "documented" (documentado) significa que a fonte declara o número. "estimated" (estimado) significa que o raciocinamos a partir de uma fonte. "unknown" (desconhecido) significa que não há fonte, portanto nenhum número é dado. Uma lista de arquiteturas vazia significa desconhecido.

## Entradas

| id | categorias | status | RAM | arch | plataformas | licença | evidência |
|---|---|---|---|---|---|---|---|
| nextcloud | mediaStorage, officeCollab | recommended | 512 MB (estimated) | amd64, arm64 | docker, yunohost | AGPL-3.0 | [requisitos](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html), [YunoHost](https://github.com/YunoHost-Apps/nextcloud_ynh), [licença](https://github.com/nextcloud/server/blob/master/COPYING), [imagem](https://github.com/docker-library/official-images/blob/master/library/nextcloud) |
| jellyfin | mediaStorage | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-2.0 | [docs de instalação](https://jellyfin.org/docs/general/installation/), [YunoHost](https://github.com/YunoHost-Apps/jellyfin_ynh), [licença](https://github.com/jellyfin/jellyfin/blob/master/LICENSE), [imagem](https://hub.docker.com/r/jellyfin/jellyfin) |
| moodle | education | recommended | unknown | unknown | yunohost | GPL-3.0 | [repositório](https://github.com/moodle/moodle), [YunoHost](https://github.com/YunoHost-Apps/moodle_ynh), [licença](https://github.com/moodle/moodle/blob/main/COPYING.txt) |
| wordpress | localMedia | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-2.0-or-later | [requisitos](https://wordpress.org/about/requirements/), [YunoHost](https://github.com/YunoHost-Apps/wordpress_ynh), [licença](https://github.com/WordPress/WordPress/blob/master/license.txt), [imagem](https://github.com/docker-library/official-images/blob/master/library/wordpress) |
| kiwix | education, languageCulture | recommended | unknown | amd64, arm64 | docker, yunohost | GPL-3.0 | [site](https://kiwix.org), [YunoHost](https://github.com/YunoHost-Apps/kiwix_ynh), [licença](https://github.com/kiwix/kiwix-tools/blob/main/COPYING), [imagem](https://github.com/kiwix/kiwix-tools/pkgs/container/kiwix-serve) |
| ubuntumm | networkManagement | candidate | unknown | unknown | none listed | unknown | [fonte do catálogo](https://github.com/coolabnet/community-box/blob/main/app/src/utils/recommendations.ts) |
| kolibri | education | recommended | unknown | amd64, arm64 | docker, native | MIT | [repositório](https://github.com/learningequality/kolibri), [licença](https://github.com/learningequality/kolibri/blob/develop/LICENSE), [imagem](https://hub.docker.com/r/learningequality/kolibri), [guia](https://github.com/coolabnet/community-box/blob/main/services/education/README.md) |
| syncthing | mediaStorage | recommended | unknown | amd64, arm64 | docker, yunohost | MPL-2.0 | [licença](https://github.com/syncthing/syncthing/blob/main/LICENSE), [versões](https://github.com/syncthing/syncthing/releases/latest), [imagem](https://hub.docker.com/r/syncthing/syncthing), [YunoHost](https://github.com/YunoHost-Apps/syncthing_ynh), [guia](https://github.com/coolabnet/community-box/blob/main/services/files/README.md) |
| azuracast | localMedia | recommended | 2048 MB RAM, 20 GB disco (documented) | amd64, arm64 | docker, yunohost | AGPL-3.0 | [requisitos](https://www.azuracast.com/docs/getting-started/requirements/), [licença](https://github.com/AzuraCast/AzuraCast/blob/main/LICENSE.md), [YunoHost](https://github.com/YunoHost-Apps/azuracast_ynh), [guia](https://github.com/coolabnet/community-box/blob/main/services/radio/README.md) |
| pihole | networkManagement | recommended | 512 MB RAM, 2 GB disco (documented) | amd64, arm64 | docker, yunohost, native | EUPL-1.2 | [pré-requisitos](https://docs.pi-hole.net/main/prerequisites/), [licença](https://github.com/pi-hole/pi-hole/blob/master/LICENSE), [imagem](https://hub.docker.com/r/pihole/pihole), [YunoHost](https://github.com/YunoHost-Apps/pihole_ynh), [guia](https://github.com/coolabnet/community-box/blob/main/services/filtering/README.md) |
| adguardhome | networkManagement | recommended | unknown | amd64, arm64 | docker, yunohost, native | GPL-3.0 | [licença](https://github.com/AdguardTeam/AdGuardHome/blob/master/LICENSE.txt), [imagem](https://hub.docker.com/r/adguard/adguardhome), [primeiros passos](https://github.com/AdguardTeam/AdGuardHome/wiki/Getting-Started), [YunoHost](https://github.com/YunoHost-Apps/adguardhome_ynh), [guia](https://github.com/coolabnet/community-box/blob/main/services/filtering/README.md) |
| speedtest-tracker | networkManagement | candidate | unknown | amd64, arm64 | docker | MIT | [README](https://github.com/alexjustesen/speedtest-tracker/blob/1.x/README.md), [licença](https://github.com/alexjustesen/speedtest-tracker/blob/1.x/LICENSE.md), [imagem](https://hub.docker.com/r/linuxserver/speedtest-tracker), [guia](https://github.com/coolabnet/community-box/blob/main/services/monitoring/README.md) |
| chatmail-relay | communication | candidate | 1024 MB RAM, 10 GB disco (documented) | unknown | native | MIT | [guia de configuração](https://chatmail.at/doc/relay/getting_started.html), [licença](https://github.com/chatmail/relay/blob/main/LICENSE), [pesquisa](https://github.com/coolabnet/community-box/blob/main/research/guides/local-messaging-deltachat.md) |
| whisper-cpp | languageCulture | candidate | 852 MB RAM (documented, modelo pequeno) | amd64, arm64 | docker, native | MIT | [README](https://github.com/ggml-org/whisper.cpp/blob/master/README.md), [licença](https://github.com/ggml-org/whisper.cpp/blob/master/LICENSE), [exemplo de servidor](https://github.com/ggml-org/whisper.cpp/tree/master/examples/server), [pesquisa](https://github.com/coolabnet/community-box/blob/main/research/guides/offline-transcription-whisper.md) |
| comapeo-cloud | territoryMapping | candidate | unknown | amd64 | docker | MIT | [README](https://github.com/digidem/comapeo-cloud/blob/main/README.md), [package.json](https://github.com/digidem/comapeo-cloud/blob/main/package.json), [imagem](https://hub.docker.com/r/communityfirst/comapeo-cloud) |

Verificado em 02/11/2026.

## Notas sobre números específicos

- **nextcloud, 512 MB (estimated).** A [página de requisitos](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html) diz que o Nextcloud precisa de pelo menos 128 MB de RAM por processo e recomenda pelo menos 512 MB por processo. Usamos o número recomendado para um processo. A página não dá um total para um servidor inteiro.
- **whisper-cpp, 852 MB.** O [README](https://github.com/ggml-org/whisper.cpp/blob/master/README.md) lista cerca de 852 MB de memória para o modelo `small`. O modelo `tiny` precisa de cerca de 273 MB. Modelos maiores precisam de mais. O número depende do modelo que você escolher.
- **chatmail-relay, 1 GB RAM e 10 GB disco.** O [guia de configuração](https://chatmail.at/doc/relay/getting_started.html) diz "1GB RAM, one CPU, and perhaps 10GB storage for a few thousand active" endereços. O guia relativiza o número de armazenamento com "perhaps" (talvez).
- **azuracast e pihole.** Estes são os números mínimos nos requisitos oficiais. O AzuraCast também fornece números recomendados de 4 GB de RAM, 4 núcleos de CPU e 40 GB de disco para algumas estações.
## Escolhas que vale a pena conhecer

- **O FileBrowser não está no catálogo.** O `services/files/` o utiliza, mas o projeto original o arquivou em 01/09/2026. O [README](https://github.com/filebrowser/filebrowser/blob/master/README.md) diz que não haverá mais lançamentos ou correções de segurança. Não listamos software sem manutenção.
- **O OONI Probe não está no catálogo.** O [guia do repositório](https://github.com/coolabnet/community-box/blob/main/research/guides/ooni-network-testing.md) diz que ele roda nos dispositivos dos próprios membros e não é um serviço de servidor.
- **O Grafana não está no catálogo.** O `services/monitoring/` o menciona apenas como um complemento opcional ao Speedtest Tracker.
- **O Speedtest Tracker é um candidato.** O arquivo compose do repositório usa a imagem `henrywhitaker3/speedtest-tracker`. O Docker Hub mostra que sua tag mais recente foi publicada em 2021. O README do projeto diz que a imagem agora é construída pela LinuxServer.io (`linuxserver/speedtest-tracker`).
- **CoMapeo Cloud.** O repositório não tem arquivo LICENSE. A licença vem de `package.json` (`MIT`). A tag `latest` do Docker Hub lista apenas amd64.

## Questões em aberto

- O comportamento offline e em LAN é desconhecido para a maioria das novas entradas. Apenas o Kolibri tem uma fonte ([README do projeto original](https://github.com/learningequality/kolibri/blob/develop/README.md): offline-first). O Syncthing se anuncia na rede local ([especificação de descoberta](https://docs.syncthing.net/specs/localdisco-v4.html)), então a sincronização em LAN provavelmente funciona sem Internet (inferido).
- Os idiomas da interface estão vazios para todas as novas entradas. Nenhuma fonte fornece uma lista de idiomas verificada.
- O nível de manutenção é "desconhecido" para todas as novas entradas. Não o avaliamos com base na atividade de commits.
- Os números de recursos estão ausentes para Kolibri, Syncthing, AdGuard Home, Speedtest Tracker e CoMapeo Cloud. Não encontramos nenhum número oficial.
- A arquitetura do relay do chatmail é desconhecida. O guia de configuração menciona Debian 12 e não indica uma arquitetura de CPU. Se um relay funciona sem Internet também é desconhecido, como observa o [guia do Delta Chat](https://github.com/coolabnet/community-box/blob/main/research/guides/local-messaging-deltachat.md).
- O arquivo `LICENSE` do Pi-hole aplica a EUPL-1.2 a todo o projeto, com exceções listadas (inferido serem componentes de terceiros incluídos no pacote). Não lemos a lista de exceções.
- Se a imagem `communityfirst/comapeo-cloud` do Docker Hub está atualizada com o repositório do GitHub é desconhecido. O repositório foi atualizado após a tag da imagem (inferido das datas de publicação).
- As entradas de plataforma além de YunoHost e Docker (`native`) se baseiam na documentação de instalação dos projetos e não foram testadas.
- Quais desses aplicativos as comunidades CoMapeo, Kolibri ou Delta Chat realmente usam em campo ainda não é conhecido. Nenhum relatório de campo foi citado.