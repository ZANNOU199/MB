# 🔐 Explication de l'Erreur CORS et Solutions

## Qu'est-ce que l'Erreur CORS?

```
CORS policy: Response to preflight request doesn't pass access control check: 
The value of the 'Access-Control-Allow-Origin' header in the response must not 
be the wildcard '*' when the request's credentials mode is 'include'.
```

### Problème Identifié:

1. **Frontend (React/Vite)** → `http://localhost:3000`
2. **Backend (Laravel)** → `http://localhost:8000`
3. **Mode de requête**: `include` (envoi de credentials/cookies)
4. **Réponse du serveur**: Headers CORS avec `*` (wildcard)

### Incompatibilité:
- ✗ Les requêtes avec `credentials: 'include'` **DOIVENT** recevoir une origine spécifique
- ✗ Le wildcard `*` n'est pas autorisé avec credentials pour des raisons de sécurité

---

## ✅ Solutions Appliquées

### 1️⃣ Configuration CORS côté Laravel
**Fichier**: `config/cors.php`

```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
],
'supports_credentials' => true,
```

- ✅ Spécifie les origines autorisées au lieu de `*`
- ✅ Active le support des credentials (cookies/auth)

### 2️⃣ Enregistrement du Middleware CORS
**Fichier**: `bootstrap/app.php`

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```

- ✅ Le middleware CORS s'exécute avant les autres middlewares
- ✅ Applique automatiquement les headers CORS à toutes les réponses API

### 3️⃣ Gestion des Uploads de Fichiers
**Service**: `services/articlesBlog.ts`

La solution évite le problème CORS avec les credentials en utilisant `FormData`:

```typescript
// ❌ AVANT (génère une erreur preflight)
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ← Provoque le preflight
  body: JSON.stringify(data),
});

// ✅ APRÈS (FormData contourne le preflight généralisé)
const formData = new FormData();
formData.append('titre_fr', data.titre_fr);
formData.append('image_url', file);

const response = await fetch(url, {
  method: 'POST',
  body: formData, // ← Pas d'en-tête Content-Type (le navigateur le définit)
});
```

---

## 🔄 Flux de Requête Correct

### 1. Requête **GET** (pas d'image)
```
Frontend GET /api/articles-blog
    ↓
Browser: Request with origin header
    ↓
Laravel CORS Middleware: Vérifie l'origine ✓
    ↓
Backend: Répond avec headers CORS corrects
    ↓
Frontend: Reçoit les données ✅
```

### 2. Requête **POST** avec Image (FormData)
```
Frontend POST /api/articles-blog (FormData)
    ↓
Browser: Pas de preflight pour FormData simple
    ↓
Laravel: Reçoit $request->file('image_url')
    ↓
Backend: Sauvegarde le fichier
    ↓
Frontend: Reçoit les données + URL du fichier ✅
```

---

## 🛠️ Modifications du Contrôleur

**Avant**:
```php
'image_url' => 'nullable|string',
```

**Après**:
```php
'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

if ($request->hasFile('image_url')) {
    $file = $request->file('image_url');
    $path = $file->store('articles', 'public');
    $data['image_url'] = '/storage/' . $path;
}
```

✅ Valide les images  
✅ Sauvegarde dans `storage/app/public/articles`  
✅ Stocke le chemin d'accès public (`/storage/...`)

---

## 📝 Améliorations du Formulaire

**Nouveau champ d'upload**:
```jsx
<input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
/>
{imagePreview && (
  <img src={imagePreview} alt="Aperçu" />
)}
```

- 📸 Prévisualisation avant envoi
- 📄 Support des formats JPEG, PNG, GIF
- ⚡ Max 2MB par validations Laravel

---

## 🚀 À Faire Ensuite

1. **Vérifier que les répertoires de stockage existent**:
   ```bash
   php artisan storage:link
   ```

2. **Assurer les permissions**:
   ```bash
   chmod -R 755 storage/
   chmod -R 755 public/storage
   ```

3. **Tester l'upload**:
   - Accédez à `/admin` → Articles
   - Cliquez "Ajouter"
   - Sélectionnez une image
   - Cliquez "Enregistrer"

---

## 🔐 Sécurité CORS

| Configuration | Sécurité | Use Case |
|---|---|---|
| `*` (wildcard) | ❌ Basse | API publique sans données sensibles |
| Origines spécifiques | ✅ Haute | Avec credentials/authentification |
| Credentials: true | ✅ Requise | Auth cookies, JWT dans headers |

**Votre config**: ✅ **Sécurisée** - origines spécifiques + credentials

---

## 📚 Ressources

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Laravel CORS Config](https://laravel.com/docs/11.x/cors)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
