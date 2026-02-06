<template>
  <main class="event-details" v-if="event">
    <!-- Header Hero -->
    <section class="event-hero" :style="{ background: event.gradient }">
      <div class="container hero-content">
        <NuxtLink to="/events" class="back-link">&larr; Retour aux événements</NuxtLink>
        <div class="badge">{{ event.status }}</div>
        <h1 class="display-font">{{ event.name }}</h1>
        <div class="hero-meta">
          <span>
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {{ event.location }}
          </span>
          <span>
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            {{ event.date }}
          </span>
        </div>
      </div>
    </section>

    <!-- Planning Section -->
    <section class="section-padding planning-section">
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
                  :key="item.game"
                  class="planning-item"
                  :style="{ 
                    gridColumn: `${timeSlots.indexOf(item.start) + 2} / span ${item.duration}`,
                    backgroundImage: `linear-gradient(rgba(10, 16, 24, 0.8), rgba(10, 16, 24, 0.95)), url(${gameImages[item.game]})`
                  }"
                  :class="item.type"
                >
                  <div class="item-content">
                    <div class="item-info">
                      <span class="game-name">{{ item.game }}</span>
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

    <!-- Rules Section -->
    <section class="section-padding rules-section bg-darker">
      <div class="container">
        <div class="rules-layout">
          <div class="rules-sidebar">
            <div class="rules-badge">
              <span>EVENT RULES</span>
              <div class="chevron-right">&rarr;</div>
            </div>
          </div>
          
          <div class="rules-content">
            <div v-for="game in games" :key="game.name" class="rule-accordion" :class="{ active: activeGame === game.name }">
              <button class="accordion-header" @click="toggleAccordion(game.name)">
                <span class="game-title">{{ game.name }}</span>
                <div class="accordion-icon">
                  <svg v-if="activeGame === game.name" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </button>
              
              <div class="accordion-body" v-show="activeGame === game.name">
                <div class="rule-details">
                  <div class="rule-platform">{{ game.platform }} | Bring Your Own Controller</div>
                  <ul class="rule-list">
                    <li v-for="rule in game.rules" :key="rule">{{ rule }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const route = useRoute()
const activeGame = ref('STREET FIGHTER 6')

const toggleAccordion = (gameName) => {
  activeGame.value = activeGame.value === gameName ? null : gameName
}

const eventsList = [
  {
    slug: "marseille-2026",
    name: "Marseille 2026",
    location: "Marseille, France",
    date: "01 - 03 Mai",
    status: "À VENIR",
    gradient: "linear-gradient(135deg, #ff0055 0%, #000000 100%)"
  },
  {
    slug: "castres-2026",
    name: "Castres 2026",
    location: "Castres, France",
    date: "26 - 28 Juin",
    status: "INSCRIPTIONS OUVERTES",
    gradient: "linear-gradient(135deg, #0fb 0%, #000000 100%)"
  },
  {
    slug: "nice-2026",
    name: "Nice 2026",
    location: "Nice, France",
    date: "09 - 11 Octobre",
    status: "À VENIR",
    gradient: "linear-gradient(135deg, #bf00ff 0%, #000000 100%)"
  }
]

const event = computed(() => eventsList.find(e => e.slug === route.params.id))

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", 
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
]

const gameImages = {
  "Tekken 8": "/tekken8.jpg",
  "Smash Bros": "/smash bros.jfif",
  "Mortal Kombat": "/mortal kobat.jpg",
  "DBZ S. Zero": "/dbz parkn0.jpg",
  "EA FC 26": "/fc26.jpg",
  "Fatal Fury": "/Fury.jpg"
}

const planningDays = computed(() => {
  const allGames = Object.keys(gameImages)
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5)
  
  const day1Games = shuffle(allGames).slice(0, 3)
  const day2Games = shuffle(allGames).slice(0, 4)

  return [
    {
      label: "SAMEDI 02",
      items: [
        { game: day1Games[0], start: "10:00 AM", duration: 4, type: "pools", phase: "POULES A/B" },
        { game: day1Games[1], start: "11:00 AM", duration: 5, type: "pools", phase: "POULES C/D" },
        { game: day1Games[2], start: "02:00 PM", duration: 3, type: "top8", phase: "TOP 8" }
      ]
    },
    {
      label: "DIMANCHE 03",
      items: [
        { game: day2Games[0], start: "09:00 AM", duration: 4, type: "pools", phase: "POULES FINALES" },
        { game: day2Games[1], start: "01:00 PM", duration: 3, type: "top8", phase: "TOP 8" },
        { game: day2Games[2], start: "04:00 PM", duration: 3, type: "top8", phase: "TOP 8" },
        { game: day2Games[3], start: "07:00 PM", duration: 2, type: "top8", phase: "TOP 8" }
      ]
    }
  ]
})

const games = [
  {
    name: "TEKKEN 8",
    platform: "PlayStation 5",
    rules: [
      "TEKKEN World Tour rules will supersede these rules",
      "Double Elimination",
      "Tournament Mode Default Settings",
      "3/5 Rounds per Game",
      "2/3 Games per Set",
      "3/5 Games for Finals & semi-finals"
    ]
  },
  {
    name: "SUPER SMASH BROS",
    platform: "Nintendo Switch",
    rules: [
      "3 Stocks, 7 Minutes",
      "Hazards Off",
      "No Items",
      "Best of 3 (Top 8 is Best of 5)",
      "Set length: 8-10 minutes average"
    ]
  },
  {
    name: "EA SPORTS FC 26",
    platform: "PlayStation 5",
    rules: [
      "Match Duration: 6 minutes halves",
      "Speed: Normal",
      "Competitive Mode: On",
      "Direct Invite Only",
      "Single Elimination for qualifiers"
    ]
  },
  {
    name: "MORTAL KOMBAT",
    platform: "PlayStation 5",
    rules: [
      "Double Elimination",
      "Tournament Mode",
      "2/3 Games per Set",
      "All characters allowed",
      "3/5 for Winners/Losers/Grand Finals"
    ]
  }
]
</script>

