import { useState, useEffect } from 'react';

const DEFAULT_COLORS = ['#3d6145', '#9b2020', '#7040a0', '#b8960c', '#2a6db5'];

export function useColorCycle(colors = DEFAULT_COLORS, intervalMs = 4000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!colors || colors.length <= 1) return;
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % colors.length);
    }, intervalMs);
    
    return () => clearInterval(timer);
  }, [colors, intervalMs]);

  return colors[index];
}