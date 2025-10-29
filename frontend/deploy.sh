#!/bin/bash

echo "Desplegando imagen del frontend..."

#preguntar por version
read -p "Ingrese la versión de la imagen  (por ejemplo, latest, v1.0.0): " VERSION

# Construir imagen
docker build -t dockeramiro/ucb-frontend-pf:$VERSION .

# Publicar
docker push dockeramiro/ucb-frontend-pf:$VERSION