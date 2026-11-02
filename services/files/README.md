# File Storage Services

This directory contains Docker Compose configurations for file storage and sharing services.

## Available Services

### FileBrowser Quantum

[FileBrowser Quantum](https://github.com/gtsteffaniak/filebrowser) is a web file manager. People can upload, preview, rename, share and edit files from a browser. It is the maintained fork of FileBrowser; the original project was archived on 2026-09-01 and gets no more security fixes.

The image is `gtstef/filebrowser`. The compose file uses the `stable` tag, which includes FFmpeg and document previews. Set `FB_TAG=2.0.2-stable` (or a newer release) to pin a version. On small boxes, `FB_TAG=stable-slim` is much smaller: it drops media and document previews and also runs on 32-bit ARM.

#### Usage

1. Create the folders. `data/` holds the shared files. `filebrowser/` holds the configuration, database and cache.
   ```bash
   mkdir -p ./data ./filebrowser
   sudo chown -R 1000:1000 ./data ./filebrowser
   ```

2. Copy the example configuration:
   ```bash
   cp config.example.yaml ./filebrowser/config.yaml
   ```

3. Start the service:
   ```bash
   docker compose -f filebrowser-docker-compose.yml up -d filebrowser
   ```

4. Find the one-time admin password in the logs:
   ```bash
   docker compose -f filebrowser-docker-compose.yml logs filebrowser 2>&1 | grep -i "initial admin password"
   ```
   You can set `FB_ADMIN_PASSWORD` in a `.env` file instead. FileBrowser applies that password again on every start, so remove it after setup if you change the password in the web interface.

5. Open http://localhost:8080 (or `http://<box-address>:8080`). Sign in as `admin`. FileBrowser asks you to choose a new password on the first sign-in.

With rootless Docker, the container user 1000 is not your host user. In that case, change `user:` in the `filebrowser` service to `"0:0"`, and skip the `sudo chown` in step 1. Rootless Docker maps the container root user to your host user.

### Syncthing (Optional)

Syncthing is an open-source continuous file synchronization program that synchronizes files between two or more computers in real time.

#### Usage

Syncthing is included in the docker-compose file as an optional service. It shares the same `./data` directory as FileBrowser Quantum.

1. Access the Syncthing interface at http://localhost:8384
2. Follow the setup wizard to configure devices and folders for synchronization

## Features

**FileBrowser Quantum:**
- Web-based file management
- User management with permissions
- File sharing via links
- File preview for images, videos, audio, and documents
- Indexed search
- Mobile-friendly interface

**Syncthing:**
- Peer-to-peer file synchronization
- End-to-end encryption
- No central server required
- Cross-platform (Windows, macOS, Linux, Android)
- Automatic conflict resolution
- Version control

## Notes

- Both services can run simultaneously and complement each other
- FileBrowser Quantum is for web-based access and management
- Syncthing is perfect for keeping files in sync across multiple devices
- FileBrowser Quantum lists 512 MB of RAM as its minimum. In our test it used about 36 MB while idle.
- For large files or many users, give the containers more resources
