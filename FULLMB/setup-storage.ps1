# Script de configuration du stockage Laravel pour Windows
# Exécutez avec: powershell -ExecutionPolicy Bypass -File setup-storage.ps1

Write-Host "🔧 Configuration du stockage pour MB Prestige Living..." -ForegroundColor Cyan

# Changer le répertoire
Set-Location "C:\Users\LATITUDE 3520\FULLMB\apimb"

# Créer le symlink de stockage
Write-Host "📁 Création du symlink storage..." -ForegroundColor Yellow
php artisan storage:link

# Vérifier que le dossier articles existe
$articlesPath = ".\storage\app\public\articles"
if (-not (Test-Path $articlesPath)) {
    Write-Host "📂 Création du dossier articles..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $articlesPath -Force | Out-Null
}

Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "Vos uploads d'images seront stockés dans:" -ForegroundColor Cyan
Write-Host "  - Backend: .\storage\app\public\articles\" -ForegroundColor Gray
Write-Host "  - URL: /storage/articles/{filename}" -ForegroundColor Gray
Write-Host ""
Write-Host "Testez l'upload: http://localhost:3000/admin" -ForegroundColor Green
