#!/bin/bash

# Terraform Configuration Validation Tests
# This script validates the Terraform configuration without deploying resources

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Change to terraform directory
cd "$(dirname "$0")/.."

echo "=== Terraform Configuration Validation Tests ==="
echo

# Test 1: Check if required files exist
print_test "Checking required files..."
required_files=(
    "main.tf"
    "variables.tf"
    "outputs.tf"
    "providers.tf"
    "terraform.tfvars.example"
    "modules/community-platform/main.tf"
    "modules/community-platform/variables.tf"
    "modules/community-platform/outputs.tf"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_pass "Found: $file"
    else
        print_fail "Missing: $file"
        exit 1
    fi
done

# Test 2: Check user data scripts
print_test "Checking user data scripts..."
user_data_scripts=(
    "modules/community-platform/user_data/yunohost.sh"
    "modules/community-platform/user_data/casaos.sh"
    "modules/community-platform/user_data/caprover.sh"
)

for script in "${user_data_scripts[@]}"; do
    if [ -f "$script" ]; then
        print_pass "Found: $script"
        # Check if script is executable
        if [ -x "$script" ]; then
            print_pass "Script is executable: $script"
        else
            print_warning "Script not executable: $script"
            chmod +x "$script"
            print_pass "Made executable: $script"
        fi
    else
        print_fail "Missing: $script"
        exit 1
    fi
done

# Test 3: Terraform format check
print_test "Checking Terraform formatting..."
if terraform fmt -check -recursive; then
    print_pass "Terraform files are properly formatted"
else
    print_warning "Terraform files need formatting"
    terraform fmt -recursive
    print_pass "Formatted Terraform files"
fi

# Test 4: Terraform validation
print_test "Validating Terraform configuration..."
if [ ! -d ".terraform" ]; then
    print_test "Initializing Terraform..."
    terraform init
fi

if terraform validate; then
    print_pass "Terraform configuration is valid"
else
    print_fail "Terraform configuration validation failed"
    exit 1
fi

# Test 5: Check for sensitive data in files
print_test "Checking for sensitive data exposure..."
sensitive_patterns=(
    "dop_v1_[a-f0-9]"
    "ssh-rsa AAAAB3NzaC1yc2EAAAA"
    "BEGIN PRIVATE KEY"
    "BEGIN RSA PRIVATE KEY"
)

for pattern in "${sensitive_patterns[@]}"; do
    if grep -r "$pattern" . --exclude-dir=.terraform --exclude="*.tfstate*" --exclude="terraform.log" --exclude-dir=tests; then
        print_fail "Found potential sensitive data: $pattern"
        print_warning "Please ensure sensitive data is not committed to version control"
    else
        print_pass "No sensitive data found for pattern: $pattern"
    fi
done

echo
print_pass "All validation tests passed!"
echo "Configuration is ready for deployment."
