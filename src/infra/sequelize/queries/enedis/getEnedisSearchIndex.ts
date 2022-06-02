import { SearchIndex } from '@modules/enedis/useCases'
import MiniSearch from 'minisearch'
import models from '../../models'
const { Project } = models

export const getEnedisSearchIndex = async (): Promise<SearchIndex> => {
  const projects = await Project.findAll({
    attributes: [
      ...METADATA_FIELDS.filter((field) => field !== 'siret'),
      ...INDEXED_FIELDS,
      'details',
      'contratEnedis',
    ],
  })

  const findByNumeroContrat: SearchIndex['findByNumeroContrat'] = (numeroContratEnedis) => {
    const result = projects.find((project) => project.contratEnedis?.numero === numeroContratEnedis)

    if (!result) return null

    const { id, contratEnedis } = result
    return {
      ...contratEnedis,
      projectId: id,
    }
  }

  for (const project of projects) {
    project.siret = project.details?.['Numéro SIREN ou SIRET*']?.replace(/ /g, '').slice(0, 6)
  }

  const index = new MiniSearch({
    fields: [...INDEXED_FIELDS], // fields to index for full-text search
    storeFields: [...METADATA_FIELDS, ...INDEXED_FIELDS], // fields to return with search results
  })

  const indexedProjects = projects.filter((project) => !project.contratEnedis)
  index.addAll(indexedProjects)

  const search: SearchIndex['search'] = (line) => {
    const matches: Record<string, Match> = {}

    searchInField({ term: line['Installation - Nom'], field: 'nomProjet', matches, index })
    searchInField({ term: line['Acteur - Titulaire - Nom'], field: 'nomCandidat', matches, index })
    searchInField({
      term: line['Installation - Adresse1'],
      field: 'adresseProjet',
      matches,
      index,
      options: { fuzzy: 0.2 },
    })
    searchInField({ term: line['Installation - Commune'], field: 'communeProjet', matches, index })

    const puissance = Number(line["Pmax d'achat"].replace(',', '.')) / 1000
    const siret = line['Installation - Siret'].slice(0, 6)

    for (const match of Object.values(matches)) {
      if (line['Installation - Code Postal'] === match.codePostalProjet) {
        match.score += 10
      }

      const ecartPuissance = relativeDiff(match.puissance, puissance)
      if (ecartPuissance <= 10) {
        const puissanceScore = 10 - ecartPuissance
        match.score += puissanceScore
      }

      if (siret === match.siret) {
        match.score += 10
      } else if (siret.substring(0, 4) === match.siret?.substring(0, 4)) {
        match.score += 5
      }
    }

    return (
      Object.values(matches)
        // .filter((item) => item.score > 20)
        .sort((a: any, b: any) => b.score - a.score)
        .reduce<Match[]>((shortList, item) => {
          if (!shortList.length) {
            // Top item
            return [item]
          }

          if (relativeDiff(item.score, shortList[0].score) < 10) {
            shortList.push(item)
          }

          return shortList
        }, [])
        .map(({ id, score }) => ({ projectId: id, score }))
    )
  }

  return { findByNumeroContrat, search }
}

const INDEXED_FIELDS = ['nomProjet', 'nomCandidat', 'adresseProjet', 'communeProjet'] as const
type SearchableField = typeof INDEXED_FIELDS[number]

const METADATA_FIELDS = ['id', 'codePostalProjet', 'appelOffreId', 'puissance', 'siret'] as const

function relativeDiff(a, b) {
  return 100 * Math.abs((a - b) / ((a + b) / 2))
}

type Match = {
  id: string
  score: number
} & {
  [Key in SearchableField]?: {
    csv: string
    bdd: string
    score: number
  }
} & {
  [Key in typeof METADATA_FIELDS[number]]?: string
}

function searchInField(args: {
  term: string
  field: SearchableField
  matches: Record<string, Match>
  index: MiniSearch<any>
  options?: Parameters<MiniSearch['search']>[1]
}) {
  const { term, field, matches, index, options } = args
  const results = index.search(term, { fields: [field], ...options })

  for (const result of results) {
    const { id, score } = result
    if (!matches[id]) {
      matches[id] = {
        id,
        score: 0,
        db: [...METADATA_FIELDS, ...INDEXED_FIELDS].reduce(
          (res, field) => ({ ...res, [field]: result[field] }),
          {}
        ),
      }
    }

    matches[id].score += score
    matches[id][field] = {
      csv: term,
      bdd: result[field],
      score,
    }
  }
}
