resource "digitalocean_droplet" "caprover" {
  count    = var.create_caprover ? 1 : 0
  image    = "ubuntu-22-04-x64"
  name     = var.caprover_hostname
  region   = var.region
  size     = var.caprover_droplet_size
  ssh_keys = [digitalocean_ssh_key.community_box.fingerprint]
  tags     = [digitalocean_tag.community_box.id, "caprover"]

  user_data = <<-EOF
    #!/bin/bash
    
    # Update system
    apt-get update
    apt-get upgrade -y
    
    # Install required packages
    apt-get install -y curl wget git docker.io
    
    # Set hostname
    hostnamectl set-hostname ${var.caprover_hostname}
    
    # Enable and start Docker
    systemctl enable docker
    systemctl start docker
    
    # Install CapRover
    ufw allow 80,443,3000,996,7946,4789,2377/tcp
    ufw allow 7946,4789,2377/udp
    
    # Install CapRover
    docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
    
    # Add a message to indicate installation is complete
    echo "CapRover installation completed. Access the web interface at https://captain.SERVER_IP.nip.io" > /root/INSTALLATION_COMPLETE.txt
  EOF

  # Ensure the volume is properly formatted and mounted
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for cloud-init to complete...'",
      "cloud-init status --wait",
      "echo 'Cloud-init completed. CapRover should be installed.'"
    ]

    connection {
      type        = "ssh"
      user        = "root"
      host        = self.ipv4_address
      private_key = file("~/.ssh/id_rsa")
    }
  }
}
