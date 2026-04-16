import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { useAvis } from '../../hooks/useAvis';
import { Avis, updateAvis, deleteAvis } from '../../services/avis';

export default function AvisAdmin() {
  const { avis, loading, error } = useAvis();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Avis>>({});
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (avi: Avis) => {
    setFormData(avi);
    setEditingId(avi.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateAvis(editingId, formData);
      }
      setShowForm(false);
      setFormData({});
      setEditingId(null);
      window.location.reload();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await deleteAvis(id);
        window.location.reload();
      } catch (err) {
        console.error('Erreur:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline">Gestion des Avis Clients</h2>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Chargement...</p>
      ) : error ? (
        <p className="text-red-500">Erreur: {error}</p>
      ) : (
        <div className="grid gap-4">
          {avis.map((avi) => (
            <motion.div
              key={avi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-low p-4 rounded-lg border border-white/5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-headline">{avi.client?.nom} {avi.client?.prenom}</h3>
                  <div className="flex gap-1">
                    {[...Array(Math.round(avi.note || 5))].map((_, i) => (
                      <Star key={i} size={14} className="text-secondary fill-secondary" />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(avi)}
                    className="p-2 hover:bg-white/5 rounded text-secondary"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(avi.id)}
                    className="p-2 hover:bg-white/5 rounded text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant">{avi.commentaire}</p>
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
          <h3 className="font-headline mb-4">Modifier un avis</h3>
          <div className="space-y-4">
            <select
              value={formData.statut || 'publie'}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
            >
              <option value="publie">Publié</option>
              <option value="en attente">En attente</option>
              <option value="rejete">Rejeté</option>
            </select>
            <textarea
              placeholder="Réponse admin"
              value={formData.reponse_admin || ''}
              onChange={(e) => setFormData({ ...formData, reponse_admin: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface h-24"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-80"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-white/10 text-on-surface px-4 py-2 rounded-lg hover:bg-white/20"
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
