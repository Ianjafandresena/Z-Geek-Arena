<template>
  <main class="events-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Événements</h1>
        <p class="page-description">
          Depuis ses modestes débuts, Z Geek Arena a grandi pour englober un portefeuille annuel d'événements de jeux de combat de premier plan dans le monde entier.
        </p>
      </div>
    </div>

    <section class="section-padding">
      <div class="container">
        <h2 class="category-title">Événements Principaux à Venir</h2>
        <div class="events-grid">
          <EventCard 
            v-for="event in upcomingEvents" 
            :key="event.name"
            v-bind="event"
          />
        </div>

        <h2 class="category-title" style="margin-top: 60px;">Événements TBA (À Annoncer)</h2>
        <div class="events-grid">
          <EventCard 
            v-for="event in tbaEvents" 
            :key="event.name"
            v-bind="event"
            status="TBA"
          />
        </div>
      </div>
    </section>


    <section class="hall-cta">
      <div class="container flex-center">
        <div class="cta-content">
          <h2 class="display-font">Le Panthéon des Champions</h2>
          <p>Le titre de Champion Z Geek Arena est décerné à ceux qui surmontent tous les obstacles pour remporter la victoire.</p>
          <button class="btn-primary" style="margin-top: 1.5rem;">Voir Plus</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const upcomingEvents = [
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

const tbaEvents = [
  {
    slug: "toulouse-2027",
    name: "Toulouse 2027",
    location: "Toulouse, France",
    date: "À venir",
    gradient: "linear-gradient(135deg, #333 0%, #000 100%)"
  },
  {
    slug: "chambery-2027",
    name: "Chambery 2027",
    location: "Chambery, France",
    date: "À venir",
    gradient: "linear-gradient(135deg, #333 0%, #000 100%)"
  }
]
</script>

<style scoped>
.events-page {
  padding-top: 100px;
}

.page-header {
  padding: 80px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.page-title {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.page-description {
  max-width: 600px;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.category-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.hall-cta {
  background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), 
              radial-gradient(circle at center, var(--accent-purple) 0%, transparent 70%);
  padding: 120px 0;
  text-align: center;
}

.flex-center {
  display: flex;
  justify-content: center;
}

.cta-content h2 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

@media (max-width: 992px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .page-title {
    font-size: 3.5rem;
  }
  
  .page-header {
    padding: 60px 0;
  }
  
  .cta-content h2 {
    font-size: 2.8rem;
  }
  
  .hall-cta {
    padding: 80px 0;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.8rem;
  }
  
  .events-page {
    padding-top: 80px;
  }
  
  .category-title {
    font-size: 1.25rem;
  }
  
  .cta-content h2 {
    font-size: 2.2rem;
  }
  
  .cta-content p {
    font-size: 0.95rem;
    padding: 0 1rem;
  }
}

@media (max-width: 640px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2.2rem;
  }
  
  .page-header {
    padding: 40px 0;
  }
  
  .category-title {
    font-size: 1.1rem;
  }
  
  .cta-content h2 {
    font-size: 1.8rem;
  }
  
  .hall-cta {
    padding: 60px 0;
  }
}
</style>
