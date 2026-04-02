<template>
  <div class="admin-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'is-open': isSidebarOpen }">
      <div class="sidebar-brand">
        <NuxtLink to="/backoffice" class="brand">
          <span class="brand-z">Z</span>
          <span class="brand-text">ADMIN</span>
        </NuxtLink>
      </div>

      <nav class="sidebar-menu">
        <span class="menu-label">PRINCIPAL</span>
        <NuxtLink to="/backoffice" class="menu-item" :class="{ active: route.path === '/backoffice' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </NuxtLink>

        <span class="menu-label">GESTION</span>
        <NuxtLink to="/backoffice/events" class="menu-item" :class="{ active: route.path.startsWith('/backoffice/events') }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Événements
        </NuxtLink>
        <NuxtLink to="/backoffice/tournois" class="menu-item" :class="{ active: route.path.startsWith('/backoffice/tournois') }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Tournois
        </NuxtLink>
        <NuxtLink to="/backoffice/jeux" class="menu-item" :class="{ active: route.path.startsWith('/backoffice/jeux') }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1"/><circle cx="18" cy="13" r="1"/></svg>
          Jeux
        </NuxtLink>
        <NuxtLink to="/backoffice/joueurs" class="menu-item" :class="{ active: route.path.startsWith('/backoffice/joueurs') }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Joueurs
        </NuxtLink>
        <NuxtLink to="/backoffice/actualites" class="menu-item" :class="{ active: route.path.startsWith('/backoffice/actualites') }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Actualités
        </NuxtLink>
        <NuxtLink to="/backoffice/recompenses" class="menu-item" :class="{ active: route.path.startsWith('/backoffice/recompenses') }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          Récompenses
        </NuxtLink>

        <span class="menu-label">SYSTÈME</span>
        <NuxtLink to="/backoffice/admins" class="menu-item" :class="{ active: route.path.startsWith('/backoffice/admins') }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          Administrateurs
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="menu-item logout-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="admin-main">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger-btn" @click="toggleSidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h2 class="page-title-bar">{{ pageTitle }}</h2>
        </div>
        <div class="topbar-right">
          <div class="admin-avatar">
            <div class="avatar-circle">{{ adminInitial }}</div>
            <span class="avatar-name">{{ adminUser?.name || 'Admin' }}</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="admin-content">
        <slot />
      </main>
    </div>
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- Global Modal System -->
    <BaseModal />
  </div>
</template>

<script setup>
const route = useRoute()
const { adminUser, logout } = useAuth()

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// Fermer la sidebar lors du changement de route
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

const adminInitial = computed(() => {
  return adminUser.value?.name?.charAt(0).toUpperCase() || 'A'
})

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/backoffice') return 'Dashboard'
  if (path.includes('/events/create')) return 'Nouvel Événement'
  if (path.includes('/events')) return 'Événements'
  if (path.includes('/tournois/create')) return 'Nouveau Tournoi'
  if (path.includes('/tournois')) return 'Tournois'
  if (path.includes('/jeux/create')) return 'Nouveau Jeu'
  if (path.includes('/jeux')) return 'Jeux'
  if (path.includes('/joueurs')) return 'Joueurs'
  if (path.includes('/actualites/create')) return 'Nouvel Article'
  if (path.includes('/actualites')) return 'Actualités'
  if (path.includes('/recompenses')) return 'Récompenses'
  if (path.includes('/admins')) return 'Administrateurs'
  if (path.includes('/lieux')) return 'Gestion des Lieux'
  return 'Administration'
})
</script>

<style scoped>
/* ===== VARIABLES ===== */
.admin-wrapper {
  --sb-width: 260px;
  --topbar-h: 65px;
  --bg-dark: #0c0e1a;
  --bg-sidebar: #111427;
  --bg-card: rgba(255, 255, 255, 0.025);
  --border: rgba(255, 255, 255, 0.06);
  --accent: #00e5ff;
  --accent-glow: rgba(0, 229, 255, 0.15);
  --text: #d0d6e0;
  --text-muted: #5a6380;
  --danger: #ff4757;
  --success: #2ed573;

  display: flex;
  min-height: 100vh;
  background: var(--bg-dark);
  color: var(--text);
  font-family: 'Outfit', -apple-system, sans-serif;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: var(--sb-width);
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-brand {
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
}

.brand-z {
  font-size: 2rem;
  font-weight: 900;
  color: #ff00ed;
  text-shadow: 0 0 20px rgba(255, 0, 237, 0.5);
}

.brand-text {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  background: linear-gradient(to right, #fff, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-menu {
  flex: 1;
  padding: 1rem 0.75rem;
}

.menu-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  padding: 1.25rem 1rem 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  width: 100%;
}

.menu-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.menu-item:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.03);
}

.menu-item.active {
  color: var(--accent);
  background: var(--accent-glow);
  border-color: rgba(0, 229, 255, 0.15);
  font-weight: 600;
}

.menu-item.active svg {
  filter: drop-shadow(0 0 4px rgba(0, 229, 255, 0.6));
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--border);
}

.logout-btn {
  color: var(--danger) !important;
}
.logout-btn:hover {
  background: rgba(255, 71, 87, 0.1) !important;
}

/* ===== MAIN ===== */
.admin-main {
  flex: 1;
  margin-left: var(--sb-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== TOPBAR ===== */
.topbar {
  height: var(--topbar-h);
  background: rgba(12, 14, 26, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 90;
}

.topbar-left { display: flex; align-items: center; gap: 1rem; }

.hamburger-btn {
  display: none;
  background: transparent;
  border: 1px solid var(--border);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
}
.hamburger-btn svg { width: 22px; height: 22px; }

.page-title-bar {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #ff00ed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  color: #000;
}

.avatar-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

/* ===== CONTENT ===== */
.admin-content {
  padding: 2rem;
  flex: 1;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 95;
  backdrop-filter: blur(4px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar.is-open {
    transform: translateX(0);
  }
  .admin-main {
    margin-left: 0;
  }
  .hamburger-btn {
    display: flex;
  }
  .topbar {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .admin-content {
    padding: 1.25rem 1rem;
  }
  .avatar-name {
    display: none;
  }
  .page-title-bar {
    font-size: 1rem;
  }
}
</style>
