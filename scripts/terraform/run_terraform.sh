#!/bin/bash

# Community Box Terraform Runner
# This script runs Terraform with proper environment setup and validation

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    print_error "terraform.tfvars not found!"
    print_status "Please copy terraform.tfvars.example to terraform.tfvars and update with your values:"
    echo "  cp terraform.tfvars.example terraform.tfvars"
    echo "  nano terraform.tfvars"
    exit 1
fi

# Validate SSH key exists
SSH_KEY_PATH=$(grep ssh_private_key_path terraform.tfvars | cut -d'"' -f2 | sed "s|~|$HOME|")
if [ ! -f "$SSH_KEY_PATH" ]; then
    print_error "SSH private key not found at: $SSH_KEY_PATH"
    print_status "Please ensure your SSH key exists and update the path in terraform.tfvars"
    exit 1
fi

# Set SSH key permissions
chmod 600 "$SSH_KEY_PATH" 2>/dev/null || true

# Set Terraform logging (optional)
if [ "$TF_LOG" != "" ]; then
    export TF_LOG_PATH="terraform.log"
    print_status "Terraform logging enabled: $TF_LOG_PATH"
fi

# Initialize Terraform if needed
if [ ! -d ".terraform" ]; then
    print_status "Initializing Terraform..."
    terraform init
fi

# Run Terraform with provided arguments
print_status "Running: terraform $*"
terraform "$@"

# Show helpful output after successful apply
if [ "$1" = "apply" ] && [ $? -eq 0 ]; then
    print_success "Deployment completed!"
    print_status "To see deployment details, run:"
    echo "  terraform output"
    print_status "To destroy resources when done, run:"
    echo "  ./run_terraform.sh destroy"
fi
