"use client";

import { useEffect, useRef, useState } from "react";
import {
  Color,
  WebGLRenderer,
  PCFShadowMap,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  Scene,
  PerspectiveCamera,
  PMREMGenerator,
  AmbientLight,
  DirectionalLight,
  SpotLight,
  Group,
  Vector3,
  MathUtils,
  OrthographicCamera,
  Object3D,
  Box3,
  Mesh,
  Material,
  MeshStandardMaterial,
  MeshBasicMaterial,
  PlaneGeometry,
  AnimationMixer,
  PointLight,
  Raycaster,
  Vector2,
  Texture,
  CanvasTexture,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
  modelPath: "/models/hero-desktop.glb", // fallback; overridden per-device in useEffect

  targetSize: 8.5,
  framePadding: 0.92,
  cameraFov: 36,

  lookAtYOffset: -0.05,

  startRotationY: -2.69,
  startRotationX: 0.30,
  endRotationY: -2.95,
  endRotationX: 0.18,

  entranceDuration: 2.0,
  entranceSpinTurns: 0.5,
  entranceScaleFrom: 0.01,

  floatAmplitude: 0.06,
  floatSpeed: 0.4,
  autoRotateSpeed: 0.06,
  breathAmplitude: 0.012,
  breathSpeed: 0.5,

  parallaxDeg: 12,
  parallaxSmoothing: 0.14,

  scrollSpinTurns: 1.2,
  // End-of-hero scroll lands the model near top-down so users see the
  // architectural plan view as they scroll past the hero. For this model's
  // axis convention, negative rotation.x is the top-down direction.
  scrollTopDownTiltX: -1.25,

  envIntensity: 0.4,
  toneExposure: 1.15,
  shadowMapSize: 1024,
};


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
const ZERO_COLOR = new Color(0, 0, 0);

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

    // Per-device tuning — local constants, never mutate the shared CONFIG object.
    const envIntensity    = isMobile ? 0.7   : CONFIG.envIntensity;
    const autoRotateSpeed = isMobile ? 0.04  : CONFIG.autoRotateSpeed;
    const floatAmplitude  = isMobile ? 0.03  : CONFIG.floatAmplitude;
    const breathAmplitude = isMobile ? 0.008 : CONFIG.breathAmplitude;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const dprCap = isPhone ? 1 : isTablet ? 1.5 : Math.min(window.devicePixelRatio, 2);

    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(dprCap);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isPhone;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = CONFIG.toneExposure;
    renderer.outputColorSpace = SRGBColorSpace;

    // ── Scene & camera ───────────────────────────────────────────────────────
    const scene = new Scene();
    scene.background = null;

    const camera = new PerspectiveCamera(
      CONFIG.cameraFov,
      container.clientWidth / container.clientHeight,
      0.01,
      2000
    );
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    // ── Environment map ──────────────────────────────────────────────────────
    const pmrem = new PMREMGenerator(renderer);
    // compileEquirectangularShader() is for HDRI maps — not needed for fromScene().
    // Calling it unnecessarily triggers a shaderSource compile that can fail on
    // some drivers before the context is fully initialized.
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = envIntensity;

    // ── Lighting ─────────────────────────────────────────────────────────────
    scene.add(new AmbientLight(0xf0f0f8, 0.08));

    const keyLight = new DirectionalLight(0xfff8f0, 3.2);
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

    const spotLight = new SpotLight(0xb8d4ff, 1.2);
    spotLight.position.set(-6, 8, 5);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.85;
    spotLight.decay = 1.6;
    spotLight.distance = 70;
    spotLight.castShadow = false;
    scene.add(spotLight);

    const rimLight = new SpotLight(0xfff2e0, 5.5);
    rimLight.position.set(-3, 11, -9);
    rimLight.angle = Math.PI / 7;
    rimLight.penumbra = 0.5;
    rimLight.decay = 1.2;
    rimLight.distance = 80;
    rimLight.castShadow = false;
    scene.add(rimLight);

    const bounceLight = new DirectionalLight(0xffd8b0, 0.18);
    bounceLight.position.set(6, -2, 4);
    scene.add(bounceLight);

    // ── Model group ──────────────────────────────────────────────────────────
    const modelGroup = new Group();
    modelGroup.rotation.y = CONFIG.startRotationY;
    modelGroup.rotation.x = CONFIG.startRotationX;
    scene.add(modelGroup);

    const rotTarget = rotTargetRef.current;
    rotTarget.x = CONFIG.startRotationX;
    rotTarget.y = CONFIG.startRotationY;

    // ── Camera target & distance bounds (replaces OrbitControls) ────────────
    const cameraTarget = new Vector3();
    let minCamDistance = 0;
    let maxCamDistance = Infinity;

    // ── Loaders ──────────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    let model: Group | null = null;
    let mixer: AnimationMixer | null = null;
    let elapsed = 0;
    let lastFrameTime = performance.now();
    const TARGET_INTERVAL = isPhone ? 1000 / 30 : isTablet ? 1000 / 45 : 1000 / 60; // 60 fps desktop for smooth motion
    const IDLE_SLEEP_MS = 3000; // park 3 s after entrance if no interaction
    let lastInteractionTime = performance.now();
    let autoSlept = false;
    let animationId = 0;
    let isPaused = false;
    let entranceDone = false;
    let reducedMotion = false;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = prefersReducedMotion.matches;

    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let disposed = false;

    const scrollHandler = () => {
      const delta = window.scrollY - lastScrollY;
      scrollVelocity += delta * 0.002;
      lastScrollY = window.scrollY;
      requestTick();
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    const frameCamera = (object: Object3D) => {
      const box = new Box3().setFromObject(object);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());

      const radius = Math.max(size.x, size.y, size.z) * 0.5;
      const aspect = container.clientWidth / container.clientHeight;
      const fovV = MathUtils.degToRad(camera.fov);
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * aspect);
      const distV = radius / Math.sin(fovV / 2);
      const distH = radius / Math.sin(fovH / 2);
      const distance = Math.max(distV, distH) * CONFIG.framePadding;

      const lookAt = new Vector3(center.x, center.y + CONFIG.lookAtYOffset, center.z);

      camera.position.set(center.x, center.y, center.z + distance);
      camera.near = Math.max(0.01, distance / 100);
      camera.far = distance * 100;
      camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
      camera.updateProjectionMatrix();
      cameraTarget.copy(lookAt);
      minCamDistance = distance * 0.4;
      maxCamDistance = distance * 2.5;

      const shadowSize = radius * 2.8;
      const shadowCam = keyLight.shadow.camera as OrthographicCamera;
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

    const sanitizeModel = (root: Object3D) => {
      root.traverse((child) => {
        const mesh = child as Mesh;
        if (!mesh.isMesh) return;

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        mesh.visible = true;

        const fixMaterial = (mat: Material) => {
          if (!mat) return;
          if ((mat as MeshStandardMaterial).side === undefined) return;

          const std = mat as MeshStandardMaterial;

          if (std.map) std.map.colorSpace = SRGBColorSpace;

          // Replace with Basic Material to disable real-time lighting calculation
          const basicMat = new MeshBasicMaterial({
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

    const disposeMeshTree = (root: Object3D) => {
      root.traverse((obj) => {
        const mesh = obj as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material as Material];
        mats.forEach((m) => {
          const std = m as MeshStandardMaterial;
          TEXTURE_SLOTS.forEach((slot) => {
            const tex = std[slot as keyof typeof std] as Texture | undefined;
            tex?.dispose();
          });
          m.dispose();
        });
      });
    };

    const LOAD_TIMEOUT_MS = 45_000;
    const loadTimeout = window.setTimeout(() => {
      if (!disposed && !model) {
        console.error(`[Hero3D] GLB load timed out after ${LOAD_TIMEOUT_MS / 1000}s`);
        setStatus("error");
      }
    }, LOAD_TIMEOUT_MS);

    const modelVersion = "heromodel-20260517-8";
    const modelPath =
      deviceProfile === "phone"  ? `/models/hero-mobile.glb?v=${modelVersion}`  :
      deviceProfile === "tablet" ? `/models/hero-tablet.glb?v=${modelVersion}`  :
                                   `/models/hero-desktop.glb?v=${modelVersion}`;

    let loadStartedAt = 0;
    const loadModel = () => {
      loadStartedAt = performance.now();
      console.log(`[Hero3D] Starting load: ${modelPath}`);
      loader.load(
        modelPath,
        (gltf) => {
          console.log(`[Hero3D] GLB loaded in ${Math.round(performance.now() - loadStartedAt)}ms`);
          window.clearTimeout(loadTimeout);
          if (disposed) {
            disposeMeshTree(gltf.scene);
            return;
          }
          model = gltf.scene;

          sanitizeModel(model);

          const measureBox = new Box3().setFromObject(model);
          const measureSize = measureBox.getSize(new Vector3());
          const maxDim = Math.max(measureSize.x, measureSize.y, measureSize.z) || 1;
          const scaleFactor = CONFIG.targetSize / maxDim;
          model.scale.setScalar(scaleFactor);
          model.userData.maxDim = maxDim;

          const finalBox = new Box3().setFromObject(model);
          const finalCenter = finalBox.getCenter(new Vector3());
          const finalSize = finalBox.getSize(new Vector3());
          model.position.sub(finalCenter);

          modelGroup.add(model);

          frameCamera(modelGroup);

          // Procedural floor — drawn once on a 256×256 canvas, no network.
          // Layers (back→front): warm cream base, subtle architectural grid,
          // edge vignette to recede the floor, central soft contact shadow.
          // MeshBasicMaterial keeps lighting cost at zero.
          const buildFloor = () => {
            if (disposed || !model) return;

            const size = 256;
            const cvs = document.createElement("canvas");
            cvs.width = cvs.height = size;
            const ctx = cvs.getContext("2d");
            if (!ctx) return;

            // 1) Warm cream base — picks up the brand background tone.
            ctx.fillStyle = "#f5ede0";
            ctx.fillRect(0, 0, size, size);

            // 2) Architectural grid — 16 cells, 1px lines, very low contrast.
            ctx.strokeStyle = "rgba(60, 50, 35, 0.07)";
            ctx.lineWidth = 1;
            const step = size / 16;
            ctx.beginPath();
            for (let i = 1; i < 16; i++) {
              const p = Math.round(i * step) + 0.5;
              ctx.moveTo(p, 0); ctx.lineTo(p, size);
              ctx.moveTo(0, p); ctx.lineTo(size, p);
            }
            ctx.stroke();

            // 3) Edge vignette — fade alpha to 0 at the corners so the floor
            //    blends into the page background instead of ending in a hard line.
            const vignette = ctx.createRadialGradient(size / 2, size / 2, size * 0.25, size / 2, size / 2, size * 0.55);
            vignette.addColorStop(0, "rgba(245, 237, 224, 0)");
            vignette.addColorStop(1, "rgba(245, 237, 224, -1)"); // negative alpha clamps to 0
            ctx.globalCompositeOperation = "destination-out";
            const fade = ctx.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.55);
            fade.addColorStop(0, "rgba(0,0,0,0)");
            fade.addColorStop(1, "rgba(0,0,0,1)");
            ctx.fillStyle = fade;
            ctx.fillRect(0, 0, size, size);
            ctx.globalCompositeOperation = "source-over";
            void vignette;

            // 4) Central contact shadow — soft circular dark spot under the model.
            const shadow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.22);
            shadow.addColorStop(0,   "rgba(40, 30, 20, 0.32)");
            shadow.addColorStop(0.6, "rgba(40, 30, 20, 0.10)");
            shadow.addColorStop(1,   "rgba(40, 30, 20, 0)");
            ctx.fillStyle = shadow;
            ctx.fillRect(0, 0, size, size);

            const floorTex = new CanvasTexture(cvs);
            floorTex.colorSpace = SRGBColorSpace;
            floorTex.anisotropy = 4;

            const floorMat = new MeshBasicMaterial({
              map: floorTex,
              transparent: true,
              opacity: 1.0,
              depthWrite: false,
            });

            // Worst-case sink: when modelGroup rotates around X by some angle,
            // the corner of the bbox that ends up lowest in world Y traces a
            // circle of radius sqrt((h/2)² + (d/2)²) around the group origin.
            // Place the floor at that radius (plus float + breath margins) so
            // the model never sinks regardless of rotation or animation phase.
            const halfH = finalSize.y / 2;
            const halfD = finalSize.z / 2;
            const worstCaseDip = Math.hypot(halfH, halfD);
            const breathSlack = halfH * breathAmplitude;
            const groundY = -(worstCaseDip + floatAmplitude + breathSlack + 0.04);
            const floorDiameter = Math.max(finalSize.x, finalSize.z) * 2.4;

            const floor = new Mesh(new PlaneGeometry(floorDiameter, floorDiameter), floorMat);
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = groundY;
            floor.renderOrder = -1;
            scene.add(floor);
            requestTick();
          };

          // Defer floor build until the entrance scale animation finishes —
          // measuring bbox mid-scale produces a floor that hovers above ground.
          gsap.delayedCall(CONFIG.entranceDuration, buildFloor);

          // ── Bulb lighting — find light meshes, glow them, place point lights ──
          // Cap the number of dynamic point lights — every extra real-time light
          // costs per-frame; emissive material alone gives the glow look without
          // the cost. Phones get zero point lights, others get a small budget.
          const MAX_BULB_LIGHTS = isPhone ? 0 : isTablet ? 2 : 4;
          const bulbPositions: Vector3[] = [];
          const bulbKeywords = /light|bulb|lamp|glow|led|emit|neon|tube|globe|lantern|flame|candle/i;
          model.traverse((child) => {
            const mesh = child as Mesh;
            if (!mesh.isMesh) return;

            const name = mesh.name || "";
            const isEmissive = (() => {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              return mats.some((m) => {
                const s = m as MeshStandardMaterial;
                return s.emissive && !s.emissive.equals(ZERO_COLOR);
              });
            })();
            const isBulb = bulbKeywords.test(name) || isEmissive;

            if (!isBulb) return;

            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              const s = m as MeshStandardMaterial;
              s.emissive = new Color(0xfffde8);
              s.emissiveIntensity = 8.0;
              s.needsUpdate = true;
            });

            const wp = new Vector3();
            mesh.getWorldPosition(wp);
            bulbPositions.push(wp);
          });

          // Pick up to MAX_BULB_LIGHTS bulb anchors, evenly spaced through the list,
          // so we get a representative spread instead of clustering on the first few.
          if (bulbPositions.length > 0 && MAX_BULB_LIGHTS > 0) {
            const step = Math.max(1, Math.floor(bulbPositions.length / MAX_BULB_LIGHTS));
            for (let i = 0, count = 0; i < bulbPositions.length && count < MAX_BULB_LIGHTS; i += step, count++) {
              const bulbLight = new PointLight(0xffd97a, 6.0, 12, 2.0);
              bulbLight.position.copy(bulbPositions[i]);
              scene.add(bulbLight);
            }
          }

          if (gltf.animations.length > 0) {
            mixer = new AnimationMixer(model);
            gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
          }

          setStatus("ready");

          modelGroup.scale.setScalar(CONFIG.entranceScaleFrom);
          gsap.to(modelGroup.scale, {
            x: 1, y: 1, z: 1,
            duration: CONFIG.entranceDuration,
            ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            onComplete: () => { entranceDone = true; lastInteractionTime = performance.now(); },
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
              x: CONFIG.scrollTopDownTiltX,
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
        (progress) => {
          if (progress.lengthComputable && progress.total > 0) {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            if (pct === 100) {
              console.log(`[Hero3D] GLB download complete (${progress.total} B) at ${Math.round(performance.now() - loadStartedAt)}ms`);
            }
          }
        },
        (err) => {
          window.clearTimeout(loadTimeout);
          if (disposed) return;
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
        if (entry.isIntersecting) {
          autoSlept = false;
          lastInteractionTime = performance.now();
          requestTick();
        }
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
      autoSlept = false;
      lastInteractionTime = performance.now();
      requestTick();
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartRotY = 0;
    let dragStartRotX = 0;

    const onPointerDown = (e: PointerEvent) => {
      autoSlept = false;
      lastInteractionTime = performance.now();
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
      // For this model's axis convention: negative rotation.x = top-down,
      // positive = bottom-up. Allow full top-down reach; cap bottom-up
      // moderately so users don't lose the model behind the floor.
      rotTarget.x = Math.max(-Math.PI / 2 + 0.05, Math.min(0.7, dragStartRotX + dy));
      autoSlept = false;
      lastInteractionTime = performance.now();
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
        const dir = new Vector3();
        camera.getWorldDirection(dir);
        camera.position.copy(cameraTarget).addScaledVector(dir.negate(), newDist);
        lastTouchDist = dist;
        requestTick();
      }
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });

    const raycaster = new Raycaster();
    const pointer = new Vector2();
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
        const dir = new Vector3();
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
      if (autoSlept) return; // don't wake on scroll/GSAP programmatic calls — only real input clears autoSlept
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

      const now = performance.now();

      // FPS cap — skip render if frame budget not elapsed; keeps RAF alive with <1 ms tasks
      if (now - lastFrameTime < TARGET_INTERVAL) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      // Auto-sleep: park after entrance + IDLE_SLEEP_MS with no interaction
      if (entranceDone && now - lastInteractionTime > IDLE_SLEEP_MS) {
        renderer.render(scene, camera);
        autoSlept = true;
        isTicking = false;
        return;
      }

      animationId = requestAnimationFrame(tick);

      const delta = Math.min((now - lastFrameTime) / 1000, 0.1);
      elapsed += delta;
      lastFrameTime = now;

      if (mixer) mixer.update(delta);

      scrollVelocity *= 0.92;
      rotTarget.y += scrollVelocity;

      if (!isDragging) {
        rotTarget.y += autoRotateSpeed * delta;
      }

      if (model) {
        model.position.y = Math.sin(elapsed * CONFIG.floatSpeed) * floatAmplitude;
      }

      const breathScale = 1 + Math.sin(elapsed * CONFIG.breathSpeed) * breathAmplitude;
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
      disposed = true;
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

      disposeMeshTree(scene);

      envTexture.dispose();
      pmrem.dispose();
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
