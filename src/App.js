import {  Space } from "antd";
import "./index.css";
import Model from "./Model";

function App() {
  return (
    <>
      {Object.keys(models).map((brand) => {
        return (
          <Space key={brand}>
            <Model brand={brand} models={models[brand]} />
          </Space>
        );
      })}
    </>
  );
}

const models = {
  AnyCubic: ["AnyCubic Photon", "AnyCubic Photon-s"],
  ELEGOO: [
    "ELEGOO MARS",
    "ELEGOO MARS C",
    "ELEGOO MARS PRO",
    "ELEGOO MARS 2",
    "ELEGOO MARS 2 PRO",
    "ELEGOO SATURN",
  ],
  Flashforge: ["Flashforge Explorer Max"],
  "Longer 3D": [
    "Longer 3D Orange10",
    "Longer 3D Orange30",
    "Longer 3D Orange4K",
  ],
  Peopoly: ["Peopoly Phenom", "Peopoly Phenom L", "Peopoly Phenom Noir"],
  "Phrozen Suffle": [
    "Phrozen Shuffle",
    "Phrozen Shuffle Lite",
    "Phrozen Shuffle 16",
    "Phrozen Shuffle XL",
    "Phrozen Shuffle XL Lite",
    "Phrozen Shuffle 4K",
  ],
  "Phrozen Sonic": [
    "Phrozen Sonic Mini",
    "Phrozen Sonic Mini 4K",
  ],
  Zortrax: ["Zortrax Inkspire"],
};
export default App;
