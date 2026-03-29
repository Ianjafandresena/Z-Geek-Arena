<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div>
        <p class="page-subtitle">Gérez vos festivals et événements</p>
      </div>
      <button class="btn-create" @click="navigateTo('/backoffice/events/create')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouvel Événement
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-msg">Chargement des événements...</div>

    <!-- Table Card -->
    <div v-else class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Événement</th>
            <th>Lieu</th>
            <th>Dates</th>
            <th>Statut</th>
            <th>Tournois</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>
              <div class="event-cell">
                <div class="event-color" :style="{ background: event.gradient || '#333' }"></div>
                <div>
                  <strong>{{ event.nom }}</strong>
                  <span class="cell-sub">{{ event.slug }}</span>
                </div>
              </div>
            </td>
            <td>{{ event.lieu ? `${event.lieu.ville}, ${event.lieu.pays}` : '-' }}</td>
            <td>{{ formatDateRange(event.date_debut, event.date_fin) }}</td>
            <td>
              <span :class="['badge', getBadgeClass(event.statut)]">
                {{ formatStatut(event.statut) }}
              </span>
            </td>
            <td>{{ event.tournois ? event.tournois.length : 0 }}</td>
            <td>
              <div class="actions-cell">
                <button class="action-btn edit" title="Modifier">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn delete" title="Supprimer" @click="handleDelete(event.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { formatDateRange, formatStatut } from '~/utils/formatters'

definePageMeta({
  layout: 'backoffice',
  middleware: ['admin']
})

const { events, loading, fetchAll, remove } = useEvents()
await fetchAll()

const getBadgeClass = (statut) => {
  if (statut === 'inscriptions_ouvertes') return 'badge-success'
  if (statut === 'en_cours') return 'badge-info'
  if (statut === 'termine') return 'badge-muted'
  return 'badge-warning'
}

const handleDelete = async (id) => {
  if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
    await remove(id)
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
}

.page-subtitle {
  color: #5a6380;
  font-size: 0.9rem;
  margin: 0;
}

.loading-msg {
  text-align: center;
  padding: 3rem;
  color: #5a6380;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  background: #00e5ff;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create svg { width: 16px; height: 16px; }
.btn-create:hover {
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.35);
  transform: translateY(-1px);
}

.card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  overflow: hidden;
}

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
}

.data-table td {
  padding: 1.15rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.9rem;
}

.data-table tr:hover td {
  background: rgba(255, 255, 255, 0.015);
}

.event-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.event-color {
  width: 10px;
  height: 38px;
  border-radius: 4px;
  flex-shrink: 0;
}

.cell-sub {
  display: block;
  font-size: 0.75rem;
  color: #5a6380;
  margin-top: 0.1rem;
}

.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-success { background: rgba(46, 213, 115, 0.12); color: #2ed573; }
.badge-warning { background: rgba(255, 165, 2, 0.12); color: #ffa502; }
.badge-muted { background: rgba(255, 255, 255, 0.05); color: #5a6380; }

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn svg { width: 15px; height: 15px; }

.action-btn.edit { color: #00e5ff; }
.action-btn.edit:hover { background: rgba(0, 229, 255, 0.1); border-color: rgba(0, 229, 255, 0.3); }

.action-btn.delete { color: #ff4757; }
.action-btn.delete:hover { background: rgba(255, 71, 87, 0.1); border-color: rgba(255, 71, 87, 0.3); }
</style>
