import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { fetchDisponibilites, createDisponibilite, updateDisponibilite, deleteDisponibilite, Disponibilite } from '../../services/disponibilites';
import { fetchAppartements, Appartement } from '../../services/appartements';

export default function DisponibiliteAdmin() {
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Disponibilite>>({
    appartement_id: 0,
    date_debut: "",
    date_fin: "",
    bloque: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [disponData, appartementsData] = await Promise.all([
      fetchDisponibilites(),
      fetchAppartements()
    ]);
    setDisponibilites(disponData || []);
    setAppartements(appartementsData || []);
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDisponibilite(editingId, formData);
      } else {
        await createDisponibilite(formData);
      }
      setFormData({ appartement_id: 0, date_debut: "", date_fin: "", bloque: false });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleEdit = (dispon: Disponibilite) => {
    setFormData(dispon);
    setEditingId(dispon.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette disponibilité?")) {
      try {
        await deleteDisponibilite(id);
        loadData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ appartement_id: 0, date_debut: "", date_fin: "", bloque: false });
    setEditingId(null);
    setShowForm(false);
  };

  const getAppartementName = (id: number) => {
    return appartements.find(a => a.id === id)?.name || "Inconnu";
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline">Gestion des Disponibilités</h2>
          <p className="text-on-surface-variant mt-2">Gérez la disponibilité de vos appartements</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold uppercase text-[10px]"
        >
          <Plus size={16} /> Ajouter Disponibilité
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-surface p-6 rounded-xl border border-white/5 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.appartement_id}
              onChange={(e) => setFormData({ ...formData, appartement_id: parseInt(e.target.value) })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            >
              <option value="">Sélectionner un appartement</option>
              {appartements.map(app => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.date_from}
              onChange={(e) => setFormData({ ...formData, date_from: e.target.value })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
            <input
              type="date"
              value={formData.date_to}
              onChange={(e) => setFormData({ ...formData, date_to: e.target.value })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold">Disponible</label>
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded font-bold text-xs"
            >
              <Save size={14} /> Enregistrer
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded font-bold text-xs"
            >
              <X size={14} /> Annuler
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Chargement...</div>
      ) : disponibilites.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">Aucune disponibilité trouvée</div>
      ) : (
        <div className="grid gap-4">
          {disponibilites.map((dispon) => (
            <motion.div
              key={dispon.id}
              className="bg-surface p-4 rounded-lg border border-white/5 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{getAppartementName(dispon.appartement_id)}</h3>
                <p className="text-xs text-on-surface-variant">
                  {dispon.date_from} à {dispon.date_to} {dispon.available ? "✓ Disponible" : "✗ Indisponible"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dispon)}
                  className="p-2 hover:bg-white/5 rounded text-primary"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => dispon.id && handleDelete(dispon.id)}
                  className="p-2 hover:bg-white/5 rounded text-secondary"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
