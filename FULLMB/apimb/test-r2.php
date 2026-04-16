<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

// Test de configuration R2
echo "=== Test de Configuration Cloudflare R2 ===\n\n";

// Vérifier la configuration
echo "1. Configuration des disques :\n";
$disks = config('filesystems.disks');

if (isset($disks['r2'])) {
    echo "✓ Disque R2 configuré\n";
    echo "  - Bucket: " . ($disks['r2']['bucket'] ?? 'N/A') . "\n";
    echo "  - Region: " . ($disks['r2']['region'] ?? 'N/A') . "\n";
    echo "  - Endpoint: " . ($disks['r2']['endpoint'] ?? 'N/A') . "\n";
} else {
    echo "✗ Disque R2 non configuré\n";
}

// Tester la connexion
echo "\n2. Test de connexion :\n";
try {
    $files = Storage::disk('r2')->files('site-images');
    echo "✓ Connexion R2 réussie\n";
    echo "  - " . count($files) . " fichiers trouvés dans site-images/\n";
} catch (Exception $e) {
    echo "✗ Erreur de connexion R2: " . $e->getMessage() . "\n";
}

// Tester l'upload
echo "\n3. Test d'upload :\n";
try {
    // Créer un fichier de test
    $testContent = "Test file for R2 upload - " . date('Y-m-d H:i:s');
    $testPath = 'test_' . time() . '.txt';

    $uploaded = Storage::disk('r2')->put($testPath, $testContent);

    if ($uploaded) {
        echo "✓ Upload réussi\n";
        echo "  - Fichier: {$testPath}\n";
        echo "  - URL: " . Storage::disk('r2')->url($testPath) . "\n";

        // Tester la lecture
        $readContent = Storage::disk('r2')->get($testPath);
        if ($readContent === $testContent) {
            echo "✓ Lecture réussie\n";
        } else {
            echo "✗ Erreur de lecture\n";
        }

        // Supprimer le fichier de test
        Storage::disk('r2')->delete($testPath);
        echo "✓ Suppression réussie\n";

    } else {
        echo "✗ Échec de l'upload\n";
    }

} catch (Exception $e) {
    echo "✗ Erreur lors de l'upload: " . $e->getMessage() . "\n";
}

echo "\n=== Test terminé ===\n";