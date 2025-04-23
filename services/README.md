# Community Box Services

This directory contains Docker Compose configurations for various services that can be deployed in community networks. Each subdirectory contains service-specific configurations and documentation.

## Available Service Categories

1. **[Portal](./portal/)** - Community web portals
   - TinaCMS
   - WordPress

2. **[Radio](./radio/)** - Web radio services
   - AzuraCast

3. **[Movies](./movies/)** - Video streaming services
   - Jellyfin

4. **[Monitoring](./monitoring/)** - Network monitoring tools
   - Speedtest Tracker (with optional Prometheus/Grafana)

5. **[Filtering](./filtering/)** - Content filtering and ad-blocking
   - Pi-hole
   - AdGuard Home

6. **[Education](./education/)** - Educational content platforms
   - Kolibri

7. **[Files](./files/)** - File storage and sharing
   - FileBrowser
   - Syncthing

## Usage

Each service directory contains:
- A README.md with service-specific documentation
- One or more docker-compose.yml files for different service options
- Any additional configuration files needed

To deploy a service:

1. Navigate to the service directory
2. Review the README.md for service-specific instructions
3. Create any necessary .env files with your configuration
4. Start the service using docker-compose:
   ```bash
   docker-compose -f [service]-docker-compose.yml up -d
   ```

## Testing Environment

These services have been tested on the following hardware platforms:
- Zimaboard
- Raspberry Pi 5
- Intel NUC

And with the following management platforms:
- CasaOS
- CapRover
- Yunohost
- ZimaOS
- Balena

## Notes

- Port conflicts: Be aware of potential port conflicts when running multiple services
- Resource usage: Some services may require more resources than others
- Data persistence: All services are configured to persist data in Docker volumes
- Network configuration: Some services may require specific network configurations for optimal performance
