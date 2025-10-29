# Task Service

Microservicio de gestión de tareas construido con NestJS y Prisma ORM.

## Tecnologías

- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript
- prom-client (métricas)

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` basado en `.env.example`:

```env
DATABASE_URL="postgresql://taskuser:taskpass@localhost:5432/tasks?schema=public"
PORT=3001
```

## Base de datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Abrir Prisma Studio
npx prisma studio
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

- `GET /tasks` - Listar tareas
- `GET /tasks/:id` - Obtener tarea
- `POST /tasks` - Crear tarea
- `PATCH /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea
- `GET /tasks/stats` - Estadísticas
- `GET /health` - Health check
- `GET /metrics` - Métricas Prometheus

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```
