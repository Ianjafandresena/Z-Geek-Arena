<template>
  <div>
    <div class="page-header">
      <NuxtLink to="/backoffice/tournois" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </NuxtLink>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">Informations du tournoi</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nom du tournoi</label>
              <input type="text" v-model="form.nom" placeholder="Ex: Tekken 8 - Marseille">
            </div>
            <div class="form-group">
              <label>Événement</label>
              <select v-model="form.event_id" required>
                <option value="" disabled>Sélectionner un événement</option>
                <option v-for="e in events" :key="e.id" :value="e.id">{{ e.nom }}</option>
              </select>
            </div>
          </div>
          <div class="form-grid" style="margin-top:1.25rem;">
            <div class="form-group">
              <label>Jeu</label>
              <select v-model="form.jeu_id" required>
                <option value="" disabled>Sélectionner un jeu</option>
                <option v-for="j in jeux" :key="j.id" :value="j.id">{{ j.nom }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Max joueurs</label>
              <input type="number" v-model.number="form.max_joueurs" min="2" required>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Planning & Format</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Date & heure de début</label>
              <input type="datetime-local" v-model="form.date_debut" required>
            </div>
            <div class="form-group">
              <label>Date & heure de fin</label>
              <input type="datetime-local" v-model="form.date_fin">
            </div>
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
          </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="navigateTo('/backoffice/tournois')">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Création...' : 'Créer le tournoi' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { events, fetchAll: fetchEvents } = useEvents()
const { jeux, fetchAll: fetchJeux } = useJeux()
const { loading, error, create } = useTournois()

await Promise.all([fetchEvents(), fetchJeux()])

const form = ref({
  nom: '',
  event_id: '',
  jeu_id: '',
  max_joueurs: 32,
  date_debut: '',
  date_fin: '',
  phase: 'poules',
  format: 'double_elimination'
})

const handleSubmit = async () => {
  const result = await create(form.value)
  if (result) navigateTo('/backoffice/tournois')
}
</script>

<style scoped>
.page-header { margin-bottom: 1.5rem; }
.back-link { display: inline-flex; align-items: center; gap: 0.35rem; color: #5a6380; font-size: 0.85rem; text-decoration: none; }
.back-link svg { width: 16px; height: 16px; }
.back-link:hover { color: #00e5ff; }

.form-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 2rem; }
.form-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
.form-section:last-of-type { border-bottom: none; padding-bottom: 0; }
.section-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 1.25rem; color: white; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #5a6380; }
.error-text { color: #ff4757; font-size: 0.85rem; margin-bottom: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
.btn-cancel { padding: 0.7rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: white; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-submit:hover { box-shadow: 0 0 20px rgba(0,229,255,0.35); transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
