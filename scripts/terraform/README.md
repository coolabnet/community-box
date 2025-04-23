# Terraform Scripts for Community Box

This directory contains Terraform scripts to deploy Digital Ocean Droplets with Yunohost, CasaOS, and CapRover installations for the Community Box project.

## Prerequisites

1. [Terraform](https://developer.hashicorp.com/terraform) installed (v1.0.0 or newer)
2. A Digital Ocean account with an API token
3. SSH key pair for accessing the Droplets

## Configuration

Create a `terraform.tfvars` file with your configuration:

```hcl
do_token           = "your_digitalocean_api_token"
region             = "nyc1"  # or your preferred region
ssh_key_name       = "community-box-key"
ssh_pub_key        = "ssh-rsa AAAA..."  # Your SSH public key content

# Optional: customize droplet sizes
yunohost_droplet_size = "s-1vcpu-1gb"
casaos_droplet_size   = "s-1vcpu-1gb"
caprover_droplet_size = "s-1vcpu-2gb"  # CapRover needs more resources

# Optional: customize hostnames
yunohost_hostname = "yunohost-community-box"
casaos_hostname   = "casaos-community-box"
caprover_hostname = "caprover-community-box"

# Optional: choose which platforms to deploy
create_yunohost = true
create_casaos   = true
create_caprover = true
```

## Usage

1. Initialize Terraform:
   ```
   terraform init
   ```

2. Preview the changes:
   ```
   terraform plan
   ```

3. Apply the changes to create the infrastructure:
   ```
   terraform apply
   ```

4. When you're done, destroy the infrastructure:
   ```
   terraform destroy
   ```

## Accessing the Platforms

After deployment, Terraform will output:
- IP addresses for each Droplet
- SSH access commands
- Web interface URLs

### Default Access Information

1. **Yunohost**:
   - Web interface: `https://<yunohost_ip>/yunohost/admin`
   - Initial setup will be required through the web interface

2. **CasaOS**:
   - Web interface: `http://<casaos_ip>:80`
   - Default credentials will be shown during the first access

3. **CapRover**:
   - Web interface: `https://captain.<caprover_ip>.nip.io`
   - Default password: `captain42`
   - You should change this immediately after first login

## Notes

- The installation process may take several minutes to complete after the Droplets are created
- Check the `/root/INSTALLATION_COMPLETE.txt` file on each Droplet to confirm installation status
- For troubleshooting, check the cloud-init logs: `/var/log/cloud-init-output.log`

## Customization

You can modify the cloud-init scripts in each `.tf` file to customize the installation process for each platform.
