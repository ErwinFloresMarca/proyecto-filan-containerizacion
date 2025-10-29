<template>
  <div class="dashboard">
    <h2>📊 Dashboard</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>📋 Tasks</h3>
        <div v-if="taskStats" class="stats">
          <p><strong>Total:</strong> {{ taskStats.total }}</p>
          <p><strong>Pending:</strong> {{ taskStats.pending }}</p>
          <p><strong>In Progress:</strong> {{ taskStats.inProgress }}</p>
          <p><strong>Completed:</strong> {{ taskStats.completed }}</p>
        </div>
        <p v-else>Loading...</p>
      </div>

      <div class="stat-card">
        <h3>👥 Users</h3>
        <div v-if="userStats" class="stats">
          <p><strong>Total:</strong> {{ userStats.total }}</p>
          <p><strong>Active:</strong> {{ userStats.active }}</p>
          <p><strong>Inactive:</strong> {{ userStats.inactive }}</p>
          <p><strong>Pending:</strong> {{ userStats.pending }}</p>
        </div>
        <p v-else>Loading...</p>
      </div>
    </div>

    <div class="quick-links">
      <h3>Quick Links</h3>
      <div class="links">
        <router-link to="/tasks" class="link-button">Manage Tasks</router-link>
        <router-link to="/users" class="link-button">Manage Users</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTaskStats, getUserStats, type TaskStats, type UserStats } from '../api';

const taskStats = ref<TaskStats | null>(null);
const userStats = ref<UserStats | null>(null);

const loadStats = async () => {
  try {
    const [tasksRes, usersRes] = await Promise.all([
      getTaskStats(),
      getUserStats(),
    ]);
    taskStats.value = tasksRes.data;
    userStats.value = usersRes.data;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.stats p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.quick-links h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.link-button {
  background-color: #646cff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.link-button:hover {
  background-color: #535bf2;
}

@media (prefers-color-scheme: light) {
  .stat-card {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
  }
}
</style>
