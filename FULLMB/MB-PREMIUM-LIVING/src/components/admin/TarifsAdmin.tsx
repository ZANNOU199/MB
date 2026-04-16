import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { fetchTarifs, createTarif, updateTarif, deleteTarif, Tarif } from '../../services/tarifs';
import { fetchAppartements, Appartement } from '../../services/appartements';

export default function TarifsAdmin() {
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Tarif>>({
    appartement_id: 0,
    date_debut: "",
    prix_nuit: 0,
    type: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [tarifsData, appartementsData] = await Promise.all([
      fetchTarifs(),
      fetchAppartements()
    ]);
    setTarifs(tarifsData || []);
    setAppartements(appartementsData || []);
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateTarif(editingId, formData);
      } else {
        await createTarif(formData);
      }
      setFormData({ appartement_id: 0, date_debut: "", prix_nuit: 0, type: "" });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleEdit = (tarif: Tarif) => {
    setFormData(tarif);
    setEditingId(tarif.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce tarif?")) {
      try {
        await deleteTarif(id);
        loadData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ appartement_id: 0, date_debut: "", prix_nuit: 0, type: "" });
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
          <h2 className="text-3xl font-headline">Gestion des Tarifs</h2>
          <p className="text-on-surface-variant mt-2">Gérez les tarifs par saison</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold uppercase text-[10px]"
        >
          <Plus size={16} /> Ajouter Tarif
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
            <select
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            >
              <option value="basse">Basse saison</option>
              <option value="moyenne">Moyenne saison</option>
              <option value="haute">Haute saison</option>
            </select>
            <input
              type="number"
              placeholder="Prix par nuit"
              value={formData.price_per_night}
              onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Durée minimale de séjour"
              value={formData.min_stay}
              onChange={(e) => setFormData({ ...formData, min_stay: parseInt(e.target.value) })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
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
      ) : tarifs.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">Aucun tarif trouvé</div>
      ) : (
        <div className="grid gap-4">
          {tarifs.map((tarif) => (
            <motion.div
              key={tarif.id}
              className="bg-surface p-4 rounded-lg border border-white/5 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{getAppartementName(tarif.appartement_id)}</h3>
                <p className="text-xs text-on-surface-variant">
                  {tarif.season} - {tarif.price_per_night}€/nuit | Durée min: {tarif.min_stay} nuit(s)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tarif)}
                  className="p-2 hover:bg-white/5 rounded text-primary"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => tarif.id && handleDelete(tarif.id)}
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
