
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, PenTool, MessageSquare, Rocket } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Formular',
      desc: 'Beantworte ein paar gezielte Fragen zu deinem Business und deinen Zielen.',
      color: '#3d6145' // Grün
    },
    {
      icon: PenTool,
      title: 'Design',
      desc: 'Wir erstellen ein maßgeschneidertes Konzept, das zu deiner Marke passt.',
      color: '#7040a0' // Violett
    },
    {
      icon: MessageSquare,
      title: 'Feedback',
      desc: 'Du prüfst den Entwurf und wir verfeinern ihn bis zur Perfektion.',
      color: '#2a6db5' // Blau
    },
    {
      icon: Rocket,
      title: 'Launch',
      desc: 'Deine neue Website geht live und ist bereit, Kunden zu gewinnen.',
      color: '#9b2020' // Rot
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 px-6 bg-transparent overflow-visible">
      <div className="absolute inset-0 grid-bg opacity-40" style={{ '--grid-color': '#1a1f1c', '--grid-size': '60px' }} />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-serif text-[#e8e4df] mb-6"
          >
            So funktioniert's
          </motion.h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-[rgba(255,255,255,0.05)]" />
          <div className="md:hidden absolute top-0 left-12 w-px h-full bg-[rgba(255,255,255,0.05)]" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-8 group relative"
              >
                <div 
                  className="absolute top-0 left-0 md:left-1/2 md:-translate-x-1/2 w-[200px] h-[200px] rounded-full filter blur-[60px] opacity-15 pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
                  style={{ backgroundColor: step.color, transform: 'translate(-25%, -25%)' }}
                />

                <div className="relative shrink-0 z-10">
                  <div 
                    className="w-24 h-24 bg-[rgba(16,21,18,0.8)] border rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-105"
                    style={{ 
                      borderColor: `${step.color}40`, 
                      color: '#e8e4df',
                      boxShadow: `0 0 20px ${step.color}40`
                    }}
                  >
                    <step.icon size={32} />
                  </div>
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm shadow-md text-[#0a0f0d]"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="md:text-center pt-4 md:pt-0 z-10">
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
