#!/bin/bash

# Community Box Terraform Test Suite
# This script runs all tests to validate the Terraform configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
    echo
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Change to script directory
cd "$(dirname "$0")"

print_header "Community Box Terraform Test Suite"

# Test 1: Configuration Validation
print_info "Running configuration validation tests..."
if ./tests/validate_config.sh; then
    print_success "Configuration validation passed"
else
    print_error "Configuration validation failed"
    exit 1
fi

# Test 2: Deployment Tests
print_info "Running deployment tests..."
if ./tests/test_deployment.sh; then
    print_success "Deployment tests passed"
else
    print_error "Deployment tests failed"
    exit 1
fi

# Test 3: Security Check
print_info "Running security checks..."
security_issues=0

# Check for .gitignore
if [ ! -f ".gitignore" ]; then
    print_error "Missing .gitignore file"
    security_issues=$((security_issues + 1))
else
    print_success ".gitignore file exists"
fi

# Check if terraform.tfvars is ignored
if [ -f ".gitignore" ] && grep -q "terraform.tfvars" .gitignore; then
    print_success "terraform.tfvars is properly ignored"
else
    print_error "terraform.tfvars should be in .gitignore"
    security_issues=$((security_issues + 1))
fi

# Check for example file
if [ -f "terraform.tfvars.example" ]; then
    print_success "Example configuration file exists"
else
    print_error "Missing terraform.tfvars.example"
    security_issues=$((security_issues + 1))
fi

if [ $security_issues -eq 0 ]; then
    print_success "Security checks passed"
else
    print_error "Security checks failed ($security_issues issues)"
    exit 1
fi

# Test 4: Documentation Check
print_info "Checking documentation..."
doc_issues=0

if [ -f "README.md" ]; then
    print_success "README.md exists"
else
    print_error "Missing README.md"
    doc_issues=$((doc_issues + 1))
fi

if [ $doc_issues -eq 0 ]; then
    print_success "Documentation checks passed"
else
    print_error "Documentation checks failed ($doc_issues issues)"
fi

print_header "Test Summary"
print_success "All tests completed successfully!"
echo
print_info "Next steps:"
echo "1. Copy terraform.tfvars.example to terraform.tfvars"
echo "2. Update terraform.tfvars with your actual values"
echo "3. Run: ./run_terraform.sh plan"
echo "4. Run: ./run_terraform.sh apply"
echo
print_info "For help, see the README.md file"
