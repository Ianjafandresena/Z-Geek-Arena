<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jeu_id')->constrained('jeux')->cascadeOnDelete();
            $table->text('contenu');
            $table->integer('ordre')->default(0);
            $table->timestamps();

            $table->index('jeu_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regles');
    }
};
