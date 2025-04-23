output "yunohost_ipv4" {
  description = "The public IPv4 address of the Yunohost Droplet"
  value       = var.create_yunohost ? digitalocean_droplet.yunohost[0].ipv4_address : null
}

output "casaos_ipv4" {
  description = "The public IPv4 address of the CasaOS Droplet"
  value       = var.create_casaos ? digitalocean_droplet.casaos[0].ipv4_address : null
}

output "caprover_ipv4" {
  description = "The public IPv4 address of the CapRover Droplet"
  value       = var.create_caprover ? digitalocean_droplet.caprover[0].ipv4_address : null
}

output "yunohost_access" {
  description = "SSH access command for Yunohost Droplet"
  value       = var.create_yunohost ? "ssh root@${digitalocean_droplet.yunohost[0].ipv4_address}" : null
}

output "casaos_access" {
  description = "SSH access command for CasaOS Droplet"
  value       = var.create_casaos ? "ssh root@${digitalocean_droplet.casaos[0].ipv4_address}" : null
}

output "caprover_access" {
  description = "SSH access command for CapRover Droplet"
  value       = var.create_caprover ? "ssh root@${digitalocean_droplet.caprover[0].ipv4_address}" : null
}

output "yunohost_web_interface" {
  description = "Yunohost web interface URL"
  value       = var.create_yunohost ? "https://${digitalocean_droplet.yunohost[0].ipv4_address}/yunohost/admin" : null
}

output "casaos_web_interface" {
  description = "CasaOS web interface URL"
  value       = var.create_casaos ? "http://${digitalocean_droplet.casaos[0].ipv4_address}:80" : null
}

output "caprover_web_interface" {
  description = "CapRover web interface URL"
  value       = var.create_caprover ? "https://captain.${digitalocean_droplet.caprover[0].ipv4_address}.nip.io" : null
}
