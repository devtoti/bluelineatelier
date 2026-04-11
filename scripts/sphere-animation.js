import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

async function main() {

  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 60;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222); // dark gray

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  
  function rotateObject(object, time) {
    object.rotation.x = time;
    object.rotation.y = time;
  }
  const phiStart = Math.PI * 0.25;
  const thetaStart = Math.PI * 1;
  const thetaLengthMax = Math.PI * 1.0;
  const phiLengthMax = Math.PI * 2.0;
  const growDuration = 8;    // seconds to grow
  const holdDuration = 5;    // seconds to hold
  const shrinkDuration = 8;  // seconds to shrink
  const cycleDuration = growDuration + holdDuration + shrinkDuration + holdDuration;

  const material = new THREE.PointsMaterial({ color: 0xd6363c, size: 0.05 });
  const materialOuter = new THREE.PointsMaterial({ color: 0xd6363c, size: 2, sizeAttenuation: false });
  const materialLines = new THREE.LineBasicMaterial({ color: 0xeeeeee, size: 0.001, transparent: true, opacity: 0.15 });
  const spherePointsOuter = new THREE.Points(new THREE.SphereGeometry(2, 48, 24), materialOuter);
  const spherePoints = new THREE.Points(new THREE.SphereGeometry(1, 24, 12, phiStart, 0, thetaStart, 0), material);
  const sphereLines = new THREE.LineSegments(new THREE.SphereGeometry(1, 24, 12, phiStart, 0, thetaStart, 0), materialLines);

  scene.add(spherePoints);
  scene.add(sphereLines);
  scene.add(spherePointsOuter);

  // OrbitControls — rotate the scene in place with mouse drag
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;

  function render(time) {
    const timeSec = time / 1000;
    time *= 0.0001;
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // Compute phiLength based on cycle phase
    // timeSec computed from raw ms above, before the 0.0001 multiplier
    const cyclePos = timeSec % cycleDuration;
    let progress;
    if (cyclePos < growDuration) {
      // Growing: 0 → 1 over 8s
      progress = cyclePos / growDuration;
    } else if (cyclePos < growDuration + holdDuration) {
      // Hold full
      progress = 1;
    } else if (cyclePos < growDuration + holdDuration + shrinkDuration) {
      // Shrinking: 1 → 0 over 8s
      const shrinkPos = cyclePos - growDuration - holdDuration;
      progress = 1 - shrinkPos / shrinkDuration;
    } else {
      // Hold empty
      progress = 0;
    }

    const phiLength = phiLengthMax * progress;
    const thetaLength = thetaLengthMax * progress;

    // Rebuild geometry with current phiLength and thetaLength
    spherePoints.geometry.dispose();
    sphereLines.geometry.dispose();
    const newGeo = new THREE.SphereGeometry(1, 24, 12, phiStart, phiLength, thetaStart, thetaLength);
    spherePoints.geometry = newGeo;
    sphereLines.geometry = newGeo;

    rotateObject(spherePoints, time);
    rotateObject(sphereLines, time);
    rotateObject(spherePointsOuter, time);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
main();
