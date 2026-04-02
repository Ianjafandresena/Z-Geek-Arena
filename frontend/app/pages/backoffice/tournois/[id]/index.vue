<template>
  <div>
    <div class="page-header">
      <NuxtLink to="/backoffice/tournois" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </NuxtLink>
    </div>

    <div v-if="loading && !form.nom" class="loading-msg">Chargement du tournoi...</div>

    <div v-else class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">Modifier le tournoi</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nom du tournoi</label>
              <input type="text" v-model="form.nom" required>
            </div>
            <div class="form-group">
              <label>Lien d'inscription (ex: Start.gg)</label>
              <input type="url" v-model="form.lien_inscription" placeholder="https://start.gg/...">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Paramètres</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Phase</label>
              <select v-model="form.phase">
                <option value="poules">Poules</option>
                <option value="top8">Top 8</option>
                <option value="finale">Finale</option>
                <option value="exhibition">Exhibition</option>
              </select>
            </div>
            <div class="form-group">
              <label>Format</label>
              <select v-model="form.format">
                <option value="double_elimination">Double Élimination</option>
                <option value="single_elimination">Single Élimination</option>
                <option value="round_robin">Round Robin</option>
                <option value="swiss">Swiss</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nombre max joueurs</label>
              <input type="number" v-model="form.max_joueurs">
            </div>
          </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="navigateTo('/backoffice/tournois')">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Sauvegarder les modifications' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { TournoiService } from '~/services/TournoiService'
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const route = useRoute()
const { showSuccess } = useUIMessage()
const service = new TournoiService()

const loading = ref(false)
const error = ref(null)
const form = ref({ 
  nom: '', 
  phase: 'poules', 
  format: 'double_elimination', 
  max_joueurs: 32,
  lien_inscription: ''
})

onMounted(async () => {
  loading.value = true
  try {
    const data = await service.getById(route.params.id)
    form.value = { ...data }
  } catch (e) {
    error.value = "Impossible de charger le tournoi."
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    await service.update(route.params.id, form.value)
    await showSuccess('Le tournoi a été mis à jour.')
    navigateTo('/backoffice/tournois')
  } catch (e) {
    error.value = "Erreur lors de la mise à jour."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 1.5rem; }
.back-link { display: inline-flex; align-items: center; gap: 0.35rem; color: #5a6380; font-size: 0.85rem; text-decoration: none; }
.back-link:hover { color: #00e5ff; }
.form-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 2rem; }
.form-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
.section-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 1.25rem; color: white; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #5a6380; }
input, select { padding: 0.8rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: white; font-family: inherit; }
input:focus, select:focus { outline: none; border-color: #00e5ff; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
.btn-cancel { padding: 0.7rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; }
.loading-msg { text-align: center; padding: 4rem; color: #5a6380; }
</style>
