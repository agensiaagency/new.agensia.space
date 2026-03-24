
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CTABannerSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 px-6 bg-[#08090d] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4a850]/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-serif text-[#edf0f7] mb-6"
        >
          Bereit für deine Website?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[#a8b0c5] mb-10"
        >
          Lass uns gemeinsam deine Vision umsetzen.
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/intake')}
          className="px-10 py-5 text-lg text-[#08090d] rounded-sm shadow-xl font-medium hover:brightness-110 hover:-translate-y-1 transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #d4a850, #e0c070)' }}
        >
          Jetzt starten →
        </motion.button>
      </div>
    </section>
  );
}
