resource "digitalocean_droplet" "yunohost" {
  count    = var.create_yunohost ? 1 : 0
  image    = "debian-12-x64"
  name     = var.yunohost_hostname
  region   = var.region
  size     = var.yunohost_droplet_size
  ssh_keys = [digitalocean_ssh_key.community_box.fingerprint]
  tags     = [digitalocean_tag.community_box.id, "yunohost"]
  
  user_data = <<-EOF
    #!/bin/bash
    
    # Update system
    apt-get update
    apt-get upgrade -y
    
    # Install required packages
    apt-get install -y curl wget git
    
    # Set hostname
    hostnamectl set-hostname ${var.yunohost_hostname}
    
    # Install Yunohost
    curl https://install.yunohost.org | bash -s -- -a
    
    # Add a message to indicate installation is complete
    echo "Yunohost installation completed. Access the web admin at https://SERVER_IP/yunohost/admin" > /root/INSTALLATION_COMPLETE.txt
  EOF
  
  # Ensure the volume is properly formatted and mounted
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for cloud-init to complete...'",
      "cloud-init status --wait",
      "echo 'Cloud-init completed. Yunohost should be installed.'"
    ]
    
    connection {
      type        = "ssh"
      user        = "root"
      host        = self.ipv4_address
      private_key = file("~/.ssh/id_rsa")
    }
  }
}
