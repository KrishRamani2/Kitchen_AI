"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

// Chef character made with primitives instead of loading external model
function ChefCharacter({ position, rotation, scale, onClick }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = Math.sin(t / 2) / 10
    ref.current.position.y = Math.sin(t / 1.5) / 10 + position[1]
  })

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      {/* Chef body */}
      <mesh castShadow position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Chef hat */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Chef eyes */}
      <mesh castShadow position={[0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh castShadow position={[-0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Chef smile */}
      <mesh castShadow position={[0, -0.1, 0.4]}>
        <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  )
}

function Kitchen() {
  const [showInfo, setShowInfo] = useState(false)
  const { camera } = useThree()
  const { theme } = useTheme()

  useEffect(() => {
    camera.position.set(0, 1, 5)
  }, [camera])

  return (
    <>
      {/* Kitchen counter */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[5, 0.2, 3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Cooking pot */}
      <group position={[-1.5, -0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.8, 32]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.72, 0.7, 0.1, 32]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Plate with food */}
      <group position={[1.5, -0.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f5a742" />
        </mesh>
        <mesh position={[0.2, 0.2, 0.2]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="green" />
        </mesh>
        <mesh position={[-0.2, 0.2, -0.2]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>

      {/* Interactive chef character */}
      <ChefCharacter
        position={[0, -0.5, 0]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[1, 1, 1]}
        onClick={() => setShowInfo(!showInfo)}
      />

      {showInfo && (
        <Html position={[0, 0.5, 0]} center>
          <div
            className={`p-4 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <h3 className="text-lg font-bold mb-2">Chef Assistant</h3>
            <p className="mb-2">Your personal AI kitchen assistant!</p>
            <Button size="sm" onClick={() => setShowInfo(false)}>
              Close
            </Button>
          </div>
        </Html>
      )}
    </>
  )
}

// Fallback component when Canvas fails
function CanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
      <div className="text-center p-4">
        <h3 className="font-bold mb-2">3D Visualization</h3>
        <p className="text-sm text-muted-foreground">
          Unable to load 3D content. Your browser may not support WebGL or it might be disabled.
        </p>
      </div>
    </div>
  )
}

export default function HeroScene() {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <CanvasFallback />
  }

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor("#f0f0f0", 0)
        }}
        onError={() => setHasError(true)}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} />
        <Environment preset="apartment" />
        <Kitchen />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  )
}
