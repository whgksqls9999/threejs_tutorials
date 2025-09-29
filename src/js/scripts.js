import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/** 1. 렌더러 인스턴스를 생성한다 */
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

/** 2. Scene과 Camera를 생성한다. */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
);
camera.position.set(0, 2, 5);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: '#00FF00' });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

function animate(time) {
	box.rotation.x += time / 300000;
	box.rotation.y += time / 300000;
	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
