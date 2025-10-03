"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle as LeafletCircle,
  Popup,
  useMapEvents,
} from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";

// Função de cálculo de impacto
function computeImpact(D: number, rhoP: number, v: number, thetaDeg: number) {
  const g = 9.81;
  const rhoT = 2500;
  const mass = (Math.PI / 6) * rhoP * Math.pow(D, 3);
  const energyJ = 0.5 * mass * Math.pow(v, 2);
  const energyMt = energyJ / 4.184e15;
  const theta = (thetaDeg * Math.PI) / 180;
  const craterDiameterKm =
    1.161 *
    Math.pow(rhoP / rhoT, 1 / 3) *
    Math.pow(D, 0.78) *
    Math.pow(v, 0.44) *
    Math.pow(g, -0.22) *
    Math.pow(Math.sin(theta), 1 / 3) *
    1e-3;

  const Wkg = energyJ / 4.184e3;
  const cbrtW = Math.cbrt(Wkg);
  const k = { p1psi: 160, p3psi: 90, p5psi: 70, p20psi: 32 };

  return {
    mass,
    energyJ,
    energyMt,
    craterDiameterKm,
    radiiOverpressure: {
      p1psi: k.p1psi * cbrtW,
      p3psi: k.p3psi * cbrtW,
      p5psi: k.p5psi * cbrtW,
      p20psi: k.p20psi * cbrtW,
    },
  };
}

