import { useEffect, useState } from "react";
import "./index.css";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
} from "react-leaflet";
import meteorfile from "./sample.json";
import L from "leaflet";
import meteorjpg from "./assets/meteor2.png";

function App() {
  const [position, setPosition] = useState({
    lat: 56.1210604250441,
    lng: 25.8837890625,
  });
  const [center, setCenter] = useState([56.1210604250441, 25.8837890625]);
  const [toggle, setToggle] = useState(true);
  const [mass, setMass] = useState(10000); 
  const [angle, setAngle] = useState(45); 
  const [velocity, setVelocity] = useState(20); 
  const [density, setDensity] = useState(3000); 
  const [targetDensity, setTargetDensity] = useState(2500); 
  const [craterDiameter, setCraterDiameter] = useState(0); 

  const [navigation, setNav] = useState("dashboard");
  const [meteorites, setMeteorites] = useState(
    meteorfile.filter((met) => met.year <= 2000)
  );
  const [currentYear, setCurrentYear] = useState(2000);
  const [categories, setCategories] = useState([]);

  const canvasRenderer = L.canvas();
  const meteorIcon = L.icon({
    iconUrl: meteorjpg,
    iconSize: [38, 38],
  });

  function LocationMarker(e) {
    let temp = 0;
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <>
        <Marker position={position}>
          <Popup>
            <h1 className="text-2xl font-semibold">Launch Meteor</h1>
            <button
              onClick={() => setNav("simulation")}
              className="bg-red-600 p-1 w-full text-white rounded-full"
            >
              Launch!
            </button>
          </Popup>
          <Circle
            center={position}
            radius={craterDiameter*100}
            fillColor="gray"
            color="red"
          />
        </Marker>
      </>
    );
  }

  function Simulation() {
    const calculateCraterDiameter = () => {
      const massInKg = mass / 1000; 
      const velocityInMs = velocity * 1000; 

      
      const kineticEnergy = 0.5 * massInKg * velocityInMs * velocityInMs;

      
      const craterDiameterCalc =
        0.07 *
        Math.pow(kineticEnergy / ((targetDensity * Math.PI * 4) / 3), 1 / 3);
      setCraterDiameter(craterDiameterCalc);
    };
    return (
      <section className="h-[100vh] overflow-scroll fixed bg-white p-5 w-[20rem] right-0 z-50 shadow-lg flex flex-col justify-between">
        <div>
          <button onClick={() => setNav("navigation")} className="p-2 border-2 rounded">
            Back to Dashboard
          </button>
          <h1 className="text-2xl">Meteorite Simulation</h1>
          <div className="bg-gray-100 p-3 rounded mt-3">
            <p>Lat: {position?.lat}</p>
            <p>Long: {position?.lng}</p>
          </div>
        </div>
        <div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Mass (g):
            </label>
            <input
              type="range"
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              min="1000"
              max="100000"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <p class="text-gray-500 text-xs mt-1">{mass} g</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Angle (degrees):
            </label>
            <input
              type="range"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              min="0"
              max="90"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <p class="text-gray-500 text-xs mt-1">{angle} degrees</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Velocity (km/s):
            </label>
            <input
              type="range"
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              min="1"
              max="72"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <p class="text-gray-500 text-xs mt-1">{velocity} km/s</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Density of Meteor (kg/m^3):
            </label>
            <input
              type="number"
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p class="text-gray-500 text-xs mt-1">{density} kg/m^3</p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">
              Density of Target Material (kg/m^3):
            </label>
            <input
              type="number"
              value={targetDensity}
              onChange={(e) => setTargetDensity(Number(e.target.value))}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p class="text-gray-500 text-xs mt-1">{targetDensity} kg/m^3</p>
          </div>

          <h2 class="text-lg font-semibold text-gray-900">
            Estimated Crater Diameter: {craterDiameter.toFixed(2)} meters
          </h2>
        </div>

        <button
          className="w-100 py-3 px-2 text-xl font-semibold bg-red-500 text-white rounded-full"
          onClick={calculateCraterDiameter}
        >
          Launch!
        </button>
      </section>
    );
  }

  function Visualize() {
    const handleYearChange = (event) => {
      const year = parseInt(event.target.value, 10);
      setCurrentYear(year);
      setMeteorites(meteorfile.filter((met) => met.year <= year));
    };
    return (
      <>
        <div className="bg-white fixed p-4 bottom-0 left-0 z-50 m-5">
          <p>From {currentYear} to 2013</p>
          <h1 className="text-xl font-bold">🤯{meteorites.length} Meteor!</h1>
          <h1 className="text-xl font-bold">
            🤯{categories.length} Meteor type!
          </h1>
          <h1 className="text-2xl font-semibold mt-10">🌠Biggest Meteor</h1>
          <div className="py-3 px-2 text-white bg-gray-700 font-medium rounded mt-5">
            <p>
              {meteorites.sort((x, y) => y["mass (g)"] - x["mass (g)"])[0].name}
            </p>
            <p>
              {
                meteorites.sort((x, y) => y["mass (g)"] - x["mass (g)"])[0][
                  "mass (g)"
                ]
              } g
            </p>
          </div>
        </div>
        <section className="h-[100vh] fixed bg-gray-800 p-5 w-[20rem] right-0 z-50 shadow-lg flex flex-col justify-between">
          <div className="space-y-5">
            <button
              onClick={() => setNav("simulation")}
              className="bg-gray-900 text-white rounded p-2"
            >
              Go to Simulation
            </button>
            <h1 className="text-2xl font-bold text-white">
              Data Visualization
            </h1>
            <div className="bg-gray-700 p-3 text-white flex gap-3 justify-center items-center">
              <h1>Year</h1>
              <input
                type="range"
                min={2000}
                max={2013}
                value={currentYear}
                onChange={handleYearChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xl">{currentYear}</p>
            </div>

            <div className="text-white">
              <h1>Type</h1>
              <select
                className="bg-gray-600 text-white p-4"
                onChange={(e) =>
                  setMeteorites(
                    meteorfile.filter((met) => met.recclass == e.target.value)
                  )
                }
              >
                {categories.map((cat) => (
                  <option value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </>
    );
  }

  useEffect(() => {
    const met = [...new Set(meteorites.map((x) => x.recclass))];

    setCategories(met);
  }, [meteorites]);
  return (
    <>
      <div className="fixed bg-white z-50 right-[320px] top-0 m-5 p-4 rounded-xl space-y-2">
        <p className="text-lg">Toggle Meteor History</p>
        <button
          className="py-1 rounded-full w-full bg-gray-800 text-white"
          onClick={() => setToggle(!toggle)}
        >
          {!toggle ? "Visible" : "Invisible"}
        </button>
      </div>
      {navigation == "simulation" ? <Simulation /> : <Visualize />}
      <MapContainer
        center={center}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        zoom={10}
        minZoom={2}
        maxZoom={40}
        style={{ height: "100vh", zIndex: "20" }}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
        {toggle &&
          meteorites.map(
            (meteor, index) =>
              meteor.reclat &&
              meteor.reclong && (
                <Marker
                  key={index}
                  position={[meteor.reclong, meteor.reclat]}
                  icon={meteorIcon}
                  renderer={canvasRenderer}
                >
                  <Popup>
                    <div>
                      <h1 className="font-bold">A meteorite landed here!</h1>
                      <div className="-space-y-1">
                        <p>Name: {meteor.name}</p>
                        <p>Class: {meteor.recclass}</p>
                        <p>Mass: {meteor["mass (g)"]} g</p>
                        <p>Year: {meteor.year}</p>
                      </div>
                    </div>
                  </Popup>
                  <>
                    <Circle
                      center={[meteor.reclong, meteor.reclat]}
                      radius={3000}
                      fillColor="gray"
                      color="red"
                    />
                  </>
                </Marker>
              )
          )}
      </MapContainer>
    </>
  );
}

export default App;
