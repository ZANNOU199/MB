<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appartements', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('titre_fr');
            $table->string('titre_en');
            $table->text('description_fr')->nullable();
            $table->text('description_en')->nullable();
            $table->unsignedSmallInteger('capacite')->default(1);
            $table->unsignedInteger('prix_nuit')->default(0);
            $table->string('statut')->default('actif');
            $table->string('smoobu_id')->nullable()->unique();
            $table->string('type')->nullable();
            $table->json('equipements')->nullable();
            $table->json('photos')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appartements');
    }
};
