# LibreMesh Overview

## Introduction to LibreMesh

LibreMesh is a modular framework for creating OpenWrt-based firmwares for wireless mesh nodes, designed specifically for community networks[1][10]. Several communities around the world use LibreMesh as the foundation of their local mesh firmwares, enabling decentralized, community-managed wireless networks.

`[Mesh Network Topology Illustration](mesh-network-topology.png) — Diagram of mesh-connected routers in a typical deployment.`

LibreMesh represents a fundamental shift from traditional centralized wireless networks to distributed, community-controlled infrastructure. Unlike conventional wireless setups that rely on a single access point or router, LibreMesh creates self-configuring mesh networks where each node can route traffic for other participants, eliminating single points of failure[10].

`[LibreMesh Logo or Screenshot](libremesh-logo.png) — Identifying the project visually.`

## Core Features and Benefits

### Automatic Network Configuration

LibreMesh's primary strength lies in its auto-configurable nature[1]. The firmware allows simple deployment of versatile, multi-radio mesh networks without requiring extensive technical expertise from community members. Once installed, nodes automatically discover each other and establish mesh connections using sophisticated routing protocols.

### Dual-Layer Network Architecture

LibreMesh implements a unique two-layer network architecture that provides both scalability and segmentation[8][20]:

**Layer 2 (Cloud Layer)**: Uses BATMAN-adv (Better Approach To Mobile Ad hoc Networking) routing protocol, which creates a virtual layer 2 collision domain across multiple hops. This enables seamless roaming for devices within the same "cloud"[17][20].

**Layer 3 (Network Layer)**: Employs Babel routing protocol (previously BMX6/BMX7) for IPv6-native dynamic routing with advanced features and minimal network overhead[17][20].

### Smart Gateway Selection

The system provides intelligent gateway selection with redundancy and user choice capabilities[8]. Multiple internet connections can be shared across the mesh, with automatic failover when primary connections become unavailable.

### Multi-Radio Support

LibreMesh supports multi-radio configurations, allowing routers to use different frequency bands simultaneously for both mesh backbone connections and client access[5]. This separation improves network performance by reducing interference between backhaul and access traffic.

## Network Topologies

### Community Mesh Networks

LibreMesh excels in community-scale deployments where neighborhoods, rural areas, or urban districts create shared wireless infrastructure. Common topologies include:

- **Neighborhood Networks**: Connecting homes and small businesses within a geographic area
- **Rural Connectivity**: Bridging remote locations with limited internet infrastructure  
- **Urban Mesh**: Providing redundant connectivity in dense urban environments
- **Campus Networks**: Supporting educational institutions or community centers

### Hybrid Infrastructure

The framework supports hybrid deployments combining:
- Mesh backbone connections between strategic points
- Traditional access point services for end users
- Wired backbone links where available
- Multiple internet gateway connections

## Common Use Cases in Community Networks

### Internet Sharing

Communities can pool resources to share internet connections, reducing individual costs while improving reliability through redundancy[22]. The mesh automatically balances traffic across available gateways.

### Local Services

LibreMesh networks excel at hosting local services accessible without internet connectivity:
- Local web servers and content repositories
- Community communication platforms
- Local file sharing and collaboration tools
- Emergency communication systems

### Educational and Social Applications

Many deployments focus on educational and social benefits:
- Providing internet access to underserved communities
- Supporting digital literacy programs
- Enabling local content creation and sharing
- Facilitating community organization and communication

### Emergency and Disaster Response

The resilient, distributed nature of mesh networks makes them valuable for emergency scenarios:
- Maintaining communication when traditional infrastructure fails
- Providing internet access during disasters
- Supporting coordination efforts for emergency response

## Organizations Supporting LibreMesh

LibreMesh enjoys support from numerous organizations worldwide[10]:

| Organization | Region |
|--------------|--------|
| AlterMundi | Argentina |
| FreiFunk | Germany |
| FunkFeuer | Austria |
| Guifi | Iberian peninsula |
| Ibebrasil | Brasil |
| LibreRouter | Global |
| Ninux.org | Italy |
| Wakoma | Global |

## Community Networks Using LibreMesh

Active deployments demonstrate real-world success[10]:

| Network | Location |
|---------|----------|
| Antennine | Appennino Bolognese |
| Calafou | Catalunia |
| Coolab | Brasil |
| Janastu CowMesh | Rural Karnataka |

## Technical Philosophy

### Open Source Hardware and Software

LibreMesh embodies the principles of open technology, with all software and many hardware designs available under open licenses[4]. This transparency enables communities to understand, modify, and maintain their networks independently.

### Community Ownership

The project emphasizes community ownership and control over networking infrastructure, moving away from dependence on commercial providers or centralized authorities[10]. This approach aligns with broader movements toward digital sovereignty and community resilience.

### Scalability and Modularity

The modular design allows communities to start small and grow organically, adding nodes and services as needs evolve[5]. The system scales from simple two-node links to complex multi-hundred node networks.

## Getting Started

For communities interested in LibreMesh, the typical progression involves:

1. **Planning Phase**: Assessing community needs and technical requirements
2. **Hardware Selection**: Choosing appropriate routers and equipment (see [libremesh-installation.md](./libremesh-installation.md))
3. **Network Design**: Planning node placement and topology (see [mesh-network-basics.md](./mesh-network-basics.md))
4. **Configuration**: Setting up basic network parameters and services
5. **Deployment**: Installing and configuring nodes
6. **Community Integration**: Training users and establishing governance

## Next Steps

This overview provides the foundation for understanding LibreMesh's capabilities and applications. For detailed implementation guidance:

- Review [mesh-network-basics.md](./mesh-network-basics.md) for networking concepts
- Consult [libremesh-installation.md](./libremesh-installation.md) for hardware and installation procedures
- Explore [captive-portal-guide.md](./captive-portal-guide.md) for user management
- Reference [dns-configuration.md](./dns-configuration.md) for local service setup

LibreMesh represents more than just networking technology—it's a tool for community empowerment and digital self-determination. By providing the technical foundation for community-controlled networks, it enables groups to take ownership of their digital infrastructure and create more resilient, equitable connectivity solutions.