<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lieu_id')->constrained('lieux')->cascadeOnDelete();
            $table->string('nom', 150);
            $table->string('slug', 150)->unique();
            $table->text('description')->nullable();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('statut', 30)->default('a_venir');
            $table->string('gradient', 255)->nullable();
            $table->string('image_url', 500)->nullable();
            $table->timestamps();

            $table->index('statut');
            $table->index('date_debut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
