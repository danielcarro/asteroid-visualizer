function About() {
  return (
    <div className="container my-5">
      <div className="text-center">
        <h1 className="display-5">ℹ️ About Us</h1>
        <p className="lead mt-3">
          This is an example application built for the NASA Asteroid Impact Simulator project.
        </p>
        <p className="mt-3">
          It allows users to explore asteroid impact scenarios by setting asteroid parameters, selecting an impact location, and visualizing the potential consequences on Earth.
        </p>
        <p className="mt-3 text-muted">
          The goal of this project is to demonstrate interactive data visualization, simulation, and a responsive web interface using React, TypeScript, and React-Leaflet.
        </p>
      </div>
    </div>
  );
}

export default About;
