import { EventBus } from '@core/domain'
import {
  ContratEnedisRapprochéAutomatiquement,
  ContratEnedisAvecPlusieursProjetsPossibles,
  ContratEnedisOrphelin,
  ContratEnedisMisAJour,
  ListingEnedisImporté,
} from '../events'

import { shallowDelta } from '../../../helpers/shallowDelta'

type SearchResult = {
  projectId: string
  score: number
}

export type ContratEnedis = {
  numero: string
}

export type SearchIndex = {
  findByNumeroContrat: (
    numeroContratEnedis: string
  ) => ({ projectId: string } & ContratEnedis) | null
  search: (line: any) => SearchResult[]
}

interface ImportEdfDataDeps {
  publish: EventBus['publish']
  parseCsvFile: (fileId: string) => Promise<any[]>
  getSearchIndex: () => Promise<SearchIndex>
}

export const makeImportEnedisData =
  ({ publish, parseCsvFile, getSearchIndex: makeSearchIndex }: ImportEdfDataDeps) =>
  async (event: ListingEnedisImporté): Promise<void> => {
    const {
      payload: { fileId },
    } = event

    const searchIndex = await makeSearchIndex()

    const lines = await parseCsvFile(fileId)

    // Filter by contract
    // const linesGoodContract = lines.filter((line) => AO_CODES.has(line['Contrat - Type (code)']))
    const linesGoodContract = lines

    for (const line of linesGoodContract) {
      // Try to find a match by numero contrat
      const contractDataFromLine = extractContractData(line)
      const { numero } = contractDataFromLine

      const projectForNumeroContrat = searchIndex.findByNumeroContrat(numero)

      if (projectForNumeroContrat) {
        const { projectId } = projectForNumeroContrat

        const changes = shallowDelta(projectForNumeroContrat, contractDataFromLine)

        // grab info for this contract
        if (changes) {
          await publish(
            new ContratEnedisMisAJour({
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
          new ContratEnedisOrphelin({
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
          new ContratEnedisAvecPlusieursProjetsPossibles({
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
        new ContratEnedisRapprochéAutomatiquement({
          payload: {
            projectId,
            score,
            numero,
            rawValues: line,
          },
        })
      )
    }
  }

function extractContractData(line: Record<string, string>) {
  return {
    numero: line['Contrat - Numéro'],
  }
}
