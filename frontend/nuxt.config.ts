// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  css: ['~/assets/css/main.css'],

  // Configuration de l'API — maintenant intégrée via Nitro server routes
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  },

  nitro: {
    preset: 'node-server'
  }
})
