
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Share2, X, ImagePlus, Check, Circle, Wifi, Wind, Tv, Coffee, UtensilsCrossed, Briefcase, ShowerHead, Bath, BedDouble, ShieldCheck, Car, Key, Baby, Thermometer, Zap, UserCheck, Sparkles, Calendar, Microwave, Refrigerator, WashingMachine } from 'lucide-react';
import { useAppartements } from '../../hooks/useAppartements';
import { fetchAppartements as fetchAppartementsApi } from '../../services/appartements';
import { Appartement, createAppartement, updateAppartement, deleteAppartement } from '../../services/appartements';

const ICON_OPTIONS = [
  { label: 'Wifi', value: 'Wifi' },
  { label: 'Climatisation', value: 'Wind' },
  { label: 'TV', value: 'Tv' },
  { label: 'Café', value: 'Coffee' },
  { label: 'Cuisine', value: 'UtensilsCrossed' },
  { label: 'Bureau', value: 'Briefcase' },
  { label: 'Douche', value: 'ShowerHead' },
  { label: 'Baignoire', value: 'Bath' },
  { label: 'Lit', value: 'BedDouble' },
  { label: 'Sécurité', value: 'ShieldCheck' },
  { label: 'Parking', value: 'Car' },
  { label: 'Entrée', value: 'Key' },
  { label: 'Bébé', value: 'Baby' },
  { label: 'Chauffage', value: 'Thermometer' },
  { label: 'Sèche-cheveux', value: 'Zap' },
  { label: 'Arrivée autonome', value: 'UserCheck' },
  { label: 'Ménage', value: 'Sparkles' },
  { label: 'Longue durée', value: 'Calendar' },
  { label: 'Micro-ondes', value: 'Microwave' },
  { label: 'Réfrigérateur', value: 'Refrigerator' },
  { label: 'Lave-linge', value: 'WashingMachine' },
  { label: 'Autre', value: 'Circle' },
];

type EquipementItem = { label: string; icon: string };
type AppartementForm = Omit<Appartement, 'equipements'> & { equipements: EquipementItem[]; photos: string[] };

