import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { skillsData, Skill } from '../data/resumeData';

function Globe({ skills, onClick }: { skills: Skill[]; onClick: (s: Skill) => void }) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    // Fibonacci sphere for uniform point distribution
    const pts: Array<{ position: [number, number, number]; skill: Skill }> = [];
    const N = skills.length;
    const phi = Math.PI * (3 - Math.sqrt(5));
    const radius = 1.8;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; // from 1 to -1
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      pts.push({ position: [x * radius, y * radius, z * radius], skill: skills[i] });
    }
    return pts;
  }, [skills]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.1;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'backend': return '#3b82f6'; // blue
      case 'frontend': return '#10b981'; // green
      case 'database': return '#f59e0b'; // amber
      case 'devops': return '#ef4444'; // red
      case 'tools': return '#8b5cf6'; // purple
      case 'soft': return '#06b6d4'; // cyan
      default: return '#60a5fa';
    }
  };

  return (
    <group ref={group}>
      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshStandardMaterial color="#1e293b" wireframe opacity={0.15} transparent />
      </mesh>
      
      {/* Skill nodes */}
      {positions.map(({ position, skill }) => (
        <group key={skill.name} position={position}>
          <mesh>
            <sphereGeometry args={[0.05 + skill.level * 0.025, 16, 16]} />
            <meshStandardMaterial 
              color={getCategoryColor(skill.category)} 
              emissive={getCategoryColor(skill.category)}
              emissiveIntensity={0.2}
            />
          </mesh>
          <Html center>
            <button
              className="text-xs px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 hover:border-cyan-300/60 hover:bg-black/90 transition-all duration-200 text-white font-medium shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onClick(skill);
              }}
              style={{
                textShadow: '0 0 10px rgba(0,0,0,0.8)',
                minWidth: '60px'
              }}
            >
              {skill.name}
            </button>
          </Html>
        </group>
      ))}
    </group>
  );
}

export default function SkillsGlobe() {
  const [selected, setSelected] = useState<Skill | null>(null);
  
  // Filter skills to show only top skills for better visibility
  const displaySkills = skillsData.filter(skill => skill.level >= 3);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'backend': return 'Backend Development';
      case 'frontend': return 'Frontend Development';
      case 'database': return 'Database Management';
      case 'devops': return 'DevOps & Cloud';
      case 'tools': return 'Development Tools';
      case 'soft': return 'Soft Skills';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'backend':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        );
      case 'frontend':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'database':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        );
      case 'devops':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div className="grid md:grid-cols-5 gap-6">
      <div className="md:col-span-3 h-[480px] rounded-2xl overflow-hidden border border-white/10 bg-black/30 relative">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[2, 3, 2]} intensity={0.8} />
          <pointLight position={[-2, -3, -2]} intensity={0.4} color="#60a5fa" />
          <Globe skills={displaySkills} onClick={setSelected} />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
        
        {/* Controls overlay */}
        <div className="absolute bottom-4 left-4 text-xs text-white/60 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <div>🖱️ Drag to rotate • 🖱️ Click skills to view details</div>
        </div>
      </div>
      
      <div className="md:col-span-2 space-y-4">
        {/* Skill details panel */}
        <div className="p-4 rounded-2xl border border-white/10 bg-black/30 h-[280px] overflow-y-auto">
          <h3 className="text-xl font-semibold text-gradient-2 mb-3">Skill Details</h3>
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-400">
                  {getCategoryIcon(selected.category)}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{selected.name}</h4>
                  <div className="text-sm text-white/70">{getCategoryLabel(selected.category)}</div>
                </div>
              </div>
              
              {/* Proficiency bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">Proficiency</span>
                  <span className="text-cyan-300">{selected.level}/5</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selected.level / 5) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Experience */}
              <div>
                <div className="text-sm text-white/80 mb-1">Experience</div>
                <div className="text-cyan-300 font-medium">{selected.yearsOfExperience} years</div>
              </div>
              
              {/* Description */}
              {selected.description && (
                <div>
                  <div className="text-sm text-white/80 mb-1">About</div>
                  <p className="text-sm text-white/70 leading-relaxed">{selected.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-white/70 text-sm">Click a skill on the globe to view details</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Category legend */}
        <div className="p-4 rounded-2xl border border-white/10 bg-black/30">
          <h4 className="font-semibold text-white mb-3">Categories</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['backend', 'frontend', 'database', 'devops', 'tools', 'soft'].map((category) => (
              <div key={category} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: (() => {
                      switch (category) {
                        case 'backend': return '#3b82f6';
                        case 'frontend': return '#10b981';
                        case 'database': return '#f59e0b';
                        case 'devops': return '#ef4444';
                        case 'tools': return '#8b5cf6';
                        case 'soft': return '#06b6d4';
                        default: return '#60a5fa';
                      }
                    })()
                  }}
                />
                <span className="text-white/70 capitalize">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
