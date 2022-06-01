import { AO_BY_CONTRACT, SearchIndex } from '@modules/edf/useCases'
import MiniSearch from 'minisearch'
import models from '../../models'
const { Project } = models

export const getSearchIndex = async (): Promise<SearchIndex> => {
  const projects = await Project.findAll({
    attributes: [
      ...METADATA_FIELDS.filter((field) => field !== 'siret'),
      ...INDEXED_FIELDS,
      'details',
      'contratEDF',
    ],
  })

  const findByNumeroContrat: SearchIndex['findByNumeroContrat'] = (numeroContratEDF) => {
    const result = projects.find((project) => project.contratEDF?.numero === numeroContratEDF)

    if (!result) return null

    const { id, contratEDF } = result
    return {
      ...contratEDF,
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

  const indexedProjects = projects.filter((project) => !project.contratEDF)
  index.addAll(indexedProjects)

  const search: SearchIndex['search'] = (line) => {
    const matches: Record<string, Match> = {}

    searchInField({ term: line['Installation - Nom'], field: 'nomProjet', matches, index })
    searchInField({ term: line['Acteur - Titulaire - Nom'], field: 'nomCandidat', matches, index })
    searchInField({ term: line['Installation - Adresse1'], field: 'adresseProjet', matches, index })
    searchInField({ term: line['Installation - Commune'], field: 'communeProjet', matches, index })

    const puissance = Number(line["Pmax d'achat"].replace(',', '.')) / 1000
    const prixReference =
      Math.round(Number(line['Tarif de référence'].replace(',', '.')) * 10 * 100) / 100
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

      const ecartPrix = relativeDiff(match.prixReference, prixReference)
      if (ecartPrix <= 10) {
        const prixReferenceScore = 10 - ecartPrix
        match.score += prixReferenceScore
      }

      if (siret === match.siret) {
        match.score += 10
      } else if (siret.substring(0, 4) === match.siret?.substring(0, 4)) {
        match.score += 5
      }
    }

    return Object.values(matches)
      .filter((item: any) => item.appelOffreId === AO_BY_CONTRACT[line['Contrat - Type (code)']])
      .filter((item) => item.score > 20)
      .sort((a: any, b: any) => b.score - a.score)
      .reduce<Match[]>((shortList, item) => {
        if (!shortList.length) {
          // Top item
          return [item]
        }

        if (relativeDiff(item.score, shortList[0].score) < 50) {
          shortList.push(item)
        }

        return shortList
      }, [])
      .map(({ id, score }) => ({ projectId: id, score }))
  }

  return { findByNumeroContrat, search }
}

const INDEXED_FIELDS = ['nomProjet', 'nomCandidat', 'adresseProjet', 'communeProjet'] as const
type SearchableField = typeof INDEXED_FIELDS[number]

const METADATA_FIELDS = [
  'id',
  'codePostalProjet',
  'appelOffreId',
  'puissance',
  'prixReference',
  'siret',
] as const

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
}) {
  const { term, field, matches, index } = args
  const results = index.search(term, { fields: [field] })

  for (const result of results) {
    const { id, score } = result
    if (!matches[id]) {
      matches[id] = { id, score: 0 }

      for (const field of METADATA_FIELDS) {
        if (!matches[id][field]) matches[id][field] = result[field]
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
