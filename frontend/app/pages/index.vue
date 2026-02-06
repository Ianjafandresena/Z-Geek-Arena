<template>
  <main>
    <Hero />
    
    <section class="section-padding" id="events">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Événements Principaux</h2>
          <NuxtLink to="/events" class="link-more">Voir tous les événements</NuxtLink>
        </div>
        
        <div class="events-grid">
          <EventCard 
            slug="marseille-2026"
            name="Marseille 2026"
            location="Marseille, France"
            date="01 - 03 Mai"
            status="À VENIR"
            gradient="linear-gradient(135deg, #ff0055 0%, #000000 100%)"
          />
          <EventCard 
            slug="castres-2026"
            name="Castres 2026"
            location="Castres, France"
            date="26 - 28 Juin"
            status="INSCRIPTIONS OUVERTES"
            gradient="linear-gradient(135deg, #0fb 0%, #000000 100%)"
          />
          <EventCard 
            slug="nice-2026"
            name="Nice 2026"
            location="Nice, France"
            date="09 - 11 Octobre"
            status="À VENIR"
            gradient="linear-gradient(135deg, #bf00ff 0%, #000000 100%)"
          />
        </div>
      </div>
    </section>

  
    <section class="section-padding bg-darker">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Actualités & Médias</h2>
          <NuxtLink to="#" class="link-more">Lire toutes les news</NuxtLink>
        </div>
        <div class="news-grid">
          <div class="news-card glass">
            <div class="news-date">28 / 10 / 25</div>
            <h3 class="news-title">Comment la communauté façonne l'avenir du gaming compétitif en 2026</h3>
            <NuxtLink to="#" class="text-cyan">Lire l'article &rarr;</NuxtLink>
          </div>
          <div class="news-card glass">
            <div class="news-date">15 / 10 / 25</div>
            <h3 class="news-title">Les nouvelles technologies VR qui vont révolutionner l'arène</h3>
            <NuxtLink to="#" class="text-cyan">Lire l'article &rarr;</NuxtLink>
          </div>
          <div class="news-card glass">
            <div class="news-date">02 / 10 / 25</div>
            <h3 class="news-title">Portrait : Dans les coulisses de la préparation des futurs champions</h3>
            <NuxtLink to="#" class="text-cyan">Lire l'article &rarr;</NuxtLink>
          </div>
        </div>
      </div>
    </section>


    <section class="section-padding" id="about">
      <div class="container about-grid">
        <div class="about-content">
          <h2 class="section-title">À Propos de Z Geek Arena</h2>
          <p>
            À la Z Geek Arena, vous verrez des champions établis affronter des rivaux inconnus. 
            Vous trouverez des joueurs qui ne se sont battus qu'en ligne nouer des amitiés et des rivalités réelles. 
            Tout ce qui rend le gaming et la culture geek spécial est au cœur de Z Geek Arena.
          </p>
          <button class="btn-primary" style="margin-top: 2rem;">En Savoir Plus</button>
        </div>
        <div class="about-image glass">
          <div class="placeholder-art">
            <span class="text-magenta">///</span> 
            ARÈNE DE COMBAT 
            <span class="text-cyan">///</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
}


.link-more {
  color: var(--accent-magenta);
  font-weight: 700;
  text-transform: uppercase;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  font-size: 0.9rem;
}

.link-more:hover {
  color: var(--accent-cyan);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.bg-darker {
  background-color: var(--bg-secondary);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.news-card {
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.news-card:hover {
  border-color: var(--accent-cyan);
  transform: translateY(-5px);
}

.news-date {
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.news-title {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
}

.about-content p {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.about-image {
  height: 400px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 2rem;
}

.placeholder-art {
  transform: rotate(-5deg);
}

.section-title {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 3rem;
}

.section-padding {
  padding: 160px 0;
}

@media (max-width: 992px) {
  .events-grid, .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .about-grid {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
  .section-title {
    font-size: 2.8rem;
  }
  
  .section-padding {
    padding: 100px 0;
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
  }
  
  .section-padding {
    padding: 80px 0;
  }
  
  .about-image {
    height: 280px;
    font-size: 1.4rem;
  }
  
  .about-content p {
    font-size: 1.1rem;
  }
  
  .news-card {
    padding: 1.5rem;
  }
  
  .news-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 640px) {
  .events-grid, .news-grid {
    grid-template-columns: 1fr;
  }
  .section-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .section-padding {
    padding: 60px 0;
  }
  
  .link-more {
    font-size: 0.8rem;
  }
  
  .about-grid {
    gap: 2.5rem;
  }
  
  .about-image {
    height: 220px;
    font-size: 1.2rem;
  }
}
</style>
