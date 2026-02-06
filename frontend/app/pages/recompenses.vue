<template>
  <main class="awards-page">
    <div class="page-header">
      <div class="container text-center">
        <h1 class="page-title">Z Geek Arena Awards</h1>
        <p class="page-description mx-auto">
          Célébrez les moments, les joueurs et les créations qui ont défini l'année. Les Z Geek Arena Awards honorent les réalisations exceptionnelles de la communauté.
        </p>
      </div>
    </div>

    <section class="section-padding">
      <div class="container">
        <div class="voting-status glass flex-between">
          <div class="status-label">AUCUN VOTE EXPRIMÉ</div>
          <div class="status-count">0</div>
        </div>

        <div class="awards-categories">
          <div v-for="category in categories" :key="category" class="category-item">
            <label class="checkbox-container">
              <input type="checkbox">
              <span class="checkmark"></span>
              <span class="category-name">{{ category }}</span>
            </label>
          </div>
        </div>

        <div class="vote-actions flex-center">
            <button class="btn-primary glow-magenta disabled">Soumettre mes votes</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const categories = [
  "MEILLEUR ARTISTE",
  "MEILLEUR PERSONNAGE",
  "MEILLEUR COMBO",
  "MEILLEUR MOMENT COMMENTÉ",
  "MEILLEUR CRÉATEUR DE CONTENU",
  "MEILLEUR COSPLAY",
  "MEILLEURE MANETTE PERSONNALISÉE",
  "MIEUX HABILLÉ",
  "MEILLEURE SORTIE DE JEU",
  "MEILLEUR TOURNOI LOCAL",
  "MEILLEUR MEME",
  "MEILLEURE SÉRIE EN LIGNE",
  "MEILLEUR POP OFF",
  "MEILLEUR PRODUIT",
  "COMEBACK DE L'ANNÉE",
  "COMMENTATEUR DE L'ANNÉE",
  "MATCH DE L'ANNÉE",
  "MOMENT DE L'ANNÉE",
  "JOUEUR DE L'ANNÉE",
  "LA RÉVÉLATION"
]
</script>

<style scoped>
.awards-page {
  padding-top: 100px;
  background: radial-gradient(circle at top, #1a1b3a 0%, #000 70%);
}

.text-center { text-align: center; }
.mx-auto { margin-left: auto; margin-right: auto; }

.page-header {
  padding: 80px 0;
}

.page-title {
  font-size: 5rem;
  margin-bottom: 1rem;
  background: linear-gradient(to bottom, #fff, #a0a0a0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-description {
  max-width: 800px;
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.voting-status {
  max-width: 400px;
  margin: 0 auto 4rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-label {
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}

.status-count {
  background: #f1c40f;
  color: black;
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: 900;
}

.awards-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 5rem;
}

.category-item {
  flex: 0 0 auto;
}

.checkbox-container {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.checkbox-container:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--accent-cyan);
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-right: 1rem;
  position: relative;
}

.checkbox-container input:checked ~ .checkmark {
  background: var(--accent-cyan);
  border-color: var(--accent-cyan);
}

.checkbox-container input:checked ~ .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-weight: 900;
  font-size: 12px;
}

.category-name {
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.flex-center {
    display: flex;
    justify-content: center;
}

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 992px) {
  .page-title {
    font-size: 4rem;
  }
  
  .page-header {
    padding: 60px 0;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.8rem;
  }
  
  .awards-page {
    padding-top: 80px;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .checkbox-container {
    padding: 0.6rem 1rem;
  }
  
  .category-name {
    font-size: 0.75rem;
  }
  
  .voting-status {
    padding: 0.875rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-header {
    padding: 40px 0;
  }
  
  .awards-categories {
    gap: 0.75rem;
    margin-bottom: 3rem;
  }
  
  .checkbox-container {
    padding: 0.5rem 0.75rem;
  }
  
  .category-name {
    font-size: 0.7rem;
  }
  
  .checkmark {
    width: 16px;
    height: 16px;
    margin-right: 0.75rem;
  }
  
  .voting-status {
    max-width: 100%;
    margin-bottom: 2.5rem;
  }
  
  .status-label {
    font-size: 0.8rem;
  }
}
</style>
