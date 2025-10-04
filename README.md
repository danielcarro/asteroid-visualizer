# Asteroid Visualizer Simulation Tool 🚀


**Asteroid Visualizer Simulation Tool** is an interactive web application developed to simulate asteroid impacts on Earth using real data from NASA (NEO API) and USGS. It allows users to explore impact scenarios, predict consequences, and evaluate mitigation strategies in an educational and visual way.

This project was created for the **NASA Space Apps Challenge 2025**.

---

## 📌 Project Objectives

- Integrate Near-Earth Object (NEO) data from NASA with geological and environmental datasets from USGS.
- Simulate asteroid trajectories using orbital elements.
- Estimate impact energy, crater size, and environmental effects (tsunamis, seismic waves).
- Allow users to test mitigation strategies such as asteroid deflection.
- Provide interactive and intuitive visualizations with graphs, maps, and 3D animations.

---

## 🛠 Technologies Used

- **Frontend**: React + TypeScript, Bootstrap 5
- **3D/2D Visualizations**: Three.js, D3.js
- **APIs**:  
  - NASA NEO API (near-Earth asteroids)  
  - USGS (geological and environmental data)
- **State Management**: React Hooks  
- **Styling**: Bootstrap, custom CSS

---

## ⚡ Features

- **Interactive Simulation**: Adjust asteroid parameters (size, velocity, impact angle) and view the trajectory in real time.
- **Impact Visualization**: Maps showing impact zones, tsunamis, and seismic effects.
- **Mitigation Strategies**: Test kinetic impactor deflection and see how the impact point changes.
- **Analytical Graphs**: Impact energy, crater size, and potential damage.
- **Educational**: Tooltips and infographics explaining concepts like eccentricity, orbital velocity, and kinetic energy.
- **Responsive and Accessible**: Works on desktop, tablet, and mobile; colorblind-friendly palette.

---

## 🚀 How to Run Locally

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x or yarn
- Access to NASA NEO API (free key)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/asteroid-visualizer.git
   cd asteroid-visualizer
