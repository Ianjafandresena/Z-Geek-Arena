<template>
  <div class="dashboard">
    <div class="welcome-header">
      <h2>Ravi de vous voir, {{ adminUser?.name || 'Admin' }} !</h2>
      <p>Voici un aperçu de l'activité de Z Geek Arena aujourd'hui.</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(0, 229, 255, 0.1); color: #00e5ff;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ String(events.length).padStart(2, '0') }}</span>
          <span class="stat-label">Événements</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(255, 0, 237, 0.1); color: #ff00ed;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ String(totalTournois).padStart(2, '0') }}</span>
          <span class="stat-label">Tournois</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(46, 213, 115, 0.1); color: #2ed573;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ String(joueurs.length).padStart(2, '0') }}</span>
          <span class="stat-label">Joueurs Inscrits</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(255, 165, 2, 0.1); color: #ffa502;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ String(categories.length).padStart(2, '0') }}</span>
          <span class="stat-label">Prix Alloués</span>
        </div>
      </div>
    </div>

    <!-- Recent Events -->
    <div class="card">
      <div class="card-header">
        <h3>Événements récents</h3>
        <NuxtLink to="/backoffice/events" class="card-link">Tout voir →</NuxtLink>
      </div>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Événement</th>
              <th>Lieu</th>
              <th>Dates</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td>
                <div class="player-cell">
                  <div class="event-dot" :style="{ background: event.gradient || '#555' }"></div>
                  <strong>{{ event.nom }}</strong>
                </div>
              </td>
              <td>{{ event.lieu ? (event.lieu.ville || event.lieu.nom) : '-' }}</td>
              <td>{{ formatDateRange(event.date_debut, event.date_fin) }}</td>
              <td><span :class="['badge', getBadgeClass(event.statut)]">{{ formatStatut(event.statut) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDateRange, formatStatut } from '~/utils/formatters'

definePageMeta({
  layout: 'backoffice',
  middleware: ['admin']
})

const { adminUser } = useAuth()
const { events, fetchAll: fetchEvents } = useEvents()
const { jeux, fetchAll: fetchJeux } = useJeux()
const { joueurs, fetchAll: fetchJoueurs } = useJoueurs()
const { categories, fetchCategories } = useRecompenses()

await Promise.all([fetchEvents(), fetchJeux(), fetchJoueurs(), fetchCategories()])

const totalTournois = computed(() => {
  return events.value.reduce((sum, e) => sum + (e.tournois ? e.tournois.length : 0), 0)
})

const getBadgeClass = (statut) => {
  if (statut === 'inscriptions_ouvertes') return 'badge-success'
  if (statut === 'en_cours') return 'badge-info'
  return 'badge-warning'
}
</script>

<style scoped>
.welcome-header { margin-bottom: 2.5rem; }
.welcome-header h2 { margin: 0 0 0.5rem; font-size: 1.8rem; font-weight: 800; color: white; letter-spacing: -0.02em; }
.welcome-header p { margin: 0; color: #5a6380; font-size: 1rem; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;
}

@media (max-width: 1200px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .stats-row { grid-template-columns: 1fr; }
}

.stat-card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: border-color 0.2s;
}

.stat-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #5a6380;
  margin-top: 0.35rem;
}

.card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.card-link {
  color: #00e5ff;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
}
.card-link:hover { text-decoration: underline; }

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 0.875rem 1.5rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #5a6380;
  background: rgba(255, 255, 255, 0.01);
}

.data-table td {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.9rem;
}

.data-table tr:hover td {
  background: rgba(255, 255, 255, 0.015);
}

.player-cell {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.event-dot {
  width: 10px;
  height: 30px;
  border-radius: 3px;
  flex-shrink: 0;
}

.badge {
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-success { background: rgba(46, 213, 115, 0.1); color: #2ed573; }
.badge-warning { background: rgba(255, 165, 2, 0.1); color: #ffa502; }
</style>
