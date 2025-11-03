resource "digitalocean_ssh_key" "community_box" {
  name       = var.ssh_key_name
  public_key = var.ssh_pub_key
}

# Create a new tag for all community box resources
resource "digitalocean_tag" "community_box" {
  name = "community-box"
}

# Create a project for all community box resources
resource "digitalocean_project" "community_box" {
  name        = "Community Box"
  description = "Community Box project for self-hosting platforms comparison"
  purpose     = "Testing / Development"
  environment = "Development"
  resources = concat(
    var.create_yunohost ? [digitalocean_droplet.yunohost[0].urn] : [],
    var.create_casaos ? [digitalocean_droplet.casaos[0].urn] : [],
    var.create_caprover ? [digitalocean_droplet.caprover[0].urn] : []
  )
}
