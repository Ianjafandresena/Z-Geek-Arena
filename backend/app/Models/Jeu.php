<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jeu extends Model
{
    protected $table = 'jeux';

    protected $fillable = [
        'nom',
        'slug',
        'plateforme',
        'image_url',
    ];

    /**
     * Un jeu a plusieurs règles.
     */
    public function regles(): HasMany
    {
        return $this->hasMany(Regle::class)->orderBy('ordre');
    }

    /**
     * Un jeu est joué dans plusieurs tournois.
     */
    public function tournois(): HasMany
    {
        return $this->hasMany(Tournoi::class);
    }
}
