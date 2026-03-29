<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    protected $table = 'votes';

    protected $fillable = [
        'joueur_id',
        'categorie_recompense_id',
        'valeur',
    ];

    public function joueur(): BelongsTo
    {
        return $this->belongsTo(Joueur::class);
    }

    public function categorieRecompense(): BelongsTo
    {
        return $this->belongsTo(CategorieRecompense::class);
    }
}
