const accountStructure1 = {
  "1": {
    name: "Zásoby",
    groups: {
      "11": {
        name: "Materiál",
        accounts: {
          "111": { name: "Obstaranie materiálu", type: "Aktíva", kind: "Súvahový" },
          "112": { name: "Materiál na sklade", type: "Aktíva", kind: "Súvahový" },
          "119": { name: "Materiál na ceste", type: "Aktíva", kind: "Súvahový" }
        }
      },
      "12": {
        name: "Zásoby vlastnej výroby",
        accounts: {
          "121": { name: "Nedokončená výroba", type: "Aktíva", kind: "Súvahový" },
          "122": { name: "Polotovary vlastnej výroby", type: "Aktíva", kind: "Súvahový" },
          "123": { name: "Výrobky", type: "Aktíva", kind: "Súvahový" },
          "124": { name: "Zvieratá", type: "Aktíva", kind: "Súvahový" }
        }
      },
      "13": {
        name: "Tovar",
        accounts: {
          "131": { name: "Obstaranie tovaru", type: "Aktíva", kind: "Súvahový" },
          "132": { name: "Tovar na sklade a v predajniach", type: "Aktíva", kind: "Súvahový" },
          "133": { name: "Nehnuteľnosť na predaj", type: "Aktíva", kind: "Súvahový" },
          "139": { name: "Tovar na ceste", type: "Aktíva", kind: "Súvahový" }
        }
      },
      "19": {
        name: "Opravné položky k zásobám",
        accounts: {
          "191": { name: "Opravné položky k materiálu", type: "Pasíva", kind: "Súvahový" },
          "192": { name: "Opravné položky k nedokončenej výrobe", type: "Pasíva", kind: "Súvahový" },
          "193": { name: "Opravné položky k polotovarom vlastnej výroby", type: "Pasíva", kind: "Súvahový" },
          "194": { name: "Opravné položky k výrobkom", type: "Pasíva", kind: "Súvahový" },
          "195": { name: "Opravné položky k zvieratám", type: "Pasíva", kind: "Súvahový" },
          "196": { name: "Opravné položky k tovaru", type: "Pasíva", kind: "Súvahový" }
        }
      }
    }
  }
};

export default accountStructure1;
