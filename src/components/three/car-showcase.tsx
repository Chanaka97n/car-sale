"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function CarBody() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + Math.PI * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* Main body */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[3.2, 0.7, 1.4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={2}
        />
      </mesh>

      {/* Cabin */}
      <mesh position={[0.2, 0.55, 0]} castShadow>
        <boxGeometry args={[1.8, 0.6, 1.3]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={3}
        />
      </mesh>

      {/* Windshield front */}
      <mesh position={[-0.65, 0.5, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.6, 0.55, 1.25]} />
        <meshPhysicalMaterial
          color="#111111"
          metalness={1}
          roughness={0}
          transmission={0.3}
          thickness={0.1}
        />
      </mesh>

      {/* Front wheel left */}
      <Wheel position={[-1.1, -0.35, 0.75]} />
      {/* Front wheel right */}
      <Wheel position={[-1.1, -0.35, -0.75]} />
      {/* Rear wheel left */}
      <Wheel position={[1.1, -0.35, 0.75]} />
      {/* Rear wheel right */}
      <Wheel position={[1.1, -0.35, -0.75]} />

      {/* Headlights */}
      <Headlight position={[-1.6, 0, 0.45]} />
      <Headlight position={[-1.6, 0, -0.45]} />

      {/* Tail lights */}
      <TailLight position={[1.6, 0, 0.5]} />
      <TailLight position={[1.6, 0, -0.5]} />
    </group>
  );
}

function Wheel({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 2;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.28, 0.12, 8, 24]} />
      <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

function Headlight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          emissive="#ffffff"
          emissiveIntensity={2}
          color="#ffffff"
        />
      </mesh>
      <pointLight color="#ffffff" intensity={0.5} distance={3} />
    </group>
  );
}

function TailLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          emissive="#e8590c"
          emissiveIntensity={3}
          color="#e8590c"
        />
      </mesh>
      <pointLight color="#e8590c" intensity={0.4} distance={2} />
    </group>
  );
}

function GlowRing() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ref.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusGeometry args={[2.8, 0.015, 16, 100]} />
      <meshStandardMaterial
        emissive="#e8590c"
        emissiveIntensity={1.5}
        color="#e8590c"
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function GlowRing2() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.25;
      ref.current.rotation.x = Math.PI * 0.4;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusGeometry args={[3.2, 0.01, 16, 100]} />
      <meshStandardMaterial
        emissive="#f97316"
        emissiveIntensity={1}
        color="#f97316"
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}

function ParticleCloud() {
  const count = 300;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 0.03 + 0.01;
    }
    return s;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#e8590c"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#0a0a0a"
        metalness={0.9}
        roughness={0.4}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

function GroundGrid() {
  const ref = useRef<THREE.GridHelper>(null!);

  useFrame((state) => {
    if (ref.current) {
      (ref.current.material as THREE.Material).opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[20, 40, "#e8590c", "#1a1a1a"]}
      position={[0, -0.69, 0]}
    />
  );
}

function MouseLight() {
  const light = useRef<THREE.PointLight>(null!);
  const { viewport } = useThree();

  useFrame((state) => {
    if (light.current) {
      light.current.position.x = (state.pointer.x * viewport.width) / 2;
      light.current.position.y = (state.pointer.y * viewport.height) / 2 + 2;
    }
  });

  return <pointLight ref={light} color="#e8590c" intensity={1} distance={8} />;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.2} color="#e8590c" />
      <MouseLight />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <CarBody />
      </Float>

      <GlowRing />
      <GlowRing2 />
      <ParticleCloud />
      <GroundPlane />
      <GroundGrid />

      <Environment preset="city" />
    </>
  );
}

export function CarShowcase3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 5.5], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
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
