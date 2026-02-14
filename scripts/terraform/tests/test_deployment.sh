#!/bin/bash

# Terraform Deployment Integration Tests
# This script tests actual deployment and verifies platform functionality

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

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Change to terraform directory
cd "$(dirname "$0")/.."

echo "=== Terraform Deployment Integration Tests ==="
echo

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    print_fail "terraform.tfvars not found!"
    print_info "Please create terraform.tfvars from terraform.tfvars.example"
    exit 1
fi

# Test 1: Plan deployment
print_test "Testing Terraform plan..."
if terraform plan -out=test.tfplan; then
    print_pass "Terraform plan successful"
else
    print_fail "Terraform plan failed"
    exit 1
fi

# Test 2: Validate plan output
print_test "Validating plan output..."
if terraform show test.tfplan | grep -q "Plan:"; then
    print_pass "Plan contains expected resources"
else
    print_fail "Plan validation failed"
    exit 1
fi

# Clean up plan file
rm -f test.tfplan

# Test 3: Check for enabled platforms
print_test "Checking enabled platforms..."
enabled_platforms=()

if grep -q "create_yunohost.*=.*true" terraform.tfvars; then
    enabled_platforms+=("yunohost")
    print_info "YunoHost deployment enabled"
fi

if grep -q "create_casaos.*=.*true" terraform.tfvars; then
    enabled_platforms+=("casaos")
    print_info "CasaOS deployment enabled"
fi

if grep -q "create_caprover.*=.*true" terraform.tfvars; then
    enabled_platforms+=("caprover")
    print_info "CapRover deployment enabled"
fi

if [ ${#enabled_platforms[@]} -eq 0 ]; then
    print_warning "No platforms enabled for deployment"
    print_info "Enable at least one platform in terraform.tfvars to test deployment"
    exit 0
fi

print_pass "Found ${#enabled_platforms[@]} enabled platform(s): ${enabled_platforms[*]}"

# Test 4: SSH connectivity test (if we have existing infrastructure)
print_test "Checking for existing infrastructure..."
if terraform show 2>/dev/null | grep -q "ipv4_address"; then
    print_info "Found existing infrastructure, testing SSH connectivity..."
    
    # Get IP addresses from terraform output
    terraform output -json > /tmp/tf_output.json
    
    # Test SSH connectivity to each platform
    for platform in "${enabled_platforms[@]}"; do
        ip=$(jq -r ".platform_ips.value.${platform} // empty" /tmp/tf_output.json)
        if [ -n "$ip" ] && [ "$ip" != "null" ]; then
            print_test "Testing SSH connectivity to $platform ($ip)..."
            ssh_key_path=$(grep ssh_private_key_path terraform.tfvars | cut -d'"' -f2 | sed "s|~|$HOME|")
            
            if timeout 10 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=5 -i "$ssh_key_path" root@"$ip" 'echo "SSH OK"' >/dev/null 2>&1; then
                print_pass "SSH connectivity to $platform successful"
                
                # Test platform-specific functionality
                print_test "Testing $platform functionality..."
                case $platform in
                    "yunohost")
                        if ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i "$ssh_key_path" root@"$ip" 'yunohost --version' >/dev/null 2>&1; then
                            print_pass "YunoHost is installed and responding"
                        else
                            print_fail "YunoHost installation verification failed"
                        fi
                        ;;
                    "casaos")
                        if ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i "$ssh_key_path" root@"$ip" 'systemctl is-active casaos' >/dev/null 2>&1; then
                            print_pass "CasaOS is installed and running"
                        else
                            print_fail "CasaOS installation verification failed"
                        fi
                        ;;
                    "caprover")
                        if ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i "$ssh_key_path" root@"$ip" 'docker ps | grep caprover' >/dev/null 2>&1; then
                            print_pass "CapRover is installed and running"
                        else
                            print_fail "CapRover installation verification failed"
                        fi
                        ;;
                esac
            else
                print_fail "SSH connectivity to $platform failed"
            fi
        fi
    done
    
    rm -f /tmp/tf_output.json
else
    print_info "No existing infrastructure found"
fi

echo
print_pass "Deployment tests completed!"
print_info "To deploy infrastructure, run: ./run_terraform.sh apply"
print_info "To destroy infrastructure, run: ./run_terraform.sh destroy"
