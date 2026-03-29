<template>
  <div>
    <div class="page-header">
      <p class="page-subtitle">Créer un nouveau compte administrateur</p>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label>Nom complet</label>
            <input type="text" v-model="form.name" placeholder="Jean Dupont" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" placeholder="admin@zga.com" required>
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" v-model="form.password" placeholder="Min. 6 caractères" required minlength="6">
          </div>
          <div class="form-group">
            <label>Confirmer le mot de passe</label>
            <input type="password" v-model="form.password_confirmation" placeholder="Confirmation" required>
          </div>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>
        <p v-if="success" class="success-text">✅ Administrateur créé avec succès !</p>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Création...' : 'Créer l\'administrateur' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des admins existants -->
    <div class="card" style="margin-top: 2rem;">
      <div class="card-header"><h3>Administrateurs existants</h3></div>
      <div class="admin-list">
        <div class="admin-item" v-if="adminUser">
          <div class="admin-avatar" style="background: linear-gradient(135deg, #00e5ff, #ff00ed);">
            {{ adminUser.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <strong>{{ adminUser.name }}</strong>
            <span class="admin-email">{{ adminUser.email }}</span>
          </div>
          <span class="badge badge-success">Connecté</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'backoffice', middleware: ['admin'] })

const { adminUser, register, loading, error } = useAuth()
const success = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleSubmit = async () => {
  success.value = false
  const ok = await register(form.value.name, form.value.email, form.value.password, form.value.password_confirmation)
  if (ok) {
    success.value = true
    form.value = { name: '', email: '', password: '', password_confirmation: '' }
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 1.75rem; }
.page-subtitle { color: #5a6380; font-size: 0.9rem; margin: 0; }

.form-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 2rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #5a6380; }
input { padding: 0.8rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: white; font-family: inherit; font-size: 0.9rem; }
input:focus { outline: none; border-color: #00e5ff; }

.error-text { color: #ff4757; font-size: 0.85rem; margin-bottom: 1rem; }
.success-text { color: #2ed573; font-size: 0.85rem; margin-bottom: 1rem; }

.form-actions { display: flex; justify-content: flex-end; }
.btn-submit { padding: 0.7rem 1.5rem; background: #00e5ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-submit:hover { box-shadow: 0 0 20px rgba(0,229,255,0.35); }
.btn-submit:disabled { opacity: 0.5; }

.card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
.card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.card-header h3 { margin: 0; font-size: 1rem; font-weight: 700; }

.admin-list { padding: 1.25rem 1.5rem; }
.admin-item { display: flex; align-items: center; gap: 1rem; }
.admin-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000; flex-shrink: 0; }
.admin-email { display: block; font-size: 0.8rem; color: #5a6380; }

.badge { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-left: auto; }
.badge-success { background: rgba(46,213,115,0.12); color: #2ed573; }
</style>
