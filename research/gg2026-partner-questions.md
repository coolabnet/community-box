# GG2026 feedback: questions for partners

Web research on four GG2026 feedback items, done 2026-11-01. Each needs an
answer from a partner before we change the app or docs, so nothing is
changed yet. The matching Google Doc rows have "needs further discussion"
notes. Tracked as Q10, Q18, Q20 and Q39 in the local decisions file.

| Row | Item | Best reading | Ask |
|---|---|---|---|
| T1-10 | CoP links and help desks (#47) | No public CoP join link found | LocNet |
| T3-1 | Delta Chat transport at GG (#58) | ButterBox with its MadMail relay (about 65%) | Demo presenter |
| T3-4 | Audio detection sensors (#61) | Depends on the use case | Colnodo contact |
| T3-23 | BlankOn (#59) | Desktop distro, not a server OS | Somat |

## T1-10: LocNet community of practice and help desks

- No public LocNet mailing list, forum or chat group was found.
  `https://locnet.apc.org` redirects to APC's digital inclusion page
  (https://apc.org/en/our-work/themes/digital-inclusion).
- Open APC channel: the Community Networks and Local Access monthly
  newsletter. Sign-up: https://crm.apc.org/content/local-access-subscription.
  Archive: https://www.apc.org/en/community-networks-and-local-access-monthly-newsletter
- Learning resources: https://cnlearning.apc.org and the CoP manuals series
  (https://www.apc.org/en/pubs/manuals-communities-practice-series-support-community-networks).
- Help desks:
  - Access Now Digital Security Helpline, 24/7 in 10 languages including
    Spanish and Portuguese (https://www.accessnow.org/help/,
    https://www.accessnow.org/help-es/, https://www.accessnow.org/help-pt/).
  - Digital First Aid Kit, self-serve troubleshooting
    (https://digitalfirstaid.org/).
  - Front Line Defenders, for human rights defenders at risk only
    (https://www.frontlinedefenders.org/en/emergency-contact).
  - CiviCERT is a network of helpdesks, not an end-user helpline
    (https://www.civicert.org/).
  - The Digital Defenders Partnership Incident Response Fund showed "CLOSED"
    (https://www.digitaldefenders.org/incident-response-fund/).

## T3-1: Delta Chat transport

- The doc row says only Delta Chat was fully functional at GG, "together with
  the chat app running on ButterBox".
- ButterBox: "Each ButterBox runs its own local DeltaChat relay", MadMail, a
  chatmail relay (https://likebutter.app/blog/butterbox-deltachat).
- MadMail can install with an IP address only and self-signed TLS, no domain
  (https://github.com/themadorg/madmail/wiki).
- Other readings: a self-hosted chatmail relay (about 20%), peer-to-peer
  webxdc realtime (about 10%).

## T3-4: Audio detection sensors

- The row asks for warning systems (aerial attacks, illegal logging).
- Real-time alerts: Rainforest Connection Guardian, solar recycled phones with
  cloud detection. Needs mobile or satellite links and the RFCx cloud
  (https://github.com/rfcx, https://rfcx.org/projects/colombia).
- Offline biodiversity monitoring: AudioMoth, open hardware, records to
  microSD (https://www.openacousticdevices.info/audiomoth), processed on a
  local server with BirdNET-Analyzer
  (https://github.com/birdnet-team/BirdNET-Analyzer) or live with BirdNET-Pi
  on a Raspberry Pi (https://github.com/Nachtzuster/BirdNET-Pi). BirdNET
  models are CC BY-NC-SA.
- Colombian precedent: Audubon "Escucha Aves" with the Gran Tescual
  Indigenous resguardo
  (https://www.audubon.org/es/noticias/escucha-aves-ia-favor-de-la-conservacion-y-las-comunidades).

## T3-23: BlankOn

- Indonesian distribution based on Debian unstable, rolling release
  (https://en.wikipedia.org/wiki/BlankOn_Linux, https://blankonlinux.id).
- Download page offers amd64 ISOs only; arm64 is in progress
  (https://blankonlinux.id/en/download). No Raspberry Pi support.
- Active again in 2026 (https://github.com/BlankOn). No current server
  edition and no published minimum hardware.

## Open Questions

- LocNet: what is the CoP join link, and which help desks may we list?
- Presenter: was the GG demo ButterBox with MadMail? Was internet available?
- Colnodo contact: threat alerts or wildlife monitoring? Which product? The
  contact name "Michael Suantek" was not found; spelling unverified.
- Somat: is BlankOn meant for client desktops or for the server? The row says
  it is "already in use in the Asia Region"; no source confirms this.
- Unverified: Access Now's contact email and whether it is free for civil
  society; AudioMoth current price; BirdNET-Pi fully offline after install.
