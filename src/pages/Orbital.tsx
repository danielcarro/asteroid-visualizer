"use client";

import { useEffect, useRef, useState, type CSSProperties, type JSX } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface CloseApproachData {
  close_approach_date: string;
  miss_distance: { kilometers: string };
  relative_velocity: { kilometers_per_hour: string };
}

interface OrbitalData {
  eccentricity: number;
  semi_major_axis: number; // AU
  inclination: number; // graus
  orbital_period: number; // dias
}

interface CelestialBody {
  name: string;
  color: string;
  radius: number;
  semi_major_axis?: number; // AU
  eccentricity?: number;
  orbital_period?: number; // dias
  angle?: number; // para animação
  tooltip?: string;
}

interface Asteroid {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
  angle: number; // para animação
}

interface OrbitalSimulatorProps {
  darkMode: boolean;
}

export default function OrbitalSimulator({ darkMode }: OrbitalSimulatorProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [AU, setAU] = useState<number>(100); // escala dinâmica

  const width = 800;
  const height = 800;
  const centerX = width / 2;
  const centerY = height / 2;

  const planets: CelestialBody[] = [
    { name: "Mercury", color: "#aaa", radius: 4, semi_major_axis: 0.39, eccentricity: 0.205, orbital_period: 88, angle: Math.random() * Math.PI * 2 },
    { name: "Venus", color: "#f5e1a4", radius: 6, semi_major_axis: 0.72, eccentricity: 0.007, orbital_period: 225, angle: Math.random() * Math.PI * 2 },
    { name: "Earth", color: "#0b79d0", radius: 8, semi_major_axis: 1, eccentricity: 0.017, orbital_period: 365, angle: Math.random() * Math.PI * 2, tooltip: "Earth - Home planet" },
    { name: "Mars", color: "#d14f32", radius: 6, semi_major_axis: 1.52, eccentricity: 0.094, orbital_period: 687, angle: Math.random() * Math.PI * 2 },
  ];

  // Fetch asteroids
  useEffect(() => {
    const fetchAsteroids = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/neo/browse?&api_key=25WnxHvwNcN9cDTBNiiqXn2YliM7wW2gkDmGuPXC`
        );
        const data = await res.json();

        const asts: Asteroid[] = data.near_earth_objects.map((a: any) => ({
          id: a.id,
          name: a.name,
          estimated_diameter: a.estimated_diameter,
          is_potentially_hazardous_asteroid: a.is_potentially_hazardous_asteroid,
          close_approach_data: a.close_approach_data,
          orbital_data: {
            eccentricity: Math.random() * 0.5,
            semi_major_axis: Math.random() * 2 + 0.5,
            inclination: Math.random() * 30,
            orbital_period: Math.random() * 1000 + 200,
          },
          angle: Math.random() * Math.PI * 2,
        }));

        setAsteroids(asts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsteroids();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawSun = () => {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = darkMode ? "white" : "black";
      ctx.font = "12px Arial";
      ctx.fillText("Sun", centerX + 15, centerY + 5);
    };

    const drawOrbit = (semiMajorAxis: number, eccentricity: number, color = "#555") => {
      const b = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);
      ctx.strokeStyle = darkMode ? "#888" : color;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, semiMajorAxis * AU, b * AU, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawBody = (body: CelestialBody) => {
      if (!body.angle || !body.semi_major_axis) return;
      const x = centerX + body.semi_major_axis * AU * Math.cos(body.angle);
      const y = centerY + body.semi_major_axis * AU * Math.sqrt(1 - (body.eccentricity ?? 0) ** 2) * Math.sin(body.angle);

      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(x, y, body.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = darkMode ? "white" : "black";
      ctx.font = "12px Arial";
      ctx.fillText(body.name, x + 10, y + 5);

      body.angle! += (2 * Math.PI) / ((body.orbital_period ?? 365) * 60);
    };

    const drawAsteroid = (a: Asteroid) => {
      const { semi_major_axis, eccentricity } = a.orbital_data;
      const x = centerX + semi_major_axis * AU * Math.cos(a.angle);
      const y = centerY + semi_major_axis * AU * Math.sqrt(1 - eccentricity ** 2) * Math.sin(a.angle);

      ctx.fillStyle = a.is_potentially_hazardous_asteroid ? "red" : "cyan";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = darkMode ? "white" : "black";
      ctx.font = "10px Arial";
      ctx.fillText(a.name, x + 8, y + 3);

      a.angle += (2 * Math.PI) / (a.orbital_data.orbital_period * 60);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = darkMode ? "#000" : "#fff";
      ctx.fillRect(0, 0, width, height);
      drawSun();
      planets.forEach((p) => {
        drawOrbit(p.semi_major_axis ?? 0, p.eccentricity ?? 0);
        drawBody(p);
      });
      asteroids.forEach(drawAsteroid);
      requestAnimationFrame(animate);
    };
    animate();
  }, [asteroids, AU, darkMode]);

  const [tooltipText, setTooltipText] = useState<string>("");
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>({ display: "none" });

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let found = false;

    [...asteroids, ...planets].forEach((body: any) => {
      let x = centerX;
      let y = centerY;
      if ("semi_major_axis" in body && body.angle !== undefined) {
        x = centerX + (body.semi_major_axis ?? 0) * AU * Math.cos(body.angle);
        y = centerY + (body.semi_major_axis ?? 0) * AU * Math.sqrt(1 - (body.eccentricity ?? 0) ** 2) * Math.sin(body.angle);
      }
      const r = "radius" in body ? body.radius : 5;
      if ((mouseX - x) ** 2 + (mouseY - y) ** 2 < r * r * 4) {
        setTooltipText(`${body.name}${body.tooltip ? `: ${body.tooltip}` : ""}`);
        setTooltipStyle({
          display: "block",
          left: e.clientX + 15,
          top: e.clientY + 15,
          position: "fixed",
          zIndex: 9999,
          backgroundColor: darkMode ? "#222" : "#fff",
          color: darkMode ? "#fff" : "#000",
          padding: "5px 10px",
          borderRadius: 5,
          border: darkMode ? "1px solid #555" : "1px solid #ccc",
        });
        found = true;
      }
    });
    if (!found) setTooltipStyle({ display: "none" });
  };

  // Função para controlar o zoom
  const handleZoom = (factor: number) => {
    setAU((prev) => Math.max(20, Math.min(prev * factor, 500))); // limita zoom
  };

  return (
    <div className={`position-relative d-flex flex-column align-items-center justify-content-center min-vh-100 ${darkMode ? "bg-black" : "bg-light"}`}>
      <h2 className={darkMode ? "text-white mb-3" : "text-dark mb-3"}>Orbital Simulator</h2>
      {loading && <p className={darkMode ? "text-white" : "text-dark"}>Loading asteroids...</p>}
      
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => handleZoom(1.2)}>Zoom In</button>
        <button className="btn btn-secondary" onClick={() => handleZoom(0.8)}>Zoom Out</button>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ background: darkMode ? "black" : "white" }}
        onMouseMove={handleMouseMove}
      />

      <div className="tooltip bs-tooltip-top show" style={tooltipStyle}>
        {tooltipText}
      </div>
    </div>
  );
}
