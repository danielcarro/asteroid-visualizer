"use client";

import { useEffect, useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, PieChart, Pie, Cell
} from "recharts";

interface Asteroid {
  id: string;
  name: string;
  link: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  orbital_data?: {
    eccentricity?: string;
    inclination?: string;
    perihelion_distance?: string;
  };
  close_approach_data?: {
    close_approach_date: string;
    relative_velocity: { kilometers_per_second: string };
    miss_distance: { kilometers: string };
  }[];
}

interface DashboardProps {
  darkMode: boolean;
}

export default function Dashboard({ darkMode }: DashboardProps) {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [diameterFilter, setDiameterFilter] = useState<[number, number]>([0, 50]);
  const [inclinationFilter, setInclinationFilter] = useState<[number, number]>([0, 180]);

  // 🔹 Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchAsteroids() {
      try {
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=25WnxHvwNcN9cDTBNiiqXn2YliM7wW2gkDmGuPXC`
        );
        const data = await res.json();        
        setAsteroids(data.near_earth_objects || []);
      } catch (err) {
        console.error("Erro ao buscar asteroides:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAsteroids();
  }, []);

  const filteredAsteroids = asteroids.filter(a => {
    const diameter =
      (a.estimated_diameter.kilometers.estimated_diameter_min +
        a.estimated_diameter.kilometers.estimated_diameter_max) / 2;
    const inc = Number(a.orbital_data?.inclination || 0);
    return (
      a.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      diameter >= diameterFilter[0] &&
      diameter <= diameterFilter[1] &&
      inc >= inclinationFilter[0] &&
      inc <= inclinationFilter[1]
    );
  });

  // 🔹 Paginação
  const totalPages = Math.ceil(filteredAsteroids.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAsteroids = filteredAsteroids.slice(startIndex, startIndex + itemsPerPage);

  const cardClass = darkMode ? "card bg-dark text-light shadow-sm" : "card bg-white text-dark shadow-sm";
  const tableClass = darkMode ? "table table-dark table-striped table-hover mb-0" : "table table-striped table-hover mb-0";
  const bgClass = darkMode ? "bg-secondary text-light" : "bg-light text-dark";

  const PIE_COLORS = ["#82ca9d", "#ff7300"];
  const hazardousCount = filteredAsteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
  const safeCount = filteredAsteroids.length - hazardousCount;
  const hazardData = [
    { name: "Safe", value: safeCount },
    { name: "Hazardous", value: hazardousCount }
  ];

  const histogramBins = [0, 1, 5, 10, 20, 50, 100];
  const diameterHistogram = histogramBins.slice(0, -1).map((min, i) => {
    const max = histogramBins[i + 1];
    const count = filteredAsteroids.filter(a => {
      const diameter = (a.estimated_diameter.kilometers.estimated_diameter_min + a.estimated_diameter.kilometers.estimated_diameter_max) / 2;
      return diameter >= min && diameter < max;
    }).length;
    return { range: `${min}-${max}`, count };
  });

  const approachData = filteredAsteroids
    .map(a => a.close_approach_data?.[0])
    .filter(Boolean)
    .map(c => ({
      distance: Number(c!.miss_distance.kilometers),
      velocity: Number(c!.relative_velocity.kilometers_per_second)
    }));

  const decadeCounts: Record<string, number> = {};
  filteredAsteroids.forEach(a => {
    a.close_approach_data?.forEach(c => {
      const year = new Date(c.close_approach_date).getFullYear();
      const decade = Math.floor(year / 10) * 10;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    });
  });
  const timelineData = Object.entries(decadeCounts)
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => Number(a.decade) - Number(b.decade));

  return (
    <div className={`container-fluid p-3 ${bgClass}`}>
      <h1 className="mb-4">Dashboard - Near Earth Objects</h1>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">Search Asteroid</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter asteroid name"
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">
            Diameter (km): {diameterFilter[0]} - {diameterFilter[1]}
          </label>
          <input
            type="range" min={0} max={50} value={diameterFilter[0]}
            onChange={e => setDiameterFilter([Number(e.target.value), diameterFilter[1]])}
            className="form-range mb-1"
          />
          <input
            type="range" min={0} max={50} value={diameterFilter[1]}
            onChange={e => setDiameterFilter([diameterFilter[0], Number(e.target.value)])}
            className="form-range"
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">
            Orbital Inclination (°): {inclinationFilter[0]} - {inclinationFilter[1]}
          </label>
          <input
            type="range" min={0} max={180} value={inclinationFilter[0]}
            onChange={e => setInclinationFilter([Number(e.target.value), inclinationFilter[1]])}
            className="form-range mb-1"
          />
          <input
            type="range" min={0} max={180} value={inclinationFilter[1]}
            onChange={e => setInclinationFilter([inclinationFilter[0], Number(e.target.value)])}
            className="form-range"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading asteroids...</p>
      ) : (
        <>
          {/* TABELA COM PAGINAÇÃO */}
          <div className="row mb-4">
            <div className="col-12">
              <div className={cardClass}>
                <div className="card-header">Asteroid List</div>
                <div className="card-body p-0 table-responsive">
                  <table className={tableClass}>
                    <thead className={darkMode ? "" : "table-light"}>
                      <tr>
                        <th>Name</th>
                        <th>Magnitude (H)</th>
                        <th>Diameter (km)</th>
                        <th>Inclination (°)</th>
                        <th>Eccentricity</th>
                        <th>Perihelion (AU)</th>
                        <th>Hazardous</th>
                        <th>Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAsteroids.map(a => {
                        const diameter = (a.estimated_diameter.kilometers.estimated_diameter_min +
                          a.estimated_diameter.kilometers.estimated_diameter_max) / 2;
                        return (
                          <tr key={a.id}>
                            <td>{a.name}</td>
                            <td>{a.absolute_magnitude_h}</td>
                            <td>{diameter.toFixed(2)}</td>
                            <td>{a.orbital_data?.inclination || "-"}</td>
                            <td>{a.orbital_data?.eccentricity || "-"}</td>
                            <td>{a.orbital_data?.perihelion_distance || "-"}</td>
                            <td>{a.is_potentially_hazardous_asteroid ? "Yes" : "No"}</td>
                            <td><a href={a.link}>link</a></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TODOS OS GRÁFICOS (SEM ALTERAÇÃO) */}
          <div className="row g-4">  
            <div className="col-12 col-lg-6">
              <div className={cardClass + " h-100"}>
                <div className="card-header">Perihelion vs Eccentricity</div>
                <div className="card-body" style={{ minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid stroke={darkMode ? "#555" : "#ccc"} />
                      <XAxis type="number" dataKey="q" name="Perihelion (AU)" stroke={darkMode ? "#fff" : "#000"} />
                      <YAxis type="number" dataKey="e" name="Eccentricity" stroke={darkMode ? "#fff" : "#000"} />
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                      <Legend wrapperStyle={{ color: darkMode ? "#fff" : "#000" }} />
                      <Scatter
                        name="Asteroids"
                        data={filteredAsteroids.map(a => ({
                          q: Number(a.orbital_data?.perihelion_distance || 0),
                          e: Number(a.orbital_data?.eccentricity || 0)
                        }))}
                        fill={darkMode ? "#82ca9d" : "#8884d8"}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          
            <div className="col-12 col-lg-6">
              <div className={cardClass + " h-100"}>
                <div className="card-header">Diameter (km)</div>
                <div className="card-body" style={{ minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredAsteroids.map(a => ({
                      name: a.name,
                      diameter: (a.estimated_diameter.kilometers.estimated_diameter_min + a.estimated_diameter.kilometers.estimated_diameter_max) / 2
                    }))}>
                      <CartesianGrid stroke={darkMode ? "#555" : "#ccc"} strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                      <YAxis stroke={darkMode ? "#fff" : "#000"} />
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                      <Legend wrapperStyle={{ color: darkMode ? "#fff" : "#000" }} />
                      <Bar dataKey="diameter" fill={darkMode ? "#82ca9d" : "#8884d8"} name="Diameter (km)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className={cardClass + " h-100"}>
                <div className="card-header">Orbital Radar (e, i, q)</div>
                <div className="card-body" style={{ minHeight: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%" cy="50%" outerRadius="80%"
                      data={filteredAsteroids.map(a => ({
                        name: a.name,
                        e: Number(a.orbital_data?.eccentricity || 0),
                        i: Number(a.orbital_data?.inclination || 0) / 180,
                        q: Number(a.orbital_data?.perihelion_distance || 0)
                      }))}
                    >
                      <PolarGrid stroke={darkMode ? "#555" : "#ccc"} />
                      <PolarAngleAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                      <PolarRadiusAxis stroke={darkMode ? "#fff" : "#000"} />
                      <Radar name="Eccentricity" dataKey="e" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Radar name="Inclination/180" dataKey="i" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                      <Radar name="Perihelion (AU)" dataKey="q" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                      <Legend wrapperStyle={{ color: darkMode ? "#fff" : "#000" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
        
            <div className="col-12 col-lg-6">
              <div className={cardClass + " h-100"}>
                <div className="card-header">Hazardous vs Safe</div>
                <div className="card-body" style={{ minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={hazardData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {hazardData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                      <Legend wrapperStyle={{ color: darkMode ? "#fff" : "#000" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
           
            <div className="col-12 col-lg-6">
              <div className={cardClass + " h-100"}>
                <div className="card-header">Diameter Distribution</div>
                <div className="card-body" style={{ minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diameterHistogram}>
                      <CartesianGrid stroke={darkMode ? "#555" : "#ccc"} strokeDasharray="3 3" />
                      <XAxis dataKey="range" stroke={darkMode ? "#fff" : "#000"} />
                      <YAxis stroke={darkMode ? "#fff" : "#000"} />
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                      <Bar dataKey="count" fill={darkMode ? "#82ca9d" : "#8884d8"} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className={cardClass + " h-100"}>
                <div className="card-header">Velocity vs Miss Distance</div>
                <div className="card-body" style={{ minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid stroke={darkMode ? "#555" : "#ccc"} />
                      <XAxis type="number" dataKey="distance" name="Miss Distance (km)" stroke={darkMode ? "#fff" : "#000"} />
                      <YAxis type="number" dataKey="velocity" name="Velocity (km/s)" stroke={darkMode ? "#fff" : "#000"} />
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                      <Scatter name="Asteroids" data={approachData} fill={darkMode ? "#82ca9d" : "#8884d8"} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
         
            <div className="col-12">
              <div className={cardClass + " h-100"}>
                <div className="card-header">Approaches per Decade</div>
                <div className="card-body" style={{ minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timelineData}>
                      <CartesianGrid stroke={darkMode ? "#555" : "#ccc"} strokeDasharray="3 3" />
                      <XAxis dataKey="decade" stroke={darkMode ? "#fff" : "#000"} />
                      <YAxis stroke={darkMode ? "#fff" : "#000"} />
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                      <Bar dataKey="count" fill={darkMode ? "#82ca9d" : "#8884d8"} name="Approaches" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
