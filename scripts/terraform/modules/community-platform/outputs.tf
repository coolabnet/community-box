output "ipv4_address" {
  description = "The public IPv4 address of the droplet"
  value       = digitalocean_droplet.platform.ipv4_address
}

output "ssh_access" {
  description = "SSH access command"
  value       = "ssh root@${digitalocean_droplet.platform.ipv4_address}"
}

output "droplet_urn" {
  description = "The droplet URN for project assignment"
  value       = digitalocean_droplet.platform.urn
}
