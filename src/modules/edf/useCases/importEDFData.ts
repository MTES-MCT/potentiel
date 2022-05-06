import { EventBus } from '@core/domain'
import {
  EDFContractAutomaticallyLinkedToProject,
  EDFContractUpdated,
  EDFFileUploaded,
} from '../events'

type SearchResult = {
  projectId: string
  score: number
}

type ContratEDF = {
  numero: string
  type: string
  dateEffet: string
  dateSignature: string
  duree: string
}

type SearchIndex = {
  findByNumeroContrat: (numeroContratEDF: string) => ({ projectId: string } & ContratEDF) | null
  search: (line: any) => SearchResult[]
}

interface ImportEdfDataDeps {
  publish: EventBus['publish']
  parseCsvFile: (fileId: string) => Promise<any[]>
  makeSearchIndex: () => Promise<SearchIndex>
}

export const AO_BY_CONTRACT = {
  FV16BCR: 'CRE4 - Bâtiment',
  FSI17OA: 'CRE4 - Innovation',
  FSI17CR: 'CRE4 - Innovation',
  FV16SCR: 'CRE4 - Sol',
  'AO3 PV+S': 'CRE4 - ZNI 2017',
  'AO 2019 PV': 'CRE4 - ZNI',
  FA16CR: 'CRE4 - Autoconsommation métropole 2016',
  FA17CR: 'CRE4 - Autoconsommation métropole',
  'AO AC1': 'CRE4 - ZNI 2017',
  'AO AC19': 'CRE4 - ZNI',
  FSF19OA: 'Fessenheim',
  FET: 'Eolien',
}

export const AO_CODES = new Set(Object.keys(AO_BY_CONTRACT))

export const makeImportEdfData =
  ({ publish, parseCsvFile, makeSearchIndex }: ImportEdfDataDeps) =>
  async (event: EDFFileUploaded): Promise<void> => {
    const {
      payload: { fileId },
    } = event

    const searchIndex = await makeSearchIndex()

    const lines = await parseCsvFile(fileId)

    // Filter by contract
    const linesGoodContract = lines.filter((line) => AO_CODES.has(line['Contrat - Type (code)']))

    for (const line of linesGoodContract) {
      // Try to find a match by numero contrat
      const contractDataFromLine = extractContractData(line)

      const projectForNumeroContrat = searchIndex.findByNumeroContrat(contractDataFromLine.numero)

      if (projectForNumeroContrat) {
        const { projectId, numero } = projectForNumeroContrat

        const changes = shallowDelta(projectForNumeroContrat, contractDataFromLine)

        // grab info for this contract
        if (changes) {
          await publish(
            new EDFContractUpdated({
              payload: {
                numero,
                projectId,
                ...changes,
              },
            })
          )
        }
        continue
      }

      const results = searchIndex.search(line)

      if (!results.length) {
        // emit EDFContractHasNoCandidates
        continue
      }

      if (results.length > 1) {
        // emit EDFContractHasMultipleCandidates
        continue
      }

      // only one match
      const { projectId, score } = results[0]
      const { type, dateSignature, dateEffet, duree, numero } = contractDataFromLine
      await publish(
        new EDFContractAutomaticallyLinkedToProject({
          payload: {
            projectId,
            score,
            type,
            numero,
            dateEffet,
            dateSignature,
            duree,
            rawValues: line,
          },
        })
      )
    }
  }

function extractContractData(line: Record<string, string>) {
  return {
    numero: line['Contrat - Numéro'],
    type: line['Contrat - Type (code)'],
    dateEffet: line["Contrat - Date d'effet"],
    dateSignature: line['Contrat - Date de signature'],
    duree: line['Contrat - Durée'],
  }
}
import { EDFContractUpdated, EDFFileUploaded } from '../events'
