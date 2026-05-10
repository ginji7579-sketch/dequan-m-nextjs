import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei'

const BlobLogo = () => {
  const mesh1 = useRef<any>()
  const mesh2 = useRef<any>()
  const mesh3 = useRef<any>()

  useFrame((state) => {
    // 移除大幅度動效，保持穩定感
    const time = state.clock.getElapsedTime()
    if (mesh1.current) {
      mesh1.current.rotation.z = Math.PI * 0.25 + Math.sin(time * 0.2) * 0.02
    }
  })

  return (
    <group scale={1.3}>
      {/* 深綠色 C 型主體 */}
      <mesh ref={mesh1} position={[0, 0, 0]} rotation={[0, 0, Math.PI * 0.25]}>
        <torusGeometry args={[1, 0.5, 32, 100, Math.PI * 1.65]} />
        <meshStandardMaterial 
          color="#00312D" 
          roughness={0.5} 
          metalness={0.1}
        />
      </mesh>

      {/* 咖啡色組件 */}
      <group position={[0.1, -0.1, 0]}>
        {/* 內側球體 */}
        <mesh>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshStandardMaterial color="#864B11" roughness={0.4} />
        </mesh>
        
        {/* 連接橋接 */}
        <mesh position={[0.55, 0.35, 0]} rotation={[0, 0, -Math.PI * 0.2]}>
          <capsuleGeometry args={[0.22, 0.7, 20, 20]} />
          <meshStandardMaterial color="#864B11" roughness={0.4} />
        </mesh>

        {/* 外側球體 */}
        <mesh position={[1.1, 0.7, 0]}>
          <sphereGeometry args={[0.58, 64, 64]} />
          <meshStandardMaterial color="#864B11" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

export default function BlobLogoScene() {
  return (
    <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} />
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        
        <Suspense fallback={null}>
          <BlobLogo />
        </Suspense>
        
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
