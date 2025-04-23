resource "digitalocean_droplet" "casaos" {
  count    = var.create_casaos ? 1 : 0
  image    = "ubuntu-22-04-x64"
  name     = var.casaos_hostname
  region   = var.region
  size     = var.casaos_droplet_size
  ssh_keys = [digitalocean_ssh_key.community_box.fingerprint]
  tags     = [digitalocean_tag.community_box.id, "casaos"]
  
  user_data = <<-EOF
    #!/bin/bash
    
    # Update system
    apt-get update
    apt-get upgrade -y
    
    # Install required packages
    apt-get install -y curl wget git
    
    # Set hostname
    hostnamectl set-hostname ${var.casaos_hostname}
    
    # Install CasaOS
    curl -fsSL https://get.casaos.io | bash
    
    # Add a message to indicate installation is complete
    echo "CasaOS installation completed. Access the web interface at http://SERVER_IP:80" > /root/INSTALLATION_COMPLETE.txt
  EOF
  
  # Ensure the volume is properly formatted and mounted
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for cloud-init to complete...'",
      "cloud-init status --wait",
      "echo 'Cloud-init completed. CasaOS should be installed.'"
    ]
    
    connection {
      type        = "ssh"
      user        = "root"
      host        = self.ipv4_address
      private_key = file("~/.ssh/id_rsa")
    }
  }
}
