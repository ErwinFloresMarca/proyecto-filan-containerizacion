# User Service

Microservicio de gestión de usuarios construido con NestJS y Mongoose.

## Tecnologías

- NestJS
- Mongoose
- MongoDB
- TypeScript
- prom-client (métricas)

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` basado en `.env.example`:

```env
MONGODB_URI="mongodb://localhost:27017/users"
PORT=3002
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## API Endpoints

- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `POST /users` - Crear usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario
- `GET /users/stats` - Estadísticas
- `GET /health` - Health check
- `GET /metrics` - Métricas Prometheus

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```
