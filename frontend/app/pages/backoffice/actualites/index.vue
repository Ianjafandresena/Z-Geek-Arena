<template>
  <div>
    <div class="page-header">
      <p class="page-subtitle">Gérez vos articles et news</p>
      <button class="btn-create" @click="navigateTo('/backoffice/actualites/create')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouvel Article
      </button>
    </div>

    <div v-if="loading" class="loading-msg">Chargement...</div>

    <div v-else class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Publié</th>
            <th>Date</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in actualites" :key="a.id">
            <td>
              <div>
                <strong>{{ a.titre }}</strong>
                <span class="cell-sub">{{ a.slug }}</span>
              </div>
            </td>
            <td>
              <span :class="['badge', catClass(a.categorie)]">{{ a.categorie }}</span>
            </td>
            <td>
              <span :class="a.publie ? 'dot-success' : 'dot-muted'">●</span>
              {{ a.publie ? 'Oui' : 'Non' }}
            </td>
            <td class="text-muted">{{ a.date_publication ? formatDate(a.date_publication) : '-' }}</td>
            <td>
              <div class="actions-cell">
                <button class="action-btn edit" title="Modifier" @click="navigateTo(`/backoffice/actualites/${a.id}`)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn delete" title="Supprimer" @click="handleDelete(a.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="actualites.length === 0">
            <td colspan="5" class="empty-msg">Aucun article</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '~/utils/formatters'

definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { confirmDelete, showSuccess } = useUIMessage()
const { actualites, loading, fetchAll, remove } = useActualites()
await fetchAll()

const catClass = (cat) => {
  const map = { nouvelles: 'badge-info', communaute: 'badge-success', esport: 'badge-warning', culture: 'badge-purple', partenaires: 'badge-muted' }
  return map[cat] || 'badge-muted'
}

const handleDelete = async (id) => {
  const confirmed = await confirmDelete('article')
  if (confirmed) {
    const success = await remove(id)
    if (success) {
      await showSuccess('L\'article a été supprimé.')
    }
  }
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
.page-subtitle { color: #5a6380; font-size: 0.9rem; margin: 0; }
.loading-msg, .empty-msg { text-align: center; padding: 2rem; color: #5a6380; }

.btn-create { display: flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.25rem; background: #00e5ff; color: #000; border: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.btn-create svg { width: 16px; height: 16px; }
.btn-create:hover { box-shadow: 0 0 20px rgba(0,229,255,0.35); transform: translateY(-1px); }

.card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 0.875rem 1.5rem; text-align: left; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #5a6380; }
.data-table td { padding: 1.15rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.04); font-size: 0.9rem; }
.data-table tr:hover td { background: rgba(255,255,255,0.015); }

.cell-sub { display: block; font-size: 0.75rem; color: #5a6380; margin-top: 0.1rem; }
.text-muted { color: #5a6380; font-size: 0.85rem; }

.badge { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.badge-info { background: rgba(0,229,255,0.12); color: #00e5ff; }
.badge-success { background: rgba(46,213,115,0.12); color: #2ed573; }
.badge-warning { background: rgba(255,165,2,0.12); color: #ffa502; }
.badge-purple { background: rgba(123,47,247,0.12); color: #7b2ff7; }
.badge-muted { background: rgba(255,255,255,0.05); color: #5a6380; }

.dot-success { color: #2ed573; margin-right: 0.4rem; }
.dot-muted { color: #5a6380; margin-right: 0.4rem; }

.actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
.action-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: transparent; cursor: pointer; transition: all 0.2s; }
.action-btn svg { width: 15px; height: 15px; }
.action-btn.edit { color: #00e5ff; }
.action-btn.edit:hover { background: rgba(0,229,255,0.1); }
.action-btn.delete { color: #ff4757; }
.action-btn.delete:hover { background: rgba(255,71,87,0.1); }
</style>
