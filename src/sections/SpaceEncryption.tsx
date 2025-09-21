import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { Float, OrbitControls, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import encBg from '../../space-portfolio/public/videos/encryption-bg.webm';
import lockTop from '../../space-portfolio/public/lock-top.png';
import lockMain from '../../space-portfolio/public/lock-main.png';

const slideInFromTop = { 
  hidden: { opacity: 0, y: -30 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any } } 
};

const slideInFromLeft = { 
  hidden: { opacity: 0, x: -50 }, 
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] as any } } 
};

const slideInFromRight = { 
  hidden: { opacity: 0, x: 50 }, 
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] as any } } 
};

// 3D Security Shield Component
function SecurityShield({ position, color, rotationSpeed = 1 }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * rotationSpeed;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

// 3D Lock Mechanism
function Interactive3DLock({ isUnlocked, setIsUnlocked }: any) {
  const lockBodyRef = useRef<THREE.Mesh>(null);
  const lockTopRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (lockBodyRef.current && lockTopRef.current) {
      const time = state.clock.elapsedTime;
      
      if (isUnlocked) {
        lockTopRef.current.position.y = Math.sin(time * 3) * 0.5 + 1.5;
        lockTopRef.current.rotation.y = time * 2;
        const material = lockBodyRef.current.material as THREE.MeshStandardMaterial;
        if (material && 'emissiveIntensity' in material) {
          material.emissiveIntensity = 0.5;
        }
      } else {
        lockTopRef.current.position.y = 0.5;
        lockTopRef.current.rotation.y = 0;
        const material = lockBodyRef.current.material as THREE.MeshStandardMaterial;
        if (material && 'emissiveIntensity' in material) {
          material.emissiveIntensity = 0.2;
        }
      }
    }
  });
  
  return (
    <group 
      onClick={() => setIsUnlocked(!isUnlocked)} 
      onPointerEnter={() => document.body.style.cursor = 'pointer'}
      onPointerLeave={() => document.body.style.cursor = 'auto'}
    >
      {/* Lock Body */}
      <mesh ref={lockBodyRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1, 0.5]} />
        <meshStandardMaterial
          color={isUnlocked ? "#00ff41" : "#ff6b6b"}
          emissive={isUnlocked ? "#00ff41" : "#ff6b6b"}
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Lock Shackle */}
      <mesh ref={lockTopRef} position={[0, 0.5, 0]}>
        <torusGeometry args={[0.4, 0.1, 8, 16, Math.PI]} />
        <meshStandardMaterial
          color={isUnlocked ? "#00ff41" : "#888888"}
          emissive={isUnlocked ? "#00ff41" : "#888888"}
          emissiveIntensity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// 3D Scene Component
function SecurityScene() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, -10, 5]} intensity={0.8} color="#8a2be2" />
      <spotLight
        position={[0, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      
      <SecurityShield position={[-3, 0, -2]} color="#00f5ff" rotationSpeed={1.2} />
      <SecurityShield position={[3, 0, -2]} color="#8a2be2" rotationSpeed={0.8} />
      <SecurityShield position={[0, 2, -3]} color="#ff6b6b" rotationSpeed={1.5} />
      
      <Interactive3DLock isUnlocked={isUnlocked} setIsUnlocked={setIsUnlocked} />
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
    </>
  );
}

