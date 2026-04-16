#!/bin/bash

# Script de configuration du stockage Laravel

echo "🔧 Configuration du stockage pour MB Prestige Living..."

# Aller dans le répertoire API
cd "c:/Users/LATITUDE 3520/FULLMB/apimb" || exit 1

# Créer le symlink de stockage
echo "📁 Création du symlink storage..."
php artisan storage:link

# Définir les permissions
echo "🔐 Configuration des permissions..."
chmod -R 755 storage/
chmod -R 755 public/storage 2>/dev/null || true

# Créer le dossier articles s'il n'existe pas
mkdir -p storage/app/public/articles
chmod -R 755 storage/app/public/articles

echo "✅ Configuration terminée!"
echo ""
echo "Vos uploads d'images seront stockés dans:"
echo "  - Backend: storage/app/public/articles/"
echo "  - URL: /storage/articles/{filename}"
echo ""
echo "Testez l'upload: http://localhost:3000/admin"
