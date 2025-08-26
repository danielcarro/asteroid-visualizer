export type Comet = {
  object: {
    id: string;
    fullname: string;
    designation: string;
  };
  orbit: {
    e: number;      // excentricidade
    q: number;      // periélio (AU)
    i: number;      // inclinação (graus)
    om: number;     // longitude do nodo ascendente
    w: number;      // argumento do periélio
    ma: number;     // anomalia média
    per: string;    // data do periélio (YYYY-MM-DD)
    epoch: number;  // época (JD, mock aqui)
  };
  phys_par: {
    diameter: number; // km
    albedo: number;   // 0..1
  };
};

// MOCK – valores aproximados para demonstração
export const COMETS: Comet[] = [
  {
    object: { id: "2P", fullname: "2P/Encke", designation: "2P" },
    orbit: { e: 0.8502, q: 0.339, i: 11.8, om: 334.3, w: 186.5, ma: 23.1, per: "2020-11-21", epoch: 2459000.5 },
    phys_par: { diameter: 4.8, albedo: 0.04 }
  },
  {
    object: { id: "1P", fullname: "1P/Halley", designation: "1P" },
    orbit: { e: 0.967, q: 0.586, i: 162.3, om: 58.4, w: 111.3, ma: 0.0, per: "2061-07-28", epoch: 2464000.5 },
    phys_par: { diameter: 11, albedo: 0.04 }
  },
  {
    object: { id: "67P", fullname: "67P/Churyumov–Gerasimenko", designation: "67P" },
    orbit: { e: 0.641, q: 1.243, i: 7.0, om: 50.2, w: 12.8, ma: 0, per: "2015-08-13", epoch: 2457240.5 },
    phys_par: { diameter: 4.3, albedo: 0.06 }
  },
  {
    object: { id: "103P", fullname: "103P/Hartley 2", designation: "103P" },
    orbit: { e: 0.695, q: 1.059, i: 13.6, om: 219.8, w: 181.2, ma: 0, per: "2010-10-28", epoch: 2455497.5 },
    phys_par: { diameter: 2.2, albedo: 0.028 }
  },
  {
    object: { id: "81P", fullname: "81P/Wild 2", designation: "81P" },
    orbit: { e: 0.539, q: 1.592, i: 3.2, om: 136.0, w: 41.0, ma: 0, per: "2003-09-25", epoch: 2452900.5 },
    phys_par: { diameter: 3.5, albedo: 0.06 }
  },
  // Duplicando com pequenas alterações para simular mais páginas
  {
    object: { id: "2P-2", fullname: "2P/Encke II", designation: "2P-II" },
    orbit: { e: 0.852, q: 0.341, i: 12.1, om: 335.0, w: 187.0, ma: 25.0, per: "2021-01-15", epoch: 2459100.5 },
    phys_par: { diameter: 4.9, albedo: 0.045 }
  },
  {
    object: { id: "1P-2", fullname: "1P/Halley II", designation: "1P-II" },
    orbit: { e: 0.968, q: 0.589, i: 163.0, om: 59.0, w: 112.0, ma: 1.0, per: "2062-08-01", epoch: 2464100.5 },
    phys_par: { diameter: 11.2, albedo: 0.042 }
  },
  {
    object: { id: "67P-2", fullname: "67P/Churyumov–Gerasimenko II", designation: "67P-II" },
    orbit: { e: 0.643, q: 1.250, i: 7.5, om: 51.0, w: 13.0, ma: 0.1, per: "2016-08-15", epoch: 2457300.5 },
    phys_par: { diameter: 4.35, albedo: 0.065 }
  },
  {
    object: { id: "103P-2", fullname: "103P/Hartley 2 II", designation: "103P-II" },
    orbit: { e: 0.697, q: 1.062, i: 14.0, om: 220.0, w: 182.0, ma: 0.0, per: "2011-10-30", epoch: 2455550.5 },
    phys_par: { diameter: 2.25, albedo: 0.03 }
  },
  {
    object: { id: "81P-2", fullname: "81P/Wild 2 II", designation: "81P-II" },
    orbit: { e: 0.541, q: 1.600, i: 3.5, om: 137.0, w: 42.0, ma: 0.0, per: "2004-09-28", epoch: 2452950.5 },
    phys_par: { diameter: 3.55, albedo: 0.065 }
  },
  // Mais duplicatas para simular múltiplas páginas
  {
    object: { id: "C/1995 O1-2", fullname: "C/1995 O1 (Hale–Bopp) II", designation: "C/1995 O1-II" },
    orbit: { e: 0.996, q: 0.920, i: 90.0, om: 283.0, w: 131.0, ma: 0, per: "1998-04-05", epoch: 2450600.5 },
    phys_par: { diameter: 41, albedo: 0.085 }
  },
  {
    object: { id: "C/2020 F3-2", fullname: "C/2020 F3 (NEOWISE) II", designation: "C/2020 F3-II" },
    orbit: { e: 0.9995, q: 0.300, i: 129.0, om: 61.5, w: 38.0, ma: 0, per: "2020-07-05", epoch: 2459040.5 },
    phys_par: { diameter: 5.1, albedo: 0.105 }
  },
  {
    object: { id: "109P-2", fullname: "109P/Swift–Tuttle II", designation: "109P-II" },
    orbit: { e: 0.964, q: 0.960, i: 114.0, om: 140.0, w: 153.0, ma: 0, per: "2127-07-12", epoch: 2470100.5 },
    phys_par: { diameter: 26.5, albedo: 0.042 }
  },
  {
    object: { id: "45P-2", fullname: "45P/Honda–Mrkos–Pajdušáková II", designation: "45P-II" },
    orbit: { e: 0.825, q: 0.530, i: 4.5, om: 89.0, w: 327.0, ma: 0, per: "2018-02-12", epoch: 2457810.5 },
    phys_par: { diameter: 1.35, albedo: 0.045 }
  },
  {
    object: { id: "2I-2", fullname: "2I/Borisov II", designation: "2I-II" },
    orbit: { e: 3.36, q: 2.010, i: 44.5, om: 309.0, w: 210.0, ma: 0, per: "2020-01-01", epoch: 2458830.5 },
    phys_par: { diameter: 1.05, albedo: 0.075 }
  }
];

