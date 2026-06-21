"use client";

import { Bounds, ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { Color } from "three";

type ProductModelViewerProps = {
  modelPath: string;
  color?: string;
};

function Model({ modelPath, color }: ProductModelViewerProps) {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    if (!color) {
      return;
    }

    scene.traverse((child) => {
      const mesh = child as Mesh;
      const material = mesh.material as MeshStandardMaterial | MeshStandardMaterial[] | undefined;
      if (!material) {
        return;
      }

      const tint = (mat: MeshStandardMaterial) => {
        if (mat.color) {
          mat.color = new Color(color);
          mat.roughness = Math.max(mat.roughness ?? 0.72, 0.72);
          mat.metalness = Math.min(mat.metalness ?? 0.08, 0.18);
        }
      };

      if (Array.isArray(material)) {
        material.forEach(tint);
      } else {
        tint(material);
      }
    });
  }, [color, scene]);

  return (
    <Bounds fit clip observe margin={1.75}>
      <primitive object={scene as Group} />
    </Bounds>
  );
}

function ViewerFallback({ message }: { message: string }) {
  return <div className="model-fallback">{message}</div>;
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function ProductModelViewer({ modelPath, color = "#111111" }: ProductModelViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="model-viewer">
      <ModelErrorBoundary fallback={<ViewerFallback message="3D product view could not load." />}>
        <Suspense fallback={<div className="model-loading">loading 3D product</div>}>
          <Canvas
            shadows
            camera={{ position: [0.3, 1.1, 7.2], fov: 30 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.75]}
          >
            <color attach="background" args={["#090909"]} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 5, 3]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-3, 2, -4]} intensity={0.65} />
            <Environment preset="studio" />
            <group position={[0, -0.04, 0]} rotation={[0.06, -0.1, 0]}>
              <Model modelPath={modelPath} color={color} />
            </group>
            <ContactShadows position={[0, -1.18, 0]} opacity={0.34} scale={8} blur={3.2} far={3.5} />
            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={0.65}
              enablePan={false}
              enableZoom={false}
              minDistance={4.2}
              maxDistance={8.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Canvas>
        </Suspense>
      </ModelErrorBoundary>
      <button className="shop-button model-toggle" type="button" onClick={() => setAutoRotate((value) => !value)}>
        {autoRotate ? "pause rotation" : "auto rotate"}
      </button>
    </div>
  );
}

useGLTF.preload("/models/ypod-controller.glb");
