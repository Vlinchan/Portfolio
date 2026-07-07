// ===========================
// CURSOR GLOW
// ===========================
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===========================
// FLOATING PARTICLES
// ===========================
(function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * -20}s;
      opacity: ${Math.random() * 0.3 + 0.1};
    `;
    container.appendChild(p);
  }
})();

// ===========================
// HEADER SCROLL EFFECT
// ===========================
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', scrollY > 50);
});

// ===========================
// MOBILE MENU
// ===========================
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
  navbar.classList.toggle('active');
  menuIcon.classList.toggle('bx-x');
};

document.querySelectorAll('.navbar a').forEach(link => {
  link.onclick = () => {
    navbar.classList.remove('active');
    menuIcon.classList.remove('bx-x');
  };
});

// ===========================
// THREE.JS 3D ANIME-STYLE AVATAR
// ===========================
// Defer until after first paint so canvas has real layout dimensions
window.addEventListener('load', function init3D() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || !window.THREE) return;

  // Force a real pixel size from the wrapper, not the canvas element itself
  function getSize() {
    const rect = canvas.getBoundingClientRect();
    return { w: rect.width || 520, h: rect.height || 520 };
  }
  const { w, h } = getSize();

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false); // false = don't set CSS size
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 1.5, 5);
  camera.lookAt(0, 1, 0);

  // ---- LIGHTS ----
  const ambientLight = new THREE.AmbientLight(0xfff5e8, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffecd2, 1.5);
  dirLight.position.set(3, 5, 3);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const rimLight = new THREE.DirectionalLight(0xc8501a, 0.6);
  rimLight.position.set(-3, 2, -2);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xffd6a5, 0.8, 10);
  fillLight.position.set(0, 3, 2);
  scene.add(fillLight);

  // ---- PLATFORM ----
  const platformGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.15, 64);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -0.5;
  platform.receiveShadow = true;
  scene.add(platform);

  // Platform glowing ring
  const ringGeo = new THREE.TorusGeometry(1.25, 0.025, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xc8501a, emissive: 0xc8501a, emissiveIntensity: 1.5 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = -0.41;
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // ---- CHARACTER: Anime-style girl avatar ----
  const charGroup = new THREE.Group();
  scene.add(charGroup);

  const skinColor = 0xffd5b0;
  const hairColor = 0x1a1414;
  const outfitColor = 0xc8501a;
  const outfitDark = 0x8b3510;
  const eyeColor = 0x3a2a6e;
  const whiteColor = 0xffffff;

  function mat(color, rough = 0.7, metal = 0) {
    return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  }

  // TORSO
  const torsoGeo = new THREE.CylinderGeometry(0.25, 0.22, 0.55, 32);
  const torso = new THREE.Mesh(torsoGeo, mat(outfitColor));
  torso.position.y = 0.55;
  torso.castShadow = true;
  charGroup.add(torso);

  // NECK
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 16);
  const neck = new THREE.Mesh(neckGeo, mat(skinColor));
  neck.position.y = 0.89;
  charGroup.add(neck);

  // HEAD
  const headGeo = new THREE.SphereGeometry(0.22, 32, 32);
  headGeo.scale(1, 1.1, 0.95);
  const head = new THREE.Mesh(headGeo, mat(skinColor, 0.8));
  head.position.y = 1.18;
  head.castShadow = true;
  charGroup.add(head);

  // HAIR - main
  const hairGeo = new THREE.SphereGeometry(0.235, 32, 32);
  hairGeo.scale(1.05, 1.15, 1.05);
  const hair = new THREE.Mesh(hairGeo, mat(hairColor, 0.9));
  hair.position.y = 1.22;
  hair.position.z = -0.01;
  charGroup.add(hair);

  // HAIR BANGS
  const bangGeo = new THREE.SphereGeometry(0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const bangs = new THREE.Mesh(bangGeo, mat(hairColor, 0.9));
  bangs.position.set(0, 1.12, 0.14);
  bangs.rotation.x = -0.3;
  charGroup.add(bangs);

  // HAIR SIDE (left)
  const sideHairGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.35, 16);
  const sideHairL = new THREE.Mesh(sideHairGeo, mat(hairColor, 0.9));
  sideHairL.position.set(-0.2, 0.98, 0.0);
  sideHairL.rotation.z = 0.2;
  charGroup.add(sideHairL);

  const sideHairR = new THREE.Mesh(sideHairGeo, mat(hairColor, 0.9));
  sideHairR.position.set(0.2, 0.98, 0.0);
  sideHairR.rotation.z = -0.2;
  charGroup.add(sideHairR);

  // EYES (left & right)
  function makeEye(x) {
    const eyeGroup = new THREE.Group();

    // White sclera
    const scleraGeo = new THREE.SphereGeometry(0.048, 16, 16);
    scleraGeo.scale(1, 1.2, 0.6);
    const sclera = new THREE.Mesh(scleraGeo, mat(whiteColor, 1));
    eyeGroup.add(sclera);

    // Iris
    const irisGeo = new THREE.CircleGeometry(0.03, 16);
    const iris = new THREE.Mesh(irisGeo, mat(eyeColor, 1));
    iris.position.z = 0.028;
    eyeGroup.add(iris);

    // Pupil
    const pupilGeo = new THREE.CircleGeometry(0.015, 16);
    const pupil = new THREE.Mesh(pupilGeo, mat(0x0a0a14, 1));
    pupil.position.z = 0.029;
    eyeGroup.add(pupil);

    // Highlight
    const hlGeo = new THREE.CircleGeometry(0.007, 8);
    const hl = new THREE.Mesh(hlGeo, mat(0xffffff, 1));
    hl.position.set(0.01, 0.012, 0.030);
    eyeGroup.add(hl);

    eyeGroup.position.set(x, 1.2, 0.18);
    return eyeGroup;
  }

  const leftEye = makeEye(-0.09);
  const rightEye = makeEye(0.09);
  charGroup.add(leftEye, rightEye);

  // EYELASHES (simple arc above eyes)
  function makeLash(x) {
    const lashGeo = new THREE.TorusGeometry(0.05, 0.008, 4, 12, Math.PI * 0.7);
    const lash = new THREE.Mesh(lashGeo, mat(0x080808, 1));
    lash.position.set(x, 1.245, 0.17);
    lash.rotation.z = Math.PI * 0.15 * (x < 0 ? 1 : -1);
    lash.rotation.x = -0.3;
    return lash;
  }
  charGroup.add(makeLash(-0.09), makeLash(0.09));

  // BLUSH
  function makeBlush(x) {
    const bg = new THREE.CircleGeometry(0.045, 16);
    const bm = new THREE.MeshStandardMaterial({ color: 0xffaabb, transparent: true, opacity: 0.4, roughness: 1 });
    const b = new THREE.Mesh(bg, bm);
    b.position.set(x, 1.13, 0.19);
    return b;
  }
  charGroup.add(makeBlush(-0.14), makeBlush(0.14));

  // MOUTH
  const mouthGeo = new THREE.TorusGeometry(0.04, 0.008, 4, 12, Math.PI * 0.7);
  const mouth = new THREE.Mesh(mouthGeo, mat(0xcc6677, 0.9));
  mouth.position.set(0, 1.09, 0.19);
  mouth.rotation.z = Math.PI;
  mouth.rotation.x = -0.15;
  charGroup.add(mouth);

  // COLLAR / SHIRT
  const collarGeo = new THREE.CylinderGeometry(0.14, 0.26, 0.12, 32);
  const collar = new THREE.Mesh(collarGeo, mat(whiteColor, 0.8));
  collar.position.y = 0.84;
  charGroup.add(collar);

  // ARMS
  function makeArm(side) {
    const g = new THREE.Group();

    const upperGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.3, 16);
    const upper = new THREE.Mesh(upperGeo, mat(outfitColor));
    upper.position.y = -0.15;
    g.add(upper);

    const lowerGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.28, 16);
    const lower = new THREE.Mesh(lowerGeo, mat(skinColor, 0.8));
    lower.position.y = -0.43;
    g.add(lower);

    const handGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const hand = new THREE.Mesh(handGeo, mat(skinColor, 0.8));
    hand.position.y = -0.6;
    g.add(hand);

    g.position.set(side * 0.32, 0.7, 0);
    g.rotation.z = side * -0.25;
    return g;
  }

  const leftArm = makeArm(-1);
  const rightArm = makeArm(1);
  charGroup.add(leftArm, rightArm);

  // SKIRT
  const skirtGeo = new THREE.CylinderGeometry(0.38, 0.52, 0.42, 32);
  const skirt = new THREE.Mesh(skirtGeo, mat(outfitDark, 0.8));
  skirt.position.y = 0.18;
  skirt.castShadow = true;
  charGroup.add(skirt);

  // LEGS
  function makeLeg(x) {
    const g = new THREE.Group();
    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.45, 16);
    const legMesh = new THREE.Mesh(legGeo, mat(skinColor, 0.7));
    legMesh.position.y = -0.22;
    g.add(legMesh);

    const shoGeo = new THREE.SphereGeometry(0.09, 12, 8);
    shoGeo.scale(1.2, 0.6, 1.4);
    const shoe = new THREE.Mesh(shoGeo, mat(0x1a1410, 0.7));
    shoe.position.y = -0.48;
    g.add(shoe);

    g.position.set(x, -0.05, 0);
    return g;
  }
  charGroup.add(makeLeg(-0.12), makeLeg(0.12));

  // HAIR ACCESSORY (ribbon)
  const ribbonGeo = new THREE.BoxGeometry(0.14, 0.07, 0.05);
  const ribbon = new THREE.Mesh(ribbonGeo, mat(0xee4466, 0.7));
  ribbon.position.set(0.18, 1.38, 0.05);
  charGroup.add(ribbon);

  // FLOATING NEURAL NETWORK NODES
  const nodeGroup = new THREE.Group();
  scene.add(nodeGroup);
  const nodes = [];
  const nodePositions = [
    [-1.4, 2.2, 0], [1.5, 2.5, -0.5], [-1.2, 1.2, -1],
    [1.3, 1.0, -0.8], [-1.6, 0.2, 0.2], [1.8, 0.5, 0.3]
  ];
  nodePositions.forEach((pos, i) => {
    const geo = new THREE.SphereGeometry(0.06, 12, 12);
    const color = i % 2 === 0 ? 0xc8501a : 0xe8780a;
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 0.8, roughness: 0.2
    }));
    mesh.position.set(...pos);
    nodes.push({ mesh, baseY: pos[1], phase: Math.random() * Math.PI * 2 });
    nodeGroup.add(mesh);
  });

  // Lines connecting nodes
  const lineMat = new THREE.LineBasicMaterial({ color: 0xc8501a, transparent: true, opacity: 0.15 });
  [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,4]].forEach(([a, b]) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...nodePositions[a]),
      new THREE.Vector3(...nodePositions[b])
    ]);
    nodeGroup.add(new THREE.Line(geo, lineMat));
  });

  // ---- MOUSE INTERACTION ----
  // Use canvas-relative coordinates for precise tracking
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;

  // Track mouse relative to the canvas rect for tight interaction
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    // Normalize to [-1, 1] relative to canvas center
    mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
  });

  // Touch support for mobile
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    mouseX = ((t.clientX - rect.left) / rect.width  - 0.5) * 2;
    mouseY = ((t.clientY - rect.top)  / rect.height - 0.5) * 2;
  }, { passive: false });

  // ---- ANIMATION ----
  const clock = new THREE.Clock();
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time = clock.getElapsedTime();

    // Head follows mouse — stronger lerp so it's clearly visible
    targetRotY += (mouseX * 0.55 - targetRotY) * 0.08;
    targetRotX += (-mouseY * 0.3 - targetRotX) * 0.08;

    head.rotation.y = targetRotY;
    head.rotation.x = targetRotX * 0.6;
    hair.rotation.y = targetRotY * 0.75;
    bangs.rotation.y = targetRotY * 0.65;

    // Whole body leans slightly toward cursor
    charGroup.rotation.y = targetRotY * 0.15;

    // Eyes follow mouse — bigger offset so it's visible
    const eyeOffX = mouseX * 0.018;
    const eyeOffY = -mouseY * 0.018;
    leftEye.children[1].position.x  = eyeOffX;
    leftEye.children[1].position.y  = eyeOffY;
    leftEye.children[2].position.x  = eyeOffX;
    leftEye.children[2].position.y  = eyeOffY;
    rightEye.children[1].position.x = eyeOffX;
    rightEye.children[1].position.y = eyeOffY;
    rightEye.children[2].position.x = eyeOffX;
    rightEye.children[2].position.y = eyeOffY;

    // Idle breathing
    const breathe = Math.sin(time * 1.2) * 0.009;
    charGroup.position.y = breathe;
    torso.scale.y = 1 + breathe * 0.6;

    // Arm swing
    leftArm.rotation.z  = -0.25 + Math.sin(time * 1.2) * 0.05;
    rightArm.rotation.z =  0.25 - Math.sin(time * 1.2) * 0.05;

    // Ring pulse
    const pulse = 1 + Math.sin(time * 2) * 0.03;
    ring.scale.set(pulse, 1, pulse);
    ring.material.emissiveIntensity = 1 + Math.sin(time * 3) * 0.5;

    // Platform slow rotation
    platform.rotation.y = time * 0.2;

    // Floating nodes
    nodes.forEach(({ mesh, baseY, phase }) => {
      mesh.position.y = baseY + Math.sin(time * 0.8 + phase) * 0.12;
      mesh.material.emissiveIntensity = 0.6 + Math.sin(time * 2 + phase) * 0.4;
    });
    nodeGroup.rotation.y = time * 0.15;

    renderer.render(scene, camera);
  }

  animate();

  // Resize — recalculate from getBoundingClientRect so it's always correct
  window.addEventListener('resize', () => {
    const { w: rw, h: rh } = getSize();
    camera.aspect = rw / rh;
    camera.updateProjectionMatrix();
    renderer.setSize(rw, rh, false);
  });
});

// ===========================
// EMAILJS CONTACT FORM
// ===========================
emailjs.init('e0TmXEjJsNP5SqL-x');

document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const btn = this.querySelector('.send-btn');
  btn.innerHTML = '<span>Sending...</span><i class="bx bx-loader-alt bx-spin"></i>';
  btn.disabled = true;

  emailjs.sendForm('service_gbyol5m', 'template_q3kbx5x', this)
    .then(() => {
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
      document.getElementById('contact-form').reset();
    }, err => {
      alert('Failed to send message. Error: ' + JSON.stringify(err));
    })
    .finally(() => {
      btn.innerHTML = '<span>Send Message</span><i class="bx bx-send"></i>';
      btn.disabled = false;
    });
});

// ===========================
// SCROLL REVEAL (lightweight)
// ===========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-box, .project-card, .about-content, .contact-left').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
