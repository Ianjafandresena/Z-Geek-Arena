<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inscriptions', function (Blueprint $table) {
            // Rendre tournoi_id nullable pour les inscriptions simples (visiteurs)
            $table->foreignId('tournoi_id')->nullable()->change();
            
            // Ajouter event_id pour lier l'inscription à un événement spécifique directement
            $table->foreignId('event_id')->nullable()->after('tournoi_id')->constrained('events')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('inscriptions', function (Blueprint $table) {
            $table->dropForeign(['event_id']);
            $table->dropColumn('event_id');
            $table->foreignId('tournoi_id')->nullable(false)->change();
        });
    }
};
