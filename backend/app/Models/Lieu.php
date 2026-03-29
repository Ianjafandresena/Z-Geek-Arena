<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lieu extends Model
{
    protected $table = 'lieux';

    protected $fillable = [
        'nom',
        'adresse',
        'ville',
        'code_postal',
        'pays',
    ];

    /**
     * Un lieu accueille plusieurs events.
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
