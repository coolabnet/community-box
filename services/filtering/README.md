# Filtering Services

This directory contains Docker Compose configurations for network traffic filtering and ad-blocking services.

## Available Services

### Pi-hole

Pi-hole is a network-wide ad blocker that acts as a DNS sinkhole to block unwanted content, without requiring any client-side software.

#### Usage

1. Create a `.env` file with your Pi-hole configuration:
   ```
   TZ=UTC
   PIHOLE_PASSWORD=password
   SERVER_IP=192.168.1.10  # Replace with your server's IP
   ```

2. Start the service:
   ```bash
   docker-compose -f pihole-docker-compose.yml up -d
   ```

3. Access the Pi-hole admin interface at http://localhost:8080/admin

### AdGuard Home

AdGuard Home is a network-wide software for blocking ads & tracking. It operates as a DNS server that re-routes tracking domains to a "black hole".

#### Usage

1. Start the service:
   ```bash
   docker-compose -f adguard-docker-compose.yml up -d
   ```

2. Access the initial setup at http://localhost:3000
3. After setup, access the admin interface at http://localhost:80

## Features

**Pi-hole:**
- Network-wide ad blocking
- Detailed query logging and statistics
- Customizable blocklists
- DHCP server (optional)
- API for integration with other services

**AdGuard Home:**
- Network-wide ad and tracker blocking
- Parental controls and safe search
- DNS-over-HTTPS and DNS-over-TLS support
- Per-client settings
- Time-based access restrictions

## Notes

- You should run either Pi-hole OR AdGuard Home, not both simultaneously (they both use port 53)
- For either service to work effectively, clients should use the server as their DNS server
- Both services can function as DHCP servers, but this is optional