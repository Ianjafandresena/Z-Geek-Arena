<template>
  <div>
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">Gestion des Lieux</h2>
        <p class="page-subtitle">Configurez les salles et emplacements pour vos événements</p>
      </div>
      <button class="btn-create" @click="showModal = true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouveau Lieu
      </button>
    </div>

    <div v-if="loading && !lieux.length" class="loading-state">Chargement des lieux...</div>

    <div v-else class="lieux-grid">
      <div v-for="lieu in lieux" :key="lieu.id" class="lieu-card">
        <div class="lieu-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div class="lieu-info">
          <h3>{{ lieu.nom }}</h3>
          <p class="ville">{{ lieu.ville }}, {{ lieu.pays }}</p>
          <p class="adresse" v-if="lieu.adresse">{{ lieu.adresse }}</p>
        </div>
        <div class="lieu-actions">
          <button @click="handleDelete(lieu.id)" class="btn-delete" title="Supprimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && !lieux.length" class="empty-state">
      <p>Aucun lieu disponible. Commencez par en créer un !</p>
    </div>

    <!-- Modal Ajout Lieu -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-card">
          <h3 class="modal-title">Nouveau Lieu</h3>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Nom de la salle / lieu</label>
              <input type="text" v-model="form.nom" placeholder="Ex: Palais des Congrès" required>
            </div>
            <div class="form-group">
              <label>Ville</label>
              <input type="text" v-model="form.ville" placeholder="Ex: Marseille" required>
            </div>
            <div class="form-group">
              <label>Adresse complète</label>
              <input type="text" v-model="form.adresse" placeholder="Ex: 58 Bd Michelet">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Annuler</button>
              <button type="submit" class="btn-submit" :disabled="loading">
                {{ loading ? 'Création...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { LieuService } from '~/services/LieuService'
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { showSuccess, confirmDelete } = useUIMessage()
const service = new LieuService()
const lieux = ref([])
const loading = ref(false)
const showModal = ref(false)
const form = ref({ nom: '', ville: '', adresse: '', pays: 'France' })

const fetchLieux = async () => {
  loading.value = true
  try { lieux.value = await service.getAll() }
  finally { loading.value = false }
}

onMounted(fetchLieux)

const handleSubmit = async () => {
  loading.value = true
  try {
    await service.create(form.value)
    showModal.value = false
    form.value = { nom: '', ville: '', adresse: '', pays: 'France' }
    await showSuccess('Le lieu a été enregistré avec succès.')
    await fetchLieux()
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id) => {
  const confirmed = await confirmDelete('lieu')
  if (confirmed) {
    await service.remove(id)
    await showSuccess('Le lieu a été supprimé.')
    await fetchLieux()
  }
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-title { font-size: 1.5rem; margin-bottom: 0.25rem; }
.page-subtitle { color: #5a6380; font-size: 0.9rem; }

.btn-create { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #00e5ff; color: #000; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-create svg { width: 18px; height: 18px; }

.lieux-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.lieu-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.25rem; display: flex; align-items: flex-start; gap: 1rem; position: relative; }
.lieu-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,229,255,0.1); color: #00e5ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lieu-icon svg { width: 22px; height: 22px; }

.lieu-info h3 { font-size: 1rem; margin-bottom: 0.25rem; color: white; }
.ville { color: #ff00ed; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.adresse { color: #5a6380; font-size: 0.8rem; margin-top: 0.5rem; }

.lieu-actions { position: absolute; top: 1rem; right: 1rem; }
.btn-delete { background: transparent; border: none; color: #ff4757; opacity: 0.4; cursor: pointer; transition: opacity 0.2s; }
.btn-delete:hover { opacity: 1; }
.btn-delete svg { width: 18px; height: 18px; }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-card { background: #111420; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; width: 450px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
.modal-title { margin-bottom: 1.5rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
.btn-cancel { padding: 0.7rem 1.25rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-submit { padding: 0.7rem 1.25rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; }
.form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #5a6380; }
input { padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; outline: none; }
input:focus { border-color: #00e5ff; }

.loading-state, .empty-state { text-align: center; padding: 4rem; color: #5a6380; }
</style>
