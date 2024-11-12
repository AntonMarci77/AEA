const accountStructure3 = {
  "3": {
    name: "Zúčtovacie vzťahy",
    groups: {
      "31": {
        name: "Pohľadávky",
        accounts: {
          "311": { name: "Odberatelia", type: "Aktíva", kind: "Súvahový" },
          "312": { name: "Zmenky na inkaso", type: "Aktíva", kind: "Súvahový" },
          "313": { name: "Pohľadávky za eskontované cenné papiere", type: "Aktíva", kind: "Súvahový" },
          "314": { name: "Poskytnuté preddavky", type: "Aktíva", kind: "Súvahový" },
          "315": { name: "Ostatné pohľadávky", type: "Aktíva", kind: "Súvahový" },
          "316": { name: "Čistá hodnota zákazky", type: "S premenlivým zostatkom", kind: "Súvahový" }
        }
      },
      "32": {
        name: "Záväzky",
        accounts: {
          "321": { name: "Dodávatelia", type: "Pasíva", kind: "Súvahový" },
          "322": { name: "Zmenky na úhradu", type: "Pasíva", kind: "Súvahový" },
          "323": { name: "Krátkodobé rezervy", type: "Pasíva", kind: "Súvahový" },
          "324": { name: "Prijaté preddavky", type: "Pasíva", kind: "Súvahový" },
          "325": { name: "Ostatné záväzky", type: "Pasíva", kind: "Súvahový" },
          "326": { name: "Nevyfakturované dodávky", type: "Pasíva", kind: "Súvahový" }
        }
      },
      "33": {
        name: "Zúčtovanie so zamestnancami a orgánmi sociálneho poistenia a zdravotného poistenia",
        accounts: {
          "331": { name: "Zamestnanci", type: "Pasíva", kind: "Súvahový" },
          "333": { name: "Ostatné záväzky voči zamestnancom", type: "Pasíva", kind: "Súvahový" },
          "335": { name: "Pohľadávky voči zamestnancom", type: "Aktíva", kind: "Súvahový" },
          "336": { name: "Zúčtovanie s orgánmi sociálneho poistenia a zdravotného poistenia", type: "S premenlivým zostatkom", kind: "Súvahový" }
        }
      },
      "34": {
        name: "Zúčtovanie daní a dotácií",
        accounts: {
          "341": { name: "Daň z príjmov", type: "S premenlivým zostatkom", kind: "Súvahový" },
          "342": { name: "Ostatné priame dane", type: "S premenlivým zostatkom", kind: "Súvahový" },
          "343": { name: "Daň z pridanej hodnoty", type: "S premenlivým zostatkom", kind: "Súvahový" },
          "345": { name: "Ostatné dane a poplatky", type: "S premenlivým zostatkom", kind: "Súvahový" },
          "346": { name: "Dotácie zo štátneho rozpočtu", type: "S premenlivým zostatkom", kind: "Súvahový" },
          "347": { name: "Ostatné dotácie", type: "S premenlivým zostatkom", kind: "Súvahový" }
        }
      },
      "35": {
        name: "Pohľadávky voči spoločníkom a združeniu",
        accounts: {
          "351": { name: "Pohľadávky voči prepojeným účtovným jednotkám a účtovným jednotkám v rámci podielovej účasti", type: "Aktíva", kind: "Súvahový" },
          "353": { name: "Pohľadávky za upísané vlastné imanie", type: "Aktíva", kind: "Súvahový" },
          "354": { name: "Pohľadávky voči spoločníkom a členom pri úhrade straty", type: "Aktíva", kind: "Súvahový" },
          "355": { name: "Ostatné pohľadávky voči spoločníkom a členom", type: "Aktíva", kind: "Súvahový" },
          "358": { name: "Pohľadávky voči účastníkom združenia", type: "Aktíva", kind: "Súvahový" }
        }
      },
      "36": {
        name: "Záväzky voči spoločníkom a združeniu",
        accounts: {
          "361": { name: "Záväzky voči prepojeným účtovným jednotkám a účtovným jednotkám v rámci podielovej účasti", type: "Pasíva", kind: "Súvahový" },
          "364": { name: "Záväzky voči spoločníkom a členom pri rozdeľovaní zisku", type: "Pasíva", kind: "Súvahový" },
          "365": { name: "Ostatné záväzky voči spoločníkom a členom", type: "Pasíva", kind: "Súvahový" },
          "366": { name: "Záväzky voči spoločníkom a členom zo závislej činnosti", type: "Pasíva", kind: "Súvahový" },
          "367": { name: "Záväzky z upísaných nesplatených cenných papierov a vkladov", type: "Pasíva", kind: "Súvahový" },
          "368": { name: "Záväzky voči účastníkom združenia", type: "Pasíva", kind: "Súvahový" }
        }
      },
      "37": {
        name: "Iné pohľadávky a iné záväzky",
        accounts: {
          "371": { name: "Pohľadávky z predaja podniku", type: "Aktíva", kind: "Súvahový" },
          "372": { name: "Záväzky z kúpy podniku", type: "Pasíva", kind: "Súvahový" },
          "373": { name: "Pohľadávky a záväzky z pevných termínových operácií", type: "S premenlivým zostatkom", kind: "Súvahový" },
          "374": { name: "Pohľadávky z nájmu", type: "Aktíva", kind: "Súvahový" },
          "375": { name: "Pohľadávky z vydaných dlhopisov", type: "Aktíva", kind: "Súvahový" },
          "376": { name: "Nakúpené opcie", type: "Pasíva", kind: "Súvahový" },
          "377": { name: "Predané opcie", type: "Aktíva", kind: "Súvahový" },
          "378": { name: "Iné pohľadávky", type: "Aktíva", kind: "Súvahový" },
          "379": { name: "Iné záväzky", type: "Pasíva", kind: "Súvahový" }
        }
      },
      "38": {
        name: "Časové rozlíšenie nákladov a výnosov",
        accounts: {
          "381": { name: "Náklady budúcich období", type: "Aktíva", kind: "Súvahový" },
          "382": { name: "Komplexné náklady budúcich období", type: "Aktíva", kind: "Súvahový" },
          "383": { name: "Výdavky budúcich období", type: "Pasíva", kind: "Súvahový" },
          "384": { name: "Výnosy budúcich období", type: "Pasíva", kind: "Súvahový" },
          "385": { name: "Príjmy budúcich období", type: "Aktíva", kind: "Súvahový" }
        }
      },
      "39": {
        name: "Opravná položka k zúčtovacím vzťahom a vnútorné zúčtovanie",
        accounts: {
          "391": { name: "Opravné položky k pohľadávkam", type: "Pasíva", kind: "Súvahový" },
          "395": { name: "Vnútorné zúčtovanie", type: "S premenlivým zostatkom", kind: "Súvahový" },
          "398": { name: "Spojovací účet pri združení", type: "S premenlivým zostatkom", kind: "Súvahový" }
        }
      }
    }
  }
};

export default accountStructure3;
