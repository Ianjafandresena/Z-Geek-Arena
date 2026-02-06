<template>
  <main class="news-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Actualités</h1>
        <p class="page-description">
          Restez informé sur les derniers tournois, les mises à jour des jeux et les moments forts de la communauté Z Geek Arena.
        </p>
      </div>
    </div>

    <section class="section-padding">
      <div class="container">
        <div class="news-featured">
          <div class="featured-card glass">
            <div class="featured-image" style="background-image: url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200')">
              <div class="news-category">NOUVELLES</div>
            </div>
            <div class="featured-content">
              <div class="news-date">11 / 11 / 25</div>
              <h2 class="display-font">Comment l'OPA Japon 2026 redéfinit l'arène compétitive</h2>
              <p>Une plongée profonde dans les nouvelles installations de Tokyo et ce que les joueurs peuvent attendre de l'édition la plus ambitieuse à ce jour.</p>
              <NuxtLink to="#" class="text-cyan">Lire l'article complet &rarr;</NuxtLink>
            </div>
          </div>
        </div>

        <div class="news-grid">
          <div v-for="n in 6" :key="n" class="news-item glass">
            <div class="news-image" :style="`background-image: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600&sig=${n}')`">
              <div class="news-category">COMMUNAUTÉ</div>
            </div>
            <div class="news-content">
              <div class="news-date">10 / 28 / 25</div>
              <h3 class="news-title">Calendrier des tournois communautaires pour l'hiver 2025</h3>
              <NuxtLink to="#" class="text-cyan">Lire plus &rarr;</NuxtLink>
            </div>
          </div>
        </div>

        <div class="pagination flex-center">
            <button class="btn-outline">Charger plus d'articles</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.news-page {
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

.news-featured {
  margin-bottom: 4rem;
}

.featured-card {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.featured-image {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.news-category {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: var(--accent-cyan);
  color: black;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  font-size: 0.7rem;
  border-radius: 4px;
}

.featured-content {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-content h2 {
  font-size: 2.5rem;
  margin: 1rem 0;
  line-height: 1.2;
}

.featured-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

.news-item {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease;
}

.news-item:hover {
  transform: translateY(-5px);
  border-color: var(--accent-magenta);
}

.news-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.news-content {
  padding: 1.5rem;
}

.news-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.news-title {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  height: 3.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.flex-center {
    display: flex;
    justify-content: center;
}

.btn-outline {
  padding: 1rem 2rem;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 4px;
  transition: all 0.3s ease;
}

@media (max-width: 992px) {
  .featured-card {
    grid-template-columns: 1fr;
  }
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-title {
    font-size: 4rem;
  }
  
  .page-header {
    padding: 60px 0;
  }
}

@media (max-width: 768px) {
  .featured-image {
    height: 280px;
  }
  
  .featured-content {
    padding: 2rem;
  }
  
  .featured-content h2 {
    font-size: 1.8rem;
  }
  
  .page-title {
    font-size: 3rem;
  }
  
  .news-page {
    padding-top: 80px;
  }
}

@media (max-width: 640px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 2.2rem;
  }
  
  .page-header {
    padding: 40px 0;
  }
  
  .featured-image {
    height: 220px;
  }
  
  .featured-content {
    padding: 1.5rem;
  }
  
  .featured-content h2 {
    font-size: 1.5rem;
  }
  
  .news-image {
    height: 160px;
  }
  
  .news-content {
    padding: 1.25rem;
  }
  
  .btn-outline {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
