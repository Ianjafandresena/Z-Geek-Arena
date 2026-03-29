<template>
  <div>
    <div class="page-header">
      <p class="page-subtitle">Catégories de récompense pour les votes communautaires</p>
    </div>

    <div v-if="loading" class="loading-msg">Chargement...</div>

    <div v-else class="awards-grid">
      <div v-for="cat in categories" :key="cat.id" class="award-card" :class="{ inactive: !cat.active }">
        <div class="award-icon">🏆</div>
        <div class="award-info">
          <h4>{{ cat.nom }}</h4>
          <span class="award-year">{{ cat.annee }}</span>
        </div>
        <span :class="cat.active ? 'dot-success' : 'dot-muted'">●</span>
      </div>
    </div>

    <div class="card" style="margin-top: 2rem;">
      <div class="card-header">
        <h3>Résumé</h3>
      </div>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="summary-value">{{ categories.length }}</span>
          <span class="summary-label">Catégories</span>
        </div>
        <div class="summary-item">
          <span class="summary-value">{{ categories.filter(c => c.active).length }}</span>
          <span class="summary-label">Actives</span>
        </div>
        <div class="summary-item">
          <span class="summary-value">2026</span>
          <span class="summary-label">Année en cours</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { categories, loading, fetchCategories } = useRecompenses()
await fetchCategories()
</script>

<style scoped>
.page-header { margin-bottom: 1.75rem; }
.page-subtitle { color: #5a6380; font-size: 0.9rem; margin: 0; }
.loading-msg { text-align: center; padding: 3rem; color: #5a6380; }

.awards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.award-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  transition: all 0.2s;
}

.award-card:hover {
  border-color: rgba(255,255,255,0.12);
  transform: translateY(-2px);
}

.award-card.inactive { opacity: 0.4; }

.award-icon { font-size: 1.5rem; flex-shrink: 0; }

.award-info { flex: 1; }
.award-info h4 { margin: 0; font-size: 0.85rem; font-weight: 700; color: white; line-height: 1.3; }
.award-year { font-size: 0.7rem; color: #5a6380; }

.dot-success { color: #2ed573; font-size: 0.8rem; }
.dot-muted { color: #5a6380; font-size: 0.8rem; }

.card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
.card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.card-header h3 { margin: 0; font-size: 1rem; font-weight: 700; }

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 1.5rem;
  gap: 1.5rem;
}

.summary-item { text-align: center; }
.summary-value { display: block; font-size: 2rem; font-weight: 800; color: white; }
.summary-label { font-size: 0.8rem; color: #5a6380; }
</style>
