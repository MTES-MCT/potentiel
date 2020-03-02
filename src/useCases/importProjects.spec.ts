import makeImportProjects from './importProjects'

import { makeProject } from '../entities'

import { projectRepo } from '../dataAccess/inMemory'

const importProjects = makeImportProjects({ projectRepo })

const phonyProjects = [
  makeProject({
    periode: '1',
    status: 'eliminé',
    nom: 'nom',
    nomCandidat: 'nom du candidat',
    localisation: 'quelque part',
    puissance: 10,
    prixUnitaire: 89
  }),
  makeProject({
    periode: '2',
    status: 'lauréat',
    nom: 'nom 2',
    nomCandidat: 'nom du candidat 2',
    localisation: 'ailleurs',
    puissance: 20,
    prixUnitaire: 50
  })
]

describe('importProjects use-case', () => {
  it('inserts all given projects to the store', async () => {
    const priorProjects = await projectRepo.findAll()

    expect(priorProjects).toHaveLength(0)

    await importProjects({ projects: phonyProjects })

    const newProjects = await projectRepo.findAll()

    expect(newProjects).toEqual(phonyProjects)
  })
})
