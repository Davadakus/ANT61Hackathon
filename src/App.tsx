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
    <div className="min-h-screen flex flex-col bg-neutral-700">
      <div className="text-xl text-center font-bold mt-3 bg-stone-900 p-2 mx-4 rounded"> 
        ANT61 Beacon Data Visualizer
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 flex-1">
        
        {/* First column */}
        <div className="flex flex-col p-2 bg-stone-900 rounded space-y-4">
          <div>
            <h1 className="text-2xl text-center font-bold mt-2">Simulated Beacon</h1>
          </div>
          <div className="bg-neutral-700 flex overflow-hidden relative rounded mx-2 h-full">
            <MyThree pastRotation={pastRotation} rotation={rotation} gryoAccel={gryoAccel}/>
          </div>
        </div>
        
        {/* Second column */}
        <div className="flex flex-col gap-4">
          <h1 className="flex flex-row gap-4 h-2/3">
            <h2 className="flex flex-col bg-stone-900 p-4 w-1/3 rounded">
              <h3 className="flex flex-col text-center text-xl pb-2 font-bold">Altitude (km)</h3>
              <Altitude />
            </h2>
            <h2 className="flex flex-col  bg-stone-900 text-xl p-4 w-2/3 rounded">
              <h3 className="flex flex-col text-center pb-2 font-bold">Location (Longitude & Latitude)</h3>
              <Map />
            </h2>
          </h1>
          <div className="grid grid-cols text-justify bg-stone-900 rounded p-2">
            <div className="grid grid-cols-2 text-justify border-b-2 border-neutral-700">
              {/* MessageID Row */}
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1 ">Message ID:</h1>
              <h1 className="col-span-1">{messageId}</h1>
            </div>

            <div className="grid grid-cols-2 text-justify border-b-2 border-neutral-700">
              {/* Location Row */}
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1">Location:</h1>
              <div className="col-span-1 flex justify-between">
                <h1>{currentLocation && currentLocation[0]?.toFixed(2)}°</h1>
                <span>(Longitude)</span>
              </div>
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1"></h1> {/* Empty space for alignment */}
              <div className="col-span-1 flex justify-between">
                <h1>{currentLocation && currentLocation[1]?.toFixed(2)}°</h1>
                <span>(Latitude)</span>
              </div>
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1"></h1> {/* Empty space for alignment */}
              <div className="col-span-1 flex justify-between">
                <h1>{currentLocation && currentLocation[2]?.toFixed(2)} km</h1>
                <span>(Altitude)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 text-justify border-b-2 border-neutral-700">
              {/* Rotation Row */}
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1">Rotation:</h1>
              <div className="col-span-1 flex justify-between">
                <h1>{rotation && rotation[0]?.toFixed(2)}°</h1>
                <span>(X-Yaw)</span>
              </div>
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1"></h1> {/* Empty space for alignment */}
              <div className="col-span-1 flex justify-between">
                <h1>{rotation && rotation[1]?.toFixed(2)}°</h1>
                <span>(Y-Pitch)</span>
              </div>
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1"></h1> {/* Empty space for alignment */}
              <div className="col-span-1 flex justify-between">
                <h1>{rotation && rotation[2]?.toFixed(2)}°</h1>
                <span>(Z-Roll)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 text-justify">
              {/* Gyroscopic Acceleration Row */}
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1">Gyroscopic Acceleration:</h1>
              <div className="col-span-1 flex justify-between">
                <h1>{gryoAccel && gryoAccel[0]?.toFixed(2)} deg/s²</h1>
                <span>(X-axis)</span>
              </div>
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1"></h1> {/* Empty space for alignment */}
              <div className="col-span-1 flex justify-between">
                <h1>{gryoAccel && gryoAccel[1]?.toFixed(2)} deg/s²</h1>
                <span>(Y-axis)</span>
              </div>
              <h1 className="col-span-1 border-r-2 border-neutral-700 mx-1"></h1> {/* Empty space for alignment */}
              <div className="col-span-1 flex justify-between">
                <h1>{gryoAccel && gryoAccel[2]?.toFixed(2)} deg/s²</h1>
                <span>(Z-axis)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
