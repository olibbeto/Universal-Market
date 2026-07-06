// Universal Market — Three.js cyber backdrop
// A slow-drifting neon grid plane + starfield. Purely decorative,
// runs behind all page content (#um-cyberbg, z-index:-2 in CSS).
(function () {
  if (typeof THREE === 'undefined') return; // CDN failed to load — fail silently
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'um-cyberbg';
  document.body.insertBefore(canvas, document.body.firstChild);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 3.2, 9);
  camera.lookAt(0, 0, -10);

  // --- Neon grid floor (two overlapping grids in cyan + magenta) ---
  var gridCyan = new THREE.GridHelper(60, 48, 0x00f0ff, 0x00f0ff);
  gridCyan.position.y = -2.2;
  gridCyan.material.transparent = true;
  gridCyan.material.opacity = 0.16;
  scene.add(gridCyan);

  var gridMagenta = new THREE.GridHelper(60, 16, 0xff2e9a, 0xff2e9a);
  gridMagenta.position.y = -2.18;
  gridMagenta.material.transparent = true;
  gridMagenta.material.opacity = 0.10;
  scene.add(gridMagenta);

  // --- Drifting particle field ---
  var COUNT = 420;
  var positions = new Float32Array(COUNT * 3);
  for (var i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = Math.random() * 26 - 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;
  }
  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var particleMat = new THREE.PointsMaterial({
    color: 0x7cfbff,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // A handful of bigger magenta "data" points for depth variety
  var COUNT2 = 60;
  var positions2 = new Float32Array(COUNT2 * 3);
  for (var j = 0; j < COUNT2; j++) {
    positions2[j * 3] = (Math.random() - 0.5) * 50;
    positions2[j * 3 + 1] = Math.random() * 18 - 2;
    positions2[j * 3 + 2] = (Math.random() - 0.5) * 70 - 10;
  }
  var particleGeo2 = new THREE.BufferGeometry();
  particleGeo2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
  var particleMat2 = new THREE.PointsMaterial({
    color: 0xff2e9a,
    size: 0.09,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  var particles2 = new THREE.Points(particleGeo2, particleMat2);
  scene.add(particles2);

  function onResize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Subtle parallax: background drifts a little with the mouse.
  // Particles closer to camera drift more than distant ones for a sense of depth.
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  var pX = 0, pY = 0;   // near particle layer (particles) - eased position
  var p2X = 0, p2Y = 0; // far particle layer (particles2) - eased position

  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
  });

  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!running) return;
    var t = clock.getElapsedTime();

    gridCyan.position.z = (t * 1.4) % 2.5;
    gridMagenta.position.z = (t * 1.4) % 2.5;

    particles.rotation.y = t * 0.01;
    particles2.rotation.y = -t * 0.008;

    // Depth parallax: the nearer layer (particles) shifts more than the
    // farther layer (particles2), which reads as real 3D depth as the
    // mouse moves rather than the whole scene panning as one flat plane.
    pX += (mouseX * 2.4 - pX) * 0.04;
    pY += (-mouseY * 1.4 - pY) * 0.04;
    p2X += (mouseX * 0.9 - p2X) * 0.03;
    p2Y += (-mouseY * 0.5 - p2Y) * 0.03;
    particles.position.x = pX;
    particles.position.y = pY;
    particles2.position.x = p2X;
    particles2.position.y = p2Y;

    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
    camera.position.y += (3.2 - mouseY * 0.8 - camera.position.y) * 0.02;
    camera.rotation.z += (mouseX * -0.03 - camera.rotation.z) * 0.03; // subtle roll/tilt
    camera.lookAt(0, 0, -10);

    renderer.render(scene, camera);
  }
  animate();
})();
