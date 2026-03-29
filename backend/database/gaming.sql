-- ============================================================
-- Z GEEK ARENA — Base de données complète (PostgreSQL)
-- Fichier : gaming.sql
-- Base    : gaming
-- Auteur  : ZGA Team
-- Date    : 2026-03-26
-- ============================================================

-- Suppression des tables (ordre inverse des dépendances)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS categories_recompense CASCADE;
DROP TABLE IF EXISTS actualites CASCADE;
DROP TABLE IF EXISTS regles CASCADE;
DROP TABLE IF EXISTS inscriptions CASCADE;
DROP TABLE IF EXISTS tournois CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS joueurs CASCADE;
DROP TABLE IF EXISTS jeux CASCADE;
DROP TABLE IF EXISTS lieux CASCADE;


-- ============================================================
-- 1. LIEUX
-- ============================================================
CREATE TABLE lieux (
    id              BIGSERIAL       PRIMARY KEY,
    nom             VARCHAR(100)    NOT NULL,
    adresse         VARCHAR(255),
    ville           VARCHAR(100)    NOT NULL,
    code_postal     VARCHAR(10),
    pays            VARCHAR(50)     NOT NULL DEFAULT 'France',
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. JEUX
-- ============================================================
CREATE TABLE jeux (
    id              BIGSERIAL       PRIMARY KEY,
    nom             VARCHAR(100)    NOT NULL,
    slug            VARCHAR(100)    NOT NULL UNIQUE,
    plateforme      VARCHAR(50),
    image_url       VARCHAR(500),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 3. JOUEURS
-- ============================================================
CREATE TABLE joueurs (
    id              BIGSERIAL       PRIMARY KEY,
    nom             VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    pseudo          VARCHAR(50)     NOT NULL UNIQUE,
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. EVENTS
-- ============================================================
CREATE TABLE events (
    id              BIGSERIAL       PRIMARY KEY,
    lieu_id         BIGINT          NOT NULL REFERENCES lieux(id) ON DELETE CASCADE,
    nom             VARCHAR(150)    NOT NULL,
    slug            VARCHAR(150)    NOT NULL UNIQUE,
    description     TEXT,
    date_debut      DATE            NOT NULL,
    date_fin        DATE            NOT NULL,
    statut          VARCHAR(30)     NOT NULL DEFAULT 'a_venir',
    gradient        VARCHAR(255),
    image_url       VARCHAR(500),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_statut     ON events(statut);
CREATE INDEX idx_events_date_debut ON events(date_debut);


-- ============================================================
-- 5. TOURNOIS
-- ============================================================
CREATE TABLE tournois (
    id              BIGSERIAL       PRIMARY KEY,
    event_id        BIGINT          NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    jeu_id          BIGINT          NOT NULL REFERENCES jeux(id) ON DELETE CASCADE,
    nom             VARCHAR(150),
    date_debut      TIMESTAMP       NOT NULL,
    date_fin        TIMESTAMP,
    phase           VARCHAR(50)     NOT NULL DEFAULT 'poules',
    format          VARCHAR(50)     NOT NULL DEFAULT 'double_elimination',
    max_joueurs     INTEGER         NOT NULL DEFAULT 64,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tournois_event_id ON tournois(event_id);
CREATE INDEX idx_tournois_jeu_id   ON tournois(jeu_id);


-- ============================================================
-- 6. INSCRIPTIONS (table pivot joueurs <-> tournois)
-- ============================================================
CREATE TABLE inscriptions (
    id              BIGSERIAL       PRIMARY KEY,
    joueur_id       BIGINT          NOT NULL REFERENCES joueurs(id) ON DELETE CASCADE,
    tournoi_id      BIGINT          NOT NULL REFERENCES tournois(id) ON DELETE CASCADE,
    statut          VARCHAR(30)     NOT NULL DEFAULT 'inscrit',
    classement      INTEGER,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(joueur_id, tournoi_id)
);

CREATE INDEX idx_inscriptions_joueur_id  ON inscriptions(joueur_id);
CREATE INDEX idx_inscriptions_tournoi_id ON inscriptions(tournoi_id);


-- ============================================================
-- 7. REGLES
-- ============================================================
CREATE TABLE regles (
    id              BIGSERIAL       PRIMARY KEY,
    jeu_id          BIGINT          NOT NULL REFERENCES jeux(id) ON DELETE CASCADE,
    contenu         TEXT            NOT NULL,
    ordre           INTEGER         NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regles_jeu_id ON regles(jeu_id);


-- ============================================================
-- 8. ACTUALITES
-- ============================================================
CREATE TABLE actualites (
    id               BIGSERIAL       PRIMARY KEY,
    event_id         BIGINT          REFERENCES events(id) ON DELETE SET NULL,
    titre            VARCHAR(255)    NOT NULL,
    slug             VARCHAR(255)    NOT NULL UNIQUE,
    contenu          TEXT            NOT NULL,
    extrait          VARCHAR(500),
    image_url        VARCHAR(500),
    categorie        VARCHAR(50)     NOT NULL DEFAULT 'nouvelles',
    publie           BOOLEAN         NOT NULL DEFAULT FALSE,
    date_publication TIMESTAMP,
    created_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_actualites_event_id ON actualites(event_id);
CREATE INDEX idx_actualites_publie   ON actualites(publie);


-- ============================================================
-- 9. CATEGORIES_RECOMPENSE
-- ============================================================
CREATE TABLE categories_recompense (
    id              BIGSERIAL       PRIMARY KEY,
    nom             VARCHAR(100)    NOT NULL UNIQUE,
    description     TEXT,
    annee           INTEGER         NOT NULL DEFAULT 2026,
    active          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 10. VOTES (table pivot joueurs <-> categories_recompense)
-- ============================================================
CREATE TABLE votes (
    id                       BIGSERIAL   PRIMARY KEY,
    joueur_id                BIGINT      NOT NULL REFERENCES joueurs(id) ON DELETE CASCADE,
    categorie_recompense_id  BIGINT      NOT NULL REFERENCES categories_recompense(id) ON DELETE CASCADE,
    valeur                   VARCHAR(255) NOT NULL,
    created_at               TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(joueur_id, categorie_recompense_id)
);

CREATE INDEX idx_votes_joueur_id    ON votes(joueur_id);
CREATE INDEX idx_votes_categorie_id ON votes(categorie_recompense_id);


-- ============================================================
-- DONNÉES DE SEED
-- ============================================================

-- LIEUX
INSERT INTO lieux (nom, ville, pays) VALUES
    ('Parc Chanot', 'Marseille', 'France'),
    ('Salle François Mitterrand', 'Castres', 'France'),
    ('Palais des Expositions', 'Nice', 'France'),
    ('Centre de Conventions', 'Toulouse', 'France'),
    ('Phare de Chambéry', 'Chambéry', 'France');

-- JEUX
INSERT INTO jeux (nom, slug, plateforme) VALUES
    ('Tekken 8', 'tekken-8', 'PlayStation 5'),
    ('Super Smash Bros', 'super-smash-bros', 'Nintendo Switch'),
    ('Mortal Kombat', 'mortal-kombat', 'PlayStation 5'),
    ('EA Sports FC 26', 'ea-fc-26', 'PlayStation 5'),
    ('Dragon Ball Z Sparking Zero', 'dbz-sparking-zero', 'PlayStation 5'),
    ('Fatal Fury', 'fatal-fury', 'PlayStation 5');

-- REGLES — Tekken 8 (jeu_id = 1)
INSERT INTO regles (jeu_id, contenu, ordre) VALUES
    (1, 'TEKKEN World Tour rules will supersede these rules', 1),
    (1, 'Double Elimination', 2),
    (1, 'Tournament Mode Default Settings', 3),
    (1, '3/5 Rounds per Game', 4),
    (1, '2/3 Games per Set', 5),
    (1, '3/5 Games for Finals & semi-finals', 6);

-- REGLES — Super Smash Bros (jeu_id = 2)
INSERT INTO regles (jeu_id, contenu, ordre) VALUES
    (2, '3 Stocks, 7 Minutes', 1),
    (2, 'Hazards Off', 2),
    (2, 'No Items', 3),
    (2, 'Best of 3 (Top 8 is Best of 5)', 4),
    (2, 'Set length: 8-10 minutes average', 5);

-- REGLES — Mortal Kombat (jeu_id = 3)
INSERT INTO regles (jeu_id, contenu, ordre) VALUES
    (3, 'Double Elimination', 1),
    (3, 'Tournament Mode', 2),
    (3, '2/3 Games per Set', 3),
    (3, 'All characters allowed', 4),
    (3, '3/5 for Winners/Losers/Grand Finals', 5);

-- REGLES — EA Sports FC 26 (jeu_id = 4)
INSERT INTO regles (jeu_id, contenu, ordre) VALUES
    (4, 'Match Duration: 6 minutes halves', 1),
    (4, 'Speed: Normal', 2),
    (4, 'Competitive Mode: On', 3),
    (4, 'Direct Invite Only', 4),
    (4, 'Single Elimination for qualifiers', 5);

-- EVENTS
INSERT INTO events (lieu_id, nom, slug, description, date_debut, date_fin, statut, gradient) VALUES
    (1, 'Marseille 2026', 'marseille-2026',
        'Le plus grand événement gaming du sud de la France.',
        '2026-05-01', '2026-05-03', 'a_venir',
        'linear-gradient(135deg, #ff0055 0%, #000000 100%)'),
    (2, 'Castres 2026', 'castres-2026',
        'L''édition spéciale au cœur du Tarn.',
        '2026-06-26', '2026-06-28', 'inscriptions_ouvertes',
        'linear-gradient(135deg, #0fb 0%, #000000 100%)'),
    (3, 'Nice 2026', 'nice-2026',
        'Z Geek Arena sur la Côte d''Azur.',
        '2026-10-09', '2026-10-11', 'a_venir',
        'linear-gradient(135deg, #bf00ff 0%, #000000 100%)');

-- TOURNOIS
INSERT INTO tournois (event_id, jeu_id, nom, date_debut, date_fin, phase, format, max_joueurs) VALUES
    (1, 1, 'Tekken 8 - Marseille',       '2026-05-01 10:00:00', '2026-05-01 18:00:00', 'poules', 'double_elimination', 64),
    (1, 2, 'Smash Bros - Marseille',      '2026-05-02 10:00:00', '2026-05-02 18:00:00', 'poules', 'double_elimination', 32),
    (1, 3, 'Mortal Kombat - Marseille',   '2026-05-02 14:00:00', '2026-05-02 20:00:00', 'top8',   'double_elimination', 32),
    (2, 1, 'Tekken 8 - Castres',          '2026-06-26 10:00:00', '2026-06-26 18:00:00', 'poules', 'double_elimination', 32),
    (2, 4, 'EA FC 26 - Castres',          '2026-06-27 10:00:00', '2026-06-27 18:00:00', 'poules', 'single_elimination', 32);

-- JOUEURS
INSERT INTO joueurs (nom, email, pseudo) VALUES
    ('Jean Dupont',   'jean.dupont@email.com',   'ShadowBlade'),
    ('Marie Laurent', 'marie.laurent@email.com', 'QueenBee'),
    ('Luc Martin',    'luc.martin@email.com',    'DragonFist');

-- INSCRIPTIONS
INSERT INTO inscriptions (joueur_id, tournoi_id, statut) VALUES
    (1, 1, 'confirme'),
    (2, 1, 'confirme'),
    (3, 2, 'inscrit'),
    (1, 4, 'inscrit');

-- ACTUALITES
INSERT INTO actualites (titre, slug, contenu, extrait, categorie, publie, date_publication) VALUES
    ('Comment la communauté façonne l''avenir du gaming compétitif en 2026',
     'communaute-gaming-2026',
     'Contenu complet de l''article...',
     'Un regard sur l''évolution du gaming compétitif.',
     'communaute', TRUE, '2025-10-28'),
    ('Les nouvelles technologies VR qui vont révolutionner l''arène',
     'technologies-vr-arene',
     'Contenu complet de l''article...',
     'Les avancées VR au service de l''esport.',
     'nouvelles', TRUE, '2025-10-15'),
    ('Portrait : Dans les coulisses de la préparation des futurs champions',
     'portrait-futurs-champions',
     'Contenu complet de l''article...',
     'Découvrez l''entraînement des pros.',
     'esport', TRUE, '2025-10-02');

-- CATEGORIES DE RECOMPENSE
INSERT INTO categories_recompense (nom, annee) VALUES
    ('MEILLEUR ARTISTE', 2026),
    ('MEILLEUR PERSONNAGE', 2026),
    ('MEILLEUR COMBO', 2026),
    ('MEILLEUR MOMENT COMMENTÉ', 2026),
    ('MEILLEUR CRÉATEUR DE CONTENU', 2026),
    ('MEILLEUR COSPLAY', 2026),
    ('MEILLEURE MANETTE PERSONNALISÉE', 2026),
    ('MIEUX HABILLÉ', 2026),
    ('MEILLEURE SORTIE DE JEU', 2026),
    ('MEILLEUR TOURNOI LOCAL', 2026),
    ('MEILLEUR MEME', 2026),
    ('MEILLEURE SÉRIE EN LIGNE', 2026),
    ('MEILLEUR POP OFF', 2026),
    ('MEILLEUR PRODUIT', 2026),
    ('COMEBACK DE L''ANNÉE', 2026),
    ('COMMENTATEUR DE L''ANNÉE', 2026),
    ('MATCH DE L''ANNÉE', 2026),
    ('MOMENT DE L''ANNÉE', 2026),
    ('JOUEUR DE L''ANNÉE', 2026),
    ('LA RÉVÉLATION', 2026);
