# API Documentation

## Task Service API (Port 3001)

### Base URL
```
http://localhost:3001
```

### Endpoints

#### Get All Tasks
```http
GET /tasks
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Task title",
    "description": "Task description",
    "status": "pending",
    "priority": "high",
    "userId": "user-id",
    "createdAt": "2025-10-26T10:00:00.000Z",
    "updatedAt": "2025-10-26T10:00:00.000Z"
  }
]
```

#### Get Task by ID
```http
GET /tasks/:id
```

#### Create Task
```http
POST /tasks
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "userId": "optional-user-id"
}
```

**Response:** `201 Created`

#### Update Task
```http
PATCH /tasks/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "completed"
}
```

**Response:** `200 OK`

#### Delete Task
```http
DELETE /tasks/:id
```

**Response:** `200 OK`

#### Get Task Statistics
```http
GET /tasks/stats
```

**Response:**
```json
{
  "total": 50,
  "pending": 20,
  "inProgress": 15,
  "completed": 15
}
```

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-26T10:00:00.000Z"
}
```

#### Metrics
```http
GET /metrics
```

Returns Prometheus metrics in text format.

---

## User Service API (Port 3002)

### Base URL
```
http://localhost:3002
```

### Endpoints

#### Get All Users
```http
GET /users
```

**Response:**
```json
[
  {
    "_id": "mongodb-id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "status": "active",
    "role": "Developer",
    "createdAt": "2025-10-26T10:00:00.000Z",
    "updatedAt": "2025-10-26T10:00:00.000Z"
  }
]
```

#### Get User by ID
```http
GET /users/:id
```

#### Create User
```http
POST /users
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "status": "active",
  "role": "Developer"
}
```

**Response:** `201 Created`

#### Update User
```http
PATCH /users/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "status": "inactive"
}
```

**Response:** `200 OK`

#### Delete User
```http
DELETE /users/:id
```

**Response:** `200 OK`

#### Get User Statistics
```http
GET /users/stats
```

**Response:**
```json
{
  "total": 25,
  "active": 20,
  "inactive": 3,
  "pending": 2
}
```

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-26T10:00:00.000Z"
}
```

#### Metrics
```http
GET /metrics
```

Returns Prometheus metrics in text format.

---

## Common Response Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Example Usage with curl

### Create a Task
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement feature X",
    "description": "Add new feature to the app",
    "status": "pending",
    "priority": "high"
  }'
```

### Get All Tasks
```bash
curl http://localhost:3001/tasks
```

### Update a Task
```bash
curl -X PATCH http://localhost:3001/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Create a User
```bash
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "status": "active",
    "role": "Project Manager"
  }'
```

### Get All Users
```bash
curl http://localhost:3002/users
```

## Testing with HTTPie

If you prefer HTTPie:

```bash
# Create task
http POST localhost:3001/tasks \
  title="New Task" \
  description="Task description" \
  status="pending" \
  priority="high"

# Get tasks
http GET localhost:3001/tasks

# Create user
http POST localhost:3002/users \
  name="Bob Johnson" \
  email="bob@example.com" \
  status="active"

# Get users
http GET localhost:3002/users
```
