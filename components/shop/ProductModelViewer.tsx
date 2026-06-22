"use client";

import { Bounds, ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { Color, RepeatWrapping, SRGBColorSpace, TextureLoader } from "three";

type ProductModelViewerProps = {
  modelPath: string;
  color?: string;
  wrapTextureUrl?: string;
};

function scoreWrapSurface(mesh: Mesh) {
  const name = `${mesh.name} ${mesh.material && !Array.isArray(mesh.material) ? mesh.material.name : ""}`.toLowerCase();
  const preferred = ["front", "face", "body", "case", "remote", "controller", "shell", "cover", "black"];
  const avoided = ["button", "knob", "logo", "led", "light", "ring", "loop"];
  let score = 0;

  preferred.forEach((word) => {
    if (name.includes(word)) {
      score += 20;
    }
  });

  avoided.forEach((word) => {
    if (name.includes(word)) {
      score -= 30;
    }
  });

  if (mesh.geometry?.attributes?.uv) {
    score += 40;
  }

  mesh.geometry?.computeBoundingSphere();
  score += (mesh.geometry?.boundingSphere?.radius ?? 0) * 10;

  return score;
}

function cloneMaterial(material: Mesh["material"]) {
  if (Array.isArray(material)) {
    return material.map((item) => item.clone());
  }

  return material?.clone();
}

function Model({ modelPath, color, wrapTextureUrl }: ProductModelViewerProps) {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(() => {
    const nextScene = gltf.scene.clone(true);
    nextScene.traverse((child) => {
      const mesh = child as Mesh;
      if (mesh.material) {
        mesh.material = cloneMaterial(mesh.material);
      }
    });
    return nextScene;
  }, [gltf.scene]);

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
          if (!wrapTextureUrl) {
            mat.map = null;
          }
          mat.needsUpdate = true;
        }
      };

      if (Array.isArray(material)) {
        material.forEach(tint);
      } else {
        tint(material);
      }
    });
  }, [color, scene, wrapTextureUrl]);

  useEffect(() => {
    if (!wrapTextureUrl) {
      return;
    }

    let cancelled = false;
    const loader = new TextureLoader();

    loader.load(
      wrapTextureUrl,
      (texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }

        texture.colorSpace = SRGBColorSpace;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(1, 1);
        texture.flipY = false;

        const candidates: Mesh[] = [];
        scene.traverse((child) => {
          const mesh = child as Mesh;
          if (mesh.isMesh && mesh.material && mesh.geometry?.attributes?.uv) {
            candidates.push(mesh);
          }
        });

        const target = candidates.sort((a, b) => scoreWrapSurface(b) - scoreWrapSurface(a))[0];
        if (!target) {
          return;
        }

        const applyTexture = (mat: MeshStandardMaterial) => {
          if (!mat.color) {
            return;
          }

          mat.color = new Color("#ffffff");
          mat.map = texture;
          mat.roughness = 0.78;
          mat.metalness = 0.05;
          mat.needsUpdate = true;
        };

        if (Array.isArray(target.material)) {
          target.material.forEach((mat) => applyTexture(mat as MeshStandardMaterial));
        } else {
          applyTexture(target.material as MeshStandardMaterial);
        }
      },
      undefined,
      () => {
        // Keep the model usable if a local upload cannot be converted into a texture.
      },
    );

    return () => {
      cancelled = true;
    };
  }, [scene, wrapTextureUrl]);

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

export function ProductModelViewer({ modelPath, color = "#111111", wrapTextureUrl }: ProductModelViewerProps) {
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
              <Model modelPath={modelPath} color={color} wrapTextureUrl={wrapTextureUrl} />
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
      {wrapTextureUrl ? (
        <div className="model-skin-preview" aria-label="selected controller skin preview">
          <span>skin applied</span>
          <img src={wrapTextureUrl} alt="selected controller wrap texture" />
        </div>
      ) : null}
    </div>
  );
}

useGLTF.preload("/models/ypod-controller.glb");
