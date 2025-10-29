# 📋 Task Manager - Microservices Architecture

Sistema de gestión de tareas construido con arquitectura de microservicios, utilizando Vue.js, NestJS, MySQL, MongoDB, Prometheus y Grafana.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Task Service  │───▶│     MySQL       │
│   (Vue.js)      │    │   (NestJS)      │    │   (Tasks)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       
         │                       
         ▼                       
┌─────────────────┐    ┌─────────────────┐    
│   User Service  │───▶│    MongoDB      │    
│   (NestJS)      │    │   (Users)       │    
└─────────────────┘    └─────────────────┘    
         │                       │             
         └───────────────────────┼───────────────────┐
                                 │                   │
                 ┌───────────────┼───────────────┐   │
                 │               │               │   │
         ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
         │ Prometheus  │ │   Grafana   │ │   Network   │
         │             │ │             │ │             │
         └─────────────┘ └─────────────┘ └─────────────┘
```

## 🚀 Tecnologías

### Frontend
- **Vue.js 3** - Framework progresivo de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool rápido
- **Axios** - Cliente HTTP
- **Vue Router** - Enrutamiento
- **Pinia** - State management

### Backend - Task Service
- **NestJS** - Framework progresivo de Node.js
- **Prisma ORM** - ORM moderno para TypeScript
- **MySQL** - Base de datos relacional
- **prom-client** - Métricas para Prometheus

### Backend - User Service
- **NestJS** - Framework progresivo de Node.js
- **Mongoose** - ODM para MongoDB
- **MongoDB** - Base de datos NoSQL
- **prom-client** - Métricas para Prometheus

### Monitoring
- **Prometheus** - Sistema de monitoreo y alertas
- **Grafana** - Plataforma de análisis y visualización

### Infrastructure
- **Docker** - Contenedores
- **Docker Compose** - Orquestación de contenedores

## 📁 Estructura del Proyecto

```
proyecto-final/
├── frontend/                 # Aplicación Vue.js
│   ├── src/
│   │   ├── api/             # Clientes API
│   │   ├── views/           # Componentes de vistas
│   │   ├── router/          # Configuración de rutas
│   │   ├── App.vue          # Componente principal
│   │   └── main.ts          # Punto de entrada
│   ├── Dockerfile
│   └── package.json
│
├── task-service/            # Microservicio de tareas
│   ├── prisma/
│   │   └── schema.prisma    # Esquema de base de datos
│   ├── src/
│   │   ├── tasks/           # Módulo de tareas
│   │   ├── metrics/         # Módulo de métricas
│   │   ├── health/          # Health checks
│   │   ├── prisma/          # Servicio Prisma
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── user-service/            # Microservicio de usuarios
│   ├── src/
│   │   ├── users/           # Módulo de usuarios
│   │   │   ├── schemas/     # Esquemas Mongoose
│   │   │   └── dto/         # Data Transfer Objects
│   │   ├── metrics/         # Módulo de métricas
│   │   ├── health/          # Health checks
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── monitoring/              # Configuración de monitoreo
│   ├── prometheus.yml       # Config de Prometheus
│   ├── dashboards/          # Dashboards de Grafana
│   │   ├── dashboard.yml
│   │   └── microservices.json
│   └── datasources/         # Datasources de Grafana
│       └── prometheus.yml
│
├── mysql-init/              # Scripts de inicialización MySQL
│   ├── 01-init.sql          # Script principal (permisos)
│   ├── 02-seeds.sql.example # Datos de prueba (opcional)
│   └── README.md            # Documentación de scripts
│
├── docker-compose.yml       # Orquestación de servicios
└── README.md               # Esta documentación
```

## 🔧 Requisitos Previos

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Node.js** >= 18 (para desarrollo local)
- **npm** o **yarn**

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker Compose (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd proyectoFinal
```

2. **Iniciar todos los servicios**
```bash
docker-compose up -d
```

> **Nota:** MySQL se inicializará automáticamente con el script en `mysql-init/01-init.sql` que otorga permisos completos al usuario `taskuser` para crear y gestionar bases de datos.

3. **Ver logs de los servicios**
```bash
docker-compose logs -f
```

4. **Servicios disponibles:**
   - **Frontend:** http://localhost:5173
   - **Task Service:** http://localhost:3001
   - **User Service:** http://localhost:3002
   - **Prometheus:** http://localhost:9090
   - **Grafana:** http://localhost:3005 (user: admin, pass: admin)
   - **MySQL:** localhost:3306
   - **MongoDB:** localhost:27017

### Opción 2: Desarrollo Local

#### Task Service

```bash
cd task-service
npm install
cp .env.example .env
# Editar .env con las credenciales de MySQL
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

#### User Service

```bash
cd user-service
npm install
cp .env.example .env
# Editar .env con las credenciales de MongoDB
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Task Service (Port 3001)

#### Tasks
- `GET /tasks` - Listar todas las tareas
- `GET /tasks/:id` - Obtener una tarea específica
- `POST /tasks` - Crear una nueva tarea
- `PATCH /tasks/:id` - Actualizar una tarea
- `DELETE /tasks/:id` - Eliminar una tarea
- `GET /tasks/stats` - Obtener estadísticas de tareas

#### Métricas y Salud
- `GET /health` - Health check
- `GET /metrics` - Métricas de Prometheus

