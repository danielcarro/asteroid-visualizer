import { useEffect, useState } from "react";
import { Modal, Carousel, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";

interface AboutProps {
  darkMode: boolean;
}

interface AstroItem {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  type: "asteroid" | "comet";
  diameter: number; // in meters
  isHazardous: boolean;
  approachDate: string;
  velocity: number; // km/h
}

function AsteroidImage({ darkMode }: AboutProps) {
  const bgClass = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const cardClass = darkMode ? "bg-secondary text-light" : "bg-white text-dark";

  const [items, setItems] = useState<AstroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<AstroItem | null>(null);
  const [filter, setFilter] = useState<"all" | "asteroid" | "comet" | "hazardous">("all");
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchItems() {
      try {
        const today = new Date();
        const startDate = today.toISOString().split("T")[0];
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        const endDate = nextWeek.toISOString().split("T")[0];

        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=HoZ33gKJoBnLh4KhClb8Vbuzygaq64GreezS2Qhu`
        );
        const data = await response.json();
        let allAsteroids = Object.values(data.near_earth_objects).flat();
        allAsteroids = allAsteroids.slice(0, 121);

        const albumData: AstroItem[] = allAsteroids.map((asteroid: any, index: number) => {
          const isAsteroid = index % 2 === 0;
          const type: "asteroid" | "comet" = isAsteroid ? "asteroid" : "comet";

          const name = asteroid.name || `Asteroid ${index + 1}`;
          const title = isAsteroid ? `Asteroid ${name}` : `Stellar Comet ${index + 1}`;
          const description = isAsteroid
            ? "An asteroid orbiting near Earth, composed mainly of metallic rocks and cosmic dust."
            : "A bright comet visible in the night sky, made of ice and dust that forms a luminous tail when approaching the Sun.";

          const image =
            "https://www.nasa.gov/sites/default/files/thumbnails/image/asteroid20131202-full.jpg";

          const diameter = asteroid.estimated_diameter.meters.estimated_diameter_max || 100;
          const isHazardous = asteroid.is_potentially_hazardous_asteroid;
          const approachDate = asteroid.close_approach_data?.[0]?.close_approach_date || "Unknown";
          const velocity =
            asteroid.close_approach_data?.[0]?.relative_velocity.kilometers_per_hour || 0;

          return {
            id: (index + 1).toString(),
            name,
            title,
            description,
            image,
            type,
            diameter,
            isHazardous,
            approachDate,
            velocity,
          };
        });

        setItems(albumData);
      } catch (error) {
        console.error("Error loading asteroid data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "hazardous") return item.isHazardous;
    return item.type === filter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={`container my-5 ${bgClass}`}>
      <h1 className="display-3 text-start mb-4">Asteroids & Comets Album</h1>

      {/* Filters */}
      <div className="mb-4 d-flex gap-2">
        {["all", "asteroid", "comet", "hazardous"].map((f) => (
          <button
            key={f}
            className={`btn ${filter === f ? "btn-primary" : darkMode ? "btn-secondary" : "btn-light"}`}
            onClick={() => setFilter(f as any)}
          >
            {f === "all" ? "All" : f === "hazardous" ? "Potentially Hazardous" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading asteroids and comets...</p>
      ) : (
        <>
          <div className="row g-4">
            {currentItems.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-${item.id}`}>
                      Diameter: {item.diameter.toFixed(2)} m<br />
                      Velocity: {Number(item.velocity).toFixed(2)} km/h<br />
                      Hazardous: {item.isHazardous ? "Yes" : "No"}<br />
                      Close Approach: {item.approachDate}
                    </Tooltip>
                  }
                >
                  <div
                    className={`card h-100 shadow-sm border-0 ${cardClass}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{item.title}</h5>
                      <p className="card-text flex-grow-1">{item.description}</p>
                      <button className="btn mt-2" style={{ backgroundColor: "#000", color: "#fff" }}>
                        {item.type === "asteroid" ? "Asteroid" : "Comet"}
                      </button>
                    </div>
                  </div>
                </OverlayTrigger>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav className="mt-4">
            <ul className={`pagination justify-content-center ${darkMode ? "bg-dark p-2 rounded" : ""}`}>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""} ${darkMode ? "bg-secondary" : ""}`}
                >
                  <button
                    className={`page-link ${darkMode ? "text-light" : ""}`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* Modal */}
      {selectedItem && (
        <Modal show={true} onHide={() => setSelectedItem(null)} size="lg" centered>
          <Modal.Header closeButton className={darkMode ? "bg-dark text-light" : ""}>
            <Modal.Title>{selectedItem.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className={darkMode ? "bg-secondary text-light" : ""}>
            <Carousel variant={darkMode ? "dark" : undefined}>
              {[selectedItem.image].map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img className="d-block w-100" src={img} alt={selectedItem.title} />
                </Carousel.Item>
              ))}
            </Carousel>

            <ul className="mt-3">
              <li><strong>Diameter:</strong> {selectedItem.diameter.toFixed(2)} m</li>
              <li><strong>Potentially Hazardous:</strong> {selectedItem.isHazardous ? "Yes" : "No"}</li>
              <li><strong>Close Approach Date:</strong> {selectedItem.approachDate}</li>
              <li><strong>Velocity:</strong> {Number(selectedItem.velocity).toFixed(2)} km/h</li>
            </ul>
          </Modal.Body>
          <Modal.Footer className={darkMode ? "bg-dark" : ""}>
            <Link to="/simulator" className="btn btn-primary">Go to Simulator</Link>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default AsteroidImage;
