<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Actualite extends Model
{
    protected $table = 'actualites';

    protected $fillable = [
        'event_id',
        'titre',
        'slug',
        'contenu',
        'extrait',
        'image_url',
        'categorie',
        'publie',
        'date_publication',
    ];

    protected function casts(): array
    {
        return [
            'publie'           => 'boolean',
            'date_publication' => 'datetime',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
