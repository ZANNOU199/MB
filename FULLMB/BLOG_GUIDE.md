# 📚 Guide Complet: Blog & CMS Admin

## 🚀 Installation Rapide

### 1. Configuration CORS et Stockage

#### Windows PowerShell:
```powershell
cd "C:\Users\LATITUDE 3520\FULLMB"
.\setup-storage.ps1
```

#### Linux/Mac:
```bash
cd ~/FULLMB
bash setup-storage.sh
```

**Résultat**: 
✅ Middleware CORS activé  
✅ Symlink `/storage/` créé  
✅ Dossier `articles/` préparé

---

## 📝 Créer un Article Blog

### Via l'Admin Dashboard:

1. **Accédez au dashboard**:
   ```
   http://localhost:3000/admin
   ```

2. **Cliquez sur "Articles Blog"** dans le menu

3. **Cliquez sur "Ajouter Article"** 

4. **Remplissez le formulaire**:
   - **Titre FR** *(requis)* - "Découvrez Cotonou"
   - **Titre EN** - "Discover Cotonou"
   - **Slug** *(requis, URL-friendly)* - "decouvrez-cotonou"
   - **Catégorie** - Voyage, Luxe, Bénin, Conseils, Famille
   - **Photo de couverture** - Sélectionnez une image
   - **Extrait FR** - Résumé court (1-2 lignes)
   - **Contenu FR** - Article complet
   - **Statut** - Brouillon, Publié, Archivé

5. **Cliquez "Enregistrer"**

### Résultat:
- ✅ Article sauvegardé en base de données
- ✅ Image stockée dans `storage/app/public/articles/`
- ✅ Article visible sur `/blog`

---

## 🖼️ Gestion des Images

### Où sont stockées les images?

```
apimb/
└── storage/
    └── app/
        └── public/
            └── articles/
                ├── image-1.jpg
                ├── image-2.png
                └── ...
```

### Comment y accéder?

```
Backend: http://localhost:8000/storage/articles/image-1.jpg
Frontend: /storage/articles/image-1.jpg (relatif)
```

### Validations:
- 📐 Formats acceptés: JPEG, PNG, GIF
- 📦 Taille max: 2 MB
- 🔐 Validation côté Laravel ET frontend

---

## 🌐 Affichage du Blog Frontend

### Page Liste (`/blog`)

Le composant `BlogPage.tsx` affiche:

```jsx
- 📊 Catégories générées dynamiquement
- 📄 Articles avec:
  - Image de couverture
  - Titre
  - Catégorie
  - Date de publication
  - Extrait
- 🔍 Filtrage par catégorie
```

**Code**:
```typescript
const { articles, loading } = useArticles();
// Les articles sont automatiquement chargés du backend!
```

### Page Article Détail (`/blog/:slug`)

```jsx
- 📰 Article complet
- 👉 Lien "Voir plus" vers l'article entier
- 🎨 Mise en page responsive
```

**Chemin**: [src/pages/BlogPostPage.tsx](../MB-PREMIUM-LIVING/src/pages/BlogPostPage.tsx)

---

## 🔄 Flux de Données

```
┌─────────────────────┐
│  Admin Dashboard    │
│  (http://3000/admin)│
│                     │
│ ► Articles Blog     │
│   ├─ Ajouter       │
│   ├─ Modifier      │
│   └─ Supprimer     │
└──────────┬──────────┘
           │
           │ (FormData + file)
           ↓
┌─────────────────────────────────────────┐
│  Laravel API                            │
│  POST /api/articles-blog                │
│  ├─ Valide les données                  │
│  ├─ Sauvegarde l'image                  │
│  └─ Crée l'enregistrement               │
└──────────┬──────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────┐
│  Database (MySQL)                       │
│  articles_blog table                    │
│  ├─ titre, contenu, slug...             │
│  ├─ image_url: /storage/articles/...    │
│  └─ statut, publie_le, etc              │
└─────────────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────┐
│  Frontend Cache/Storage                 │
│  GET /api/articles-blog                 │
│  useArticles() hook                     │
│  ├─ BlogPage.tsx                        │
│  ├─ DynamicBlog.tsx                     │
│  └─ BlogPostPage.tsx                    │
└─────────────────────────────────────────┘
```

