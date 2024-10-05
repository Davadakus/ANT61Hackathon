import * as THREE from 'three';
import { useEffect, useState, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SceneInit from './lib/SceneInit';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

function MyThree({ rotation, gryoAccel }) {
  const [loadedModel, setLoadedModel] = useState(null);
  const [arrowHelpers, setArrowHelpers] = useState([]);
  const [textLabels, setTextLabels] = useState([]); // State for text labels
  const [axisLabels, setAxisLabels] = useState([]); // State for axis labels
  const [font, setFont] = useState(null); // State to hold the loaded font
  const sceneInitRef = useRef(null);

  // Create text label
  const createTextLabel = (text, position) => {
    if (!font) return null; // Ensure the font is loaded

    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 5,
      depth: 1,
      curveSegments: 12,
      bevelEnabled: false,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.copy(position);
    textMesh.position.y += 5; // Position it above the arrow head

    return textMesh;
  };
  
  // Load the font
  useEffect(() => {
    const fontLoader = new FontLoader();
    fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      (loadedFont) => {
        setFont(loadedFont); // Store loaded font in state
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the font:', error);
      }
    );
  }, []);

  useEffect(() => {
    const sceneInit = new SceneInit('myThreeJsCanvas');
    sceneInit.initialize();
    sceneInitRef.current = sceneInit;
  
    const gridSize = 300;
    const divisions = 30;
    const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x0000ff, 0x808080);
    sceneInit.scene.add(gridHelper);
  
    // Add labels for X and Z axes on the grid
    const xLabel = createTextLabel('X', new THREE.Vector3(gridSize / 2, 5, 0)); // Position X label on the grid
    const zLabel = createTextLabel('Z', new THREE.Vector3(0, 5, gridSize / 2)); // Position Z label on the grid
    
    setAxisLabels([xLabel, zLabel]);
    if (xLabel) sceneInit.scene.add(xLabel);
    if (zLabel) sceneInit.scene.add(zLabel);
  
    const origin = new THREE.Vector3(0, 0, 0);
    const length = 80;
  
    const arrowHelperX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, length, 0xff0000, 10, 10);
    const arrowHelperY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, length, 0x0000ff, 10, 10);
    const arrowHelperZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, length, 0x00ff00, 10, 10);
  
    setArrowHelpers([arrowHelperX, arrowHelperY, arrowHelperZ]);
    sceneInit.scene.add(arrowHelperX, arrowHelperY, arrowHelperZ);
    
    // Create text labels for the arrows
    const labels = [
      createTextLabel('X', new THREE.Vector3(length, 0, 0)),
      createTextLabel('Y', new THREE.Vector3(0, length, 0)),
      createTextLabel('Z', new THREE.Vector3(0, 0, length)),
    ];
    
    labels.forEach(label => {
      if (label) { // Check if label is not null
        sceneInit.scene.add(label);
      }
    });
    setTextLabels(labels);
  
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/assets/Beacon.gltf', (gltfScene) => {
      setLoadedModel(gltfScene);
      gltfScene.scene.rotation.y = Math.PI / 8;
      sceneInit.scene.add(gltfScene.scene);
    });
  
    const animate = () => {
      requestAnimationFrame(animate);
      sceneInit.renderer.render(sceneInit.scene, sceneInit.camera);
    };
    animate();
  }, [font]); // Add font as a dependency
  

  // Text always facing camera
  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);
  
      // Ensure the text labels face the camera
      if (textLabels.length > 0 && sceneInitRef.current) {
        const camera = sceneInitRef.current.camera; // Access the camera
  
        textLabels.forEach((label) => {
          if (label) {
            // Set the text label to "look at" the camera
            label.lookAt(camera.position);
          }
        });

        axisLabels.forEach((label) => {
          if (label) {
            // Set the text label to "look at" the camera
            label.lookAt(camera.position);
          }
        });
      }
  
      sceneInitRef.current.renderer.render(sceneInitRef.current.scene, sceneInitRef.current.camera);
    };
    animate();
  }, [textLabels]);

  // Calculation of Text on scene
  useEffect(() => {
    if (loadedModel) {
      if (rotation) {
        const yaw = THREE.MathUtils.degToRad(rotation[0]);
        const pitch = THREE.MathUtils.degToRad(rotation[1]);
        const roll = THREE.MathUtils.degToRad(rotation[2]);
  
        loadedModel.scene.rotation.set(pitch, yaw, roll);
  
        const modelQuaternion = new THREE.Quaternion();
        modelQuaternion.setFromEuler(new THREE.Euler(pitch, yaw, roll));
  
        // Update arrow directions based on the model's rotation
        arrowHelpers.forEach((arrow, index) => {
          const direction = new THREE.Vector3();
          if (index === 0) direction.set(1, 0, 0); // X-axis
          else if (index === 1) direction.set(0, 1, 0); // Y-axis
          else if (index === 2) direction.set(0, 0, 1); // Z-axis
  
          // Apply the model's quaternion to get the correct direction
          direction.applyQuaternion(modelQuaternion);
          arrow.setDirection(direction);
  
          // Position the arrow at the origin
          arrow.position.copy(new THREE.Vector3(0, 0, 0));
        });
  
        // Update text label positions based on the arrow's direction and scale
        const updatedLabels = textLabels.map((label, index) => {
          const direction = new THREE.Vector3();
          if (index === 0) direction.set(1, 0, 0); // X-axis
          else if (index === 1) direction.set(0, 1, 0); // Y-axis
          else if (index === 2) direction.set(0, 0, 1); // Z-axis

          // Apply the model's quaternion to get the updated direction
          direction.applyQuaternion(modelQuaternion);

          // Calculate the text position based on arrow direction, scale it to position the text away from the arrow head
          const textLabelPosition = direction.multiplyScalar(80); // Adjust scalar to position the text farther from the arrows

          // Remove the old label from the scene
          sceneInitRef.current.scene.remove(label);
          
          // Create a new label with the updated text (gryoAccel values)
          const newText = index === 0 ? `X: ${gryoAccel[0].toFixed(2)}` :
                          index === 1 ? `Y: ${gryoAccel[1].toFixed(2)}` :
                                        `Z: ${gryoAccel[2].toFixed(2)}`;
          const updatedLabel = createTextLabel(newText, textLabelPosition);
          
          // Add the updated label to the scene
          sceneInitRef.current.scene.add(updatedLabel);

          // Return the updated label to replace the old one in the state
          return updatedLabel;
        });
  
        // Update the state with new label positions if necessary
        setTextLabels(updatedLabels);
      }
    }
  }, [rotation, loadedModel, arrowHelpers, gryoAccel]);
  

  return <canvas
  id="myThreeJsCanvas"
  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  style={{ width: 'auto', height: 'auto' }} // Optional to adjust size
/>;

}

export default MyThree;
