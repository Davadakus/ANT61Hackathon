import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SceneInit from './lib/SceneInit';

function MyThree({ rotation }) {
  const loadedModelRef = useRef(null); // Ref to hold the loaded model
  const sceneInitRef = useRef(null); // Ref to hold the SceneInit instance

  // Initialize scene and load model on mount
  useEffect(() => {
    const sceneInit = new SceneInit('myThreeJsCanvas');
    sceneInit.initialize();
    sceneInit.animate();
    sceneInitRef.current = sceneInit; // Store reference to SceneInit

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/assets/Beacon.gltf', (gltfScene) => {
      loadedModelRef.current = gltfScene; // Store reference to loaded model
      gltfScene.scene.rotation.y = Math.PI / 8;
      gltfScene.scene.position.y = 3;
      gltfScene.scene.scale.set(10, 10, 10);
      sceneInit.scene.add(gltfScene.scene);
    });
  }, []); // Empty dependency array to run this effect only once

  // Update model position when location changes
  useEffect(() => {
    console.log("Rotation: " + rotation)
    if (loadedModelRef.current) {
      // Update rotation
      if (rotation) {
        // Convert degrees to radians
        const yaw = THREE.MathUtils.degToRad(rotation[0]); // Y-axis
        const pitch = THREE.MathUtils.degToRad(rotation[1]); // X-axis
        const roll = THREE.MathUtils.degToRad(rotation[2]); // Z-axis

        // Set the rotation
        loadedModelRef.current.scene.rotation.set(pitch, yaw, roll);

        
      }
    }
  }, [rotation]); // Dependency on location prop

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default MyThree;
