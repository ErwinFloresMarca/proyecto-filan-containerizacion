-- Script de inicialización de MySQL
-- Otorga permisos completos al usuario taskuser para crear y gestionar bases de datos

-- Otorgar todos los privilegios al usuario taskuser
GRANT ALL PRIVILEGES ON *.* TO 'taskuser'@'%' WITH GRANT OPTION;

-- Otorgar permisos específicos para crear bases de datos
GRANT CREATE ON *.* TO 'taskuser'@'%';
GRANT DROP ON *.* TO 'taskuser'@'%';
GRANT ALTER ON *.* TO 'taskuser'@'%';
GRANT INDEX ON *.* TO 'taskuser'@'%';
GRANT REFERENCES ON *.* TO 'taskuser'@'%';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Crear la base de datos tasks si no existe
CREATE DATABASE IF NOT EXISTS tasks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE tasks;

-- Mensaje de confirmación (aparecerá en los logs)
SELECT 'MySQL initialization completed. User taskuser has full privileges.' AS Status;
