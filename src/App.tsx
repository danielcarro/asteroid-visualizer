import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import AsteroidImage from "./pages/AsteroidImage";


function App() {
  const [darkMode, setDarkMode] = useState(false); // estado do modo escuro

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}
      >
        <Route index element={<Home darkMode={darkMode} />} />
        <Route path="about" element={<About darkMode={darkMode} />} />
        <Route path="simulator" element={<Simulator darkMode={darkMode} />} />
        <Route path="dashboard" element={<Dashboard darkMode={darkMode} />} />   
        <Route path="asteroidimage" element={<AsteroidImage darkMode={darkMode} />} />       
      </Route>
    </Routes>
  );
}

export default App;
