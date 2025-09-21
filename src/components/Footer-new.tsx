import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  OrbitControls, 
  Stars, 
  Environment,
  Sphere,
  Box,
  Octahedron,
  Torus,
  MeshDistortMaterial,
  MeshWobbleMaterial
} from '@react-three/drei';
import * as THREE from 'three';

// Advanced 3D Footer Background showcasing Three.js expertise
function FooterScene() {
  const { viewport } = useThree();
  
  // Dynamic particle system with performance optimization
  function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.PointsMaterial>(null);
    
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Generate optimized particle distribution
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Volumetric distribution with performance-aware density
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;
      
      // Advanced color gradients for depth and atmosphere
      const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
      const colorVariant = distance / 25;
      
      if (colorVariant < 0.3) {
        colors[i3] = 0.1 + Math.random() * 0.3;     // r
        colors[i3 + 1] = 0.6 + Math.random() * 0.4; // g
        colors[i3 + 2] = 1.0;                       // b
      } else if (colorVariant < 0.7) {
        colors[i3] = 0.8 + Math.random() * 0.2;     // r
        colors[i3 + 1] = 0.4 + Math.random() * 0.4; // g
        colors[i3 + 2] = 1.0;                       // b
      } else {
        colors[i3] = 1.0;                           // r
        colors[i3 + 1] = 0.8 + Math.random() * 0.2; // g
        colors[i3 + 2] = 0.2 + Math.random() * 0.3; // b
      }
      
      sizes[i] = Math.random() * 4 + 1;
    }
    
    useFrame((state) => {
      if (pointsRef.current && materialRef.current) {
        const time = state.clock.elapsedTime;
        
        // Smooth rotation with performance optimization
        pointsRef.current.rotation.y = time * 0.02;
        pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
        
        // Dynamic opacity for atmospheric effect
        materialRef.current.opacity = 0.6 + Math.sin(time * 1.5) * 0.2;
      }
    });
    
    return (
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={3}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    );
  }
  
  // Interactive floating geometries
  function InteractiveShapes() {
    return (
      <group>
        <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
          <Sphere args={[1.2, 32, 32]} position={[-8, 3, -5]}>
            <MeshDistortMaterial
              color="#00f5ff"
              attach="material"
              distort={0.3}
              speed={2}
              roughness={0.2}
              metalness={0.8}
            />
          </Sphere>
        </Float>
        
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <Box args={[1.5, 1.5, 1.5]} position={[8, -2, -3]}>
            <MeshWobbleMaterial
              color="#8a2be2"
              attach="material"
              factor={0.6}
              speed={3}
              roughness={0.1}
              metalness={0.9}
            />
          </Box>
        </Float>
        
        <Float speed={1.8} rotationIntensity={3} floatIntensity={1.5}>
          <Octahedron args={[1, 0]} position={[-6, -3, 2]}>
            <meshStandardMaterial
              color="#ff6b6b"
              emissive="#ff6b6b"
              emissiveIntensity={0.2}
              roughness={0.3}
              metalness={0.7}
            />
          </Octahedron>
        </Float>
        
        <Float speed={1.2} rotationIntensity={2.5} floatIntensity={2.5}>
          <Torus args={[1, 0.4, 16, 32]} position={[6, 4, 1]}>
            <meshStandardMaterial
              color="#4ecdc4"
              emissive="#4ecdc4"
              emissiveIntensity={0.15}
              roughness={0.2}
              metalness={0.8}
            />
          </Torus>
        </Float>
      </group>
    );
  }
  
  return (
    <>
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Advanced lighting setup */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, -10, 5]} intensity={0.8} color="#8a2be2" />
      <spotLight
        position={[0, 20, 0]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
        color="#ffffff"
      />
      
      <ParticleField />
      <InteractiveShapes />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={true} 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Main Footer Component with impressive 3D showcase
export default function Footer() {
  return (
    <footer className="relative w-full min-h-[70vh] overflow-hidden">
      {/* Advanced 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          dpr={[1, 2]}
          shadows
        >
          <Suspense fallback={null}>
            <FooterScene />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Enhanced Footer Content */}
      <div className="relative z-10 h-full flex items-center justify-center backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 text-center md:text-left">
            
            {/* Brand Section with Enhanced Typography */}
            <div className="space-y-6 lg:col-span-2">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                ThreeJS Portfolio
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Pioneering immersive digital experiences through cutting-edge 3D web technologies, 
                advanced shader programming, and performance optimization.
              </p>
              <div className="flex justify-center md:justify-start space-x-6">
                <div className="group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <span className="text-white text-sm font-bold">3D</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Three.js</p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Machine Learning</p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <span className="text-white text-sm font-bold">UX</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">User Experience</p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <span className="text-white text-sm font-bold">⚡</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Performance</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white border-b border-cyan-500/30 pb-2">
                Portfolio
              </h4>
              <nav className="space-y-3">
                <a href="#hero" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-2 transform">
                  → Home
                </a>
                <a href="#projects" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-2 transform">
                  → 3D Projects
                </a>
                <a href="#skills" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-2 transform">
                  → Technical Skills
                </a>
                <a href="#timeline" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-2 transform">
                  → Experience
                </a>
                <a href="#contact" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-2 transform">
                  → Contact
                </a>
              </nav>
            </div>
            
            {/* Contact & Social with enhanced design */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white border-b border-purple-500/30 pb-2">
                Connect
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-cyan-400 font-medium">Email</p>
                    <p className="text-gray-300">hello@threejs-portfolio.dev</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-400 font-medium">Status</p>
                    <p className="text-gray-300">Available for projects</p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Social Links */}
              <div className="flex justify-center md:justify-start space-x-4 mt-6">
                <a 
                  href="#" 
                  className="group w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5 text-white transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                
                <a 
                  href="#" 
                  className="group w-12 h-12 rounded-full bg-gradient-to-r from-blue-700 to-blue-900 flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5 text-white transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                <a 
                  href="#" 
                  className="group w-12 h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5 text-white transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Enhanced Bottom Bar */}
          <div className="border-t border-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2025 ThreeJS Portfolio. Engineered with precision and passion.
              </p>
              <div className="flex items-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center space-x-2">
                  <span>Powered by</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-red-400 animate-pulse">❤️</span>
                    <span className="text-cyan-400 font-medium">React</span>
                    <span>•</span>
                    <span className="text-green-400 font-medium">Three.js</span>
                    <span>•</span>
                    <span className="text-blue-400 font-medium">TypeScript</span>
                    <span>•</span>
                    <span className="text-purple-400 font-medium">WebGL</span>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
    </footer>
  );
}
