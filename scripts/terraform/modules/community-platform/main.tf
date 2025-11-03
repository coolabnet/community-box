resource "digitalocean_droplet" "platform" {
  image    = var.image
  name     = var.hostname
  region   = var.region
  size     = var.droplet_size
  ssh_keys = [var.ssh_key_fingerprint]
  tags     = [var.community_tag_id, var.platform_name]

  user_data = templatefile("${path.module}/user_data/${var.platform_name}.sh", {
    hostname = var.hostname
  })

  # Wait for SSH to become available
  provisioner "local-exec" {
    command = <<-EOT
      echo "Waiting for SSH to become available on ${var.platform_name}..."
      until ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ${var.ssh_private_key_path} -o ConnectTimeout=10 root@${self.ipv4_address} 'echo SSH ready'; do
        echo 'Waiting for SSH...'
        sleep 10
      done
    EOT
  }

  # Wait for cloud-init to complete
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for cloud-init to complete...'",
      "cloud-init status --wait || true",
      "echo 'Cloud-init completed. ${var.platform_name} should be installed.'"
    ]

    connection {
      type        = "ssh"
      user        = "root"
      host        = self.ipv4_address
      private_key = file(var.ssh_private_key_path)
      agent       = false
      timeout     = "15m"
    }
  }

  # Verify installation
  provisioner "remote-exec" {
    inline = var.verification_commands

    connection {
      type        = "ssh"
      user        = "root"
      host        = self.ipv4_address
      private_key = file(var.ssh_private_key_path)
      agent       = false
      timeout     = "5m"
    }
  }
}
