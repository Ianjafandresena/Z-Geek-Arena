<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('joueur_id')->constrained('joueurs')->cascadeOnDelete();
            $table->foreignId('categorie_recompense_id')->constrained('categories_recompense')->cascadeOnDelete();
            $table->string('valeur', 255);
            $table->timestamps();

            $table->unique(['joueur_id', 'categorie_recompense_id']);
            $table->index('joueur_id');
            $table->index('categorie_recompense_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
