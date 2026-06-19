#!/bin/bash

# This script tests SSH connectivity to a given IP address
# Usage: ./test_ssh.sh <ip_address> [ssh_key_path]

if [ -z "$1" ]; then
  echo "Usage: $0 <ip_address> [ssh_key_path]"
  exit 1
fi

IP_ADDRESS=$1
SSH_KEY="${2:-${HOME}/.ssh/id_rsa}"

echo "Testing SSH connectivity to $IP_ADDRESS using key $SSH_KEY..."

# Test with verbose output
ssh -v -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=10 -i "$SSH_KEY" root@$IP_ADDRESS "echo SSH connection successful"

# Check the exit code
if [ $? -eq 0 ]; then
  echo "SSH connection test passed!"
  exit 0
else
  echo "SSH connection test failed!"
  exit 1
fi
