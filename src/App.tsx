import MyThree from './Three.js';
import { useEffect, useState } from 'react';
import { parseRawMessages, parseMessage } from "./utils/parse.ts"
import Map, { updateMap } from "./Map.tsx"
import rawText from './assets/updated_beacon_output.txt?raw';



function App() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentLocation, setCurrentLocation] = useState([0,0,0]);
  const [messageId, setMessageId] = useState("");
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [gryoAccel, setGryoAccel] = useState([0, 0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      const duration: number = 5000;
      const fakeMessageStream: string[] = await parseRawMessages(rawText);
      
      let i = 0;
      const timeout = setInterval(() => { 
        const newMessage = fakeMessageStream[i];
        setCurrentMessage(newMessage);

        const [newMessageId, newLocation, newRotation, newGryoAccel] = parseMessage(newMessage);

        // Update states based on the parsed message
        if (newMessageId !== null) setMessageId(newMessageId);
        if (newRotation !== null) setRotation(newRotation);
        if (newGryoAccel !== null) setGryoAccel(newGryoAccel);
        if (newLocation !== null) {
          setCurrentLocation(newLocation);
          updateMap(newLocation);
        }

        i += 1;
        if (i >= fakeMessageStream.length) {
          clearInterval(timeout);
        }
      }, duration);
    };
  
    fetchData();
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-neutral-700">
      <div className="text-xl text-center font-bold mt-3"> 
        ANT61 Beacon Data Simulation
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 flex-1">
        
        {/* First column */}
        <div className="flex flex-col p-4 bg-stone-900 rounded space-y-4">
          <div>
            <h1 className="text-2xl text-center font-bold">Simulated Beacon</h1>
          </div>
          <div className="bg-blue-500 flex-1 overflow-hidden relative rounded">
            Simulation
            {/* <MyThree rotation={rotation} gryoAccel={gryoAccel}/> */}
          </div>
        </div>
        
        {/* Second column */}
        <div className="flex flex-col gap-4">
          <h1 className="flex flex-row gap-4 h-2/3">
            <h2 className="flex flex-col bg-stone-900 p-4 w-1/4 rounded">
              <h3 className="text-xl flex grow flex-col text-center">Altitude</h3>
              <h3 className="bg-neutral-700 h-full grow rounded">Altitude Content </h3>
            </h2>
            <h2 className="text-xl flex flex-col bg-stone-900 p-4 w-full rounded">
              <h3 className="flex flex-col"> Map</h3>
              <Map />
            </h2>
          </h1>


          {/* New section for two equal-width boxes
          <div className="flex gap-4">
            <div className="bg-green-500 flex-1 rounded">
              <h1 className="text-xl text-center font-bold px-6">Altitude Data</h1>
            </div>
            <div className="bg-green-500 flex-1 rounded basis-2/3 pt-4">
              <h1 className="text-2xl text-center font-bold">Map</h1>
            </div>
          </div>
          <div className="flex gap-4 basis-2/3">
            <div className="bg-gray-500 h-full grow rounded">
              Altitude content
            </div>
            <Map />
          </div> */}
          
          <div className="bg-gray-500 border-2 border-solid border-black h-full flex flex-col basis-1/3 rounded px-2">
            <h1 className="text-2xl text-center font-bold">Live Data Feed:</h1>
            <h1>Message ID: {messageId}</h1>
            <h1>Location: {currentLocation && currentLocation[0]}, {currentLocation && currentLocation[1]}, {currentLocation && currentLocation[2]}</h1>
            <h1>Rotation: {rotation && rotation[0]}, {rotation && rotation[1]}, {rotation && rotation[2]}</h1>
            <h1>Gyroscopic Acceleration: {gryoAccel && gryoAccel[0]}, {gryoAccel && gryoAccel[1]}, {gryoAccel && gryoAccel[2]}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
