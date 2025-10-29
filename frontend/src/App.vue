<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-content">
        <h1>📋 Task Manager</h1>
        <div class="nav-links">
          <router-link to="/">Dashboard</router-link>
          <router-link to="/tasks">Tasks</router-link>
          <router-link to="/users">Users</router-link>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.navbar {
  background-color: #1a1a1a;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-content h1 {
  font-size: 1.5rem;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.87);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background-color: #646cff;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

@media (prefers-color-scheme: light) {
  .navbar {
    background-color: #f9f9f9;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .nav-links a {
    color: #213547;
  }
}
</style>
