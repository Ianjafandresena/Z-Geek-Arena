<template>
  <main class="event-details" v-if="currentEvent">
    <!-- Header Hero -->
    <section class="event-hero" :style="{ background: currentEvent.gradient }">
      <div class="container hero-content">
        <NuxtLink to="/events" class="back-link">&larr; Retour aux événements</NuxtLink>
        <div class="badge">{{ formatStatut(currentEvent.statut) }}</div>
        <h1 class="display-font">{{ currentEvent.nom }}</h1>
        <div class="hero-meta">
          <span>
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {{ currentEvent.lieu ? `${currentEvent.lieu.ville}, ${currentEvent.lieu.pays}` : '' }}
          </span>
          <span>
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            {{ formatDateRange(currentEvent.date_debut, currentEvent.date_fin) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Planning Section (tournois depuis le backoffice) -->
    <section class="section-padding planning-section" v-if="currentEvent.tournois && currentEvent.tournois.length">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Planning des Tournois</h2>
          <p class="section-subtitle">Retrouvez les horaires des poules et du Top 8 pour chaque discipline.</p>
        </div>

        <div class="planning-container glass">
          <div class="planning-header">
            <div class="time-slot label">TIME</div>
            <div v-for="time in timeSlots" :key="time" class="time-slot">{{ time }}</div>
          </div>
          
          <div class="planning-grid">
            <div class="planning-row" v-for="(day, index) in planningDays" :key="index">
              <div class="day-label">{{ day.label }}</div>
              <div class="day-tracks">
                <div 
                  v-for="item in day.items" 
                  :key="item.id"
                  class="planning-item"
                  :class="item.type"
                  :style="{ 
                    gridColumn: `${item.colStart} / span ${item.colSpan}`
                  }"
                >
                  <div class="item-content">
                    <div class="item-info">
                      <span class="game-name">{{ item.gameName }}</span>
                      <span class="phase-name">{{ item.phase }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Inscription Section -->
    <section class="section-padding inscription-section" v-if="currentEvent.statut === 'inscriptions_ouvertes'">
      <div class="container">
        <div class="inscription-card glass">
          <div class="inscription-header">
            <h2 class="section-title">Rejoindre l'événement</h2>
            <p class="section-subtitle">Choisissez votre mode de participation.</p>
          </div>

          <!-- Toggle Type Inscription -->
          <div class="inscription-type-toggle">
            <button 
              type="button" 
              class="type-btn" 
              :class="{ active: inscType === 'visiteur' }" 
              @click="inscType = 'visiteur'"
            >
              VISITEUR
              <span>Accès simple</span>
            </button>
            <button 
              type="button" 
              class="type-btn" 
              :class="{ active: inscType === 'joueur' }" 
              @click="inscType = 'joueur'"
            >
              JOUEUR
              <span>Compétition</span>
            </button>
          </div>

          <form @submit.prevent="handleInscription" class="inscription-form">
            <div class="form-row">
              <div class="form-group">
                <label>Nom complet</label>
                <input type="text" v-model="inscForm.nom" placeholder="Votre nom" required>
              </div>
              <div class="form-group">
                <label>Pseudo (gamertag)</label>
                <input type="text" v-model="inscForm.pseudo" placeholder="Votre pseudo" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="inscForm.email" placeholder="votre@email.com" required>
              </div>
              <div class="form-group" v-if="inscType === 'joueur'">
                <label>Tournoi principal</label>
                <select v-model="inscForm.tournoi_id" :required="inscType === 'joueur'">
                  <option value="" disabled>Choisir un tournoi</option>
                  <option v-for="t in currentEvent.tournois" :key="t.id" :value="t.id">
                    {{ t.jeu ? t.jeu.nom : t.nom }} — {{ formatPhase(t.phase) }}
                  </option>
                </select>
              </div>
              <div class="form-group" v-else>
                <label>Status</label>
                <div class="info-badge">Inscription Visiteur Uniquement</div>
              </div>
            </div>

            <p v-if="inscError" class="error-msg">{{ inscError }}</p>
            <p v-if="inscSuccess" class="success-msg">✅ Inscription confirmée ! Bienvenue à {{ currentEvent.nom }}.</p>

            <button type="submit" class="btn-primary btn-glow" :disabled="inscLoading">
              {{ inscLoading ? 'Inscription...' : "CONFIRMER L'INSCRIPTION" }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Participants Section (Nouveau) -->
    <section class="section-padding participants-section" v-if="participants.length">
      <div class="container text-center">
        <h2 class="section-title">Participants</h2>
        <p class="section-subtitle">Déjà {{ participants.length }} guerriers dans l'arène !</p>
        
        <div class="participants-list mt-3">
          <div v-for="p in participants" :key="p.id" class="participant-item" :title="p.pseudo">
            <div class="avatar-circle" :style="{ background: getAvatarColor(p.id) }">{{ p.pseudo.charAt(0).toUpperCase() }}</div>
            <span class="participant-pseudo">{{ p.pseudo }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Rules Section -->
    <section class="section-padding rules-section bg-darker" v-if="currentEvent.tournois && currentEvent.tournois.length">
      <div class="container">
        <div class="rules-layout">
          <div class="rules-sidebar">
            <div class="rules-badge">
              <span>EVENT RULES</span>
              <div class="chevron-right">&rarr;</div>
            </div>
          </div>
          
          <div class="rules-content">
            <div v-for="tournoi in tournoiWithRules" :key="tournoi.id" class="rule-accordion" :class="{ active: activeGame === tournoi.id }">
              <button class="accordion-header" @click="toggleAccordion(tournoi.id)">
                <span class="game-title">{{ tournoi.jeu.nom }}</span>
                <div class="accordion-icon">
                  <svg v-if="activeGame === tournoi.id" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </button>
              
              <div class="accordion-body" v-show="activeGame === tournoi.id">
                <div class="rule-details">
                  <div class="rule-platform">{{ tournoi.jeu.plateforme || 'Multi-plateforme' }} | Bring Your Own Controller</div>
                  <ul class="rule-list">
                    <li v-for="rule in tournoi.jeu.regles" :key="rule.id">{{ rule.contenu }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <main v-else class="event-loading">
    <div class="container" style="text-align:center; padding:200px 0;">
      <p style="color: #5a6380;">Chargement de l'événement...</p>
    </div>
  </main>
</template>

<script setup>
import { formatDateRange, formatStatut } from '~/utils/formatters'
import { InscriptionService } from '~/services/InscriptionService'
import { JoueurService } from '~/services/JoueurService'

const route = useRoute()
const { currentEvent, fetchBySlug } = useEvents()

await fetchBySlug(route.params.id)

const activeGame = ref(null)
const toggleAccordion = (id) => {
  activeGame.value = activeGame.value === id ? null : id
}

// Ouvrir le 1er accordion automatiquement
watchEffect(() => {
  if (currentEvent.value?.tournois?.length && !activeGame.value) {
    const firstWithRules = currentEvent.value.tournois.find(t => t.jeu?.regles?.length)
    if (firstWithRules) activeGame.value = firstWithRules.id
  }
})

// Liste des tournois qui ont des règles
const tournoiWithRules = computed(() => {
  if (!currentEvent.value?.tournois) return []
  return currentEvent.value.tournois.filter(t => t.jeu?.regles?.length)
})

// Planning — généré dynamiquement depuis les tournois
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", 
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
]

const planningDays = computed(() => {
  if (!currentEvent.value?.tournois?.length) return []

  // Grouper par jour
  const dayMap = new Map()
  for (const t of currentEvent.value.tournois) {
    const d = new Date(t.date_debut)
    const dayKey = d.toISOString().split('T')[0]
    const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit' }).toUpperCase()

    if (!dayMap.has(dayKey)) dayMap.set(dayKey, { label: dayLabel, items: [] })

    const startHour = d.getHours()
    const endDate = t.date_fin ? new Date(t.date_fin) : new Date(d.getTime() + 4 * 3600000)
    const endHour = endDate.getHours()
    const duration = Math.max(1, endHour - startHour)

    // Mapper l'heure au slot
    const colStart = Math.max(1, startHour - 8) + 1

    dayMap.get(dayKey).items.push({
      id: t.id,
      gameName: t.jeu ? t.jeu.nom : t.nom,
      phase: formatPhase(t.phase),
      type: t.phase === 'top8' || t.phase === 'finale' ? 'top8' : 'pools',
      colStart,
      colSpan: duration
    })
  }

  return [...dayMap.values()]
})

const formatPhase = (phase) => {
  const map = { poules: 'POULES', top8: 'TOP 8', finale: 'FINALE', exhibition: 'EXHIBITION' }
  return map[phase] || phase?.toUpperCase()
}

// === Participants ===
const participants = computed(() => {
  if (!currentEvent.value?.tournois) return []
  const allJoueurs = []
  const seen = new Set()
  
  currentEvent.value.tournois.forEach(t => {
    if (t.joueurs) {
      t.joueurs.forEach(j => {
        if (!seen.has(j.id)) {
          seen.add(j.id)
          allJoueurs.push(j)
        }
      })
    }
  })
  return allJoueurs
})

const getAvatarColor = (id) => {
  const colors = ['#00e5ff', '#ff00ed', '#7b2ff7', '#ffa502', '#2ed573']
  return colors[id % colors.length]
}

// === Inscription ===
const inscType = ref('joueur')
const inscForm = ref({ nom: '', pseudo: '', email: '', tournoi_id: '' })
const inscLoading = ref(false)
const inscError = ref('')
const inscSuccess = ref(false)

const handleInscription = async () => {
  inscLoading.value = true
  inscError.value = ''
  inscSuccess.value = false

  try {
    const joueurService = new JoueurService()
    const inscService = new InscriptionService()

    // 1. Créer ou récupérer le joueur
    let joueur
    try {
      joueur = await joueurService.create({
        nom: inscForm.value.nom,
        pseudo: inscForm.value.pseudo,
        email: inscForm.value.email
      })
    } catch (e) {
      inscError.value = 'Pseudo ou email déjà utilisé.'
      inscLoading.value = false
      return
    }

    // 2. Préparer les données d'inscription
    const payload = {
      joueur_id: joueur.id,
      event_id: currentEvent.value.id,
      tournoi_id: inscType.value === 'joueur' ? parseInt(inscForm.value.tournoi_id) : null
    }

    // 3. Inscrire
    await inscService.create(payload)

    inscSuccess.value = true
    inscForm.value = { nom: '', pseudo: '', email: '', tournoi_id: '' }
    
    // Recharger l'événement pour voir le participant ajouté
    await fetchBySlug(route.params.id)
  } catch (e) {
    inscError.value = 'Erreur lors de l\'inscription.'
  } finally {
    inscLoading.value = false
  }
}
</script>

<style scoped>
/* Participants styles */
.participants-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}
.participant-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.participant-item .avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: black;
  box-shadow: 0 0 15px rgba(255,255,255,0.05);
}
.participant-pseudo {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mt-3 { margin-top: 2rem; }
.text-center { text-align: center; }
.event-details {
  min-height: 100vh;
  padding-top: 80px;
}

.event-hero {
  padding: 100px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.event-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
}

.hero-content { position: relative; z-index: 2; }

.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}
.back-link:hover { color: var(--accent-cyan); }

.event-hero h1 { font-size: 5rem; margin: 1.5rem 0; }

.hero-meta {
  display: flex;
  justify-content: center;
  gap: 3rem;
  color: var(--text-secondary);
  font-size: 1.25rem;
  font-weight: 600;
}

.hero-meta span { display: flex; align-items: center; gap: 0.75rem; }
.icon-svg { width: 24px; height: 24px; color: var(--accent-cyan); }

/* === INSCRIPTION === */
.inscription-card {
  max-width: 700px;
  margin: 0 auto;
  padding: 3rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 229, 255, 0.15);
  background: rgba(255,255,255,0.02);
}

.inscription-header { text-align: center; margin-bottom: 2rem; }
.inscription-header .section-title { font-size: 2rem; margin-bottom: 0.5rem; }

/* Type Toggle */
.inscription-type-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.type-btn {
  flex: 1;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-align: center;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #5a6380;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.type-btn span { font-size: 0.7rem; font-weight: 600; text-transform: none; opacity: 0.6; letter-spacing: 0; }
.type-btn.active {
  background: rgba(0, 229, 255, 0.05);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
}
.type-btn.active span { opacity: 0.8; }

.info-badge {
  padding: 0.85rem 1rem;
  background: rgba(46, 213, 115, 0.1);
  border: 1px solid rgba(46, 213, 115, 0.2);
  border-radius: 8px;
  color: #2ed573;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); }
input, select { padding: 0.85rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: white; font-family: inherit; font-size: 0.9rem; }
input:focus, select:focus { outline: none; border-color: var(--accent-cyan); }

.error-msg { color: #ff4757; text-align: center; font-size: 0.85rem; margin-bottom: 1rem; }
.success-msg { color: #2ed573; text-align: center; font-size: 0.9rem; margin-bottom: 1rem; font-weight: 600; }

.btn-glow {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  letter-spacing: 0.15em;
}
.btn-glow:hover { box-shadow: 0 0 30px rgba(0, 229, 255, 0.3); }

/* === PLANNING === */
.planning-container {
  overflow-x: auto;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  background: rgba(255,255,255,0.02);
}

.planning-header {
  display: grid;
  grid-template-columns: 120px repeat(12, 1fr);
  background: rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.time-slot { padding: 1rem; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-align: center; border-right: 1px solid rgba(255,255,255,0.05); }
.time-slot.label { color: white; text-align: left; }

.planning-grid { display: flex; flex-direction: column; }
.planning-row { display: grid; grid-template-columns: 120px 1fr; border-bottom: 1px solid rgba(255,255,255,0.05); min-height: 120px; }

.day-label { padding: 2rem 1rem; display: flex; align-items: center; font-weight: 900; font-family: var(--font-display); background: rgba(255,255,255,0.02); border-right: 1px solid rgba(255,255,255,0.1); font-size: 1.1rem; }

.day-tracks { display: grid; grid-template-columns: repeat(12, 1fr); padding: 15px; gap: 10px; position: relative; }

.planning-item { border-radius: 8px; padding: 15px; border: 1px solid rgba(0,251,255,0.3); display: flex; align-items: center; justify-content: center; transition: all 0.3s; cursor: pointer; min-height: 80px; background: rgba(0,0,0,0.4); }
.planning-item:hover { transform: translateY(-2px) scale(1.02); z-index: 10; border-color: var(--accent-cyan); box-shadow: 0 10px 30px rgba(0,251,255,0.2); }
.planning-item.top8 { border-color: rgba(255,0,237,0.5); }
.planning-item.top8:hover { border-color: var(--accent-magenta); box-shadow: 0 10px 30px rgba(255,0,237,0.2); }

.item-content { text-align: center; width: 100%; }
.item-info { display: flex; flex-direction: column; gap: 4px; }
.game-name { font-weight: 900; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.phase-name { font-size: 0.75rem; color: var(--accent-cyan); font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
.planning-item.top8 .phase-name { color: var(--accent-magenta); }

/* === RULES === */
.rules-layout { display: grid; grid-template-columns: 250px 1fr; gap: 4rem; }
.rules-badge { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border: 2px solid white; border-radius: 8px; font-weight: 900; width: 100%; }
.chevron-right { background: #f1c40f; color: black; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; margin-left: 1rem; }
.rules-content { display: flex; flex-direction: column; gap: 1.5rem; }

.rule-accordion { border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; background: rgba(255,255,255,0.02); }
.rule-accordion.active { border-color: rgba(0,251,255,0.3); box-shadow: 0 0 20px rgba(0,251,255,0.05); }

.accordion-header { width: 100%; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; background: transparent; color: white; font-weight: 800; font-size: 1.25rem; text-transform: uppercase; text-align: left; cursor: pointer; border: none; }
.accordion-icon { width: 32px; height: 32px; background: #f1c40f; color: black; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.accordion-icon svg { width: 18px; height: 18px; }

.accordion-body { padding: 0 2rem 2rem; }
.rule-details { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; }
.rule-platform { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; }
.rule-list { list-style: none; padding: 0; }
.rule-list li { position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; color: var(--text-secondary); font-size: 0.95rem; }
.rule-list li::before { content: '♦'; position: absolute; left: 0; color: #f1c40f; }

@media (max-width: 992px) {
  .rules-layout { grid-template-columns: 1fr; }
  .event-hero h1 { font-size: 4rem; }
  .form-row { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .event-details { padding-top: 60px; }
  .event-hero { padding: 60px 0; }
  .event-hero h1 { font-size: 2.8rem; }
  .hero-meta { flex-direction: column; gap: 1rem; font-size: 1rem; }
  .inscription-card { padding: 2rem; }
  .planning-header, .planning-row { min-width: 900px; }
}

@media (max-width: 480px) {
  .event-hero h1 { font-size: 2.2rem; }
}
</style>
