import { useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2 } from 'lucide-react';
import { useReservations } from '../../hooks/useReservations';
import { Reservation, updateReservation, deleteReservation } from '../../services/reservations';

export default function ReservationsAdmin() {
  const { reservations, loading, error } = useReservations();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Reservation>>({});
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (res: Reservation) => {
    setFormData(res);
    setEditingId(res.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateReservation(editingId, formData);
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
        await deleteReservation(id);
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
        <h2 className="text-2xl font-headline">Gestion des Réservations</h2>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Chargement...</p>
      ) : error ? (
        <p className="text-red-500">Erreur: {error}</p>
      ) : (
        <div className="grid gap-4">
          {reservations.map((res) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-low p-4 rounded-lg border border-white/5 flex items-center justify-between"
            >
              <div>
                <h3 className="font-headline">Réservation #{res.id}</h3>
                <p className="text-sm text-on-surface-variant">
                  {new Date(res.date_arrivee).toLocaleDateString('fr-FR')} - {new Date(res.date_depart).toLocaleDateString('fr-FR')}
                </p>
                <span className={`text-xs px-2 py-1 rounded ${res.statut === 'confirmee' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {res.statut}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(res)}
                  className="p-2 hover:bg-white/5 rounded text-secondary"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(res.id)}
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
          <h3 className="font-headline mb-4">Modifier une réservation</h3>
          <div className="space-y-4">
            <select
              value={formData.statut || 'confirmee'}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
            >
              <option value="confirmee">Confirmée</option>
              <option value="en attente">En attente</option>
              <option value="annulee">Annulée</option>
            </select>
            <input
              type="number"
              placeholder="Montant total"
              value={formData.montant_total || ''}
              onChange={(e) => setFormData({ ...formData, montant_total: parseFloat(e.target.value) })}
              className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
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
