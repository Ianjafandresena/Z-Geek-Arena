<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inscription extends Model
{
    protected $table = 'inscriptions';

    protected $fillable = [
        'joueur_id',
        'tournoi_id',
        'event_id',
        'statut',
        'classement',
    ];

    public function joueur(): BelongsTo
    {
        return $this->belongsTo(Joueur::class);
    }

    public function tournoi(): BelongsTo
    {
        return $this->belongsTo(Tournoi::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
