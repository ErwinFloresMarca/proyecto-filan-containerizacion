<template>
  <div class="users-page">
    <div class="header">
      <h2>👥 Users</h2>
      <button @click="showCreateModal = true" class="btn-primary">+ New User</button>
    </div>

    <div v-if="loading" class="loading">Loading users...</div>

    <div v-else class="users-grid">
      <div v-for="user in users" :key="user._id" class="user-card">
        <div class="user-avatar">
          <span v-if="!user.avatar">{{ getInitials(user.name) }}</span>
          <img v-else :src="user.avatar" :alt="user.name" />
        </div>
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p class="email">{{ user.email }}</p>
          <div class="user-meta">
            <span class="status-badge" :class="`status-${user.status}`">
              {{ user.status }}
            </span>
            <span v-if="user.role" class="role">{{ user.role }}</span>
          </div>
        </div>
        <div class="user-actions">
          <button @click="editUser(user)" class="btn-edit">Edit</button>
          <button @click="deleteUserConfirm(user._id)" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingUser" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingUser ? 'Edit User' : 'Create User' }}</h3>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>Name *</label>
            <input v-model="userForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input v-model="userForm.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Avatar URL</label>
            <input v-model="userForm.avatar" type="url" />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="userForm.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div class="form-group">
            <label>Role</label>
            <input v-model="userForm.role" type="text" placeholder="e.g., Developer, Manager" />
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
import { getUsers, createUser, updateUser, deleteUser, type User } from '../api';

const users = ref<User[]>([]);
const loading = ref(true);
const showCreateModal = ref(false);
const editingUser = ref<User | null>(null);
const userForm = ref({
  name: '',
  email: '',
  avatar: '',
  status: 'active' as 'active' | 'inactive' | 'pending',
  role: '',
});

const loadUsers = async () => {
  try {
    loading.value = true;
    const response = await getUsers();
    users.value = response.data;
  } catch (error) {
    console.error('Error loading users:', error);
  } finally {
    loading.value = false;
  }
};

const saveUser = async () => {
  try {
    const data = {
      ...userForm.value,
      avatar: userForm.value.avatar || undefined,
      role: userForm.value.role || undefined,
    };
    
    if (editingUser.value) {
      await updateUser(editingUser.value._id, data);
    } else {
      await createUser(data);
    }
    await loadUsers();
    closeModal();
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    status: user.status,
    role: user.role || '',
  };
};

const deleteUserConfirm = async (id: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingUser.value = null;
  userForm.value = {
    name: '',
    email: '',
    avatar: '',
    status: 'active',
    role: '',
  };
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.users-page {
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

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background-color: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s;
}

.user-card:hover {
  transform: translateY(-2px);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin: 0 auto;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  text-align: center;
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.email {
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0;
  word-break: break-word;
}

.user-meta {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-active {
  background-color: #4caf50;
  color: white;
}

.status-inactive {
  background-color: #666;
  color: white;
}

.status-pending {
  background-color: #ff9800;
  color: white;
}

.role {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  background-color: #2196f3;
  color: white;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
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
  .user-card,
  .modal-content {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
  }

  .email {
    color: rgba(0, 0, 0, 0.7);
  }

  .form-group input,
  .form-group select {
    background-color: white;
    color: #213547;
    border-color: #ccc;
  }
}
</style>
