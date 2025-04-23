# Portal Services

This directory contains Docker Compose configurations for community portal services.

## Available Services

### TinaCMS

TinaCMS is a headless content management system that provides a flexible editing experience for content creators.

#### Usage

1. Create a `.env` file with your TinaCMS credentials:
   ```
   TINA_PUBLIC_CLIENT_ID=your-client-id
   TINA_TOKEN=your-token
   NEXT_PUBLIC_TINA_BRANCH=main
   ```

2. Start the service:
   ```bash
   docker-compose -f tinacms-docker-compose.yml up -d
   ```

3. Access the TinaCMS interface at http://localhost:3000

### WordPress

WordPress is a popular content management system for creating websites and blogs.

#### Usage

1. Create a `.env` file with your WordPress credentials:
   ```
   WORDPRESS_DB_USER=wordpress
   WORDPRESS_DB_PASSWORD=wordpress
   WORDPRESS_DB_NAME=wordpress
   MYSQL_ROOT_PASSWORD=rootpassword
   ```

2. Start the service:
   ```bash
   docker-compose -f wordpress-docker-compose.yml up -d
   ```

3. Access WordPress at http://localhost:8080
4. Access phpMyAdmin at http://localhost:8081

## Notes

- Both services can be run simultaneously if you adjust the port mappings to avoid conflicts.
- For production use, consider setting up a reverse proxy like Nginx or Traefik to handle SSL termination and routing.