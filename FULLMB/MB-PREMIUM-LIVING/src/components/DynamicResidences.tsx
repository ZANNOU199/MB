import { useAppartements } from "../hooks/useAppartements";
import Residences from "./Residences";
import { motion } from "motion/react";

export default function DynamicResidences() {
  const { appartements, loading, error } = useAppartements();

  if (loading) {
    return (
      <section className="relative py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full"
          />
          <p className="mt-4 text-on-surface-variant">Chargement des appartements...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">Erreur: {error}</p>
        </div>
      </section>
    );
  }

  // Si pas de données, fallback sur la version statique
  if (appartements.length === 0) {
    return <Residences />;
  }

  return <Residences appartements={appartements} />;
}