// Captura clique no mapa
function LocationMarker({ setImpactPoint }: { setImpactPoint: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      setImpactPoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

interface Asteroid {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: { kilometers: { estimated_diameter_min: number; estimated_diameter_max: number } };
  is_potentially_hazardous_asteroid: boolean;
}

interface AsteroidSimulatorProps {
  darkMode: boolean;
}

export default function AsteroidSimulator({ darkMode }: AsteroidSimulatorProps) {
  const [impactPoint, setImpactPoint] = useState<[number, number] | null>(null);
  const [diameter, setDiameter] = useState(50);
  const [velocity, setVelocity] = useState(20000);
  const [angle, setAngle] = useState(45);
  const density = 3000;

  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);

  const [minSize, setMinSize] = useState(0);
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);

  useEffect(() => {
    async function fetchAsteroids() {
      try {
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=25WnxHvwNcN9cDTBNiiqXn2YliM7wW2gkDmGuPXC`
        );
        const data = await res.json();
        setAsteroids(data.near_earth_objects);
      } catch (err) {
        console.error("Erro ao buscar asteroides:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAsteroids();
  }, []);

  const impact = computeImpact(diameter, density, velocity, angle);
  const pos = impactPoint as [number, number];

  const filteredAsteroids = asteroids.filter(a => {
    const avgDiameter = (a.estimated_diameter.kilometers.estimated_diameter_min + a.estimated_diameter.kilometers.estimated_diameter_max) / 2;
    if (showHazardousOnly && !a.is_potentially_hazardous_asteroid) return false;
    if (avgDiameter < minSize) return false;
    return true;
  });

  const tileUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution = darkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  // Estimativa de destruição (simulada)
  const destructionData = selectedAsteroid
    ? {
        deaths: Math.floor(Math.random() * 1_000_000),
        damage: Math.floor(Math.random() * 10_000_000_000),
      }
    : null;

  return (
    <div className={darkMode ? "container-fluid bg-dark text-light" : "container-fluid bg-light text-dark"}>
      <div className="row flex-column-reverse flex-lg-row">
        {/* Controles e lista */}
        <div className="col-12 col-lg-4 mb-3">
          <h4>Asteroid Parameters</h4>

          <label>Diameter (m): {diameter}</label>
          <input type="range" min={10} max={1000} step={10} className="form-range" value={diameter} onChange={e => setDiameter(Number(e.target.value))} />

          <label>Velocity (m/s): {velocity}</label>
          <input type="range" min={11000} max={30000} step={1000} className="form-range" value={velocity} onChange={e => setVelocity(Number(e.target.value))} />

          <label>Angle (°): {angle}</label>
          <input type="range" min={10} max={90} step={1} className="form-range" value={angle} onChange={e => setAngle(Number(e.target.value))} />

          <div className={darkMode ? "mt-3 p-2 border bg-secondary text-light rounded" : "mt-3 p-2 border bg-light rounded"}>
            <p>Energy: {impact.energyMt.toFixed(2)} Mt TNT</p>
            <p>Crater: {impact.craterDiameterKm.toFixed(2)} km</p>
            <p>Radius 1 psi: {(impact.radiiOverpressure.p1psi / 1000).toFixed(1)} km</p>
            <p>Radius 3 psi: {(impact.radiiOverpressure.p3psi / 1000).toFixed(1)} km</p>
            <p>Radius 5 psi: {(impact.radiiOverpressure.p5psi / 1000).toFixed(1)} km</p>
            <p>Radius 20 psi: {(impact.radiiOverpressure.p20psi / 1000).toFixed(1)} km</p>
          </div>

          <hr />

          <label>Min Asteroid Size (km): {minSize}</label>
          <input type="range" min={0} max={10} step={0.5} className="form-range" value={minSize} onChange={e => setMinSize(Number(e.target.value))} />

          <div className="form-check mt-2">
            <input className="form-check-input" type="checkbox" checked={showHazardousOnly} onChange={e => setShowHazardousOnly(e.target.checked)} id="hazardCheck" />
            <label className="form-check-label" htmlFor="hazardCheck">
              Show hazardous only
            </label>
          </div>

          <div className="mt-3">
            <h5>Nearby Asteroids</h5>
            {loading ? (
              <p>Loading...</p>
            ) : filteredAsteroids.length === 0 ? (
              <p>No asteroids matching filter</p>
            ) : (
              <ul className="list-group list-group-flush small">
                {filteredAsteroids.slice(0, 10).map(a => {
                  const diam = (a.estimated_diameter.kilometers.estimated_diameter_min + a.estimated_diameter.kilometers.estimated_diameter_max) / 2;
                  return (
                    <li
                      key={a.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      onClick={() => setSelectedAsteroid(a)}
                      style={{ cursor: "pointer" }}
                    >
                      {a.name} {a.is_potentially_hazardous_asteroid && <span className="badge bg-danger ms-2">!</span>}
                      <span className="badge bg-primary rounded-pill">{diam.toFixed(2)} km</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {selectedAsteroid && destructionData && (
            <div className="mt-3 p-2 border rounded bg-warning text-dark">
              <h6>Estimated Impact Effects for {selectedAsteroid.name}</h6>
              <p>Deaths: {destructionData.deaths.toLocaleString()}</p>
              <p>Damage: ${destructionData.damage.toLocaleString()}</p>
            </div>
          )}

          {/* Gráfico */}
          <div className="mt-3" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredAsteroids.slice(0, 10).map(a => {
                  const diam = (a.estimated_diameter.kilometers.estimated_diameter_min + a.estimated_diameter.kilometers.estimated_diameter_max) / 2;
                  const impactEnergy = computeImpact(diam * 1000, density, velocity, angle).energyMt;
                  return { name: a.name, energy: impactEnergy.toFixed(2) };
                })}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="energy" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mapa */}
        <div className="col-12 col-lg-8 mb-3" style={{ height: "80vh", minHeight: "400px" }}>
          <MapContainer center={impactPoint || [0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
            <TileLayer url={tileUrl} attribution={attribution} />
            <LocationMarker setImpactPoint={setImpactPoint} />
            {impactPoint && (
              <>
                <Marker position={pos}>
                  <Popup>Impact Location</Popup>
                </Marker>
                <LeafletCircle
                  center={pos}
                  radius={impact.craterDiameterKm * 500}
                  pathOptions={{ color: darkMode ? "#fff" : "black", fillOpacity: 0.2 }}
                />
                <LeafletCircle center={pos} radius={impact.radiiOverpressure.p1psi} pathOptions={{ color: "blue", fillOpacity: 0.1 }} />
                <LeafletCircle center={pos} radius={impact.radiiOverpressure.p3psi} pathOptions={{ color: "green", fillOpacity: 0.15 }} />
                <LeafletCircle center={pos} radius={impact.radiiOverpressure.p5psi} pathOptions={{ color: "orange", fillOpacity: 0.2 }} />
                <LeafletCircle center={pos} radius={impact.radiiOverpressure.p20psi} pathOptions={{ color: "red", fillOpacity: 0.25 }} />
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
