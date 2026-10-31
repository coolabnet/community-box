---
title: Local Games and Entertainment
---

# Locally Hosted Games and Entertainment

Many community networks have little or no internet. Members still want things to do on their devices and on the local network. This guide defines locally hosted, offline-capable entertainment. It gives criteria for choosing it and lists a few examples that were checked against official sites.

This is a guide, not a catalog entry.

**A note on gambling.** The partner feedback behind this guide raised online gambling as a concern. This guide makes no claim that local games reduce gambling. No evidence on that question was assessed. Any decision about gambling risk needs its own review.

## What Counts as Local Entertainment

For this guide, local entertainment has three traits:

1. **It runs on the community's own hardware or devices.** The server or a member's computer hosts it. Members reach it over the local network.
2. **It works offline after setup.** Installing the software or content may need internet once. Using it should not.
3. **It is legally usable.** The license allows the community to install and share it.

Anything that needs a live internet service to play does not meet the offline test.

## Selection Criteria

Use these questions before you add anything:

- **License:** Is the code or content under a free or open license? Read the license file. Do not rely on a summary.
- **Offline use:** Does it run with no internet after setup? Test it by disconnecting the internet uplink only. Keep the local network powered, so the server and Wi-Fi stay up.
- **Resources:** Will it run on the hardware you have? Test on the weakest device you plan to use.
- **Languages:** Is the interface, or the content, in a language the members read?
- **Age fit:** Check the rating or content notes. Mixed-age groups need extra care.
- **Maintenance:** Is the project still updated? Who will apply updates?

## Candidate Examples

Each example below was checked on its official site or repository. None was tested on community hardware.

**1. Luanti (a voxel game engine).** Luanti describes itself as an [open source voxel game engine](https://luanti.org/en/). It is available for Windows, macOS, GNU/Linux, BSDs, and Android. Its site says you can play [solo, locally with friends, or online on a server](https://luanti.org/en/). The project's repository includes instructions for [running a server with Docker](https://github.com/luanti-org/luanti). A local server could let members play together on the LAN. Check the license file before use.

**2. Jellyfin (local media server).** Jellyfin describes itself as [free software](https://jellyfin.org/) that lets you collect, manage, and stream your media from a server you run. A community could host films, music, and other media it has rights to. Check the content rights and the server's resource needs before you plan.

**3. Kiwix (offline reading library).** The Kiwix tools repository describes [kiwix-serve and kiwix-manage](https://github.com/Kiwix/kiwix-tools) as command-line Kiwix tools. Its repository topics include offline use and the ZIM format. Kiwix is reading material, not a game. Include it only if the community sees offline reading as entertainment. The project site also offers [hotspot devices](https://kiwix.org/).

Two more candidate types were considered but not verified here:

- Open HTML5 game collections with clear licenses. No source was checked for this guide.
- Other classic or retro game engines. No source was checked.

## What Is Not Covered

- Hardware sizing for each example.
- Licenses for each game or media item. Check each one.
- Whether these tools reduce any harmful behavior. This guide does not assess that.
- Step-by-step install. Follow the official docs for each tool.

## Open Questions

- (inferred) Luanti's server needs more memory than a basic local server. Not measured.
- (inferred) Jellyfin's transcoding can slow a low-power server. Not tested here.
- The licenses of Luanti, Jellyfin, and Kiwix content were not checked. Read each project's license file before use.
- Which open HTML5 game collections have clear licenses. Not researched.
- Whether members in the community want local games at all. This needs a community decision, not a technical one.

## Sources

Fetched 2026-10-30.

- https://luanti.org/en/ (engine description, platforms, play modes including server)
- https://github.com/luanti-org/luanti (engine description; Docker server doc link)
- https://jellyfin.org/ (free software media server description)
- https://github.com/Kiwix/kiwix-tools (kiwix-serve and kiwix-manage command-line tools)
- https://kiwix.org/ (Kiwix project home; hotspot products)
