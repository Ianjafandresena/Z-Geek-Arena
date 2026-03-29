<template>
  <div>
    <div class="page-header">
      <NuxtLink to="/backoffice/events" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </NuxtLink>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">Informations générales</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nom de l'événement</label>
              <input type="text" v-model="form.nom" placeholder="Ex: Marseille 2026" required>
            </div>
            <div class="form-group">
              <label>Slug (URL)</label>
              <input type="text" v-model="form.slug" placeholder="marseille-2026" required>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Lieu & Dates</h3>
          <div class="form-grid">
            <div class="form-group relative">
              <div class="label-with-action">
                <label>Lieu</label>
                <NuxtLink to="/backoffice/lieux" class="small-action-link">+ Gérer les lieux</NuxtLink>
              </div>

              <div class="custom-select-wrapper" :class="{ 'is-open': isDropdownOpen }">
                <div class="custom-select-trigger" @click="toggleDropdown">
                  <div v-if="selectedLieu" class="selected-val">
                    <strong>{{ selectedLieu.nom }}</strong>
                    <span>{{ selectedLieu.ville }}</span>
                  </div>
                  <span v-else class="placeholder">Sélectionner un lieu...</span>
                  <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>

                <div v-if="isDropdownOpen" class="custom-select-popover">
                  <div class="popover-search">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input 
                      type="text" 
                      v-model="searchQuery" 
                      placeholder="Taper pour filtrer..." 
                      ref="searchInput"
                      @click.stop
                    >
                  </div>
                  <div class="popover-list">
                    <div 
                      v-for="lieu in filteredLieux" 
                      :key="lieu.id" 
                      class="popover-option"
                      :class="{ 'is-selected': form.lieu_id === lieu.id }"
                      @click="selectLieu(lieu)"
                    >
                      <div class="option-info">
                        <strong>{{ lieu.nom }}</strong>
                        <span>{{ lieu.ville }}, {{ lieu.pays }}</span>
                      </div>
                      <svg v-if="form.lieu_id === lieu.id" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div v-if="filteredLieux.length === 0" class="no-results">
                      Aucun lieu trouvé pour "{{ searchQuery }}"
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Statut</label>
              <select v-model="form.statut">
                <option value="a_venir">À venir</option>
                <option value="inscriptions_ouvertes">Inscriptions ouvertes</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date de début</label>
              <input type="date" v-model="form.date_debut" required>
            </div>
            <div class="form-group">
              <label>Date de fin</label>
              <input type="date" v-model="form.date_fin" required>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Apparence</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Gradient CSS (Générateur dynamique)</label>
              <div class="color-picker-group">
                <div class="color-input">
                  <input type="color" v-model="color1">
                  <span>Couleur 1</span>
                </div>
                <div class="color-input">
                  <input type="color" v-model="color2">
                  <span>Couleur 2</span>
                </div>
              </div>
              <div class="gradient-preview" :style="{ background: form.gradient }">
                <span class="preview-text">Aperçu du dégradé</span>
              </div>
              <input type="text" v-model="form.gradient" class="mt-xs" style="font-size: 0.75rem; color: #5a6380;">
            </div>
            <div class="form-group">
              <label>Image de l'événement</label>
              <div class="upload-zone" @click="triggerFile" :class="{ 'has-file': preview }">
                <input type="file" ref="fileInput" @change="handleFile" accept="image/*" class="hidden">
                <img v-if="preview" :src="preview" class="upload-preview">
                <div v-else class="upload-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <p>Cliquer pour uploader</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Description</h3>
          <div class="form-group">
            <textarea v-model="form.description" rows="5" placeholder="Décrivez cet événement..."></textarea>
          </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="navigateTo('/backoffice/events')">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Enregistrement...' : "Créer l'événement" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { LieuService } from '~/services/LieuService'

definePageMeta({
  layout: 'backoffice',
  middleware: ['admin']
})

// Charger les lieux depuis l'API
const lieuService = new LieuService()
const lieux = ref([])
try {
  lieux.value = await lieuService.getAll()
} catch (e) {
  console.error('Erreur chargement lieux:', e)
}

const { loading, error, create } = useEvents()

const color1 = ref('#00fbff')
const color2 = ref('#000000')

const form = ref({
  nom: '',
  slug: '',
  lieu_id: '',
  statut: 'a_venir',
  date_debut: '',
  date_fin: '',
  gradient: 'linear-gradient(135deg, #00fbff 0%, #000000 100%)',
  description: ''
})

// === Searchable Select Logic ===
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    nextTick(() => searchInput.value?.focus())
  }
}

const selectLieu = (lieu) => {
  form.value.lieu_id = lieu.id
  isDropdownOpen.value = false
  searchQuery.value = ''
}

const selectedLieu = computed(() => {
  return lieux.value.find(l => l.id === form.value.lieu_id)
})

const filteredLieux = computed(() => {
  if (!searchQuery.value) return lieux.value
  const q = searchQuery.value.toLowerCase()
  return lieux.value.filter(l => 
    l.nom.toLowerCase().includes(q) || 
    l.ville.toLowerCase().includes(q)
  )
})

