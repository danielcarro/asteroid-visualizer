interface AboutProps {
  darkMode: boolean;
}

function About({ darkMode }: AboutProps) {
  const bgClass = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const textMutedClass = darkMode ? "text-secondary" : "text-muted";

  return (
    <div className={`container my-5 ${bgClass}`}>
      <div className="text-center">
        <h1 className="display-5 mb-3">
          <i className="bi bi-info-circle-fill me-2"></i>About Us
        </h1>

        <p className={`lead mt-3 ${textMutedClass}`}>
          This project is the NASA Asteroid Impact Simulator, designed to let users explore asteroid impact scenarios by adjusting asteroid parameters, selecting impact locations, and visualizing potential consequences on Earth.
        </p>

        <p className={`mt-3 ${textMutedClass}`}>
          <strong>Developed by the Generation Code team:</strong> a father-and-children group dedicated to software innovation from <strong>São Paulo, Brazil</strong>.
        </p>
        
        <div className="row justify-content-center mt-4 g-3">
          <div className="col-6 col-md-3 text-center">
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocLB7U1ESOkucFwP0G03JRDnyCDQToH96jURS2k1913E8HhJ5DI=s288-c-no"
              alt="Daniel"
              className="rounded-circle border border-2 border-primary"
              style={{ width: 150, height: 150, objectFit: 'cover' }}
            />
            <p className="mt-2"><strong>Daniel</strong><br />Father & Software Engineer</p>
          </div>

          <div className="col-6 col-md-3 text-center">
            <img
              src="https://media.licdn.com/dms/image/v2/D4E03AQEGa6v9zqCrMg/profile-displayphoto-scale_200_200/B4EZjHzO.8GYAw-/0/1755698757360?e=1759363200&v=beta&t=3f-hwK3XAx_-sXbXqHsIlN4tWtkQJ4t3pZG6FYl1Oq8"
              alt="Gabriela"
              className="rounded-circle border border-2 border-success"
              style={{ width: 150, height: 150, objectFit: 'cover' }}
            />
            <p className="mt-2"><strong>Gabriela</strong><br />Daughter & Computer Engineering Student</p>
          </div>

          <div className="col-6 col-md-3 text-center">
            <img
              src="https://axe.avacursosonline.com.br/ma.jpg"
              alt="Matheus"
              className="rounded-circle border border-2 border-warning"
              style={{ width: 150, height: 150, objectFit: 'cover' }}
            />
            <p className="mt-2"><strong>Matheus</strong><br />Son & Systems Development Student</p>
          </div>
        </div>
   
        <div className="mt-5 d-flex justify-content-center align-items-center gap-3">
          <div style={{ width: 200, height: 80 }}>
            <svg width="200" height="80" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="80" fill="#007BFF" />
              <text x="100" y="50" fontSize="20" fill="#fff" textAnchor="middle" fontFamily="Arial, sans-serif">
                Generation Code
              </text>
            </svg>
          </div>

          <div style={{ width: 100, height: 60 }}>
            <svg width="100" height="60" viewBox="0 0 720 504" xmlns="http://www.w3.org/2000/svg">
              <rect width="720" height="504" fill="#009C3B"/>
              <polygon points="360,0 720,252 360,504 0,252" fill="#FFDF00"/>
              <circle cx="360" cy="252" r="108" fill="#002776"/>
            </svg>
          </div>
        </div>

        <p className={`mt-4 ${textMutedClass}`}>
          The team participated in the NASA Hackathon 2025, aiming to demonstrate interactive data visualization, simulation, and a modern interface.
        </p>

        <p className="mt-4">
          <i className="bi bi-rocket-fill me-2 text-primary"></i>
          Our goal is to inspire learning and engagement with space science through practical, hands-on simulations.
        </p>
      </div>
    </div>
  );
}

export default About;
