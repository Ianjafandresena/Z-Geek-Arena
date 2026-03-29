<?php

namespace Database\Seeders;

use App\Models\Actualite;
use App\Models\CategorieRecompense;
use App\Models\Event;
use App\Models\Inscription;
use App\Models\Jeu;
use App\Models\Joueur;
use App\Models\Lieu;
use App\Models\Regle;
use App\Models\Tournoi;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ===== LIEUX =====
        $marseille = Lieu::create(['nom' => 'Parc Chanot', 'ville' => 'Marseille', 'pays' => 'France']);
        $castres   = Lieu::create(['nom' => 'Salle François Mitterrand', 'ville' => 'Castres', 'pays' => 'France']);
        $nice      = Lieu::create(['nom' => 'Palais des Expositions', 'ville' => 'Nice', 'pays' => 'France']);
        Lieu::create(['nom' => 'Centre de Conventions', 'ville' => 'Toulouse', 'pays' => 'France']);
        Lieu::create(['nom' => 'Phare de Chambéry', 'ville' => 'Chambéry', 'pays' => 'France']);

        // ===== JEUX =====
        $tekken = Jeu::create(['nom' => 'Tekken 8', 'slug' => 'tekken-8', 'plateforme' => 'PlayStation 5']);
        $smash  = Jeu::create(['nom' => 'Super Smash Bros', 'slug' => 'super-smash-bros', 'plateforme' => 'Nintendo Switch']);
        $mk     = Jeu::create(['nom' => 'Mortal Kombat', 'slug' => 'mortal-kombat', 'plateforme' => 'PlayStation 5']);
        $fc     = Jeu::create(['nom' => 'EA Sports FC 26', 'slug' => 'ea-fc-26', 'plateforme' => 'PlayStation 5']);
        Jeu::create(['nom' => 'Dragon Ball Z Sparking Zero', 'slug' => 'dbz-sparking-zero', 'plateforme' => 'PlayStation 5']);
        Jeu::create(['nom' => 'Fatal Fury', 'slug' => 'fatal-fury', 'plateforme' => 'PlayStation 5']);

        // ===== RÈGLES =====
        $tekkenRules = [
            'TEKKEN World Tour rules will supersede these rules',
            'Double Elimination',
            'Tournament Mode Default Settings',
            '3/5 Rounds per Game',
            '2/3 Games per Set',
            '3/5 Games for Finals & semi-finals',
        ];
        foreach ($tekkenRules as $i => $rule) {
            Regle::create(['jeu_id' => $tekken->id, 'contenu' => $rule, 'ordre' => $i + 1]);
        }

        $smashRules = [
            '3 Stocks, 7 Minutes',
            'Hazards Off',
            'No Items',
            'Best of 3 (Top 8 is Best of 5)',
            'Set length: 8-10 minutes average',
        ];
        foreach ($smashRules as $i => $rule) {
            Regle::create(['jeu_id' => $smash->id, 'contenu' => $rule, 'ordre' => $i + 1]);
        }

        $mkRules = [
            'Double Elimination',
            'Tournament Mode',
            '2/3 Games per Set',
            'All characters allowed',
            '3/5 for Winners/Losers/Grand Finals',
        ];
        foreach ($mkRules as $i => $rule) {
            Regle::create(['jeu_id' => $mk->id, 'contenu' => $rule, 'ordre' => $i + 1]);
        }

        $fcRules = [
            'Match Duration: 6 minutes halves',
            'Speed: Normal',
            'Competitive Mode: On',
            'Direct Invite Only',
            'Single Elimination for qualifiers',
        ];
        foreach ($fcRules as $i => $rule) {
            Regle::create(['jeu_id' => $fc->id, 'contenu' => $rule, 'ordre' => $i + 1]);
        }

        // ===== EVENTS =====
        $eventMarseille = Event::create([
            'lieu_id'     => $marseille->id,
            'nom'         => 'Marseille 2026',
            'slug'        => 'marseille-2026',
            'description' => 'Le plus grand événement gaming du sud de la France.',
            'date_debut'  => '2026-05-01',
            'date_fin'    => '2026-05-03',
            'statut'      => 'a_venir',
            'gradient'    => 'linear-gradient(135deg, #ff0055 0%, #000000 100%)',
        ]);

        $eventCastres = Event::create([
            'lieu_id'     => $castres->id,
            'nom'         => 'Castres 2026',
            'slug'        => 'castres-2026',
            'description' => "L'édition spéciale au cœur du Tarn.",
            'date_debut'  => '2026-06-26',
            'date_fin'    => '2026-06-28',
            'statut'      => 'inscriptions_ouvertes',
            'gradient'    => 'linear-gradient(135deg, #0fb 0%, #000000 100%)',
        ]);

        Event::create([
            'lieu_id'     => $nice->id,
            'nom'         => 'Nice 2026',
            'slug'        => 'nice-2026',
            'description' => "Z Geek Arena sur la Côte d'Azur.",
            'date_debut'  => '2026-10-09',
            'date_fin'    => '2026-10-11',
            'statut'      => 'a_venir',
            'gradient'    => 'linear-gradient(135deg, #bf00ff 0%, #000000 100%)',
        ]);

        // ===== TOURNOIS =====
        $t1 = Tournoi::create([
            'event_id'    => $eventMarseille->id,
            'jeu_id'      => $tekken->id,
            'nom'         => 'Tekken 8 - Marseille',
            'date_debut'  => '2026-05-01 10:00:00',
            'date_fin'    => '2026-05-01 18:00:00',
            'phase'       => 'poules',
            'format'      => 'double_elimination',
            'max_joueurs' => 64,
        ]);

        $t2 = Tournoi::create([
            'event_id'    => $eventMarseille->id,
            'jeu_id'      => $smash->id,
            'nom'         => 'Smash Bros - Marseille',
            'date_debut'  => '2026-05-02 10:00:00',
            'date_fin'    => '2026-05-02 18:00:00',
            'phase'       => 'poules',
            'format'      => 'double_elimination',
            'max_joueurs' => 32,
        ]);

        Tournoi::create([
            'event_id'    => $eventMarseille->id,
            'jeu_id'      => $mk->id,
            'nom'         => 'Mortal Kombat - Marseille',
            'date_debut'  => '2026-05-02 14:00:00',
            'date_fin'    => '2026-05-02 20:00:00',
            'phase'       => 'top8',
            'format'      => 'double_elimination',
            'max_joueurs' => 32,
        ]);

        $t4 = Tournoi::create([
            'event_id'    => $eventCastres->id,
            'jeu_id'      => $tekken->id,
            'nom'         => 'Tekken 8 - Castres',
            'date_debut'  => '2026-06-26 10:00:00',
            'date_fin'    => '2026-06-26 18:00:00',
            'phase'       => 'poules',
            'format'      => 'double_elimination',
            'max_joueurs' => 32,
        ]);

        Tournoi::create([
            'event_id'    => $eventCastres->id,
            'jeu_id'      => $fc->id,
            'nom'         => 'EA FC 26 - Castres',
            'date_debut'  => '2026-06-27 10:00:00',
            'date_fin'    => '2026-06-27 18:00:00',
            'phase'       => 'poules',
            'format'      => 'single_elimination',
            'max_joueurs' => 32,
        ]);

        // ===== JOUEURS =====
        $j1 = Joueur::create(['nom' => 'Jean Dupont', 'email' => 'jean.dupont@email.com', 'pseudo' => 'ShadowBlade']);
        $j2 = Joueur::create(['nom' => 'Marie Laurent', 'email' => 'marie.laurent@email.com', 'pseudo' => 'QueenBee']);
        $j3 = Joueur::create(['nom' => 'Luc Martin', 'email' => 'luc.martin@email.com', 'pseudo' => 'DragonFist']);

        // ===== INSCRIPTIONS =====
        Inscription::create(['joueur_id' => $j1->id, 'tournoi_id' => $t1->id, 'statut' => 'confirme']);
        Inscription::create(['joueur_id' => $j2->id, 'tournoi_id' => $t1->id, 'statut' => 'confirme']);
        Inscription::create(['joueur_id' => $j3->id, 'tournoi_id' => $t2->id, 'statut' => 'inscrit']);
        Inscription::create(['joueur_id' => $j1->id, 'tournoi_id' => $t4->id, 'statut' => 'inscrit']);

        // ===== ACTUALITÉS =====
        Actualite::create([
            'titre'            => "Comment la communauté façonne l'avenir du gaming compétitif en 2026",
            'slug'             => 'communaute-gaming-2026',
            'contenu'          => "Contenu complet de l'article...",
            'extrait'          => "Un regard sur l'évolution du gaming compétitif.",
            'categorie'        => 'communaute',
            'publie'           => true,
            'date_publication' => '2025-10-28',
        ]);

        Actualite::create([
            'titre'            => "Les nouvelles technologies VR qui vont révolutionner l'arène",
            'slug'             => 'technologies-vr-arene',
            'contenu'          => "Contenu complet de l'article...",
            'extrait'          => "Les avancées VR au service de l'esport.",
            'categorie'        => 'nouvelles',
            'publie'           => true,
            'date_publication' => '2025-10-15',
        ]);

        Actualite::create([
            'titre'            => 'Portrait : Dans les coulisses de la préparation des futurs champions',
            'slug'             => 'portrait-futurs-champions',
            'contenu'          => "Contenu complet de l'article...",
            'extrait'          => "Découvrez l'entraînement des pros.",
            'categorie'        => 'esport',
            'publie'           => true,
            'date_publication' => '2025-10-02',
        ]);

        // ===== CATÉGORIES DE RÉCOMPENSE =====
        $categories = [
            'MEILLEUR ARTISTE', 'MEILLEUR PERSONNAGE', 'MEILLEUR COMBO',
            'MEILLEUR MOMENT COMMENTÉ', 'MEILLEUR CRÉATEUR DE CONTENU',
            'MEILLEUR COSPLAY', 'MEILLEURE MANETTE PERSONNALISÉE',
            'MIEUX HABILLÉ', 'MEILLEURE SORTIE DE JEU', 'MEILLEUR TOURNOI LOCAL',
            'MEILLEUR MEME', 'MEILLEURE SÉRIE EN LIGNE', 'MEILLEUR POP OFF',
            'MEILLEUR PRODUIT', "COMEBACK DE L'ANNÉE", "COMMENTATEUR DE L'ANNÉE",
            "MATCH DE L'ANNÉE", "MOMENT DE L'ANNÉE", "JOUEUR DE L'ANNÉE",
            'LA RÉVÉLATION',
        ];

        foreach ($categories as $cat) {
            CategorieRecompense::create(['nom' => $cat, 'annee' => 2026]);
        }
    }
}
