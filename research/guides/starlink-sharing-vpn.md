---
title: Sharing Starlink with a VPN
---

# Sharing One Starlink Connection Across a Community Network

Some community networks use a Starlink connection as their internet link. This guide explains a basic setup for sharing that link, and why members outside the network may not reach a server at the site. It is conceptual, not a step-by-step configuration.

## IPv4 Is Blocked Inbound; IPv6 Is Different

Starlink's default IPv4 setup uses carrier-grade NAT (CGNAT), which shares one public address among many customers. Inbound IPv4 connections are blocked ([Starlink help](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4)).

Starlink also provides native IPv6 on its plans, with a /64 for the WAN side and a /56 for the LAN side ([same article](https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4); [Enterprise FAQ](https://starlink.com/na/support/article/4c4d6571-065f-f12a-648a-581aac7a9ef8)). Inbound IPv6 still needs a router or firewall rule for the specific host and port. Starlink's own Wi-Fi routers do not offer port forwarding or firewall rules, so a third-party router is the common choice. Public IPv4 is a separate option, available only on some plans.

Many networks where members connect still lack IPv6 (inferred). So a VPN or overlay remains the most portable option.

## Why an Overlay Helps

A VPN or overlay gives each device a private address and an encrypted tunnel. The tunnel still needs a path both sides can reach.

- **WireGuard** is a [fast, modern, secure VPN tunnel](https://www.wireguard.com/). Its [quick start](https://www.wireguard.com/quickstart/) configures each peer with an endpoint and allowed IP ranges. A peer must be reachable at a known address. If both sides are behind IPv4 CGNAT, a third host with a reachable address is needed, such as a small rented server or an IPv6 path. The quick start does not say what happens when both sides are unreachable.
- **Tailscale** runs on WireGuard. Nodes start through DERP servers, which help them find each other. Tailscale then tries a direct connection. DERP relays carry traffic only when no direct path works. Relayed traffic stays end-to-end encrypted ([connection types](https://tailscale.com/docs/reference/connection-types)).
- **Headscale** is a self-hosted control server for Tailscale clients. It exchanges WireGuard public keys and assigns addresses ([README](https://github.com/juanfont/headscale)). It does not relay traffic by itself. It has an embedded DERP server, disabled by default, that relays traffic between nodes when no direct connection can be made ([Headscale DERP docs](https://headscale.net/stable/ref/derp/)). A Headscale setup can relay, but only if you enable and host that component.

## Reaching a Server on the Local Network

A tunnel on the gateway does not, by itself, make a LAN server reachable. Two options:

- **The server runs the tunnel client.** It gets its own tunnel address, and members reach it directly. This is the simplest option.
- **The gateway advertises the LAN subnet.** This is a subnet router. An admin approves the advertised route, and the gateway forwards packets between interfaces. Firewall rules must allow the traffic to the server. Replies must return through the gateway (inferred). The [Tailscale subnet router guide](https://tailscale.com/docs/features/subnet-routers/how-to/setup) covers advertising, approving, and forwarding. It does not fully cover return routing, so test that on your network.

With WireGuard, the equivalent is the peer's allowed IP ranges plus forwarding and firewall rules on the gateway.

## Protocols That CGNAT Drops

The Starlink site-to-site article lists protocols CGNAT drops: IP protocol 47 (GRE), 50 (ESP), 51 (AH), and 115 (L2TP) ([Starlink help](https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857)). Protocol 115 is an IP protocol number, not L2TP over UDP. Test your tunnel on the actual link before you go live.

## Basic Topology

1. The Starlink dish and router provide the internet link.
2. A gateway running OpenWrt or [LibreMesh](https://libremesh.org/) connects to the Starlink router and shares the link with mesh nodes.
3. A tunnel client on the gateway or the server connects to a reachable peer or relay.
4. Members reach the community server through the tunnel, using one of the routing options above.

The gateway is a single point of failure. Plan a spare path or a fallback.

## Bandwidth, Terms, and Fair Use

A shared link has fixed capacity. Decide who may use it and for what, and give priority to the services the community needs most. Starlink's data limits and fair-use rules differ by plan, and this guide did not verify them.

Starlink's terms of service govern whether you may share or resell the connection. The terms page did not render in the fetch used for this guide. Do not assume sharing is allowed. Ask Starlink support in writing first.

## Open Questions

- Sharing and resale rules in Starlink's terms of service were not verified.
- Whether inbound IPv6 works through your router and plan. Test it.
- (inferred) How far an IPv6-only server reaches, given how many client networks lack IPv6.
- (inferred) Return-path and NAT details for a subnet router.
- (inferred) How the Starlink article classifies L2TP over UDP, which uses UDP rather than IP protocol 115.

## Sources

Fetched 2026-10-30. WebFetch of the Starlink help-center pages returned only the word "Starlink," so the Starlink statements come from search excerpts of the URLs below. Verify them on the live pages.

- https://starlink.com/support/article/1192f3ef-2a17-31d9-261a-a59d215629f4 (CGNAT, IPv6 prefixes; excerpt)
- https://starlink.com/na/support/article/4c4d6571-065f-f12a-648a-581aac7a9ef8 (Enterprise FAQ, IPv6 prefix; excerpt)
- https://starlink.com/gu/support/article/aa5aecf3-e97c-e84e-3f87-8d2ecdfde857 (protocol list; excerpt)
- https://www.wireguard.com/ and https://www.wireguard.com/quickstart/ (WireGuard description, peer configuration)
- https://tailscale.com/docs/reference/connection-types (DERP first, direct connection, encryption)
- https://tailscale.com/docs/features/subnet-routers/how-to/setup (advertising and approving routes, forwarding)
- https://github.com/juanfont/headscale (control server role)
- https://headscale.net/stable/ref/derp/ (embedded DERP, disabled by default)
- https://libremesh.org/ (LibreMesh description)
- https://www.starlink.com/legal/documents/DOC-1020-91087-61/Starlink-Terms-of-Service (did not render)
