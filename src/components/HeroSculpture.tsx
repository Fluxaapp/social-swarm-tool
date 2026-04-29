import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Premium faceted sculpture for hero section.
 * - Polished smoked-glass / obsidian material in cold neutrals.
 * - Subtle wireframe network around it.
 * - Rotates softly based on scroll progress.
 */

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setP(Math.min(1, window.scrollY / max));
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

function Sculpture({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.LineSegments>(null);

  // Build a refined faceted form: bevel-stretched octahedron-like polyhedron.
  const geom = useRef<THREE.BufferGeometry>();
  if (!geom.current) {
    const g = new THREE.IcosahedronGeometry(1.15, 0);
    // Slightly stretch for a more sculptural silhouette
    g.scale(1, 1.25, 1);
    g.computeVertexNormals();
    geom.current = g;
  }

  // Wireframe support: edges of a larger, lower-poly polyhedron
  const wireGeom = useRef<THREE.BufferGeometry>();
  if (!wireGeom.current) {
    const base = new THREE.OctahedronGeometry(1.85, 1);
    base.scale(1.05, 1.3, 1.05);
    wireGeom.current = new THREE.EdgesGeometry(base, 1);
  }

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const s = scrollRef.current;
    // Calm idle + scroll-driven rotation
    const targetY = s * Math.PI * 1.4 + t * 0.05;
    const targetX = s * 0.6 - 0.15 + Math.sin(t * 0.4) * 0.03;
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 3);
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 3);
    if (wire.current) {
      wire.current.rotation.y = group.current.rotation.y * 0.4;
      wire.current.rotation.x = group.current.rotation.x * 0.3;
    }
  });

  return (
    <group>
      {/* Soft floating idle on the whole assembly */}
      <Float speed={0.8} rotationIntensity={0} floatIntensity={0.35} floatingRange={[-0.04, 0.04]}>
        <group ref={group}>
          <mesh geometry={geom.current} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={new THREE.Color("#1a1a1d")}
              metalness={0.85}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.12}
              reflectivity={0.6}
              envMapIntensity={0.9}
            />
          </mesh>

          {/* Inner subtle highlight core */}
          <mesh geometry={geom.current} scale={0.995}>
            <meshBasicMaterial
              color={new THREE.Color("#2a2a2e")}
              transparent
              opacity={0.0}
            />
          </mesh>

          {/* Tight edge outline for crisp facets */}
          <lineSegments>
            <edgesGeometry args={[geom.current, 1]} />
            <lineBasicMaterial color={new THREE.Color("#5a5a60")} transparent opacity={0.35} />
          </lineSegments>
        </group>
      </Float>

      {/* Secondary wireframe network — very subtle, slower */}
      <lineSegments ref={wire} geometry={wireGeom.current}>
        <lineBasicMaterial
          color={new THREE.Color("#2b2b2f")}
          transparent
          opacity={0.18}
        />
      </lineSegments>

      {/* Connecting "constellation" points */}
      <Points />
    </group>
  );
}

function Points() {
  const ref = useRef<THREE.Points>(null);
  const geom = useRef<THREE.BufferGeometry>();
  if (!geom.current) {
    const positions: number[] = [];
    const n = 14;
    for (let i = 0; i < n; i++) {
      const r = 1.9 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 1.25,
        r * Math.sin(phi) * Math.sin(theta),
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.current = g;
  }
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.04;
  });
  return (
    <points ref={ref} geometry={geom.current}>
      <pointsMaterial size={0.025} color={new THREE.Color("#8a8a90")} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function HeroSculpture({ simplified = false }: { simplified?: boolean }) {
  const scrollRef = useRef(0);
  const progress = useScrollProgress();
  scrollRef.current = progress;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Atmospheric backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 60% 45%, rgba(20,20,24,0.10) 0%, rgba(20,20,24,0.04) 40%, rgba(255,255,255,0) 70%)",
        }}
      />
      <Canvas
        dpr={[1, simplified ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.2], fov: 32 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#9aa0a6" />
        <Environment preset="city" />
        <Sculpture scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}

export default HeroSculpture;
