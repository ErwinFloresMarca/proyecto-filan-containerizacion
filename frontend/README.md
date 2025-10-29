# Frontend - Task Manager

Aplicación frontend construida con Vue.js 3 y TypeScript.

## Tecnologías

- Vue.js 3
- TypeScript
- Vite
- Vue Router
- Axios
- Pinia

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## Configuración

Las URLs de los servicios backend se configuran en `src/api/index.ts`:

```typescript
const taskApi = axios.create({
  baseURL: 'http://localhost:3001',
});

const userApi = axios.create({
  baseURL: 'http://localhost:3002',
});
```

## Características

- Dashboard con estadísticas
- Gestión completa de tareas (CRUD)
- Gestión completa de usuarios (CRUD)
- Interfaz responsive
- Modo claro/oscuro automático
- Validación de formularios

## Rutas

- `/` - Dashboard
- `/tasks` - Gestión de tareas
- `/users` - Gestión de usuarios

## Testing

```bash
npm run test
```
