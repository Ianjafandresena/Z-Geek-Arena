export async function runSeed() {
  // ===== ADMIN USER (always ensure it exists) =====
  const hashedPw = await hashPassword('zg33kAdmin')
  await query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING`,
    ['Admin ZGA', 'zgeekarena@gmail.com', hashedPw, 'admin']
  )
  console.log('[ZGA] ✅ Admin user ensured')

  // Check if rest is already seeded
  const check = await query('SELECT COUNT(*) as count FROM lieux')
  if (parseInt(check.rows[0].count) > 0) {
    console.log('[ZGA] ⏭️  Data already seeded, skipping')
    return
  }

  // ===== LIEUX =====
  const lieux = await query(`
    INSERT INTO lieux (nom, ville, pays) VALUES
      ('Parc Chanot', 'Marseille', 'France'),
      ('Salle François Mitterrand', 'Castres', 'France'),
      ('Palais des Expositions', 'Nice', 'France'),
      ('Centre de Conventions', 'Toulouse', 'France'),
      ('Phare de Chambéry', 'Chambéry', 'France')
    RETURNING id
  `)
  const [marseille, castres, nice] = lieux.rows

  // ===== JEUX =====
  const jeux = await query(`
    INSERT INTO jeux (nom, slug, plateforme) VALUES
      ('Tekken 8', 'tekken-8', 'PlayStation 5'),
      ('Super Smash Bros', 'super-smash-bros', 'Nintendo Switch'),
      ('Mortal Kombat', 'mortal-kombat', 'PlayStation 5'),
      ('EA Sports FC 26', 'ea-fc-26', 'PlayStation 5'),
      ('Dragon Ball Z Sparking Zero', 'dbz-sparking-zero', 'PlayStation 5'),
      ('Fatal Fury', 'fatal-fury', 'PlayStation 5')
    RETURNING id
  `)
  const [tekken, smash, mk, fc] = jeux.rows

  // ===== REGLES =====
  const tekkenRules = [
    'TEKKEN World Tour rules will supersede these rules',
    'Double Elimination', 'Tournament Mode Default Settings',
    '3/5 Rounds per Game', '2/3 Games per Set',
    '3/5 Games for Finals & semi-finals'
  ]
  for (let i = 0; i < tekkenRules.length; i++) {
    await query('INSERT INTO regles (jeu_id, contenu, ordre) VALUES ($1, $2, $3)', [tekken.id, tekkenRules[i], i + 1])
  }
  const smashRules = ['3 Stocks, 7 Minutes', 'Hazards Off', 'No Items', 'Best of 3 (Top 8 is Best of 5)', 'Set length: 8-10 minutes average']
  for (let i = 0; i < smashRules.length; i++) {
    await query('INSERT INTO regles (jeu_id, contenu, ordre) VALUES ($1, $2, $3)', [smash.id, smashRules[i], i + 1])
  }
  const mkRules = ['Double Elimination', 'Tournament Mode', '2/3 Games per Set', 'All characters allowed', '3/5 for Winners/Losers/Grand Finals']
  for (let i = 0; i < mkRules.length; i++) {
    await query('INSERT INTO regles (jeu_id, contenu, ordre) VALUES ($1, $2, $3)', [mk.id, mkRules[i], i + 1])
  }
  const fcRules = ['Match Duration: 6 minutes halves', 'Speed: Normal', 'Competitive Mode: On', 'Direct Invite Only', 'Single Elimination for qualifiers']
  for (let i = 0; i < fcRules.length; i++) {
    await query('INSERT INTO regles (jeu_id, contenu, ordre) VALUES ($1, $2, $3)', [fc.id, fcRules[i], i + 1])
  }

  // ===== EVENTS =====
  const events = await query(`
    INSERT INTO events (lieu_id, nom, slug, description, date_debut, date_fin, statut, gradient) VALUES
      ($1, 'Marseille 2026', 'marseille-2026', 'Le plus grand événement gaming du sud de la France.', '2026-05-01', '2026-05-03', 'a_venir', 'linear-gradient(135deg, #ff0055 0%, #000000 100%)'),
      ($2, 'Castres 2026', 'castres-2026', 'L''édition spéciale au cœur du Tarn.', '2026-06-26', '2026-06-28', 'inscriptions_ouvertes', 'linear-gradient(135deg, #0fb 0%, #000000 100%)'),
      ($3, 'Nice 2026', 'nice-2026', 'Z Geek Arena sur la Côte d''Azur.', '2026-10-09', '2026-10-11', 'a_venir', 'linear-gradient(135deg, #bf00ff 0%, #000000 100%)')
    RETURNING id
  `, [marseille.id, castres.id, nice.id])
  const [evMarseille, evCastres] = events.rows

  // ===== TOURNOIS =====
  const tournois = await query(`
    INSERT INTO tournois (event_id, jeu_id, nom, date_debut, date_fin, phase, format, max_joueurs) VALUES
      ($1, $5, 'Tekken 8 - Marseille', '2026-05-01 10:00', '2026-05-01 18:00', 'poules', 'double_elimination', 64),
      ($1, $6, 'Smash Bros - Marseille', '2026-05-02 10:00', '2026-05-02 18:00', 'poules', 'double_elimination', 32),
      ($1, $7, 'Mortal Kombat - Marseille', '2026-05-02 14:00', '2026-05-02 20:00', 'top8', 'double_elimination', 32),
      ($2, $5, 'Tekken 8 - Castres', '2026-06-26 10:00', '2026-06-26 18:00', 'poules', 'double_elimination', 32),
      ($2, $8, 'EA FC 26 - Castres', '2026-06-27 10:00', '2026-06-27 18:00', 'poules', 'single_elimination', 32)
    RETURNING id
  `, [evMarseille.id, evCastres.id, 0, 0, tekken.id, smash.id, mk.id, fc.id])
  const [t1, t2, , t4] = tournois.rows

  // ===== JOUEURS =====
  const joueurs = await query(`
    INSERT INTO joueurs (nom, email, pseudo) VALUES
      ('Jean Dupont', 'jean.dupont@email.com', 'ShadowBlade'),
      ('Marie Laurent', 'marie.laurent@email.com', 'QueenBee'),
      ('Luc Martin', 'luc.martin@email.com', 'DragonFist')
    RETURNING id
  `)
  const [j1, j2, j3] = joueurs.rows

  // ===== INSCRIPTIONS =====
  await query(`
    INSERT INTO inscriptions (joueur_id, tournoi_id, event_id, statut) VALUES
      ($1, $4, $7, 'confirme'), ($2, $4, $7, 'confirme'),
      ($3, $5, $7, 'inscrit'), ($1, $6, $8, 'inscrit')
  `, [j1.id, j2.id, j3.id, t1.id, t2.id, t4.id, evMarseille.id, evCastres.id])

  // ===== ACTUALITES =====
  await query(`
    INSERT INTO actualites (titre, slug, contenu, extrait, categorie, publie, date_publication) VALUES
      ('Comment la communauté façonne l''avenir du gaming compétitif en 2026', 'communaute-gaming-2026', 'Contenu complet de l''article...', 'Un regard sur l''évolution du gaming compétitif.', 'communaute', true, '2025-10-28'),
      ('Les nouvelles technologies VR qui vont révolutionner l''arène', 'technologies-vr-arene', 'Contenu complet de l''article...', 'Les avancées VR au service de l''esport.', 'nouvelles', true, '2025-10-15'),
      ('Portrait : Dans les coulisses de la préparation des futurs champions', 'portrait-futurs-champions', 'Contenu complet de l''article...', 'Découvrez l''entraînement des pros.', 'esport', true, '2025-10-02')
  `)

  // ===== CATEGORIES RECOMPENSE =====
  const categories = [
    'MEILLEUR ARTISTE', 'MEILLEUR PERSONNAGE', 'MEILLEUR COMBO',
    'MEILLEUR MOMENT COMMENTÉ', 'MEILLEUR CRÉATEUR DE CONTENU',
    'MEILLEUR COSPLAY', 'MEILLEURE MANETTE PERSONNALISÉE',
    'MIEUX HABILLÉ', 'MEILLEURE SORTIE DE JEU', 'MEILLEUR TOURNOI LOCAL',
    'MEILLEUR MEME', 'MEILLEURE SÉRIE EN LIGNE', 'MEILLEUR POP OFF',
    'MEILLEUR PRODUIT', "COMEBACK DE L'ANNÉE", "COMMENTATEUR DE L'ANNÉE",
    "MATCH DE L'ANNÉE", "MOMENT DE L'ANNÉE", "JOUEUR DE L'ANNÉE",
    'LA RÉVÉLATION'
  ]
  for (const cat of categories) {
    await query('INSERT INTO categories_recompense (nom, annee) VALUES ($1, 2026)', [cat])
  }

  console.log('[ZGA] ✅ Database seeded successfully')
}
