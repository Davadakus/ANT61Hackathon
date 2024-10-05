# Quickstart
To run the web app, run `npm install` and `npm run dev` in the project root directory, then visit the link provided.

# List of Libraries/Dependencies
1. "d3": "^7.9.0"
2. "react": "^18.3.1",
3. "react-dom": "^18.3.1",
4. "three": "^0.169.0",
5. "three-stdlib": "^2.33.0"
6. TailWind
7. Vite
8. TypeScript
   
# Requirements
List of requirments and where they can be found in the codebase. Video demonstration: https://youtu.be/Cik_anyDUuw

![image](https://github.com/user-attachments/assets/c5e5d105-4750-4fd0-a2f1-81b7ffaae8e8)

## Data Parsing
`/utils/parse.ts` was used to parse all the data from the text file containing the Beacon's Live Data.

## Visualization
1. The visualization logic of the Beacon's live position is all entirely in `Three.tsx` and `/lib/SceneInit.tsx`, used as a set-up for the canvas to display the visualization of the Beacon. 
2. The component is then exported as `<MyThree />` into `App.tsx` on line X which will display the orientation and gyroscopic acceleration of the Beacon.
3. Live data is constantly being passed into the `<MyThree />` component which processes the data and reflect it in the canvas by updating its rotational data and gyroscopic acceleration at `Lines 148-237` in `Three.tsx`. The data being parsed in is also displayed on `App.tsx` on `Lines 98-161`.
4. Visual Location of the Beacon is processed in `Altitude.tsx` for the Altitude and `Map.tsx` for Longitude and Latitude. The component can also be found in `App.tsx` where it is displayed on the web app.

## User Interaction
Users are able to interact with the live visualization by moving, orientating, and zooming in to the Beacon that is being displayed on a XYZ plane. Users will have a good look of the beacon rotating and seeing the numbers update in real-time.

## Real-Time Updates
Like mentioned, the messages that are received are directly reflected in the visualization and table on the bottom right of the web app.

## Optional Extension
Predictive analysis was used based on the model using the formula below to calculate the future orientation of the Beacon. A simple kinematic model was used to predict the future orientation of the beacon.
$$x-\frac{1}{2}at^2+\frac{x_0-x_{-1}}{2}t+x_0$$

This can also be found at `Three.jsx` starting from `Lines 164`.
