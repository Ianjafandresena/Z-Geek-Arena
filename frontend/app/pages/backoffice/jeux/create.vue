<template>
  <div>
    <div class="page-header">
      <NuxtLink to="/backoffice/jeux" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </NuxtLink>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">Informations du jeu</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nom du jeu</label>
              <input type="text" v-model="form.nom" placeholder="Ex: Tekken 8" required>
            </div>
            <div class="form-group">
              <label>Slug (URL)</label>
              <input type="text" v-model="form.slug" placeholder="tekken-8" required>
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
          <h3 class="section-title">Image du jeu (jacket / logo)</h3>
          <div class="upload-zone" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="hidden-input">
            <div v-if="!preview" class="upload-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:40px;height:40px;color:#5a6380;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p>Cliquez ou glissez une image</p>
              <span>JPG, PNG, WEBP — max 2MB</span>
            </div>
            <div v-else class="upload-preview">
              <img :src="preview" alt="Aperçu">
              <button type="button" class="remove-preview" @click.stop="removeFile">✕</button>
            </div>
          </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="navigateTo('/backoffice/jeux')">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Création...' : 'Créer le jeu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { loading, error, create } = useJeux()

const form = ref({ nom: '', slug: '', plateforme: '' })
const selectedFile = ref(null)
const preview = ref(null)
const fileInput = ref(null)

const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    preview.value = URL.createObjectURL(file)
  }
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
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
  const formData = new FormData()
  formData.append('nom', form.value.nom)
  formData.append('slug', form.value.slug)
  if (form.value.plateforme) formData.append('plateforme', form.value.plateforme)
  if (selectedFile.value) formData.append('image', selectedFile.value)

  const result = await create(formData)
  if (result) navigateTo('/backoffice/jeux')
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
/* Upload zone */
.upload-zone {
  border: 2px dashed rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.upload-zone:hover { border-color: #00e5ff; }
.hidden-input { display: none; }
.upload-placeholder p { color: #8892b0; margin: 0.75rem 0 0.25rem; font-size: 0.9rem; }
.upload-placeholder span { color: #5a6380; font-size: 0.75rem; }

.upload-preview { position: relative; display: inline-block; }
.upload-preview img { max-height: 200px; border-radius: 8px; }
.remove-preview {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff4757;
  color: white;
  border: none;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-text { color: #ff4757; font-size: 0.85rem; margin-bottom: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
.btn-cancel { padding: 0.7rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-submit:hover { box-shadow: 0 0 20px rgba(0,229,255,0.35); }
.btn-submit:disabled { opacity: 0.5; }
</style>
