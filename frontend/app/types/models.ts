// ===========================
// MODELS - Z Geek Arena
// Interfaces TypeScript correspondant aux tables PostgreSQL
// ===========================

// ===== LIEU =====
export interface Lieu {
  id: number
  nom: string
  adresse?: string
  ville: string
  code_postal?: string
  pays: string
  created_at: string
  updated_at: string
}

// ===== EVENT =====
export interface Event {
  id: number
  lieu_id: number
  nom: string
  slug: string
  description?: string
  date_debut: string
  date_fin: string
  statut: 'a_venir' | 'inscriptions_ouvertes' | 'en_cours' | 'termine' | 'annule'
  gradient?: string
  image_url?: string
  created_at: string
  updated_at: string
  // Relations
  lieu?: Lieu
  tournois?: Tournoi[]
  actualites?: Actualite[]
}

// ===== JEU =====
export interface Jeu {
  id: number
  nom: string
  slug: string
  plateforme?: string
  image_url?: string
  created_at: string
  updated_at: string
  // Relations
  regles?: Regle[]
  tournois?: Tournoi[]
}

// ===== REGLE =====
export interface Regle {
  id: number
  jeu_id: number
  contenu: string
  ordre: number
  created_at: string
  updated_at: string
}

// ===== JOUEUR =====
export interface Joueur {
  id: number
  nom: string
  email: string
  pseudo: string
  avatar_url?: string
  created_at: string
  updated_at: string
  // Relations
  inscriptions?: Inscription[]
  votes?: Vote[]
}

// ===== TOURNOI =====
export interface Tournoi {
  id: number
  event_id: number
  jeu_id: number
  nom?: string
  date_debut: string
  date_fin?: string
  phase: 'poules' | 'top8' | 'finale' | 'exhibition'
  format: 'double_elimination' | 'single_elimination' | 'round_robin' | 'swiss'
  max_joueurs: number
  created_at: string
  updated_at: string
  // Relations
  event?: Event
  jeu?: Jeu
  joueurs?: Joueur[]
  inscriptions?: Inscription[]
}

// ===== INSCRIPTION =====
export interface Inscription {
  id: number
  joueur_id: number
  tournoi_id: number
  statut: 'inscrit' | 'confirme' | 'annule' | 'disqualifie'
  classement?: number
  created_at: string
  updated_at: string
  // Relations
  joueur?: Joueur
  tournoi?: Tournoi
}

// ===== ACTUALITE =====
export interface Actualite {
  id: number
  event_id?: number
  titre: string
  slug: string
  contenu: string
  extrait?: string
  image_url?: string
  categorie: 'nouvelles' | 'communaute' | 'esport' | 'culture' | 'partenaires'
  publie: boolean
  date_publication?: string
  created_at: string
  updated_at: string
  // Relations
  event?: Event
}

// ===== CATEGORIE RECOMPENSE =====
export interface CategorieRecompense {
  id: number
  nom: string
  description?: string
  annee: number
  active: boolean
  created_at: string
  updated_at: string
  // Relations
  votes?: Vote[]
}

// ===== VOTE =====
export interface Vote {
  id: number
  joueur_id: number
  categorie_recompense_id: number
  valeur: string
  created_at: string
  updated_at: string
  // Relations
  joueur?: Joueur
  categorie_recompense?: CategorieRecompense
}
