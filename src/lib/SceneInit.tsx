import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class SceneInit {
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;

  fov: number;
  nearPlane: number;
  farPlane: number;
  canvasId: string;

  clock: THREE.Clock | undefined;
  stats: Stats | undefined;
  controls: OrbitControls | undefined;

  ambientLight: THREE.AmbientLight | undefined;
  directionalLight: THREE.DirectionalLight | undefined;
  loader: THREE.TextureLoader | undefined;

  constructor(canvasId: string) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    // NOTE: Camera params;
    this.fov = 90;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    // NOTE: Additional components.
    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    // NOTE: Lighting is basically required.
    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.set(100, 200, 100);

    // NOTE: Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ambient light for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    // directional light - parallel sun rays
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    // if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Load space background.
    this.loader = new THREE.TextureLoader();
    this.scene.background = this.loader.load('./pics/space.jpeg');
  }

  animate = () => {
    window.requestAnimationFrame(this.animate);
    this.render();
    this.controls?.update();
  };

  render() {
    this.renderer?.render(this.scene as THREE.Scene, this.camera as THREE.Camera);
  }

  onWindowResize() {
    const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    if (this.camera && this.renderer) {
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
  }
}
