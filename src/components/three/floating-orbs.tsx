"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Orb({
  position,
  color,
  size,
  speed,
  distort,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
  distort: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const startPos = useRef(position);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        startPos.current[1] + Math.sin(state.clock.elapsedTime * speed) * 0.4;
      ref.current.position.x =
        startPos.current[0] +
        Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.2;
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
        distort={distort}
        speed={speed * 2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.2} />

      <Orb
        position={[-3, 1, -2]}
        color="#1573DF"
        size={0.8}
        speed={0.5}
        distort={0.4}
      />
      <Orb
        position={[3, -1, -3]}
        color="#3B8FEF"
        size={0.6}
        speed={0.7}
        distort={0.3}
      />
      <Orb
        position={[0, 2, -4]}
        color="#0D5BBF"
        size={1}
        speed={0.3}
        distort={0.5}
      />
      <Orb
        position={[-2, -2, -2]}
        color="#3B8FEF"
        size={0.4}
        speed={0.9}
        distort={0.2}
      />
      <Orb
        position={[4, 0, -5]}
        color="#1573DF"
        size={0.5}
        speed={0.6}
        distort={0.35}
      />
    </>
  );
}

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
