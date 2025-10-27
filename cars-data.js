  const carsData = {
    f1_rb19_2023: {
      name: "F1 Red Bull RB19 (2023)",
      m: 798,
      A: 1.45,
      CL: 4.19,
      v_max_kmh: 354.9,
      image: "https://fr.f1authentics.com/cdn/shop/files/16x9-Hero-RB19.jpg?crop=center&height=1800&v=1754379773&width=3200",
      color: "#1e41ff"
    },
    f1_mercedes_w08_2017: {
      name: "F1 Mercedes W08 (2017)",
      m: 733,
      A: 1.48,
      CL: 3.6,
      v_max_kmh: 350,
      image: "https://images.squarespace-cdn.com/content/v1/52744b67e4b0782c048b666f/1487957771484-GQVXBG3HB4EU4T9451CK/M57710+copy.jpg",
      color: "#00d2be"
    },
    f1_renault_r25_2005: {
      name: "F1 Renault R25 (2005)",
      m: 605,
      A: 1.4,
      CL: 2.9,
      v_max_kmh: 330,
      image: "https://img.carswp.com/renault/formula-1/wallpapers_renault_formula-1_2005_1.jpg",
      color: "#ffd700"
    },
    f1_mclaren_mp44_1988: {
      name: "F1 McLaren MP4/4 (1988)",
      m: 540,
      A: 1.35,
      CL: 2.4,
      v_max_kmh: 330,
      image: "https://images.squarespace-cdn.com/content/v1/5dab12cd9280b45f3dc2e745/1585074068222-81P1AUVRL83DQH6D0B1A/Senna-F1-V1_reflection--web.jpg",
      color: "#ff0000"
    },
    f1_williams_fw11_1986: {
      name: "F1 Williams FW11 (1986)",
      m: 540,
      A: 1.4,
      CL: 2.2,
      v_max_kmh: 330,
      image: "https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1702309434/evo/2023/12/Williams%20Honda%20FW11%20anatomy-3.png",
      color: "#0055ff"
    },
    f1_ferrari_312t_1975: {
      name: "F1 Ferrari 312T (1975, Niki Lauda)",
      m: 590,
      A: 1.5,
      CL: 1.7,
      v_max_kmh: 310,
      image: "https://www.tomhartleyjnr.com/wp-content/uploads/2020/03/7F2A7839.jpg",
      color: "#dc0000"
    },
    hypercar_ferrari_499p_2024: {
      name: "Hypercar Ferrari 499P (2024)",
      m: 1245,
      A: 1.9,
      CL: 3.2,
      v_max_kmh: 330,
      image: "",
      color: "#8b0000"
    },
    hypercar_ford_gt40_1966: {
      name: "Hypercar Ford GT40 (1966)",
      m: 1100,
      A: 1.8,
      CL: 0.9,
      v_max_kmh: 330,
      image: "https://cdn-4.motorsport.com/images/amp/6yDpE3p0/s1000/ford-gt40-le-mans.jpg",
      color: "#003478"
    },
    hypercar_porsche_917k_1970: {
      name: "Hypercar Porsche 917K (1970)",
      m: 800,
      A: 1.7,
      CL: 1.0,
      v_max_kmh: 360,
      image: "https://cdn-3.motorsport.com/images/amp/6YJ0A7b0/s1000/porsche-917k.jpg",
      color: "#d4af37"
    },
    gt3_porsche_911: {
      name: "GT3 Porsche 911 RSR",
      m: 1250,
      A: 1.9,
      CL: 1.8,
      v_max_kmh: 295,
      image: "https://cdn-1.motorsport.com/images/amp/0aYwD7xY/s1000/porsche-911-gt3-r-2023.jpg",
      color: "#228b22"
    },
    gt3_amg: {
      name: "GT3 Mercedes AMG GT3",
      m: 1280,
      A: 1.92,
      CL: 1.6,
      v_max_kmh: 290,
      image: "https://cdn-3.motorsport.com/images/amp/0yK5QWo2/s1000/mercedes-amg-gt3.jpg",
      color: "#4a4a4a"
    },
    bugatti_chiron: {
      name: "Bugatti Chiron",
      m: 1995,
      A: 2.0,
      CL: 0.9,
      v_max_kmh: 420,
      image: "https://cdn.motor1.com/images/mgl/Qp1yE/s1/bugatti-chiron.jpg",
      color: "#0022ff"
    },
    ferrari_458: {
      name: "Ferrari 458 Italia",
      m: 1380,
      A: 1.9,
      CL: 0.7,
      v_max_kmh: 325,
      image: "https://cdn.motor1.com/images/mgl/g3W2q/s1/ferrari-458-italia.jpg",
      color: "#ff1b1b"
    },
    mazda3: {
      name: "Mazda 3 Hatchback",
      m: 1340,
      A: 2.1,
      CL: 0.35,
      v_max_kmh: 220,
      image: "https://cdn.motor1.com/images/mgl/WZPbp/s1/2021-mazda3-turbo.jpg",
      color: "#a00000"
    },
    cybertruck: {
      name: "Tesla Cybertruck",
      m: 2900,
      A: 2.9,
      CL: 0.28,
      v_max_kmh: 210,
      image: "https://cdn.motor1.com/images/mgl/nxvjj/s1/tesla-cybertruck.jpg",
      color: "#a9a9a9"
    },
    twingo: {
      name: "Renault Twingo",
      m: 980,
      A: 2.0,
      CL: 0.30,
      v_max_kmh: 160,
      image: "https://cdn.motor1.com/images/mgl/2xG2e/s1/renault-twingo-electric.jpg",
      color: "#ffeb3b"
    },
    vaca_aerodinamica: {
      name: "Vaca Aerodinámica",
      m: 700,
      A: 2.5,
      CL: 0.05,
      v_max_kmh: 60,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Cow_female_black_white.jpg",
      color: "#ffffff"
    },
    minicooper: {
      name: "Mini Cooper S",
      m: 1210,
      A: 2.0,
      CL: 0.6,
      v_max_kmh: 235,
      image: "https://cdn.motor1.com/images/mgl/lZyWQ/s1/2022-mini-cooper-s.jpg",
      color: "#0077b6"
    },
    carro_inventado : {
      name: "carro inventado",
      m: 500,
      A: 2.0,
      CL: 5.98,
      v_max_kmh: 500,
      color : "#a9a9a9",
      image : "nksfdnsfdsfdk.png"
    }
  };