// === File Upload Logic ===
const selectedFile = ref(null)
const preview = ref(null)
const fileInput = ref(null)

// Fermer le dropdown au clic ailleurs
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
      isDropdownOpen.value = false
    }
  })
})

// Mettre à jour le dégradé quand les couleurs changent
watch([color1, color2], () => {
  form.value.gradient = `linear-gradient(135deg, ${color1.value} 0%, ${color2.value} 100%)`
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
  const formData = new FormData()
  Object.keys(form.value).forEach(key => {
    formData.append(key, form.value[key])
  })
  if (selectedFile.value) {
    formData.append('image', selectedFile.value)
  }

  const result = await create(formData)
  if (result) {
    navigateTo('/backoffice/events')
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 1.5rem; }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #5a6380;
  font-size: 0.85rem;
  text-decoration: none;
}
.back-link svg { width: 16px; height: 16px; }
.back-link:hover { color: #00e5ff; }

.form-card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.relative { position: relative; }

.label-with-action { display: flex; justify-content: space-between; align-items: center; }
.small-action-link { font-size: 0.7rem; font-weight: 700; color: #ff00ed; text-decoration: none; }
.small-action-link:hover { text-decoration: underline; }

/* Custom Searchable Select */
.custom-select-wrapper { position: relative; }
.custom-select-trigger { padding: 0.8rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; min-height: 48px; }
.custom-select-trigger:hover { border-color: rgba(0,229,255,0.4); }
.custom-select-wrapper.is-open .custom-select-trigger { border-color: #00e5ff; background: rgba(0, 229, 255, 0.03); }

.selected-val { display: flex; flex-direction: column; line-height: 1.2; }
.selected-val strong { font-size: 0.9rem; color: white; }
.selected-val span { font-size: 0.75rem; color: #5a6380; font-weight: 600; }
.placeholder { color: #5a6380; font-size: 0.9rem; }
.chevron { width: 16px; height: 16px; opacity: 0.4; transition: transform 0.2s; }
.is-open .chevron { transform: rotate(180deg); opacity: 1; color: #00e5ff; }

.custom-select-popover { position: absolute; top: calc(100% + 8px); left: 0; width: 100%; background: #111420; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; z-index: 100; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; }

.popover-search { padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 0.75rem; background: rgba(0,0,0,0.2); }
.search-icon { width: 14px; height: 14px; color: #5a6380; flex-shrink: 0; }
.popover-search input { flex: 1; background: transparent; border: none; padding: 0; font-size: 0.85rem; padding: 0.25rem 0; width: 100%; border-radius: 0; background-color: transparent !important; }

.popover-list { max-height: 250px; overflow-y: auto; }
.popover-option { padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; }
.popover-option:hover { background: rgba(255,255,255,0.04); }
.popover-option.is-selected { background: rgba(0,229,255,0.06); }
.option-info { display: flex; flex-direction: column; gap: 0.15rem; }
.option-info strong { font-size: 0.85rem; color: white; }
.option-info span { font-size: 0.75rem; color: #5a6380; font-weight: 600; }
.check-icon { width: 14px; height: 14px; color: #00e5ff; }
.no-results { padding: 1.5rem; text-align: center; color: #5a6380; font-size: 0.8rem; }

textarea { resize: vertical; }

.gradient-preview {
  height: 60px;
  border-radius: 8px;
  margin-top: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-text { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.mt-xs { margin-top: 0.5rem; }

/* Color Picker */
.color-picker-group { display: flex; gap: 1rem; }
.color-input { flex: 1; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; }
.color-input input[type="color"] { width: 30px; height: 30px; border: none; border-radius: 4px; background: transparent; cursor: pointer; }
.color-input span { font-size: 0.7rem; color: #5a6380; font-weight: 600; }

/* Upload Zone */
.upload-zone { border: 2px dashed rgba(255, 255, 255, 0.1); border-radius: 12px; height: 160px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; overflow: hidden; position: relative; }
.upload-zone:hover { border-color: #00e5ff; background: rgba(0, 229, 255, 0.02); }
.upload-placeholder { text-align: center; color: #5a6380; }
.upload-placeholder svg { width: 32px; height: 32px; margin-bottom: 0.5rem; opacity: 0.5; }
.upload-placeholder p { font-size: 0.8rem; font-weight: 600; }
.upload-preview { width: 100%; height: 100%; object-fit: cover; }
.hidden { display: none; }

.error-text {
  color: #ff4757;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-cancel {
  padding: 0.7rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #8892b0;
  font-weight: 600;
  cursor: pointer;
}
.btn-cancel:hover { border-color: rgba(255, 255, 255, 0.2); color: white; }

.btn-submit {
  padding: 0.7rem 1.5rem;
  background: #00e5ff;
  border: none;
  border-radius: 8px;
  color: #000;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-submit:hover {
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.35);
  transform: translateY(-1px);
}
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
