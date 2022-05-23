import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
class App {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private cube?: THREE.Group;
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
  };

  private setupLight = () => {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);
  };

  private setupModel = () => {
    // const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    // const geometry = new THREE.CircleGeometry( 0.5, 16, Math.PI / 2, Math.PI / 2 );
    // const geometry = new THREE.ConeGeometry(0.5, 1.6, 9, 9, true, 0, Math.PI);
    // const geometry = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 32, 12, true, 0, Math.PI);
    // const geometry = new THREE.SphereGeometry(0.8, 32, 12, 0, Math.PI,0, Math.PI / 2);
    // const geometry = new THREE.RingGeometry(0.2, 1, 6, 2, 0, Math.PI);
    // const geometry = new THREE.PlaneGeometry(1, 2, 2, 4);
    // const geometry = new THREE.TorusGeometry(0.9, 0.4, 24, 32, Math.PI);
    // const geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 32, 3, 4);
    const geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 32, 3, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0x515151 });
    const cube = new THREE.Mesh(geometry, material);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      lineMaterial
    );
    const group = new THREE.Group();
    group.add(cube);
    group.add(line);
    this.scene.add(group);
    this.cube = group;
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
    // if (!this.cube) {
    //   throw new Error("Cube 없이 업데이트 할 수 없습니다.");
    // }
    // time *= 0.001;
    // this.cube.rotation.x = time;
    // this.cube.rotation.y = time;
  };
}

new App(document.querySelector("#app")! as HTMLDivElement);
