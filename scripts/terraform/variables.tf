variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc1"
}

variable "ssh_key_name" {
  description = "Name of SSH key in DigitalOcean"
  type        = string
}

variable "ssh_pub_key" {
  description = "SSH public key for Droplet access"
  type        = string
}

variable "yunohost_droplet_size" {
  description = "Size of the Yunohost Droplet"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "casaos_droplet_size" {
  description = "Size of the CasaOS Droplet"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "caprover_droplet_size" {
  description = "Size of the CapRover Droplet"
  type        = string
  default     = "s-1vcpu-2gb"
}

variable "yunohost_hostname" {
  description = "Hostname for Yunohost Droplet"
  type        = string
  default     = "yunohost-community-box"
}

variable "casaos_hostname" {
  description = "Hostname for CasaOS Droplet"
  type        = string
  default     = "casaos-community-box"
}

variable "caprover_hostname" {
  description = "Hostname for CapRover Droplet"
  type        = string
  default     = "caprover-community-box"
}

variable "create_yunohost" {
  description = "Whether to create Yunohost Droplet"
  type        = bool
  default     = true
}

variable "create_casaos" {
  description = "Whether to create CasaOS Droplet"
  type        = bool
  default     = true
}

variable "create_caprover" {
  description = "Whether to create CapRover Droplet"
  type        = bool
  default     = true
}
