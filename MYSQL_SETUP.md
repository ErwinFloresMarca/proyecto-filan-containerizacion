# 🔧 MySQL Initialization & Permissions Setup

## Resumen de Cambios

Se ha configurado MySQL para ejecutar automáticamente scripts de inicialización que otorgan permisos completos al usuario `taskuser`, permitiéndole crear y gestionar bases de datos sin restricciones.

## 📁 Archivos Creados/Modificados

### 1. Nuevos Archivos

#### `mysql-init/01-init.sql`
Script SQL de inicialización que:
- Otorga **todos los privilegios** (`ALL PRIVILEGES`) al usuario `taskuser`
- Permite al usuario otorgar permisos a otros (`WITH GRANT OPTION`)
- Otorga permisos específicos: CREATE, DROP, ALTER, INDEX, REFERENCES
- Crea la base de datos `tasks` con charset UTF-8
- Aplica los cambios con `FLUSH PRIVILEGES`

#### `mysql-init/02-seeds.sql.example`
Archivo de ejemplo para insertar datos de prueba:
- Contiene 6 tareas de ejemplo (comentadas por defecto)
- Puede ser usado después de ejecutar las migraciones de Prisma
- Proporciona una plantilla para agregar datos iniciales

#### `mysql-init/README.md`
Documentación completa sobre:
- Cómo funcionan los scripts de inicialización
- Qué permisos se otorgan
- Cómo verificar los permisos
- Cómo re-ejecutar scripts
- Cómo agregar más scripts

### 2. Archivos Modificados

#### `docker-compose.yml`
Agregado volumen de montaje en el servicio MySQL:
```yaml
volumes:
  - mysql_data:/var/lib/mysql
  - ./mysql-init:/docker-entrypoint-initdb.d  # ← Nueva línea
```

#### `README.md` (principal)
- Agregada nota sobre inicialización automática de MySQL
- Incluido directorio `mysql-init/` en la estructura del proyecto
- Agregada sección de comandos MySQL útiles
- Documentados permisos del usuario

## 🔑 Permisos Otorgados

El usuario `taskuser` ahora puede:

✅ **Gestión de Bases de Datos:**
- Crear nuevas bases de datos (`CREATE DATABASE`)
- Eliminar bases de datos (`DROP DATABASE`)
- Listar todas las bases de datos (`SHOW DATABASES`)

✅ **Gestión de Tablas:**
- Crear tablas (`CREATE TABLE`)
- Modificar estructuras (`ALTER TABLE`)
- Eliminar tablas (`DROP TABLE`)
- Crear y eliminar índices (`CREATE/DROP INDEX`)

✅ **Gestión de Datos:**
- Insertar datos (`INSERT`)
- Actualizar datos (`UPDATE`)
- Eliminar datos (`DELETE`)
- Consultar datos (`SELECT`)

✅ **Funciones Avanzadas:**
- Crear vistas (`CREATE VIEW`)
- Crear procedimientos almacenados (`CREATE PROCEDURE`)
- Crear funciones (`CREATE FUNCTION`)
- Crear triggers (`CREATE TRIGGER`)
- Otorgar permisos a otros usuarios (`GRANT`)

## 🚀 Cómo Funciona

### 1. Primera Inicialización

Cuando el contenedor de MySQL se inicia **por primera vez** (volumen vacío):

1. MySQL detecta que el directorio `/var/lib/mysql` está vacío
2. Busca scripts en `/docker-entrypoint-initdb.d/`
3. Ejecuta los scripts en orden alfabético:
   - `01-init.sql` → Otorga permisos
   - `02-seeds.sql` → Solo si existe y no es `.example`
4. Muestra mensajes de confirmación en los logs

### 2. Inicios Posteriores

Si el volumen `mysql_data` ya existe:
- ❌ Los scripts **NO** se ejecutan nuevamente
- ✅ Los permisos se mantienen persistentes
- ℹ️ Para re-ejecutar: eliminar el volumen primero

## 🔍 Verificación de Permisos

### Opción 1: Desde la línea de comandos

```bash
# Ver todos los permisos del usuario
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "SHOW GRANTS FOR 'taskuser'@'%';"
```

Salida esperada:
```
+----------------------------------------------------------------+
| Grants for taskuser@%                                          |
+----------------------------------------------------------------+
| GRANT ALL PRIVILEGES ON *.* TO `taskuser`@`%` WITH GRANT OPTION |
+----------------------------------------------------------------+
```

### Opción 2: Desde MySQL CLI

```bash
# Conectarse a MySQL
docker-compose exec mysql mysql -u taskuser -ptaskpass

# Dentro de MySQL
mysql> SHOW GRANTS;
mysql> SHOW GRANTS FOR 'taskuser'@'%';
mysql> SHOW DATABASES;
mysql> CREATE DATABASE test_db;  -- Debería funcionar
mysql> DROP DATABASE test_db;     -- Debería funcionar
```

## 🔄 Re-ejecutar Scripts de Inicialización

Si necesitas volver a ejecutar los scripts (por ejemplo, después de modificarlos):

```bash
# ADVERTENCIA: Esto eliminará TODOS los datos de MySQL

# 1. Detener y eliminar contenedores
docker-compose down

# 2. Eliminar el volumen de MySQL
docker volume rm proyectofinal_mysql_data

# 3. Volver a iniciar (scripts se ejecutarán)
docker-compose up -d mysql

# 4. Ver logs para confirmar ejecución
docker-compose logs -f mysql
```

Buscar en los logs:
```
[System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections.
MySQL initialization completed. User taskuser has full privileges.
```

## 📝 Agregar Más Scripts

### Paso 1: Crear el script

```bash
cd mysql-init
nano 03-custom-script.sql
```

