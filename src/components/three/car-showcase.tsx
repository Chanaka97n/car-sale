"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function ReflectiveGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  );
}

function HeroSphere() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    ref.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
  });

  return (
    <mesh ref={ref} position={[0, 0.3, 0]} castShadow>
      <sphereGeometry args={[1.3, 64, 64]} />
      <meshPhysicalMaterial
        color="#0a0a0a"
        metalness={1}
        roughness={0.05}
        envMapIntensity={3}
        clearcoat={1}
        clearcoatRoughness={0.05}
        reflectivity={1}
      />
    </mesh>
  );
}

function OrangeAccentRing({
  radius,
  speed,
  tiltX,
  tiltZ,
  thickness,
  opacity,
}: {
  radius: number;
  speed: number;
  tiltX: number;
  tiltZ: number;
  thickness: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]} position={[0, 0.3, 0]}>
      <torusGeometry args={[radius, thickness, 32, 128]} />
      <meshStandardMaterial
        color="#1573DF"
        emissive="#1573DF"
        emissiveIntensity={2}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingDots() {
  const count = 150;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.8 + Math.random() * 1.5;
      const h = (Math.random() - 0.5) * 2.5;
      pos[i * 3] = Math.cos(angle + Math.random() * 0.5) * r;
      pos[i * 3 + 1] = h;
      pos[i * 3 + 2] = Math.sin(angle + Math.random() * 0.5) * r;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#1573DF"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function HorizontalLight() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <mesh ref={ref} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 3.5, 64]} />
      <meshStandardMaterial
        color="#1573DF"
        emissive="#1573DF"
        emissiveIntensity={0.5}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function MouseInteraction() {
  const light = useRef<THREE.PointLight>(null!);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!light.current) return;
    light.current.position.x =
      (state.pointer.x * viewport.width) / 2;
    light.current.position.y =
      (state.pointer.y * viewport.height) / 2 + 1;
    light.current.position.z = 3;
  });

  return <pointLight ref={light} color="#3B8FEF" intensity={2} distance={10} />;
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 18]} />

      <ambientLight intensity={0.08} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.4}
        penumbra={1}
        intensity={0.6}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-4, 5, -3]}
        angle={0.5}
        penumbra={1}
        intensity={0.3}
        color="#1573DF"
      />
      <pointLight position={[0, 3, 0]} intensity={0.2} color="#1573DF" />

      <MouseInteraction />

      <HeroSphere />
      <OrangeAccentRing
        radius={2}
        speed={0.3}
        tiltX={Math.PI * 0.45}
        tiltZ={0.1}
        thickness={0.012}
        opacity={0.6}
      />
      <OrangeAccentRing
        radius={2.3}
        speed={-0.2}
        tiltX={Math.PI * 0.55}
        tiltZ={-0.15}
        thickness={0.008}
        opacity={0.3}
      />
      <OrangeAccentRing
        radius={1.7}
        speed={0.4}
        tiltX={Math.PI * 0.3}
        tiltZ={0.3}
        thickness={0.006}
        opacity={0.2}
      />

      <FloatingDots />
      <HorizontalLight />

      <ReflectiveGround />
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
      />

      <Environment preset="city" />
    </>
  );
}

export function CarShowcase3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 40 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
