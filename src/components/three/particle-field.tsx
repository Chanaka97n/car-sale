"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const count = 800;
  const ref = useRef<THREE.Points>(null!);
  const { viewport } = useThree();

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const orange = new THREE.Color("#e8590c");
    const white = new THREE.Color("#ffffff");
    const dim = new THREE.Color("#333333");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;

      const c = Math.random();
      const color = c < 0.1 ? orange : c < 0.2 ? white : dim;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, velocities: vel, colors: col };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    const mx = state.pointer.x * viewport.width * 0.5;
    const my = state.pointer.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      const dx = posArray[i3] - mx;
      const dy = posArray[i3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        const force = (2 - dist) * 0.001;
        posArray[i3] += dx * force;
        posArray[i3 + 1] += dy * force;
      }

      if (Math.abs(posArray[i3]) > 10) velocities[i3] *= -1;
      if (Math.abs(posArray[i3 + 1]) > 10) velocities[i3 + 1] *= -1;
      if (Math.abs(posArray[i3 + 2]) > 5) velocities[i3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null!);
  const count = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const i6 = i * 6;
      const angle = (i / count) * Math.PI * 2;
      const r1 = 3 + Math.random() * 4;
      const r2 = 3 + Math.random() * 4;
      pos[i6] = Math.cos(angle) * r1;
      pos[i6 + 1] = (Math.random() - 0.5) * 6;
      pos[i6 + 2] = Math.sin(angle) * r1 * 0.3;
      pos[i6 + 3] = Math.cos(angle + 0.3) * r2;
      pos[i6 + 4] = (Math.random() - 0.5) * 6;
      pos[i6 + 5] = Math.sin(angle + 0.3) * r2 * 0.3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      (ref.current.material as THREE.Material).opacity =
        0.04 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#e8590c"
        transparent
        opacity={0.05}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function Scene() {
  return (
    <>
      <Particles />
      <ConnectionLines />
    </>
  );
}

export function ParticleField() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
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
