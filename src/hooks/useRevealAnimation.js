import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useRevealAnimation() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px', threshold: 0.1 });

    // Find all elements with data-animate that haven't been revealed yet
    const elements = document.querySelectorAll('[data-animate]:not(.revealed)');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]); // Re-run when route changes to catch new elements
}