export default function SpaceEncryption() {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <section id="space-encryption" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-bg">
      {/* Enhanced Background Video */}
      <div className="absolute inset-0 -z-10">
        <video 
          loop 
          muted 
          autoPlay 
          playsInline 
          preload="metadata" 
          className="w-full h-full object-cover opacity-60 data-[theme=light]:opacity-30"
        >
          <source src={encBg} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/60"></div>
      </div>

      {/* 3D Canvas Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          style={{ pointerEvents: isInteracting ? 'auto' : 'none' }}
        >
          <Suspense fallback={null}>
            <SecurityScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced Header */}
      <div className="absolute top-8 w-full flex justify-center z-10">
        <motion.div 
          variants={slideInFromTop} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Performance
            </span>
            <span className="text-fg mx-4">&</span>
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Security
            </span>
          </h2>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
            Advanced encryption algorithms and performance optimization for bulletproof security
          </p>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-16 px-6">
        
        {/* Left Side - Features */}
        <motion.div 
          variants={slideInFromLeft} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="space-y-6 max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-bg-glass backdrop-blur-sm border border-border hover:border-border-hover shadow-theme-sm hover:shadow-theme-md transition-all duration-300">
              <div className="w-3 h-3 bg-accent-primary rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-accent-primary font-semibold">End-to-End Encryption</h3>
                <p className="text-fg-secondary text-sm">256-bit AES encryption standard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-bg-glass backdrop-blur-sm border border-border hover:border-border-hover shadow-theme-sm hover:shadow-theme-md transition-all duration-300">
              <div className="w-3 h-3 bg-accent-secondary rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-accent-secondary font-semibold">Zero-Knowledge Architecture</h3>
                <p className="text-fg-secondary text-sm">Complete data privacy guarantee</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-bg-glass backdrop-blur-sm border border-border hover:border-border-hover shadow-theme-sm hover:shadow-theme-md transition-all duration-300">
              <div className="w-3 h-3 bg-accent-success rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-accent-success font-semibold">Quantum-Safe Protocols</h3>
                <p className="text-fg-secondary text-sm">Future-proof security standards</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center - Interactive 3D Lock */}
        <motion.div 
          variants={slideInFromTop} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="relative"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
        >
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-primary/20 rounded-full animate-pulse shadow-theme-lg"></div>
            <div className="relative z-10 flex flex-col items-center group cursor-pointer p-6">
              <img 
                src={lockTop} 
                alt="Lock top" 
                width={60} 
                height={60} 
                className="translate-y-2 transition-all duration-500 group-hover:translate-y-8 filter drop-shadow-lg" 
              />
              <img 
                src={lockMain} 
                alt="Lock main" 
                width={80} 
                height={80} 
                className="z-10 filter drop-shadow-xl group-hover:drop-shadow-2xl transition-all duration-300" 
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <div className="px-6 py-2 border border-border bg-bg-glass backdrop-blur-sm rounded-full shadow-theme-sm hover:shadow-theme-md transition-all duration-300">
              <h4 className="text-accent-primary text-sm font-medium">Click to Interact</h4>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Performance Metrics */}
        <motion.div 
          variants={slideInFromRight} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="space-y-6 max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-glass backdrop-blur-sm border border-border hover:border-border-hover shadow-theme-sm hover:shadow-theme-md transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-accent-success font-medium">Encryption Speed</span>
                <span className="text-fg font-bold">99.7%</span>
              </div>
              <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-accent-success to-accent-primary h-2 rounded-full transition-all duration-1000" style={{ width: '99.7%' }}></div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-bg-glass backdrop-blur-sm border border-border hover:border-border-hover shadow-theme-sm hover:shadow-theme-md transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-accent-primary font-medium">Security Score</span>
                <span className="text-fg font-bold">A+</span>
              </div>
              <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-primary h-2 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-bg-glass backdrop-blur-sm border border-border hover:border-border-hover shadow-theme-sm hover:shadow-theme-md transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-accent-secondary font-medium">Uptime</span>
                <span className="text-fg font-bold">99.99%</span>
              </div>
              <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-secondary h-2 rounded-full transition-all duration-1000" style={{ width: '99.99%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-8 w-full z-10 px-6">
        <motion.div 
          variants={slideInFromTop} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
            Enterprise-grade security meets lightning-fast performance in our cutting-edge infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-primary text-white font-medium rounded-full hover:shadow-theme-md transition-all duration-300 transform hover:scale-105 shadow-theme-sm">
              Learn More
            </button>
            <button className="px-8 py-3 border border-border text-accent-secondary font-medium rounded-full hover:bg-bg-glass hover:border-border-hover transition-all duration-300 transform hover:scale-105">
              View Documentation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
