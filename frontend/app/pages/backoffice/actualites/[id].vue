<template>
  <div>
    <div class="page-header">
      <NuxtLink to="/backoffice/actualites" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </NuxtLink>
    </div>

    <div v-if="loading && !form.titre" class="loading-msg">Chargement de l'article...</div>

    <div v-else class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">Modifier l'article</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" v-model="form.titre" required>
            </div>
            <div class="form-group">
              <label>Slug (URL)</label>
              <input type="text" v-model="form.slug" required>
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
            <div class="form-group">
              <label>Publié</label>
              <select v-model="form.publie">
                <option :value="true">Oui (Visible)</option>
                <option :value="false">Non (Brouillon)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Image Upload Field -->
        <div class="form-section">
          <h3 class="section-title">Image de référence</h3>
          <div class="upload-zone" @click="triggerFile" :class="{ 'has-file': preview || form.image_url }">
            <input type="file" ref="fileInput" @change="handleFile" accept="image/*" class="hidden">
            
            <img v-if="preview" :src="preview" class="upload-preview">
            <img v-else-if="form.image_url" :src="form.image_url" class="upload-preview">
            
            <div v-else class="upload-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <p>Cliquer pour changer l'image</p>
            </div>
            <p v-if="preview || form.image_url" class="upload-hint">Cliquez pour modifier l'image</p>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Contenu</h3>
          <div class="form-group">
            <label>Résumé</label>
            <textarea v-model="form.resume" rows="2" placeholder="Petit texte d'accroche..."></textarea>
          </div>
          <div class="form-group" style="margin-top: 1rem;">
            <label>Corps du texte</label>
            <textarea v-model="form.contenu" rows="10" required></textarea>
          </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="navigateTo('/backoffice/actualites')">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Sauvegarder les modifications' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ActualiteService } from '~/services/ActualiteService'
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const route = useRoute()
const { showSuccess } = useUIMessage()
const service = new ActualiteService()

const loading = ref(false)
const error = ref(null)
const form = ref({ 
  titre: '', 
  slug: '', 
  categorie: 'nouvelles', 
  resume: '', 
  contenu: '',
  publie: true,
  image_url: ''
})

const selectedFile = ref(null)
const preview = ref(null)
const fileInput = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const data = await service.getById(route.params.id)
    form.value = { ...data }
  } catch (e) {
    error.value = "Impossible de charger l'article."
  } finally {
    loading.value = false
  }
})

const triggerFile = () => fileInput.value.click()
const handleFile = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    preview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    const formData = new FormData()
    // Manual mapping for consistency
    formData.append('titre', form.value.titre)
    formData.append('slug', form.value.slug)
    formData.append('contenu', form.value.contenu)
    formData.append('extrait', form.value.extrait || form.value.resume || '')
    formData.append('categorie', form.value.categorie)
    formData.append('publie', form.value.publie)
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    await service.update(route.params.id, formData)
    await showSuccess('L\'article a été mis à jour.')
    navigateTo('/backoffice/actualites')
  } catch (e) {
    error.value = "Erreur lors de la mise à jour."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 1.5rem; }
.back-link { display: inline-flex; align-items: center; gap: 0.35rem; color: #5a6380; font-size: 0.85rem; text-decoration: none; }
.back-link:hover { color: #00e5ff; }
.form-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 2rem; }
.form-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
.section-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 1.25rem; color: white; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #5a6380; }
input, select, textarea { padding: 0.8rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: white; font-family: inherit; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #00e5ff; }

.upload-zone { border: 2px dashed rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; transition: 0.2s; }
.upload-zone:hover { border-color: #00e5ff; }
.upload-placeholder { color: #5a6380; }
.upload-placeholder svg { width: 40px; height: 40px; margin-bottom: 0.5rem; }
.upload-preview { max-height: 250px; border-radius: 8px; margin-bottom: 0.5rem; }
.upload-hint { font-size: 0.75rem; color: #5a6380; margin-top: 0.5rem; }
.hidden { display: none; }

.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
.btn-cancel { padding: 0.7rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; }
.loading-msg { text-align: center; padding: 4rem; color: #5a6380; }
</style>
