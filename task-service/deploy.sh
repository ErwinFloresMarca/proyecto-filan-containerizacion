#!/bin/bash

echo "Desplegando imagen del servicio de tareas..."

#preguntar por version
read -p "Ingrese la versión de la imagen (por ejemplo, latest, v1.0.0): " VERSION

# Construir imagen
docker build -t dockeramiro/ucb-task-service:$VERSION .

# Publicar
docker push dockeramiro/ucb-task-service:$VERSION