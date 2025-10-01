import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const starsUrl = new URL('../img/stars.jpg', import.meta.url).href;
const sunImage = new URL('../img/sunmap.jpg', import.meta.url).href;
const mercuryImage = new URL('../img/mercurymap.jpg', import.meta.url).href;
const venusImage = new URL('../img/venusmap.jpg', import.meta.url).href;
const earthImage = new URL('../img/earthmap.jpg', import.meta.url).href;
const marsImage = new URL('../img/marsmap.jpg', import.meta.url).href;
const jupiterImage = new URL('../img/jupitermap.jpg', import.meta.url).href;
const saturnImage = new URL('../img/saturnmap.jpg', import.meta.url).href;
const uranusImage = new URL('../img/uranusmap.jpg', import.meta.url).href;
const neptuneImage = new URL('../img/neptunemap.jpg', import.meta.url).href;

const { renderer, scene, camera } = getBaseInstance();
document.body.appendChild(renderer.domElement);
camera.position.set(-90, 140, 140);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load(
	[starsUrl, starsUrl, starsUrl, starsUrl, starsUrl, starsUrl],
	() => {
		console.log('별 텍스처 로딩 완료!');
		scene.background = cubeTexture;
	},
	undefined,
	// 에러 콜백
	(error) => {
		console.error('텍스처 로딩 에러:', error);
	}
);

const planetInfo = [
	{
		name: 'Mercury',
		size: 1.2,
		position: 28,
		revolutionSpeed: 0.008,
		rotationSpeed: 0.005,
		textureUrl: mercuryImage,
	},
	{
		name: 'Venus',
		size: 1.8,
		position: 44,
		revolutionSpeed: 0.003,
		rotationSpeed: -0.001,
		textureUrl: venusImage,
	},
	{
		name: 'Earth',
		size: 2.0,
		position: 62,
		revolutionSpeed: 0.002,
		rotationSpeed: 0.01,
		textureUrl: earthImage,
	},
	{
		name: 'Mars',
		size: 1.4,
		position: 78,
		revolutionSpeed: 0.0011,
		rotationSpeed: 0.008,
		textureUrl: marsImage,
	},
	{
		name: 'Jupiter',
		size: 5.0,
		position: 110,
		revolutionSpeed: 0.0003,
		rotationSpeed: 0.03,
		textureUrl: jupiterImage,
	},
	{
		name: 'Saturn',
		size: 4.3,
		position: 138,
		revolutionSpeed: 0.0002,
		rotationSpeed: 0.025,
		textureUrl: saturnImage,
		ring: {
			innerScale: 1.15,
			outerScale: 2.8,
			textureUrl: saturnImage,
		},
	},
	{
		name: 'Uranus',
		size: 3.0,
		position: 176,
		revolutionSpeed: 0.0001,
		rotationSpeed: 0.02,
		textureUrl: uranusImage,
	},
	{
		name: 'Neptune',
		size: 3.0,
		position: 200,
		revolutionSpeed: 0.00008,
		rotationSpeed: 0.02,
		textureUrl: neptuneImage,
	},
];

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
	map: textureLoader.load(sunImage),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const planets = planetInfo.map((planet) => {
	return {
		...createPlanet(
			planet.size,
			planet.textureUrl,
			planet.position,
			planet.ring
		),
		...planet,
	};
});

const pointLight = new THREE.PointLight(0xffffff, 5000, 5000);
scene.add(pointLight);

// 초기 렌더링
render(renderer);
addResizeEvent();

function render(renderer) {
	renderer.setAnimationLoop(animate);
}

function animate() {
	sun.rotateY(0.001);
	planets.forEach((planet) => {
		planet.center.rotateY(planet.revolutionSpeed);
		planet.mesh.rotateY(planet.rotationSpeed);
	});

	renderer.render(scene, camera);
}

function getBaseInstance() {
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	return { renderer, scene, camera };
}

function addResizeEvent() {
	window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

function createPlanet(size, textureUrl, position, ring) {
	const geo = new THREE.SphereGeometry(size, 30, 30);
	const mat = new THREE.MeshStandardMaterial({
		map: textureLoader.load(textureUrl),
	});
	const mesh = new THREE.Mesh(geo, mat);
	const center = new THREE.Object3D();
	center.add(mesh);

	if (ring) {
		const innerRadius =
			(ring.innerScale ? size * ring.innerScale : undefined) ?? 0;
		const outerRadius =
			(ring.outerScale ? size * ring.outerScale : undefined) ?? 0;
		const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 32);
		const ringMat = new THREE.MeshStandardMaterial({
			map: textureLoader.load(ring.textureUrl),
			side: THREE.DoubleSide,
		});
		const ringMesh = new THREE.Mesh(ringGeo, ringMat);
		center.add(ringMesh);
		ringMesh.position.x = position;
		ringMesh.rotation.x = -0.5 * Math.PI;
	}
	scene.add(center);
	mesh.position.x = position;

	return { mesh, center };
}
