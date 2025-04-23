# Monitoring Services

This directory contains Docker Compose configurations for community network monitoring services.

## Available Services

### Speedtest Tracker

Speedtest Tracker is a self-hosted internet speed test tracker that runs speedtest checks at specified intervals and provides a dashboard to view historical results.

#### Usage

1. Create a `.env` file with your configuration:
   ```
   TZ=UTC
   GRAFANA_ADMIN_USER=admin
   GRAFANA_ADMIN_PASSWORD=admin
   ```

2. Start the service:
   ```bash
   docker-compose -f speedtest-docker-compose.yml up -d
   ```

3. Access the services:
   - Speedtest Tracker: http://localhost:8765
   - Prometheus (optional): http://localhost:9090
   - Grafana (optional): http://localhost:3000

## Features

- Scheduled internet speed tests
- Historical data tracking
- Email notifications for speed drops
- API for custom integrations
- Optional Prometheus and Grafana integration for advanced visualization

## Notes

- The first speed test will run shortly after startup
- Tests can be scheduled at custom intervals (hourly, daily, etc.)
- For accurate results, avoid running other bandwidth-intensive tasks during tests
- The service accepts the Ookla EULA automatically - make sure this complies with your usage policies