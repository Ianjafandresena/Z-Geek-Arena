<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('actualites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->string('titre', 255);
            $table->string('slug', 255)->unique();
            $table->text('contenu');
            $table->string('extrait', 500)->nullable();
            $table->string('image_url', 500)->nullable();
            $table->string('categorie', 50)->default('nouvelles');
            $table->boolean('publie')->default(false);
            $table->timestamp('date_publication')->nullable();
            $table->timestamps();

            $table->index('event_id');
            $table->index('publie');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actualites');
    }
};
