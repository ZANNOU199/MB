import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';
import { ArticleBlog, createArticle, updateArticle, deleteArticle } from '../../services/articlesBlog';

export default function ArticlesAdmin() {
  const { articles, setArticles, loading, error } = useArticles();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ArticleBlog> & { image?: File }>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleEdit = (article: ArticleBlog) => {
    setFormData(article);
    setImagePreview(article.image_url || null);
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingId) {
        const updated = await updateArticle(editingId, formData);
        setArticles((prev) =>
          prev.map((a) => (a.id === updated.id ? { ...updated } : a))
        );
      } else {
        const created = await createArticle(formData);
        setArticles((prev) => [created, ...prev]);
      }
      setShowForm(false);
      setFormData({});
      setImagePreview(null);
      setEditingId(null);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la sauvegarde: ' + (err instanceof Error ? err.message : 'Inconnu'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await deleteArticle(id);
        setArticles((prev) => prev.filter(article => article.id !== id));
      } catch (err) {
        console.error('Erreur:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline">Gestion des Articles Blog</h2>
        <button
          onClick={() => {
            setFormData({});
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Chargement...</p>
      ) : error ? (
        <p className="text-red-500">Erreur: {error}</p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-low p-4 rounded-lg border border-white/5 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="font-headline">{article.titre_fr}</h3>
                <p className="text-sm text-on-surface-variant">{article.categorie}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="p-2 hover:bg-white/5 rounded text-secondary"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="p-2 hover:bg-white/5 rounded text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-low p-6 rounded-lg border border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline">{editingId ? 'Modifier' : 'Ajouter'} un article</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-white/10 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Upload Image */}
            <div>
              <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">
                Photo de couverture
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-4 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="article-image"
                />
                <label
                  htmlFor="article-image"
                  className="cursor-pointer flex flex-col items-center justify-center py-4"
                >
                  {imagePreview ? (
                    <div className="text-center">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-32 h-24 object-cover rounded-lg border border-white/10 mx-auto mb-3"
                      />
                      <p className="text-sm text-primary font-medium">Changer l'image</p>
                      <p className="text-xs text-on-surface-variant">Cliquez pour sélectionner une nouvelle image</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-primary font-medium">Ajouter une photo de couverture</p>
                      <p className="text-xs text-on-surface-variant">Formats acceptés: JPG, PNG, WebP (max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <input
              type="text"
              placeholder="Titre FR"
              value={formData.titre_fr || ''}
              onChange={(e) => {
                const titre = e.target.value;
                // Génère le slug automatiquement
                const slug = titre
                  .toLowerCase()
                  .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                  .replace(/--+/g, '-')
                  .replace(/^-+|-+$/g, '');
                setFormData({ ...formData, titre_fr: titre, slug, statut: 'published' });
              }}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
            />
            <input
              type="text"
              placeholder="Titre EN (optionnel)"
              value={formData.titre_en || ''}
              onChange={(e) => setFormData({ ...formData, titre_en: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
            />
            {/* Slug caché, généré automatiquement à partir du titre */}
            <input
              type="hidden"
              value={formData.slug || ''}
              readOnly
            />
            <select
              value={formData.categorie || ''}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="voyage">Voyage</option>
              <option value="luxe">Luxe</option>
              <option value="bénin">Bénin</option>
              <option value="conseils">Conseils</option>
              <option value="famille">Famille</option>
            </select>
            <textarea
              placeholder="Extrait FR"
              value={formData.excerpt_fr || ''}
              onChange={(e) => setFormData({ ...formData, excerpt_fr: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface h-16"
            />
            <textarea
              placeholder="Contenu FR (complet)"
              value={formData.contenu_fr || ''}
              onChange={(e) => setFormData({ ...formData, contenu_fr: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface h-32"
            />
            {/* Statut caché, toujours 'published' */}
            <input type="hidden" value="published" />

            <div className="flex gap-2 pt-4 border-t border-white/5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 flex-1 font-bold"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({});
                  setImagePreview(null);
                  setEditingId(null);
                }}
                className="bg-white/10 text-on-surface px-6 py-2 rounded-lg hover:bg-white/20 transition-colors flex-1"
              >
                Annuler
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
