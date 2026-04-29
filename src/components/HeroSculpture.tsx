import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Premium faceted polyhedron sculpture.
 * - Smoked glass / obsidian material
 * - Cold neutral palette
 * - Subtle wireframe network around it
 * - Rotation tied to scroll progress
 */

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setP(Math.min(1, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

function Sculpture({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Mesh>(null!);

  // Custom faceted geometry: a deformed icosahedron for editorial silhouette.
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 1);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = (Math.sin(v.x * 2.1) + Math.cos(v.y * 1.8) + Math.sin(v.z * 2.4)) * 0.06;
      v.multiplyScalar(1 + n);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  // Wireframe network: edges of a larger, sparser icosahedron
  const wireGeometry = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(1.55, 0);
    return new THREE.EdgesGeometry(base, 1);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const sp = scrollRef.current;
    if (group.current) {
      // gentle idle float + scroll-driven rotation
      group.current.rotation.y = sp * Math.PI * 1.2 + t * 0.05;
      group.current.rotation.x = sp * Math.PI * 0.3 + Math.sin(t * 0.4) * 0.04;
      group.current.position.y = Math.sin(t * 0.6) * 0.04;
    }
  });

  return (
    <group ref={group}>
      {/* Wireframe support */}
      <lineSegments geometry={wireGeometry}>
        <lineBasicMaterial color="#9aa0a6" transparent opacity={0.18} />
      </lineSegments>

      {/* Outer faint hull */}
      <mesh scale={1.5}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#1a1a1c" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Main sculpture */}
      <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.15}>
        <mesh ref={inner} geometry={geometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#2a2c30"
            metalness={0.85}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.2}
            reflectivity={0.6}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Inner accent core */}
        <mesh scale={0.55}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#0c0c0e"
            metalness={1}
            roughness={0.05}
            envMapIntensity={1.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroSculpture() {
  const scrollRef = useRef(0);
  const progress = useScrollProgress();
  scrollRef.current = progress;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Subtle radial atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 60% 50%, rgba(20,20,24,0.08), transparent 70%)",
        }}
      />
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 2]} intensity={0.7} color="#ffffff" />
        <directionalLight position={[-3, -2, -1]} intensity={0.25} color="#b8bcc4" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Sculpture scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
