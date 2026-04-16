import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAppartement, Appartement } from "../services/appartements";

export default function AppartementPage() {
  const { slug } = useParams<{ slug: string }>();
  const [appartement, setAppartement] = useState<Appartement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/appartements/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Appartement non trouvé");
        return res.json();
      })
      .then((data) => setAppartement(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-24 text-center">Chargement...</div>;
  if (error) return <div className="py-24 text-center text-red-500">{error}</div>;
  if (!appartement) return <div className="py-24 text-center">Appartement introuvable</div>;

  return (
    <section className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">{appartement.titre_fr}</h1>
      <div className="mb-6 text-lg text-on-surface-variant">{appartement.description_fr}</div>
      <div className="mb-6">Capacité: {appartement.capacite} personnes</div>
      <div className="mb-6">Prix/nuit: {appartement.prix_nuit} FCFA</div>
      {appartement.equipements && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Équipements</h2>
          <ul className="list-disc ml-6">
            {appartement.equipements.map((eq, i) => (
              <li key={i}>{Object.values(eq).join(", ")}</li>
            ))}
          </ul>
        </div>
      )}
      {appartement.photos && appartement.photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {appartement.photos.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Photo ${i + 1}`}
              className="rounded-lg shadow object-cover w-full h-64"
            />
          ))}
        </div>
      )}
    </section>
  );
}
