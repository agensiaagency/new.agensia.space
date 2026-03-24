
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useCursorGlow } from '@/hooks/useCursorGlow';

const Blob = ({ color, initX, initY, delay, duration, mousePos, isTouch }) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(cx - mousePos.x, cy - mousePos.y);
    
    setScale(dist < 300 ? 1.15 : 1);
  }, [mousePos.x, mousePos.y, isTouch]);

  return (
    <motion.div
      ref={ref}
      className="absolute rounded-full mix-blend-screen filter blur-[80px] pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        width: '40vw',
        height: '40vw',
        minWidth: '300px',
        minHeight: '300px',
        left: initX,
        top: initY,
        opacity: 0.12,
        transform: 'translate(-50%, -50%)'
      }}
      animate={{
        x: ['-10%', '10%', '-5%', '15%', '-10%'],
        y: ['-10%', '5%', '15%', '-5%', '-10%'],
        scale: scale
      }}
      transition={{
        x: { duration, repeat: Infinity, ease: "easeInOut", delay },
        y: { duration: duration * 1.1, repeat: Infinity, ease: "easeInOut", delay },
        scale: { duration: 0.3, ease: "easeOut" }
      }}
    />
  );
};

export default function HeroSection() {
  const { x, y, color: glowColor, isTouch } = useCursorGlow();
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    const text = "agensia";
    let currentIndex = 0;
    let timeoutId;

    const typeNextLetter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        const nextDelay = Math.random() * 200 + 80; // 80ms to 280ms
        timeoutId = setTimeout(typeNextLetter, nextDelay);
      } else {
        setIsTypingDone(true);
      }
    };

    timeoutId = setTimeout(typeNextLetter, 800);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isTypingDone) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, [isTypingDone]);

  const blobs = [
    { color: '#3d6145', initX: '20%', initY: '30%', delay: 0, duration: 25 },
    { color: '#9b2020', initX: '80%', initY: '40%', delay: -5, duration: 28 },
    { color: '#7040a0', initX: '50%', initY: '60%', delay: -10, duration: 22 },
    { color: '#c4a850', initX: '30%', initY: '70%', delay: -15, duration: 26 },
    { color: '#2a6db5', initX: '70%', initY: '20%', delay: -20, duration: 24 },
  ];

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-visible bg-transparent">
      <div className="absolute inset-0 grid-bg opacity-40" style={{ '--grid-color': '#1a1f1c', '--grid-size': '60px' }} />

      {blobs.map((blob, i) => (
        <Blob key={i} {...blob} mousePos={{ x, y }} isTouch={isTouch} />
      ))}

      {!isTouch && (
        <motion.div
          className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-10 mix-blend-screen filter blur-[100px]"
          animate={{
            x: x - 200,
            y: y - 200,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            opacity: 0.15
          }}
          transition={{
            x: { type: "spring", stiffness: 150, damping: 25, mass: 0.5 },
            y: { type: "spring", stiffness: 150, damping: 25, mass: 0.5 },
            background: { duration: 1 }
          }}
        />
      )}

      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 60%)' }} />
             
        <div data-animate className="relative p-12 md:p-24">
          <h1 className="font-serif text-[#e8e4df] lowercase leading-none m-0 text-center flex items-center justify-center" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}>
            {displayedText}
            <span className={`transition-opacity duration-100 ${!isTypingDone || showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
          </h1>
          <div 
            className="absolute bottom-8 md:bottom-16 right-[10%] md:right-[15%] font-sans text-[#e8e4df] tracking-[0.15em] uppercase opacity-60"
            style={{ fontSize: 'clamp(0.6rem, 1vw, 0.9rem)' }}
          >
            built to grow
          </div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#e8e4df] opacity-50 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  );
}
