import * as THREE from 'three';
import { useEffect, useState, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SceneInit from './lib/SceneInit';

function MyThree({ rotation }) {
  const [loadedModel, setLoadedModel] = useState(null); // State to hold the loaded model
  const [arrowHelpers, setArrowHelpers] = useState([]); // State to hold arrow helpers
  const sceneInitRef = useRef(null); // Ref to hold the SceneInit instance

  // Initialize scene and load model on mount
  useEffect(() => {
    const sceneInit = new SceneInit('myThreeJsCanvas');
    sceneInit.initialize();
    sceneInitRef.current = sceneInit;

    // Create grid helper
    const gridSize = 300;
    const divisions = 30;
    const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x0000ff, 0x808080);
    sceneInit.scene.add(gridHelper);

    // Create arrow helpers
    const origin = new THREE.Vector3(0, 0, 0);
    const length = 80;

    const arrowHelperX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, length, 0xff0000, 10, 10);
    const arrowHelperY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, length, 0x0000ff, 10, 10);
    const arrowHelperZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, length, 0x00ff00, 10, 10);

    setArrowHelpers([arrowHelperX, arrowHelperY, arrowHelperZ]); // Set the arrow helpers in state
    sceneInit.scene.add(arrowHelperX, arrowHelperY, arrowHelperZ);

    // Load GLTF model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/assets/Beacon.gltf', (gltfScene) => {
      setLoadedModel(gltfScene); // Set the loaded model in state
      gltfScene.scene.rotation.y = Math.PI / 8;
      sceneInit.scene.add(gltfScene.scene);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      sceneInit.renderer.render(sceneInit.scene, sceneInit.camera);
    };
    animate();
  }, []);

  // Update model rotation when prop changes
  useEffect(() => {
    if (loadedModel) {
      if (rotation) {
        const yaw = THREE.MathUtils.degToRad(rotation[0]);
        const pitch = THREE.MathUtils.degToRad(rotation[1]);
        const roll = THREE.MathUtils.degToRad(rotation[2]);

        // Set model rotation
        loadedModel.scene.rotation.set(pitch, yaw, roll);

        // Update arrows
        const modelQuaternion = new THREE.Quaternion();
        modelQuaternion.setFromEuler(new THREE.Euler(pitch, yaw, roll));

        arrowHelpers.forEach((arrow, index) => {
          const direction = new THREE.Vector3();
          if (index === 0) direction.set(1, 0, 0); // X direction
          else if (index === 1) direction.set(0, 1, 0); // Y direction
          else if (index === 2) direction.set(0, 0, 1); // Z direction

          direction.applyQuaternion(modelQuaternion);
          arrow.setDirection(direction);
          arrow.position.copy(new THREE.Vector3(0, 0, 0)); // Ensure arrows are at the origin
        });
      }
    }
  }, [rotation, loadedModel, arrowHelpers]); // Include loadedModel and arrowHelpers in the dependency array

  return <div><canvas id="myThreeJsCanvas" /></div>;
}

export default MyThree;
