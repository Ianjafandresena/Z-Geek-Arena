<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Joueur extends Model
{
    protected $table = 'joueurs';

    protected $fillable = [
        'nom',
        'email',
        'pseudo',
        'avatar_url',
    ];

    /**
     * Un joueur participe à plusieurs tournois via inscriptions.
     */
    public function tournois(): BelongsToMany
    {
        return $this->belongsToMany(Tournoi::class, 'inscriptions')
                    ->withPivot('statut', 'classement')
                    ->withTimestamps();
    }

    /**
     * Les inscriptions du joueur.
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    /**
     * Les votes du joueur.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }
}
