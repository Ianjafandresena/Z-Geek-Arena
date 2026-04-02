<template>
  <main class="bracket-view">
    <div class="container py-xl">
      <div class="page-header" v-if="tournoi">
        <NuxtLink :to="tournoi.event_id ? `/events/${tournoi.event_id}` : '/events'" class="back-link">&larr; Retour à l'événement</NuxtLink>
        <div class="header-main">
          <div class="game-icon" v-if="tournoi.jeu?.image_url">
            <img :src="tournoi.jeu.image_url" :alt="tournoi.jeu.nom">
          </div>
          <div>
            <h1 class="display-font">{{ tournoi.nom || 'Arbre du Tournoi' }}</h1>
            <p class="tournoi-meta">
              {{ tournoi.jeu?.nom }} • {{ tournoi.format === 'double_elimination' ? 'Double' : 'Simple' }} Élimination
            </p>
          </div>
        </div>
      </div>

      <div v-if="pending" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des matchs...</p>
      </div>

      <div v-else-if="matchesByRound.length" class="bracket-layout">
        <div v-for="round in matchesByRound" :key="round.etape" class="bracket-round">
          <h4 class="round-title">{{ getRoundName(round.etape, matchesByRound.length) }}</h4>
          <div class="round-matches">
            <div v-for="match in round.matchs" :key="match.id" class="match-card glass">
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

      <div v-else class="empty-bracket">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="empty-icon"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <h3>L'arbre n'a pas encore été généré pour ce tournoi.</h3>
        <p>Revenez bientôt pour suivre la compétition !</p>
      </div>
    </div>
  </main>
</template>

<script setup>
const route = useRoute()
const tournoiId = route.params.id

const { data: tournoi } = await useAsyncData(`tournoi-${tournoiId}`, () => $fetch(`/api/tournois/${tournoiId}`))
const { data: matches, pending } = await useAsyncData(`bracket-${tournoiId}`, () => $fetch(`/api/matchs?tournoi_id=${tournoiId}`))

const matchesByRound = computed(() => {
  if (!matches.value) return []
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
</script>

<style scoped>
.bracket-view { padding-top: 100px; min-height: 100vh; background: #080a13; }
.py-xl { padding: 4rem 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

.page-header { margin-bottom: 4rem; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 2rem; }
.back-link:hover { color: var(--accent-cyan); }

.header-main { display: flex; align-items: center; gap: 2rem; }
.game-icon { width: 80px; height: 80px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
.game-icon img { width: 100%; height: 100%; object-fit: cover; }
.display-font { font-size: 3.5rem; margin-bottom: 0.5rem; }
.tournoi-meta { color: var(--accent-cyan); font-weight: 800; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }

.loading-state { text-align: center; padding: 6rem; color: var(--text-secondary); }
.spinner { width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.05); border-top-color: var(--accent-cyan); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem; }
@keyframes spin { to { transform: rotate(360deg); } }

.bracket-layout { display: flex; gap: 4rem; overflow-x: auto; padding-bottom: 3rem; min-height: 500px; align-items: flex-start; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
.bracket-round { min-width: 250px; display: flex; flex-direction: column; height: 100%; }
.round-title { color: #5a6380; text-transform: uppercase; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.15em; margin-bottom: 2.5rem; text-align: center; }
.round-matches { flex: 1; display: flex; flex-direction: column; justify-content: space-around; gap: 1.5rem; }

.match-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; width: 250px; overflow: hidden; }
.match-player { display: flex; justify-content: space-between; padding: 1rem 1.25rem; font-size: 0.9rem; align-items: center; }
.match-player.is-winner { background: rgba(0, 229, 255, 0.05); }
.player-name { font-weight: 700; color: #d0d6e0; width: 80%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.match-player.is-winner .player-name { color: white; text-shadow: 0 0 10px rgba(0,229,255,0.3); }
.player-score { font-weight: 900; color: #5a6380; font-family: monospace; font-size: 1.1rem; }
.match-player.is-winner .player-score { color: var(--accent-cyan); }
.match-divider { height: 1px; background: rgba(255,255,255,0.04); }

.empty-bracket { text-align: center; padding: 8rem 0; color: #5a6380; }
.empty-icon { width: 60px; height: 60px; margin-bottom: 1.5rem; opacity: 0.2; }
.empty-bracket h3 { color: white; margin-bottom: 1rem; }
</style>