---

## 🛠️ Structure des Fichiers

### Backend:
```
apimb/
├── app/Http/Controllers/Api/
│   └── ArticleBlogController.php ← Gère CRUD + uploads
├── app/Models/
│   └── ArticleBlog.php ← Modèle ORM
├── database/migrations/
│   └── *_create_articles_blog_table.php ← Schéma DB
└── config/
    └── cors.php ← Configuration CORS ✅
```

### Frontend:
```
MB-PREMIUM-LIVING/src/
├── services/
│   └── articlesBlog.ts ← API calls + FormData
├── hooks/
│   └── useArticles.ts ← État & fetch
├── pages/
│   ├── BlogPage.tsx ← Liste avec [useArticles]
│   └── BlogPostPage.tsx ← Détail article
├── components/
│   ├── admin/
│   │   └── ArticlesAdmin.tsx ← Form upload ✅
│   └── DynamicBlog.tsx ← Affichage dynamique
```

---

## 🐛 Dépannage

### "Image n'apparaît pas"
```
✓ Vérifiez que storage:link est créé
  → php artisan storage:link
✓ Vérifiez permissions
  → chmod -R 755 storage/
✓ Testez l'URL directement
  → http://localhost:8000/storage/articles/image.jpg
```

### "Insert/Update échoue"
```
✓ Vérifiez message d'erreur exact
✓ Validez le slug (unique, pas d'espaces)
✓ Vérifiez taille image < 2MB
✓ Testez avec Postman si besoin
```

### "CORS error"
```
✓ Confirmez bootstrap/app.php a HandleCors
✓ Confirmez config/cors.php liste les origines
✓ F12 → Console → copier erreur exacte
```

---

## ✨ Exemple d'Article Complet

**Titre FR**: "Week-end Détente à Cotonou"  
**Slug**: "weekend-detente-cotonou"  
**Catégorie**: Voyage  
**Image**: Logo MB Prestige Living  

**Extrait**:
```
Découvrez comment passer un week-end inoubliable 
dans nos appartements de luxe à Cotonou. Remise 
spéciale pour les couples! 🌴
```

**Contenu**:
```
## Votre escapade de rêve à Cotonou

Bienvenue à MB Prestige Living, votre destination 
idéale pour un séjour luxueux à Cotonou.

### Les Avantages:
- Panorama spectaculaire
- Service premium 24/7
- Cuisine gastronomique
- Activités locales incluses

[...]
```

**Résultat Frontend**: Article visible immédiatement sur `/blog` ✅

---

## 📊 Gestion Complète

Vous pouvez maintenant:

| Action | Où | Statut |
|--------|-----|--------|
| ➕ Créer article | Admin → Articles | ✅ Actif |
| ✏️ Modifier article | Admin → Articles | ✅ Actif |
| ❌ Supprimer article | Admin → Articles | ✅ Actif |
| 🖼️ Uploader image | Formulaire | ✅ Actif |
| 📺 Afficher liste | /blog | ✅ Actif |
| 📖 Lire article | /blog/:slug | ✅ Actif |
| 🏠 Afficher accueil | / | ✅ Blog inclus |

---

## 🎯 Prochaines Étapes

1. **Vérifier les autres modules admin** (Appartements, Réservations, etc.)
2. **Configurer l'authentification Sanctum**
3. **Tester les filtres par catégorie**
4. **Optimiser les images** (compression, lazy loading)
5. **Configurer les sauvegardes auto**

---

## 📞 Support

- 🔗 [Documentation CORS](./CORS_EXPLANATION.md)
- 📖 [Laravel Docs](https://laravel.com/docs)
- ⚛️ [React Docs](https://react.dev)
- 🎨 [Tailwind Docs](https://tailwindcss.com)
