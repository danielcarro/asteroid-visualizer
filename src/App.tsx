import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import About from "./pages/About";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />   
        <Route path="simulator" element={<Simulator />} />      
      </Route>
    </Routes>
  );
}

export default App;
