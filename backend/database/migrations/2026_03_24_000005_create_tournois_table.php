<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournois', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignId('jeu_id')->constrained('jeux')->cascadeOnDelete();
            $table->string('nom', 150)->nullable();
            $table->timestamp('date_debut');
            $table->timestamp('date_fin')->nullable();
            $table->string('phase', 50)->default('poules');
            $table->string('format', 50)->default('double_elimination');
            $table->integer('max_joueurs')->default(64);
            $table->timestamps();

            $table->index('event_id');
            $table->index('jeu_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tournois');
    }
};
