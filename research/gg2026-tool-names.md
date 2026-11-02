# GG2026 feedback: unclear tool names

The GG2026 feedback doc (table 3) names six tools with spellings that match
no known project. This note records what web research found on 2026-11-01.
Nothing here is confirmed by the people who wrote the rows, so no app or
catalog change is made yet. Each row is marked "needs further discussion" in
the Google Doc. Tracked as Q15 in the local decisions file.

| Row | Doc text | Best reading | Confidence |
|---|---|---|---|
| T3-5 | "Bort backup" (recommended by Cloud68) | BorgBackup | Medium-high |
| T3-19 | "Document Madix approach for self-hosting" | MaadiX | Medium-high (tool), low (fit) |
| T3-20 | "KwiX add use case of local mirrors for security in a box" | Kiwix mirror of Security in a Box | Medium |
| T3-11 | "Riticulum shared library for essential services of CCCI" | Reticulum, or "curriculum" | Low-medium |
| T3-22 | "Add Protón tool" | Proton VPN | Low-medium |
| T3-3 | "Abayala VPN approach" (Chasky available to talk) | Unresolved | Low |

## T3-5: Bort backup

- BorgBackup is a deduplicating backup tool. BorgBase hosts Borg
  repositories for many clients, the closest model to "collectively hosted
  backup" (https://www.borgbase.com/).
- YunoHost already packages `borg`, `borgserver` and `borgwarehouse`
  (`research/fetched-data/yunohost-apps.json`), so a Borg entry fits the
  catalog.
- Cloud68 is based in Estonia and sells managed Nextcloud, Mattermost,
  WordPress, Mastodon and Vaultwarden (https://cloud68.co/about,
  https://directory.civictech.guide/listing/cloud68co). Its site does not
  mention Borg.
- Alternate: Restic.

## T3-19: Madix

- MaadiX is a self-hosting platform: "Your Cloud in your hands", one-click
  apps through a control panel on your own server, OpenVPN included
  (https://maadix.net/en/).
- FOSDEM 2020 talk on MaadiX as install "recipes" for Nextcloud, Jitsi and
  Rocket.Chat (https://archive.fosdem.org/2020/schedule/event/dip_maadix/).
- Funded by the Open Technology Fund
  (https://www.opentech.fund/projects-we-support/supported-projects/distributed-and-federated-tools-for-maadix/).

## T3-20: KwiX

- Kiwix serves ZIM files offline. The Kiwix catalog has no Security in a Box
  ZIM (https://opds.library.kiwix.org/catalog/v2/entries?q=security+in+a+box
  returned 0 results).
- Security in a Box (https://securityinabox.org/en/) is CC BY-SA 4.0, so a
  self-built ZIM (for example with zimit) is allowed. The site offers no
  offline download.
- Related community work on offline ZIM builds:
  https://discuss.privacyguides.net/t/test-our-offline-zim-kiwix-builds/30561

## T3-11: Riticulum

- Reticulum Network Stack (https://reticulum.network/) is one letter off.
  NomadNet page nodes could host a shared library. No source links CCCIs to
  Reticulum.
- "Curriculum" is the other reading. CCCI means Community-Centred
  Connectivity Initiatives
  (https://www.commonroom.info/piloting-the-ccci-online-learning-programme-in-indonesia/).
  APC's local-services report lists "provision of digitised (school)
  curricula" among local services (https://apc.org/sites/default/files/localservices_ccc.pdf).
- Alternate: APC Community Networks Learning Space (https://cnlearning.apc.org/).

## T3-22: Protón

- Proton AG products: VPN, Mail, Pass, Drive. Proton VPN fits "security of
  local communities" best: "Stealth is available on all Proton VPN plans,
  including our Free plan" (https://protonvpn.com/blog/stealth-vpn-protocol).
- Proton is a cloud service, not self-hosted, so it would be an external
  option, not a Community Box service.

## T3-3: Abayala VPN

- No VPN product named Abayala or Abya Yala was found.
- "Abya Yala" is the Community Networks Seedbed run by AlterMundi,
  Rhizomatica and REDES A.C.
  (https://blog.lacnic.net/en//community-connectivity-as-an-alternative).
- MaadiX includes OpenVPN, but nothing links it to this row.

## Open Questions

- Inferred: "Chasky" is a person from Atalaya Sur (Chaski community intranet,
  Argentina). Ask them to describe the VPN approach for T3-3.
- Does Cloud68 use or recommend Borg? docs.cloud68.co was not checked.
- T3-11: did the writer mean Reticulum or a shared curriculum library?
- T3-20: should we build and publish a Security in a Box ZIM, or only
  document how?
- T3-22: which Proton product was meant?
- T3-19: does MaadiX run on a local box, or only on a hosted VPS? Not checked.
