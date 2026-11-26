"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  useGLTF,
  Center,
} from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

/**
 * Set this to your model once you have one, e.g. "/models/car.glb"
 * (put the file in public/models/car.glb). While it's null a simple
 * placeholder car is rendered so you can tune the scroll animation first.
 */
export const CAR_MODEL_URL: string | null = "/models/car.glb";

/* ---------- Car: real GLB model ---------- */
function GltfCar({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  // let the car cast/receive shadows and pick up the environment reflections
  useMemo(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const m = o as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && "envMapIntensity" in mat) {
          mat.envMapIntensity = 1.5;
          mat.metalness = 0.6;
          mat.roughness = 0.35;
        }
      }
    });
  }, [scene]);

  return (
    <Center top>
      {/* model is ~1 unit long (nose points +Z); 3.5 fills the frame */}
      <primitive object={scene} scale={3.5} />
    </Center>
  );
}

/* ---------- Car: placeholder built from primitives ---------- */
function PlaceholderCar({ wheelsRef }: { wheelsRef: RefObject<THREE.Group[]> }) {
  const paint = (
    <meshPhysicalMaterial
      color="#0b0b0f"
      metalness={0.9}
      roughness={0.25}
      clearcoat={1}
      clearcoatRoughness={0.05}
    />
  );
  const wheelPos: [number, number, number][] = [
    [1.15, 0.32, 0.78],
    [1.15, 0.32, -0.78],
    [-1.15, 0.32, 0.78],
    [-1.15, 0.32, -0.78],
  ];

  return (
    <group>
      {/* lower body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[3.6, 0.5, 1.6]} />
        {paint}
      </mesh>
      {/* cabin */}
      <mesh position={[-0.2, 1.0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.45, 1.4]} />
        <meshPhysicalMaterial color="#111" metalness={1} roughness={0.05} transmission={0.2} />
      </mesh>
      {/* headlights */}
      {[0.55, -0.55].map((z) => (
        <mesh key={`h${z}`} position={[1.81, 0.6, z]}>
          <boxGeometry args={[0.02, 0.1, 0.35]} />
          <meshStandardMaterial color="#fff" emissive="#cfe6ff" emissiveIntensity={4} />
        </mesh>
      ))}
      {/* tail lights */}
      {[0.55, -0.55].map((z) => (
        <mesh key={`t${z}`} position={[-1.81, 0.6, z]}>
          <boxGeometry args={[0.02, 0.08, 0.4]} />
          <meshStandardMaterial color="#f00" emissive="#ff1a1a" emissiveIntensity={3} />
        </mesh>
      ))}
      {/* wheels */}
      {wheelPos.map((p, i) => (
        <group
          key={i}
          position={p}
          ref={(el) => {
            if (el && wheelsRef.current) wheelsRef.current[i] = el;
          }}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.25, 32]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.27, 6]} />
            <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Scroll-driven rig ---------- */
function CarRig({ progress }: { progress: MotionValue<number> }) {
  const car = useRef<THREE.Group>(null!);
  const wheels = useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);

    // 1. Rotation: one full turn across the whole scroll (+ a 3/4 view start)
    const targetY = -Math.PI / 4 + p * Math.PI * 2;
    car.current.rotation.y = THREE.MathUtils.damp(car.current.rotation.y, targetY, 6, delta);

    // 2. Camera: slight dolly-in and lower angle as you scroll
    const cam = state.camera;
    const targetZ = THREE.MathUtils.lerp(7, 5.2, p);
    const targetCamY = THREE.MathUtils.lerp(2.2, 1.2, p);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 4, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, targetCamY, 4, delta);
    cam.lookAt(0, 0.45, 0);

    // 3. Wheels spin with scroll (placeholder car only)
    wheels.current.forEach((w) => w && (w.rotation.z = -p * Math.PI * 12));
  });

  return (
    <group ref={car}>
      {CAR_MODEL_URL ? <GltfCar url={CAR_MODEL_URL} /> : <PlaceholderCar wheelsRef={wheels} />}
    </group>
  );
}

export function ScrollCarCanvas({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2.2, 7], fov: 35 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 8, 20]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[5, 8, 5]} angle={0.35} penumbra={1} intensity={80} castShadow />
      <spotLight position={[-5, 4, -4]} angle={0.5} penumbra={1} intensity={40} color="#1573DF" />

      <Suspense fallback={null}>
        <CarRig progress={progress} />
        <Environment preset="city" />
      </Suspense>

      <ContactShadows position={[0, 0, 0]} opacity={0.7} scale={12} blur={2.4} far={4} />
    </Canvas>
  );
}

if (CAR_MODEL_URL) useGLTF.preload(CAR_MODEL_URL);
