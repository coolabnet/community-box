# DNS Configuration for LibreMesh

This guide explains how to configure DNS services on LibreMesh networks to enable reliable access to local services, implement caching, and establish domain naming inside the mesh network.

## Introduction to DNS in Mesh Networks

Domain Name System (DNS) is a critical component of any network, translating human-readable domain names into IP addresses. In mesh networks, DNS configuration takes on additional importance due to:

- **Local Services**: Need to provide access to services hosted within the mesh
- **Distributed Architecture**: Multiple nodes may provide services across the network
- **Offline Operation**: Networks must function even without internet connectivity
- **Resource Constraints**: Limited hardware requires efficient DNS solutions

LibreMesh uses dnsmasq as its primary DNS service, providing a lightweight yet powerful solution for mesh networks[36][37].

`[Network Diagram with Local DNS](local-dns-diagram.png) — Schematic showing flow of local DNS queries.]`

## DNS Architecture in LibreMesh

### Components Overview

The DNS system in LibreMesh consists of several integrated components[37][38][40]:

1. **dnsmasq**: The primary DNS server and DHCP service
2. **Shared State**: Mechanism for distributing DNS information between nodes
3. **Host Configuration**: Local and network-wide hostname definitions
4. **Domain Configuration**: Settings for local domains within the mesh

### Resolution Flow

When a client on the mesh network makes a DNS query[41]:

1. The request first goes to the local dnsmasq instance on the connected node
2. If the domain is local to the mesh, it's resolved using local records
3. If it's an internet domain and cached, the cached result is returned
4. Otherwise, the query is forwarded to upstream DNS servers
5. If internet connectivity is unavailable, only local domains resolve

## Basic DNS Configuration

### Accessing DNS Settings

DNS configuration in LibreMesh can be modified through several methods[55]:

1. **Web Interface**: Limited DNS settings are available through the LibreMesh web interface
2. **UCI Configuration**: Edit settings using UCI (Unified Configuration Interface)
3. **Direct File Editing**: Modify configuration files in `/etc/config/`

### Configuration Files

The main configuration files for DNS in LibreMesh are[37][38]:

