import { useEffect, useRef } from "react";

export function useScrollAnimation(delay = 0, animation = "fade-up") {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add animation classes when element enters viewport
          entry.target.style.animation = `${animation} 0.8s cubic-bezier(0.33, 0.66, 0.66, 1) forwards`;
          entry.target.style.animationDelay = `${delay}ms`;
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, animation]);

  return ref;
}
