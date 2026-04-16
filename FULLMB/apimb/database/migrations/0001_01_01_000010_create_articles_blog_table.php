<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles_blog', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('titre_fr');
            $table->string('titre_en');
            $table->text('contenu_fr')->nullable();
            $table->text('contenu_en')->nullable();
            $table->string('categorie')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamp('publie_le')->nullable();
            $table->string('statut')->default('draft');
            $table->text('excerpt_fr')->nullable();
            $table->text('excerpt_en')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles_blog');
    }
};
