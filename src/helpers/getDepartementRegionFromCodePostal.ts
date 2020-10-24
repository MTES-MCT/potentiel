const departementIndex = {
  '01': { departement: 'Ain', region: 'Auvergne-Rhône-Alpes' },
  '02': { departement: 'Aisne', region: 'Hauts-de-France' },
  '03': { departement: 'Allier', region: 'Auvergne-Rhône-Alpes' },
  '04': {
    departement: 'Alpes-de-Haute-Provence',
    region: "Provence-Alpes-Côte d'Azur",
  },
  '05': { departement: 'Hautes-Alpes', region: "Provence-Alpes-Côte d'Azur" },
  '06': {
    departement: 'Alpes-Maritimes',
    region: "Provence-Alpes-Côte d'Azur",
  },
  '07': { departement: 'Ardèche', region: 'Auvergne-Rhône-Alpes' },
  '08': { departement: 'Ardennes', region: 'Grand Est' },
  '09': { departement: 'Ariège', region: 'Occitanie' },
  '10': { departement: 'Aube', region: 'Grand Est' },
  '11': { departement: 'Aude', region: 'Occitanie' },
  '12': { departement: 'Aveyron', region: 'Occitanie' },
  '13': {
    departement: 'Bouches-du-Rhône',
    region: "Provence-Alpes-Côte d'Azur",
  },
  '14': { departement: 'Calvados', region: 'Normandie' },
  '15': { departement: 'Cantal', region: 'Auvergne-Rhône-Alpes' },
  '16': { departement: 'Charente', region: 'Nouvelle-Aquitaine' },
  '17': { departement: 'Charente-Maritime', region: 'Nouvelle-Aquitaine' },
  '18': { departement: 'Cher', region: 'Centre-Val de Loire' },
  '19': { departement: 'Corrèze', region: 'Nouvelle-Aquitaine' },
  '21': { departement: "Côte-d'Or", region: 'Bourgogne-Franche-Comté' },
  '22': { departement: "Côtes-d'Armor", region: 'Bretagne' },
  '23': { departement: 'Creuse', region: 'Nouvelle-Aquitaine' },
  '24': { departement: 'Dordogne', region: 'Nouvelle-Aquitaine' },
  '25': { departement: 'Doubs', region: 'Bourgogne-Franche-Comté' },
  '26': { departement: 'Drôme', region: 'Auvergne-Rhône-Alpes' },
  '27': { departement: 'Eure', region: 'Normandie' },
  '28': { departement: 'Eure-et-Loir', region: 'Centre-Val de Loire' },
  '29': { departement: 'Finistère', region: 'Bretagne' },
  '30': { departement: 'Gard', region: 'Occitanie' },
  '31': { departement: 'Haute-Garonne', region: 'Occitanie' },
  '32': { departement: 'Gers', region: 'Occitanie' },
  '33': { departement: 'Gironde', region: 'Nouvelle-Aquitaine' },
  '34': { departement: 'Hérault', region: 'Occitanie' },
  '35': { departement: 'Ille-et-Vilaine', region: 'Bretagne' },
  '36': { departement: 'Indre', region: 'Centre-Val de Loire' },
  '37': { departement: 'Indre-et-Loire', region: 'Centre-Val de Loire' },
  '38': { departement: 'Isère', region: 'Auvergne-Rhône-Alpes' },
  '39': { departement: 'Jura', region: 'Bourgogne-Franche-Comté' },
  '40': { departement: 'Landes', region: 'Nouvelle-Aquitaine' },
  '41': { departement: 'Loir-et-Cher', region: 'Centre-Val de Loire' },
  '42': { departement: 'Loire', region: 'Auvergne-Rhône-Alpes' },
  '43': { departement: 'Haute-Loire', region: 'Auvergne-Rhône-Alpes' },
  '44': { departement: 'Loire-Atlantique', region: 'Pays de la Loire' },
  '45': { departement: 'Loiret', region: 'Centre-Val de Loire' },
  '46': { departement: 'Lot', region: 'Occitanie' },
  '47': { departement: 'Lot-et-Garonne', region: 'Nouvelle-Aquitaine' },
  '48': { departement: 'Lozère', region: 'Occitanie' },
  '49': { departement: 'Maine-et-Loire', region: 'Pays de la Loire' },
  '50': { departement: 'Manche', region: 'Normandie' },
  '51': { departement: 'Marne', region: 'Grand Est' },
  '52': { departement: 'Haute-Marne', region: 'Grand Est' },
  '53': { departement: 'Mayenne', region: 'Pays de la Loire' },
  '54': { departement: 'Meurthe-et-Moselle', region: 'Grand Est' },
  '55': { departement: 'Meuse', region: 'Grand Est' },
  '56': { departement: 'Morbihan', region: 'Bretagne' },
  '57': { departement: 'Moselle', region: 'Grand Est' },
  '58': { departement: 'Nièvre', region: 'Bourgogne-Franche-Comté' },
  '59': { departement: 'Nord', region: 'Hauts-de-France' },
  '60': { departement: 'Oise', region: 'Hauts-de-France' },
  '61': { departement: 'Orne', region: 'Normandie' },
  '62': { departement: 'Pas-de-Calais', region: 'Hauts-de-France' },
  '63': { departement: 'Puy-de-Dôme', region: 'Auvergne-Rhône-Alpes' },
  '64': { departement: 'Pyrénées-Atlantiques', region: 'Nouvelle-Aquitaine' },
  '65': { departement: 'Hautes-Pyrénées', region: 'Occitanie' },
  '66': { departement: 'Pyrénées-Orientales', region: 'Occitanie' },
  '67': { departement: 'Bas-Rhin', region: 'Grand Est' },
  '68': { departement: 'Haut-Rhin', region: 'Grand Est' },
  '69': { departement: 'Rhône', region: 'Auvergne-Rhône-Alpes' },
  '70': { departement: 'Haute-Saône', region: 'Bourgogne-Franche-Comté' },
  '71': { departement: 'Saône-et-Loire', region: 'Bourgogne-Franche-Comté' },
  '72': { departement: 'Sarthe', region: 'Pays de la Loire' },
  '73': { departement: 'Savoie', region: 'Auvergne-Rhône-Alpes' },
  '74': { departement: 'Haute-Savoie', region: 'Auvergne-Rhône-Alpes' },
  '75': { departement: 'Paris', region: 'Île-de-France' },
  '76': { departement: 'Seine-Maritime', region: 'Normandie' },
  '77': { departement: 'Seine-et-Marne', region: 'Île-de-France' },
  '78': { departement: 'Yvelines', region: 'Île-de-France' },
  '79': { departement: 'Deux-Sèvres', region: 'Nouvelle-Aquitaine' },
  '80': { departement: 'Somme', region: 'Hauts-de-France' },
  '81': { departement: 'Tarn', region: 'Occitanie' },
  '82': { departement: 'Tarn-et-Garonne', region: 'Occitanie' },
  '83': { departement: 'Var', region: "Provence-Alpes-Côte d'Azur" },
  '84': { departement: 'Vaucluse', region: "Provence-Alpes-Côte d'Azur" },
  '85': { departement: 'Vendée', region: 'Pays de la Loire' },
  '86': { departement: 'Vienne', region: 'Nouvelle-Aquitaine' },
  '87': { departement: 'Haute-Vienne', region: 'Nouvelle-Aquitaine' },
  '88': { departement: 'Vosges', region: 'Grand Est' },
  '89': { departement: 'Yonne', region: 'Bourgogne-Franche-Comté' },
  '90': {
    departement: 'Territoire de Belfort',
    region: 'Bourgogne-Franche-Comté',
  },
  '91': { departement: 'Essonne', region: 'Île-de-France' },
  '92': { departement: 'Hauts-de-Seine', region: 'Île-de-France' },
  '93': { departement: 'Seine-Saint-Denis', region: 'Île-de-France' },
  '94': { departement: 'Val-de-Marne', region: 'Île-de-France' },
  '95': { departement: "Val-d'Oise", region: 'Île-de-France' },
}

