// ==========================================
// 选手 E分(执行分) 核心画像数据库 (e_score_data.js)
// ==========================================

const gymnastsData = [
    // Algeria
    { id: "nemour", nameEn: "Kaylia Nemour", country: "ALG", adMean: 0.4, edBase: 8.1, usualD: 5.5, cost: 20,
        tags: ["erratic", "fall"] },
    
    // Australia
    { id: "mcdonald", nameEn: "Kate McDonald", country: "AUS", adMean: 0.4, edBase: 8.4, cost: 10 },
    { id: "pass", nameEn: "Ruby Pass", country: "AUS", adMean: 0.4, edBase: 8.2, cost: 10 },
    
    // Austria
    { id: "moerz", nameEn: "Charize Moerz", country: "AUT", adMean: 0.4, edBase: 8.0, cost: 10 },
    
    // Belgium
    { id: "brassart", nameEn: "Maellyse Brassart", country: "BEL", adMean: 0.2, edBase: 8.0, cost: 10 },
    
    // Brazil
    { id: "saraiva", nameEn: "Flavia Saraiva", country: "BRA", adMean: 0.2, edBase: 8.4, usualD: 5.6, cost: 20, 
        tags: ["erratic"]  },
    { id: "barbosa", nameEn: "Jade Barbosa", country: "BRA", adMean: 0.3, edBase: 8.0, cost: 10 },
    { id: "soares", nameEn: "Julia Soares", country: "BRA", adMean: 0.2, edBase: 8.2, cost: 10  },
    { id: "andrade", nameEn: "Rebeca Andrade", country: "BRA", adMean: 0.2, edBase: 8.3, usualD: 6.1, cost: 40,
        tags: ["stable"]   },
    
    // Canada
    { id: "tran", nameEn: "Aurelie Tran", country: "CAN", adMean: 0.2, edBase: 8.3, cost: 10 },
    { id: "stewart", nameEn: "Ava Stewart", country: "CAN", adMean: 0.4, edBase: 8.1, cost: 10 },
    { id: "lee_c", nameEn: "Cassie Lee", country: "CAN", adMean: 0.5, edBase: 8.3, cost: 10 },
    { id: "black", nameEn: "Elisabeth Black", country: "CAN", adMean: 0.3, edBase: 8.3, cost: 10 },
    
    // China
    { id: "ou", nameEn: "Ou Yushan", country: "CHN", adMean: 0.4, edBase: 8.3, usualD: 5.6, cost: 20,
        tags: ["erratic","fall"]   },
    { id: "qiu", nameEn: "Qiu Qiyuan", country: "CHN", adMean: 0.3, edBase: 8.4, usualD: 5.1, cost: 20,
        tags: ["stable"]   },
    { id: "zhang", nameEn: "Zhang Yihan", country: "CHN", adMean: 0.5, edBase: 8.3, usualD: 5.7, cost: 20,
        tags: ["strict", "erratic"]   },
    { id: "zhou", nameEn: "Zhou Yaqin", country: "CHN", adMean: 0.4, edBase: 8.2, usualD: 5.5, cost: 20,
        tags: ["erratic"]   },
    
    // Colombia
    { id: "blanco", nameEn: "Luisa Blanco", country: "COL", adMean: 0.3, edBase: 8.2, cost: 10 },
    
    // Czechia
    { id: "artonomova", nameEn: "Sona Artonomova", country: "CZE", adMean: 0.4, edBase: 7.9 , cost: 10},
    
    // Egypt
    { id: "mahmoud", nameEn: "Jana Mahmoud", country: "EGY", adMean: 0.4, edBase: 8.0 , cost: 10},
    
    // France
    { id: "mdjds", nameEn: "Melanie de Jesus Dos Santos", country: "FRA", adMean: 0.4, edBase: 8.5, usualD: 5.7, cost: 15,
        tags: ["fall","stable", "erratic"]   },
    { id: "eijken", nameEn: "Ming van Eijken", country: "FRA", adMean: 0.4, edBase: 8.3, usualD: 5.6 , cost: 15},
    { id: "osyssek", nameEn: "Morgane Osyssek-Reimer", country: "FRA", adMean: 0.4, edBase: 8.5 , cost: 15},
    
    // Germany
    { id: "kevric", nameEn: "Helen Kevric", country: "GER", adMean: 0.5, edBase: 8.2, cost: 15 },
    { id: "schaefer", nameEn: "Pauline Schaefer-Betz", country: "GER", adMean: 0.2, edBase: 7.9 , cost: 10},
    { id: "voss", nameEn: "Sarah Voss", country: "GER", adMean: 0.4, edBase: 8.1 , cost: 10},
    
    // Great Britain
    { id: "martin", nameEn: "Abigail Martin", country: "GBR", adMean: 0.5, edBase: 8.1, cost: 10 },
    { id: "fenton", nameEn: "Georgia-Mae Fenton", country: "GBR", adMean: 0.3, edBase: 8.2 , cost: 10},
    { id: "evans", nameEn: "Ruby Evans", country: "GBR", adMean: 0.4, edBase: 8.2 , usualD: 5.7 , cost: 20},
    
    // Haiti
    { id: "brown", nameEn: "Lynzee Brown", country: "HAI", adMean: 0.6, edBase: 8.0, cost: 10 },
    
    // Hungary
    { id: "czifra", nameEn: "Bettina Czifra", country: "HUN", adMean: 0.5, edBase: 7.7, cost: 10 },
    
    // Italy
    { id: "damato", nameEn: "Alice D'Amato", country: "ITA", adMean: 0.3, edBase: 8.4, cost: 15,
        tags: ["erratic"]   },
    { id: "andreoli", nameEn: "Angela Andreoli", country: "ITA", adMean: 0.4, edBase: 8.2, cost: 10,
        tags: ["strict"]   },
    { id: "esposito", nameEn: "Manila Esposito", country: "ITA", adMean: 0.3, edBase: 8.1, usualD: 5.7, cost: 20,
        tags: ["stable"]   },
    
    // Japan
    { id: "nakamura", nameEn: "Haruka Nakamura", country: "JPN", adMean: 0.4, edBase: 8.3, usualD: 5.6, cost: 20,
        tags: ["erratic"]   },
    { id: "okumura", nameEn: "Mana Okumura", country: "JPN", adMean: 0.3, edBase: 8.3 ,usualD: 5.5, cost: 10 },
    { id: "kishi", nameEn: "Rina Kishi", country: "JPN", adMean: 0.3, edBase: 8.1 , usualD: 5.8, cost: 20,
        tags: ["strict"]   },
    { id: "ushioku", nameEn: "Kohane Ushioku", country: "JPN", adMean: 0.4, edBase: 8.5, cost: 10 },
    
    // South Korea
    { id: "eom", nameEn: "Dohyun Eom", country: "KOR", adMean: 0.5, edBase: 7.8, cost: 10  },
    { id: "shin", nameEn: "Shin Solyi", country: "KOR", adMean: 0.4, edBase: 7.8, cost: 10  },
    { id: "lee_y", nameEn: "Yunseo Lee", country: "KOR", adMean: 0.4, edBase: 7.8, cost: 10  },
    
    // Mexico
    { id: "sandoval", nameEn: "Antziri Sandoval", country: "MEX", adMean: 0.5, edBase: 7.1, cost: 10  },
    
    // Netherlands
    { id: "wevers", nameEn: "Lieke Wevers", country: "NED", adMean: 0.3, edBase: 8.5, cost: 10  },
    { id: "visser", nameEn: "Naomi Visser", country: "NED", adMean: 0.3, edBase: 8.2, usualD: 5.6, cost: 15, 
        tags: ["erratic"]   },
    { id: "volleman", nameEn: "Tisha Volleman", country: "NED", adMean: 0.3, edBase: 7.9, cost: 10  },
    
    // New Zealand
    { id: "rose", nameEn: "Georgia-Rose Brown", country: "NZL", adMean: 0.2, edBase: 8.1, cost: 10  },
    
    // Panama
    { id: "heron", nameEn: "Hillary Heron", country: "PAN", adMean: 0.5, edBase: 8.4, cost: 10  },
    
    // Philippines
    { id: "finnegan", nameEn: "Aleah Finnegan", country: "PHI", adMean: 0.3, edBase: 8.3, cost: 10  },
    { id: "malabuyo", nameEn: "Emma Malabuyo", country: "PHI", adMean: 0.3, edBase: 8.1, cost: 10  },
    { id: "ruivivar", nameEn: "Levi Ruivivar", country: "PHI", adMean: 0.4, edBase: 8.3, cost: 10  },
    
    // Portugal
    { id: "martins", nameEn: "Filipa Martins", country: "POR", adMean: 0.5, edBase: 8.3, cost: 10  },
    
    // North Korea
    { id: "an", nameEn: "An Chang Ok", country: "PRK", adMean: 0.6, edBase: 7.9, usualD: 5.5, cost: 10, 
        tags: ["strict", "erratic"]   },
    
    // Romania
    { id: "ghigoarta", nameEn: "Amalia Ghigoarta", country: "ROU", adMean: 0.3, edBase: 8.4, cost: 10  },
    { id: "barbosu", nameEn: "Ana Barbosu", country: "ROU", adMean: 0.3, edBase: 8.5, usualD: 5.6, cost: 20, 
        tags: ["stable", "erratic"]   },
    { id: "cosman", nameEn: "Lilia Cosman", country: "ROU", adMean: 0.4, edBase: 7.7, cost: 10  },
    { id: "voinea", nameEn: "Sabrina Maneca-Voinea", country: "ROU", adMean: 0.4, edBase: 8.2, usualD: 5.9, cost: 20, 
        tags: ["strict", "erratic"]   },
    
    // South Africa
    { id: "rooskrantz", nameEn: "Caitlin Rooskrantz", country: "RSA", adMean: 0.5, edBase: 8.3, cost: 10  },
    
    // Slovenia
    { id: "hirjak", nameEn: "Lucija Hirjak", country: "SLO", adMean: 0.4, edBase: 7.8, cost: 10  },
    
    // Spain
    { id: "petisco", nameEn: "Alba Petisco", country: "ESP", adMean: 0.4, edBase: 8.1, cost: 10  },
    { id: "perez", nameEn: "Ana Perez", country: "ESP", adMean: 0.4, edBase: 8.1, cost: 10  },
    { id: "casabuena", nameEn: "Laura Casabuena", country: "ESP", adMean: 0.2, edBase: 8.1, cost: 10  },
    
    // Switzerland
    { id: "bickel", nameEn: "Lena Bickel", country: "SUI", adMean: 0.3, edBase: 8.2, cost: 10  },
    
    // Ukraine
    { id: "lashchevska", nameEn: "Anna Lashchevska", country: "UKR", adMean: 0.6, edBase: 8.1, cost: 10  },
    
    // United States
    { id: "carey", nameEn: "Jade Carey", country: "USA", adMean: 0.4, edBase: 7.8 , usualD: 6.2, cost: 20, 
        tags: ["strict"]},
    { id: "chiles", nameEn: "Jordan Chiles", country: "USA", adMean: 0.4, edBase: 8.4 , usualD: 5.9, cost: 30,
        tags: ["stable", "erratic"]  },
    { id: "biles", nameEn: "Simone Biles", country: "USA", adMean: 0.5, edBase: 8.7 , usualD: 6.7, cost: 40,
        tags: ["stable"]  },
    { id: "lee", nameEn: "Sunisa Lee", country: "USA", adMean: 0.3, edBase: 8.5, usualD: 5.5, cost: 30,
        tags: ["stable"]   }
];