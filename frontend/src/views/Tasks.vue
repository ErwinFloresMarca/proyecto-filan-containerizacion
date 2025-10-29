<template>
  <div class="tasks-page">
    <div class="header">
      <h2>📋 Tasks</h2>
      <button @click="showCreateModal = true" class="btn-primary">+ New Task</button>
    </div>

    <div v-if="loading" class="loading">Loading tasks...</div>

    <div v-else class="tasks-grid">
      <div v-for="task in tasks" :key="task.id" class="task-card" :class="`priority-${task.priority}`">
        <div class="task-header">
          <h3>{{ task.title }}</h3>
          <span class="status-badge" :class="`status-${task.status}`">
            {{ task.status }}
          </span>
        </div>
        <p v-if="task.description" class="description">{{ task.description }}</p>
        <div class="task-meta">
          <span class="priority">Priority: {{ task.priority }}</span>
          <span class="date">{{ formatDate(task.createdAt) }}</span>
        </div>
        <div class="task-actions">
          <button @click="editTask(task)" class="btn-edit">Edit</button>
          <button @click="deleteTaskConfirm(task.id)" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingTask" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingTask ? 'Edit Task' : 'Create Task' }}</h3>
        <form @submit.prevent="saveTask">
          <div class="form-group">
            <label>Title *</label>
            <input v-model="taskForm.title" type="text" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="taskForm.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="taskForm.status">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div class="form-group">
            <label>Priority</label>
            <select v-model="taskForm.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTasks, createTask, updateTask, deleteTask, type Task } from '../api';

const tasks = ref<Task[]>([]);
const loading = ref(true);
const showCreateModal = ref(false);
const editingTask = ref<Task | null>(null);
const taskForm = ref({
  title: '',
  description: '',
  status: 'pending' as 'pending' | 'in-progress' | 'completed',
  priority: 'medium' as 'low' | 'medium' | 'high',
});

const loadTasks = async () => {
  try {
    loading.value = true;
    const response = await getTasks();
    tasks.value = response.data;
  } catch (error) {
    console.error('Error loading tasks:', error);
  } finally {
    loading.value = false;
  }
};

const saveTask = async () => {
  try {
    if (editingTask.value) {
      await updateTask(editingTask.value.id, taskForm.value);
    } else {
      await createTask(taskForm.value);
    }
    await loadTasks();
    closeModal();
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

const editTask = (task: Task) => {
  editingTask.value = task;
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
  };
};

const deleteTaskConfirm = async (id: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingTask.value = null;
  taskForm.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
  };
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  loadTasks();
});
</script>

<style scoped>
.tasks-page {
  padding: 2rem 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  font-size: 2rem;
  margin: 0;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background-color: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid;
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
}

.task-card.priority-low {
  border-left-color: #4caf50;
}

.task-card.priority-medium {
  border-left-color: #ff9800;
}

.task-card.priority-high {
  border-left-color: #f44336;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.task-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-pending {
  background-color: #ff9800;
  color: white;
}

.status-in-progress {
  background-color: #2196f3;
  color: white;
}

.status-completed {
  background-color: #4caf50;
  color: white;
}

.description {
  margin: 1rem 0;
  color: rgba(255, 255, 255, 0.7);
}

.task-meta {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #646cff;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #535bf2;
}

.btn-secondary {
  background-color: #666;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-edit {
  flex: 1;
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  flex: 1;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: white;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

@media (prefers-color-scheme: light) {
  .task-card,
  .modal-content {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
  }

  .description {
    color: rgba(0, 0, 0, 0.7);
  }

  .task-meta {
    color: rgba(0, 0, 0, 0.6);
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    background-color: white;
    color: #213547;
    border-color: #ccc;
  }
}
</style>
