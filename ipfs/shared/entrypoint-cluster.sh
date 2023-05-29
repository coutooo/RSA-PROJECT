#!/bin/sh

ipfs-cluster-service init;
ipfs-cluster-service daemon --bootstrap /ip4/10.0.20.43/tcp/9096/ipfs/12D3KooWMTW9V68aFzDXL1t12psUfri93jznwEPYaY5V9DRX7DHm &
wait        