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
          Générer l'arbre automatiquement
        </button>
      </div>
    </div>

    <div v-if="loading && !matches.length" class="loading-msg">Chargement du tournoi...</div>

    <div v-else-if="matchesByRound.length" class="bracket-container">
      <div v-for="round in matchesByRound" :key="round.etape" class="bracket-round">
        <h4 class="round-title">{{ getRoundName(round.etape, matchesByRound.length) }}</h4>
        <div class="round-matches">
          <div v-for="match in round.matchs" :key="match.id" class="match-card glass" @click="openMatchModal(match)">
            <div class="match-player" :class="{ 'is-winner': match.gagnant_id === match.joueur1_id && match.gagnant_id }">
              <span class="player-name">{{ match.joueur1?.pseudo || 'A venir' }}</span>
              <span class="player-score">{{ match.score1 }}</span>
            </div>
            <div class="match-divider"></div>
            <div class="match-player" :class="{ 'is-winner': match.gagnant_id === match.joueur2_id && match.gagnant_id }">
              <span class="player-name">{{ match.joueur2?.pseudo || 'A venir' }}</span>
              <span class="player-score">{{ match.score2 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-card glass">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 1.5rem;"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <h3>Aucun match n'a été généré</h3>
        <p>Utilisez le bouton ci-dessus pour créer automatiquement l'arbre ou générez-le manuellement en ajoutant des matchs.</p>
        <button class="btn-primary mt-lg" @click="handleGenerate">Générer maintenant</button>
      </div>
    </div>

    <!-- Match Edit Modal -->
    <Teleport to="body">
      <div v-if="selectedMatch" class="modal-overlay" @click.self="selectedMatch = null">
        <div class="modal-card scale-in">
          <h3 class="modal-title">Gérer le Match</h3>
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
              <label>Vainqueur</label>
              <select v-model="matchForm.gagnant_id">
                <option :value="null">-- Choisir --</option>
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
              <button type="button" class="btn-cancel" @click="selectedMatch = null">Fermer</button>
              <button type="submit" class="btn-submit" :disabled="loading">Sauvegarder</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { TournoiService } from '~/services/TournoiService'
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const route = useRoute()
const { showSuccess } = useUIMessage()
const tournoiId = route.params.id
const service = new TournoiService()

const matches = ref([])
const loading = ref(false)
const selectedMatch = ref(null)
const matchForm = ref({ score1: 0, score2: 0, gagnant_id: null, statut: 'en_attente' })

const fetchMatches = async () => {
  loading.value = true
  try {
    matches.value = await service.getMatches(tournoiId)
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
  if (etape === 1) return '🏆 Finale'
  if (etape === 2) return 'Demi-finale'
  if (etape === 3) return 'Quarts'
  return `Tour ${totalRounds - etape + 1}`
}

const handleGenerate = async () => {
  if (matches.value.length > 0 && !confirm('Attention : cela va écraser les matchs existants. Confirmer ?')) return
  loading.value = true
  try {
    const res = await service.generateBracket(tournoiId)
    await showSuccess(res.message || 'Bracket généré avec succès !')
    await fetchMatches()
  } catch (e) {
    alert(e.data?.message || 'Erreur lors de la génération. Assurez-vous d\'avoir au moins 2 joueurs inscrits.')
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
  loading.value = true
  try {
    await service.updateMatch(selectedMatch.value.id, matchForm.value)
    selectedMatch.value = null
    await fetchMatches()
    await showSuccess('Match mis à jour')
  } catch (e) {
    alert('Erreur lors de la mise à jour')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bracket-page { padding: 1rem; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
.back-link { color: #5a6380; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
.back-link:hover { color: #00e5ff; }

.btn-generate { display: flex; align-items: center; gap: 0.65rem; padding: 0.8rem 1.5rem; background: #00e5ff; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; transition: 0.2s; }
.btn-generate:hover { box-shadow: 0 0 20px rgba(0,229,255,0.4); transform: translateY(-1px); }
.btn-generate:disabled { opacity: 0.5; pointer-events: none; }
.btn-generate svg { width: 18px; height: 18px; }

.bracket-container { display: flex; gap: 4rem; overflow-x: auto; padding: 1rem 0 3rem; min-height: 650px; align-items: stretch; scrollbar-width: thin; }
.bracket-round { min-width: 240px; display: flex; flex-direction: column; }
.round-title { text-align: center; color: #5a6380; text-transform: uppercase; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em; margin-bottom: 2.5rem; }
.round-matches { flex: 1; display: flex; flex-direction: column; justify-content: space-around; gap: 2rem; position: relative; }

.match-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; width: 240px; cursor: pointer; transition: all 0.2s; overflow: hidden; }
.match-card:hover { border-color: #00e5ff; transform: translateX(5px); background: rgba(255,255,255,0.04); }
.match-player { display: flex; justify-content: space-between; padding: 0.9rem 1.15rem; font-size: 0.9rem; align-items: center; }
.match-player.is-winner { background: rgba(0,229,255,0.06); color: #00e5ff; font-weight: 800; }
.player-name { opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; }
.match-player.is-winner .player-name { opacity: 1; }
.player-score { font-family: 'Inter', monospace; font-weight: 900; opacity: 0.5; font-size: 1.1rem; }
.is-winner .player-score { opacity: 1; }
.match-divider { height: 1px; background: rgba(255,255,255,0.05); }

.empty-state { display: flex; align-items: center; justify-content: center; padding: 100px 0; }
.empty-card { padding: 4rem; text-align: center; border-radius: 20px; max-width: 500px; border: 1px dashed rgba(255,255,255,0.1); }
.empty-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
.empty-card p { color: #5a6380; line-height: 1.6; }
.btn-primary { margin-top: 2rem; padding: 0.9rem 2rem; background: #00e5ff; color: #000; font-weight: 800; border: none; border-radius: 8px; cursor: pointer; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-card { background: #0f121d; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2.5rem; width: 440px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
.modal-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 2rem; text-align: center; }
.match-edit-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.5rem; align-items: center; margin-bottom: 2rem; }
.player-edit label { font-size: 0.75rem; color: #5a6380; text-transform: uppercase; margin-bottom: 0.75rem; display: block; text-align: center; }
.player-edit input { width: 100%; text-align: center; font-size: 2rem; font-weight: 900; padding: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #00e5ff; }
.vs { color: #333; font-weight: 900; font-size: 1rem; }

.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2.5rem; }
.btn-cancel { padding: 0.8rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #5a6380; cursor: pointer; font-weight: 600; }
.btn-submit { padding: 0.8rem 2rem; background: #00e5ff; color: black; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; transition: 0.2s; }
.loading-msg { text-align: center; padding: 10rem 0; color: #5a6380; font-weight: 600; }
</style>
