<template>
  <div class="event-card">
    <div class="card-image">
      <div class="image-placeholder" :style="{ background: gradient }">
        <div class="status-badge">{{ status }}</div>
      </div>
    </div>
    <div class="card-content">
      <div class="event-meta">
        <span class="location">{{ location }}</span>
        <span class="date">{{ date }}</span>
      </div>
      <h3 class="event-name">{{ name }}</h3>
      <div class="card-footer">
        <NuxtLink :to="`/events/${slug}`" class="btn-go">
          <span class="btn-text">GO</span>
          <span class="btn-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  slug: String,
  name: String,
  location: String,
  date: String,
  status: {
    type: String,
    default: 'À VENIR'
  },
  gradient: {
    type: String,
    default: 'linear-gradient(45deg, #1a1a1a, #333)'
  }
})
</script>

<style scoped>
.event-card {
  background: var(--bg-accent);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 0, 237, 0.5);
  box-shadow: 0 0 30px rgba(255, 0, 237, 0.2);
  position: relative;
}

.card-image {
  height: 220px;
  position: relative;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.status-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.4rem 1rem;
  background: rgba(0, 0, 0, 0.85);
  font-size: 0.75rem;
  font-weight: 800;
  border-radius: 4px;
  border-left: 3px solid var(--accent-magenta);
  z-index: 2;
}

.card-content {
  padding: 1.5rem;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.5));
}

.event-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--accent-cyan);
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-name {
  font-family: var(--font-display);
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-weight: 800;
  text-transform: uppercase;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-go {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1c40f; /* Une couleur qui ressort comme sur tes captures */
  color: #000;
  padding: 0.5rem 0.5rem 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 900;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #b7950b;
}

.btn-go:hover {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #b7950b;
  background: var(--accent-cyan);
  color: #000;
}

.btn-icon {
  background: rgba(0, 0, 0, 0.1);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.btn-icon svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .card-image {
    height: 180px;
  }
  
  .event-name {
    font-size: 1.5rem;
  }
  
  .card-content {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .card-image {
    height: 160px;
  }
  
  .event-name {
    font-size: 1.35rem;
    margin-bottom: 1rem;
  }
  
  .event-meta {
    font-size: 0.75rem;
  }
}
</style>
