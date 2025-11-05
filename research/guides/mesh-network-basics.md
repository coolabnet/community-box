# Mesh Network Basics

## Introduction to Mesh Networks

Mesh networks represent a fundamentally different approach to network architecture compared to traditional hub-and-spoke models. In mesh networking, devices (nodes) connect directly, dynamically, and non-hierarchically to as many other nodes as possible, creating multiple paths for data transmission[13]. This decentralized structure provides several advantages over conventional networks, particularly in community deployments.

`[Wireless Channel Map](wireless-channel-map.png) — Example showing proper channel selections to reduce interference.]`

## Key Networking Concepts for LibreMesh

### Routing in Mesh Networks

Mesh networks handle routing through peer-to-peer communication where each node acts as both sender and receiver of data[12]. This cooperative approach to data transmission creates resilient networks that can maintain connectivity even when individual nodes fail.

#### Routing Protocols

LibreMesh employs two primary routing protocols in its dual-layer architecture[20]:

1. **BATMAN-adv (Better Approach To Mobile Ad hoc Networking)**: A layer 2 protocol that creates a virtual network switch out of mesh nodes, making the entire mesh appear as a single link-local network. This protocol:
   - Handles layer 2 routing (MAC addressing)
   - Enables seamless roaming within a mesh cloud
   - Creates what appears to clients as a single network collision domain
   - Works at the data link layer (OSI layer 2)

2. **Babel**: A distance-vector routing protocol for IPv6 and IPv4 with fast convergence properties. This protocol:
   - Handles layer 3 routing (IP addressing)
   - Provides inter-cloud connectivity
   - Enables intelligent gateway selection
   - Works at the network layer (OSI layer 3)

### Network Topology Concepts

Mesh networks can implement different topology structures depending on needs[18]:

- **Full Mesh**: Every node communicates directly with every other node
- **Partial Mesh**: Nodes communicate primarily with nearby nodes, with data "hopping" across multiple nodes to reach distant destinations

LibreMesh supports both configurations, with partial mesh being more common in larger deployments for efficiency.

`[Node Discovery UI Screenshot](node-discovery-ui.png) — LibreMesh's interface showing known nodes.]`

### Automatic Configuration

A critical feature of LibreMesh is its ability to automatically configure network parameters[20]. This includes:

- **Node Discovery**: Automatic detection of other mesh nodes within range
- **Route Establishment**: Dynamic creation of optimal routing paths
- **Address Assignment**: Automatic IP address allocation based on deterministic algorithms
- **Gateway Selection**: Intelligent choice of internet exit points

This auto-configuration significantly reduces the technical expertise required to deploy and maintain mesh networks.

## Network Architecture in LibreMesh

### Dual-Layer Design

The LibreMesh network architecture is built on a two-layer system that provides both flexibility and performance[8][17][20]:

#### Layer 2 Cloud

The cloud layer uses BATMAN-adv to create mesh "clouds" - local network segments that function as a single collision domain. Key characteristics include:

- All devices within a cloud appear on the same local network
- Seamless roaming for client devices within the cloud
- Isolation of broadcast traffic within cloud boundaries
- Simplified local networking with automatic discovery

#### Layer 3 Network

The network layer uses Babel (previously BMX6/BMX7) to interconnect different clouds and handle routing between them. This provides:

- Scalable connectivity between separate mesh clouds
- Intelligent gateway selection for internet access
- Reduced broadcast traffic across the wider network
- IPv6-native routing with IPv4 compatibility

### VLAN Segmentation

LibreMesh employs VLAN tagging to isolate routing protocols[17]:

- The Babel VLAN is consistent across all nodes, allowing link-layer connected nodes to find each other
- The BATMAN-adv VLAN depends on a cloud identifier (typically derived from the AP SSID)
- This configuration allows isolating layer 2 clouds while maintaining layer 3 connectivity

## Wireless Channel Planning

### Channel Selection Principles

Proper channel selection is crucial for wireless mesh performance[34][35]:

#### 2.4 GHz Considerations

- Only channels 1, 6, and 11 are non-overlapping in most regions
- Adjacent channel interference (ACI) occurs when nearby nodes use partially overlapping channels
- Co-channel interference (CCI) happens when nodes in range use the same channel

