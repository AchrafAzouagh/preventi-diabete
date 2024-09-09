#!/bin/bash

# Kill any existing port-forwarding processes
pkill -f "kubectl port-forward" || true

# Run port-forwarding in the background
nohup kubectl port-forward svc/backend 5000:5000 --address 0.0.0.0 > backend-port-forward.log 2>&1 &
nohup kubectl port-forward svc/frontend 3000:3000 --address 0.0.0.0 > frontend-port-forward.log 2>&1 &
