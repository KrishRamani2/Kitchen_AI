"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"

// Food model created with primitives
function FoodModel({ type = "default" }) {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.2
  })

  // Different food models based on type
  switch (type) {
    case "pasta":
      return (
        <group ref={groupRef}>
          {/* Plate */}
          <mesh position={[0, -0.1, 0]} receiveShadow>
            <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>

          {/* Pasta */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
            <meshStandardMaterial color="#f5d742" />
          </mesh>

          {/* Sauce */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#d83c0e" transparent opacity={0.7} />
          </mesh>
        </group>
      )

    case "cake":
      return (
        <group ref={groupRef}>
          {/* Plate */}
          <mesh position={[0, -0.3, 0]} receiveShadow>
            <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>

          {/* Cake base */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
            <meshStandardMaterial color="#d9a066" />
          </mesh>

          {/* Frosting */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>

          {/* Cherry */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#d83c0e" />
          </mesh>
        </group>
      )

    default:
      return (
        <group ref={groupRef}>
          {/* Plate */}
          <mesh position={[0, -0.2, 0]} receiveShadow>
            <cylinderGeometry args={[1, 1, 0.1, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>

          {/* Main food */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#f5a742" />
          </mesh>

          {/* Garnish */}
          <mesh position={[0.3, 0.2, 0.3]} castShadow>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="green" />
          </mesh>

          <mesh position={[-0.3, 0.2, -0.3]} castShadow>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </group>
      )
  }
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </Html>
  )
}

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

export default function RecipeModel({ model }) {
  const [hasError, setHasError] = useState(false)

  // Determine food type based on model string
  const getFoodType = () => {
    if (!model) return "default"

    if (model.includes("pasta")) return "pasta"
    if (model.includes("cake")) return "cake"

    return "default"
  }

  if (hasError) {
    return <CanvasFallback />
  }

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }} onError={() => setHasError(true)}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <Environment preset="apartment" />
        <FoodModel type={getFoodType()} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
