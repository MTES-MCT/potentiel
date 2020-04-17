import makeListProjects from './listProjects'

import makeFakeProject from '../__tests__/fixtures/project'
import defaultPagination from '../__tests__/fixtures/pagination'

import { projectRepo } from '../dataAccess/inMemory'

const listProjects = makeListProjects({ projectRepo })

describe('listProjects use-case', () => {
  const fakeProjects = [
    makeFakeProject({
      id: '1',
      appelOffreId: 'appelOffre1',
      periodeId: 'periode1',
    }),
    makeFakeProject({
      id: '2',
      appelOffreId: 'appelOffre1',
      periodeId: 'periode2',
    }),
    makeFakeProject({
      id: '3',
      appelOffreId: 'appelOffre2',
      periodeId: 'periode1',
    }),
  ]

  beforeAll(async () => {
    await Promise.all(fakeProjects.map(projectRepo.insert))
  })

  it('should return all projects', async () => {
    expect.assertions(fakeProjects.length + 1)
    const foundProjects = await listProjects({ pagination: defaultPagination })

    expect(foundProjects.items).toHaveLength(fakeProjects.length)
    fakeProjects.forEach((fakeProject) => {
      expect(foundProjects.items).toContainEqual(
        expect.objectContaining(fakeProject)
      )
    })
  })

  it('should return all projects from given appelOffre', async () => {
    const foundProjects = await listProjects({
      appelOffreId: 'appelOffre1',
      pagination: defaultPagination,
    })

    expect(foundProjects.items).toHaveLength(2)
    expect(
      foundProjects.items.every(
        (project) => project.appelOffreId === 'appelOffre1'
      )
    ).toBeTruthy()
  })

  it('should return all projects from given appelOffre and periode', async () => {
    const foundProjects = await listProjects({
      appelOffreId: 'appelOffre1',
      periodeId: 'periode1',
      pagination: defaultPagination,
    })

    expect(foundProjects.items).toHaveLength(1)
    expect(foundProjects.items[0].appelOffreId).toEqual('appelOffre1')
    expect(foundProjects.items[0].periodeId).toEqual('periode1')
  })

  it('should ignore periode if appelOffre is not given', async () => {
    const foundProjects = await listProjects({
      periodeId: 'periode1',
      pagination: defaultPagination,
    })

    expect(foundProjects.items).toHaveLength(3)
  })
})
