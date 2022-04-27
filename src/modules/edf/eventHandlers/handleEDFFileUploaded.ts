import { EDFFileUploaded } from '../events'

type ProjectToCompare = {
  id: string
  appelOffreId: string
  periodeId: string
  nomCandidat: string
  nomProjet: string
  adresseProjet: string
  codePostalProjet: string
  communeProjet: string
  numeroCRE: string
  puissance: string
  prixReference: string

  // fetch in details
  siret: string
}

export const handleEDFFIleUploaded =
  (deps: {
    parseCsvFile: (fileId: string) => Promise<any[]>
    getAllProjects: () => Promise<ProjectToCompare>
  }) =>
  async (event: EDFFileUploaded) => {
    const {
      payload: { fileId },
    } = event

    const lines = await deps.parseCsvFile(fileId)

    // Filter by contract
    const linesGoodContract = lines.filter((line) => AO_CODES.has(line['Contrat - Type (code)']))

    for (const line of linesGoodContract) {
      // Try to find a match
    }
  }

const AO_BY_CONTRACT = {
  FV16B: 'CRE4 - Bâtiment',
  FSI17: 'CRE4 - Innovation',
  FV16S: 'CRE4 - Sol',
  'AO3 PV+S': 'CRE4 - ZNI 2017',
  'AO 2019 PV': 'CRE4 - ZNI',
  FA16: 'CRE4 - Autoconsommation métropole 2016',
  FA17: 'CRE4 - Autoconsommation métropole',
  'AO AC1': 'CRE4 - ZNI 2017',
  'AO AC19': 'CRE4 - ZNI',
  FSF19: 'Fessenheim',
  FET: 'Eolien',
}

const AO_CODES = new Set(Object.keys(AO_BY_CONTRACT))
