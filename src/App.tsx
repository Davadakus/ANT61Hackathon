import MyThree from './Three.js';
import React, { useEffect, useState, useRef, Ref} from 'react';
import { parseRawMessages, parseMessage } from "./utils/parse.ts"
import Map, { updateMap } from "./Map.tsx"
import Altitude, { updateAltMap } from './Altitude.tsx';
import rawText from './assets/updated_beacon_output.txt?raw';



function App() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentLocation, setCurrentLocation] = useState([0,0,0]);
  const [messageId, setMessageId] = useState("");
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [pastRotation, setPastRotation] = useState([0, 0, 0]);
  const [gryoAccel, setGryoAccel] = useState([0, 0, 0]);

  const indexRef: any = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const duration: number = 1000;
      const fakeMessageStream: string[] = await parseRawMessages(rawText);
      
      // Clear any previous interval if exists (cleanup)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => { 
        const i = indexRef.current;
        const newMessage = fakeMessageStream[i];
        setCurrentMessage(newMessage);

        const [newMessageId, newLocation, newRotation, newGryoAccel] = parseMessage(newMessage);

        // Update states based on the parsed message
        if (newMessageId !== null) setMessageId(() => newMessageId);
        if (newRotation !== null) setRotation(() => {
          setPastRotation(rotation);
          return newRotation;
        });
        if (newGryoAccel !== null) setGryoAccel(() => newGryoAccel);
        if (newLocation !== null) {
          setCurrentLocation(() => {
            updateMap(newLocation);     // Update the map
            updateAltMap(newLocation);  // Update the altitude map
            return newLocation;         // Return the updated location
          });
        }

        indexRef.current += 1;  // Increment the ref value for the next iteration
        if (indexRef.current >= fakeMessageStream.length) {
          clearInterval(intervalRef.current);
        }
      }, duration);
    };
  
    fetchData();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <h1 className="text-xl text-center font-bold"> 
        ANT61 Beacon Data Simulation
      </h1>
      <div className="grid grid-cols-2 gap-4 p-4 flex-1">
        {/* First column */}
        <div className="flex flex-col space-y-4">
          <div className="bg-blue-500 flex-1 overflow-hidden relative">
            Simulation
            <MyThree pastRotation={pastRotation} rotation={rotation} gryoAccel={gryoAccel}/>
          </div>
        </div>

        {/* Second column */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 basis-2/3">
            <Altitude></Altitude> 
            <Map></Map>
          </div>
          <div className="bg-green-500 h-full flex flex-col basis-1/3">
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