- **/etc/config/dhcp**: Contains dnsmasq configuration
- **/etc/config/lime**: Main LibreMesh configuration affecting DNS behavior
- **/etc/hosts**: Local hostname definitions
- **/etc/dnsmasq.d/**: Additional configuration fragments

`[LibreMesh DNS Config Screenshot](libremesh-dns-config.png) — Web UI or config file with DNS settings highlighted.]`

## Setting Up Local DNS Resolution

### Configuring Static Hosts

To add static host entries for local services[36][38]:

1. **Via SSH**: Connect to the LibreMesh node via SSH:
   ```
   ssh root@thisnode.info
   ```

2. **Edit Hosts File**: Add entries to `/etc/hosts`:
   ```
   vi /etc/hosts
   ```
   
   Add lines in the format:
   ```
   192.168.1.10   mediaserver.mesh
   192.168.1.20   wiki.mesh
   ```

3. **Restart DNS Service**:
   ```
   /etc/init.d/dnsmasq restart
   ```

### Using dnsmasq-distributed-hosts

LibreMesh includes a package called dnsmasq-distributed-hosts that shares hostname information across the mesh[25]:

1. **Verify Package Installation**:
   ```
   opkg list-installed | grep dnsmasq-distributed
   ```

2. **Configure Host Distribution**:
   Edit `/etc/config/lime-community` to enable host distribution:
   ```
   config lime network
       option dns_distributed_hosts '1'
   ```

3. **Add Local Services**: Register local services on their respective nodes using the hosts file

## Implementing Domain Aliases

### Custom Domain Names for Local Services

To create user-friendly domain names for local services[25]:

1. **Create Domain Aliases Configuration**:
   ```
   vi /etc/config/domain-aliases
   ```

2. **Add Domain Aliases**:
   ```
   config alias
       option domain 'community.portal'
       option target '192.168.1.100'
   
   config alias
       option domain 'local.library'
       option target '192.168.1.101'
   ```

3. **Apply Configuration**:
   ```
   /etc/init.d/domain-aliases restart
   ```

### Domain Extensions

LibreMesh typically uses these domain extensions for local services[41]:

- **.mesh**: For mesh-wide services
- **.local**: For node-specific services
- **.lan**: For local network services

## DNS Caching Configuration

### Optimizing Cache Settings

DNS caching improves performance by storing recent query results[38][40]:

1. **Edit dnsmasq Configuration**:
   ```
   vi /etc/config/dhcp
   ```

2. **Configure Cache Size**:
   ```
   config dnsmasq
       option cachesize '1000'
       option min_cache_ttl '3600'
   ```

3. **Apply Changes**:
   ```
   /etc/init.d/dnsmasq restart
   ```

### NodeLocal DNS Cache

For larger deployments, implement a node-local DNS cache to reduce query latency[40]:

1. **Install Required Packages**:
   ```
   opkg update
   opkg install dns-cache-local
   ```

2. **Configure Forwarding**:
   ```
   vi /etc/config/dns-cache-local
   ```
   
   Add:
   ```
   config dns-cache-local
       option enabled '1'
       option cache_size '10000'
   ```

3. **Restart Services**:
   ```
   /etc/init.d/dns-cache-local restart
   ```

## Offline DNS Operation

### Ensuring Local Resilience

Configure DNS to operate reliably without internet connectivity[41]:

1. **Configure Local Domain**:
   ```
   vi /etc/config/dhcp
   ```
   
   Add:
   ```
   config dnsmasq
       option local '/mesh/'
       option domain 'mesh'
       option expandhosts '1'
   ```

2. **Set Authoritative Mode**:
   ```
   config dnsmasq
       option authoritative '1'
   ```

3. **Disable DNS Forwarding When Offline**:
   ```
   config dnsmasq
       option nonwildcard '1'
       option filterwin2k '1'
   ```

## Advanced DNS Configurations

### Multiple Domain Support

To support multiple local domains[36]:

1. **Configure Domain Definitions**:
   ```
   config dnsmasq
       list local '/mesh/'
       list local '/community/'
       list local '/services/'
   ```

2. **Configure Domain Behavior**:
   ```
   config dnsmasq
       option domain 'mesh'
       option expand_hosts '1'
       option local_service '1'
   ```

### Integration with External DNS

For networks with internet connectivity[38]:

1. **Configure Upstream DNS Servers**:
   ```
   config dnsmasq
       list server '8.8.8.8'
       list server '1.1.1.1'
   ```

2. **Configure Smart Forwarding**:
   ```
   config dnsmasq
       option all_servers '1'
       option sequential_ip '1'
   ```

## Special LibreMesh DNS Features

### thisnode.info Domain

LibreMesh implements a special domain called "thisnode.info" that always resolves to the current node[41]:

1. This domain works across all nodes in the network
2. Accessing http://thisnode.info always brings up the local node's web interface
3. This feature simplifies node administration

### Shared State for DNS

LibreMesh uses a shared state system to distribute DNS information[37]:

1. **Enable Shared State**:
   ```
   config lime network
       option use_shared_state '1'
   ```

2. **Configure State Sharing**:
   ```
   config lime shared_state
       option sharing_strategy 'all'
       option shared_data 'hosts dnsmasq-lease'
   ```

## Troubleshooting DNS Issues

### Common Problems and Solutions

#### Domain Names Not Resolving

1. **Check dnsmasq Service**:
   ```
   /etc/init.d/dnsmasq status
   ```

2. **Verify Configuration**:
   ```
   cat /etc/config/dhcp
   ```

3. **Test Resolution**:
   ```
   nslookup local.service 127.0.0.1
   ```

4. **Check Logs**:
   ```
   logread | grep dnsmasq
   ```

#### DNS Propagation Issues

If DNS entries aren't propagating across the mesh:

1. **Verify Shared State**:
   ```
   cat /tmp/shared-state/dnsmasq-hosts
   ```

2. **Check Mesh Connectivity**:
   ```
   ping othernode.mesh
   ```

3. **Restart Shared State Service**:
   ```
   /etc/init.d/shared-state restart
   ```

#### Slow Resolution

For slow DNS resolution:

1. **Optimize Cache Settings**:
   ```
   config dnsmasq
       option cachesize '2000'
       option min_cache_ttl '7200'
   ```

2. **Check for DNS Leaks**:
   ```
   tcpdump -i any port 53
   ```

## Replacing dnsmasq

LibreMesh currently uses dnsmasq for both DNS and DHCP, but there are plans to separate these functions[37]:

1. **Current Status**: dnsmasq handles both DNS and DHCP in current LibreMesh versions
2. **Future Plans**: odhcpd may replace the DHCP functionality while keeping dnsmasq for DNS
3. **Compatibility**: Any changes will maintain backward compatibility with existing configurations

## Best Practices for LibreMesh DNS

### Performance Optimization

1. **Right-Size Cache**: Adjust cache size based on node memory (larger for gateway nodes)
2. **Minimize TTL Overrides**: Only override TTL for frequently accessed resources
3. **Use Local Domains**: Keep mesh-specific services under consistent domain names

### Security Considerations

1. **Restrict Zone Transfers**: Limit zone transfers to mesh nodes only
2. **Implement DNS Filtering**: Consider DNS-based content filtering for community policies
3. **Secure Configuration Files**: Protect DNS configuration from unauthorized changes

### Scalability Planning

1. **Hierarchical Structure**: For large networks, implement a hierarchical DNS structure
2. **Load Distribution**: Distribute DNS serving across multiple powerful nodes
3. **Monitoring**: Implement DNS query monitoring to identify performance issues

## Implementation Examples

### Small Community Network

For a network of 5-10 nodes:
```
config dnsmasq
    option domain 'ourcomm.mesh'
    option expandhosts '1'
    option local '/ourcomm.mesh/'
    option cachesize '500'
```

### Medium Community Network

For a network of 20-50 nodes:
```
config dnsmasq
    option domain 'communitynet.mesh'
    option expandhosts '1'
    option local '/communitynet.mesh/'
    option local '/services.communitynet.mesh/'
    option cachesize '1000'
    option all_servers '1'
```

### Large Community Network

For a network of 100+ nodes, implement hierarchical DNS with primary and secondary DNS servers on more powerful nodes.

## Next Steps

For further development of your LibreMesh network:

- Review [libremesh-overview.md](./libremesh-overview.md) for broader context
- Consult [mesh-network-basics.md](./mesh-network-basics.md) for networking fundamentals
- Follow [libremesh-installation.md](./libremesh-installation.md) for hardware and setup guidance
- Explore [captive-portal-guide.md](./captive-portal-guide.md) for user management options

By implementing a well-configured DNS system, you'll enhance the usability, performance, and resilience of your LibreMesh network, enabling seamless access to both local and internet resources.