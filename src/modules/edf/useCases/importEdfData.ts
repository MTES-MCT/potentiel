import { EventBus } from '@core/domain'
import {
  EDFContractAutomaticallyLinkedToProject,
  EDFContractHasMultipleMatches,
  EDFContractHasNoMatch,
  ContratEDFMisAJour,
  EDFFileUploaded,
} from '../events'

import { shallowDelta } from '../../../helpers/shallowDelta'

type SearchResult = {
  projectId: string
  score: number
}

export type ContratEDF = {
  numero: string
  type: string
  dateEffet: string
  dateSignature: string
  dateMiseEnService: string
  duree: string
  statut: string
}

export type SearchIndex = {
  findByNumeroContrat: (numeroContratEDF: string) => ({ projectId: string } & ContratEDF) | null
  search: (line: any) => SearchResult[]
}

interface ImportEdfDataDeps {
  publish: EventBus['publish']
  parseCsvFile: (fileId: string) => Promise<any[]>
  getSearchIndex: () => Promise<SearchIndex>
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
  ({ publish, parseCsvFile, getSearchIndex: makeSearchIndex }: ImportEdfDataDeps) =>
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
      const { type, dateSignature, dateEffet, dateMiseEnService, duree, numero, statut } =
        contractDataFromLine

      const projectForNumeroContrat = searchIndex.findByNumeroContrat(numero)

      if (projectForNumeroContrat) {
        const { projectId } = projectForNumeroContrat

        const changes = shallowDelta(projectForNumeroContrat, contractDataFromLine)

        // grab info for this contract
        if (changes) {
          await publish(
            new ContratEDFMisAJour({
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

      const matches = searchIndex.search(line)

      if (!matches.length) {
        // no match
        await publish(
          new EDFContractHasNoMatch({
            payload: {
              numero,
              rawValues: line,
            },
          })
        )
        continue
      }

      if (matches.length > 1) {
        // multiple matches
        await publish(
          new EDFContractHasMultipleMatches({
            payload: {
              numero,
              matches,
              rawValues: line,
            },
          })
        )
        continue
      }

      // only one match
      const { projectId, score } = matches[0]
      await publish(
        new EDFContractAutomaticallyLinkedToProject({
          payload: {
            projectId,
            score,
            type,
            numero,
            dateEffet,
            dateSignature,
            dateMiseEnService,
            duree,
            statut,
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
    dateMiseEnService: line['Date de mise en service du raccordement'],
    duree: line['Contrat - Durée'],
    statut: line['Contrat - Statut (code)'],
  }
}
