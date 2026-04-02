<template>
  <div>
    <div class="page-header">
      <p class="page-subtitle">Gérez vos tournois par événement</p>
      <button class="btn-create" @click="navigateTo('/backoffice/tournois/create')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouveau Tournoi
      </button>
    </div>

    <div v-if="loading" class="loading-msg">Chargement...</div>

    <div v-else class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tournoi</th>
            <th>Événement</th>
            <th>Jeu</th>
            <th>Phase</th>
            <th>Format</th>
            <th>Max</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tournois" :key="t.id">
            <td><strong>{{ t.nom || `Tournoi #${t.id}` }}</strong></td>
            <td>
              <span class="cell-sub">{{ t.event ? t.event.nom : '-' }}</span>
            </td>
            <td>
              <span class="game-tag">{{ t.jeu ? t.jeu.nom : '-' }}</span>
            </td>
            <td>
              <span :class="['badge', phaseClass(t.phase)]">{{ t.phase }}</span>
            </td>
            <td class="text-muted">{{ formatFormat(t.format) }}</td>
            <td>{{ t.max_joueurs }}</td>
            <td>
              <div class="actions-cell">
                <button class="action-btn bracket" title="Gérer l'arbre" @click="navigateTo(`/backoffice/tournois/${t.id}/matchs`)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </button>
                <button class="action-btn edit" title="Modifier" @click="navigateTo(`/backoffice/tournois/${t.id}`)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn delete" title="Supprimer" @click="handleDelete(t.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="tournois.length === 0">
            <td colspan="7" class="empty-msg">Aucun tournoi trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { confirmDelete, showSuccess } = useUIMessage()
const { tournois, loading, fetchAll, remove } = useTournois()
await fetchAll()

const phaseClass = (phase) => {
  const map = { poules: 'badge-info', top8: 'badge-warning', finale: 'badge-danger', exhibition: 'badge-muted' }
  return map[phase] || 'badge-muted'
}

const formatFormat = (f) => {
  const map = { double_elimination: 'Double Élim.', single_elimination: 'Single Élim.', round_robin: 'Round Robin', swiss: 'Swiss' }
  return map[f] || f
}

const handleDelete = async (id) => {
  const confirmed = await confirmDelete('tournoi')
  if (confirmed) {
    const success = await remove(id)
    if (success) {
      await showSuccess('Le tournoi a été supprimé.')
    }
  }
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
.page-subtitle { color: #5a6380; font-size: 0.9rem; margin: 0; }
.loading-msg { text-align: center; padding: 3rem; color: #5a6380; }
.empty-msg { text-align: center; padding: 2rem; color: #5a6380; }

.btn-create { display: flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.25rem; background: #00e5ff; color: #000; border: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.btn-create svg { width: 16px; height: 16px; }
.btn-create:hover { box-shadow: 0 0 20px rgba(0, 229, 255, 0.35); transform: translateY(-1px); }

.card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 0.875rem 1.5rem; text-align: left; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #5a6380; }
.data-table td { padding: 1.15rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.04); font-size: 0.9rem; }
.data-table tr:hover td { background: rgba(255,255,255,0.015); }

.cell-sub { font-size: 0.8rem; color: #8892b0; }
.text-muted { color: #5a6380; }
.game-tag { color: #ff00ed; font-weight: 600; font-size: 0.85rem; }

.badge { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.badge-info { background: rgba(0,229,255,0.12); color: #00e5ff; }
.badge-warning { background: rgba(255,165,2,0.12); color: #ffa502; }
.badge-danger { background: rgba(255,71,87,0.12); color: #ff4757; }
.badge-muted { background: rgba(255,255,255,0.05); color: #5a6380; }

.actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
.action-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: transparent; cursor: pointer; transition: all 0.2s; }
.action-btn svg { width: 15px; height: 15px; }
.action-btn.edit { color: #00e5ff; }
.action-btn.edit:hover { background: rgba(0,229,255,0.1); border-color: rgba(0,229,255,0.3); }
.action-btn.delete { color: #ff4757; }
.action-btn.delete:hover { background: rgba(255,71,87,0.1); border-color: rgba(255,71,87,0.3); }
</style>
