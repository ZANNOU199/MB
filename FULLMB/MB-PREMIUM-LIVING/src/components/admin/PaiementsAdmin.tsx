import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Edit2, Eye } from "lucide-react";
import { fetchPaiements, updatePaiementStatus, Paiement } from '../../services/paiements';
import { fetchReservations, Reservation } from '../../services/reservations';

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-500";
    case "completed":
      return "text-green-500";
    case "failed":
      return "text-secondary";
    case "refunded":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/20";
    case "completed":
      return "bg-green-500/20";
    case "failed":
      return "bg-red-500/20";
    case "refunded":
      return "bg-blue-500/20";
    default:
      return "bg-gray-500/20";
  }
};

export default function PaiementsAdmin() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [paiementsData, reservationsData] = await Promise.all([
      fetchPaiements(),
      fetchReservations()
    ]);
    setPaiements(paiementsData.data || []);
    setReservations(reservationsData.data || []);
    setLoading(false);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updatePaiementStatus(id, newStatus);
      loadData();
      setSelectedPaiement(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const getReservationInfo = (resId: number) => {
    return reservations.find(r => r.id === resId);
  };

  const statusOptions = [
    { value: "pending", label: "En attente" },
    { value: "completed", label: "Complété" },
    { value: "failed", label: "Échoué" },
    { value: "refunded", label: "Remboursé" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline">Gestion des Paiements</h2>
        <p className="text-on-surface-variant mt-2">Suivez et gérez tous les paiements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Reçu", value: `${paiements.filter(p => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}€`, color: "text-green-500" },
          { label: "En Attente", value: `${paiements.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}€`, color: "text-yellow-500" },
          { label: "Échoués", value: `${paiements.filter(p => p.status === "failed").reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}€`, color: "text-secondary" },
          { label: "Remboursés", value: `${paiements.filter(p => p.status === "refunded").reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}€`, color: "text-blue-500" }
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-4 rounded-lg border border-white/5">
            <p className="text-on-surface-variant text-xs uppercase font-bold">{stat.label}</p>
            <p className={`text-2xl font-headline mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Chargement...</div>
      ) : paiements.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">Aucun paiement trouvé</div>
      ) : (
        <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase">Réservation</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase">Méthode</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((paiement) => (
                  <tr key={paiement.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm">#{paiement.id}</td>
                    <td className="px-6 py-4 text-sm">#Res-{paiement.reservation_id}</td>
                    <td className="px-6 py-4 text-sm font-bold">{paiement.amount}€</td>
                    <td className="px-6 py-4 text-sm">{paiement.payment_method}</td>
                    <td className="px-6 py-4 text-sm">{new Date(paiement.payment_date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBg(paiement.status)} ${getStatusColor(paiement.status)}`}>
                        {statusOptions.find(s => s.value === paiement.status)?.label || paiement.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => setSelectedPaiement(paiement)}
                        className="p-2 hover:bg-white/10 rounded text-primary transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <div className="relative group">
                        <button className="p-2 hover:bg-white/10 rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-surface-variant border border-white/10 rounded shadow-lg p-2 hidden group-hover:block w-40 z-10">
                          {statusOptions.map(status => (
                            <button
                              key={status.value}
                              onClick={() => {
                                if (paiement.id) {
                                  handleStatusChange(paiement.id, status.value);
                                }
                              }}
                              className="block w-full text-left px-3 py-2 text-xs hover:bg-white/10 rounded"
                            >
                              {status.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPaiement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedPaiement(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-surface p-8 rounded-xl border border-white/5 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-headline mb-6">Détails du Paiement</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant">ID Paiement</p>
                <p className="text-lg">{selectedPaiement.id}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant">ID Réservation</p>
                <p className="text-lg">{selectedPaiement.reservation_id}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant">Montant</p>
                <p className="text-lg font-bold text-primary">{selectedPaiement.amount}€</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant">Méthode</p>
                <p className="text-lg">{selectedPaiement.payment_method}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant">Date</p>
                <p className="text-lg">{new Date(selectedPaiement.payment_date).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant">Statut</p>
                <p className={`text-lg font-bold ${getStatusColor(selectedPaiement.status)}`}>
                  {statusOptions.find(s => s.value === selectedPaiement.status)?.label}
                </p>
              </div>
              {selectedPaiement.transaction_id && (
                <div className="col-span-2">
                  <p className="text-xs font-bold uppercase text-on-surface-variant">ID Transaction</p>
                  <p className="text-sm font-mono">{selectedPaiement.transaction_id}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedPaiement(null)}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg font-bold uppercase text-xs"
            >
              Fermer
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
