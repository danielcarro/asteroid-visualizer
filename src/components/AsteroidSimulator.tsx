import { useState } from "react";
import { MapContainer, TileLayer, Marker, Circle as LeafletCircle, Popup, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet"; 
import "leaflet/dist/leaflet.css";

// Função de cálculo de impacto
function computeImpact(D: number, rhoP: number, v: number, thetaDeg: number) {
  const g = 9.81;
  const rhoT = 2500;
  const mass = (Math.PI / 6) * rhoP * Math.pow(D, 3);
  const energyJ = 0.5 * mass * Math.pow(v, 2);
  const energyMt = energyJ / 4.184e15;
  const theta = (thetaDeg * Math.PI) / 180;
  const craterDiameterKm =
    1.161 * Math.pow(rhoP / rhoT, 1 / 3) *
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
      p20psi: k.p20psi * cbrtW
    }
  };
}

// Componente para capturar clique no mapa
function LocationMarker({ setImpactPoint }: { setImpactPoint: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      setImpactPoint([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

export default function AsteroidSimulator() {
  const [impactPoint, setImpactPoint] = useState<[number, number] | null>(null);
  const [diameter, setDiameter] = useState(50); // metros
  const [velocity, setVelocity] = useState(20000); // m/s
  const [angle, setAngle] = useState(45); // graus
  const density = 3000; // kg/m3

  const impact = computeImpact(diameter, density, velocity, angle);
  const pos = impactPoint as [number, number];

  return (
    <div className="row">
      {/* Controles */}
      <div className="col-md-3">
        <h4>Asteroid Parameters</h4>

        <label>Diameter (m): {diameter}</label>
        <input
          type="range"
          min={10}
          max={1000}
          step={10}
          className="form-range"
          value={diameter}
          onChange={(e) => setDiameter(Number(e.target.value))}
        />

        <label>Velocity (m/s): {velocity}</label>
        <input
          type="range"
          min={11000}
          max={30000}
          step={1000}
          className="form-range"
          value={velocity}
          onChange={(e) => setVelocity(Number(e.target.value))}
        />

        <label>Angle (°): {angle}</label>
        <input
          type="range"
          min={10}
          max={90}
          step={1}
          className="form-range"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
        />

        <div className="mt-3 p-2 border bg-light">
          <p>Energy: {impact.energyMt.toFixed(2)} Mt TNT</p>
          <p>Crater: {impact.craterDiameterKm.toFixed(2)} km</p>
          <p>Radius 1 psi: {(impact.radiiOverpressure.p1psi / 1000).toFixed(1)} km</p>
          <p>Radius 3 psi: {(impact.radiiOverpressure.p3psi / 1000).toFixed(1)} km</p>
          <p>Radius 5 psi: {(impact.radiiOverpressure.p5psi / 1000).toFixed(1)} km</p>
          <p>Radius 20 psi: {(impact.radiiOverpressure.p20psi / 1000).toFixed(1)} km</p>
        </div>

        <p className="text-muted mt-2">Click on the map to set impact location.</p>
      </div>

      {/* Mapa */}
      <div className="col-md-9" style={{ height: "80vh" }}>
        <MapContainer
          center={impactPoint || [0, 0] as [number, number]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker setImpactPoint={setImpactPoint} />

          {impactPoint && (
            <>
              <Marker position={pos}>
                <Popup>Impact Location</Popup>
              </Marker>

              <LeafletCircle
                center={pos}
                radius={impact.craterDiameterKm * 500} // metros
                pathOptions={{ color: "black", fillOpacity: 0.2 }}
              />
              <LeafletCircle
                center={pos}
                radius={impact.radiiOverpressure.p1psi}
                pathOptions={{ color: "blue", fillOpacity: 0.1 }}
              />
              <LeafletCircle
                center={pos}
                radius={impact.radiiOverpressure.p3psi}
                pathOptions={{ color: "green", fillOpacity: 0.15 }}
              />
              <LeafletCircle
                center={pos}
                radius={impact.radiiOverpressure.p5psi}
                pathOptions={{ color: "orange", fillOpacity: 0.2 }}
              />
              <LeafletCircle
                center={pos}
                radius={impact.radiiOverpressure.p20psi}
                pathOptions={{ color: "red", fillOpacity: 0.25 }}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
