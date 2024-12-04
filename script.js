// Inicializa a fonte da câmera com resolução ajustada
const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
    sourceWidth: 640,  // Ajuste a largura
    sourceHeight: 480, // Ajuste a altura
    video: document.getElementById('webcam')
  });
  
  // Configuração do AR.js para os marcadores
  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'https://cdn.jsdelivr.net/npm/ar.js@2.0.2/aframe/dist/camera_para.dat',
    detectionMode: 'mono',
    maxDetectionRate: 30,
    canvasWidth: 640,
    canvasHeight: 480,
  });
  
  // Inicia a câmera
  arToolkitSource.init(function onReady() {
    setInterval(() => {
      if (arToolkitSource.ready) {
        // Verifica o estado da câmera
        arToolkitContext.update(arToolkitSource.domElement);
      }
    }, 1000 / 30);
  });
  
  // Inicializa a cena do Three.js
  const scene = new THREE.Scene();
  
  // Adiciona a câmera
  const camera = new THREE.Camera();
  scene.add(camera);
  
  // Ajuste de FOV para controlar o zoom
  camera.fov = 50; // Ajuste o valor do FOV conforme necessário
  camera.updateProjectionMatrix();
  
  // Adiciona um marcador AR
  const markerRoot = new THREE.Group();
  scene.add(markerRoot);
  
  // Carrega o marcador do livro
  const markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: 'pattern-ArteDaGuerra.patt', // Certifique-se de que o marcador está correto
  });
  
  // Adiciona uma imagem de Sun Tzu e um texto
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('SunTzu.avif'); // Certifique-se de que a imagem está no caminho correto
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const geometry = new THREE.PlaneGeometry(4, 3);
  const mesh = new THREE.Mesh(geometry, material);
  markerRoot.add(mesh);
  
  // Adiciona texto informativo
  const textGeometry = new THREE.TextGeometry('Sun Tzu: Filósofo e estrategista militar chinês, autor de "A Arte da Guerra".', {
    font: new THREE.FontLoader().parse(fontJSON), // Você pode usar uma fonte do Three.js ou carregar uma personalizada
    size: 0.3,
    height: 0.05
  });
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(0, -1, 0); // Posição do texto abaixo da imagem
  markerRoot.add(textMesh);
  
  // Animação para a cena
  function animate() {
    requestAnimationFrame(animate);
    arToolkitContext.update(arToolkitSource.domElement);
    renderer.render(scene, camera);
  }
  
  // Configuração do renderer (para renderizar o conteúdo 3D)
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('webcam'),
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  animate();
  