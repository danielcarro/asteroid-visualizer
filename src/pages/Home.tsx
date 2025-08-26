import { Link } from "react-router-dom";

interface HomeProps {
  darkMode: boolean;
}

export default function Home({ darkMode }: HomeProps) {
  const textColor = darkMode ? "text-light" : "text-dark";
  const textMuted = darkMode ? "text-secondary text-opacity-75" : "text-muted";

  const cardBg = darkMode ? "bg-dark text-light" : "bg-white text-dark";

  return (
    <div className={`container py-5 ${darkMode ? "bg-dark" : "bg-light"}`}>
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className={`display-4 fw-bold mb-3 ${textColor}`}>
          <i className="bi bi-rocket-fill me-2"></i>NASA Asteroid Impact Simulator
        </h1>
        <p className={`lead mb-4 ${textMuted}`}>
          Explore near-Earth asteroid impacts in real-time. Adjust asteroid parameters, select impact locations, and visualize the consequences with scientific accuracy.
        </p>
        <Link to="/simulator" className="btn btn-primary btn-lg shadow-lg">
          <i className="bi bi-planet me-2"></i>Launch Simulator
        </Link>
      </div>

      {/* Feature Highlights */}
      <div className="row g-4 text-center">
        <div className="col-md-4">
          <div className={`card h-100 shadow-sm border-0 ${cardBg}`}>
            <div className="card-body">
              <i className="bi bi-bar-chart-line-fill fs-1 text-primary mb-3"></i>
              <h5 className="card-title fw-bold">Real-Time Impact Data</h5>
              <p className={`card-text ${textMuted}`}>
                Access scientific simulations with precise asteroid trajectory calculations and impact metrics.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card h-100 shadow-sm border-0 ${cardBg}`}>
            <div className="card-body">
              <i className="bi bi-geo-alt-fill fs-1 text-primary mb-3"></i>
              <h5 className="card-title fw-bold">Interactive Map</h5>
              <p className={`card-text ${textMuted}`}>
                Choose any location on Earth to simulate an asteroid impact and visualize the affected area.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card h-100 shadow-sm border-0 ${cardBg}`}>
            <div className="card-body">
              <i className="bi bi-lightning-fill fs-1 text-primary mb-3"></i>
              <h5 className="card-title fw-bold">Dynamic Visualizations</h5>
              <p className={`card-text ${textMuted}`}>
                Watch interactive graphics showing impact effects, craters, and environmental consequences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note / CTA */}
      <div className="text-center mt-5">
        <p className={textMuted}>
          Learn about asteroid hazards and explore simulations designed with NASA data. Start experimenting now!
        </p>        
      </div>
    </div>
  );
}