#### 5 GHz Planning

- More available channels allow for better spatial reuse
- Dynamic Frequency Selection (DFS) channels may require radar detection capabilities
- Higher frequencies have reduced range but often less interference

### Channel Allocation Strategies

For optimal mesh performance, consider these channel planning strategies:

1. **Channel Separation**: Ensure mesh backhaul links use different channels from client access
2. **Spatial Reuse**: Plan channel assignments based on physical node placement
3. **Interference Mitigation**: Select channels with minimal external interference
4. **Regulatory Compliance**: Adhere to local regulations for frequency use and power levels

## Fault Tolerance and Redundancy

### Path Redundancy

Mesh networks excel at providing multiple paths for data transmission[18][19]. This redundancy ensures:

- Communication can continue if individual nodes fail
- Traffic can be rerouted around congested or damaged nodes
- Network capacity can scale with additional nodes

### Self-Healing Capabilities

LibreMesh networks automatically adapt to changing conditions[18]:

- Detecting node failures and establishing alternative routes
- Adapting to varying link quality by selecting optimal paths
- Incorporating new nodes into the mesh as they come online
- Balancing traffic across available paths

## Roaming in Mesh Networks

### Layer 2 Roaming

One significant advantage of LibreMesh's BATMAN-adv implementation is its support for seamless layer 2 roaming[8][17][20][42]:

- Devices can move between access points without changing IP addresses
- Active connections (TCP sessions, video streams, VoIP calls) remain intact during transitions
- No special client configuration is required for roaming support

### Roaming Limitations

Roaming in LibreMesh has some constraints[42]:

- Roaming works only within a single BATMAN-adv cloud
- Devices cannot seamlessly roam across different mesh clouds
- Roaming performance depends partly on client device capabilities

## Performance Considerations

### Multi-Radio Configurations

For optimal performance, mesh nodes can use multiple radios[7]:

- One radio for mesh backhaul connections (ideally 5 GHz)
- Another radio for client access (typically 2.4 GHz)
- Additional radios for dedicated point-to-point links

### Network Scalability

LibreMesh networks can scale through thoughtful design[8]:

- Segmenting larger networks into multiple mesh clouds
- Using directional antennas for long-distance links
- Implementing hierarchical network structures for large deployments
- Careful gateway placement and capacity planning

## Advanced Mesh Concepts

### Quality-Based Routing

Modern mesh protocols consider link quality when making routing decisions[16]:

- Measuring packet delivery rates between nodes
- Calculating transmission times across different paths
- Adapting to changing wireless conditions
- Balancing between shortest path and highest quality

### Network Segmentation

LibreMesh supports logical segmentation of networks[8][17]:

- Creating separate mesh clouds for different areas or purposes
- Isolating broadcast domains to improve performance
- Implementing security boundaries between network segments
- Allowing for different policies in different parts of the network

## Troubleshooting Mesh Connectivity

### Common Issues and Solutions

When troubleshooting mesh networks, consider these common scenarios[56]:

1. **Visible mesh network but no internet connectivity**
   - Check if at least one root access point is connected via wired LAN
   - Verify gateway configuration is correct
   - Ensure proper routing between mesh and internet gateway

2. **Mesh network not visible**
   - Allow sufficient time (up to 5 minutes) for network initialization
   - Verify that mesh access points are on the same channel
   - Check if Spanning Tree Protocol is blocking mesh configuration

3. **Missing nodes in mesh network**
   - Ensure all nodes have the proper configuration
   - Verify wireless channel compatibility
   - Check physical placement and distance between nodes

4. **Poor performance**
   - Look for channel interference
   - Check signal strength between nodes
   - Verify antenna positioning and orientation
   - Monitor for bandwidth-intensive clients or services

## Next Steps

For practical implementation of these concepts:

- Consult [libremesh-overview.md](./libremesh-overview.md) for a broader understanding of LibreMesh
- Follow [libremesh-installation.md](./libremesh-installation.md) for hardware and installation guidance
- Reference [dns-configuration.md](./dns-configuration.md) for local service configuration

By understanding these fundamental mesh networking concepts, you'll be better equipped to design, deploy, and maintain an effective LibreMesh network that meets your community's needs.