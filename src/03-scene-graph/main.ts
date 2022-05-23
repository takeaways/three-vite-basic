import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
class App {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private solarSystem?: THREE.Object3D<THREE.Event>;
  private earthOrbit?: THREE.Object3D<THREE.Event>;
  private moonOrbit?: THREE.Object3D<THREE.Event>;
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
    camera.position.y = 12;
    camera.position.z = 20;
    this.camera = camera;
  };

  private setupLight = () => {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);
  };

  private setupModel = () => {
    this.solarSystem = new THREE.Object3D();
    this.scene.add(this.solarSystem);

    const radius = 1;
    const widthSegments = 12;
    const heightSegments = 12;
    const sphreGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      heightSegments
    );

    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffff00,
      flatShading: true,
    });

    const sunMesh = new THREE.Mesh(sphreGeometry, sunMaterial);
    sunMesh.scale.set(3, 3, 3);
    this.solarSystem.add(sunMesh);

    // Earthq
    this.earthOrbit = new THREE.Object3D();
    this.solarSystem.add(this.earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
      flatShading: true,
    });

    const earthMesh = new THREE.Mesh(sphreGeometry, earthMaterial);
    this.earthOrbit.position.x = 10;
    this.earthOrbit.add(earthMesh);

    // Moon
    this.moonOrbit = new THREE.Object3D();
    this.moonOrbit.position.x = 2;
    this.earthOrbit.add(this.moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
      flatShading: true,
    });

    const moonMesh = new THREE.Mesh(sphreGeometry, moonMaterial);
    moonMesh.scale.set(0.4, 0.4, 0.4);
    this.moonOrbit.add(moonMesh);
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
    if (this.solarSystem && this.earthOrbit && this.moonOrbit) {
      this.solarSystem.rotation.y = time / 2;
      this.earthOrbit.rotation.y = time * 2;
      this.moonOrbit.rotation.y = time * 5;
    }
  };
}

new App(document.querySelector("#app")! as HTMLDivElement);
