<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <span class="login-z">Z</span>
        <h1>ADMINISTRATION</h1>
        <p class="login-sub">Connectez-vous pour accéder au panneau d'administration</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="admin@zga.com" required>
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" placeholder="••••••••" required>
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">SE CONNECTER</span>
          <span v-else>CONNEXION...</span>
        </button>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>

    <div class="login-bg-accent"></div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const email = ref('')
const password = ref('')

const { login, loading, error, isAuthenticated } = useAuth()

// Si déjà connecté, rediriger
if (isAuthenticated.value) {
  navigateTo('/backoffice')
}

const handleLogin = async () => {
  const success = await login(email.value, password.value)
  if (success) {
    navigateTo('/backoffice')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0c0e1a;
  font-family: 'Outfit', -apple-system, sans-serif;
  color: white;
  position: relative;
  overflow: hidden;
}

.login-bg-accent {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.06), transparent 70%);
  top: -100px;
  right: -100px;
  pointer-events: none;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  position: relative;
  z-index: 1;
}

.login-header { text-align: center; margin-bottom: 2.5rem; }
.login-z { font-size: 3rem; font-weight: 900; color: #ff00ed; text-shadow: 0 0 30px rgba(255, 0, 237, 0.4); display: block; margin-bottom: 0.5rem; }
.login-header h1 { font-size: 1.3rem; letter-spacing: 0.2em; font-weight: 800; margin: 0; }
.login-sub { color: #5a6380; font-size: 0.8rem; margin-top: 0.75rem; }

.form-group { margin-bottom: 1.25rem; }
label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #5a6380; margin-bottom: 0.5rem; }
input { width: 100%; padding: 0.85rem 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; color: white; font-family: inherit; font-size: 0.9rem; box-sizing: border-box; }
input:focus { outline: none; border-color: #00e5ff; background: rgba(0, 229, 255, 0.03); }

.login-btn { width: 100%; padding: 0.9rem; background: #00e5ff; color: #000; border: none; border-radius: 10px; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; margin-top: 0.5rem; }
.login-btn:hover { box-shadow: 0 0 25px rgba(0, 229, 255, 0.35); transform: translateY(-1px); }
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.error-msg { color: #ff4757; font-size: 0.8rem; margin-top: 1rem; text-align: center; }
</style>
