<template>
  <div>
    <div class="page-header">
      <p class="page-subtitle">Liste des joueurs inscrits sur la plateforme</p>
      <button class="btn-create" @click="showAddModal = true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ajouter un joueur
      </button>
    </div>

    <div v-if="loading" class="loading-msg">Chargement...</div>

    <div v-else class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Joueur</th>
            <th>Email</th>
            <th>Pseudo</th>
            <th>Inscrit le</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="j in joueurs" :key="j.id">
            <td>
              <div class="player-cell">
                <div class="player-avatar" :style="{ background: getColor(j.id) }">{{ j.pseudo.charAt(0).toUpperCase() }}</div>
                <strong>{{ j.nom }}</strong>
              </div>
            </td>
            <td class="text-muted">{{ j.email }}</td>
            <td><span class="pseudo-tag">{{ j.pseudo }}</span></td>
            <td class="text-muted">{{ formatDate(j.created_at) }}</td>
            <td>
              <div class="actions-cell">
                <button class="action-btn delete" title="Supprimer" @click="handleDelete(j.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="joueurs.length === 0">
            <td colspan="5" class="empty-msg">Aucun joueur</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal ajout joueur -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-card">
          <h3>Ajouter un joueur</h3>
          <form @submit.prevent="handleAdd">
            <div class="form-group"><label>Nom</label><input type="text" v-model="newJoueur.nom" required></div>
            <div class="form-group"><label>Email</label><input type="email" v-model="newJoueur.email" required></div>
            <div class="form-group"><label>Pseudo</label><input type="text" v-model="newJoueur.pseudo" required></div>
            <p v-if="error" class="error-text">{{ error }}</p>
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="showAddModal = false">Annuler</button>
              <button type="submit" class="btn-submit" :disabled="loading">Ajouter</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { formatDate } from '~/utils/formatters'

definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { confirmDelete, showSuccess } = useUIMessage()
const { joueurs, loading, error, fetchAll, create, remove } = useJoueurs()
await fetchAll()

const showAddModal = ref(false)
const newJoueur = ref({ nom: '', email: '', pseudo: '' })

const colors = ['linear-gradient(135deg,#00e5ff,#0052d4)', 'linear-gradient(135deg,#ff00ed,#7b2ff7)', 'linear-gradient(135deg,#ffa502,#ff6348)', 'linear-gradient(135deg,#2ed573,#009432)', 'linear-gradient(135deg,#ff4757,#c0392b)']
const getColor = (id) => colors[id % colors.length]

const handleAdd = async () => {
  const result = await create(newJoueur.value)
  if (result) {
    showAddModal.value = false
    newJoueur.value = { nom: '', email: '', pseudo: '' }
    await showSuccess('Le joueur a été ajouté.')
  }
}

const handleDelete = async (id) => {
  const confirmed = await confirmDelete('joueur')
  if (confirmed) {
    const success = await remove(id)
    if (success) {
      await showSuccess('Le joueur a été supprimé.')
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

.player-cell { display: flex; align-items: center; gap: 0.85rem; }
.player-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: white; flex-shrink: 0; }
.pseudo-tag { color: #00e5ff; font-weight: 600; }
.text-muted { color: #5a6380; font-size: 0.85rem; }

.actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
.action-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: transparent; cursor: pointer; transition: all 0.2s; }
.action-btn svg { width: 15px; height: 15px; }
.action-btn.delete { color: #ff4757; }
.action-btn.delete:hover { background: rgba(255,71,87,0.1); border-color: rgba(255,71,87,0.3); }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal-card { background: #161925; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem; width: 100%; max-width: 450px; }
.modal-card h3 { margin: 0 0 1.5rem; font-size: 1.1rem; }
.form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #5a6380; }
input { padding: 0.8rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: white; font-family: inherit; font-size: 0.9rem; }
input:focus { outline: none; border-color: #00e5ff; }
.error-text { color: #ff4757; font-size: 0.85rem; margin-bottom: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 0.5rem; }
.btn-cancel { padding: 0.7rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; }
.btn-submit:disabled { opacity: 0.5; }
</style>
