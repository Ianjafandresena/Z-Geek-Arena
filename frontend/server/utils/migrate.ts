export async function runMigrations() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      email_verified_at TIMESTAMPTZ,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'admin',
      remember_token VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS lieux (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      adresse VARCHAR(255),
      ville VARCHAR(100) NOT NULL,
      code_postal VARCHAR(10),
      pays VARCHAR(50) DEFAULT 'France',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS jeux (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      plateforme VARCHAR(50),
      image_url VARCHAR(500),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS joueurs (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      pseudo VARCHAR(50) UNIQUE NOT NULL,
      avatar_url VARCHAR(500),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      lieu_id INTEGER REFERENCES lieux(id) ON DELETE CASCADE,
      nom VARCHAR(150) NOT NULL,
      slug VARCHAR(150) UNIQUE NOT NULL,
      description TEXT,
      salle VARCHAR(255),
      date_debut DATE NOT NULL,
      date_fin DATE NOT NULL,
      statut VARCHAR(30) DEFAULT 'a_venir',
      gradient VARCHAR(255),
      image_url VARCHAR(500),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_events_statut ON events(statut);
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_debut);

    CREATE TABLE IF NOT EXISTS tournois (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
      jeu_id INTEGER REFERENCES jeux(id) ON DELETE CASCADE,
      nom VARCHAR(150),
      date_debut TIMESTAMPTZ NOT NULL,
      date_fin TIMESTAMPTZ,
      phase VARCHAR(50) DEFAULT 'poules',
      format VARCHAR(50) DEFAULT 'double_elimination',
      max_joueurs INTEGER DEFAULT 64,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_tournois_event ON tournois(event_id);
    CREATE INDEX IF NOT EXISTS idx_tournois_jeu ON tournois(jeu_id);

    CREATE TABLE IF NOT EXISTS inscriptions (
      id SERIAL PRIMARY KEY,
      joueur_id INTEGER REFERENCES joueurs(id) ON DELETE CASCADE,
      tournoi_id INTEGER REFERENCES tournois(id) ON DELETE CASCADE,
      event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
      statut VARCHAR(30) DEFAULT 'inscrit',
      classement INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_inscriptions_joueur ON inscriptions(joueur_id);
    CREATE INDEX IF NOT EXISTS idx_inscriptions_tournoi ON inscriptions(tournoi_id);

    CREATE TABLE IF NOT EXISTS regles (
      id SERIAL PRIMARY KEY,
      jeu_id INTEGER REFERENCES jeux(id) ON DELETE CASCADE,
      contenu TEXT NOT NULL,
      ordre INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_regles_jeu ON regles(jeu_id);

    CREATE TABLE IF NOT EXISTS actualites (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
      titre VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      contenu TEXT NOT NULL,
      extrait VARCHAR(500),
      image_url VARCHAR(500),
      categorie VARCHAR(50) DEFAULT 'nouvelles',
      publie BOOLEAN DEFAULT false,
      date_publication TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_actualites_event ON actualites(event_id);
    CREATE INDEX IF NOT EXISTS idx_actualites_publie ON actualites(publie);

    CREATE TABLE IF NOT EXISTS categories_recompense (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      annee INTEGER DEFAULT 2026,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      joueur_id INTEGER REFERENCES joueurs(id) ON DELETE CASCADE,
      categorie_recompense_id INTEGER REFERENCES categories_recompense(id) ON DELETE CASCADE,
      valeur VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(joueur_id, categorie_recompense_id)
    );
    CREATE INDEX IF NOT EXISTS idx_votes_joueur ON votes(joueur_id);
    CREATE INDEX IF NOT EXISTS idx_votes_categorie ON votes(categorie_recompense_id);

    CREATE TABLE IF NOT EXISTS matchs (
      id SERIAL PRIMARY KEY,
      tournoi_id INTEGER REFERENCES tournois(id) ON DELETE CASCADE,
      joueur1_id INTEGER REFERENCES joueurs(id) ON DELETE SET NULL,
      joueur2_id INTEGER REFERENCES joueurs(id) ON DELETE SET NULL,
      gagnant_id INTEGER REFERENCES joueurs(id) ON DELETE SET NULL,
      score1 INTEGER DEFAULT 0,
      score2 INTEGER DEFAULT 0,
      etape INTEGER NOT NULL,
      ordre INTEGER NOT NULL,
      statut VARCHAR(20) DEFAULT 'en_attente',
      next_match_id INTEGER REFERENCES matchs(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_matchs_tournoi ON matchs(tournoi_id);

    -- Ensure 'salle' column exists for existing tables
    ALTER TABLE events ADD COLUMN IF NOT EXISTS salle VARCHAR(255);
  `
  await query(sql)
  console.log('[ZGA] ✅ Tables created successfully')
}
