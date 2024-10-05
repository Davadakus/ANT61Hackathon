import MyThree from './Three.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <MyThree /> */}
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
          <div className="bg-green-500 h-full">Parsed Data</div>
        </div>
      </div>
    </div>
  );
}

export default App;
