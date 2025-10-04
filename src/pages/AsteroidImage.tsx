import { useEffect, useState } from "react";

interface AboutProps {
  darkMode: boolean;
}

interface AstroItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: "asteroid" | "comet";
}

function AsteroidImage({ darkMode }: AboutProps) {
  const bgClass = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const [items, setItems] = useState<AstroItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
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
        allAsteroids = allAsteroids.slice(0, 121); // limit to 121 asteroids/comets

        const albumData: AstroItem[] = await Promise.all(
          allAsteroids.map(async (asteroid: any, index: number) => {
            const isAsteroid = index % 2 === 0;
            const type: "asteroid" | "comet" = isAsteroid ? "asteroid" : "comet";

            const title = isAsteroid
              ? `Asteroid ${asteroid.name || index + 1}`
              : `Stellar Comet ${index + 1}`;

            const description = isAsteroid
              ? `An asteroid orbiting near Earth, composed mainly of metallic rocks and cosmic dust.`
              : `A bright comet visible in the night sky, made of ice and dust that forms a luminous tail when approaching the Sun.`;

            // 🔹 Fetch real images from NASA Image and Video Library
            let image = "";
            try {
              const imgRes = await fetch(
                `https://images-api.nasa.gov/search?q=${encodeURIComponent(
                  asteroid.name
                )}&media_type=image`
              );
              const imgData = await imgRes.json();
              image =
                imgData?.collection?.items?.[0]?.links?.[0]?.href ||
                "https://www.nasa.gov/sites/default/files/thumbnails/image/asteroid20131202-full.jpg"; // fallback
            } catch {
              image = "https://www.nasa.gov/sites/default/files/thumbnails/image/asteroid20131202-full.jpg";
            }

            return {
              id: (index + 1).toString(),
              title,
              description,
              image,
              type,
            };
          })
        );

        setItems(albumData);
      } catch (error) {
        console.error("Error loading asteroid data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={`container my-5 ${bgClass}`}>
      <h1 className="display-3 text-start mb-4">
        <i className="bi bi-images me-2"></i>Asteroids & Comets Album
      </h1>

      {loading ? (
        <p className="text-center">Loading images...</p>
      ) : (
        <>
          <div className="row g-4">
            {currentItems.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{item.title}</h5>
                    <p className="card-text flex-grow-1">{item.description}</p>
                    <button
                      className="btn mt-2"
                      style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        transition: "0.3s",
                      }}
                      onMouseOver={(e) =>
                        ((e.target as HTMLButtonElement).style.backgroundColor = "#333")
                      }
                      onMouseOut={(e) =>
                        ((e.target as HTMLButtonElement).style.backgroundColor = "#000")
                      }
                    >
                      {item.type === "asteroid" ? "Asteroid" : "Comet"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => paginate(i + 1)}>
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

export default AsteroidImage;
