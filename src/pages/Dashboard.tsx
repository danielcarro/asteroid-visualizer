import { useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from "recharts";
import { COMETS } from "../data/comets";

interface DashboardProps {
  darkMode: boolean;
}

export default function Dashboard({ darkMode }: DashboardProps) {
  const [nameFilter, setNameFilter] = useState("");
  const [diameterFilter, setDiameterFilter] = useState<[number, number]>([0, 50]);
  const [inclinationFilter, setInclinationFilter] = useState<[number, number]>([0, 180]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredComets = COMETS.filter(c =>
    c.object.fullname.toLowerCase().includes(nameFilter.toLowerCase()) &&
    c.phys_par.diameter >= diameterFilter[0] &&
    c.phys_par.diameter <= diameterFilter[1] &&
    c.orbit.i >= inclinationFilter[0] &&
    c.orbit.i <= inclinationFilter[1]
  );

  const totalPages = Math.ceil(filteredComets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredComets.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const cardClass = darkMode ? "card bg-dark text-light shadow-sm" : "card bg-white text-dark shadow-sm";
  const tableClass = darkMode ? "table table-dark table-striped table-hover mb-0" : "table table-striped table-hover mb-0";
  const bgClass = darkMode ? "bg-secondary text-light" : "bg-light text-dark";

  return (
    <div className={`container-fluid p-3 ${bgClass}`}>
      {/* Filters */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">Search Comet</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter comet name"
            value={nameFilter}
            onChange={e => { setNameFilter(e.target.value); setCurrentPage(1); }}
          />
          <small className="text-muted">Filters comets by full name or designation.</small>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">
            Diameter (km): {diameterFilter[0]} - {diameterFilter[1]}
          </label>
          <input
            type="range"
            min={0} max={50} value={diameterFilter[0]}
            onChange={e => { setDiameterFilter([Number(e.target.value), diameterFilter[1]]); setCurrentPage(1); }}
            className="form-range mb-1"
          />
          <input
            type="range"
            min={0} max={50} value={diameterFilter[1]}
            onChange={e => { setDiameterFilter([diameterFilter[0], Number(e.target.value)]); setCurrentPage(1); }}
            className="form-range"
          />
          <small className="text-muted">Adjust the diameter range to view small or large comets.</small>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-bold">
            Orbital Inclination (°): {inclinationFilter[0]} - {inclinationFilter[1]}
          </label>
          <input
            type="range" min={0} max={180} value={inclinationFilter[0]}
            onChange={e => { setInclinationFilter([Number(e.target.value), inclinationFilter[1]]); setCurrentPage(1); }}
            className="form-range mb-1"
          />
          <input
            type="range" min={0} max={180} value={inclinationFilter[1]}
            onChange={e => { setInclinationFilter([inclinationFilter[0], Number(e.target.value)]); setCurrentPage(1); }}
            className="form-range"
          />
          <small className="text-muted">Orbital inclination range relative to the ecliptic plane.</small>
        </div>
      </div>

      {/* Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className={cardClass}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Comet List</span>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={handlePrev} disabled={currentPage === 1}>&lt; Previous</button>
                <button className="btn btn-sm btn-outline-primary" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>Next &gt;</button>
              </div>
            </div>
            <div className="card-body p-0 table-responsive">
              <table className={tableClass}>
                <thead className={darkMode ? "" : "table-light"}>
                  <tr>
                    {["Name", "Designation", "Diameter (km)", "Albedo", "Inclination (°)", "Eccentricity", "Perihelion (AU)", "Perihelion Date"].map(col => (
                      <th key={col} style={{ color: darkMode ? "#fff" : "#000" }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(c => (
                    <tr key={c.object.id}>
                      <td>{c.object.fullname}</td>
                      <td>{c.object.designation}</td>
                      <td>{c.phys_par.diameter}</td>
                      <td>{c.phys_par.albedo}</td>
                      <td>{c.orbit.i}</td>
                      <td>{c.orbit.e}</td>
                      <td>{c.orbit.q}</td>
                      <td>{c.orbit.per}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer text-center">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        {/* Scatter Chart */}
        <div className="col-12 col-lg-6">
          <div className={cardClass + " h-100"}>
            <div className="card-header">Perihelion vs Eccentricity</div>
            <div className="card-body" style={{ minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke={darkMode ? "#555" : "#ccc"} />
                  <XAxis type="number" dataKey="orbit.q" name="Perihelion (AU)" stroke={darkMode ? "#fff" : "#000"} />
                  <YAxis type="number" dataKey="orbit.e" name="Eccentricity" stroke={darkMode ? "#fff" : "#000"} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: darkMode ? "#aaa" : "#ccc" }}
                    contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }}
                  />
                  <Legend wrapperStyle={{ color: darkMode ? "#fff" : "#000" }} />
                  <Scatter name="Comets" data={filteredComets} fill={darkMode ? "#82ca9d" : "#8884d8"} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-12 col-lg-6">
          <div className={cardClass + " h-100"}>
            <div className="card-header">Diameter (km)</div>
            <div className="card-body" style={{ minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredComets}>
                  <CartesianGrid stroke={darkMode ? "#555" : "#ccc"} strokeDasharray="3 3" />
                  <XAxis dataKey="object.fullname" stroke={darkMode ? "#fff" : "#000"} />
                  <YAxis stroke={darkMode ? "#fff" : "#000"} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: darkMode ? "#aaa" : "#ccc" }}
                    contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }}
                  />
                  <Legend wrapperStyle={{ color: darkMode ? "#fff" : "#000" }} />
                  <Bar dataKey="phys_par.diameter" fill={darkMode ? "#82ca9d" : "#8884d8"} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="col-12">
          <div className={cardClass + " h-100"}>
            <div className="card-header">Orbital Radar (e, i, q)</div>
            <div className="card-body" style={{ minHeight: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredComets.map(c => ({
                  name: c.object.fullname,
                  e: c.orbit.e,
                  i: c.orbit.i / 180,
                  q: c.orbit.q
                }))}>
                  <PolarGrid stroke={darkMode ? "#555" : "#ccc"} />
                  <PolarAngleAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                  <PolarRadiusAxis stroke={darkMode ? "#fff" : "#000"} />
                  <Radar name="Eccentricity" dataKey="e" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Radar name="Normalized Inclination" dataKey="i" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  <Radar name="Perihelion (AU)" dataKey="q" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                  <Legend wrapperStyle={{ color: darkMode ? "#fff" : "#000" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
