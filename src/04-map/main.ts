import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
class App {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  constructor(private readonly container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.setupCamera();
    this.setupLight();
    this.setupModel();
    this.setupControls();

    window.onresize = this.resize;
    this.resize();

    requestAnimationFrame(this.render);
  }

  private setupControls = () => {
    if (this.camera && this.scene) {
      new OrbitControls(this.camera, this.container);
    }
  };

  private setupCamera = () => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4;
    this.camera = camera;
    this.scene.add(camera);
  };

  private setupLight = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    // this.scene.add(light);
    if (this.camera) {
      this.camera.add(light);
    }
  };

  private setupModel = () => {
    const loader = new THREE.TextureLoader();

    const map = loader.load("images/glass/Glass_Window_002_basecolor.jpg");
    const mapAO = loader.load(
      "images/glass/Glass_Window_002_ambientOcclusion.jpg"
    );
    const mapHeight = loader.load("images/glass/Glass_Window_002_height.png");
    const mapNormal = loader.load("images/glass/Glass_Window_002_normal.jpg");
    const mapRoughness = loader.load(
      "images/glass/Glass_Window_002_roughness.jpg"
    );
    const mapMetalic = loader.load(
      "images/glass/Glass_Window_002_metallic.jpg"
    );
    const mapAlpha = loader.load("images/glass/Glass_Window_002_opacity.jpg");
    const mapLight = loader.load("images/glass/light.jpeg");

    const material = new THREE.MeshStandardMaterial({
      map,

      normalMap: mapNormal,

      displacementMap: mapHeight,
      displacementScale: 0.2,
      displacementBias: -0.15,

      aoMap: mapAO,
      aoMapIntensity: 1,

      roughnessMap: mapRoughness,
      roughness: 0.5,

      metalnessMap: mapMetalic,
      metalness: 0.4,

      // alphaMap: mapAlpha,
      transparent: true,

      side: THREE.DoubleSide,

      lightMap: mapLight,
      lightMapIntensity: 2,
    });

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 256, 256, 256),
      material
    );
    box.position.set(-1, 0, 0);
    box.geometry.attributes.uv2 = box.geometry.attributes.uv;
    this.scene.add(box);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 512, 512),
      material
    );
    sphere.position.set(1, 0, 0);
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
    this.scene.add(sphere);
  };

  private resize = () => {
    if (!this.camera) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  private render = (time: number) => {
    if (!this.camera) {
      throw new Error("카메라를 먼저 셋팅해야 합니다");
    }
    this.renderer.render(this.scene, this.camera);
    this.update(time);
    requestAnimationFrame(this.render);
  };

  private update = (time: number) => {
    time *= 0.001;
  };
}

new App(document.querySelector("#app")! as HTMLDivElement);
