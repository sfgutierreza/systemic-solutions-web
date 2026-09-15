import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";
import { EffectComposer } from "https://esm.sh/three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three/addons/postprocessing/UnrealBloomPass.js";

const cosmicInfo = [
  {
    name: "Pulsar (Neutron Star)",
    copy: "A highly magnetized, rapidly rotating neutron star. Born from the supernova explosion of a massive star, channeling intense electromagnetic radiation through its poles.",
    form: "Hyper-dense core, twisting toroidal magnetic filaments, extreme non-linear polar jets.",
    palette: "Blinding magenta core, deep neon violet flux lines, piercing cyan gamma emissions.",
    motion: "Violent rotational spin with oscillating magnetic sweeping."
  },
  {
    name: "Spiral Galaxy",
    copy: "A gravitationally bound system of stars, stellar remnants, interstellar gas, and dark matter. It slowly rotates, forming majestic, density-clustered spiral arms.",
    form: "Dense galactic bulge, logarithmic arms with secondary branches and structural dust lanes.",
    palette: "Blazing golden core, saturated teal/cyan stellar nurseries, deep indigo dust.",
    motion: "Majestic galactic rotation with fluid local orbital shearing."
  },
  {
    name: "Singularity (Black Hole)",
    copy: "A region of spacetime where gravity is so intense that nothing can escape. Matter falling towards it forms a superheated accretion disk affected by relativistic Doppler beaming.",
    form: "Absolute void event horizon, warped accretion disk, 3D gravitational lensing.",
    palette: "X-ray blue/white inner horizon shifting to crimson plasma, enhanced by Doppler blueshift.",
    motion: "Extreme orbital velocity causing intense mathematical shearing and light warping."
  }
];

let currentShape = 0;
let targetShape = 0;
let isTransitioning = false;
let morphProgress = 0;
const TOTAL_SHAPES = 3;

let infoExpanded = false;


function updateInfo(index) { /* la web no lleva panel de telemetría */ }

const esMovil = window.matchMedia('(max-width: 767px)').matches;
const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
const container = document.getElementById('threejs-container-CORE_SECTION');
// El bloom depende de cuántos píxeles se dibujan realmente: a 1x se satura
// mucho antes que en una pantalla retina.
const pxEfectivos = (container.clientWidth || 640) * (window.devicePixelRatio || 1);
const bloomFuerza = pxEfectivos >= 1100 ? 1.45 : 0.75;
const bloomUmbral = pxEfectivos >= 1100 ? 0.28 : 0.52;

const scene = new THREE.Scene();
// sin niebla: taparía el fondo de la sección

const camera = new THREE.PerspectiveCamera(50, (container.clientWidth / container.clientHeight), 0.1, 1000);

function updateCameraZ() {
  const aspect = (container.clientWidth / container.clientHeight);
  const maxShapeExtent = 55.0; 
  const fovRad = (camera.fov * Math.PI) / 180;
  let requiredZ = maxShapeExtent / Math.tan(fovRad / 2);
  if (aspect < 1.0) requiredZ /= aspect;
  camera.position.set(0, requiredZ * 0.35, requiredZ);
}
updateCameraZ();

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, esMovil ? 1.5 : 2));
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1; 
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enablePan = false;
controls.enableZoom = false; // si no, la rueda secuestra el scroll de la página
controls.minDistance = 20;
controls.maxDistance = 300;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(container.clientWidth, container.clientHeight),
  bloomFuerza,
  0.65,
  bloomUmbral
);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const particleCount = esMovil ? 40000 : 135000; // en un contenedor de ~294px, 135k no se distinguen y funden la batería
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const ids = new Float32Array(particleCount);
const randoms = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  ids[i] = i / particleCount;
  randoms[i * 3] = Math.random();
  randoms[i * 3 + 1] = Math.random();
  randoms[i * 3 + 2] = Math.random();
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('aId', new THREE.BufferAttribute(ids, 1));
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

