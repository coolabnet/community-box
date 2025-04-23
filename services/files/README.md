# File Storage Services

This directory contains Docker Compose configurations for file storage and sharing services.

## Available Services

### FileBrowser

FileBrowser is a modern web-based file manager that provides a clean interface to upload, delete, preview, rename and edit your files.

#### Usage

1. Create a `.env` file with your FileBrowser configuration:
   ```
   FB_BASEURL=/
   FB_NOAUTH=false
   FB_USERNAME=admin
   FB_PASSWORD=admin
   ```

2. Create a data directory:
   ```bash
   mkdir -p ./data
   ```

3. Start the service:
   ```bash
   docker-compose -f filebrowser-docker-compose.yml up -d
   ```

4. Access the FileBrowser interface at http://localhost:8080

### Syncthing (Optional)

Syncthing is an open-source continuous file synchronization program that synchronizes files between two or more computers in real time.

#### Usage

Syncthing is included in the docker-compose file as an optional service. It shares the same data directory as FileBrowser.

1. Access the Syncthing interface at http://localhost:8384
2. Follow the setup wizard to configure devices and folders for synchronization

## Features

**FileBrowser:**
- Simple web-based file management
- User management with permissions
- File sharing via links
- File preview for images, videos, audio, and documents
- Mobile-friendly interface
- Multiple storage backends

**Syncthing:**
- Peer-to-peer file synchronization
- End-to-end encryption
- No central server required
- Cross-platform (Windows, macOS, Linux, Android)
- Automatic conflict resolution
- Version control

## Notes

- Both services can run simultaneously and complement each other
- FileBrowser is ideal for web-based access and management
- Syncthing is perfect for keeping files in sync across multiple devices
- For large files or many users, consider increasing the container resources