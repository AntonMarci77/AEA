const accountStructure2 = {
  "2": {
    name: "Finančné účty",
    groups: {
      "21": {
        name: "Peniaze",
        accounts: {
          "211": { name: "Pokladnica", type: "Aktíva", kind: "Súvahový" },
          "213": { name: "Ceniny", type: "Aktíva", kind: "Súvahový" }
        }
      },
      "22": {
        name: "Účty v bankách",
        accounts: {
          "221": { name: "Bankové účty", type: "Aktíva", kind: "Súvahový" }
        }
      },
      "23": {
        name: "Bežné bankové úvery",
        accounts: {
          "231": { name: "Krátkodobé bankové úvery", type: "Pasíva", kind: "Súvahový" },
          "232": { name: "Eskontné úvery", type: "Pasíva", kind: "Súvahový" }
        }
      },
      "24": {
        name: "Iné krátkodobé finančné výpomoci",
        accounts: {
          "241": { name: "Vydané krátkodobé dlhopisy", type: "Pasíva", kind: "Súvahový" },
          "249": { name: "Ostatné krátkodobé finančné výpomoci", type: "Pasíva", kind: "Súvahový" }
        }
      },
      "25": {
        name: "Krátkodobý finančný majetok",
        accounts: {
          "251": { name: "Majetkové cenné papiere na obchodovanie", type: "Aktíva", kind: "Súvahový" },
          "252": { name: "Vlastné akcie a vlastné obchodné podiely", type: "Aktíva", kind: "Súvahový" },
          "253": { name: "Dlhové cenné papiere na obchodovanie", type: "Aktíva", kind: "Súvahový" },
          "255": { name: "Vlastné dlhopisy", type: "Aktíva", kind: "Súvahový" },
          "256": { name: "Dlhové cenné papiere so splatnosťou do jedného roka držané do splatnosti", type: "Aktíva", kind: "Súvahový" },
          "257": { name: "Ostatné realizovateľné cenné papiere", type: "Aktíva", kind: "Súvahový" },
          "259": { name: "Obstaranie krátkodobého finančného majetku", type: "Aktíva", kind: "Súvahový" }
        }
      },
      "26": {
        name: "Prevody medzi finančnými účtami",
        accounts: {
          "261": { name: "Peniaze na ceste", type: "S premenlivým zostatkom", kind: "Súvahový" }
        }
      },
      "29": {
        name: "Opravné položky ku krátkodobému finančnému majetku",
        accounts: {
          "291": { name: "Opravné položky ku krátkodobému finančnému majetku", type: "Pasíva", kind: "Súvahový" }
        }
      }
    }
  }
};

export default accountStructure2;
