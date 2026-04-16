<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('featured_gallery_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('appartement_id');
            $table->string('photo_url');
            $table->unsignedTinyInteger('display_order'); // 1 à 9
            $table->timestamps();

            $table->foreign('appartement_id')->references('id')->on('appartements')->onDelete('cascade');
            $table->unique('display_order'); // Un seul par position
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_gallery_images');
    }
};
