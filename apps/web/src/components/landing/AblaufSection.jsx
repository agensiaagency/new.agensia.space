import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, PenTool, MessageSquare, Rocket } from 'lucide-react';
import GridBackgroundPattern from '../GridBackgroundPattern';

export default function AblaufSection() {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Formular',
      desc: 'Beantworte ein paar gezielte Fragen zu deinem Business und deinen Zielen.'
    },
    {
      icon: PenTool,
      title: 'Design',
      desc: 'Wir erstellen ein maßgeschneidertes Konzept, das zu deiner Marke passt.'
    },
    {
      icon: MessageSquare,
      title: 'Feedback',
      desc: 'Du prüfst den Entwurf und wir verfeinern ihn bis zur Perfektion.'
    },
    {
      icon: Rocket,
      title: 'Launch',
      desc: 'Deine neue Website geht live und ist bereit, Kunden zu gewinnen.'
    }
  ];

  return (
    <section id="ablauf" className="relative py-24 px-6 bg-[#0a0f0d] border-y border-[rgba(255,255,255,0.06)] overflow-hidden">
      <GridBackgroundPattern opacity={0.08} />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-[#e8e4df] mb-4"
          >
            So funktioniert's
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#888888]"
          >
            Ein transparenter und effizienter Prozess von der ersten Idee bis zum Go-Live.
          </motion.p>
        </div>

        <div className="relative">
          {/* Horizontal line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-[rgba(255,255,255,0.06)]" />
          {/* Vertical line for mobile */}
          <div className="md:hidden absolute top-0 left-12 w-px h-full bg-[rgba(255,255,255,0.06)]" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-8"
              >
                <div className="relative shrink-0">
                  <div className="w-24 h-24 bg-[rgba(16,21,18,0.8)] border border-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center text-[#e8e4df] shadow-lg backdrop-blur-sm">
                    <step.icon size={32} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#e8e4df] text-[#0a0f0d] rounded-full flex items-center justify-center font-sans font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                </div>
                <div className="md:text-center pt-4 md:pt-0">
                  <h3 className="text-2xl font-serif text-[#e8e4df] mb-3">{step.title}</h3>
                  <p className="text-[#888888] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}