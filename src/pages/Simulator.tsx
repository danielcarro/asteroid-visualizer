import AsteroidSimulator from "../components/AsteroidSimulator";

interface SimulatorProps {
  darkMode: boolean;
}

function Simulator({ darkMode }: SimulatorProps) {
  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100 p-4" : "bg-light text-dark min-vh-100 p-4"}>
      <h2 className="mb-4">
        <i className="bi bi-rocket-fill me-2"></i>Simulator
      </h2>
      <AsteroidSimulator darkMode={darkMode} />
    </div>
  );
}

export default Simulator;
