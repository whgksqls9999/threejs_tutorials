import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import nebula from '../img/nebula.jpg';
import stars from '../img/stars.jpg';

const someURL = new URL('../assets/some.glb', import.meta.url);

/** 1. 렌더러 인스턴스를 생성한다 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

/** 2. Scene과 Camera를 생성한다. */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
);
camera.position.set(-10, 30, 30);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.position.set(-30, 50, 0);
directionalLight.shadow.camera.bottom = -12;
scene.add(directionalLight);

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera
);
scene.add(dLightShadowHelper);

// const spotLight = new THREE.SpotLight(0xffffff);
// spotLight.castShadow = true;
// spotLight.position.set(-50, 50, 0);
// spotLight.angle = 0.2;
// scene.add(spotLight);

// const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);

const sphereGeometry = new THREE.SphereGeometry(3, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: 0x0000ff,
	wireframe: false,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.set(-10, 10, 0);
scene.add(sphere);

// scene.fog = new THREE.Fog(0x000000, 0, 200);
// scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// renderer.setClearColor(0x222222);
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = textureLoader.load(nebula);
// scene.background = cubeTextureLoader.load([nebula, nebula, nebula, stars, stars, stars]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshStandardMaterial({
	color: 0x023023,
	map: textureLoader.load(stars),
});
const box2MultiMaterial = [
	new THREE.MeshStandardMaterial({
		color: 0xffffff,
	}),
	new THREE.MeshStandardMaterial({
		color: 0xffffff,
	}),
	new THREE.MeshStandardMaterial({
		color: 0xffffff,
	}),
	new THREE.MeshStandardMaterial({
		color: 0xffffff,
	}),
	new THREE.MeshStandardMaterial({ map: textureLoader.load(stars) }),
	new THREE.MeshStandardMaterial({ map: textureLoader.load(stars) }),
];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
box2.position.set(10, 10, 0);
scene.add(box2);

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
	mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
	mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

const vShader = `
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const fShader = `
	void main(){
		gl_FragColor = vec4(0.5, 0.5, 1.0, 1);
	}
`;

const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
	vertexShader: vShader,
	fragmentShader: fShader,
	// vertexShader: document.getElementById('vertexShader').textContent,
	// fragmentShader: document.getElementById('fragmentShader').textContent,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);

const assetLoader = new GLTFLoader();
assetLoader.load(
	someURL.href,
	(gltf) => {
		const model = gltf.scene;
		scene.add(model);
		model.position.set(-10, 5, -10);
	},
	undefined,
	(error) => {
		console.error(error);
	}
);

const gui = new dat.GUI();

const options = {
	sphereColor: 0xffea00,
	wireframe: false,
	speed: 0.01,
	angle: 0.2,
	penumbra: 1,
	intensity: 1,
};

gui.addColor(options, 'sphereColor').onChange((e) => {
	sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange((e) => {
	sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 0.5);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

let step = 0;

function animate(time) {
	box.rotation.x += time / 300000;
	box.rotation.y += time / 300000;

	step += options.speed;
	sphere.position.y = 10 * Math.abs(Math.sin(step));

	directionalLight.intensity = options.intensity;
	dLightHelper.update();
	dLightShadowHelper.update();

	rayCaster.setFromCamera(mousePosition, camera);
	const intersects = rayCaster.intersectObjects(scene.children);
	console.log(intersects);

	// spotLight.angle = options.angle;
	// spotLight.penumbra = options.penumbra;
	// spotLight.intensity = options.intensity;
	// sLightHelper.update();

	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
