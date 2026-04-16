import { motion } from "motion/react";
import { Wifi, Wind, Shield, Car, UserCheck, Sparkles } from "lucide-react";

const SERVICES = [
  { icon: Wifi, title: "Fibre Optique High-Speed" },
  { icon: Wind, title: "Climatisation Optimisée" },
  {
    icon: Shield,
    title: "Sécurité 24/7",
    desc: "Systèmes biométriques & Surveillance active",
    large: true,
  },
  { icon: Car, title: "Parking Sécurisé" },
  { icon: Sparkles, title: "Service de Ménage Quotidien", span: 2 },
  { icon: UserCheck, title: "Conciergerie Dédiée" },
];

export default function Services() {
  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-headline text-4xl text-center mb-20 text-on-surface tracking-tight italic">
          Services Exclusifs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-surface-container p-12 flex flex-col items-center text-center justify-center border border-white/5 ${
                service.large ? "md:row-span-2" : ""
              } ${service.span === 2 ? "col-span-2" : ""}`}
            >
              <service.icon className="text-secondary w-10 h-10 mb-6" />
              <h4 className="font-label text-[10px] tracking-widest uppercase text-on-surface">
                {service.title}
              </h4>
              {service.desc && (
                <p className="text-[8px] text-on-surface-variant mt-4 font-light uppercase tracking-widest">
                  {service.desc}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
