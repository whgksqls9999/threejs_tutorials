import * as THREE from 'three';
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';

const { renderer, scene, camera } = getBaseInstance();

camera.position.set(-10, 10, 10);

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const assetLoader = new GLTFLoader();
const doggoURL = new URL('../assets/doggo2.glb', import.meta.url).href;
let mixer;
assetLoader.load(doggoURL, (gltf) => {
	const model = gltf.scene;
	scene.add(model);
	mixer = new THREE.AnimationMixer(model);
	const cilps = gltf.animations;
	// const clip = THREE.AnimationClip.findByName(cilps, 'HeadAction');
	// const action = mixer.clipAction(clip);
	// action.play();

	cilps.forEach((clip) => {
		const action = mixer.clipAction(clip);
		action.play();
	});
});

scene.background = new THREE.Color(0xaaaaaa);

const clock = new THREE.Clock();
function animate() {
	if (mixer) {
		mixer.update(clock.getDelta());
	}

	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

function getBaseInstance() {
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	return { renderer, scene, camera };
}
