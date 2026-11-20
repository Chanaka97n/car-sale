"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GaugeRing({
  radius,
  color,
  speed,
  opacity,
}: {
  radius: number;
  color: string;
  speed: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.02, 16, 64, Math.PI * 1.5]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function Needle() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (ref.current) {
      const target =
        Math.PI * 0.75 -
        (Math.sin(state.clock.elapsedTime * 0.5) * 0.5 + 0.5) *
          Math.PI *
          1.2;
      ref.current.rotation.z +=
        (target - ref.current.rotation.z) * 0.03;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0.6, 0, 0]}>
        <boxGeometry args={[1.2, 0.03, 0.03]} />
        <meshStandardMaterial
          color="#1573DF"
          emissive="#1573DF"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function TickMarks() {
  const marks = useMemo(() => {
    const result = [];
    const totalMarks = 30;
    for (let i = 0; i < totalMarks; i++) {
      const angle = (Math.PI * 0.75) - (i / (totalMarks - 1)) * Math.PI * 1.5;
      const isMajor = i % 5 === 0;
      const innerR = isMajor ? 1.15 : 1.2;
      const outerR = 1.3;
      result.push({
        x1: Math.cos(angle) * innerR,
        y1: Math.sin(angle) * innerR,
        x2: Math.cos(angle) * outerR,
        y2: Math.sin(angle) * outerR,
        isMajor,
      });
    }
    return result;
  }, []);

  const positions = useMemo(() => {
    const pos = new Float32Array(marks.length * 6);
    marks.forEach((m, i) => {
      pos[i * 6] = m.x1;
      pos[i * 6 + 1] = m.y1;
      pos[i * 6 + 2] = 0;
      pos[i * 6 + 3] = m.x2;
      pos[i * 6 + 4] = m.y2;
      pos[i * 6 + 5] = 0;
    });
    return pos;
  }, [marks]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#555555" transparent opacity={0.6} />
    </lineSegments>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />

      <GaugeRing radius={1.4} color="#1573DF" speed={0.3} opacity={0.3} />
      <GaugeRing radius={1.5} color="#3B8FEF" speed={-0.2} opacity={0.15} />
      <TickMarks />
      <Needle />

      <mesh position={[0, -0.4, 0]}>
        <ringGeometry args={[0.9, 1.0, 64, 1, Math.PI * 0.25, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#1573DF"
          emissive="#1573DF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

export function SpeedGauge3D() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
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
