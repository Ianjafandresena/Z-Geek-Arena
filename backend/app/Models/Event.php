<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $table = 'events';

    protected $fillable = [
        'lieu_id',
        'nom',
        'slug',
        'description',
        'date_debut',
        'date_fin',
        'statut',
        'gradient',
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin'   => 'date',
        ];
    }

    /**
     * Un event se déroule dans un lieu.
     */
    public function lieu(): BelongsTo
    {
        return $this->belongsTo(Lieu::class);
    }

    /**
     * Un event contient plusieurs tournois.
     */
    public function tournois(): HasMany
    {
        return $this->hasMany(Tournoi::class);
    }

    /**
     * Un event peut avoir des actualités liées.
     */
    public function actualites(): HasMany
    {
        return $this->hasMany(Actualite::class);
    }
}
