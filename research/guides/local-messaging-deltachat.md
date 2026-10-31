---
title: Local Messaging with Delta Chat
---

# Local Messaging with Delta Chat

This guide explains Delta Chat and its relay network. It shows what the official docs describe for offline use. It compares four options for a Community Box.

## What Delta Chat Is

[Delta Chat](https://delta.chat/en/) is a free and open source messenger. It runs on Android, iOS, and desktop. Get the apps from [get.delta.chat](https://get.delta.chat).

Delta Chat uses internet email standards. Messages travel through chatmail relays, which are mail servers. Delta Chat uses a secure subset of OpenPGP for end-to-end encryption. Contacts exchange keys by QR code or invite link, using Secure-Join ([FAQ](https://delta.chat/en/help)).

Autocrypt sets up encryption between contacts and group members automatically ([FAQ](https://delta.chat/en/help)). The FAQ says Autocrypt v2 is scheduled for 2026. This guide did not verify whether it has shipped.

## Chatmail Relays

A relay holds messages while a device is offline. Relays do not store group names, avatars, or contact details ([FAQ](https://delta.chat/en/help)).

By default, the app sets up relays for you ([FAQ](https://delta.chat/en/help)). The page [chatmail.at/relays](https://chatmail.at/relays) lists public relays. It names nine.testrun.org as the default onboarding relay for many chatmail apps.

A community can run its own relay. The [relay repository](https://github.com/chatmail/relay) contains the setup tools. The [setup guide](https://chatmail.at/doc/relay/getting_started.html) lists these requirements:

- A Debian 12 server with reachable SMTP, submission, IMAPS, and HTTPS ports.
- 1 GB RAM, one CPU, and about 10 GB storage for a few thousand addresses.
- Control of a domain through a DNS provider.
- A build machine with SSH key access to the server root user.

The setup needs a DNS A record for the domain. The [setup guide](https://chatmail.at/doc/relay/getting_started.html) encourages IPv6 when it is available, so it also shows an AAAA record. The AAAA record is recommended, not required. Domains that start with an underscore use self-signed certificates instead of Let's Encrypt.

The docs describe an experimental IP-only relay. It needs no domain and can use an IPv4 address on a local network. The [IP-only page](https://chatmail.at/doc/relay/iponly.html) states three limits:

- The option is experimental and might change without notice.
- Transport encryption uses self-signed certificates, which the page calls vulnerable to man-in-the-middle attacks.
- Messages are not DKIM-signed. Some relays may reject them.

The docs do not say whether a relay works with no internet link. This guide treats that as unknown.

## Local and Offline Features in the Docs

The official docs describe these local features:

- **Second device transfer.** Both devices must be on the same Wi-Fi or network. A QR code starts the transfer ([FAQ](https://delta.chat/en/help)).
- **Mobile hotspot fallback.** If the devices cannot see each other, the FAQ suggests a phone hotspot.
- **Face-to-face contact.** A QR code adds a member in person ([FAQ](https://delta.chat/en/help)).
- **In-chat apps.** Webxdc apps are zip files that run inside chats ([webxdc FAQ](https://delta.chat/en/help)).

The docs do not describe a LAN-only chat mode. The docs do not say chat works without a relay. The official docs do not confirm offline chat between two Delta Chat apps. ButterBox describes an offline setup in its own blog, covered below.

## Options for a Community Box

| Option | Needs internet? | Needs domain? | Effort |
|---|---|---|---|
| (a) Public chatmail relays | Yes | No | Low: install the app and pick a relay |
| (b) Self-host a chatmail relay | Yes for public use. LAN-only use is undocumented | Yes for the standard setup. The IP-only option is experimental | High: Debian 12 server, DNS, SSH, deploy tools |
| (c) ButterBox on a Raspberry Pi, chat only | No | No | Medium: build or obtain the box |
| (d) Delta Chat through one ButterBox | No | No | Medium: same box as (c), plus the Delta Chat setup |

Option (a) fits a site with internet access. Option (b) fits a site that can host a server with public DNS. Option (b) includes the experimental IP-only relay. That relay is separate from option (d). Option (d) uses a relay that runs on the box itself.

ButterBox is the offline option in this review. It broadcasts its own Wi-Fi network. [Butter Box](https://likebutter.app/) says it works without internet. Users join a public chatroom or create a private one. The site lists encrypted chat as a feature. It says everything is stored on the box. The [docs](https://likebutter.app/docs) describe the box as a hotspot with local content.

Option (d) is the concrete offline Delta Chat setup. The [Secure Messenger page](https://likebutter.app/docs/services/secure-messenger) says people on the same Butter Box can send messages to each other without internet. The [ButterBox Delta Chat post](https://likebutter.app/blog/butterbox-deltachat) says the box runs a local MadMail server, an open-source chatmail server. The app on each device is set up with that local server. The post calls a single ButterBox an asynchronous messaging hub. It says the Android app and MadMail ship in the base firmware. It shows a Linux desktop client working, but says bundling the desktop app and local web support are future plans. Early testing is described as promising. Treat this as a single-box setup that is not yet complete. This guide has not tested it.

Community feedback from GG2026 says Delta Chat and ButterBox both worked on a local network. This is not verified, so no option is recommended from it. The same feedback says AIR and DashChat plan local-server support and lack committed funding or a roadmap. This is not verified either. The [FIFAfrica 2026 report](https://likebutter.app/blog/fifafrica-2026) describes an offline DashChat demonstration. DashChat ran offline with a Butter Box as its server, and its local message hub was added to Butter Box. The report does not mention AIR. Neither AIR nor DashChat is recommended yet.

## Privacy Notes

Delta Chat servers see sender and receiver addresses and message size ([FAQ](https://delta.chat/en/help)). Addresses are random by default. Other contact and group data travels end-to-end encrypted inside messages and is kept on the devices. Relays also see the IP address of each user, because they need it to deliver messages ([FAQ](https://delta.chat/en/help)).

For sensitive use, create a separate profile with a random address. The FAQ recommends this to limit metadata collection. A separate profile does not by itself protect data on a phone or computer that is taken. Turn on the device's own disk encryption and screen lock as well. A [Delta Chat developer note](https://support.delta.chat/t/researching-a-zero-trust-storage-layer-for-deltachat-core-rust-thoughts/4554/6) recommends relying on operating system encryption for stored data.

Relay operators run their own servers. Public relays are run by different groups and people ([relays page](https://chatmail.at/relays)). The relay docs describe a goal of collecting no private data or metadata ([relay repository](https://github.com/chatmail/relay)). That is a design goal, not an audit result.

The docs do not list message timing as visible to relays. Relays likely see when messages arrive (inferred).

**Warning: change the ButterBox default credentials before you deploy it.** The box ships with documented default credentials for three accounts: the OS user, the access point admin, and the chat admin. The Wi-Fi network is open by default, with no password. Anyone nearby can join the network. Anyone who knows the chat admin default can take chat admin. Change all three credentials, and add a Wi-Fi password, before the box serves users. The [ButterBox security guide](https://likebutter.app/docs/security) lists the steps. The [quick start](https://likebutter.app/docs/quick-start) says the Wi-Fi network is open by default and shows how to add a Wi-Fi password in Admin Settings.

## Open Questions

- Which local setup Delta Chat used at GG2026 is not confirmed. ButterBox's Delta Chat setup is a likely candidate (inferred).
- Whether a self-hosted or IP-only relay works with no internet link is unknown. The docs are silent.
- Whether Autocrypt v2 has shipped is unknown.
- ButterBox chat encryption details are unknown. The sources reviewed do not describe them.