const departementsOutreMer = {
  '971': { departement: 'Guadeloupe', region: 'Guadeloupe' },
  '972': { departement: 'Martinique', region: 'Martinique' },
  '973': { departement: 'Guyane', region: 'Guyane' },
  '974': { departement: 'La Réunion', region: 'La Réunion' },
  '976': { departement: 'Mayotte', region: 'Mayotte' },
}

const corse = {
  '2A': { departement: 'Corse-du-Sud', region: 'Corse' },
  '2B': { departement: 'Haute-Corse', region: 'Corse' },
}

type DepartementRegion = {
  codePostal: string
  departement: string
  region: string
}

const getDepartementRegionFromCodePostal = (codePostal?: string): DepartementRegion | undefined => {
  // Add the 0 prefix if it's missing

  if (typeof codePostal !== 'string' || codePostal.length < 4) return

  if (codePostal.length === 4) {
    codePostal = '0' + codePostal
  }

  if (codePostal.startsWith('97')) {
    // Outre-mer
    const prefix = codePostal.substr(0, 3)
    return { ...departementsOutreMer[prefix], codePostal }
  }

  if (codePostal.startsWith('20')) {
    // Corse

    if (codePostal === '20000') {
      // Ajaccio
      return { ...corse['2A'], codePostal }
    }

    if (['20600', '20620'].includes(codePostal)) {
      // Furiani, Biguglia => Haute-Corse
      return { ...corse['2B'], codePostal }
    }

    if (codePostal.startsWith('201')) {
      // Corse du sud
      return { ...corse['2A'], codePostal }
    }

    return { ...corse['2B'], codePostal }
  }

  // general case
  const prefix = codePostal.substring(0, 2)
  return { ...departementIndex[prefix], codePostal }
}

export default getDepartementRegionFromCodePostal
