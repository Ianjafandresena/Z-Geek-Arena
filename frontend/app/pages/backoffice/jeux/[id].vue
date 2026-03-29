<template>
  <div>
    <div class="page-header">
      <NuxtLink to="/backoffice/jeux" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </NuxtLink>
    </div>

    <div v-if="loading && !form.nom" class="loading-msg">Chargement du jeu...</div>

    <div v-else class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">Modifier le jeu</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nom du jeu</label>
              <input type="text" v-model="form.nom" required>
            </div>
            <div class="form-group">
              <label>Slug (URL)</label>
              <input type="text" v-model="form.slug" required>
            </div>
          </div>
          <div class="form-group" style="margin-top: 1.25rem;">
            <label>Plateforme</label>
            <select v-model="form.plateforme">
              <option value="">Non spécifié</option>
              <option value="PlayStation 5">PlayStation 5</option>
              <option value="Xbox Series X">Xbox Series X</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
              <option value="PC">PC</option>
              <option value="Multi-plateforme">Multi-plateforme</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Image (laisser vide pour conserver l'actuelle)</h3>
          <div class="upload-zone" @click="triggerFileInput">
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="hidden-input">
            
            <div v-if="preview" class="upload-preview">
              <img :src="preview" alt="Aperçu">
              <button type="button" class="remove-preview" @click.stop="removeFile">✕</button>
            </div>
            <div v-else-if="form.image_url" class="current-image">
              <img :src="apiBase + form.image_url" alt="Actuelle">
              <p>Cliquez pour changer d'image</p>
            </div>
            <div v-else class="upload-placeholder">
              <p>Cliquez pour ajouter une image</p>
            </div>
          </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="navigateTo('/backoffice/jeux')">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Sauvegarder les modifications' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { JeuService } from '~/services/JeuService'
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const route = useRoute()
const service = new JeuService()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase.replace('/api', '')

const loading = ref(false)
const error = ref(null)
const form = ref({ nom: '', slug: '', plateforme: '', image_url: '' })

const selectedFile = ref(null)
const preview = ref(null)
const fileInput = ref(null)

// Charger les données initiales
onMounted(async () => {
  loading.value = true
  try {
    const data = await service.getById(route.params.id)
    form.value = { ...data }
  } catch (e) {
    error.value = "Impossible de charger le jeu."
  } finally {
    loading.value = false
  }
})

const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    preview.value = URL.createObjectURL(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  preview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  
  const formData = new FormData()
  // Laravel nécessite _method=PUT pour le spoofing de méthode avec FormData
  formData.append('_method', 'PUT') 
  formData.append('nom', form.value.nom)
  formData.append('slug', form.value.slug)
  if (form.value.plateforme) formData.append('plateforme', form.value.plateforme)
  if (selectedFile.value) formData.append('image', selectedFile.value)

  try {
    // On utilise POST car multipart + PUT ne font pas bon ménage nativement en PHP
    await service.updateWithImage(route.params.id, formData)
    navigateTo('/backoffice/jeux')
  } catch (e) {
    error.value = "Erreur lors de la modification."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 1.5rem; }
.back-link { display: inline-flex; align-items: center; gap: 0.35rem; color: #5a6380; font-size: 0.85rem; text-decoration: none; }
.back-link svg { width: 16px; height: 16px; }
.back-link:hover { color: #00e5ff; }

.form-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 2rem; }
.form-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
.section-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 1.25rem; color: white; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #5a6380; }
.upload-zone { border: 2px dashed rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; }
.hidden-input { display: none; }
.upload-preview img, .current-image img { max-height: 150px; border-radius: 8px; margin-bottom: 0.5rem; }
.current-image p { font-size: 0.8rem; color: #5a6380; }

.error-text { color: #ff4757; font-size: 0.85rem; margin-bottom: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
.btn-cancel { padding: 0.7rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; }
.loading-msg { text-align: center; padding: 4rem; color: #5a6380; }
</style>
