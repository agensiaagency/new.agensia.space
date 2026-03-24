import { useState, useEffect, useRef } from 'react';
import { useColorCycle } from './useColorCycle';

export function useCursorGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isTouch, setIsTouch] = useState(false);
  const color = useColorCycle();
  const rafRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const updatePos = (e) => {
      if (rafRef.current) return; // Throttle: wait for next frame
      
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        // Update CSS variables for global access (e.g., GridBackgroundPattern)
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
        rafRef.current = null;
      });
    };

    // Use passive listener for better scroll/interaction performance
    window.addEventListener('mousemove', updatePos, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', updatePos);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { ...pos, color, isTouch };
}