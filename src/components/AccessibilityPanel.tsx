import { useEffect } from 'react';
import { useUI } from '../store/useUI';

export default function AccessibilityPanel() {
  const { theme, setTheme, reducedMotion, toggleReducedMotion, fontScale, setFontScale } = useUI();

  useEffect(() => {
    document.documentElement.style.setProperty('font-size', `${fontScale * 100}%`);
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    document.documentElement.dataset.theme = theme;
  }, [theme, reducedMotion, fontScale]);

  return (
    <div className="fixed left-4 bottom-4 z-50 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-white/80">
        <span>Theme</span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
          className="bg-white/10 border border-white/20 rounded px-2 py-1"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <span>Font</span>
        <input
          type="range"
          min={0.9}
          max={1.3}
          step={0.05}
          value={fontScale}
          onChange={(e) => setFontScale(Number(e.target.value))}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={reducedMotion} onChange={toggleReducedMotion} />
        <span>Reduced motion</span>
      </label>
    </div>
  );
}
