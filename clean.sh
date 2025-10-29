#!/bin/bash

echo "🧹 Cleaning up Docker resources..."
echo ""

read -p "⚠️  This will remove all containers, volumes, and data. Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Cleanup cancelled."
    exit 1
fi

echo ""
echo "Stopping and removing containers..."
docker-compose down -v

echo "Removing Docker images..."
docker-compose down --rmi all -v

echo "Pruning unused Docker resources..."
docker system prune -f

echo ""
echo "✅ Cleanup completed successfully!"
echo ""
echo "To start again, run: ./start.sh"
