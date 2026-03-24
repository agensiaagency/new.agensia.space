import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Bildende Künstlerin',
      color: '#c4a850',
      quote: 'Meine neue Website fängt genau die Stimmung meiner Kunstwerke ein. Seit dem Launch habe ich deutlich mehr Anfragen von Galerien erhalten.'
    },
    {
      name: 'Dr. Thomas K.',
      role: 'Physiotherapeut',
      color: '#9b2020',
      quote: 'Die Online-Terminbuchung hat unseren Praxisalltag revolutioniert. Das Design strahlt genau das Vertrauen aus, das wir uns gewünscht haben.'
    },
    {
      name: 'Julia P.',
      role: 'Psychotherapeutin',
      color: '#7040a0',
      quote: 'agensia hat es geschafft, eine Website zu bauen, die professionell und gleichzeitig nahbar wirkt. Perfekt für die Klientengewinnung.'
    }
  ];

  return (
    <section className="relative py-24 px-6 bg-transparent overflow-visible">
      <div className="absolute inset-0 grid-bg opacity-40" style={{ '--grid-color': '#1a1f1c', '--grid-size': '60px' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-[#edf0f7] text-center mb-16"
        >
          Das sagen unsere Kunden
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[rgba(12,14,20,0.55)] border border-[rgba(255,255,255,0.06)] p-8 rounded-sm transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_0_24px_rgba(196,168,80,0.15)]"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={18} className="fill-[#c4a850] text-[#c4a850]" />
                ))}
              </div>
              <p className="italic text-[#a8b0c5] mb-8 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[#0a0f0d] font-serif text-xl"
                  style={{ backgroundColor: t.color }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-[#edf0f7]">{t.name}</div>
                  <div className="text-sm text-[#a8b0c5]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}