import { Space } from "antd";
import "./index.css";
import Model from "./Model";
import { defaultValueCFG } from "./default";

function App() {
  return (
    <>
      {Object.keys(defaultValueCFG).map((brand) => {
        return (
          <Space key={brand}>
            <Model brand={brand} models={Object.keys(defaultValueCFG[brand])} />
          </Space>
        );
      })}
    </>
  );
}

export default App;
