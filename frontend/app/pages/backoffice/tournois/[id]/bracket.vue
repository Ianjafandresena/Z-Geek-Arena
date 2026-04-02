<template>
  <div class="bracket-page">
    <div class="page-header">
      <NuxtLink to="/backoffice/tournois" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour aux tournois
      </NuxtLink>
      <div class="header-actions">
        <button class="btn-generate" @click="handleGenerate" :disabled="loading">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Réinitialiser & Générer l'arbre
        </button>
      </div>
    </div>

    <div v-if="loading && !matches.length" class="loading-msg">Chargement du bracket...</div>

    <div v-else class="bracket-container">
      <div v-for="round in matchesByRound" :key="round.etape" class="bracket-round">
        <h4 class="round-title">{{ getRoundName(round.etape, matchesByRound.length) }}</h4>
        <div class="round-matches">
          <div v-for="match in round.matchs" :key="match.id" class="match-card glass" @click="openMatchModal(match)">
            <div class="match-player" :class="{ 'is-winner': match.gagnant_id === match.joueur1_id && match.gagnant_id }">
              <span class="player-name">{{ match.joueur1?.pseudo || 'TBD' }}</span>
              <span class="player-score">{{ match.score1 }}</span>
            </div>
            <div class="match-divider"></div>
            <div class="match-player" :class="{ 'is-winner': match.gagnant_id === match.joueur2_id && match.gagnant_id }">
              <span class="player-name">{{ match.joueur2?.pseudo || 'TBD' }}</span>
              <span class="player-score">{{ match.score2 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Edit Modal -->
    <Teleport to="body">
      <div v-if="selectedMatch" class="modal-overlay" @click.self="selectedMatch = null">
        <div class="modal-card">
          <h3 class="modal-title">Résultat du Match</h3>
          <form @submit.prevent="saveMatch">
            <div class="match-edit-grid">
              <div class="player-edit">
                <label>{{ selectedMatch.joueur1?.pseudo || 'Joueur 1' }}</label>
                <input type="number" v-model="matchForm.score1">
              </div>
              <div class="vs">VS</div>
              <div class="player-edit">
                <label>{{ selectedMatch.joueur2?.pseudo || 'Joueur 2' }}</label>
                <input type="number" v-model="matchForm.score2">
              </div>
            </div>

            <div class="form-group mt-md">
              <label>Gagnant</label>
              <select v-model="matchForm.gagnant_id">
                <option :value="null">Non défini</option>
                <option v-if="selectedMatch.joueur1_id" :value="selectedMatch.joueur1_id">{{ selectedMatch.joueur1.pseudo }}</option>
                <option v-if="selectedMatch.joueur2_id" :value="selectedMatch.joueur2_id">{{ selectedMatch.joueur2.pseudo }}</option>
              </select>
            </div>

            <div class="form-group mt-md">
              <label>Statut</label>
              <select v-model="matchForm.statut">
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="selectedMatch = null">Annuler</button>
              <button type="submit" class="btn-submit">Sauvegarder</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const route = useRoute()
const { showSuccess } = useUIMessage()
const tournoiId = route.params.id

const matches = ref([])
const loading = ref(false)
const selectedMatch = ref(null)
const matchForm = ref({ score1: 0, score2: 0, gagnant_id: null, statut: 'en_attente' })

const fetchMatches = async () => {
  loading.value = true
  try {
    matches.value = await $fetch(`/api/matchs?tournoi_id=${tournoiId}`)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMatches)

const matchesByRound = computed(() => {
  const groups = {}
  matches.value.forEach(m => {
    if (!groups[m.etape]) groups[m.etape] = []
    groups[m.etape].push(m)
  })
  return Object.keys(groups).sort((a,b) => b-a).map(etape => ({
    etape: parseInt(etape),
    matchs: groups[etape].sort((a,b) => a.ordre - b.ordre)
  }))
})

const getRoundName = (etape, totalRounds) => {
  if (etape === 1) return 'Finale'
  if (etape === 2) return 'Demi-finale'
  if (etape === 3) return 'Quarts de finale'
  return `Tour ${totalRounds - etape + 1}`
}

const handleGenerate = async () => {
  if (!confirm('Cela va effacer l\'arbre actuel. Continuer ?')) return
  loading.value = true
  try {
    await $fetch('/api/matchs/generate', {
      method: 'POST',
      body: { tournoi_id: tournoiId }
    })
    await showSuccess('Bracket généré !')
    await fetchMatches()
  } catch (e) {
    alert(e.message)
  } finally {
    loading.value = false
  }
}

const openMatchModal = (match) => {
  selectedMatch.value = match
  matchForm.value = {
    score1: match.score1,
    score2: match.score2,
    gagnant_id: match.gagnant_id,
    statut: match.statut
  }
}

const saveMatch = async () => {
  try {
    await $fetch(`/api/matchs/${selectedMatch.value.id}`, {
      method: 'PUT',
      body: matchForm.value
    })
    selectedMatch.value = null
    await fetchMatches()
    await showSuccess('Match mis à jour')
  } catch (e) {
    alert('Erreur lors de la mise à jour')
  }
}
</script>

<style scoped>
.bracket-page { padding: 1rem; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.back-link { color: #5a6380; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
.back-link:hover { color: #00e5ff; }

.btn-generate { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-generate:hover { border-color: #ff00ed; color: #ff00ed; }
.btn-generate svg { width: 16px; height: 16px; }

.bracket-container { display: flex; gap: 3rem; overflow-x: auto; padding-bottom: 2rem; min-height: 600px; }
.bracket-round { min-width: 200px; display: flex; flex-direction: column; }
.round-title { text-align: center; color: #5a6380; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; margin-bottom: 2rem; }
.round-matches { flex: 1; display: flex; flex-direction: column; justify-content: space-around; }

.match-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; width: 220px; cursor: pointer; transition: 0.2s; }
.match-card:hover { border-color: #00e5ff; transform: scale(1.02); }
.match-player { display: flex; justify-content: space-between; padding: 0.75rem 1rem; font-size: 0.85rem; }
.match-player.is-winner { color: #00e5ff; font-weight: 700; background: rgba(0,229,255,0.05); }
.player-score { color: #5a6380; }
.match-player.is-winner .player-score { color: #00e5ff; }
.match-divider { height: 1px; background: rgba(255,255,255,0.05); }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-card { background: #111420; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; width: 400px; }
.match-edit-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; margin-bottom: 1.5rem; text-align: center; }
.player-edit label { display: block; font-size: 0.7rem; margin-bottom: 0.5rem; color: #8892b0; overflow: hidden; text-overflow: ellipsis; }
.player-edit input { width: 100%; text-align: center; font-size: 1.5rem; font-weight: 700; padding: 0.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; }
.vs { color: #5a6380; font-weight: 800; font-size: 0.8rem; }

.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-size: 0.75rem; color: #5a6380; text-transform: uppercase; }
select { padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; }
.mt-md { margin-top: 1.25rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
.btn-cancel { padding: 0.75rem 1.25rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #5a6380; cursor: pointer; }
.btn-submit { padding: 0.75rem 1.5rem; background: #00e5ff; color: black; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
</style>
