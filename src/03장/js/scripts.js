import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background.
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
scene.background = new THREE.Color(0x000000);
// Sets orbit control to move the camera around.
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning.
camera.position.set(6, 8, 14);
// Has to be done everytime we update the camera position.
orbit.update();

// Creates a 12 by 12 grid helper.
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);

// Creates an axes helper with an axis length of 4.
// const axesHelper = new THREE.AxesHelper(4);
// scene.add(axesHelper);

const uniforms = {
	u_time: { type: 'f', value: 0.0 },
	u_resolution: {
		type: 'v2',
		value: new THREE.Vector2(
			window.innerWidth,
			window.innerHeight
		).multiplyScalar(window.devicePixelRatio),
	},
	u_mouse: { type: 'v2', value: new THREE.Vector2(0.0, 0.0) },
};

window.addEventListener('mousemove', (e) => {
	uniforms.u_mouse.value.set(
		e.screenX / window.innerWidth,
		1 - e.screenY / window.innerHeight
	);
});
const geomerty = new THREE.PlaneGeometry(10, 10, 30, 30);
const material = new THREE.ShaderMaterial({
	vertexShader: document.getElementById('vertexShader').textContent,
	fragmentShader: document.getElementById('fragmentShader').textContent,
	wireframe: false,
	uniforms,
});

const mesh = new THREE.Mesh(geomerty, material);
scene.add(mesh);

const clock = new THREE.Clock();
function animate() {
	uniforms.u_time.value = clock.getElapsedTime();
	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