**Ejemplo de creación de tarea:**
```json
POST /tasks
{
  "title": "Implementar autenticación",
  "description": "Añadir JWT authentication",
  "status": "pending",
  "priority": "high",
  "userId": "user-id-optional"
}
```

### User Service (Port 3002)

#### Users
- `GET /users` - Listar todos los usuarios
- `GET /users/:id` - Obtener un usuario específico
- `POST /users` - Crear un nuevo usuario
- `PATCH /users/:id` - Actualizar un usuario
- `DELETE /users/:id` - Eliminar un usuario
- `GET /users/stats` - Obtener estadísticas de usuarios

#### Métricas y Salud
- `GET /health` - Health check
- `GET /metrics` - Métricas de Prometheus

**Ejemplo de creación de usuario:**
```json
POST /users
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "avatar": "https://avatar.url/image.jpg",
  "status": "active",
  "role": "Developer"
}
```

## 📊 Monitoring

### Prometheus

Accede a Prometheus en http://localhost:9090

**Queries útiles:**
- `rate(http_requests_total[5m])` - Rate de requests HTTP
- `http_request_duration_seconds` - Duración de requests
- `process_cpu_user_seconds_total` - Uso de CPU
- `process_resident_memory_bytes` - Uso de memoria

### Grafana

Accede a Grafana en http://localhost:3005
- **Usuario:** admin
- **Contraseña:** admin

El dashboard "Microservices Dashboard" incluye:
- HTTP Request Rate por servicio
- HTTP Request Duration (p95)
- CPU Usage
- Memory Usage

## 🔨 Comandos Útiles

### Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f [service-name]

# Reconstruir imágenes
docker-compose build

# Reiniciar un servicio
docker-compose restart [service-name]

# Ver estado de servicios
docker-compose ps

# Limpiar volúmenes (¡cuidado! elimina datos)
docker-compose down -v
```

### Prisma (Task Service)

```bash
cd task-service

# Generar cliente de Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name migration-name

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio
```

### MySQL

```bash
# Conectarse a MySQL como taskuser
docker-compose exec mysql mysql -u taskuser -ptaskpass

# Conectarse a una base de datos específica
docker-compose exec mysql mysql -u taskuser -ptaskpass tasks

# Verificar permisos del usuario
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "SHOW GRANTS FOR 'taskuser'@'%';"

# Ver bases de datos
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "SHOW DATABASES;"

# Ejecutar un script SQL
docker-compose exec mysql mysql -u taskuser -ptaskpass tasks < script.sql

# Backup de la base de datos
docker-compose exec mysql mysqldump -u taskuser -ptaskpass tasks > backup.sql

# Restaurar desde backup
docker-compose exec -T mysql mysql -u taskuser -ptaskpass tasks < backup.sql
```

> **Nota:** El usuario `taskuser` tiene permisos completos otorgados automáticamente por el script `mysql-init/01-init.sql`, incluyendo la capacidad de crear nuevas bases de datos.

## 🧪 Testing

### Task Service
```bash
cd task-service
npm run test
npm run test:e2e
npm run test:cov
```

### User Service
```bash
cd user-service
npm run test
npm run test:e2e
npm run test:cov
```

### Frontend
```bash
cd frontend
npm run test
```

## 🔐 Variables de Entorno

### Task Service
```env
DATABASE_URL=mysql://taskuser:taskpass@localhost:3306/tasks
PORT=3001
```

### User Service
```env
MONGODB_URI=mongodb://localhost:27017/users
PORT=3002
```

### Frontend
```env
VITE_TASK_SERVICE_URL=http://localhost:3001
VITE_USER_SERVICE_URL=http://localhost:3002
```

## 🎯 Características Implementadas

✅ Arquitectura de microservicios
✅ Frontend con Vue.js 3 + TypeScript
✅ Backend con NestJS + TypeScript
✅ Base de datos MySQL con Prisma ORM
✅ Base de datos MongoDB con Mongoose
✅ API RESTful completa
✅ Health checks en todos los servicios
✅ Métricas con Prometheus
✅ Dashboards con Grafana
✅ CORS habilitado
✅ Validación de datos con class-validator
✅ Docker y Docker Compose
✅ Manejo de errores
✅ Interfaz de usuario responsive

## 📝 Próximas Mejoras

- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Logs centralizados (ELK Stack)
- [ ] Testing completo (unit + integration)
- [ ] CI/CD pipeline
- [ ] API Gateway
- [ ] Service mesh (Istio)
- [ ] Cache con Redis
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Búsqueda avanzada

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autor

Proyecto de Maestría - Módulo 9

## 🐛 Troubleshooting

### Error: Cannot connect to MySQL
- Verifica que MySQL esté corriendo: `docker-compose ps`
- Revisa los logs: `docker-compose logs mysql`
- Asegúrate de que el puerto 3306 no esté en uso

### Error: Cannot connect to MongoDB
- Verifica que MongoDB esté corriendo: `docker-compose ps`
- Revisa los logs: `docker-compose logs mongodb`
- Asegúrate de que el puerto 27017 no esté en uso

### Error: Frontend no puede conectarse a los backends
- Verifica que los servicios estén corriendo
- Revisa la configuración de CORS en los backends
- Asegúrate de que las URLs en el frontend sean correctas

### Error: Prisma Client not generated
```bash
cd task-service
npx prisma generate
```

## 📞 Soporte

Para reportar bugs o solicitar features, por favor abre un issue en el repositorio.

---

**Happy Coding! 🚀**
