"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function SphereAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Camera
    const fov = 60;
    const near = 0.1;
    const far = 1000;
    const isMobile = window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(fov, 1, near, far);
    camera.position.z = isMobile ? 5 : 6;

    // Scene (transparent background — parent controls bg)
    const scene = new THREE.Scene();

    // Sphere parameters
    const phiStart = Math.PI * 0.25;
    const thetaStart = Math.PI * 1;
    const thetaLengthMax = Math.PI * 1.0;
    const phiLengthMax = Math.PI * 2.0;
    const growDuration = 10;
    const holdDuration = 8;
    const shrinkDuration = 10;
    const cycleDuration =
      growDuration + holdDuration + shrinkDuration + holdDuration;

    // Materials
    const material = new THREE.PointsMaterial({
      color: 0xd6363c,
      size: 0.04,
    });
    const materialOuter = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.05,
    });
    const materialLines = new THREE.LineBasicMaterial({
      color: 0xeeeeee,
      transparent: true,
      opacity: 0.15,
    });

    // Meshes
    const spherePointsOuter = new THREE.Points(
      new THREE.SphereGeometry(2, 48, 24),
      materialOuter,
    );
    const spherePoints = new THREE.Points(
      new THREE.SphereGeometry(1, 24, 12, phiStart, 0, thetaStart, 0),
      material,
    );
    const sphereLines = new THREE.LineSegments(
      new THREE.SphereGeometry(1, 24, 12, phiStart, 0, thetaStart, 0),
      materialLines,
    );

    const sphereX = isMobile ? 0 : 6;
    spherePoints.position.x = sphereX;
    sphereLines.position.x = sphereX;
    spherePointsOuter.position.x = sphereX;
    scene.add(spherePoints);
    scene.add(sphereLines);
    scene.add(spherePointsOuter);

    // OrbitControls — drag to rotate, no pan/zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(isMobile ? 0 : 6, 0, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;

    // Sizing helper
    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Rotation helper
    function rotateObject(object: THREE.Object3D, t: number) {
      object.rotation.x = t;
      object.rotation.y = t;
    }

    // Render loop
    let rafId: number;
    function render(time: number) {
      const timeSec = time / 1000;
      const t = time * 0.0001;

      // Cycle progress
      let progress: number;
      if (prefersReducedMotion) {
        progress = 1;
      } else {
        const cyclePos = timeSec % cycleDuration;
        if (cyclePos < growDuration) {
          progress = cyclePos / growDuration;
        } else if (cyclePos < growDuration + holdDuration) {
          progress = 1;
        } else if (cyclePos < growDuration + holdDuration + shrinkDuration) {
          const shrinkPos = cyclePos - growDuration - holdDuration;
          progress = 1 - shrinkPos / shrinkDuration;
        } else {
          progress = 0;
        }
      }

      const phiLength = phiLengthMax * progress;
      const thetaLength = thetaLengthMax * progress;

      // Rebuild inner geometry
      spherePoints.geometry.dispose();
      sphereLines.geometry.dispose();
      const newGeo = new THREE.SphereGeometry(
        1,
        24,
        12,
        phiStart,
        phiLength,
        thetaStart,
        thetaLength,
      );
      spherePoints.geometry = newGeo;
      sphereLines.geometry = newGeo;

      if (!prefersReducedMotion) {
        rotateObject(spherePoints, t);
        rotateObject(sphereLines, t);
        rotateObject(spherePointsOuter, t);
      }

      controls.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (
          obj instanceof THREE.Mesh ||
          obj instanceof THREE.Points ||
          obj instanceof THREE.LineSegments
        ) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="sphere-animation sphere-container w-full h-auto flex-2 md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-3"
      aria-hidden="true"
    />
  );
}
