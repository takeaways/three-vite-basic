import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import "./style.css";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

class App {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private cute?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>;
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
    if (this.camera) new OrbitControls(this.camera, this.renderer.domElement);
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
    const rawPostions = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];
    const rawNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    const rawColors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0];
    const rawUVs = [0, 0, 1, 0, 0, 1, 1, 1];

    const positions = new Float32Array(rawPostions);
    const normals = new Float32Array(rawNormals);
    const colors = new Float32Array(rawColors);
    const uvs = new Float32Array(rawUVs);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    geometry.setIndex([0, 1, 2, 2, 1, 3]);

    // geometry.computeVertexNormals();
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("images/glass/Glass_Window_002_normal.jpg");

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      // vertexColors: true,
      map,
    });

    const box = new THREE.Mesh(geometry, material);
    this.scene.add(box);

    const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
    this.scene.add(helper);
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
    //
  };
}

new App(document.querySelector("#app")! as HTMLDivElement);
