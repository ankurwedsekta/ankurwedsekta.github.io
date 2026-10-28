import {useLayoutEffect, useRef, useState} from 'react';

export function useElementSize<T extends Element>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({width: 0, height: 0});
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect;
      setSize((s) => (Math.abs(s.width - width) < 0.5 && Math.abs(s.height - height) < 0.5 ? s : {width, height}));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export function useFinePointer() {
  const [fine] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  return fine;
}
