<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lieux', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('adresse', 255)->nullable();
            $table->string('ville', 100);
            $table->string('code_postal', 10)->nullable();
            $table->string('pays', 50)->default('France');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lieux');
    }
};
