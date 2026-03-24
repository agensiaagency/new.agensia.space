import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Heart, Brain } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Kreative & Künstler',
      icon: Palette,
      color: '#d4a850',
      shadow: 'rgba(212,168,80,0.35)',
      desc: 'Atemberaubende Portfolios, die deine Werke in den Mittelpunkt stellen und Galerien sowie Kunden überzeugen.'
    },
    {
      title: 'Therapeuten & Trainer',
      icon: Heart,
      color: '#9b2020',
      shadow: 'rgba(155,32,32,0.35)',
      desc: 'Vertrauensvolle Praxis-Websites, die Patienten anziehen und die Terminbuchung nahtlos integrieren.'
    },
    {
      title: 'Therapeuten & Coaches',
      icon: Brain,
      color: '#7040a0',
      shadow: 'rgba(112,64,160,0.35)',
      desc: 'Professionelle Auftritte für Coaches und Psychotherapeuten, die Expertise zeigen und Hemmschwellen abbauen.'
    }
  ];

  return (
    <section id="leistungen" className="pt-[120px] pb-[80px] px-6 mb-[80px] max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-[#edf0f7] mb-4"
        >
          Für wen wir bauen
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#a8b0c5]"
        >
          Spezialisierte Lösungen für Branchen, in denen Vertrauen und Ästhetik zählen.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-[rgba(12,14,20,0.55)] p-10 border border-[rgba(255,255,255,0.06)] border-t-4 rounded-[20px] transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(255,255,255,0.15)] group"
            style={{ borderTopColor: service.color }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 24px ${service.shadow}`}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-[#08090d] border border-[rgba(255,255,255,0.06)] rounded-[12px] mb-6">
              <service.icon size={24} color={service.color} />
            </div>
            <h3 className="text-[20px] md:text-[22px] font-serif mb-[24px] text-[#edf0f7]">
              {service.title}
            </h3>
            <p className="text-[#a8b0c5] font-sans leading-relaxed">
              {service.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}