# 🔧 Troubleshooting Guide

Guía de solución de problemas comunes del proyecto Task Manager.

## 📋 Tabla de Contenidos

- [Problemas con Docker](#problemas-con-docker)
- [Problemas de Base de Datos](#problemas-de-base-de-datos)
- [Problemas de Servicios](#problemas-de-servicios)
- [Problemas de Red](#problemas-de-red)
- [Problemas de Desarrollo](#problemas-de-desarrollo)

---

## Problemas con Docker

### ❌ Error: "Cannot connect to the Docker daemon"

**Síntoma:**
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Solución:**
```bash
# Verificar que Docker esté corriendo
sudo systemctl status docker

# Si no está corriendo, iniciarlo
sudo systemctl start docker

# En macOS/Windows, asegúrate de que Docker Desktop esté corriendo
```

### ❌ Error: "port is already allocated"

**Síntoma:**
```
Error: bind: address already in use
```

**Solución:**
```bash
# Verificar qué está usando el puerto
sudo lsof -i :3001  # o el puerto que esté dando problema

# Matar el proceso
kill -9 <PID>

# O cambiar el puerto en docker-compose.yml
```

### ❌ Error: "no space left on device"

**Síntoma:**
```
Error: no space left on device
```

**Solución:**
```bash
# Limpiar contenedores, imágenes y volúmenes no usados
docker system prune -a

# Limpiar volúmenes
docker volume prune

# Ver espacio usado
docker system df
```

---

## Problemas de Base de Datos

### ❌ PostgreSQL: "password authentication failed"

**Síntoma:**
```
FATAL: password authentication failed for user "taskuser"
```

**Solución:**
```bash
# 1. Verificar las credenciales en .env
cat task-service/.env

# 2. Verificar docker-compose.yml
cat docker-compose.yml | grep POSTGRES

# 3. Limpiar y recrear el volumen
docker-compose down -v
docker-compose up -d postgres
```

### ❌ MongoDB: "connection refused"

**Síntoma:**
```
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solución:**
```bash
# 1. Verificar que MongoDB esté corriendo
docker-compose ps mongodb

# 2. Ver logs de MongoDB
docker-compose logs mongodb

# 3. Reiniciar MongoDB
docker-compose restart mongodb

# 4. Si persiste, recrear el contenedor
docker-compose down
docker-compose up -d mongodb
```

### ❌ Prisma: "Can't reach database server"

**Síntoma:**
```
Error: P1001: Can't reach database server at postgres:5432
```

**Solución:**
```bash
# 1. Asegurarse de que PostgreSQL esté listo
docker-compose logs postgres

# 2. Regenerar el cliente de Prisma
cd task-service
npx prisma generate

# 3. Aplicar migraciones
npx prisma migrate deploy
```

---

## Problemas de Servicios

### ❌ Task Service no responde

**Diagnóstico:**
```bash
# Ver logs del servicio
docker-compose logs task-service

# Ver estado
docker-compose ps task-service

# Health check manual
curl http://localhost:3001/health
```

**Soluciones:**

1. **Si el servicio no está corriendo:**
```bash
docker-compose restart task-service
```

2. **Si hay errores de TypeScript:**
```bash
cd task-service
npm install
docker-compose build task-service
docker-compose up -d task-service
```

3. **Si Prisma da errores:**
```bash
cd task-service
npx prisma generate
docker-compose restart task-service
```

### ❌ User Service no responde

**Diagnóstico:**
```bash
# Ver logs
docker-compose logs user-service

# Health check
curl http://localhost:3002/health
```

**Soluciones:**

1. **Verificar conexión a MongoDB:**
```bash
docker-compose logs mongodb
docker-compose restart mongodb
docker-compose restart user-service
```

2. **Reconstruir el servicio:**
```bash
docker-compose build user-service
docker-compose up -d user-service
```

### ❌ Frontend no carga

**Diagnóstico:**
```bash
# Ver logs
docker-compose logs frontend

# Verificar acceso
curl http://localhost:5173
```

**Soluciones:**

1. **Verificar que Vite esté corriendo:**
```bash
docker-compose restart frontend
```

2. **Reconstruir el frontend:**
```bash
cd frontend
npm install
docker-compose build frontend
docker-compose up -d frontend
```

3. **Verificar variables de entorno:**
```bash
cat frontend/.env
```

---

## Problemas de Red

### ❌ CORS Error en Frontend

**Síntoma:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución:**
```bash
# Verificar configuración de CORS en los backends
# task-service/src/main.ts
# user-service/src/main.ts

# Asegurarse de que el origen esté permitido:
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  ...
});
```

### ❌ Frontend no puede conectarse a los backends

**Síntoma:**
```
Network Error
or
ERR_CONNECTION_REFUSED
```

**Diagnóstico:**
```bash
# Verificar que todos los servicios estén corriendo
docker-compose ps

# Verificar health de servicios
curl http://localhost:3001/health
curl http://localhost:3002/health

# Ver redes Docker
docker network ls
docker network inspect proyectofinal_app-network
```

**Solución:**
```bash
# Reiniciar todos los servicios
docker-compose restart

# Si persiste, recrear la red
docker-compose down
docker-compose up -d
```

---

## Problemas de Desarrollo

### ❌ npm install falla

**Solución:**
```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### ❌ TypeScript errores de compilación

**Solución:**
```bash
# Reinstalar dependencias de tipos
npm install --save-dev @types/node

# Regenerar archivos de TypeScript
npx tsc --noEmit

# Si es Prisma, regenerar cliente
npx prisma generate
```

### ❌ Hot reload no funciona

**Solución para NestJS:**
```bash
# Usar watch mode
npm run start:dev
```

**Solución para Vue:**
```bash
# Verificar configuración de Vite
cd frontend
npm run dev
```

---

## 🚨 Soluciones Rápidas

### Reset Completo del Proyecto

Si nada funciona, reset completo:

```bash
# 1. Detener todo
docker-compose down -v

# 2. Limpiar Docker
docker system prune -a
docker volume prune

# 3. Reinstalar dependencias
cd task-service && npm install && cd ..
cd user-service && npm install && cd ..
cd frontend && npm install && cd ..

# 4. Reconstruir todo
docker-compose build --no-cache

# 5. Iniciar
docker-compose up -d
```

### Verificación Rápida del Sistema

```bash
# Usar el script de status
./status.sh

# O verificar manualmente
docker-compose ps
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:5173
```

---

## 📊 Comandos de Diagnóstico

### Ver todos los logs
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f task-service
docker-compose logs -f user-service
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f mongodb
```

### Ver uso de recursos
```bash
docker stats
```

### Inspeccionar un contenedor
```bash
docker-compose exec task-service sh
# o
docker-compose exec user-service sh
```

### Verificar conectividad de red
```bash
# Desde un contenedor a otro
docker-compose exec task-service ping postgres
docker-compose exec user-service ping mongodb
```

---

## 🆘 Obtener Ayuda

Si los problemas persisten:

1. **Revisar logs detallados:**
   ```bash
   docker-compose logs -f > logs.txt
   ```

2. **Verificar versiones:**
   ```bash
   docker --version
   docker-compose --version
   node --version
   npm --version
   ```

3. **Revisar documentación:**
   - [README.md](README.md)
   - [API.md](API.md)
   - [QUICKSTART.md](QUICKSTART.md)

4. **Abrir un issue** en el repositorio con:
   - Descripción del problema
   - Logs relevantes
   - Versiones de software
   - Pasos para reproducir

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verificar:

- [ ] Docker está corriendo
- [ ] Docker Compose está instalado
- [ ] Puertos no están en uso (3001, 3002, 5173, 5432, 27017, 9090, 3005)
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas en cada servicio
- [ ] Suficiente espacio en disco
- [ ] Firewall no está bloqueando puertos

---

**Última actualización:** 2025-10-26
