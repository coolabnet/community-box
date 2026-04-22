#!/bin/bash

# Update system
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

# Install required packages
DEBIAN_FRONTEND=noninteractive apt-get install -y curl wget git

# Set hostname
hostnamectl set-hostname ${hostname}

# Install Yunohost
echo "Starting YunoHost installation..."
curl https://install.yunohost.org > /root/install_yunohost.sh
chmod +x /root/install_yunohost.sh
DEBIAN_FRONTEND=noninteractive /root/install_yunohost.sh -a

# Add a message to indicate installation is complete
echo "Yunohost installation completed. Access the web admin at https://$(hostname -I | awk '{print $1}')/yunohost/admin" > /root/INSTALLATION_COMPLETE.txt

# Create a simple status check script
cat > /root/check_status.sh << 'EOF'
#!/bin/bash
if [ -f /usr/bin/yunohost ]; then
  echo "YunoHost is installed and ready!"
  yunohost --version
  exit 0
else
  echo "YunoHost installation failed"
  exit 1
fi
EOF
chmod +x /root/check_status.sh
