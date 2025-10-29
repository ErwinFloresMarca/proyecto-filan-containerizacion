# Project variables
PROJECT_NAME=task-manager
COMPOSE_FILE=docker-compose.yml

# Colors for output
GREEN=\033[0;32m
BLUE=\033[0;34m
RED=\033[0;31m
NC=\033[0m # No Color

.PHONY: help install start stop restart logs clean build rebuild status health test

help: ## Show this help message
	@echo "📋 Task Manager - Available Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies for all services
	@echo "📦 Installing dependencies..."
	cd task-service && npm install
	cd user-service && npm install
	cd frontend && npm install
	@echo "✅ Dependencies installed!"

start: ## Start all services with Docker Compose
	@echo "🚀 Starting all services..."
	docker-compose up -d
	@echo "✅ All services started!"
	@echo ""
	@echo "📍 Access points:"
	@echo "  Frontend:     http://localhost:5173"
	@echo "  Task Service: http://localhost:3001"
	@echo "  User Service: http://localhost:3002"
	@echo "  Prometheus:   http://localhost:9090"
	@echo "  Grafana:      http://localhost:3005 (admin/admin)"

stop: ## Stop all services
	@echo "🛑 Stopping all services..."
	docker-compose down
	@echo "✅ All services stopped!"

restart: ## Restart all services
	@echo "🔄 Restarting all services..."
	docker-compose restart
	@echo "✅ All services restarted!"

logs: ## View logs from all services
	docker-compose logs -f

logs-task: ## View logs from task-service
	docker-compose logs -f task-service

logs-user: ## View logs from user-service
	docker-compose logs -f user-service

logs-frontend: ## View logs from frontend
	docker-compose logs -f frontend

clean: ## Stop services and remove volumes
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	@echo "✅ Cleanup completed!"

clean-all: ## Remove everything including images
	@echo "🧹 Deep cleaning..."
	docker-compose down -v --rmi all
	docker system prune -f
	@echo "✅ Deep cleanup completed!"

build: ## Build all Docker images
	@echo "🔨 Building Docker images..."
	docker-compose build
	@echo "✅ Build completed!"

rebuild: ## Rebuild and restart all services
	@echo "🔨 Rebuilding services..."
	docker-compose down
	docker-compose build
	docker-compose up -d
	@echo "✅ Rebuild completed!"

status: ## Show status of all services
	@echo "📊 Service Status:"
	docker-compose ps

health: ## Check health of all services
	@echo "🏥 Health Check:"
	@echo ""
	@echo "Task Service:"
	@curl -s http://localhost:3001/health | jq '.' || echo "❌ Not responding"
	@echo ""
	@echo "User Service:"
	@curl -s http://localhost:3002/health | jq '.' || echo "❌ Not responding"
	@echo ""

dev-task: ## Run task-service in development mode
	cd task-service && npm run start:dev

dev-user: ## Run user-service in development mode
	cd user-service && npm run start:dev

dev-frontend: ## Run frontend in development mode
	cd frontend && npm run dev

prisma-generate: ## Generate Prisma client
	cd task-service && npx prisma generate

prisma-migrate: ## Run Prisma migrations
	cd task-service && npx prisma migrate dev

prisma-studio: ## Open Prisma Studio
	cd task-service && npx prisma studio

test: ## Run tests for all services
	@echo "🧪 Running tests..."
	cd task-service && npm test
	cd user-service && npm test
	@echo "✅ Tests completed!"

init: install build start ## Initialize project (install + build + start)
	@echo "🎉 Project initialized successfully!"
	@echo ""
	@echo "📍 Access the application:"
	@echo "  http://localhost:5173"
