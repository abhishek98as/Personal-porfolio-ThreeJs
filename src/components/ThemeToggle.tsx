import { useEffect, useState } from 'react';
import { useUI } from '../store/useUI';

export default function ThemeToggle() {
  const { theme, setTheme } = useUI();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () => {
    setIsAnimating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 600);
  };

  const isDark = theme === 'dark';

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggle}
      className="fixed top-4 right-4 z-50 group focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg rounded-full"
    >
      {/* Interactive SVG Toggle */}
      <div className="relative w-12 h-12 transition-all duration-300 hover:scale-110 active:scale-95">
        <svg
          width="48"
          height="48"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop 
                stopColor={isDark ? "#232E52" : "#FFE5B4"} 
                className="transition-all duration-500"
              />
              <stop 
                offset="1" 
                stopColor={isDark ? "#07090F" : "#87CEEB"} 
                className="transition-all duration-500"
              />
            </linearGradient>
            
            {/* Glow Filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main Background */}
          <rect 
            width="100" 
            height="100" 
            rx="50" 
            fill="url(#bgGradient)"
            className="transition-all duration-500"
          />
          
          {/* Stars for Night Mode */}
          {isDark && (
            <g className="opacity-80">
              <circle cx="20" cy="25" r="1" fill="#FFD700" className="animate-pulse">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="85" cy="30" r="0.8" fill="#FFD700" className="animate-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="15" cy="75" r="0.6" fill="#FFD700" className="animate-pulse">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="80" cy="80" r="0.7" fill="#FFD700" className="animate-pulse">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite"/>
              </circle>
            </g>
          )}
          
          {/* Night Mode - Moon */}
          <g 
            className={`transition-all duration-500 ${
              isDark ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: isDark ? 'translateX(0)' : 'translateX(-20px)',
            }}
          >
            <circle cx="30" cy="50" r="11" fill="#F4F4F4" filter="url(#glow)"/>
            <circle cx="33" cy="46" r="9" fill="#1e293b"/>
            {/* Moon craters */}
            <circle cx="28" cy="48" r="1.5" fill="#e2e8f0" opacity="0.6"/>
            <circle cx="32" cy="52" r="1" fill="#e2e8f0" opacity="0.4"/>
          </g>
          
          {/* Day Mode - Sun */}
          <g 
            className={`transition-all duration-500 ${
              !isDark ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: !isDark ? 'translateX(0)' : 'translateX(20px)',
            }}
          >
            <circle cx="70" cy="50" r="11" fill="#FFD23F" filter="url(#glow)">
              {!isDark && (
                <animate attributeName="r" values="11;12;11" dur="2s" repeatCount="indefinite"/>
              )}
            </circle>
            
            {/* Sun Rays */}
            <g className={isAnimating ? 'animate-spin' : ''}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <line
                  key={angle}
                  x1={70 + Math.cos((angle * Math.PI) / 180) * 16}
                  y1={50 + Math.sin((angle * Math.PI) / 180) * 16}
                  x2={70 + Math.cos((angle * Math.PI) / 180) * 20}
                  y2={50 + Math.sin((angle * Math.PI) / 180) * 20}
                  stroke="#FFA500"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={!isDark ? 0.8 : 0}
                  className="transition-opacity duration-500"
                >
                  {!isDark && (
                    <animate 
                      attributeName="opacity" 
                      values="0.4;1;0.4" 
                      dur={`${1.5 + index * 0.1}s`} 
                      repeatCount="indefinite"
                    />
                  )}
                </line>
              ))}
            </g>
          </g>
          
          {/* Toggle Slider Background */}
          <rect 
            x="15" 
            y="42" 
            width="70" 
            height="16" 
            rx="8" 
            fill={isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(251, 191, 36, 0.3)"}
            stroke={isDark ? "#3b82f6" : "#fbbf24"}
            strokeWidth="1"
            className="transition-all duration-300"
          />
          
          {/* Toggle Slider */}
          <circle 
            cx={isDark ? 25 : 75} 
            cy="50" 
            r="6" 
            fill={isDark ? "#3b82f6" : "#fbbf24"}
            className="transition-all duration-500 ease-out filter drop-shadow-md"
          />
          
          {/* Hover Effect Ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="none" 
            stroke={isDark ? "#6ee7ff" : "#fbbf24"}
            strokeWidth="2" 
            opacity="0"
            className="group-hover:opacity-30 transition-opacity duration-300"
          />
        </svg>
      </div>
    </button>
  );
}