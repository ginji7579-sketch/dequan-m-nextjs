import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei'

const BlobLogo = () => {
  const mesh1 = useRef<any>()
  const mesh2 = useRef<any>()
  const mesh3 = useRef<any>()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // 稍微增加一點整體的漂浮感
    if (mesh1.current) {
      mesh1.current.position.y = Math.sin(time * 0.5) * 0.1
      mesh1.current.rotation.z = Math.PI * 0.2 + Math.sin(time * 0.3) * 0.05
    }
    
    // 橘色組件的動態效果
    if (mesh2.current && mesh3.current) {
      const wobble = Math.sin(time) * 0.1
      mesh2.current.position.x = 0.1 + wobble
      mesh3.current.position.x = 1.3 + wobble
    }
  })

  return (
    <group scale={1.2}>
      {/* 綠色 C 型主體 - 使用 Torus 但調整參數使其更圓潤 */}
      <mesh ref={mesh1} position={[0, 0, 0]} rotation={[0, 0, Math.PI * 0.2]}>
        <torusGeometry args={[1, 0.45, 32, 100, Math.PI * 1.6]} />
        <meshStandardMaterial 
          color="#3E867E" 
          roughness={0.4} 
          metalness={0.1}
        />
      </mesh>

      {/* 橘色連接部分 - 由兩個球體和一個連接處組成 */}
      <group ref={mesh2} position={[0.1, 0, 0]}>
        {/* 內側球體 */}
        <mesh>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshStandardMaterial color="#F49424" roughness={0.3} />
        </mesh>
        
        {/* 連接頸部 */}
        <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI * 0.5]}>
          <capsuleGeometry args={[0.25, 0.8, 20, 20]} />
          <meshStandardMaterial color="#F49424" roughness={0.3} />
        </mesh>

        {/* 外側球體 */}
        <mesh ref={mesh3} position={[1.2, 0.4, 0]}>
          <sphereGeometry args={[0.6, 64, 64]} />
          <meshStandardMaterial color="#F49424" roughness={0.3} />
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
