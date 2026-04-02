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
        <!-- Message de chargement -->
        <div v-if="pending" class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des actualités...</p>
        </div>

        <div v-else>
          <!-- Featured News (Dernier article publié) -->
          <div v-if="featuredNews" class="news-featured">
            <div class="featured-card glass">
              <div class="featured-image" :style="`background-image: url('${featuredNews.image_url || '/assets/news-placeholder.jpg'}')`">
                <div class="news-category">{{ (featuredNews.categorie || 'NOUVELLES').toUpperCase() }}</div>
              </div>
              <div class="featured-content">
                <div class="news-date">{{ formatDate(featuredNews.date_publication) }}</div>
                <h2 class="display-font">{{ featuredNews.titre }}</h2>
                <p>{{ featuredNews.extrait }}</p>
                <NuxtLink :to="`/actualites/${featuredNews.slug}`" class="text-cyan">Lire l'article complet &rarr;</NuxtLink>
              </div>
            </div>
          </div>

          <!-- News Grid -->
          <div v-if="otherNews.length > 0" class="news-grid">
            <div v-for="news in otherNews" :key="news.id" class="news-item glass">
              <div class="news-image" :style="`background-image: url('${news.image_url || '/assets/news-placeholder.jpg'}')`">
                <div class="news-category">{{ (news.categorie || 'COMMUNAUTÉ').toUpperCase() }}</div>
              </div>
              <div class="news-content">
                <div class="news-date">{{ formatDate(news.date_publication) }}</div>
                <h3 class="news-title">{{ news.titre }}</h3>
                <NuxtLink :to="`/actualites/${news.slug}`" class="text-cyan">Lire plus &rarr;</NuxtLink>
              </div>
            </div>
          </div>

          <div v-if="!featuredNews && otherNews.length === 0" class="empty-state">
            <p>Aucune actualité publiée pour le moment.</p>
          </div>

          <div v-if="otherNews.length > 5" class="pagination flex-center">
            <button class="btn-outline">Charger plus d'articles</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ActualiteService } from '~/services/ActualiteService'

const service = new ActualiteService()
const { data: newsItems, pending } = await useAsyncData('news', () => service.getAll())

const news = computed(() => newsItems.value || [])
const featuredNews = computed(() => news.value[0] || null)
const otherNews = computed(() => news.value.slice(1))

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, ' / ')
}
</script>

<style scoped>
.news-page { padding-top: 100px; }
.page-header { padding: 80px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.page-title { font-size: 5rem; margin-bottom: 1rem; }
.page-description { max-width: 600px; color: var(--text-secondary); font-size: 1.1rem; }
.news-featured { margin-bottom: 4rem; }
.featured-card { display: grid; grid-template-columns: 1.2fr 1fr; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); }
.featured-image { height: 400px; background-size: cover; background-position: center; position: relative; }
.news-category { position: absolute; top: 1.5rem; left: 1.5rem; background: var(--accent-cyan); color: black; font-weight: 800; padding: 0.25rem 0.75rem; font-size: 0.7rem; border-radius: 4px; }
.featured-content { padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
.featured-content h2 { font-size: 2.5rem; margin: 1rem 0; line-height: 1.2; }
.featured-content p { color: var(--text-secondary); margin-bottom: 2rem; }
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 4rem; }
.news-item { border-radius: 8px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); transition: transform 0.3s ease; }
.news-item:hover { transform: translateY(-5px); border-color: var(--accent-magenta); }
.news-image { height: 200px; background-size: cover; background-position: center; position: relative; }
.news-content { padding: 1.5rem; }
.news-date { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
.news-title { font-size: 1.25rem; margin-bottom: 1.5rem; line-height: 1.4; height: 3.5rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; }

.loading-state, .empty-state { text-align: center; padding: 4rem; color: var(--text-secondary); }
.spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--accent-cyan); border-radius: 50%; margin: 0 auto 1.5rem; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.flex-center { display: flex; justify-content: center; }
.btn-outline { padding: 1rem 2rem; background: transparent; color: white; border: 2px solid white; border-radius: 4px; transition: all 0.3s ease; cursor: pointer; }
.btn-outline:hover { background: white; color: black; }

@media (max-width: 992px) { .featured-card { grid-template-columns: 1fr; } .news-grid { grid-template-columns: repeat(2, 1fr); } .page-title { font-size: 4rem; } }
@media (max-width: 640px) { .news-grid { grid-template-columns: 1fr; } .page-title { font-size: 2.2rem; } }
</style>
