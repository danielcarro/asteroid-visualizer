"use client";

import { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Tab, Tabs } from "react-bootstrap";

interface AboutProps {
  darkMode: boolean;
}

interface AstroItem {
  id: string;
  name: string;
  diameter: number; // in km
  isHazardous: boolean;
  approachDate: string;
  velocity: number; // km/h
  nasa_jpl_url: string;
  type: "asteroid" | "comet"; // alternado
}

function AstronomicalObjects({ darkMode }: AboutProps) {
  const bgClass = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const cardClass = darkMode ? "bg-secondary text-light" : "bg-white text-dark";

  const [items, setItems] = useState<AstroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "asteroid" | "comet" | "hazardous">("all");
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=25WnxHvwNcN9cDTBNiiqXn2YliM7wW2gkDmGuPXC`
        );
        const data = await response.json();
        const allAsteroids = (data.near_earth_objects || []).slice(0, 121);

        const albumData: AstroItem[] = allAsteroids.map((asteroid: any, index: number) => ({
          id: asteroid.id,
          name: asteroid.name,
          diameter:
            (asteroid.estimated_diameter.kilometers.estimated_diameter_max +
              asteroid.estimated_diameter.kilometers.estimated_diameter_min) /
            2,
          isHazardous: asteroid.is_potentially_hazardous_asteroid,
          approachDate:
            asteroid.close_approach_data?.[0]?.close_approach_date || "Unknown",
          velocity:
            Number(asteroid.close_approach_data?.[0]?.relative_velocity.kilometers_per_hour) ||
            0,
          nasa_jpl_url: asteroid.nasa_jpl_url,
          type: index % 2 === 0 ? "asteroid" : "comet",
        }));

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
      <h1 className="display-3 text-start mb-4">Asteroids & Comets Data</h1>

      {/* Tabs */}
      <Tabs
        activeKey={filter}
        onSelect={(k) => {
          setFilter(k as any);
          setCurrentPage(1);
        }}
        className="mb-4"
        variant={darkMode ? "pills" : "tabs"}
      >
        <Tab eventKey="all" title="All" />
        <Tab eventKey="asteroid" title="Asteroids" />
        <Tab eventKey="comet" title="Comets" />
        <Tab eventKey="hazardous" title="Potentially Hazardous" />
      </Tabs>

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
                      Click to view more details
                    </Tooltip>
                  }
                >
                  <div className={`card h-100 shadow-sm border-0 ${cardClass}`}>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{item.name}</h5>
                      <p className="card-text mb-1">
                        <strong>Type:</strong> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Diameter:</strong> {item.diameter.toFixed(2)} km
                      </p>
                      <p className="card-text mb-1">
                        <strong>Hazardous:</strong> {item.isHazardous ? "Yes" : "No"}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Close Approach:</strong> {item.approachDate}
                      </p>
                      <p className="card-text mb-3">
                        <strong>Velocity:</strong> {Number(item.velocity).toFixed(2)} km/h
                      </p>
                      <a
                        href={item.nasa_jpl_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary mt-auto"
                      >
                        View on JPL
                      </a>
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
    </div>
  );
}

export default AstronomicalObjects;
