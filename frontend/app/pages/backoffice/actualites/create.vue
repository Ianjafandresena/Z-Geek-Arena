<template>
  <div>
    <div class="page-header">
      <NuxtLink to="/backoffice/actualites" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </NuxtLink>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">Contenu de l'article</h3>
          <div class="form-group">
            <label>Titre</label>
            <input type="text" v-model="form.titre" placeholder="Titre de l'article" required>
          </div>
          <div class="form-grid" style="margin-top:1.25rem;">
            <div class="form-group">
              <label>Slug (URL)</label>
              <input type="text" v-model="form.slug" placeholder="mon-article" required>
            </div>
            <div class="form-group">
              <label>Catégorie</label>
              <select v-model="form.categorie">
                <option value="nouvelles">Nouvelles</option>
                <option value="communaute">Communauté</option>
                <option value="esport">Esport</option>
                <option value="culture">Culture</option>
                <option value="partenaires">Partenaires</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Détails</h3>
          <div class="form-group">
            <label>Extrait (résumé court)</label>
            <input type="text" v-model="form.extrait" placeholder="Résumé en une phrase...">
          </div>
          <div class="form-group" style="margin-top:1.25rem;">
            <label>Contenu complet</label>
            <textarea v-model="form.contenu" rows="8" placeholder="Rédigez votre article ici..." required></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Publication</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Événement lié (optionnel)</label>
              <select v-model="form.event_id">
                <option value="">Aucun</option>
                <option v-for="e in events" :key="e.id" :value="e.id">{{ e.nom }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date de publication</label>
              <input type="date" v-model="form.date_publication">
            </div>
          </div>
          <div class="form-group" style="margin-top: 1.25rem;">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.publie">
              <span>Publier immédiatement</span>
            </label>
          </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="navigateTo('/backoffice/actualites')">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Publication...' : 'Publier l\'article' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { events, fetchAll: fetchEvents } = useEvents()
const { loading, error, create } = useActualites()
await fetchEvents()

const form = ref({
  titre: '',
  slug: '',
  contenu: '',
  extrait: '',
  categorie: 'nouvelles',
  event_id: '',
  date_publication: new Date().toISOString().split('T')[0],
  publie: true
})

const handleSubmit = async () => {
  const data = { ...form.value }
  if (!data.event_id) delete data.event_id
  const result = await create(data)
  if (result) navigateTo('/backoffice/actualites')
}
</script>

<style scoped>
.page-header { margin-bottom: 1.5rem; }
.back-link { display: inline-flex; align-items: center; gap: 0.35rem; color: #5a6380; font-size: 0.85rem; text-decoration: none; }
.back-link svg { width: 16px; height: 16px; }
.back-link:hover { color: #00e5ff; }

.form-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 2rem; }
.form-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
.form-section:last-of-type { border-bottom: none; padding-bottom: 0; }
.section-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 1.25rem; color: white; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #5a6380; }
input[type="text"], input[type="date"], select, textarea { padding: 0.8rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: white; font-family: inherit; font-size: 0.9rem; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #00e5ff; }
textarea { resize: vertical; }

.checkbox-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; text-transform: none; font-size: 0.9rem; color: #d0d6e0; }
.checkbox-label input[type="checkbox"] { width: 18px; height: 18px; accent-color: #00e5ff; }

.error-text { color: #ff4757; font-size: 0.85rem; margin-bottom: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
.btn-cancel { padding: 0.7rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-submit:hover { box-shadow: 0 0 20px rgba(0,229,255,0.35); }
.btn-submit:disabled { opacity: 0.5; }
</style>
