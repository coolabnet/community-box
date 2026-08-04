#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y curl wget git

# Set hostname
hostnamectl set-hostname ${hostname}

# Install CasaOS
curl -fsSL https://get.casaos.io | bash

# Add a message to indicate installation is complete
echo "CasaOS installation completed. Access the web interface at http://$(hostname -I | awk '{print $1}'):80" > /root/INSTALLATION_COMPLETE.txt

# Create a simple status check script
cat > /root/check_status.sh << 'EOF'
#!/bin/bash
if systemctl is-active --quiet casaos; then
  echo "CasaOS is installed and running!"
  systemctl status casaos --no-pager
  exit 0
else
  echo "CasaOS installation failed or not running"
  exit 1
fi
EOF
chmod +x /root/check_status.sh
