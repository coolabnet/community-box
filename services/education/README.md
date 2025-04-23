# Education Services

This directory contains Docker Compose configurations for educational content services.

## Available Services

### Kolibri

Kolibri is an open-source educational platform designed to provide offline access to a wide range of educational content, especially in low-resource communities.

#### Usage

1. Create a `.env` file with your Kolibri configuration:
   ```
   KOLIBRI_LANG=en
   KOLIBRI_FACILITY=Community Learning Center
   KOLIBRI_PRESET=formal
   KOLIBRI_ADMIN_USER=admin
   KOLIBRI_ADMIN_PASSWORD=password
   ```

2. Start the service:
   ```bash
   docker-compose -f kolibri-docker-compose.yml up -d
   ```

3. Access the Kolibri interface at http://localhost:8080

## Features

- Offline-first educational content platform
- Thousands of open educational resources
- Support for multiple languages
- User management with different roles (admin, coach, learner)
- Progress tracking and assessment tools
- Content synchronization between devices
- Low hardware requirements

## Content

Kolibri can be loaded with various educational channels, including:

- Khan Academy
- CK-12
- PhET Interactive Simulations
- MIT Blossoms
- African Storybook Project
- And many more

## Notes

- The first startup may take some time as Kolibri initializes its database
- To add content, you can either:
  1. Import channels from the Kolibri Studio online repository
  2. Import from a local drive with pre-downloaded content
  3. Import from another Kolibri device on the same network
- Kolibri works well in offline environments, making it ideal for community networks