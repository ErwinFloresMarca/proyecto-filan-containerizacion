#!/bin/bash
# Iniciar sesión en Docker Hub
./user-service/deploy.sh
./task-service/deploy.sh
./frontend/deploy.sh