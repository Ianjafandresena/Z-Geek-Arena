<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Regle extends Model
{
    protected $table = 'regles';

    protected $fillable = [
        'jeu_id',
        'contenu',
        'ordre',
    ];

    public function jeu(): BelongsTo
    {
        return $this->belongsTo(Jeu::class);
    }
}
