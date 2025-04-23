# Radio Services

This directory contains Docker Compose configurations for community radio services.

## Available Services

### AzuraCast

AzuraCast is a self-hosted, all-in-one web radio management suite that makes it easy to start and manage your own Internet radio station.

#### Usage

1. Create a `.env` file with your AzuraCast credentials:
   ```
   AZURACAST_ADMIN_EMAIL=admin@example.com
   AZURACAST_ADMIN_USERNAME=admin
   AZURACAST_ADMIN_PASSWORD=password
   ```

2. Start the service:
   ```bash
   docker-compose -f azuracast-docker-compose.yml up -d
   ```

3. Access the AzuraCast interface at http://localhost:80
4. For HTTPS access, use https://localhost:8443

## Features

- Web-based station management
- Automated audio processing and encoding
- Live DJ broadcasting
- Detailed analytics and reporting
- Podcast management
- Automated station playlists
- Remote relay support

## Notes

- The initial setup may take a few minutes to complete
- AzuraCast reserves ports 8000-8099 for station broadcasts
- For production use, consider setting up a reverse proxy for SSL termination