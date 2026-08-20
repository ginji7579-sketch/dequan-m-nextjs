import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Component that represents the 3D card itself
const Card3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load the texture using standard Three.js TextureLoader
  const texture = useLoader(THREE.TextureLoader, '/images/home_bg.png');
  texture.colorSpace = THREE.SRGBColorSpace; // Ensure correct color representation

  // Floating animation & automatic slow rotation when not dragged
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Floating up and down
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.15;
      
      // Auto-rotation around Y axis (slow spin)
      meshRef.current.rotation.y = time * 0.15;
      
      // Slight pitch wobble
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* 2.35 width, 3.90 height, 0.08 thickness (based on 235x390 image aspect ratio) */}
      <boxGeometry args={[2.35, 3.90, 0.08]} />
      
      {/* Materials for the 6 faces: Right, Left, Top, Bottom, Front, Back */}
      {/* Edges are a beautiful warm metallic gold */}
      <meshPhysicalMaterial attach="material-0" color="#d4af37" metalness={0.9} roughness={0.15} /> {/* Right */}
      <meshPhysicalMaterial attach="material-1" color="#d4af37" metalness={0.9} roughness={0.15} /> {/* Left */}
      <meshPhysicalMaterial attach="material-2" color="#d4af37" metalness={0.9} roughness={0.15} /> {/* Top */}
      <meshPhysicalMaterial attach="material-3" color="#d4af37" metalness={0.9} roughness={0.15} /> {/* Bottom */}
      
      {/* Front face displays the starry night bear illustration */}
      <meshPhysicalMaterial 
        attach="material-4" 
        map={texture} 
        roughness={0.1} 
        clearcoat={1.0} 
        clearcoatRoughness={0.1} 
      /> {/* Front */}
      
      {/* Back face displays the starry night bear illustration as well */}
      <meshPhysicalMaterial 
        attach="material-5" 
        map={texture} 
        roughness={0.1} 
        clearcoat={1.0} 
        clearcoatRoughness={0.1} 
      /> {/* Back */}
    </mesh>
  );
};

export default function RotatingCard3DScene({ className = "w-[300px] h-[400px] md:w-[350px] md:h-[450px]" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.7} />
        {/* Key directional light to highlight the metallic gold edges and clearcoat shine */}
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <Card3D />
        </Suspense>
        
        {/* Enable full 360-degree rotation drag */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI} 
        />
      </Canvas>
    </div>
  );
}
