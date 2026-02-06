<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <h2 class="footer-logo">
          <NuxtLink to="/">
            <span class="z-ancient">Z</span> GEEK ARENA
            <div class="footer-by">by Gamer Connection</div>
          </NuxtLink>
        </h2>
        <p>Le plus grand événement de gaming au monde. Construire un monde plus vaste pour les joueurs partout.</p>
      </div>

      <div class="footer-nav">
        <h3>Événements</h3>
        <NuxtLink to="#">Marseille 2026</NuxtLink>
        <NuxtLink to="#">Castres 2026</NuxtLink>
        <NuxtLink to="#">Nice 2026</NuxtLink>
      </div>

     

      <div class="footer-nav">
        <h3>Support</h3>
        <NuxtLink to="#">Contactez-nous</NuxtLink>
        <NuxtLink to="#">Règlement</NuxtLink>
        <NuxtLink to="#">Vie Privée</NuxtLink>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container flex-between">
        <p>&copy; Z Geek Arena by Gamer Connection Tous droits réservés @Ianja. 2026 </p>
        <div class="socials">
          <a href="#" class="social-icon neon-tw" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" class="svg-neon"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" class="social-icon neon-ig" aria-label="Instagram">
            <svg viewBox="0 0 24 24" class="svg-neon"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" class="social-icon neon-fb" aria-label="Facebook">
            <svg viewBox="0 0 24 24" class="svg-neon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" class="social-icon neon-yt" aria-label="YouTube">
            <svg viewBox="0 0 24 24" class="svg-neon"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  padding-top: 80px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 80px;
}

.footer-logo {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
}

.footer-by {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-family: var(--font-main);
  text-transform: lowercase;
  font-weight: 400;
  margin-top: 5px;
}

.footer-brand p {
  color: var(--text-secondary);
  max-width: 300px;
}

.footer-nav h3 {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: white;
}

.footer-nav a {
  display: block;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.footer-nav a:hover {
  color: var(--accent-cyan);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem 0;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.socials {
  display: flex;
  gap: 1.5rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
}

.svg-neon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: all 0.3s ease;
}

/* X (Twitter) Neon */
.neon-tw { color: #ffffff; }
.neon-tw:hover {
  border-color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
  filter: drop-shadow(0 0 5px #ffffff);
}

/* Instagram Neon */
.neon-ig { color: #ff00ed; }
.neon-ig:hover {
  border-color: #ff00ed;
  box-shadow: 0 0 15px rgba(255, 0, 237, 0.4);
  filter: drop-shadow(0 0 5px #ff00ed);
}

/* Facebook Neon */
.neon-fb { color: #00fbff; }
.neon-fb:hover {
  border-color: #00fbff;
  box-shadow: 0 0 15px rgba(0, 251, 255, 0.4);
  filter: drop-shadow(0 0 5px #00fbff);
}

/* YouTube Neon */
.neon-yt { color: #ff0000; }
.neon-yt:hover {
  border-color: #ff0000;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.4);
  filter: drop-shadow(0 0 5px #ff0000);
}

/* Ajustement pour l'icône X qui est souvent pleine par défaut */
.neon-tw .svg-neon { fill: currentColor; stroke: none; }

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .footer {
    padding-top: 60px;
  }
  
  .footer-grid {
    margin-bottom: 60px;
  }
}

@media (max-width: 768px) {
  .flex-between {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .footer-logo {
    font-size: 1.6rem;
  }
}

@media (max-width: 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  
  .footer {
    padding-top: 40px;
  }
  
  .footer-grid {
    margin-bottom: 40px;
    gap: 2.5rem;
  }
  
  .footer-bottom {
    padding: 1.5rem 0;
  }
  
  .socials {
    gap: 1rem;
  }
  
  .social-icon {
    width: 36px;
    height: 36px;
  }
}
</style>