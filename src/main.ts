import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import "./style.css";

class App {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private light?: THREE.DirectionalLight;
  private lightHelper?: THREE.SpotLightHelper;
  constructor(private readonly container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
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
    camera.position.set(7, 7, 0);
    this.camera = camera;
  };

  private setupLight = () => {
    this.light = new THREE.DirectionalLight(0xffffff, 0.5);
    this.light.position.set(0, 5, 0);
    this.light?.target?.position.set(0, 0, 0);
    this.scene.add(this.light);
    this.scene.add(this.light.target);
    this.light.castShadow = true;
    this.light.shadow.camera.top = this.light.shadow.camera.right + 6;
    this.light.shadow.camera.bottom = this.light.shadow.camera.left - 6;
    this.light.shadow.mapSize.width = this.light.shadow.mapSize.height = 2048;
    this.light.shadow.radius = 2;

    const auxLight = new THREE.DirectionalLight(0xffffff, 0.5);
    auxLight.position.set(0, 5, 0);
    auxLight.target.position.set(0, 0, 0);
    this.scene.add(auxLight.target);
    this.scene.add(auxLight);
  };

  private setupModel = () => {
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // sphere
    // const torusGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
    const bigSphereGeometry = new THREE.TorusKnotGeometry(
      1,
      0.3,
      128,
      64,
      2,
      3
    );
    const bigSphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.2,
    });
    const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
    bigSphere.receiveShadow = true;
    bigSphere.castShadow = true;
    // bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
    bigSphere.position.y = 1.6;
    this.scene.add(bigSphere);

    // torus
    const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x9b59b6,
      roughness: 0.5,
      metalness: 0.9,
    });

    for (let i = 0; i < 8; i++) {
      const torusPivot = new THREE.Object3D();
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
      torus.position.set(3, 0.5, 0);
      torus.receiveShadow = true;
      torus.castShadow = true;
      torusPivot.add(torus);
      this.scene.add(torusPivot);
    }

    // small shpere
    const smallSphereGeoMetry = new THREE.SphereGeometry(0.3, 32, 32);
    const smallSphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xe74c3c,
      roughness: 0.2,
      metalness: 0.5,
    });
    const smallSpherePivot = new THREE.Object3D();
    const smallSphere = new THREE.Mesh(
      smallSphereGeoMetry,
      smallSphereMaterial
    );
    smallSpherePivot.add(smallSphere);
    smallSpherePivot.name = "smallSpherePivot";
    smallSphere.receiveShadow = true;
    smallSphere.castShadow = true;
    smallSphere.position.set(3, 0.5, 0);
    this.scene.add(smallSpherePivot);
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

    const smallSpherePivot = this.scene.getObjectByName("smallSpherePivot");
    if (smallSpherePivot) {
      smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 100);

      if (this.light) {
        const smallSphere = smallSpherePivot.children[0];
        smallSphere.getWorldPosition(this.light.target.position);

        if (this.lightHelper) this.lightHelper.update();
      }
    }
    //
  };
}

new App(document.querySelector("#app")! as HTMLDivElement);
