# Movies Services

This directory contains Docker Compose configurations for community movie and video library services.

## Available Services

### Jellyfin

Jellyfin is a free and open-source media server software that lets you build your own streaming service for movies, TV shows, music, and more.

#### Usage

1. Create a `.env` file with your Jellyfin configuration:
   ```
   JELLYFIN_SERVER_URL=http://localhost:8096
   ```

2. Create the necessary directories for your media:
   ```bash
   mkdir -p ./media/movies ./media/tvshows
   ```

3. Start the service:
   ```bash
   docker-compose -f jellyfin-docker-compose.yml up -d
   ```

4. Access the Jellyfin interface at http://localhost:8096

## Features

- Stream movies, TV shows, music, and photos
- Live TV & DVR support
- User management with parental controls
- Mobile apps for Android and iOS
- Smart TV apps (Samsung, LG, etc.)
- Offline media sync
- Hardware transcoding support

## Notes

- For optimal performance, consider mounting media directories from a fast storage device
- Hardware transcoding requires additional configuration
- For production use, consider setting up a reverse proxy for SSL termination
- Jellyfin works well in offline environments, making it ideal for community networks