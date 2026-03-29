<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tournoi extends Model
{
    protected $table = 'tournois';

    protected $fillable = [
        'event_id',
        'jeu_id',
        'nom',
        'date_debut',
        'date_fin',
        'phase',
        'format',
        'max_joueurs',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'datetime',
            'date_fin'   => 'datetime',
        ];
    }

    /**
     * Le tournoi appartient à un event.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Le tournoi est lié à un jeu.
     */
    public function jeu(): BelongsTo
    {
        return $this->belongsTo(Jeu::class);
    }

    /**
     * Joueurs inscrits via la table inscriptions.
     */
    public function joueurs(): BelongsToMany
    {
        return $this->belongsToMany(Joueur::class, 'inscriptions')
                    ->withPivot('statut', 'classement')
                    ->withTimestamps();
    }

    /**
     * Les inscriptions directes.
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }
}
