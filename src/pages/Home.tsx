import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <div className="text-center my-5">
        <h1 className="display-5">🏠 Welcome to NASA Asteroid Impact Simulator</h1>
        <p className="lead mt-3">
          Explore near-Earth asteroid impacts in real-time! Adjust asteroid parameters, set the impact location, and visualize the consequences.
        </p>

        <div className="mt-4 d-flex flex-column flex-md-row justify-content-center gap-3">
          <Link to="/simulator" className="btn btn-primary btn-lg">
            🪐 Go to Simulator
          </Link>          
        </div>

        <p className="text-muted mt-4">
          Click on the Simulator to interact with asteroid impacts and learn more about space hazards.
        </p>
      </div>
    </div>
  );
}

export default Home;
