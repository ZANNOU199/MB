import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from "lucide-react";
import { fetchClients, createClient, updateClient, deleteClient, Client } from '../../services/clients';

export default function ClientsAdmin() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    nationalite: ""
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    const data = await fetchClients();
    setClients(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateClient(editingId, formData);
      } else {
        await createClient(formData);
      }
      setFormData({ nom: "", prenom: "", email: "", telephone: "", nationalite: "" });
      setEditingId(null);
      setShowForm(false);
      loadClients();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleEdit = (client: Client) => {
    setFormData(client);
    setEditingId(client.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client?")) {
      try {
        await deleteClient(id);
        loadClients();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ nom: "", prenom: "", email: "", telephone: "", nationalite: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline">Gestion des Clients</h2>
          <p className="text-on-surface-variant mt-2">Gérez vos clients enregistrés</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold uppercase text-[10px]"
        >
          <Plus size={16} /> Ajouter Client
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
            <input
              type="text"
              placeholder="Prénom"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Nom"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Ville"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="bg-white/5 border border-white/10 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Pays"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
      ) : clients.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">Aucun client trouvé</div>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <motion.div
              key={client.id}
              className="bg-surface p-4 rounded-lg border border-white/5 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{client.firstname} {client.lastname}</h3>
                <p className="text-xs text-on-surface-variant">{client.email} | {client.phone}</p>
                {client.city && <p className="text-xs text-on-surface-variant">{client.city}, {client.country}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-2 hover:bg-white/5 rounded text-primary"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => client.id && handleDelete(client.id)}
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
