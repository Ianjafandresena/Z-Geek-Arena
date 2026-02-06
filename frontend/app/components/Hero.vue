<template>
  <section class="hero">
    <div class="hero-background">
      <div v-for="(image, index) in backgrounds" :key="index" 
        :class="['bg-slide', { active: currentSlide === index }]"
        :style="{ backgroundImage: `url(${image})` }">
      </div>
      <div class="gradient-overlay"></div>
    </div>
    
    <div class="container hero-content">
      <div class="badge">Inscriptions Ouvertes</div>
      <h1 class="hero-title">
        <div class="hero-brand" data-text="Z GEEK ARENA">
          <span class="z-ancient">Z</span> GEEK ARENA
        </div>
        <div class="hero-partner">
          by <span class="partner-name">gamer connection</span>
        </div>
        <div class="text-cyan">ÉDITION 2026</div>
      </h1>
      <p class="hero-subtitle">
        La célébration ultime du gaming compétitif et de la culture otaku. 
        Rejoignez des milliers de joueurs au cœur de l'action.
      </p>
      
      <div class="hero-actions">
        <button class="btn-primary glow-magenta">Réservez Votre Place</button>
        <button class="btn-outline">En Savoir Plus</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const backgrounds = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=1920'
]

const currentSlide = ref(0)

onMounted(() => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % backgrounds.length
  }, 5000)
})
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: #000;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.5s ease-in-out, transform 10s linear;
  transform: scale(1.1);
}

.bg-slide.active {
  opacity: 0.4;
  transform: scale(1);
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%),
              linear-gradient(to bottom, rgba(0,0,0,0.4), black);
}

.hero-content {
  position: relative;
  z-index: 5;
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255, 0, 237, 0.1);
  border: 1px solid var(--accent-magenta);
  color: var(--accent-magenta);
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-top: 100px; /* Ajout d'une marge haut pour le descendre */
  margin-bottom: 2rem;
  border-radius: 4px;
}

.hero-title {
  font-size: 5rem;
  line-height: 1;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-brand {
  position: relative;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  letter-spacing: 0.02em;
}

/* Effet Glitch/Blur style TikTok/Dirt */
.hero-brand::before,
.hero-brand::after {
  content: "Z GEEK ARENA";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
}

.hero-brand::before {
  color: #ff0055;
  z-index: -1;
  animation: tiktok-glitch 0.3s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: blur(1px);
}

.hero-brand::after {
  color: #00fbff;
  z-index: -2;
  animation: tiktok-glitch 0.3s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse;
  filter: blur(1px);
}

@keyframes tiktok-glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(-2px, -1px); }
  60% { transform: translate(2px, 1px); }
  80% { transform: translate(2px, -1px); }
  100% { transform: translate(0); }
}

.hero-partner {
  display: block;
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0.15em;
  margin: 0.75rem 0 1.25rem;
  opacity: 0.8;
}

.partner-name {
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.3em;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2rem;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.btn-outline {
  padding: 1rem 2rem;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: white;
  color: black;
}

@media (max-width: 992px) {
  .hero-title {
    font-size: 4rem;
  }
  
  .badge {
    margin-top: 80px;
  }
  
  .hero-subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.8rem;
  }
  
  .badge {
    margin-top: 60px;
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
  }
  
  .hero-partner {
    font-size: 0.75rem;
  }
  
  .hero-subtitle {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .hero-actions button {
    width: 100%;
  }
  
  .btn-outline {
    padding: 0.875rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .badge {
    margin-top: 50px;
  }
  
  .hero-brand::before,
  .hero-brand::after {
    display: none;
  }
  
  .hero-partner {
    font-size: 0.65rem;
    letter-spacing: 0.1em;
  }
  
  .hero-subtitle {
    font-size: 0.9rem;
  }
}

</style>
