<template>
  <div>
    <div class="page-header">
      <p class="page-subtitle">Gérez les jeux disponibles pour les tournois</p>
      <button class="btn-create" @click="navigateTo('/backoffice/jeux/create')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouveau Jeu
      </button>
    </div>

    <div v-if="loading" class="loading-msg">Chargement...</div>

    <div v-else class="games-grid">
      <div v-for="jeu in jeux" :key="jeu.id" class="game-card">
        <div class="game-image" :style="jeu.image_url ? { backgroundImage: `url(${apiBase}${jeu.image_url})` } : {}">
          <span v-if="!jeu.image_url" class="no-image">🎮</span>
        </div>
        <div class="game-info">
          <h4>{{ jeu.nom }}</h4>
          <span class="game-platform">{{ jeu.plateforme || 'Non spécifié' }}</span>
          <span class="game-slug">{{ jeu.slug }}</span>
        </div>
        <div class="game-actions">
          <button class="action-btn view" @click="navigateTo(`/backoffice/jeux/${jeu.id}`)" title="Détails / Modifier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="action-btn edit" @click="navigateTo(`/backoffice/jeux/${jeu.id}`)" title="Modifier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn delete" @click="handleDelete(jeu.id)" title="Supprimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      <div v-if="jeux.length === 0" class="empty-msg">Aucun jeu enregistré</div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase.replace('/api', '')

const { confirmDelete, showSuccess } = useUIMessage()
const { jeux, loading, fetchAll, remove } = useJeux()
await fetchAll()

const handleDelete = async (id) => {
  const confirmed = await confirmDelete('jeu')
  if (confirmed) {
    const success = await remove(id)
    if (success) {
      await showSuccess('Le jeu a été supprimé ainsi que tous les tournois liés.')
    }
  }
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
.page-subtitle { color: #5a6380; font-size: 0.9rem; margin: 0; }
.loading-msg, .empty-msg { text-align: center; padding: 3rem; color: #5a6380; }

.btn-create { display: flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.25rem; background: #00e5ff; color: #000; border: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.btn-create svg { width: 16px; height: 16px; }
.btn-create:hover { box-shadow: 0 0 20px rgba(0,229,255,0.35); transform: translateY(-1px); }

.games-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; }

.game-card {
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.2s;
}
.game-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-3px); }

.game-image {
  height: 160px;
  background: rgba(255,255,255,0.03);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-image { font-size: 3rem; opacity: 0.3; }

.game-info { padding: 1.25rem; }
.game-info h4 { margin: 0 0 0.4rem; font-size: 1rem; font-weight: 700; color: white; }
.game-platform { display: block; font-size: 0.8rem; color: #ff00ed; font-weight: 600; }
.game-slug { display: block; font-size: 0.7rem; color: #5a6380; margin-top: 0.2rem; }

.game-actions { padding: 0 1.25rem 1.25rem; display: flex; justify-content: flex-end; }
.action-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: transparent; cursor: pointer; transition: all 0.2s; }
.action-btn svg { width: 15px; height: 15px; }
.action-btn.view { color: #00e5ff; }
.action-btn.view:hover { background: rgba(0,229,255,0.1); border-color: rgba(0,229,255,0.3); }

.action-btn.edit { color: #ffa502; }
.action-btn.edit:hover { background: rgba(255,165,2,0.1); border-color: rgba(255,165,2,0.3); }

.action-btn.delete { color: #ff4757; }
.action-btn.delete:hover { background: rgba(255,71,87,0.1); border-color: rgba(255,71,87,0.3); }
</style>
