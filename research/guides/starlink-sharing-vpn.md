---
title: Sharing Starlink with a VPN
---

# Sharing One Starlink Connection Across a Community Network

Some community networks use a Starlink connection as their internet link. This guide explains a basic setup for sharing that link. It also explains why members outside the network may not reach a server at the site. It stays conceptual. It is not a step-by-step configuration.

## The Core Problem: CGNAT and Inbound Access

Starlink's help center says its default IPv4 setup uses carrier-grade NAT (CGNAT). CGNAT lets many customers share one public address. Inbound connections are blocked, so a server behind the default setup cannot be reached from outside ([Starlink help: IP address](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

Points from that help center to check on the live pages:

- A public IPv4 address depends on the plan. The help center names the Local and Global Priority plans.
- Starlink's own Wi-Fi routers do not support port forwarding or firewall rules for IPv4 or IPv6.
- Members who need inbound access are pointed to a third-party router or a plan with a public IPv4 option.

IPv6 may offer another route to inbound access. Confirm for your plan whether native IPv6 is provided and whether your router passes it through. See Open Questions.

## Why an Overlay Helps

A VPN or overlay network gives each device a private address and an encrypted tunnel to the others. The tunnel still needs a path that both sides can reach. That path is the hard part behind CGNAT.

- **WireGuard** is a [fast, modern, secure VPN tunnel](https://www.wireguard.com/). Its [quick start](https://www.wireguard.com/quickstart/) configures each peer with an endpoint address and allowed IP ranges. Plain WireGuard needs a peer the other side can reach at a known address. If the server and the client are both behind CGNAT, neither can accept the connection. A third host with a public address, such as a small rented server, is then needed. Keepalive packets help keep NAT mappings open. The quick start does not describe what happens when both sides are unreachable.
- **Tailscale** runs on WireGuard. Its [connection types page](https://tailscale.com/docs/reference/connection-types) says devices first try direct connections over UDP. When no direct path works, traffic goes through DERP relay servers, and relayed traffic stays end-to-end encrypted with WireGuard.
- **Headscale is not a relay.** [Headscale](https://github.com/juanfont/headscale) is a self-hosted control server for Tailscale clients. Its README says the control server exchanges WireGuard public keys between nodes and assigns addresses. It does not carry member traffic. A Headscale setup behind CGNAT still needs a path that works. Check Headscale's own docs for relay options (inferred).

## Protocols That CGNAT Drops

The Starlink site-to-site article lists protocols that CGNAT drops: IP protocol 47 (GRE), 50 (ESP), 51 (AH), and 115 (L2TP) ([Starlink help: site-to-site VPN](https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857)). Protocol 115 is an IP protocol number. It is not the same as L2TP over UDP. Test your chosen tunnel on the actual Starlink link before you go live.

## Basic Topology

1. The Starlink dish and router provide the internet link.
2. A gateway running OpenWrt or LibreMesh connects to the Starlink router. LibreMesh is a [framework for OpenWrt-based firmware for wireless mesh nodes](https://libremesh.org/).
3. The gateway shares the link with the mesh nodes.
4. A tunnel client on the gateway or a server connects to a reachable peer or relay.
5. Members reach the community server through that tunnel. The server itself stays behind CGNAT.

The gateway is a single point of failure. Plan a spare path or a clear fallback.

## Bandwidth and Fair Use

A shared link has fixed capacity, and many members can slow each other down. Decide who may use the link and for what. Watch usage for a few weeks. Give priority to the services the community needs most. Starlink's data limits and fair-use rules differ by plan and were not verified here.

## Resale and Sharing Terms

Starlink's terms of service govern whether you may share or resell the connection. The terms page did not render in the fetch used for this guide. Do not assume sharing is allowed. Read the terms and ask Starlink support in writing before you share the link with a community.

## Open Questions

- Sharing and resale rules in Starlink's terms of service were not verified.
- Whether Starlink provides native IPv6 on your plan, and whether a third-party router can pass inbound IPv6 to a server. Confirm on the live pages.
- (inferred) Whether the statements above still match the live help pages.
- (inferred) How the Starlink article classifies L2TP over UDP, which uses UDP rather than IP protocol 115. Confirm with Starlink.
- Whether the public IPv4 address works for all community devices. Not tested.

## Sources

Fetched 2026-10-30. WebFetch of the Starlink help-center pages returned only the word "Starlink," so the Starlink statements above come from search excerpts of those same URLs. Verify them on the live pages before you rely on them.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (IP address and CGNAT; excerpt only)
- https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857 (site-to-site VPN, protocol list; excerpt only)
- https://www.wireguard.com/ (WireGuard description)
- https://www.wireguard.com/quickstart/ (peer endpoints, allowed IP ranges, keepalives)
- https://tailscale.com/docs/reference/connection-types (direct connections, DERP relay fallback, encryption)
- https://github.com/juanfont/headscale (control server role, not a relay)
- https://libremesh.org/ (LibreMesh description)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (did not render; listed for the terms check)
