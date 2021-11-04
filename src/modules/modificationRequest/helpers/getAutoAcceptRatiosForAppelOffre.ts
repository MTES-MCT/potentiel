export function getAutoAcceptRatiosForAppelOffre(appelOffre: string): { min: number; max: number } {
  switch (appelOffre) {
    case 'CRE4 - Autoconsommation métropole 2016':
    case 'CRE4 - Autoconsommation métropole':
    case 'CRE4 - Autoconsommation ZNI':
    case 'CRE4 - Autoconsommation ZNI 2017':
      return { min: 0.8, max: 1 }
    case 'CRE4 - Bâtiment':
    case 'CRE4 - Sol':
    case 'Fessenheim':
    case 'CRE4 - ZNI 2017':
    case 'CRE4 - ZNI':
    case 'CRE4 - Eolien':
      return { min: 0.9, max: 1.1 }
    case 'CRE4 - Innovation':
      return { min: 0.7, max: 1 }
    default:
      return { min: 0.9, max: 1.1 }
  }
}
