<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('joueur_id')->constrained('joueurs')->cascadeOnDelete();
            $table->foreignId('tournoi_id')->constrained('tournois')->cascadeOnDelete();
            $table->string('statut', 30)->default('inscrit');
            $table->integer('classement')->nullable();
            $table->timestamps();

            $table->unique(['joueur_id', 'tournoi_id']);
            $table->index('joueur_id');
            $table->index('tournoi_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