### Paso 2: Escribir el SQL

```sql
-- 03-custom-script.sql
USE tasks;

-- Tu código SQL aquí
CREATE TABLE IF NOT EXISTS custom_table (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

SELECT 'Custom script executed' AS Status;
```

### Paso 3: Re-inicializar MySQL

```bash
# Eliminar volumen y reiniciar
docker-compose down
docker volume rm proyectofinal_mysql_data
docker-compose up -d mysql
```

## 🛠️ Comandos Útiles de MySQL

### Gestión de Bases de Datos

```bash
# Crear una nueva base de datos
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "CREATE DATABASE my_new_db;"

# Listar bases de datos
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "SHOW DATABASES;"

# Eliminar una base de datos
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "DROP DATABASE my_new_db;"

# Ver el tamaño de las bases de datos
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES
GROUP BY table_schema;
"
```

### Backup y Restore

```bash
# Backup de todas las bases de datos
docker-compose exec mysql mysqldump -u taskuser -ptaskpass --all-databases > backup_all.sql

# Backup de una base específica
docker-compose exec mysql mysqldump -u taskuser -ptaskpass tasks > backup_tasks.sql

# Backup con compresión
docker-compose exec mysql mysqldump -u taskuser -ptaskpass tasks | gzip > backup_tasks.sql.gz

# Restore desde backup
docker-compose exec -T mysql mysql -u taskuser -ptaskpass tasks < backup_tasks.sql

# Restore desde backup comprimido
gunzip < backup_tasks.sql.gz | docker-compose exec -T mysql mysql -u taskuser -ptaskpass tasks
```

### Información del Sistema

```bash
# Versión de MySQL
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "SELECT VERSION();"

# Variables del sistema
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "SHOW VARIABLES LIKE 'char%';"

# Estado del servidor
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "SHOW STATUS;"

# Procesos activos
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "SHOW PROCESSLIST;"

# Tamaño del servidor
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "
SELECT 
  SUM(data_length + index_length) / 1024 / 1024 AS 'Total Size (MB)'
FROM information_schema.TABLES;
"
```

## ⚠️ Consideraciones de Seguridad

### Desarrollo (Actual)
✅ Usuario con todos los permisos está bien para desarrollo local
✅ Contraseñas simples aceptables en localhost
✅ Puerto expuesto (3306) útil para herramientas de desarrollo

### Producción (Recomendaciones)
⚠️ **NO exponer el puerto 3306 públicamente**
⚠️ **Usar contraseñas fuertes** (generadas aleatoriamente)
⚠️ **Limitar permisos** según el principio de mínimo privilegio
⚠️ **Usar SSL/TLS** para conexiones
⚠️ **Habilitar audit logging**
⚠️ **Configurar firewall** adecuadamente

Ejemplo de permisos limitados para producción:
```sql
-- Solo permisos necesarios en la base de datos 'tasks'
GRANT SELECT, INSERT, UPDATE, DELETE ON tasks.* TO 'taskuser'@'%';
GRANT CREATE, ALTER, INDEX ON tasks.* TO 'taskuser'@'%';
FLUSH PRIVILEGES;
```

## 🔍 Troubleshooting

### Problema: Scripts no se ejecutan

**Síntomas:** No aparece el mensaje "MySQL initialization completed"

**Solución:**
```bash
# Verificar que el volumen esté vacío
docker volume inspect proyectofinal_mysql_data

# Eliminar y recrear
docker-compose down
docker volume rm proyectofinal_mysql_data
docker-compose up -d mysql
```

### Problema: Permisos denegados después de inicialización

**Síntomas:** `Access denied for user 'taskuser'@'%'`

**Solución:**
```bash
# Verificar permisos actuales
docker-compose exec mysql mysql -u root -prootpass -e "SHOW GRANTS FOR 'taskuser'@'%';"

# Re-otorgar permisos manualmente como root
docker-compose exec mysql mysql -u root -prootpass -e "
GRANT ALL PRIVILEGES ON *.* TO 'taskuser'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
"
```

### Problema: No puede crear bases de datos

**Síntomas:** `Access denied; you need (at least one of) the CREATE privilege(s)`

**Verificación:**
```bash
# Verificar permisos
docker-compose exec mysql mysql -u taskuser -ptaskpass -e "
SELECT user, host, Create_priv, Drop_priv 
FROM mysql.user 
WHERE user='taskuser';
"
```

Debe mostrar `Y` en Create_priv y Drop_priv.

### Problema: Script con errores

**Síntomas:** Contenedor se detiene durante la inicialización

**Solución:**
```bash
# Ver logs detallados
docker-compose logs mysql

# Validar sintaxis SQL del script
cat mysql-init/01-init.sql

# Probar script manualmente
docker-compose exec mysql mysql -u root -prootpass < mysql-init/01-init.sql
```

## 📚 Referencias

- [MySQL Docker Official Image](https://hub.docker.com/_/mysql)
- [MySQL Initialization Scripts](https://dev.mysql.com/doc/refman/8.0/en/docker-mysql-more-topics.html#docker-initialization)
- [MySQL GRANT Statement](https://dev.mysql.com/doc/refman/8.0/en/grant.html)
- [Prisma with MySQL](https://www.prisma.io/docs/concepts/database-connectors/mysql)

## ✅ Resumen

Con esta configuración:
- ✅ MySQL se inicializa automáticamente al primer arranque
- ✅ El usuario `taskuser` tiene permisos completos
- ✅ Puede crear/eliminar bases de datos sin restricciones
- ✅ Los permisos persisten entre reinicios
- ✅ Es fácil agregar scripts adicionales
- ✅ Todo está documentado y listo para usar

---

**¡MySQL está listo para desarrollo! 🚀**