export default function AppartementsAdmin() {
  const { appartements, loading, error } = useAppartements();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AppartementForm>>({
    equipements: [],
    photos: [],
    statut: 'actif',
    smoobu_id: null,
  });
  const [equipementIcon, setEquipementIcon] = useState('Wifi');
  const [showForm, setShowForm] = useState(false);
  const [equipementInput, setEquipementInput] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [appartementsList, setAppartementsList] = useState(appartements);
  const [loadingList, setLoadingList] = useState(false);

  // Handle edit
  const handleEdit = (apt: Appartement) => {
    setFormData({
      ...apt,
      equipements: Array.isArray(apt.equipements)
        ? (apt.equipements as any[]).map((e) =>
            typeof e === 'string'
              ? { label: e, icon: 'Circle' }
              : { label: e.label || '', icon: e.icon || 'Circle' }
          )
        : [],
      photos: apt.photos || [],
      smoobu_id: null, // toujours null côté client
    } as Partial<AppartementForm>);
    setEditingId(apt.id);
    setPhotoPreviews(apt.photos || []);
    setPhotoFiles([]);
    setShowForm(true);
  };

  // Handle save
  const handleSave = async () => {
    try {
      let dataToSend: any = { ...formData };
      // Génère le slug automatiquement à partir du titre_fr
      if (formData.titre_fr) {
        dataToSend.slug = formData.titre_fr
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      // Cache smoobu_id côté client
      dataToSend.smoobu_id = null;
      // Nettoie les équipements vides et force un tableau
      if (!Array.isArray(dataToSend.equipements)) {
        dataToSend.equipements = [];
      } else {
        dataToSend.equipements = dataToSend.equipements.filter((e: any) => e.label && e.label.trim() !== '');
      }
      // Ajoute les fichiers images réels
      if (photoFiles.length > 0) {
        dataToSend.photos = photoFiles;
      }
      if (editingId) {
        await updateAppartement(editingId, dataToSend);
      } else {
        await createAppartement(dataToSend);
      }
      setShowForm(false);
      setFormData({ equipements: [], photos: [], statut: 'actif', smoobu_id: null });
      setEditingId(null);
      setPhotoFiles([]);
      setPhotoPreviews([]);
      // Rafraîchir la liste sans reload
      setLoadingList(true);
      const newList = await fetchAppartementsApi();
      setAppartementsList(newList);
      setLoadingList(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet appartement ?')) {
      try {
        await deleteAppartement(id);
        setLoadingList(true);
        const newList = await fetchAppartementsApi();
        setAppartementsList(newList);
        setLoadingList(false);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };


  // Handle photo upload (base64 preview)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles(files);
    // Génère les previews en base64
    const readers: Promise<string>[] = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((base64s) => {
      setPhotoPreviews([...(formData.photos || []), ...base64s]);
    });
  };

  // Remove photo
  const removePhoto = (idx: number) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
    setFormData((prev) => ({ ...prev, photos: (prev.photos || []).filter((_, i) => i !== idx) }));
  };

  // Add equipement
  const addEquipement = () => {
    if (equipementInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        equipements: [
          ...((prev.equipements ?? []) as EquipementItem[]),
          { label: equipementInput.trim(), icon: equipementIcon },
        ],
      }));
      setEquipementInput('');
      setEquipementIcon('Wifi');
    }
  };

  // Remove equipement
  const removeEquipement = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      equipements: ((prev.equipements ?? []) as EquipementItem[]).filter((_, i) => i !== idx),
    }));
  };

  // Rafraîchir la liste au premier rendu
  useEffect(() => {
    setAppartementsList(appartements);
  }, [appartements]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline">Gestion des Appartements</h2>
        <button
          onClick={() => {
            setFormData({ equipements: [], photos: [] });
            setEditingId(null);
            setShowForm(true);
            setPhotoFiles([]);
            setPhotoPreviews([]);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {loading || loadingList ? (
        <p className="text-on-surface-variant">Chargement...</p>
      ) : error ? (
        <p className="text-red-500">Erreur: {error}</p>
      ) : (
        <div className="grid gap-4">
          {appartementsList.map((apt) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-low p-4 rounded-lg border border-white/5 flex items-center justify-between"
            >
              <div>
                <h3 className="font-headline">{apt.titre_fr}</h3>
                <p className="text-sm text-on-surface-variant">{apt.description_fr?.substring(0, 100)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(apt)}
                  className="p-2 hover:bg-white/5 rounded text-secondary"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(apt.id)}
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
          className="bg-surface-container-low p-4 md:p-6 rounded-lg border border-white/5 max-w-2xl mx-auto w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="font-headline">{editingId ? 'Modifier' : 'Ajouter'} un appartement</h3>
            <button onClick={() => setShowForm(false)} className="p-2 rounded hover:bg-white/10">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Titre FR"
                value={formData.titre_fr || ''}
                onChange={(e) => {
                  const titre_fr = e.target.value;
                  // Génère le slug dynamiquement
                  const slug = titre_fr
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-+|-+$/g, '');
                  setFormData({ ...formData, titre_fr, slug });
                }}
                className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
              />
              <input
                type="text"
                placeholder="Titre EN"
                value={formData.titre_en || ''}
                onChange={(e) => setFormData({ ...formData, titre_en: e.target.value })}
                className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
              />
              {/* Slug caché */}
              <input
                type="hidden"
                value={formData.slug || ''}
                readOnly
              />
              <textarea
                placeholder="Description FR"
                value={formData.description_fr || ''}
                onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface h-20"
              />
              <textarea
                placeholder="Description EN"
                value={formData.description_en || ''}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface h-20"
              />
              <input
                type="number"
                min={1}
                placeholder="Capacité"
                value={formData.capacite || ''}
                onChange={(e) => setFormData({ ...formData, capacite: Number(e.target.value) })}
                className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
              />
              <input
                type="number"
                min={0}
                placeholder="Prix par nuit (FCFA)"
                value={formData.prix_nuit || ''}
                onChange={(e) => setFormData({ ...formData, prix_nuit: Number(e.target.value) })}
                className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
              />
              {/* Select statut */}
              <select
                value={formData.statut || 'actif'}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
              <input
                type="text"
                placeholder="Type (ex: studio, suite...)"
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-on-surface"
              />
              {/* Smoobu ID caché */}
              <input type="hidden" value={formData.smoobu_id || ''} readOnly />
            </div>
            <div className="space-y-3">
              {/* Equipements */}
              <div>
                <label className="block text-xs font-bold mb-1">Équipements</label>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ajouter un équipement"
                    value={equipementInput}
                    onChange={(e) => setEquipementInput(e.target.value)}
                    className="flex-1 bg-surface border border-white/10 rounded px-3 py-2 text-on-surface min-w-0"
                  />
                  <select
                    value={equipementIcon}
                    onChange={(e) => setEquipementIcon(e.target.value)}
                    className="bg-surface border border-white/10 rounded px-2 py-2 text-on-surface"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button type="button" onClick={addEquipement} className="bg-primary text-white px-3 rounded hover:opacity-80 w-full sm:w-auto flex justify-center items-center">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.equipements ?? []).map((eq, idx) => (
                    <span key={idx + '-' + String(eq.label) + '-' + String(eq.icon)} className="bg-secondary/20 text-secondary px-2 py-1 rounded flex items-center gap-1 text-xs">
                      {/* Affiche l'icône Lucide choisie */}
                      {eq.icon === 'Wifi' && <Wifi size={14} />}
                      {eq.icon === 'Wind' && <Wind size={14} />}
                      {eq.icon === 'Tv' && <Tv size={14} />}
                      {eq.icon === 'Coffee' && <Coffee size={14} />}
                      {eq.icon === 'UtensilsCrossed' && <UtensilsCrossed size={14} />}
                      {eq.icon === 'Briefcase' && <Briefcase size={14} />}
                      {eq.icon === 'ShowerHead' && <ShowerHead size={14} />}
                      {eq.icon === 'Bath' && <Bath size={14} />}
                      {eq.icon === 'BedDouble' && <BedDouble size={14} />}
                      {eq.icon === 'ShieldCheck' && <ShieldCheck size={14} />}
                      {eq.icon === 'Car' && <Car size={14} />}
                      {eq.icon === 'Key' && <Key size={14} />}
                      {eq.icon === 'Baby' && <Baby size={14} />}
                      {eq.icon === 'Thermometer' && <Thermometer size={14} />}
                      {eq.icon === 'Zap' && <Zap size={14} />}
                      {eq.icon === 'UserCheck' && <UserCheck size={14} />}
                      {eq.icon === 'Sparkles' && <Sparkles size={14} />}
                      {eq.icon === 'Calendar' && <Calendar size={14} />}
                      {eq.icon === 'Microwave' && <Microwave size={14} />}
                      {eq.icon === 'Refrigerator' && <Refrigerator size={14} />}
                      {eq.icon === 'WashingMachine' && <WashingMachine size={14} />}
                      {eq.icon === 'Circle' && <Circle size={14} />}
                      {eq.label}
                      <button type="button" onClick={() => removeEquipement(idx)} className="ml-1 text-secondary hover:text-red-500"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
              {/* Photos */}
              <div>
                <label className="block text-xs font-bold mb-1">Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-xs text-on-surface border border-white/10 rounded bg-surface file:bg-primary file:text-white file:rounded file:px-3 file:py-2 file:border-0 file:mr-2"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {photoPreviews.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border border-white/10">
                      <img src={url} alt="photo" className="object-cover w-full h-full" />
                      <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-red-500">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-80 flex items-center gap-2"
            >
              <Check size={16} /> Enregistrer
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-white/10 text-on-surface px-4 py-2 rounded-lg hover:bg-white/20"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
