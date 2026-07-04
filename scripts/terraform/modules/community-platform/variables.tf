variable "platform_name" {
  description = "Name of the platform (yunohost, casaos, caprover)"
  type        = string
}

variable "image" {
  description = "DigitalOcean image to use"
  type        = string
}

variable "hostname" {
  description = "Hostname for the droplet"
  type        = string
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
}

variable "droplet_size" {
  description = "Size of the droplet"
  type        = string
}

variable "ssh_key_fingerprint" {
  description = "SSH key fingerprint"
  type        = string
}

variable "ssh_private_key_path" {
  description = "Path to SSH private key file"
  type        = string
}

variable "community_tag_id" {
  description = "Community box tag ID"
  type        = string
}

variable "verification_commands" {
  description = "Commands to verify the platform installation"
  type        = list(string)
  default     = ["echo 'Installation verification completed'"]
}
