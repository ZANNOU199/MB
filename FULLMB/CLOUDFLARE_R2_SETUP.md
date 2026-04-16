# Configuration Cloudflare R2 pour l'Upload d'Images

## Prérequis

1. **Compte Cloudflare** : Créer un compte sur [Cloudflare](https://cloudflare.com)
2. **R2 activé** : Activer R2 dans votre tableau de bord Cloudflare
3. **Bucket créé** : Créer un bucket R2 pour stocker vos images

## Configuration

### 1. Variables d'environnement (.env)

Ajoutez ces variables à votre fichier `.env` :

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=votre_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=votre_secret_access_key
CLOUDFLARE_R2_REGION=auto
CLOUDFLARE_R2_BUCKET=votre_nom_de_bucket
CLOUDFLARE_R2_URL=https://votre-bucket-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://votre-account-id.r2.cloudflarestorage.com
```

### 2. Obtenir les clés API

1. Allez dans votre tableau de bord Cloudflare → R2 → Manage R2 API Tokens
2. Créez un nouveau token avec les permissions :
   - Object Read
   - Object Write
3. Copiez l'Access Key ID et le Secret Access Key

### 3. Configuration du Bucket

1. Dans R2, créez un bucket
2. Configurez les CORS settings si nécessaire :
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000", "https://votredomaine.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

### 4. URL publique

Pour rendre les images accessibles publiquement :
1. Dans votre bucket R2, allez dans Settings
2. Activez "Public Access" ou créez une Custom Domain
3. Utilisez l'URL fournie pour `CLOUDFLARE_R2_URL`

## Types d'images supportés

Le système supporte l'upload des types d'images suivants :
- Logo du site
- Images hero (Accueil, Galerie, Blog, Avis, Témoignages)
- Images d'articles de blog

## Utilisation dans l'admin

1. Allez dans l'onglet "Médias & Images" de l'admin
2. Pour chaque image, vous pouvez :
   - **Uploader directement** : Cliquez sur "Choose File" et sélectionnez une image
   - **Utiliser une URL** : Collez l'URL d'une image existante
3. Les images sont automatiquement compressées et optimisées
4. Cliquez sur "Enregistrer" pour sauvegarder les changements

## Structure des fichiers

Les images sont organisées dans R2 comme suit :
```
bucket-name/
├── site-images/
│   ├── logo_1234567890.png
│   ├── heroHome_1234567890.jpg
│   └── ...
└── articles/
    └── article-image.jpg
```

## Sécurité

- Les images sont validées côté serveur (type, taille max 5MB)
- Seuls les formats JPEG, PNG, GIF, WebP sont acceptés
- Les noms de fichiers sont générés automatiquement pour éviter les conflits

## Dépannage

### Erreur "Access Denied"
- Vérifiez vos clés API R2
- Assurez-vous que le token a les bonnes permissions

### Erreur "Bucket not found"
- Vérifiez le nom du bucket dans les variables d'environnement
- Assurez-vous que le bucket existe dans R2

### Images ne s'affichent pas
- Vérifiez que l'URL publique est correctement configurée
- Assurez-vous que le bucket permet l'accès public ou utilisez une Custom Domain