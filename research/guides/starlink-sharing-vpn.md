---
title: Sharing Starlink with a VPN
---

# Sharing One Starlink Connection Across a Community Network

Some community networks use a Starlink connection as their internet link. This guide explains a basic setup for sharing that link. It also explains why members outside the network may not reach a server at the site. It stays conceptual. It is not a step-by-step configuration.

## The Core Problem: CGNAT

Starlink's default IPv4 setup does not accept inbound connections. Starlink's help center says it uses carrier-grade NAT (CGNAT). CGNAT lets many customers share one public address. It blocks all inbound ports, so a server behind Starlink cannot be reached from outside by default ([Starlink help: What IP address does Starlink provide?](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

Starlink's help center says:

- A public IPv4 address is available only on the Local and Global Priority plans. You turn it on from the account dashboard. Check the current plan terms before you assume this.
- Starlink's own Wi-Fi routers do not support port forwarding or firewall rules for IPv4 or IPv6.
- Users who need inbound access are directed to a third-party router or a plan with a public IPv4 option.

Starlink's VPN help page says SSL-based VPNs typically work best across CGNAT. It also says CGNAT drops protocols 47 (GRE), 50 (ESP), 51 (AH), and 115 (L2TP) ([Starlink help: Does Starlink work with VPNs?](https://starlink.com/support/article/e5dc0b86-09b4-084b-918b-3fa181e5fb5d)).

The help center also says these conditions may change as the service grows.

## Why an Overlay Helps

A VPN or overlay network gives each device a private address. Devices connect outward to a control point or relay. Traffic then moves between devices over that link. No inbound port on Starlink is needed.

Two common options:

- **WireGuard** is a VPN tunnel. The project describes it as a [fast, modern, secure VPN tunnel](https://www.wireguard.com/). It uses a fixed set of cryptographic primitives, including ChaCha20, Poly1305, and Curve25519 ([WireGuard protocol page](https://www.wireguard.com/protocol/)). You manage the keys and peers yourself.
- **Tailscale** is built on WireGuard. Its docs describe it as a [Zero Trust, identity-based connectivity platform](https://tailscale.com/kb/1151/what-is-tailscale). Its own description says it works as an overlay network between your devices and uses NAT traversal ([Headscale README, quoting Tailscale](https://github.com/juanfont/headscale)).
- **Headscale** is a self-hosted, open source control server for Tailscale clients. It covers a single tailnet, aimed at personal use or small groups ([Headscale README](https://github.com/juanfont/headscale)). The Headscale README says Tailscale's client software is open source, except the GUI clients for Windows, macOS, and iOS, and the control server.

Tailscale's docs say exit nodes can route all of a device's traffic through a chosen node. They also say exit nodes are available on all plans ([Tailscale exit nodes](https://tailscale.com/kb/1103/exit-nodes)). Check current plan terms before you rely on this.

## Basic Topology

A simple layout:

1. Starlink dish and router provide the internet link.
2. A gateway device running OpenWrt or LibreMesh connects to the Starlink router. LibreMesh is a [framework for building OpenWrt-based firmware for wireless mesh nodes](https://libremesh.org/).
3. The gateway shares the link with the mesh nodes.
4. A VPN or overlay client on the gateway or on a server connects outward to a control point or a peer.
5. Members reach the community server through that overlay. The server stays behind CGNAT.

The gateway is the choke point. If it fails, the whole network loses its link. Plan a spare path or a clear fallback.

## Bandwidth and Fair Use

A shared link has a fixed capacity. Many members on one link can slow each other down. Set limits before you go live:

- Decide who may use the link and for what.
- Watch usage over a few weeks.
- Give priority to services the community needs, such as messaging or the community server.

Starlink's data limits, fair-use rules, and speed policies differ by plan. This guide did not verify them. Check your plan's current terms.

## Resale and Sharing Terms

Starlink's terms of service govern whether you may share or resell the connection. The page at [starlink.com/legal](https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service) did not render in the fetch used for this guide. Do not assume sharing is allowed. Read the terms and ask Starlink support in writing before you share the link with a community.

## Open Questions

- Sharing and resale rules in Starlink's terms of service were not verified. See the section above.
- (inferred) Whether the Priority plan's public IPv4 address works for all community members' devices. Not tested.
- (inferred) Whether a given third-party router can pass a public address through Starlink. Not checked in the fetched sources.
- Current Starlink plan data limits and fair-use policy. Not verified.

## Sources

Fetched 2026-10-30. The Starlink help pages returned page shells only in the fetch. The Starlink claims above come from search excerpts of those same help-center URLs, so verify them on the live pages.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (IP address, CGNAT, public IPv4 plans, router limits)
- https://starlink.com/support/article/e5dc0b86-09b4-084b-918b-3fa181e5fb5d (VPN guidance, protocols dropped by CGNAT)
- https://www.wireguard.com/ (WireGuard description and cryptography)
- https://www.wireguard.com/protocol/ (primitives used)
- https://tailscale.com/kb/1151/what-is-tailscale (Tailscale description)
- https://tailscale.com/kb/1103/exit-nodes (exit nodes)
- https://github.com/juanfont/headscale (Headscale purpose, open source status)
- https://libremesh.org/ (LibreMesh description)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (not rendered; listed for the terms check)
