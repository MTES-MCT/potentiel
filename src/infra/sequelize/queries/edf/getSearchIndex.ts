import MiniSearch from 'minisearch'
import { SearchIndex } from '@modules/edf/useCases'
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

  const search: SearchIndex['search'] = (line) => {
    return []
  }

  return { findByNumeroContrat, search }
}

const INDEXED_FIELDS = ['nomProjet', 'nomCandidat', 'adresseProjet', 'communeProjet'] as const

const METADATA_FIELDS = [
  'id',
  'codePostalProjet',
  'appelOffreId',
  'puissance',
  'prixReference',
  'siret',
] as const
