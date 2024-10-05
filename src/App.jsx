import MyThree from './Three.jsx';
import { useEffect, useState } from 'react';
import { parseRawMessages, parseMessage } from "./utils/parse.ts"
import rawText from './assets/updated_beacon_output.txt?raw';



function App() {
  const [currentMessage, setCurrentMessage] = useState("")
  let [messageId, location, rotation, gryoAccel] = parseMessage(currentMessage);

  useEffect(() => {
    const fetchData = async () => {
      const duration: number = 3000;
      const fakeMessageStream: string[] = await parseRawMessages(rawText);
      
      let i = 0;
      const timeout = setInterval(() => { 
        setCurrentMessage(fakeMessageStream[i]);
        i += 1;
        if (i >= fakeMessageStream.length) {
          clearInterval(timeout);
        }
      }, duration);
    };
  
    fetchData();
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <MyThree />
      <h1 className="text-xl text-center font-bold"> 
        ANT61 Beacon Data Simulation
      </h1>
      <div className="grid grid-cols-2 gap-4 p-4 flex-1">
        {/* First column */}
        <div className="flex flex-col space-y-4">
          <div className="bg-blue-500 flex-1">
            Simulation
          </div>
        </div>

        {/* Second column */}
        <div className="grid grid-rows-3 gap-4">
          <div className="bg-green-500 h-full">Longitude x Latitude</div>
          <div className="bg-green-500 h-full">Altitude Data</div>
          <div className="bg-green-500 h-full flex flex-col">
            <h1>Message ID: {messageId}</h1>
            <h1>Location: {location && location[0]}, {location && location[1]}, {location && location[2]}</h1>
            <h1>Rotation: {rotation && rotation[0]}, {rotation && rotation[1]}, {rotation && rotation[2]}</h1>
            <h1>Gyroscopic Acceleration: {gryoAccel && gryoAccel[0]}, {gryoAccel && gryoAccel[1]}, {gryoAccel && gryoAccel[2]}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
