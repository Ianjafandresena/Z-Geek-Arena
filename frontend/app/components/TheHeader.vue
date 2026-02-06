<template>
  <header :class="['header', { 'is-scrolled': isScrolled }]">
    <div class="container header-container">
      <div class="logo">
        <NuxtLink to="/" class="brand-link">
          <span class="z-ancient">Z</span>
          <span class="brand-text">GEEK ARENA</span>
        </NuxtLink>
      </div>

      <!-- Navigation Desktop uniquement -->
      <nav class="nav">
        <NuxtLink to="/events" class="nav-link">Événements</NuxtLink>
        <NuxtLink to="/actualites" class="nav-link">Actualités</NuxtLink>
        <NuxtLink to="/recompenses" class="nav-link">Récompenses</NuxtLink>
        <NuxtLink to="/#about" class="nav-link">À Propos</NuxtLink>
      </nav>

      <div class="actions">
        <!-- Bouton desktop -->
        <button class="btn-primary desktop-only">S'inscrire</button>
        
        <!-- Bouton Hamburger Mobile uniquement -->
        <button class="hamburger mobile-only" @click="toggleMenu" aria-label="Menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Overlay Mobile - en dehors du header -->
  <Teleport to="body">
    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>
    
    <!-- Sidebar Mobile -->
    <aside class="mobile-sidebar" :class="{ 'is-open': isMenuOpen }">
      <div class="sidebar-header">
        <NuxtLink to="/" class="sidebar-brand" @click="closeMenu">
          <span class="z-ancient">Z</span>
          <span>GEEK ARENA</span>
        </NuxtLink>
        <button class="close-btn" @click="closeMenu" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink to="/events" class="sidebar-link" @click="closeMenu">
          Événements
        </NuxtLink>
        <NuxtLink to="/actualites" class="sidebar-link" @click="closeMenu">
          Actualités
        </NuxtLink>
        <NuxtLink to="/recompenses" class="sidebar-link" @click="closeMenu">
          Récompenses
        </NuxtLink>
        <NuxtLink to="/#about" class="sidebar-link" @click="closeMenu">
          À Propos
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-primary sidebar-cta" @click="closeMenu">S'inscrire</button>
      </div>
    </aside>
  </Teleport>
</template>

<script setup>
const isScrolled = ref(false)
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

if (process.client) {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
}
</script>

<style scoped>
/* ===== HEADER DE BASE (DESKTOP) ===== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: all 0.3s ease;
  background: transparent;
}

.header.is-scrolled {
  background: rgba(0, 0, 0, 0.9);
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-link {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.brand-text {
  background: linear-gradient(to right, #fff, var(--accent-cyan));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== NAV DESKTOP ===== */
.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.nav-link:hover {
  opacity: 1;
  color: var(--accent-magenta);
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ===== HAMBURGER (CACHÉ PAR DÉFAUT) ===== */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  padding: 10px;
  gap: 5px;
}

.hamburger-line {
  width: 22px;
  height: 2px;
  background: white;
  border-radius: 2px;
}

/* ===== MOBILE-ONLY / DESKTOP-ONLY ===== */
.mobile-only {
  display: none !important;
}

.desktop-only {
  display: inline-flex;
}

/* ===== OVERLAY ===== */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9998;
}

/* ===== SIDEBAR (CACHÉ PAR DÉFAUT) ===== */
.mobile-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  max-width: 85vw;
  height: 100vh;
  background: #0a0a0a;
  border-left: 1px solid rgba(255, 0, 237, 0.4);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.mobile-sidebar.is-open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-brand {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: white;
}

.close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* ===== SIDEBAR NAV ===== */
.sidebar-nav {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-link {
  display: block;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  background: rgba(255, 0, 237, 0.1);
  border-color: rgba(255, 0, 237, 0.3);
}

/* ===== SIDEBAR FOOTER ===== */
.sidebar-footer {
  padding: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-cta {
  width: 100%;
  padding: 1rem;
  font-size: 0.95rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .nav {
    gap: 1.25rem;
  }
  
  .nav-link {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  /* Cacher nav et bouton desktop */
  .nav {
    display: none;
  }
  
  .desktop-only {
    display: none !important;
  }
  
  /* Afficher hamburger */
  .mobile-only {
    display: flex !important;
  }
  
  .brand-link {
    font-size: 1.4rem;
  }
  
  .header {
    padding: 1rem 0;
  }
  
  .header.is-scrolled {
    padding: 0.75rem 0;
  }
}

@media (max-width: 480px) {
  .brand-link {
    font-size: 1.2rem;
  }
  
  .hamburger {
    width: 40px;
    height: 40px;
  }
  
  .mobile-sidebar {
    width: 260px;
  }
}
</style>
