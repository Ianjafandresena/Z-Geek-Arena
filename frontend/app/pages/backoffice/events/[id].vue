<template>
  <div>
    <div class="page-header">
      <NuxtLink to="/backoffice/events" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </NuxtLink>
    </div>

    <div v-if="loading && !form.nom" class="loading-msg">Chargement de l'événement...</div>

    <div v-else class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <h3 class="section-title">Informations générales</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nom de l'événement</label>
              <input type="text" v-model="form.nom" required>
            </div>
            <div class="form-group">
              <label>Slug (URL)</label>
              <input type="text" v-model="form.slug" required>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Ville, Lieu & Dates</h3>
          <div class="form-grid">
            <!-- Ville (Lieu Select) -->
            <div class="form-group relative">
              <div class="label-with-action">
                <label>Ville</label>
                <NuxtLink to="/backoffice/lieux" class="small-action-link">+ Gérer les villes</NuxtLink>
              </div>

              <div class="custom-select-wrapper" :class="{ 'is-open': isDropdownOpen }">
                <div class="custom-select-trigger" @click="toggleDropdown">
                  <div v-if="selectedLieu" class="selected-val">
                    <strong>{{ selectedLieu.ville }}</strong>
                  </div>
                  <span v-else class="placeholder">Sélectionner une ville...</span>
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
                        <strong>{{ lieu.ville }}</strong>
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

            <!-- Salle (Input) -->
            <div class="form-group">
              <label>Nom du lieu (Salle)</label>
              <input type="text" v-model="form.salle" placeholder="Ex: Palais des expositions" required>
            </div>

            <div class="form-group">
              <label>Statut</label>
              <select v-model="form.statut">
                <option value="a_venir">À venir</option>
                <option value="inscriptions_ouvertes">Inscriptions ouvertes</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </div>
          </div>

          <div class="form-grid mt-md">
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

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="navigateTo('/backoffice/events')">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Sauvegarder les modifications' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { EventService } from '~/services/EventService'
import { LieuService } from '~/services/LieuService'

definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const route = useRoute()
const { showSuccess } = useUIMessage()
const service = new EventService()
const lieuService = new LieuService()

const loading = ref(false)
const error = ref(null)
const lieux = ref([])
const form = ref({ 
  nom: '', 
  slug: '', 
  lieu_id: null, 
  salle: '',
  statut: 'a_venir', 
  date_debut: '', 
  date_fin: '',
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
  let list = lieux.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(l => 
      l.nom.toLowerCase().includes(q) || 
      l.ville.toLowerCase().includes(q)
    )
  }
  
  // Unique by ville name to avoid duplicates in the UI
  const seen = new Set()
  return list.filter(l => {
    const duplicate = seen.has(l.ville)
    seen.add(l.ville)
    return !duplicate
  })
})

onMounted(async () => {
  loading.value = true
  try {
    const [eventData, lieuxData] = await Promise.all([
      service.getById(route.params.id),
      lieuService.getAll()
    ])
    lieux.value = lieuxData
    
    // Format dates for input type="date"
    const formatDate = (d) => d ? d.split('T')[0] : ''
    form.value = { 
      ...eventData,
      date_debut: formatDate(eventData.date_debut),
      date_fin: formatDate(eventData.date_fin)
    }
  } catch (e) {
    error.value = "Impossible de charger les données."
  } finally {
    loading.value = false
  }

  // Fermer le dropdown au clic ailleurs
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
      isDropdownOpen.value = false
    }
  })
})

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    await service.update(route.params.id, form.value)
    await showSuccess('L\'événement a été mis à jour.')
    navigateTo('/backoffice/events')
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

.label-with-action { display: flex; justify-content: space-between; align-items: center; }
.small-action-link { font-size: 0.65rem; color: #ff00ed; font-weight: 700; text-decoration: none; text-transform: uppercase; }
.small-action-link:hover { text-decoration: underline; }

input, select { padding: 0.8rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: white; font-family: inherit; }
input:focus, select:focus { outline: none; border-color: #00e5ff; }

.mt-md { margin-top: 1.25rem; }

/* Custom Select */
.custom-select-wrapper { position: relative; }
.custom-select-trigger { 
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.7rem 1rem; 
  display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s; min-height: 52px;
}
.custom-select-trigger:hover { border-color: rgba(255,255,255,0.2); }
.custom-select-wrapper.is-open .custom-select-trigger { border-color: #00e5ff; box-shadow: 0 0 15px rgba(0,229,255,0.15); }
.chevron { width: 18px; color: #5a6380; transition: 0.2s; }
.custom-select-wrapper.is-open .chevron { transform: rotate(180deg); color: #00e5ff; }

.selected-val { display: flex; flex-direction: column; line-height: 1.2; }
.selected-val strong { font-size: 0.95rem; }
.selected-val span { font-size: 0.75rem; color: #5a6380; }
.placeholder { color: #5a6380; font-size: 0.9rem; }

.custom-select-popover { 
  position: absolute; top: calc(100% + 8px); left: 0; width: 100%; background: #161925; border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px; z-index: 100; box-shadow: 0 15px 40px rgba(0,0,0,0.5); overflow: hidden;
}
.popover-search { padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.02); }
.search-icon { width: 14px; color: #5a6380; }
.popover-search input { background: transparent !important; border: none !important; padding: 0 !important; font-size: 0.85rem !important; flex: 1; }
.popover-list { max-height: 240px; overflow-y: auto; }
.popover-option { padding: 0.8rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.popover-option:hover { background: rgba(255,255,255,0.04); }
.popover-option.is-selected { background: rgba(0,229,255,0.06); }
.option-info { display: flex; flex-direction: column; line-height: 1.3; }
.option-info strong { font-size: 0.9rem; color: white; }
.option-info span { font-size: 0.75rem; color: #5a6380; }
.check-icon { width: 16px; color: #00e5ff; }
.no-results { padding: 2rem 1rem; text-align: center; color: #5a6380; font-size: 0.85rem; }

.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
.btn-cancel { padding: 0.7rem 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #8892b0; font-weight: 600; cursor: pointer; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; }
.loading-msg { text-align: center; padding: 4rem; color: #5a6380; }

.error-text { color: #ff4757; font-size: 0.85rem; margin-bottom: 1rem; }
</style>