<style scoped>
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

.hero-content {
  position: relative;
  z-index: 2;
}

.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}

.back-link:hover {
  color: var(--accent-cyan);
}

.event-hero h1 {
  font-size: 5rem;
  margin: 1.5rem 0;
}

.hero-meta {
  display: flex;
  justify-content: center;
  gap: 3rem;
  color: var(--text-secondary);
  font-size: 1.25rem;
  font-weight: 600;
}

.hero-meta span {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-svg {
  width: 24px;
  height: 24px;
  color: var(--accent-cyan);
}

/* Planning */
.planning-container {
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.planning-header {
  display: grid;
  grid-template-columns: 120px repeat(12, 1fr);
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.time-slot {
  padding: 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-secondary);
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.time-slot.label {
  color: white;
  text-align: left;
}

.planning-grid {
  display: flex;
  flex-direction: column;
}

.planning-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 120px;
}

.day-label {
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  font-weight: 900;
  font-family: var(--font-display);
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1.1rem;
}

.day-tracks {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  padding: 15px;
  gap: 10px;
  position: relative;
}

.planning-item {
  border-radius: 8px;
  padding: 15px;
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(0, 251, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  min-height: 80px;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

.planning-item:hover {
  transform: translateY(-2px) scale(1.02);
  z-index: 10;
  border-color: var(--accent-cyan);
  box-shadow: 0 10px 30px rgba(0, 251, 255, 0.2), inset 0 0 10px rgba(0, 251, 255, 0.2);
}

.planning-item.top8 {
  border-color: rgba(255, 0, 237, 0.5);
}

.planning-item.top8:hover {
  border-color: var(--accent-magenta);
  box-shadow: 0 10px 30px rgba(255, 0, 237, 0.2), inset 0 0 10px rgba(255, 0, 237, 0.2);
}

.item-content {
  text-align: center;
  width: 100%;
  z-index: 2;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.game-name {
  font-weight: 900;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.phase-name {
  font-size: 0.75rem;
  color: var(--accent-cyan);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.9;
}

.planning-item.top8 .phase-name {
  color: var(--accent-magenta);
}

/* Rules Layout */
.rules-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 4rem;
}

.rules-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border: 2px solid white;
  border-radius: 8px;
  font-weight: 900;
  background: transparent;
  width: 100%;
}

.chevron-right {
  background: #f1c40f;
  color: black;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin-left: 1rem;
}

.rules-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rule-accordion {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.rule-accordion.active {
  border-color: rgba(0, 251, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 251, 255, 0.05);
}

.accordion-header {
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  color: white;
  font-weight: 800;
  font-size: 1.25rem;
  text-transform: uppercase;
  text-align: left;
}

.accordion-icon {
  width: 32px;
  height: 32px;
  background: #f1c40f;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.accordion-icon svg {
  width: 18px;
  height: 18px;
}

.accordion-body {
  padding: 0 2rem 2rem;
}

.rule-details {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1.5rem;
}

.rule-platform {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.rule-list {
  list-style: none;
  padding: 0;
}

.rule-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.rule-list li::before {
  content: '♦';
  position: absolute;
  left: 0;
  color: #f1c40f;
}

@media (max-width: 992px) {
  .rules-layout {
    grid-template-columns: 1fr;
  }
  
  .event-hero {
    padding: 80px 0;
  }
  
  .event-hero h1 {
    font-size: 4rem;
  }
  
  .section-title {
    font-size: 2.2rem;
  }
  
  .planning-container {
    margin: 0 -1.5rem;
    border-radius: 0;
  }
}

@media (max-width: 768px) {
  .event-details {
    padding-top: 60px;
  }
  
  .event-hero {
    padding: 60px 0;
  }
  
  .event-hero h1 {
    font-size: 2.8rem;
  }
  
  .hero-meta {
    flex-direction: column;
    gap: 1rem;
    font-size: 1rem;
  }
  
  .back-link {
    margin-bottom: 1.5rem;
  }
  
  .badge {
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
  }
  
  .accordion-header {
    padding: 1.25rem 1.5rem;
    font-size: 1.1rem;
  }
  
  .accordion-body {
    padding: 0 1.5rem 1.5rem;
  }
  
  .rules-badge {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }
  
  /* Planning scroll horizontal */
  .planning-container {
    margin: 0 -1rem;
    border-radius: 0;
  }
  
  .planning-header {
    min-width: 900px;
  }
  
  .planning-row {
    min-width: 900px;
  }
  
  .day-label {
    font-size: 0.9rem;
    padding: 1.5rem 0.75rem;
  }
  
  .time-slot {
    font-size: 0.65rem;
    padding: 0.75rem 0.5rem;
  }
  
  .game-name {
    font-size: 0.9rem;
  }
  
  .phase-name {
    font-size: 0.65rem;
  }
  
  .planning-item {
    min-height: 60px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .event-hero h1 {
    font-size: 2.2rem;
  }
  
  .event-hero {
    padding: 50px 0;
  }
  
  .hero-meta {
    font-size: 0.9rem;
  }
  
  .icon-svg {
    width: 20px;
    height: 20px;
  }
  
  .accordion-header {
    padding: 1rem 1.25rem;
    font-size: 1rem;
  }
  
  .accordion-icon {
    width: 28px;
    height: 28px;
  }
  
  .accordion-icon svg {
    width: 14px;
    height: 14px;
  }
  
  .rule-list li {
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 0.9rem;
  }
}
</style>
