#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y curl wget git docker.io ufw

# Set hostname
hostnamectl set-hostname ${hostname}

# Enable and start Docker
systemctl enable docker
systemctl start docker

# Configure firewall for CapRover
ufw --force enable
ufw allow 80,443,3000,996,7946,4789,2377/tcp
ufw allow 7946,4789,2377/udp

# Install CapRover
docker run -d \
  --name captain-captain \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover

# Wait for CapRover to start
sleep 30

# Add a message to indicate installation is complete
echo "CapRover installation completed. Access the web interface at https://captain.$(hostname -I | awk '{print $1}').nip.io" > /root/INSTALLATION_COMPLETE.txt

# Create a simple status check script
cat > /root/check_status.sh << 'EOF'
#!/bin/bash
if docker ps | grep -q caprover; then
  echo "CapRover is installed and running!"
  docker ps | grep caprover
  exit 0
else
  echo "CapRover installation failed or not running"
  exit 1
fi
EOF
chmod +x /root/check_status.sh
