import { MutableRefObject, useEffect, useRef, useCallback } from 'react';

type Options = {
  wheelMultiplier?: number;
  damping?: number;
  enabled?: boolean;
};

export function useSmoothScroll(
  containerRef: MutableRefObject<HTMLElement | null>,
  { wheelMultiplier = 0.8, damping = 0.12, enabled = true }: Options = {}
) {
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    isAnimatingRef.current = false;
  }, []);

  const animate = useCallback(() => {
    const el = containerRef.current;
    if (!el) {
      stopAnimation();
      return;
    }

    const current = currentRef.current;
    const target = targetRef.current;
    const diff = target - current;

    // Use a tighter threshold and simpler easing
    if (Math.abs(diff) < 0.1) {
      el.scrollTop = target;
      currentRef.current = target;
      stopAnimation();
      return;
    }

    const next = current + diff * damping;
    currentRef.current = next;
    el.scrollTop = next;

    rafRef.current = requestAnimationFrame(animate);
  }, [containerRef, damping, stopAnimation]);

  const startAnimation = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    if (!enabled || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const el = containerRef.current;
    if (!el) return;

    // Initialize refs
    targetRef.current = el.scrollTop;
    currentRef.current = el.scrollTop;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Simple, efficient delta normalization
      const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 100);
      const step = delta * wheelMultiplier;
      const maxScroll = el.scrollHeight - el.clientHeight;
      
      targetRef.current = Math.max(0, Math.min(maxScroll, targetRef.current + step));
      startAnimation();
    };

    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
      stopAnimation();
    };
  }, [containerRef, enabled, wheelMultiplier, startAnimation, stopAnimation]);
}