const vertexShader = `
  uniform float uTime;
  uniform float uMorphProgress;
  uniform int uCurrentShape;
  uniform int uTargetShape;

  attribute float aId;
  attribute vec3 aRandom;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDepth;
  varying float vGlowMult;

  #define PI 3.14159265359
  #define TAU 6.28318530718

  float safePow(float base, float exp) {
      return pow(max(abs(base), 0.00001), exp);
  }
  
  vec3 safeNormalize(vec3 v) {
      float len = length(v);
      return len > 0.00001 ? v / len : vec3(0.0, 1.0, 0.0);
  }

  float cubicInOut(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - safePow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  mat3 rotateY(float a) {
    float s = sin(a); float c = cos(a);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
  }

  mat3 rotateX(float a) {
    float s = sin(a); float c = cos(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }

  vec3 getPulsarPos(float id, vec3 rnd) {
    float t = uTime * 2.5;
    if (rnd.x < 0.1) {
       float u = rnd.y * TAU;
       float v = acos(2.0 * rnd.z - 1.0);
       float r = 2.0 + sin(u*12.0 + t)*0.15 + cos(v*8.0 - t)*0.15;
       return vec3(r * sin(v) * cos(u), r * cos(v), r * sin(v) * sin(u));
    } 
    else if (rnd.x < 0.25) {
       float isTop = (rnd.y > 0.5) ? 1.0 : -1.0;
       float h = safePow(abs(rnd.y * 2.0 - 1.0), 3.0) * 70.0; 
       float taper = safePow(1.0 - (h / 70.0), 2.0);
       float r = rnd.z * 1.5 * taper; 
       float u = id * TAU * 150.0;
       float wobble = sin(h * 0.15 - t * 8.0) * 0.8 * taper;
       return vec3(r * cos(u) + wobble, h * isTop, r * sin(u) + wobble);
    } 
    else {
       float lines = 42.0;
       float lineId = floor((rnd.x - 0.25) / 0.75 * lines);
       float lineAngle = (lineId / lines) * TAU;
       
       float v = rnd.y * PI; 
       float maxL = 12.0 + fract(lineId * 17.5) * 25.0; 
       float r = maxL * safePow(sin(v), 2.0);
       
       float twist = sin(v * PI - t) * 0.8;
       lineAngle += t * 2.0 + twist; 
       
       float noise = sin(v * 15.0 - t * 4.0) * 0.4;
       return vec3((r + noise) * cos(lineAngle), (maxL * 0.6) * cos(v), (r + noise) * sin(lineAngle));
    }
  }

  vec3 getGalaxyPos(float id, vec3 rnd) {
    float t = uTime * 0.2;
    if (rnd.x < 0.2) {
       float u = rnd.y * TAU;
       float v = acos(2.0 * rnd.z - 1.0);
       float r = 5.0 * safePow(rnd.y, 2.5); 
       return vec3(r * sin(v) * cos(u), r * cos(v) * 0.25, r * sin(v) * sin(u));
    } 
    else {
       float arms = (rnd.x > 0.8) ? 4.0 : 2.0;
       float armId = floor(fract(rnd.x * 23.0) * arms);
       float u = rnd.y * TAU * 1.8;
       
       float baseR = 2.5 * exp(0.32 * u);
       
       float cluster = sign(rnd.z - 0.5) * safePow(abs(rnd.z - 0.5) * 2.0, 2.0);
       float spread = cluster * baseR * 0.25;
       
       float clumps = sin(baseR * 3.0) * 0.5;
       float r = baseR + spread + clumps;
       
       float angle = u + (armId * TAU / arms) - t;
       angle += sin(r * 2.0 - t * 3.0) * 0.1 * cluster;
       
       float yThickness = exp(-r * 0.12) * 2.0; 
       float y = cluster * yThickness + sin(angle * 4.0) * 0.3;
       
       return vec3(r * cos(angle), y, r * sin(angle)) * 0.85;
    }
  }

  vec3 getBlackHolePos(float id, vec3 rnd) {
    float t = uTime * 1.5;
    float eventHorizon = 5.0;
    float maxDisk = 38.0;
    vec3 pos;
    
    if (rnd.x < 0.7) {
       float u = rnd.y * TAU;
       float r = eventHorizon + sqrt(rnd.z) * (maxDisk - eventHorizon);
       
       float velocity = t * (55.0 / safePow(r, 1.2)); 
       float angle = u + velocity;
       
       float thicknessStr = exp(-(r - eventHorizon) * 0.25) * 3.5;
       float clusterY = sign(rnd.x - 0.35) * safePow(abs(rnd.x - 0.35)*2.8, 2.0);
       float y = clusterY * thicknessStr;
       
       y += sin(r * 5.0 - t * 4.0) * cos(angle * 8.0) * 0.4;
       pos = vec3(r * cos(angle), y, r * sin(angle));
    } 
    else if (rnd.x < 0.9) {
       float u = rnd.y * TAU;
       float v = rnd.z * PI;
       float r = eventHorizon * (1.0 + 0.05 * rnd.z); 
       
       float angle1 = u + t * 18.0;
       float angle2 = v + t * 8.0;
       
       float distort = sin(angle1 * 3.0 + t) * 0.5;
       pos = vec3(
           (r+distort) * cos(angle1) * sin(angle2),
           (r+distort) * cos(angle2) * 1.5,
           (r+distort) * sin(angle1) * sin(angle2)
       );
    } 
    else {
       float u = rnd.y * TAU;
       float h = (rnd.z - 0.5) * 2.0; 
       float heightSq = sign(h) * safePow(abs(h), 1.5) * 25.0; 
       float r = eventHorizon + 0.2 + safePow(abs(h), 2.0) * 8.0;
       float angle = u + t * 12.0 - heightSq * 0.4; 
       pos = vec3(r * cos(angle), heightSq, r * sin(angle));
    }
    
    return pos * 1.35;
  }

  vec3 getPos(int shape, float id, vec3 rnd) {
    if (shape == 0) return getPulsarPos(id, rnd);
    if (shape == 1) return getGalaxyPos(id, rnd);
    if (shape == 2) return getBlackHolePos(id, rnd);
    return vec3(0.0);
  }

  vec3 getColor(int shape, float id, vec3 rnd, vec3 pos) {
    if (shape == 0) { 
       if (rnd.x < 0.1) return vec3(1.0, 0.2, 1.0);
       if (rnd.x < 0.25) return vec3(0.0, 0.9, 1.0);
       float lineId = floor((rnd.x - 0.25) / 0.75 * 42.0);
       return mix(vec3(0.4, 0.0, 1.0), vec3(0.1, 0.5, 1.0), fract(lineId * 0.3)); 
    }

    if (shape == 1) { 
       if (rnd.x < 0.2) {
           return mix(vec3(1.0, 0.8, 0.2), vec3(1.0, 0.3, 0.0), rnd.y);
       } else {
           vec3 brightArm = mix(vec3(0.0, 1.0, 0.8), vec3(0.0, 0.5, 1.0), rnd.y);
           vec3 darkDust = vec3(0.02, 0.0, 0.15);
           float clusterVal = safePow(abs(rnd.z - 0.5) * 2.0, 1.5);
           return mix(brightArm, darkDust, clusterVal);
       }
    }
    
    if (shape == 2) {
       vec3 hot = vec3(1.0, 0.5, 0.1);   
       vec3 mid = vec3(0.8, 0.1, 0.0);   
       vec3 cold = vec3(0.2, 0.0, 0.1);  
       
       vec3 baseCol;
       if (rnd.x > 0.7 && rnd.x < 0.9) {
           baseCol = mix(vec3(1.0, 0.8, 0.3), hot, rnd.y);
       } else if (rnd.x >= 0.9) {
           baseCol = mix(hot, mid, rnd.z);
       } else {
           float distNorm = length(pos.xz) / 38.0;
           if (distNorm < 0.3) baseCol = mix(hot, mid, distNorm * 3.33);
           else baseCol = mix(mid, cold, (distNorm - 0.3) * 1.42);
       }

       float dopplerBias = clamp(pos.x / 20.0, -1.0, 1.0); 
       vec3 blueShift = vec3(0.0, 0.4, 1.0);
       vec3 redShift = vec3(1.0, 0.0, 0.0);
       
       if (dopplerBias > 0.0) {
           baseCol = mix(baseCol, blueShift, dopplerBias * 0.8);
           baseCol *= (1.0 + dopplerBias * 0.5);
       } else {
           baseCol = mix(baseCol, redShift, abs(dopplerBias) * 0.8);
           baseCol *= (1.0 - abs(dopplerBias) * 0.5);
       }
       
       return baseCol;
    }
    return vec3(1.0);
  }

  float getAlpha(int shape, vec3 rnd) {
      if (shape == 0) {
         if (rnd.x < 0.1) return 1.0;
         if (rnd.x < 0.25) return 0.7;
         return 0.25;
      }
      if (shape == 1) {
         if (rnd.x < 0.2) return 0.8;
         float clusterVal = safePow(abs(rnd.z - 0.5) * 2.0, 1.5);
         return mix(0.6, 0.15, clusterVal);
      }
      if (shape == 2) {
         if (rnd.x > 0.7 && rnd.x < 0.9) return 0.9;
         if (rnd.x >= 0.9) return 0.4;
         return 0.5;
      }
      return 0.5;
  }

  float getGlowMult(int shape) {
      if (shape == 0) return 2.2;  
      if (shape == 1) return 1.4;  
      if (shape == 2) return 1.1;  
      return 1.0;
  }

  void main() {
    vec3 p1 = getPos(uCurrentShape, aId, aRandom);
    vec3 p2 = getPos(uTargetShape, aId, aRandom);

    vec3 c1 = getColor(uCurrentShape, aId, aRandom, p1);
    vec3 c2 = getColor(uTargetShape, aId, aRandom, p2);

    float a1 = getAlpha(uCurrentShape, aRandom);
    float a2 = getAlpha(uTargetShape, aRandom);

    float g1 = getGlowMult(uCurrentShape);
    float g2 = getGlowMult(uTargetShape);

    float morph = cubicInOut(uMorphProgress);
    vGlowMult = mix(g1, g2, morph);
    vAlpha = mix(a1, a2, morph);
    vColor = mix(c1, c2, morph);

    vec3 finalPos = mix(p1, p2, morph);

    float breatheMask = sin(uMorphProgress * PI);
    
    float distFromCenter = length(finalPos);
    float shearVelocity = (20.0 / (distFromCenter + 1.0)) * breatheMask;
    
    finalPos = rotateY(shearVelocity + breatheMask * PI * 2.0) * finalPos;
    
    vec3 chaosVec = safeNormalize(finalPos + vec3(sin(aId*PI), cos(aId*TAU), sin(aId*PI*1.5)));
    finalPos += chaosVec * breatheMask * (15.0 + aRandom.y * 20.0);

    float twinkle = 0.7 + 0.3 * sin(uTime * 10.0 + aId * TAU * 100.0);
    vAlpha *= twinkle * (1.0 - breatheMask * 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vDepth = -mvPosition.z;

    float baseSize = 4.0 + aRandom.x * 6.0; 
    gl_PointSize = baseSize * (65.0 / max(vDepth, 0.1));
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vDepth;
  varying float vGlowMult;

  void main() {
    vec2 uv = gl_PointCoord.xy - vec2(0.5);
    float dist = length(uv);

    if (dist > 0.5) discard;

    float core = exp(-dist * 14.0);
    float halo = exp(-dist * 4.0);
    
    vec3 col = vColor * vGlowMult;
    
    col = mix(col, vec3(1.0), core * 0.6); 

    float depthFade = smoothstep(250.0, 15.0, vDepth);
    float finalAlpha = vAlpha * (halo * 0.5 + core) * depthFade;

    gl_FragColor = vec4(col, finalAlpha);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMorphProgress: { value: 0.0 },
    uCurrentShape: { value: 0 },
    uTargetShape: { value: 0 }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

/* ─────────────────────────────────────────────────────────────
   Núcleo sobrio: el mismo de antes, reconstruido con el Three.js
   moderno que ya carga este módulo (así no cargamos dos versiones).
   Se escala ~18x porque la cámara aquí está pensada para figuras
   de ~55 unidades, y el núcleo original mide ~2.
   ───────────────────────────────────────────────────────────── */
const COLOR_CIAN = 0x47d6ff;
const COLOR_ACERO = 0x2a445e;
const COLOR_BLANCO = 0xe5e2e1;

const nucleoSobrio = new THREE.Group();
const capasSobrias = {};
const anillosSobrios = [];

function mallaDe(geo, color, opacity) {
  return new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  );
}

(function construirNucleoSobrio() {
  const interior = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.6, 2),
    new THREE.MeshBasicMaterial({ color: COLOR_ACERO, transparent: true, opacity: 0.8 })
  );
  nucleoSobrio.add(interior);
  capasSobrias.interior = interior;

  capasSobrias.reticula = mallaDe(new THREE.IcosahedronGeometry(0.62, 2), COLOR_CIAN, 0.5);
  capasSobrias.media = mallaDe(new THREE.OctahedronGeometry(0.85, 1), COLOR_CIAN, 0.3);
  capasSobrias.exterior = mallaDe(new THREE.DodecahedronGeometry(1.05, 1), COLOR_ACERO, 0.4);
  nucleoSobrio.add(capasSobrias.reticula, capasSobrias.media, capasSobrias.exterior);

  [
    { r: 1.3, tx: Math.PI / 2, tz: 0, v: 0.002, c: COLOR_CIAN },
    { r: 1.6, tx: Math.PI / 3, tz: Math.PI / 4, v: -0.003, c: COLOR_BLANCO },
    { r: 1.9, tx: -Math.PI / 4, tz: -Math.PI / 6, v: 0.0015, c: COLOR_ACERO },
  ].forEach((cfg) => {
    const anillo = new THREE.Mesh(
      new THREE.RingGeometry(cfg.r - 0.005, cfg.r, 64),
      new THREE.MeshBasicMaterial({ color: cfg.c, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
    );
    anillo.rotation.x = cfg.tx;
    anillo.rotation.y = cfg.tz;
    const geoNodo = new THREE.BoxGeometry(0.03, 0.03, 0.03);
    const matNodo = new THREE.MeshBasicMaterial({ color: COLOR_BLANCO });
    for (let j = 0; j < 4; j += 1) {
      const nodo = new THREE.Mesh(geoNodo, matNodo);
      const ang = (j / 4) * Math.PI * 2;
      nodo.position.set(Math.cos(ang) * cfg.r, Math.sin(ang) * cfg.r, 0);
      anillo.add(nodo);
    }
    const envoltura = new THREE.Group();
    envoltura.add(anillo);
    nucleoSobrio.add(envoltura);
    anillosSobrios.push({ malla: anillo, v: cfg.v });
  });

  nucleoSobrio.scale.setScalar(25);
  scene.add(nucleoSobrio);
})();

/* Estados: 0 = núcleo sobrio · 1 = estrella de neutrones · 2 = galaxia
   (el agujero negro del ZIP queda fuera). */
const TOTAL_ESTADOS = 3;
let estado = 0;

const NOMBRES_ESTADO = ['01 // NÚCLEO', '02 // ESTRELLA', '03 // GALAXIA'];
const btnCiclo = document.getElementById('core-cycle');
const etiquetaCiclo = document.getElementById('core-cycle-label');
const puntosCiclo = btnCiclo ? btnCiclo.querySelectorAll('[data-core-dot]') : [];

function pintarIndicador() {
  if (etiquetaCiclo) etiquetaCiclo.textContent = NOMBRES_ESTADO[estado];
  puntosCiclo.forEach((p, i) => {
    p.style.background = i === estado ? '#47d6ff' : 'rgba(134,147,152,.35)';
  });
}

if (btnCiclo) {
  btnCiclo.addEventListener('click', (e) => { e.stopPropagation(); triggerMorph(); });
}

function aplicarEstado(nuevo, conTransicion) {
  const veniaDeParticulas = estado !== 0;
  estado = nuevo;
  const vaAParticulas = estado !== 0;

  nucleoSobrio.visible = !vaAParticulas;
  particles.visible = vaAParticulas;
  bloomPass.enabled = vaAParticulas;   // el núcleo sobrio es plano, sin brillo
  if (vaAParticulas) bloomPass.strength = estado === 1 ? bloomFuerza * 0.55 : bloomFuerza;

  if (vaAParticulas) {
    const forma = estado - 1;          // estado 1 -> púlsar (0), estado 2 -> galaxia (1)
    if (conTransicion && veniaDeParticulas) {
      targetShape = forma;
      isTransitioning = true;
      morphProgress = 0;
    } else {
      currentShape = forma;
      targetShape = forma;
      isTransitioning = false;
      morphProgress = 0;
    }
  }
  pintarIndicador();
}
aplicarEstado(0, false);


function triggerMorph() {
  if (isTransitioning) return;
  aplicarEstado((estado + 1) % TOTAL_ESTADOS, true);
}


new ResizeObserver(() => {
  if (!container.clientWidth || !container.clientHeight) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  updateCameraZ();
  renderer.setSize(container.clientWidth, container.clientHeight);
  composer.setSize(container.clientWidth, container.clientHeight);
}).observe(container);

updateInfo(currentShape);

const clock = new THREE.Clock();

let enPantalla = false;
let corriendo = false;
let rafId = 0;

function arrancar() {
  if (corriendo || !enPantalla || menosMovimiento.matches) return;
  corriendo = true;
  clock.getDelta(); // descarta el tiempo acumulado en pausa
  rafId = requestAnimationFrame(animate);
}

function parar() {
  corriendo = false;
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
}

/** Un solo fotograma quieto, para quien pide menos movimiento. */
function fotogramaEstatico() {
  controls.autoRotate = false;
  if (typeof nucleoSobrio !== 'undefined') nucleoSobrio.rotation.set(0.1, 0.2, 0);
  material.uniforms.uTime.value = 12.0;
  material.uniforms.uMorphProgress.value = 0;
  material.uniforms.uCurrentShape.value = currentShape;
  material.uniforms.uTargetShape.value = targetShape;
  composer.render();
}

container.style.cursor = 'pointer';
let pX = 0, pY = 0, pT = 0;
container.addEventListener('pointerdown', (e) => { pX = e.clientX; pY = e.clientY; pT = performance.now(); });
container.addEventListener('pointerup', (e) => {
  // Solo cuenta como clic si no hubo arrastre: si no, rotar cambiaría la forma.
  const movido = Math.hypot(e.clientX - pX, e.clientY - pY);
  if (movido < 6 && performance.now() - pT < 500) triggerMorph();
});

new IntersectionObserver((entradas) => {
  enPantalla = entradas.some((e) => e.isIntersecting);
  enPantalla ? arrancar() : parar();
}, { threshold: 0.05 }).observe(container);

document.addEventListener('visibilitychange', () => {
  document.hidden ? parar() : arrancar();
});

menosMovimiento.addEventListener('change', (e) => {
  if (e.matches) { parar(); fotogramaEstatico(); }
  else { controls.autoRotate = true; arrancar(); }
});

function animate() {
  if (!corriendo) return;
  rafId = requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  if (isTransitioning) {
    morphProgress += delta * 0.45;

    if (morphProgress >= 1) {
      morphProgress = 0;
      currentShape = targetShape;
      isTransitioning = false;
    }
  }

  if (estado === 0) {
    const k = delta * 60; // normalizado a 60fps
    capasSobrias.interior.rotation.y += 0.002 * k;
    capasSobrias.interior.rotation.x += 0.001 * k;
    capasSobrias.reticula.rotation.y += 0.002 * k;
    capasSobrias.reticula.rotation.x += 0.001 * k;
    capasSobrias.media.rotation.y -= 0.003 * k;
    capasSobrias.media.rotation.z += 0.002 * k;
    capasSobrias.exterior.rotation.x += 0.001 * k;
    capasSobrias.exterior.rotation.y -= 0.002 * k;
    anillosSobrios.forEach((a) => { a.malla.rotation.z += a.v * k; });
  }

  material.uniforms.uTime.value = elapsedTime;
  material.uniforms.uMorphProgress.value = morphProgress;
  material.uniforms.uCurrentShape.value = currentShape;
  material.uniforms.uTargetShape.value = targetShape;

  composer.render();
}

if (menosMovimiento.matches) fotogramaEstatico();
