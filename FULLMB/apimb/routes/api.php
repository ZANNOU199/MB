<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AppartementController;
use App\Http\Controllers\Api\ArticleBlogController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DisponibiliteController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\SiteImageController;
use App\Http\Controllers\Api\TarifController;
use App\Http\Controllers\Api\FeaturedGalleryImageController;
// Routes pour la sélection des 9 images à la une
Route::get('/featured-gallery-images', [FeaturedGalleryImageController::class, 'index']);
Route::put('/featured-gallery-images', [FeaturedGalleryImageController::class, 'update']);

Route::get('/site-settings', [SiteController::class, 'show']);
Route::put('/site-settings', [SiteController::class, 'update']);

Route::post('/site-images/upload', [SiteImageController::class, 'upload']);
Route::delete('/site-images/delete', [SiteImageController::class, 'delete']);

Route::get('/appartements', [AppartementController::class, 'index']);
Route::get('/appartements/slug/{slug}', [AppartementController::class, 'showBySlug']);
Route::get('/appartements/{appartement}', [AppartementController::class, 'show']);
Route::post('/appartements', [AppartementController::class, 'store']);
Route::put('/appartements/{appartement}', [AppartementController::class, 'update']);
Route::delete('/appartements/{appartement}', [AppartementController::class, 'destroy']);
Route::get('/articles-blog', [ArticleBlogController::class, 'index']);
Route::get('/articles-blog/slug/{slug}', [ArticleBlogController::class, 'showBySlug']);
Route::get('/articles-blog/{article}', [ArticleBlogController::class, 'show']);
Route::post('/articles-blog', [ArticleBlogController::class, 'store']);
Route::put('/articles-blog/{article}', [ArticleBlogController::class, 'update']);
Route::delete('/articles-blog/{article}', [ArticleBlogController::class, 'destroy']);
Route::apiResource('avis', AvisController::class);
Route::apiResource('clients', ClientController::class);
Route::apiResource('disponibilites', DisponibiliteController::class);
Route::apiResource('paiements', PaiementController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('tarifs', TarifController::class);
