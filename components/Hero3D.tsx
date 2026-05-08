"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero3DPlaceholder } from "./Hero3DPlaceholder";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Premium 3D Hero Settings
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  modelPath: "/models/updatedmodel.draco.glb",

  targetSize: 8.5,
  framePadding: 0.92,
  cameraFov: 36,

  lookAtYOffset: -0.05,

  startRotationY: -2.69,
  startRotationX: 0.30,
  endRotationY: -2.95,
  endRotationX: 0.18,

  entranceDuration: 1.4,
  entranceSpinTurns: 0.18,
  entranceScaleFrom: 0.88,

  floatAmplitude: 0.06,
  floatSpeed: 0.4,
  autoRotateSpeed: 0.06,
  breathAmplitude: 0.012,
  breathSpeed: 0.5,

  parallaxDeg: 12,
  parallaxSmoothing: 0.055,

  scrollSpinTurns: 1.2,

  envIntensity: 0.4,
  toneExposure: 1.15,
  shadowMapSize: 1024,
};

// ── MARBLE FLOOR TEXTURE ──────────────────────────────────────────────────────
function createMarbleTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const px = imageData.data;

  const hash = (n: number) => { const s = Math.sin(n) * 43758.5453; return s - Math.floor(s); };
  const noise2d = (x: number, y: number) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = hash(ix + iy * 57), b = hash(ix + 1 + iy * 57);
    const c = hash(ix + (iy + 1) * 57), d = hash(ix + 1 + (iy + 1) * 57);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  };
  const turbulence = (x: number, y: number) => {
    let v = 0, a = 0.5, f = 1;
    for (let i = 0; i < 4; i++) { v += Math.abs(noise2d(x * f, y * f) - 0.5) * a; a *= 0.5; f *= 2.1; }
    return v;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * 5, ny = (y / size) * 5;
      const t = turbulence(nx, ny);
      const vein = Math.sin((nx + ny) * 1.8 + t * 9) * 0.5 + 0.5;
      const bright = 0.78 + vein * 0.18;
      const i = (y * size + x) * 4;
      px[i]     = Math.min(255, Math.floor(bright * 242));
      px[i + 1] = Math.min(255, Math.floor(bright * 236));
      px[i + 2] = Math.min(255, Math.floor(bright * 225));
      px[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch {
    return false;
  }
}

// Matches phone-sized or coarse-pointer devices (phones + iPads)
function getDeviceProfile(): "phone" | "tablet" | "desktop" {
  if (window.matchMedia("(max-width: 768px) and (pointer: coarse)").matches) return "phone";
  if (window.matchMedia("(max-width: 1180px) and (pointer: coarse)").matches) return "tablet";
  return "desktop";
}

const TEXTURE_SLOTS = [
  "map", "normalMap", "roughnessMap", "emissiveMap", "metalnessMap", "aoMap",
] as const;

// Reused in traverse loops — avoids per-mesh allocation and GC pressure.
const ZERO_COLOR = new THREE.Color(0, 0, 0);

export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [placeholderMounted, setPlaceholderMounted] = useState(true);

  const rotTargetRef = useRef({ x: CONFIG.startRotationX, y: CONFIG.startRotationY });

  // Fade the placeholder out, then unmount it after the transition finishes
  useEffect(() => {
    if (status !== "ready") return;
    const t = setTimeout(() => setPlaceholderMounted(false), 700);
    return () => clearTimeout(t);
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    if (!isWebGLAvailable()) {
      setStatus("error");
      return;
    }

    const deviceProfile = getDeviceProfile();
    const isPhone = deviceProfile === "phone";
    const isTablet = deviceProfile === "tablet";
    const isMobile = isPhone || isTablet; // legacy compat for non-shadow-related checks

    // ── Renderer ─────────────────────────────────────────────────────────────
    const dprCap = isPhone ? 1 : isTablet ? 1.5 : Math.min(window.devicePixelRatio, 2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(dprCap);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isPhone;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = CONFIG.toneExposure;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Scene & camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      CONFIG.cameraFov,
      container.clientWidth / container.clientHeight,
      0.01,
      2000
    );
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    // ── Environment map ──────────────────────────────────────────────────────
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = CONFIG.envIntensity;

    // ── Lighting ─────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xf0f0f8, 0.08));

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 3.2);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = !isPhone;
    const shadowMapSize = isPhone ? 0 : (isTablet ? 512 : CONFIG.shadowMapSize);
    if (!isPhone) {
      keyLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
      keyLight.shadow.bias = -0.0002;
      keyLight.shadow.normalBias = 0.015;
      keyLight.shadow.radius = 6;
    }
    scene.add(keyLight);

    const spotLight = new THREE.SpotLight(0xb8d4ff, 1.2);
    spotLight.position.set(-6, 8, 5);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.85;
    spotLight.decay = 1.6;
    spotLight.distance = 70;
    spotLight.castShadow = false;
    scene.add(spotLight);

    const rimLight = new THREE.SpotLight(0xfff2e0, 5.5);
    rimLight.position.set(-3, 11, -9);
    rimLight.angle = Math.PI / 7;
    rimLight.penumbra = 0.5;
    rimLight.decay = 1.2;
    rimLight.distance = 80;
    rimLight.castShadow = false;
    scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0xffd8b0, 0.18);
    bounceLight.position.set(6, -2, 4);
    scene.add(bounceLight);

    if (isMobile) {
      CONFIG.envIntensity = 0.7;
      CONFIG.autoRotateSpeed = 0.04;
      CONFIG.floatAmplitude = 0.03;
      CONFIG.breathAmplitude = 0.008;
    }

    // ── Model group ──────────────────────────────────────────────────────────
    const modelGroup = new THREE.Group();
    modelGroup.rotation.y = CONFIG.startRotationY;
    modelGroup.rotation.x = CONFIG.startRotationX;
    scene.add(modelGroup);

    const rotTarget = rotTargetRef.current;
    rotTarget.x = CONFIG.startRotationX;
    rotTarget.y = CONFIG.startRotationY;

    // ── Camera target & distance bounds (replaces OrbitControls) ────────────
    const cameraTarget = new THREE.Vector3();
    let minCamDistance = 0;
    let maxCamDistance = Infinity;

    // ── Loaders ──────────────────────────────────────────────────────────────
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.setMeshoptDecoder(MeshoptDecoder);

    let model: THREE.Group | null = null;
    let floorMesh: THREE.Mesh | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let elapsed = 0;
    let lastFrameTime = performance.now();
    let animationId = 0;
    let isPaused = false;
    let entranceDone = false;
    let reducedMotion = false;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = prefersReducedMotion.matches;

    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    const scrollHandler = () => {
      const delta = window.scrollY - lastScrollY;
      scrollVelocity += delta * 0.002;
      lastScrollY = window.scrollY;
      requestTick();
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    const frameCamera = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const radius = Math.max(size.x, size.y, size.z) * 0.5;
      const aspect = container.clientWidth / container.clientHeight;
      const fovV = THREE.MathUtils.degToRad(camera.fov);
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * aspect);
      const distV = radius / Math.sin(fovV / 2);
      const distH = radius / Math.sin(fovH / 2);
      const distance = Math.max(distV, distH) * CONFIG.framePadding;

      const lookAt = new THREE.Vector3(center.x, center.y + CONFIG.lookAtYOffset, center.z);

      camera.position.set(center.x, center.y, center.z + distance);
      camera.near = Math.max(0.01, distance / 100);
      camera.far = distance * 100;
      camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
      camera.updateProjectionMatrix();
      cameraTarget.copy(lookAt);
      minCamDistance = distance * 0.4;
      maxCamDistance = distance * 2.5;

      const shadowSize = radius * 2.8;
      const shadowCam = keyLight.shadow.camera as THREE.OrthographicCamera;
      shadowCam.left = -shadowSize;
      shadowCam.right = shadowSize;
      shadowCam.top = shadowSize;
      shadowCam.bottom = -shadowSize;
      shadowCam.near = 0.1;
      shadowCam.far = shadowSize * 8;
      shadowCam.updateProjectionMatrix();

      keyLight.position.set(center.x + radius * 1.6, center.y + radius * 3.0, center.z + radius * 1.5);
      keyLight.target.position.copy(center);
      scene.add(keyLight.target);

      spotLight.position.set(center.x - radius * 2.0, center.y + radius * 2.5, center.z + radius * 1.2);
      spotLight.target.position.copy(center);
      scene.add(spotLight.target);

      rimLight.position.set(center.x - radius * 1.0, center.y + radius * 3.2, center.z - radius * 2.5);
      rimLight.target.position.copy(center);
      scene.add(rimLight.target);
    };

    const sanitizeModel = (root: THREE.Object3D) => {
      root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        mesh.visible = true;

        const fixMaterial = (mat: THREE.Material) => {
          if (!mat) return;
          if ((mat as THREE.MeshStandardMaterial).side === undefined) return;

          const std = mat as THREE.MeshStandardMaterial;

          if (std.map) std.map.colorSpace = THREE.SRGBColorSpace;

          // Replace with Basic Material to disable real-time lighting calculation
          const basicMat = new THREE.MeshBasicMaterial({
            map: std.map,
            color: std.color,
            side: std.side,
            transparent: std.transparent,
            opacity: std.opacity,
            wireframe: std.wireframe,
          });

          // Hack to overwrite the material on the mesh
          mesh.material = basicMat;
        };

        if (Array.isArray(mesh.material)) mesh.material.forEach(fixMaterial);
        else fixMaterial(mesh.material);
      });
    };

    const loadTimeout = window.setTimeout(() => {
      if (!model) {
        console.error("[Hero3D] GLB load timed out after 45s");
        setStatus("error");
      }
    }, 45000);

    const loadModel = () => {
      loader.load(
        CONFIG.modelPath,
        (gltf) => {
          window.clearTimeout(loadTimeout);
          model = gltf.scene;

          sanitizeModel(model);

          const measureBox = new THREE.Box3().setFromObject(model);
          const measureSize = measureBox.getSize(new THREE.Vector3());
          const maxDim = Math.max(measureSize.x, measureSize.y, measureSize.z) || 1;
          const scaleFactor = CONFIG.targetSize / maxDim;
          model.scale.setScalar(scaleFactor);
          model.userData.maxDim = maxDim;

          const finalBox = new THREE.Box3().setFromObject(model);
          const finalCenter = finalBox.getCenter(new THREE.Vector3());
          model.position.sub(finalCenter);

          modelGroup.add(model);

          frameCamera(modelGroup);

          // Defer marble texture to idle time — only needed after model loads
          const buildFloor = () => {
            const floorBox = new THREE.Box3().setFromObject(modelGroup);
            const marbleTex = createMarbleTexture();
            const floorMat = new THREE.MeshStandardMaterial({
              map: marbleTex,
              roughness: 0.12,
              metalness: 0.06,
              envMapIntensity: 1.2,
            });
            const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), floorMat);
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = floorBox.min.y;
            floor.receiveShadow = true;
            scene.add(floor);
            floorMesh = floor;
          };

          if (typeof requestIdleCallback !== "undefined") {
            requestIdleCallback(buildFloor, { timeout: 2000 });
          } else {
            setTimeout(buildFloor, 0);
          }

          // ── Bulb lighting — find light meshes, glow them, place point lights ──
          // Cap the number of dynamic point lights — every extra real-time light
          // costs per-frame; emissive material alone gives the glow look without
          // the cost. Phones get zero point lights, others get a small budget.
          const MAX_BULB_LIGHTS = isPhone ? 0 : isTablet ? 2 : 4;
          const bulbPositions: THREE.Vector3[] = [];
          const bulbKeywords = /light|bulb|lamp|glow|led|emit|neon|tube|globe|lantern|flame|candle/i;
          model.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh) return;

            const name = mesh.name || "";
            const isEmissive = (() => {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              return mats.some((m) => {
                const s = m as THREE.MeshStandardMaterial;
                return s.emissive && !s.emissive.equals(ZERO_COLOR);
              });
            })();
            const isBulb = bulbKeywords.test(name) || isEmissive;

            if (!isBulb) return;

            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              const s = m as THREE.MeshStandardMaterial;
              s.emissive = new THREE.Color(0xfffde8);
              s.emissiveIntensity = 8.0;
              s.needsUpdate = true;
            });

            const wp = new THREE.Vector3();
            mesh.getWorldPosition(wp);
            bulbPositions.push(wp);
          });

          // Pick up to MAX_BULB_LIGHTS bulb anchors, evenly spaced through the list,
          // so we get a representative spread instead of clustering on the first few.
          if (bulbPositions.length > 0 && MAX_BULB_LIGHTS > 0) {
            const step = Math.max(1, Math.floor(bulbPositions.length / MAX_BULB_LIGHTS));
            for (let i = 0, count = 0; i < bulbPositions.length && count < MAX_BULB_LIGHTS; i += step, count++) {
              const bulbLight = new THREE.PointLight(0xffd97a, 6.0, 12, 2.0);
              bulbLight.position.copy(bulbPositions[i]);
              scene.add(bulbLight);
            }
          }

          if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
          }

          setStatus("ready");

          modelGroup.scale.setScalar(CONFIG.entranceScaleFrom);
          gsap.to(modelGroup.scale, {
            x: 1, y: 1, z: 1,
            duration: CONFIG.entranceDuration,
            ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            onComplete: () => { entranceDone = true; },
          });

          rotTarget.y = CONFIG.startRotationY + Math.PI * 2 * CONFIG.entranceSpinTurns;
          rotTarget.x = CONFIG.startRotationX - 0.1;
          gsap.to(rotTarget, {
            y: CONFIG.startRotationY,
            x: CONFIG.startRotationX,
            duration: CONFIG.entranceDuration,
            ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          });

          const heroSection = document.getElementById("hero-section");
          if (heroSection) {
            gsap.to(rotTarget, {
              x: CONFIG.endRotationX,
              y: CONFIG.endRotationY - Math.PI * 2 * CONFIG.scrollSpinTurns,
              ease: "none",
              delay: CONFIG.entranceDuration * 0.7,
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: 1.2,
                onUpdate: () => requestTick(),
              },
            });
          }
        },
        undefined,
        (err) => {
          window.clearTimeout(loadTimeout);
          console.error("[Hero3D] GLB load failed:", err);
          setStatus("error");
        }
      );
    };

    // ── Lazy load: IntersectionObserver fires first; 10 s fallback is a true
    //    safety net for the rare case IntersectionObserver never reports.
    let modelLoadStarted = false;
    const modelObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !modelLoadStarted) {
          modelLoadStarted = true;
          modelObserver.disconnect();
          loadModel();
        }
      },
      { threshold: 0.01 }
    );
    modelObserver.observe(container);
    const safetyTimer = window.setTimeout(() => {
      if (!modelLoadStarted) {
        modelLoadStarted = true;
        modelObserver.disconnect();
        loadModel();
      }
    }, 10000);

    // ── Viewport pause observer (200 px lookahead for smooth re-entry) ───────
    let heroInViewport = true;
    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        heroInViewport = entry.isIntersecting;
        if (entry.isIntersecting) requestTick();
      },
      { rootMargin: "200px" }
    );
    viewportObserver.observe(container);

    // ── Interaction ───────────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      requestTick();
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartRotY = 0;
    let dragStartRotX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartRotY = rotTarget.y;
      dragStartRotX = rotTarget.x;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - dragStartX) * 0.007;
      const dy = (e.clientY - dragStartY) * 0.004;
      rotTarget.y = dragStartRotY + dx;
      rotTarget.x = Math.max(-0.7, Math.min(0.1, dragStartRotX + dy));
      requestTick();
    };

    const onPointerUp = () => {
      isDragging = false;
      canvas.style.cursor = "grab";
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    let lastTouchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = (dist - lastTouchDist) * 0.01;
        const currentDist = camera.position.distanceTo(cameraTarget);
        const newDist = Math.max(minCamDistance, Math.min(maxCamDistance, currentDist - delta));
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        camera.position.copy(cameraTarget).addScaledVector(dir.negate(), newDist);
        lastTouchDist = dist;
        requestTick();
      }
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onWheel = (e: WheelEvent) => {
      if (!model) return;

      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(modelGroup, true);

      if (hits.length > 0) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        const dist = camera.position.distanceTo(cameraTarget);
        const nextDist = Math.max(minCamDistance, Math.min(maxCamDistance, dist * zoomFactor));
        camera.position.copy(cameraTarget).addScaledVector(dir.negate(), nextDist);
        camera.updateProjectionMatrix();
        requestTick();
      }
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    container.style.opacity = "1";
    container.style.transform = "scale(1)";

    const handleVisibilityChange = () => { isPaused = document.hidden; };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let resizeTimer: ReturnType<typeof setTimeout>;
    let lastRenderAfterResize = false;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(dprCap);
        if (model) frameCamera(modelGroup);
        // Force one frame even if reduced-motion loop is parked
        lastRenderAfterResize = true;
        requestTick();
      }, 100);
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);

    let isTicking = false;
    const requestTick = () => {
      if (!isTicking) {
        isTicking = true;
        tick();
      }
    };

    // ── Render loop ───────────────────────────────────────────────────────────
    const tick = () => {
      // Park only when scroll momentum has decayed AND reduced-motion is preferred.
      // Normal users keep the auto-rotate loop running continuously.
      const isStationary =
        reducedMotion &&
        Math.abs(scrollVelocity) < 0.001 &&
        !isDragging &&
        entranceDone;

      const shouldPause =
        isPaused ||
        !heroInViewport ||
        isStationary;

      if (shouldPause) {
        if (lastRenderAfterResize || isStationary) {
          // render one final frame then park
          renderer.render(scene, camera);
          lastRenderAfterResize = false;
        }
        isTicking = false;
        return;
      }

      animationId = requestAnimationFrame(tick);

      const now = performance.now();
      const delta = Math.min((now - lastFrameTime) / 1000, 0.1);
      elapsed += delta;
      lastFrameTime = now;

      if (mixer) mixer.update(delta);

      scrollVelocity *= 0.92;
      rotTarget.y += scrollVelocity;

      if (!isDragging) {
        rotTarget.y += CONFIG.autoRotateSpeed * delta;
      }

      if (model) {
        model.position.y = Math.sin(elapsed * CONFIG.floatSpeed) * CONFIG.floatAmplitude;
      }

      const breathScale = 1 + Math.sin(elapsed * CONFIG.breathSpeed) * CONFIG.breathAmplitude;
      modelGroup.scale.setScalar(breathScale);

      const pxRad = (Math.PI / 180) * CONFIG.parallaxDeg;
      const px = isDragging || isMobile ? 0 : mouseX * pxRad;
      const py = isDragging || isMobile ? 0 : mouseY * pxRad;

      const lerpSpeed = CONFIG.parallaxSmoothing;
      modelGroup.rotation.y += ((rotTarget.y + px) - modelGroup.rotation.y) * lerpSpeed;
      modelGroup.rotation.x += ((rotTarget.x + py) - modelGroup.rotation.x) * lerpSpeed;

      renderer.render(scene, camera);
    };
    requestTick();

    const onContextLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(animationId); };
    const onContextRestored = () => { tick(); };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimer);
      window.clearTimeout(loadTimeout);
      window.clearTimeout(safetyTimer);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);

      modelObserver.disconnect();
      viewportObserver.disconnect();

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material as THREE.Material];
          mats.forEach((m) => {
            const std = m as THREE.MeshStandardMaterial;
            TEXTURE_SLOTS.forEach((slot) => {
              const tex = std[slot as keyof typeof std] as THREE.Texture | undefined;
              tex?.dispose();
            });
            m.dispose();
          });
        }
      });

      if (floorMesh) {
        const fm = floorMesh.material as THREE.MeshStandardMaterial;
        fm.map?.dispose();
        fm.dispose();
      }

      envTexture.dispose();
      pmrem.dispose();
      dracoLoader.dispose();
      renderer.dispose();
      mixer = null;
      model = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-canvas-container relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" style={{ touchAction: "none" }} />

      {placeholderMounted && (
        <div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            opacity: status === "loading" ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <Hero3DPlaceholder />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center text-muted-foreground">
            <div className="text-lg mb-2">Unable to load 3D model</div>
            <div className="text-sm">Please check your connection and refresh</div>
          </div>
        </div>
      )}
    </div>
  );
}
