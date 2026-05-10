import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

const BlobLogo = () => {
  const mesh1 = useRef<any>()
  const mesh2 = useRef<any>()

  // 簡單的互動動畫：讓球體隨時間輕微漂浮晃動
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // 讓橘色小球繞著綠色 C 型結構做互動位移
    if (mesh2.current) {
      mesh2.current.position.x = Math.sin(time) * 0.5 + 1.2
      mesh2.current.position.y = Math.cos(time * 0.5) * 0.3
    }
  })

  return (
    <>
      {/* 綠色 C 型主體 (這裡用環狀幾何體簡化模擬) */}
      <mesh ref={mesh1} position={[0, 0, 0]} rotation={[0, 0, Math.PI * 0.2]}>
        <torusGeometry args={[1, 0.4, 32, 100, Math.PI * 1.5]} />
        <meshPhysicalMaterial 
          color="#3A8E7D" 
          roughness={0.3} 
          clearcoat={1}
        />
      </mesh>

      {/* 橘色連接球體 */}
      <mesh ref={mesh2} position={[1.2, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshPhysicalMaterial 
          color="#F28C28" 
          roughness={0.2}
        />
      </mesh>
    </>
  )
}

export default function BlobLogoScene() {
  return (
    <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        <Suspense fallback={null}>
          <BlobLogo />
        </Suspense>
        
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
